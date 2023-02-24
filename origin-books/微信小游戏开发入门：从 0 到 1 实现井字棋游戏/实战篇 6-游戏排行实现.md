
# 实战篇 6-游戏排行实现
---

# 实战篇 6：游戏排行实现

游戏排行是微信小游戏的一个重要玩法，用户可在游戏中查看同玩该游戏的好友排行，也可以通过群分享卡片，点击进入后查看该微信群里同玩的群成员排行。在实现对战逻辑中，我们已经在后端托管了用户的游戏数据。在这一节中，我们将学习如何获取关系链（好友与群成员）数据，并对好友排行榜的展示进行开发。

## 1\. 游戏数据的托管

### 用户游戏数据存储

在小游戏中，用户的游戏数据通过 `KVData` 的格式进行存储，`KVData` 即 key / value 键值对。如用户的分数数据，用 `KVData` 表示如下：

```
{
	key: "score",
	value: "666"
}
```

除了分数数据，我们在实际使用中，往往还会存储一些其他的数据，比如时间戳。多个 `KVData` 组成数组列表 `KVDataList`：

```
KVDataList: [
	{
		key: "score",
		value: "666"
	},
	{
		key: "timestamp",
		value: "1534707410000"
	}
]
```

> 用户游戏数据存取的相关接口，都是使用 KVDataList 的格式。

当然，value 也可以存储一些复杂的数据，如序列化之前内容为：

```
const value = {
  "result": {
    "score": 666,
    "timestamp": 1534707410000
  }
}
```

在 `KVData` 中，需要将 value 序列化为 string 进行存储：

```
{
	key: "score",
	value: JSON.stringify(value)
}
```

整理好 `KVData` 格式后，在前端中，通过调用 [`wx.setUserCloudStorage()`](https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.setUserCloudStorage.html) 接口，即可在前端实现将游戏数据存储到微信后台的功能：

```
wx.setUserCloudStorage({
	KVDataList: [{
		key: "score",
		value: "666"
	}],
	success: () => {}
})
```

对应地，小游戏也提供了前端删除托管数据的接口 [`wx.removeUserCloudStorage()`](https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.removeUserCloudStorage.html)。

### 用户游戏数据获取

存储了游戏数据后，下一步就是要学习如何获取了。在讲解获取之前，我们先要学习一个重要的概念：开放数据域。

开放数据域是一个封闭、独立的 JavaScript 作用域。我们要获取刚刚存储的用户游戏数据，以及用户的关系链数据，都需要在开放数据域中进行。要让代码运行在开放数据域，需要在 `game.json` 中通过 `openDataContext` 配置项指定开放数据域的代码目录：

```
{
	"deviceOrientation": "portrait",
	"openDataContext": "js/openDataContext"
}
```

我们将 `js/openDataContext` 目录指定为开放数据域的代码目录，同时也需要在项目中添加该目录及目录下的入口文件 `index.js`，并添加以下代码，以用于后续通信部分的调试：

```
wx.onMessage((data) => {
  console.log(data)
})
```

区别于开放数据域，`js/openDataContext`以外的代码所运行的作用域称为主域。

配置好了开放数据域后，我们在 `js/openDataContext/index.js` 中通过 [`wx.getUserCloudStorage()`](https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getUserCloudStorage.html) 就可以获取用户游戏数据了。

## 2\. 关系链数据获取

在基础篇学习微信小游戏开放能力时，我们已经了解了关系链数据的概念了，它包括了用户所有玩过该游戏的好友的游戏数据和某个群里玩过该游戏的成员的游戏数据。通过小游戏提供的这两种数据，我们便可以实现好友排行和群排行的展示。

### 获取好友数据

在开放数据域中，通过 [`wx.getFriendCloudStorage()`](https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getFriendCloudStorage.html) 接口，可获取好友数据，使用示例如下：

```
wx.getFriendCloudStorage({
    keyList: ['score'],
    success: res => {}
})
```

