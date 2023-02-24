
# 实战篇 5-对战游戏实现
---

# 实战篇 5：对战游戏实现

前两节中我们申请了腾讯云服务器以及域名，部署了自己的对战服务器，也对服务器开发有了一些简单的理解。这一节里我们再次回到小游戏端，利用前面部署的服务器，向玩家提供好友对战功能。

## 1\. 连接服务器

我们的服务器使用 [Socket.IO](http://Socket.IO) 搭建，我们的客户端需要使用它的 SDK 才可以与服务器顺利通讯。 由于微信小游戏运行环境特殊，缺少一些标准接口，我们需要使用为其特别修改过的 SDK 。请从小册代码库中复制 [`mgame/js/libs/socket.io.slim.js`](https://github.com/o2team/tictactoe-sample/blob/master/mgame/js/libs/socket.io.slim.js) 文件到读者自己项目的对应目录。

> SDK 的适配工作建立于 [mdluo/socket.io-client-mp](https://github.com/leiyanggz/socket.io-client-mp) 与 [leiyanggz/socket.io-client-mp](https://github.com/leiyanggz/socket.io-client-mp) 两个项目的基础之上，并针对小游戏与小程序 API 之间的细微差距稍作修改。

我们决定把与服务器相关的内容整理到同一个文件里，创建 `js/server.js` 并编辑：

```
/**
 * 服务器相关
 */

// 引入 Socket.IO SDK
const SocketIO = require('./libs/socket.io.slim.js')

/**
 * 使用 session 登录，自动用 code 作为后备
 */
function loginWithSession(callback) {
  // 取出登录态
  const session = wx.getStorageSync('session')
  if (!session) {
    // 没有登录态则使用 wx.login 流程登录
    loginWithCode(callback)
    return
  }

  // 准备 login 消息所需信息
  const payload = {
    playerInfo: go.userInfo,  // 用户基本信息
    session,                  // 登录态
  }
  go.server.socket.emit('login', payload, (err, res) => {
    if (err) {
      // 若通过登录态登录失败，尝试通过 wx.login 流程登录
      loginWithCode(callback)
      return
    }
    // 调用登录成功回调
    callback(res)
  })
}

/**
 * 使用 code 登录
 */
function loginWithCode(callback) {
  // 调用 wx.login 获取 code
  wx.login({
    success: (res) => {
      // 准备 login 消息所需信息
      const payload = {
        playerInfo: go.userInfo,  // 玩家基本信息
        code: res.code,           // 服务器向微信获取登录态所需的 code
      }
      go.server.socket.emit('login', payload, (err, res) => {
        // 登录失败
        if (err) {
          wx.showToast({
            title: '登录失败',
          })
          return
        }
        // 保存服务器返回的登录态 
        wx.setStorageSync('session', res.session)
        // 调用登录成功回调
        callback(res)
      })
    }
  })
}

/**
 * 初始化 socketio
 */
function initSocket() {
  // 连接 Socket.IO 服务器
  // 注意修改这里为上一节中你部署的服务器地址
  go.server.socket = SocketIO('https://your.domain.name', {
    transports: ['websocket'],
  })

  // 小游戏进入后台，断开连接
  wx.offShow(() => {
    go.server.socket.disconnect()
  })
  // 小游戏回到前台，连接服务器
  wx.onShow(() => {
    go.server.socket.connect()
  })

  // 连接/重连事件
  go.server.socket.on('connect', () => {
    // 连接服务器成功，准备 login 消息的回调
    const callback = (res) => {
      // login 成功后，服务器会返回用于恢复游戏的数据
      // 我们触发一个 'game resume' 事件并附上恢复数据以便其他地方使用
      emitter.emit('game resume', res.resumeData)
    }
    // 根据微信登录态的有效性决定登陆方式
    wx.checkSession({
      success: () => {
        // 登录态有效，使用登录态
        loginWithSession(callback)
      },
      fail: () => {
        // 登录态过期，重新走 wx.login 流程
        loginWithCode(callback)
      }
    })
  })
}

/**
 * 一个简单的 Emitter 实现，接口：on、once、emit
 */
function makeEmitter() {
  const events = []
  return {
    on: (event, fn) => events.push({ event, fn }),
    once: (event, fn) => events.push({ event, fn, once: true }),
    off: (event, fn) => events.splice(events.find(
      ev => event === ev.event && ev.fn === fn
    ) - 1, 1),
    emit: (event, ...args) => events.filter(ev => event === ev.event).forEach(ev => {
      ev.fn.apply(null, args)
      ev.once && events.splice(events.indexOf(ev), 1)
    }),
    events
  }
}
const emitter = makeEmitter()

module.exports = {
  socket: null,
  initSocket,

  on: emitter.on,
  once: emitter.once,
  off: emitter.off,
}
```

`server.js` 中新添加的内容分了三个部分：

1.  `initSocket` ，连接到服务器并登陆。
2.  `loginWithSession` 与 `loginWithCode` ，用于发送 login 消息。
3.  `makeEmitter` ，一个简单的 Emitter 实现，on 和 once 用于监听事件，emit 用于触发事件。

其中 `makeEmitter` 读者并不需要关心，[Socket.IO](http://Socket.IO) SDK 的基本使用与服务器端没什么区别，`wx.login` 与 `wx.checkSession` 的使用与登陆流程在上一节也有讲解，有需要的读者可以翻回去参考以帮助理解。

> 注意请将 initSocket 方法开头的服务器地址修改为你实际的地址。

现在我们只需要在合适的时机调用 `initSocket` 连接到服务器即可。“开始游戏”按钮的点击事件似乎是个不错的选择，编辑 `js/states/start.js` 中的 `create` 方法：

```
create() {
  this.game.add.image(0, 0, 'bg_menu');
  const startBtn = addStartBtn((userInfo) => {
    startBtn.destroy()
    go.userInfo = userInfo
    if (go.userInfo.avatarUrl !== '') {
      this.load.image(go.userInfo.avatarUrl, go.userInfo.avatarUrl)
      this.load.start()
    }

    // 处理 'game resume' 事件（没有需要恢复的数据也会触发）
    go.server.once('game resume', (resumeData) => {
      if (resumeData.room) {
        // 有房间/游戏数据，进行状态恢复
        console.log('正在恢复房间/游戏...', resumeData)
      } else {
        // 没有房间/游戏数据，直接跳转主菜单场景
        this.game.state.start('menu')
      }
    })
    // 连接服务器
    go.server.initSocket()
  })
}
```

现在点击“开始游戏”，调试器会提示我们 `... 不在以下 socket 合法域名列表中 ...` 这是因为小游戏平台由于各方面考虑限制了我们能够访问的域名。为调试方便，我们可以点击微信开发者工具右上角“详情”，然后勾选“项目设置”下的“不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书”选项。

![不校验合法域名](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d76616146f20d~tplv-t2oaga2asx-image.image)

> 若读者跟随上一节末尾成功设置了信任域名，则不会遇到这条报错，可以跳过。

再次点击“开始游戏”，成功进入主菜单，这说明我们登陆成功了，并且在服务器上没有进行中的房间或游戏。

## 2\. 实现对战

接下来我们要实现好友约战的流程，步骤如下：

1.  点击“好友约战”按钮后，创建房间准备游戏并分享给好友
2.  跳转“等待对手”场景，等待对战开始
3.  好友点击游戏卡片，打开小游戏
4.  好友加入房间并准备游戏，等待对战开始
5.  服务器发送 “game start” 消息，双方跳转对战场景

模拟器无法进行分享操作，这一部分读者可能需要两部真机才能顺利测试。点击微信开发者工具上面的“预览”按钮就可以上传并生成用于测试的二维码，微信扫码后即可进行调试。

如果微信提示“暂无体验权限”，说明读者需要将这个微信号设置为开发者，打开小游戏管理页面，进入“用户身份”进行设置：

![添加体验用户1](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d7661615b93c9~tplv-t2oaga2asx-image.image)

点击添加成员

![添加体验用户2](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d76616167061a~tplv-t2oaga2asx-image.image)

添加想要加为体验者的微信号，并勾选“体验者权限”，点击“确认添加”并扫码即可。

对于没有使用正式服务器域名而无法连接服务器的读者，点击小游戏右上角的选项按钮（三个点），点击“打开调试”并重启小游戏即可。这个选项同时会打开 vConsole 工具，让读者在真机调试时也能查看控制台输出。

### 2.1 点击“好友约战”按钮后，创建房间准备游戏并分享给好友

编辑 `js/states/menu.js` ，将“好友对战”的回调函数 `battle` 改为：

```
function battle() {
  go.server.createRoom((roomId) => {
    // 创建房间成功，准备游戏
    go.server.ready()

    // 发出带有房间 ID 的邀请消息
    // 我们可以在 query 中带上房间 ID 这类附加信息
    // [文档](https://developers.weixin.qq.com/minigame/dev/document/share/wx.shareAppMessage.html)
    wx.shareAppMessage({
      title: '让我们来一场紧张刺激而又健康益智的井字大作战吧！',
      query: `roomId=${roomId}`
    })

    // 跳转等待对手场景
    go.game.state.start('waiting')
  })
}
```

接下来我们实现 `go.server.createRoom` ，实际上这一整组函数非常类似，我们可以把它们一起添加进去，编辑 `js/server.js` ，在 `require('./libs/socket.io.slim.js')` 下面添加下面的代码：

```
const SocketIO = require('./libs/socket.io.slim.js')

/**
 * 创建房间
 */
function createRoom(cb) {
  go.server.socket.emit('create room', cb)
}

/**
 * 加入房间
 */
function joinRoom(roomId, cb) {
  go.server.socket.emit('join room', roomId, cb)
}

/**
 * 离开房间
 */
function leaveRoom(cb) {
  go.server.socket.emit('leave room', cb)
}

/**
 * 准备游戏
 */
function ready(cb) {
  go.server.socket.emit('ready', cb)
}

/**
 * 落子
 */
function placePiece(col, row) {
  go.server.socket.emit('place piece', col, row)
}

// ...

module.exports = {
  socket: null,
  initSocket,
  on: emitter.on,
  once: emitter.once,
  off: emitter.off,

  // 别忘了 export
  createRoom,
  joinRoom,
  leaveRoom,
  ready,
  placePiece,
}
```

> 练习：这一组函数太相似了！你能消除这些重复么？注意它们各自接收的参数数量并不相同， [Function.prototype.apply\(\)](http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) 应该能够帮你解决这个问题。

点击“好友约战”，调试器提示没有 waiting 场景，接下来我们就来实现它。

#### 2.2 跳转“等待对手”场景，等待对战开始

创建 `js/states/waiting.js` 并编辑：

```
/**
 * 等待对手界面（仅创建房间者有此步骤）
 */

/**
 * 取消对战按钮的回调函数
 */
function cancelBattle() {
  go.server.leaveRoom(() => {
    // 离开房间成功后跳转主菜单场景
    go.game.state.start('menu')
  })
}

class Waiting extends Phaser.State {
  create() {
    // 绘制背景
    this.add.image(0, 0, 'bg_waiting')

    // 绘制玩家头像
    go.common.addAvatar({
      x: 115,
      y: 816,
      avatarKey: go.userInfo.avatarUrl || 'avatar_unknow',
      size: 168
    })

    // 创建取消对战按钮
    go.common.addBtn({
      x: 248,
      y: 700,
      text: '取消对战',
      callback: cancelBattle,
    })

    // 等待对手加入房间，once 方式注册的监听器只会被触发一次就自动取消
    go.server.once('opponent joined', (opponent) => {
      // 将对手的基本信息保存到 global object
      go.opponentInfo = opponent
    })

    // 等待游戏开始
    go.server.once('game start', (game) => {
      // 将对战初始状态保存到 global object
      go.battle = game
      // 跳转对战场景
      this.game.state.start('battle')
    })
  }
}

module.exports = Waiting
```

另外，别忘了在 `game.js` 中注册该场景：`game.state.add('waiting', require('./js/states/waiting'))` 。

在“等待对手”场景中，我们监听了两个事件 `opponent joined` 与 `game start` ，用于在对手加入时保存其基本信息，在游戏开始时保存游戏初始状态，并跳转对战场景。

现在我们来实现这两个事件，编辑 `js/server.js` 修改 `initSocket` 函数：

```
/**
 * 初始化 socketio
 */
function initSocket() {
  go.server.socket = SocketIO(CONFIG.server, { /* ... */ })
  go.server.socket.on('connect', () => {/* ... */})

  // 对手加入
  go.server.socket.on('opponent joined', playerInfo => {
    console.log('>>>>>> 收到 opponent joined 消息：', playerInfo)
    emitter.emit('opponent joined', playerInfo)
  })

  // 游戏开始
  go.server.socket.on('game start', (game) => {
    console.log('>>>>>> 收到 game start 消息：', game)
    emitter.emit('game start', game)
  })

  // 轮到玩家落子
  go.server.socket.on('your turn', (game) => {
    console.log('>>>>>> 收到 your turn 消息：', game)
    emitter.emit('your turn', game)
  })

  // 游戏结束
  go.server.socket.on('game over', (game) => {
    console.log('>>>>>> 收到 game over 消息：', game)
    emitter.emit('game over', game)
  })
}
```

我们在收到服务器发送的各种消息时，使用 `emitter.emit` 转发，程序的其他地方就可以使用 `go.server.on` 或 `go.server.once` 进行监听。

此时，如果我们运行游戏，点击开始，会看到只有一个背景图的场景（如果没出现，就点击一次“好友约战“再重新编译运行小游戏），并且调试器提示 `正在恢复房间/游戏... {room: {…}}` 。这是因为我们已经创建了房间，但没有处理服务器的恢复游戏数据。让我们回到 `js/states/start.js` 的 `console.log('正在恢复房间/游戏...', resumeData)` 这一行，将其编辑为：

```
// 准备恢复数据
go.server.once('game resume', (resumeData) => {
  if (resumeData.room) {
    // 有房间数据，跳转等待对手界面
    go.game.state.start('waiting')
  } else {
    // ...
  }
})
```

这样，在登陆成功并且有进行中的房间，就会直接跳转到等待对手场景。

![等待对手](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d7661615ec48e~tplv-t2oaga2asx-image.image)

现在点击“取消对战”，场景跳转回主菜单。点击“编译”再次重启游戏，点击“开始游戏”。这次正常进入主菜单，说明我们的“取消对战”功能也正常工作了。

### 2.3 好友点击游戏卡片，打开小游戏

好友点击对话卡片就会打开我们的小游戏，但是我们如何得知附带的房间 ID 呢？答案是 [`wx.onShow`](https://developers.weixin.qq.com/minigame/dev/document/system/life-cycle/wx.onShow.html) 与 [`wx.getLaunchOptionSync`](https://developers.weixin.qq.com/minigame/dev/document/system/life-cycle/wx.getLaunchOptionsSync.html) 。

其中 `wx.getLaunchOptionSync` 是在小游戏因为点击卡片而启动的情况下，获取卡片附带信息的途径。而 `wx.onShow` 是在小游戏已经启动但在后台运行，因为点击卡片而被拉到前台的情况下，获取卡片附带信息的途径。听起来有些绕口，让我们结合代码来梳理一下。编辑 `js/states/start.js` 的 `Start` 类：

```
class Start extends Phaser.State {
  constructor() {
    super()
    // handleOnShow 会被作为回调函数，因此要 bind this 以保证方法内 this 指向不丢失
    this.handleOnShow = this.handleOnShow.bind(this)
  }

  /**
   * wx.onShow 的回调函数
   */
  handleOnShow({ query }) {
    // 游戏恢复前台，检查是否是由于点击带有房间 ID 的消息卡片导致
    if (query && query.roomId) {
      // 是的话就把房间 ID 保存到 global object
      // 真正的加入房间要在点击开始按钮之后进行
      go.launchRoomId = query.roomId
    }
  }

  preload() { /* ... */ }

  create() {
    // 从启动参数获取需要加入的房间 Id
    go.launchRoomId = wx.getLaunchOptionsSync().query.roomId
    // 并监听 wx.onShow ，以处理用户在点击“开始游戏”之前
    // 最小化小游戏，又点击另一游戏卡片，导致房间 ID 变化的情况
    wx.onShow(this.handleOnShow)

    // ...
  }

  // 在离开 start 场景的时候
  shutdown() {
    // 停止监听 wx.onShow
    wx.offShow(this.handleOnShow)
  }
}
```

### 2.4 好友加入房间并准备游戏，等待对战开始

在 start 场景中，我们并没有处理加入房间的逻辑，只是使用两个 API 获取房间 ID 并保存，在主菜单场景中才真正加入房间。编辑 `js/states/menu.js` ：

```
// ...

class Menu extends Phaser.State {
  constructor () {
    super()
    this.handleOnShow = this.handleOnShow.bind(this)
    this.handleGameStart = this.handleGameStart.bind(this)
  }
  
  /**
   * wx.onShow 的回调
   */
  handleOnShow({query}) {
    // 游戏恢复前台
    if (query && query.roomId) {
      // 若是通过点击附带房间信息的卡片恢复前台，则加入该房间
      go.launchRoomId = query.roomId
      // 检查 socket io 连接状态
      if (go.server.socket.connected) {
        // 若连接正常，加入房间
        this.joinRoom()
      } else {
        // 否则确保在重连成功后加入房间
        go.server.once('game resume', () => {
          this.joinRoom()
        })
      }
    }
  }

  /**
   * game start 事件回调
   */
  handleGameStart(game) {
    // 游戏开始，保存对战状态
    go.battle = game
    // 跳转对战场景
    this.game.state.start('battle')
  }

  /**
   * 加入房间（go.launchRoomId 指定的房间 ID）
   */
  joinRoom() {
    // 监听游戏开始事件
    go.server.once('game start', this.handleGameStart)
    // 加入 go.launchRoomId 制定的游戏房间
    go.server.joinRoom(go.launchRoomId, (err, res) => {
      if (err) {
        // 加入失败则不再监听游戏开始
        go.server.off('game start', this.handleGameStart)
        return
      }
      // 准备游戏（双方都准备后，服务器就会发出 game start 消息）
      go.server.ready()
      // 保存对手基本信息
      go.opponentInfo = res.opponent
    })
    // 清空 launchRoomId 避免多次加入
    go.launchRoomId = null
  }

  create() {
    // 背景图
    this.add.image(0, 0, 'bg_menu')
    
    if (go.launchRoomId) {
      // 有 go.launchRoomId ，说明是从邀请游戏卡片启动/唤起游戏，则加入该房间
      this.joinRoom()
    } else {
      // 否则显示主菜单
      // 但仍监听 onShow 事件，以允许用户最小化小游戏后通过点击邀请卡片加入房间
      wx.onShow(this.handleOnShow)
      // 显示主菜单
      addMenu()
    }
  }

  // 离开场景后
  shutdown() {
    // 停止监听 onShow
    wx.offShow(this.handleOnShow)
    // 停止监听 game start
    go.server.off('game start', this.handleGameStart)
  }
}
```

读者现在可以拿出真机扫码测试，记得预先打开调试选项。用一台手机点击“好友约战”并分享给另一台，另一台点击卡片打开游戏后再点击“开始游戏”，此时在 vConsole 中可以看到双方都收到了 `game start` 事件，等待 60 秒后收到 `game over` 事件。（因为先手一方一直没有落子超时了）

同时还有提示 `No state found with the key: battle` ，那是我们接下来要实现的对战场景。

### 2.5 服务器发送 “game start” 消息，双方跳转对战场景

在上一部分的结尾，对战双方都收到了 `game start` 消息，这表示它们都已经做好了进入对战场景的准备。这次我们会一次性给出 `js/states/battle.js` 的完整代码，不再逐渐补充。这是因为它与 `js/state/practice.js` 结构很相似，而其中出现的各种模式我们也都曾经见过。代码后面会讲解它各个组成部分，读者可以参考着进行理解。创建并编辑 `js/states/battle.js` ：

```
/**
 * 好友对战
 */

function over(result) {
  go.common.showResult({
    result,
    meName: go.userInfo.nickName,
    meAvatar: go.userInfo.avatarUrl || 'avatar_unknow',
    opponentName: go.opponentInfo.nickName,
    opponentAvatar: go.opponentInfo.avatarUrl || 'avatar_unknow',
    callback: () => {
      go.game.state.start('menu')
    }
  })
}

class Battle extends Phaser.State {
  constructor() {
    super()
    this.handleMyTurn = this.handleMyTurn.bind(this)
    this.handleGameOver = this.handleGameOver.bind(this)
    this.handleResume = this.handleResume.bind(this)
  }

  /**
   * 画背景、玩家信息
   */
  renderInfo() {
    this.add.image(0, 0, 'bg_playing')
    const renderCD = go.common.addBattleInfo({
      meAvatar: go.userInfo.avatarUrl || 'avatar_unknow',
      meName: go.userInfo.nickName,
      opponentAvatar: go.opponentInfo.avatarUrl || 'avatar_unknow',
      opponentName: go.opponentInfo.nickName,
    })

    // 更新 CD 并重绘
    let last = Date.now()
    const cdintervalId = setInterval(() => {
      const current = Date.now()
      const delta = current - last
      last = current
      const updatedCD = go.battle.countdowns[go.battle.currentPlayer] - delta
      go.battle.countdowns[go.battle.currentPlayer] = updatedCD > 0 ? updatedCD : 0
      renderCD(go.battle.countdowns[0], go.battle.countdowns[1])
    }, 500)
    this.stopCountdown = () => clearInterval(cdintervalId)
  }

  /**
   * 初始化棋盘
   */
  initBoard() {
    this.setPiece = go.common.addPieces((row, col) => {
      // 玩家落子
      if (go.battle.currentPlayer !== 0) return
      // 修改执子玩家为对手
      go.battle.currentPlayer = 1
      // 更新棋盘状态
      go.battle.board[row][col] = 0
      // 渲染棋盘
      this.renderBoard()
      // 向服务器发送落子消息
      go.server.placePiece(row, col)
    })
  }

  /**
   * 渲染棋盘
   */
  renderBoard() {
    // 将 go.battle.board 所代表的棋盘状态使用 this.setPiece 同步到界面上
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        this.setPiece(row, col, go.battle.board[row][col])
      }
    }
  }

  /**
   * 处理“轮到玩家落子”消息
   */
  handleMyTurn(game) {
    // 更新棋盘状态
    go.battle = game
    // 渲染最新的棋盘
    this.renderBoard()
    // 提醒玩家落子
    wx.showToast({
      title: '你的回合',
    })
  }

  /**
   * 处理“游戏结束”消息
   */
  handleGameOver(game) {
    // 停止倒计时
    this.stopCountdown()
    // 更新并渲染棋盘
    go.battle = game
    this.renderBoard()
    // 显示游戏结果蒙层
    over(game.result)
  }

  /**
   * 处理恢复游戏状态消息
   */
  handleResume(resumeData) {
    if (!resumeData.game) {
      this.game.state.start('menu')
      return
    }

    go.battle = resumeData.game
    this.renderBoard()
  }

  /**
   * Phaser 用于预加载的生命周期
   */
  preload() {
    // 若对手有头像地址且头像并未预加载
    const hasAvatar = go.opponentInfo.avatarUrl !== ''
    const avatarNotLoaded = !this.game.cache.checkImageKey(go.opponentInfo.avatarUrl)
    if (hasAvatar && avatarNotLoaded) {
      // 则进行预加载
      this.load.image(go.opponentInfo.avatarUrl, go.opponentInfo.avatarUrl)
    }
  }

  create() {
    // 渲染对战双方信息
    this.renderInfo()
    // 初始化棋盘
    this.initBoard()
    // 根据 go.battle.board 渲染棋盘
    this.renderBoard()

    // 处理重连消息
    go.server.on('game resume', this.handleResume)

    // 处理我的回合消息
    go.server.on('your turn', this.handleMyTurn)

    // 处理游戏结束消息
    go.server.once('game over', this.handleGameOver)
  }

  /**
   * 离开对战场景时
   */
  shutdown() {
    // 停止倒计时
    this.stopCountdown()
    // 停止监听一系列消息
    go.server.off('game resume', this.handleResume)
    go.server.off('your turn', this.handleMyTurn)
    go.server.off('game over', this.handleGameOver)
    // 清空 go 中关于本次对局的状态
    go.battle = null
  }
}

module.exports = Battle
```

之前有认真看过单人场景 `practice.js` 的应该会发现，它们非常相似。实际上从外观看这两个场景是完全一样的，它们用了同样一组 `go.common` 函数来绘制界面。但对战场景少了游戏逻辑、多了断线重连。这是因为进行好友对战时，我们的游戏逻辑是在服务器运行的，最终胜负判断也是在服务器。小游戏端不需要进行胜负判断，只是负责采集用户的落子行为，并把服务器返回的对战情况显示出来。

虽说没了对战逻辑，但是多人对战存在另一个问题——断线重连。我们的对战场景要能还原战局任何一个瞬间的状态，为了保证这一点，服务器会在断线重连时将完整的对局数据返回给小游戏端，也就是前文中我们见到过的 `resumeData` 。我们在收到恢复数据后，不止会更新变动的内容，而是调用 `renderBoard` 重新绘制整个棋盘保证对局状态一致。还有一种情况是，重连成功时游戏已经结束，则直接退回主菜单。相关部分代码：

```
/**
 * 处理恢复游戏状态消息
 */
handleResume(resumeData) {
  if (!resumeData.game) {
    // 恢复数据中没有正在进行的对局，就回到主菜单
    this.game.state.start('menu')
    return
  }

  // 否则更新对局数据，并重渲染棋盘
  go.battle = resumeData.game
  this.renderBoard()
}
```

到这里一切操作正常的话，我们就可以真正体验一把好友对战的井字大作战啦！

## 3\. 小结

这一节中，我们了解了 [Socket.IO](http://Socket.IO) SDK 的基本使用，`wx.login` 登陆机制与其他一些微信小游戏 API 的使用，还解决了一个联网游戏特有的问题。小游戏依托微信平台，天生就带有社交性质，这略微减少了联网功能的需求。但若读者希望开发棋牌类或竞技类游戏，联网功能将是不可或缺的。

## 4\. 练习

- 若我们把邀请卡片分享到群里，在游戏开始后，第三个人点击卡片尝试加入失败，主菜单场景的按钮将不会正常显示。请尝试修复这个问题。
- 我们实现了对战场景的断线重连，但如果玩家将小游戏整个关闭，重新冷启动，这种方式就帮不上忙了。篇幅所限，本节中我们没有介绍这种情况，但读者可以参考附带代码仓库的方案尝试解决。
    