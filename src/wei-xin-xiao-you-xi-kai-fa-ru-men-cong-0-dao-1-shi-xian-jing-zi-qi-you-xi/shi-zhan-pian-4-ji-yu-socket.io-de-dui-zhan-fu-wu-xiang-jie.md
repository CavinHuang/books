
# 实战篇 4-基于 Socket.IO 的对战服务详解
---

# 实战篇 4：基于Socket.IO的对战服务详解

在本节中我们会讲解服务器端的重要部分，以及微信小游戏平台提供给服务器端的部分 API 。所有展示的代码都以方便讲解为目的，进行了一定删改，与项目源码可能无法完全匹配，望读者知悉。

> 服务器端编程完全是另一个领域，要想熟练掌握，必须另外深入学习，但我们仍希望尽可能为读者讲解本项目的重要部分。注意项目中许多内容并非生产环境最佳实践，为了降低门槛，服务器的语言顺理成章选择了 Node.js ，服务器也使用了 Node.js 自带的 https 库而非 nginx、apache 等。有兴趣的读者可以通过更加专门的渠道学习服务器端开发的知识。

## 1\. [Socket.IO](http://Socket.IO) 简介

我们的后台通过 [Socket.IO](http://Socket.IO) 与小游戏端通讯，[Socket.IO](http://Socket.IO) 是一个集速度与可靠性于一体的实时双向通讯库。

有一种常见的误解，认为它是一个 WebSocket 的工具库，实际上 [Socket.IO](http://Socket.IO) 是独立于 WebSocket 的另一种协议，它可以基于其他多种协议如 HTTP 或 WebSocket 进行数据传输，它和 WebSocket 之间的关系就像是 HTTP 与 TCP 一样。因此读者不需要了解 WebSocket ，就可以开始学习 [Socket.IO](http://Socket.IO) ，而后者上手起来要简单很多。

要创建一个 [Socket.IO](http://Socket.IO) 服务器非常简单：

```
//=============
// 服务器端
//=============

// 使用 node.js 自带的 https 库创建一个 https 服务
const fs = require('fs')
const app = require('https').createServer({
  key: fs.readFileSync('./xxxx.key'),    // 之前下载的 ssl 私钥文件
  cert: fs.readFileSync('./xxxx.crt'),   // 之前下载的 ssl 证书文件
})

// 创建 socket.io 服务
const io = require('socket.io')(app)

// 监听 https 端口
app.listen(443)

// 有客户端连接服务器
io.on('connection', function (socket) {
  console.log('有一个客户端连接了服务器：', socket)
  // socket 代表该客户端的 socket.io 连接
})
```

服务器创建完成后，还需要小游戏端连接上来：

```
//=============
// 小游戏端
//=============

// 连接服务器
const io = require('./libs/socket.io.slim')
const socket = io('https://xxxx.xxx', {
  transports: ['websocket'],
})
```

连接成功后，服务器会打印 `有一个客户端连接了服务器：...` ，我们就可以开始通讯了：

```
//=============
// 小游戏端
//=============

socket.on('bar', function (payload) {
  // 4. 服务器收到 bar 消息
  console.log(payload)  // 打印 'world'
})

// 1. 向服务器发送 foo 消息，并且额外带上两个参数 'hello' 和一个函数
socket.emit('foo', 'hello', function (foo) {
  // **** 2 ****
  console.log(foo)
})

//=============
// 服务器端
//=============

io.on('connection', function (socket) {
  // 每个 socket 对象代表一个客户端连接

  socket.on('foo', function (payload, callback) {
    // 2. 服务器收到 foo 消息
    console.log(payload)  // 打印 'hello'
    callback('done')      // 此时 **** 2 **** 处的代码会执行
    // 3. 向小游戏发送 bar 消息
    socket.emit('bar', 'world')
  })
}
```

上面只是 [Socket.IO](http://Socket.IO) 最基本的用法，感兴趣的读者可以访问其[官网](https://socket.io/)进一步了解。

## 2\. 对战服务详解

在入口文件 `index.js` 中，我们首先和上面讲解的一样，创建了一个 [Socket.IO](http://Socket.IO) 服务器。然后监听了一系列小游戏端可能向服务器发送的消息：

```
socket
  .on('login', /* ... */)
  .on('create room', /* ... */)
  .on('join room', /* ... */)
  .on('ready', /* ... */)
  .on('place piece', /* ... */)
  .on('leave room', /* ... */)
```

而类似的，服务器端也会向小游戏发送一系列消息，下图展示了一次对战流程中的消息通讯过程：

![多人消息](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfdabfcf3742~tplv-t2oaga2asx-image.image)

### login（登录）

在小游戏端连接到服务器后，必须要首先发送 `login` 消息告知服务器自己的身份。

如果此前没有登陆过，或登录过期了。小游戏就需要调用 [`wx.login`](https://developers.weixin.qq.com/minigame/dev/api/open-api/login/wx.login.html) 拿到 code 与玩家信息（[`wx.getUserInfo`](https://developers.weixin.qq.com/minigame/dev/api/open-api/user-info/wx.getUserInfo.html)）一并发送到服务器。如果已经登陆过且未过期，则需要将登陆态发送到服务器。

> `wx.login` 登陆流程在本节“微信接口”部分有详细介绍。

```
.on('login', async (payload, cb) => {
  const player = await Players.login(payload)   // 调用其他 players.js 中的函数得到用户信息
  socket.playerId = player._id                  // 将玩家 ID 绑定到 socket 实例上，其他代码
                                                // 就会知道每个 socket 对应哪个玩家
  // ...
})
```

身份确认后，我们还需要为该玩家恢复此前加入的房间和未完成的游戏：

```
.on('login', async (payload, cb) => {
  const player = await Players.login(payload)
  socket.playerId = player._id

  let resumeData = {}

  // 恢复房间
  if (player.roomId) {                               // 如果玩家此前有加入的房间
    const join = promisify(socket.join).bind(socket) // 将 socket.join 接口转为 async await 形式
    await join(player.roomId)                        // 重新加入该房间
    const opponent = await Players.getOpponent(socket.playerId)            // 获得玩家的公开信息
    const opponentInfo = opponent && await Players.getPlayerInfo(opponent) // 获得对手的公开信息
    resumeData.room = {                              // 拼装恢复房间所需的数据
      roomId: player.roomId,
      roomOwner: player.roomOwner,
      opponent: opponentInfo,
    }
  }

  // 恢复游戏
  if (player.playing) {                                         // 如果有未完成的游戏
    const game = TicTacToe.getGame(player.roomId)               // 获得该游戏的信息
    resumeData.game = game && game.getInfoForPlayer(player._id) // 整理为发送给小游戏的格式
  }

  cb && cb('', {
    session: player.session, // 向小游戏端返回自定义登陆态
    resumeData,              // 恢复房间、游戏用的数据（若没有需要恢复的内容，则为 {} ）
  })
})
```

### create room（创建房间）

[Socket.IO](http://Socket.IO) 本身有房间的概念：

```
// 多个 socket 都加入同一个房间
socket1.join('room 1')
socket2.join('room 1')
socket3.join('room 1')

// 若服务器向房间 emit 消息
io.to('room 1').emit('hello', 'world')

// socket1 小游戏端会收到这一条消息
socket.on('hello', function (msg) {
  console.log(msg)   // 'world'
})
// socket2、socket3 也一样

// 特别的，如果服务器端使用如下方式发送消息
socket1.to('room 1').emit('hello', 'world')
// 则房间内其他 socket 会收到消息，socket1 本身不会收到
```

对于我们只有两个人的简单房间，已经够用了。但是还存在一个问题：[Socket.IO](http://Socket.IO) 每次重连都会退出房间。

所以我们需要在创建房间后将房间 ID 另外存起来，以供 [Socket.IO](http://Socket.IO) 重连时恢复房间。这里我们随机产生房间 ID 并保存到每个用户自己的数据库条目里。

> 数据库相关的操作都在 `players.js` 中，使用 `nedb` 库。

```
socket.on('create room', async cb => {
  let player = await Players.createRoom(socket.playerId)  // 创建随机房间 ID 写入数据库，当前玩家为房主
  const join = promisify(socket.join).bind(socket)        // 将回调形式的接口转为 async await 形式
  await join(player.roomId)                               // 调用 socket.join 加入 Socket.IO 房间
  cb && cb(player.roomId)                                 // 将房间 ID 返回小游戏，用于邀请好友加入
}
```

### join room（加入房间）

加入房间和创建房间一样，也需要将玩家的房间信息写入数据库。而且和随机匹配一样，也需要向两名玩家分别发送对手信息。

```
socket.on('join room', async (roomId, cb) => {
  await joinRoom(socket, roomId)                              // 将房间信息写入数据库
  const player = await Players.getPlayer(socket.playerId)     // 获得玩家实例
  const opponent = await Players.getOpponent(socket.playerId) // 获得对手的玩家示例
  const opponentInfo = opponent && await Players.getPlayerInfo(opponent) // 获得对手的公开信息
  cb && cb('', { roomId: roomId })                            // 告知调用方加入房间成功
  socket.emit('opponent joined', opponentInfo)                // 向双方发送对手公开信息
  socket.to(roomId).emit('opponent joined', await Players.getPlayerInfo(player))
})
```

### ready（准备）

我们约定，当一个房间内的两名玩家都发送了准备消息之后，游戏立即开始。准备情况同属房间信息，也要写入数据库。

```
socket.on('ready', async (cb) => {
  let player = await Players.getPlayer(socket.playerId)   // 获得玩家实例
  player = await Players.roomReady(socket.playerId)       // 将准备情况写入数据库
  const opponent = await Players.getOpponent(socket.playerId) // 获得对手实例

  socket.to(player.roomId).emit('opponent ready')         // 向对手发送"对手已准备"
  if (player.roomReady && opponent && opponent.roomReady) { // 如果双方都准备了
    const game = TicTacToe.createGame(player.roomId, [ player._id, opponent._id ])
                                                          // 创建游戏
    Players.gameStart(player._id)                         // 设置玩家游戏状态为开始
    Players.gameStart(opponent._id)                       // 设置对手游戏状态为开始
    game.start()                                          // 开始游戏，开始计时
  }
})
```

### place piece（落子）

当小游戏端收到回合开始的时候，应该发送 `place piece` 消息落子。

```
socket.on('place piece', async (col, row) => {
  let player = await Players.getPlayer(socket.playerId) // 获得玩家实例
  const game = TicTacToe.getGame(player.roomId)         // 获得所在游戏
  game.placePiece(col, row)                             // 在指定位置落子
})
```

### leave room（离开房间）

常见的退出房间需要处理退出、解散（房主退出）、逃跑等许多情况。我们制定了一个简单的版本，不允许逃跑的情况。

```
.on('leave room', async () => {
  // 拿到玩家和对手的数据与对应的 Socket 实例
  const player = await Players.getPlayer(socket.playerId)
  const opponent = await Players.getOpponent(socket.playerId)
  const sockets = await getSocketsInRoom(player.roomId)
  const socketPlayer = sockets.find(socket => socket.playerId === player._id)
  const socketOpponent = opponent && sockets.find(socket => socket.playerId === opponent._id)

  // 游戏中则销毁游戏
  if (player.roomId && !player.playing) {
    if (player.roomOwner) {
      // 房主退出
      socketPlayer.leave(player.roomId)
      Players.leaveRoom(player._id)
      opponent && Players.leaveRoom(opponent._id)
      socketOpponent && socketOpponent.emit('room dismissed').leave(player.roomId)
    } else {
      // 参与者退出
      socket.to(player.roomId).emit('opponent leaved').leave(player.roomId)  
      Players.leaveRoom(player._id)
    }
    cb && cb()
    return
  }
}
```

### 游戏生命周期

前面介绍的消息全都是服务器监听，小游戏端发送，那服务器怎么能在合适的时机发送消息给小游戏端呢（比如某个玩家超时输了，这个事件不是由用户触发的）。为了解决这个问题，我们给游戏加入了一组生命周期回调：

```
// 游戏开始事件
TicTacToe.onGameStart = async game => {
  // 告知双方游戏开始
  //...
}

// 游戏进入下一轮事件
TicTacToe.onNextRound = async (game, lastAction) => {
  // 告知轮到哪个玩家落子
  //...
}

// 游戏结束事件
TicTacToe.onGameOver = async (game, winner, lastAction) => {
  // 发送胜负消息
  //...
  // 上报战绩（后文“微信接口”讲解）
}
```

在每个游戏实例中，有一个 `update` 方法，用于更新本游戏的倒计时：

```
update (delta) {               // delta 是距离上一次调用过去的毫秒数
  if (!this.playing) return    // 本游戏没开始的话不更新
  this.countdowns[ this.currentPlayer ] -= delta    // 从当前玩家的倒计时中扣除过去的时间

  if (this.countdowns[ this.currentPlayer ] <= 0) { // 超时
    this._gameover(1 - this.currentPlayer)          // 对方获胜（会触发 TicTacToe.onGameOver 事件）
  }
}
```

我们再使用一个 `setInterval` 定时更新调用所有游戏的 `update` 方法：

```
// 使用一个定时器更新所有游戏实例
const gameMap = new Map()      // 创建游戏实例时会将新游戏加入 gameMap
let lastTimestamp = Date.now() // 存储上次调用时间
setInterval(() => {
  const now = Date.now()                      // 计算 delta
  const delta = now - lastTimestamp
  lastTimestamp = now
  gameMap.forEach(game => game.update(delta)) // 使用 delta 更新所有游戏的倒计时
}, 200)                                       // 不断更新
```

这样一来，服务器就可以在玩家超时的时候主动结束游戏，并发送消息给对战双方了。同时，游戏生命周期事件也方便了我们组织与游戏逻辑相关的代码。

## 3\. 微信接口使用

要想充分利用小游戏的生态，比如好友排行榜、群排行榜、游戏圈等功能，我们还需要用到微信提供的各种 API 。我们将服务器端用到的所有 API 都放在了 `weapi.js` 中。

### code2accessToken

服务器端为了识别用户身份，需要得到用户的 `openid` ，它是微信用户在本小游戏内唯一的身份标识。我们可以用 [code2accessToken](https://developers.weixin.qq.com/minigame/dev/document/open-api/login/code2accessToken.html) 接口来向微信获取。

```
/**
 * wx.login 登陆流程，使用 code 换取 session_key 与 openid
 * @param code
 * @return {Promise<void>}
 */
async function code2session (code) {
  const session = await request({
    uri: `https://api.weixin.qq.com/sns/jscode2session?appid=${config.appid}&secret=${config.secret}&js_code=${code}&grant_type=authorization_code`,
    json: true,
  })
  return session
}
```

该接口与小程序的登录其实基本一致，而小程序的文档中对此有[更加详细的解释](https://developers.weixin.qq.com/miniprogram/dev/api/api-login.html)。

![wx.login 流程图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfdabfd4a5b1~tplv-t2oaga2asx-image.image)

上图是微信文档中的时序图，能够很清晰的说明登录流程:

1.  小程序端调用 `wx.login()` 从微信处获得临时 code
2.  将 code 通过各种方式（并非必须 [`wx.request()`](https://developers.weixin.qq.com/minigame/dev/api/network/request/wx.request.html) ）发送给服务器端
3.  服务器端调用 `code2accessToken` 接口使用 code 换取用户的 `openid` 与 `session_key`
4.  `openid` 与 `session_key` 属于敏感数据，不应透露给小游戏端，因此服务器生成自定义登录态，并返回给小游戏端
5.  小游戏端保存自定义登录态。

我们的自定义登录态只是一个全局唯一的随机 id ，不自定义失效时间，而是跟随微信登录态。因此，客户端可以调用 [`wx.checkSession`](https://developers.weixin.qq.com/miniprogram/dev/api/signature.html#wxchecksessionobject) 检查微信登录态与自定义登录态是否过期，如果过期则重新执行 `wx.login` 这一套流程，重新生成自定义登录态。

> `wx.checkSession` 只需要在打开小游戏时检查一次即可，只要一开始登录态有效，则在本次生命周期内将一直保持有效。

### setUserStorage, accessToken

每次游戏结束后，服务器端需要判断胜负并上报成绩，需要使用 [setUserStorage](https://developers.weixin.qq.com/minigame/dev/document/open-api/data/setUserStorage.html) 接口。而调用 `setUserStorage` 需要用到上文的 `session_key` 与 [`access_token`](https://developers.weixin.qq.com/miniprogram/dev/api/token.html#%E8%8E%B7%E5%8F%96-access_token) 。

`access_token` 是服务器端调用微信 API 的凭证，获取它的接口有每日调用次数限制，且每次调用都会使上次获得的 token 失效。因此需要在一个位置维护它，并定期更新，避免无节制的调用。目前 `access_token` 的过期时间是 7200 秒也即两小时：

```
let tokenRefreshTimeout
let token

/**
 * 调用以主动刷新 access token
 */
async function accessToken () {
  try {
    clearTimeout(tokenRefreshTimeout)
    const res = await request({
      uri: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`,
      json: true,
    })
    if (res.errcode) throw res

    // 提前 200 秒定时刷新 access_token
    // 200 秒并没有特殊意义，可以酌情修改
    tokenRefreshTimeout = setTimeout(accessToken, (res.expires_in - 200) * 1000)
    token = res.access_token
  } catch (e) {
    console.error('access token 获取失败： ', e)
    tokenRefreshTimeout = setTimeout(accessToken, 60 * 1000)    // 1分钟后重试
  }
}

accessToken()   // 初始化时请求一次，其他位置也可以主动调用以立即刷新 token
```

首次调用 `accessToken()` 后，`setTimeout` 会保持一个频率继续刷新 `access_token` 。程序的其他部分也可以主动调用 `accessToken()` 以使下一次刷新提前进行。

`setUserStorage` 接口要求对上报的数据进行签名才能调用，拿到 `access_token` 后，我们还需要准备 `hmac_sha256` 签名算法， node.js 内置的 `crypto` 库提供了这部分功能：

```
const crypto = require('crypto')

const hmac_sha256 = (sessionKey, data) => {
  return crypto
    .createHmac('sha256', sessionKey)
    .update(data || '')
    .digest('hex')
}
```

`setUserStorage` 需要传入 `kv_list` 参数指定上传数据，文档对这个参数的结构没有描述清楚，但在示例代码中有正确的形式可以参考：

```
curl - d '{ "kv_list":[{"key":"score","value":"100"},{"key":"gold","value":"3000"}] }'
'https://api.weixin.qq.com/wxa/set_user_storage?access_token=ACCESS_TOKEN&signature=SIGNATURE&openid=OPENID&sig_method=SIG_METHOD'
```

形式有些繁琐，我们可以编写一个工具函数来帮助转换：

```
/*
  {
    key1: 'value1',
    key2: 'value2',
  }

  转换为

  {
    kv_list: [
      {
        key: 'key1',
        value: 'value1',
      },
      {
        key: 'key2',
        value: 'value2',
      }
    ]
  }
*/

const object2KVDataList = (o) => {
  let result = []
  Object.keys(o).forEach( key => {
    result.push({
      key: key,
      value: JSON.stringify(o[key])
    })
  })
  return {
    kv_list: result
  }
}
```

至此我们就拥有了调用 `setUserStorage` 接口的所有条件，调用本身则是一次简单的 http 请求：

```
/**
 * 上报用户数据
 * @param player
 * @param kv
 * @return {Promise<void>}
 */
async function setUserStorage (player, kv) {
  const kvList = object2KVDataList(kv)
  const postData = JSON.stringify(kvList)
  const res = await request({
    uri: `https://api.weixin.qq.com/wxa/set_user_storage?access_token=${token}&signature=${hmac_sha256(player.sessionKey, postData)}&openid=${player.openId}&sig_method=hmac_sha256`,
    method: 'POST',
    body: kvList,
    json: true,
  })
  return res
}
```

## 4\. 小结

本节讲解了井字大作战服务器端的部分内容，包括 [Socket.IO](http://Socket.IO) 的基本用法、服务器与小游戏端的协议以及一些微信接口的使用。

通过阅读本节，读者应该能够将服务器端项目在腾讯云服务器上运行起来，并且对各个组成部分有了一些初步的了解，但要熟悉服务器开发仍需更加深入的学习。有兴趣的读者可以思考以下问题：

1.  为什么 [Nginx](https://www.nginx.com/)、[Apache](https://httpd.apache.org/) 等服务器比 Node.js 自带 https 库更适合生产环境？
2.  使用 WebSocket 相对 HTTPS API 有什么好处，又有什么不足？
3.  哪些因素可能限制了我们的同时在线用户数量？超出预期用户量了怎样提升？

对于个人开发者，同时精通项目的每一个部分通常不太现实。因此还可以考虑使用各类针对小游戏的服务简化服务器开发。微信团队与腾讯云共同研发的[小程序云](https://developers.weixin.qq.com/minigame/dev/wxcloud/basis/getting-started.html)服务，可以让开发者使用云开发开发微信小程序、小游戏，无需搭建服务器，即可使用云端能力。目前正在公测阶段，感兴趣的读者可以体验并关注后续动向。
    