### 获取群成员数据

同样在开放数据域中，通过 [`wx.getGroupCloudStorage()`](https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getGroupCloudStorage.html) 接口，可获取群成员数据，使用示例如下：

```
wx.getGroupCloudStorage({
	shareTicket: shareTicket,
	keyList: ['score'],
	success: res => {}
})
```

可以看到，`wx.getGroupCloudStorage()` 除了传入 keyList 参数外，还需传入 shareTicket 参数，shareTicket 与群分享功能相关。

我们的项目只实现了好友排行的功能，因此只获取了好友数据。读者可依照下述步骤，尝试实现接获取群成员数据：

#### 设置使用带 shareTicket 的转发。

如果没有 shareTicket，则无法获取群成员数据。shareTicket 可以在 [`wx.showShareMenu`](https://developers.weixin.qq.com/minigame/dev/api/share/wx.showShareMenu.html) 和 [`wx.updateShareMenu()`](https://developers.weixin.qq.com/minigame/dev/api/share/wx.updateShareMenu.html) 来配置，但这两者的用法是不同的：

- 调用 `wx.showShareMenu` 后，点击“右上角”会出现“转发”按钮，withShareTicket 设置为 `true`，只对“右上角转发”生效；
- 调用 `wx.updateShareMenu()`，设置 withShareTicket 为 `true`，会同时作用于“右上角转发”和“主动拉起转发”。

因此只需在 `wx.updateShareMenu()` 一次设置 withShareTicket 即可：

```
wx.showShareMenu()
wx.updateShareMenu({
	withShareTicket: true
})
```

#### 区分“主动拉起转发”和“右上角转发”。

小游戏中的转发有两种形式：

- 被动转发：点击右上角按钮，会弹出菜单，通过上一个步骤的设置，菜单中会展示“转发”选项，点击“转发”选项，则触发转发事件，可通过 [`wx.onShareAppMessage`](https://developers.weixin.qq.com/minigame/dev/api/share/wx.onShareAppMessage.html) 方法监听；
- 主动转发：游戏内可通过 [`wx.shareAppMessage`](https://developers.weixin.qq.com/minigame/dev/api/share/wx.shareAppMessage.html) 接口，拉起主动转发并进入选择通讯录界面。

无论是主动转发还是被动转发到群聊天，都是通过群分享卡片的形式来分享的。不同的是：

- 用户通过右上角菜单的被动转发，是对整个游戏进行的分享；
- 用户通过点击“群排行榜”按钮拉起主动转发，是对群排行信息的分享。

只有“群排行榜”按钮点击发起的群分享卡片，点击进入后才需要显示群排行信息。因此需要对主动转发和被动转发做区分：`wx.onShareAppMessage` 和 `wx.shareAppMessage` 除了配置基础的分享信息 title 和 imageUrl，还可以配置 query 参数。我们通过 query 参数可以区分两种分享场景，示例代码如下：

```
// 监听右上角分享
wx.onShareAppMessage({
	title: '分享游戏',
	imageUrl: 'images/share.png',
	query: 'from=share'
})

// 在“群排行榜”按钮的点击事件里拉起分享
wx.shareAppMessage({
	title: '查看群排行',
	imageUrl: 'images/share.png',
	query: 'from=groupRank'
})

```

#### 获取 shareTicket。

要查看群排行，需要从群分享卡片点击进去，我们可以在 [`wx.onShow`](https://developers.weixin.qq.com/miniprogram/dev/dev/api/system/life-cycle/wx.onShow.html) 中，通过 query 参数判断是否显示群排行，并获得对应群的 shareTicket。通过主域与开放数据域的通信，将 shareTicket 发送给开放数据域，便可在开放数据域中通过 `wx.getGroupCloudStorage()` 获取群成员游戏数据。

至此，我们已经学习了操作托管数据所有接口。需要注意的是：

- `wx.getUserCloudStorage`、`wx.getFriendCloudStorage()` 和 `wx.getGroupCloudStorage()` 只能在开放数据域中调用。
- `wx.setUserCloudStorage()` 和 `wx.removeUserCloudStorage()` 可以同时在主域和开放数据域中调用。

## 3\. 主域与开放数据域的通信

### 信息发送与接收

主域和开放数据域不仅有接口调用能力的限制，它们之间的通信也是有一定限制的：

- 开放数据域不能向主域发送消息；
- 主域可以向开放数据域发送消息。

也就是说，主域可以单向向开放数据域发送消息。

- 主域调用 [`wx.getOpenDataContext()`](https://developers.weixin.qq.com/minigame/dev/document/open-api/context/wx.getOpenDataContext.html) 方法可以获取开放数据域实例，调用实例上的 [`OpenDataContext.postMessage()`](https://developers.weixin.qq.com/minigame/dev/document/open-api/context/OpenDataContext.postMessage.html) 方法可以向开放数据域发送消息；
- 开放数据域中调用 [`wx.onMessage()`](https://developers.weixin.qq.com/minigame/dev/document/open-api/context/wx.onMessage.html) 方法可以监听从主域发来的消息。

我们在实现排行榜时，为了使开放数据域在合适的时机获取关系链数据，需要在用户点击好友排行榜按钮时，从主域向开放数据域发送消息。相应地，也要在开放数据域中处理好监听，使用示例如下：

```
/**
 * 主域向开放数据域发送消息
 */
 
// 获取开放数据域实例
let openDataContext = wx.getOpenDataContext()
// 调用发送信息方法
openDataContext.postMessage('rank')
```

```
/**
 * 开放数据域中监听从主域发来的消息
 */

wx.onMessage((data) => {
  // 根据 data 做相应处理
  ...
})
```

### sharedCanvas

关系链数据只能在开放数据域中获取，但开放数据域又无法向主域发送消息，要怎么将排行信息绘制到我们主域的上屏 Canvas 上呢？需要通过 `sharedCanvas` 来实现。

顾名思义，`sharedCanvas` 是主域和开放数据域都可以访问的，它是一个离屏 Canvas。通过在开放数据域中将排行榜绘制到 `sharedCanvas`，然后在主域中获取 `sharedCanvas`，再绘制到上屏 Canvas，即可实现排行榜的展示。

![sharedCanvas](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/14/165d75cfcb11b0c3~tplv-t2oaga2asx-image.image)

> 项目配置了开放数据域后，主域和开放数据域的部分绘图和图片转换能力会受到限制，详细可见\[关系链数据使用指南\]\(https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/open-data.html\)。这些限制主要从保障用户数据安全的角度出发的，防止关系数据被恶意获取。

## 4\. 排行榜的实现

掌握了游戏数据的存储、关系链数据的获取，以及主域和开放数据域的通信。接下来，我们就可以来实现我们井字棋游戏的好友排行榜功能了。记得先检查下，`game.json` 有没有配置好 `openDataContext` 的路径。

### 添加排行榜场景

排行榜可作为游戏的一个场景，我们称之为 rank 场景。创建并编辑 `js/states/rank.js` ：

```
/**
 * 排行榜
 */

function backToMenu() {
  go.game.state.start('menu')
}

class Rank extends Phaser.State {
  create() {
    // 获得开放数据域实例
    const openDataContext = wx.getOpenDataContext()
    // 绘制背景
    this.add.image(0, 0, 'bg_rank')
    // 透明的返回主菜单按钮，放在左上角背景图的返回位置
    const backButton = this.add.button(0, 120, 'btn', backToMenu)
    backButton.alpha = 0
    // 向开放数据域发送 rank 消息
    openDataContext.postMessage('rank')
  }

  /**
   * 将开放数据域绘制的排行榜绘制到上屏画布上
   */
  render() {
    // 获得开放数据域实例
    const openDataContext = wx.getOpenDataContext()
    // 获得离屏画布
    const sharedCanvas = openDataContext.canvas
    // 将离屏画布绘制到上屏画布
    // game.context 是 Phaser 的接口，用于获取 Phaser 正在使用的 canvas context
    this.game.context.drawImage(sharedCanvas, 0, 0)
  }
}

module.exports = Rank
```

rank 场景相对来说非常简短，它所做的事情只是发送 rank 消息通知开放数据域绘制排榜行，然后将开放数据域绘制好排行榜的的离屏画布画到上屏画布上。

在 `game.js` 中注册场景：`game.state.add('rank', require('./js/states/rank'))` ，然后编辑 `js/states/menu.js` 让“排行榜”按钮点击后可以跳转场景：

```
/**
 * 排行榜按钮回调
 */
function rank() {
  go.game.state.start('rank')
}
```

此时，重新运行游戏，进入主菜单，并点击“排行榜”应该能看到调试器中打印出 `rank` 字样，这说明我们配置正确，开放数据域接收到了主域中发出的 rank 消息。

### 游戏数据排行

完成了主域的场景，我们要实现开放数据域的逻辑。通过 `wx.getFriendCloudStorage()` 接口，获取的好友数据格式如下：

```
{
	data: [{
		// 用户的 openid
		openid: "",
		
		// 用户的微信昵称
		nickname: "",
		
		// 用户的微信头像 url
		avatarUrl: "",
		
		// 用户的托管 KV 数据列表
		KVDataList: []
	}]
}
```

除 `openid` 外，其他数据均会展示在排行榜上。

我们对数据进行格式及排序处理，编辑 `js/openDataContext/index.js` ，添加以下方法：

```
/**
 * 处理微信 API 获得的原始数据，获得我们绘制排行榜所需的数据
 */
function processData (data) {
  return data
    // 有成绩且成绩数据格式正确
    .map((player) => {
      const score = player.KVDataList.find(({ key }) => key === 'score')
      if (!score) return null

      // 为避免 score.value 中出现无法解析的意外数据
      try {
        player.score = JSON.parse(score.value)
      } catch (e) {
        return null
      }

      return player
    })
    // 剔除无效数据
    .filter(data => data !== null)
    // 按胜场排序
    .sort(
      (one, another) => {
        if (one.score.win > another.score.win) {
          return -1
        } else {
          return 1
        }
      }
    )
    // 取前6名
    .slice(0, 6)
}
```

### 绘制排行榜

完成了数据处理后，就可以开始绘制了。编辑 `js/openDataContext/index.js` ，完整的功能代码如下：

```
/**
 * 开放数据域，绘制排行榜
 */

// 离屏画布，叫 Shared 是因为主域，开放数据域都能访问它
const SHARED_CANVAS = wx.getSharedCanvas()

// 成绩条相关数值
const SCORE_ROW_WIDTH = 515
const SCORE_ROW_HEIGHT = 94
const SCORE_ROW_GAP = 25
const TOP_TO_SCORE = 375
const LEFT_TO_SCORE = 118
// 按序号计算成绩条的 top 值
function topToScoreRow(index) {
  return LEFT_TO_SCORE, TOP_TO_SCORE + (SCORE_ROW_HEIGHT + SCORE_ROW_GAP) * index
}

// 成绩条内部元素相关数值
const LEFT_TO_INDEX = 150
const LEFT_TO_AVATAR = 196
const LEFT_TO_NAME = 280
const LEFT_TO_WINS = 610
const AVATAR_SIZE = 70
const NAME_MAX_WIDTH = 230
const WINS_MAX_WIDTH = 90
// 按序号计算头像的 top 值
function topToAvatar(index) {
  return topToScoreRow(index) + 10
}
// 按序号计算文本的 top 值（所有文本都是只有一行垂直居中，所以一样）
function topToTexts(index) {
  return topToScoreRow(index) + 55
}

/**
 * 画图片的辅助函数
 * Image 的加载是异步的，封装成 Promise 方便使用
 */
function drawImage(ctx, imgSrc, x, y, width, height) {
  return new Promise((resolve) => {
    // 使用 wx.createImage() 创建图片
    var image = wx.createImage()
    // 加载成功回调
    image.onload = function () {
      // 实践发现，drawImage 若将 width height 设为 undefined ，会导致宽高变成 0
      if (width && height) {
        ctx.drawImage(image, x, y, width, height)
      } else {
        ctx.drawImage(image, x, y)
      }
      // 绘制完毕，resolve promise
      resolve()
    }
    // 设置 src ，开始加载。没头像的加载 avatart_unknow
    image.src = imgSrc || 'images/avatar_unknow.png'
  })
}

/**
 * 绘制胜局数量
 */
function drawScore(context, player, index) {
  // 锚点定在最右侧，文本框变长时就是向左扩展
  context.textAlign = 'right'
  context.fillText(`胜${player.score.win}场`, LEFT_TO_WINS, topToTexts(index), WINS_MAX_WIDTH)
}

/**
 * 绘制排行榜
 */
function drawRankList(data) {
  const context = SHARED_CANVAS.getContext('2d')
  // 清除之前绘制的排行
  context.clearRect(0, 0, SHARED_CANVAS.width, SHARED_CANVAS.height)
  // 逐条绘制
  data.forEach((player, index) => {
    // 画背景
    const pRow = drawImage(context, 'images/rank_row.png', LEFT_TO_SCORE, topToScoreRow(index))

    // 背景图片是异步加载，绘制时会覆盖已经画好的内容
    // 因此我们在确定背景绘制完成后再绘制别的
    pRow.then(() => {
      // 画头像（头像也是异步，但它的为止不会覆盖别的东西）
      // 注意：头像是从网络加载的，几乎可以肯定它会比背景图片慢，但对于没有头像的玩家
      // 加载的 avatar_unknow 是本地资源，仍然可能被背景覆盖，所以不能把这行挪到 then 外面。
      drawImage(context, player.avatarUrl, LEFT_TO_AVATAR, topToAvatar(index), AVATAR_SIZE, AVATAR_SIZE)
      // 画文本
      context.textAlign = 'left'
      context.fillStyle = 'white'
      context.font = '24px Arial'
      // 序号
      context.fillText(index + 1, LEFT_TO_INDEX, topToTexts(index))
      // 名字
      context.fillText(player.nickname, LEFT_TO_NAME, topToTexts(index), NAME_MAX_WIDTH)
      // 成绩
      drawScore(context, player, index)
    })
  })
}

/**
 * 处理微信 API 获得的原始数据，获得我们绘制排行榜所需的数据
 */
function processData (data) {
  return data
    // 有成绩且成绩数据格式正确
    .map((player) => {
      const score = player.KVDataList.find(({ key }) => key === 'score')
      if (!score) return null

      // 为避免 score.value 中出现无法解析的意外数据
      try {
        player.score = JSON.parse(score.value)
      } catch (e) {
        return null
      }

      return player
    })
    // 剔除无效数据
    .filter(data => data !== null)
    // 按胜场排序
    .sort(
      (one, another) => {
        if (one.score.win > another.score.win) {
          return -1
        } else {
          return 1
        }
      }
    )
    // 取前6名
    .slice(0, 6)
}

// 监听主域中发来的消息
wx.onMessage((data) => {
  switch (data) {
    case 'rank': {
      // 拿到好友的...
      wx.getFriendCloudStorage({
        // key 为 score 的云数据
        keyList: ['score'],
        success: res => {
          // 处理原始数据，获得绘制排行榜所需数据
          let data = processData(res.data)

          // 传入数据，画排行榜
          drawRankList(data)
        }
      })
    }
  }
})
```

注意：

- 小游戏中没有 `new Image()` 的 API ，我们开放数据域中的代码加载图片要用 `wx.createIamge()` 。（在主域中由于有 Adapter 的帮助，可以使用 `new Image()` ，但游戏引擎已经处理了这些工作。）
- `wx.getFriendCloudStorage` 获取的 `score` 数据是服务器端在每局胜负后上报到微信的。有多个数据域，并且符合[微信小游戏中心排行榜](https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/ranklist.html)要求的格式，我们的排行榜仅使用其中的 `wins` 总胜局数量。

在上面的代码中，我们首先使用 [`wx.onMessage()`](https://developers.weixin.qq.com/minigame/dev/document/open-api/context/wx.onMessage.html) 监听主域的消息。当收到 `rank` 消息时，就进行一次排行榜绘制。

在主域中我们一进入排行榜页面就会发送 `rank` 消息通知重绘，然后在 Phaser state 的 `render` 生命周期函数中将离屏画布绘制到上屏画布。

由于 `wx.createImage()` 接口与 `drawImage` 都是异步的，而开放作用域无法主动通知主域，我们无法得知绘制何时完成。因此将绘制放在 `render` 中，每一帧都重新绘制。

若此时运行游戏，会发现排行榜没有完整绘制出来，这是因为离屏画布的尺寸与视觉稿不同，我们来修正这最后一个问题。编辑 `game.js` ，在游戏刚启动时就设置离屏画布尺寸与游戏尺寸一致：

```
// ...
window.WIDTH = 750
window.SCALE = WIDTH / canvas.width
window.HEIGHT = canvas.height * SCALE
// 添加下面的内容

// 设置离屏 canvas 尺寸
let openDataContext = wx.getOpenDataContext()
let sharedCanvas = openDataContext.canvas
sharedCanvas.width = WIDTH
sharedCanvas.height = HEIGHT

// ...
```

> sharedCanvas 的尺寸只能在主域中设置，在开放数据域中设置是无效的。

重新运行游戏，再次尝试访问排行榜。若之前测试好友约战时读者完整完成了几次对战，并且服务器配置正确，此时应该是有少量数据可用的。读者应该能够至少看到自己与另一个对战好友的排行榜。

![对战排行榜](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfe40ac69c31~tplv-t2oaga2asx-image.image)

## 5\. 小结

排行榜是一种刺激玩家成就感、满足感的常用机制。微信小游戏平台基于微信社交关系链，排行榜上的竞争对手不再是全球各地不认识的玩家，而是玩家社交圈内的人员。因此各种排名、数值都不再是冰冷的数字，而是朋友间谈笑调侃的梗与谈资。想想你身边“跳一跳”最高分的那个“大神”应该就能体会到这种熟人间排行榜的威力了。而我们现在已经掌握了这种强大的资源！更何况，关系链数据也没有限制排行榜一种用法，还望各位读者多多创新，进一步挖掘它的潜力。

到这里我们的小游戏开发工作可以说正式告一段落了。经过了这么多的努力，我们完成了一款拥有如下特性的游戏：

- 单机玩法
- 好友对战联网玩法
- 以及配套联网服务器
- 好友排行榜

以这样一个五脏俱全的小游戏作为线索，我们熟悉了小游戏的开发环境、开发流程，了解了小游戏的大量 API 以及平台规则和特色。相信读者已经做好了开发一款小游戏的所有准备，正在跃跃欲试了！在实战篇剩下的章节中，我们会讨论更多生态接入、游戏发布与运营等和开发关系较少的话题，一款游戏要成功，它们也是至关重要的。若读者是个人开发者，这部分就更加不可或缺了。

## 6\. 练习

- 对于一个火爆的游戏而言，即使是在好友圈里想挤进前六名也不简单。为了照顾没上榜的玩家，请改进排行榜让它支持滚动。（开放数据域支持[触摸事件](https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/open-data.html)，在文档的最底下）

- 不少小游戏中，排行榜除了实现分数排行外，还实现了每周刷新的功能。这需要在存储分数的同时存储时间戳，在获取关系链数据时，比对时间戳时间是否在当周时间范围内，符合条件再进行展示。请改进代码加以实现。
    