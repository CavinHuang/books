
# 实战篇 2-单机游戏实现
---

# 实战篇 2：单机游戏实现

在本节里，我们将引导读者一步步从头创建“井字大作战”的单机练习部分。游戏本身的逻辑非常简单，主要目的是熟悉微信小游戏的开发环境与部分 API ，并对 Phaser 游戏引擎的部分概念有一个大致的认识。读者不需要完成整节才运行项目，本文中间设置了多个可运行的阶段性里程碑，以方便读者对照调试。

## 1\. 创建游戏项目

首先，我们通过微信开发者工具创建一个游戏项目。

![创建游戏项目](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af508a6d49be8~tplv-t2oaga2asx-image.image)

创建项目时，会默认勾选建立游戏快速启动模版的选项，提供一个飞机游戏的例子。我们首先用这个模版创建项目，体验一下一个可以运行的小游戏。体验后把项目的目录结构调整如下：

```
.
├── images      // 图片
├── js
│   ├── libs    // 第三方库
│   └── states  // phaser 场景
├── game.js     // 游戏主入口
├── game.json
└── project.config.json
```

注意删除多余的文件与文件夹，并从我们附带的[项目仓库](https://github.com/o2team/tictactoe-sample/tree/master/mgame/)复制图片资源到 `images` 目录，我们就可以开始小游戏的开发工作了。

## 2\. 开始游戏编码

> 我们有很多讲解内容是以注释形式与代码写在一起的，读者最好不要大段复制粘贴，至少通过注释大致理解代码块作用后继续。对于代码中 Phaser 相关的 API ，建议读者暂且只了解作用即可，细节暂且搁下，保证阅读流畅性。

#### 引入 Phaser

前边章节有提到微信小游戏提供了 CommonJS 风格的模块 API，但 Phaser CE 没有以模块化的方式编写，会依赖一些全局变量，我们这里需要参考官方文档提供的 Browserify / CommonJS 下的引用方式。

我们先将 [Phaser CE 代码包](https://github.com/photonstorm/phaser-ce/archive/v2.11.0.zip)下的 `build/custom/` 下的 `p2.js` `pixi.js`、 `phaser-split.js` 和下载好 [weapp-adapter.js](https://github.com/o2team/tictactoe-sample/blob/master/mgame/js/libs/weapp-adapter.js) 放到 `js/libs` 文件夹下，并在游戏入口文件 `game.js` 中引入。代码如下：

```
// 注意删除 game.js 中原来的内容

require('./js/libs/weapp-adapter')
window.p2 = require('./js/libs/p2')
window.PIXI = require('./js/libs/pixi')
window.Phaser = require('./js/libs/phaser-split')
```

#### 创建游戏

编辑 `game.js` 以创建游戏：

```
// ...

// 定义全局常量
window.WIDTH = 750                     // 游戏宽度
window.SCALE = WIDTH / canvas.width    // 游戏宽度/ canvas 宽度
window.HEIGHT = canvas.height * SCALE  // 游戏高度

// go: Global Object 用于在 state 之间共享数据和方法
window.go = {
  game: null,                      // 游戏实例
  userInfo: null,                  // 玩家信息
  opponentInfo: null,              // 对手信息
  common: null,                    // 公共函数
  server: null,                    // 与服务器的交互
  launchRoomId: null,              // 进入主菜单时需要加入的房间 id
  battle: null,                    // 对战状态
}

// 初始化游戏
const config = {
  width: WIDTH,             // 游戏世界宽度
  height: HEIGHT,           // 游戏世界高度
  renderer: Phaser.CANVAS,  // 渲染器，这里我们使用 canvas
  canvas: canvas            // 将游戏绘制在 adapter 为我们创建的 canvas 上
}
const game = new Phaser.Game(config)                   // 创建游戏
// 全局对象中保存一个 game 的引用
go.game = game
// 注册游戏场景
game.state.add('start', require('./js/states/start'))  // 添加 start 游戏场景
game.state.start('start')                              // 启动 start 游戏场景
```

这里需要注意：

- 引入 adapter 之后会自动创建一个 canvas ，我们的游戏要使用它来绘制才能正常显示。
- 我们的视觉稿是按 750 的宽度设计的，这里我们按照宽度适应屏幕。
- `window.go` 对象用来在 state 之间共享数据和方法

我们还没有实现 start 游戏场景，运行游戏时调试器会报错，提示 `module "js/states/start" is not defined` ，下面我们就来实现它。

#### 开始场景（start）

Phaser 中的状态（State）其实与前文基础篇 3 中提到的场景（Scene）是同一个概念，都是用于区分如“加载”、“主菜单”或“游戏中”等游戏的各个阶段，将它们划分为较为独立的多个部分。后文中，我们将会根据不同语境混用“游戏场景”、“phaser 状态”、“phaser state”等名词，读者应当理解它们其实是一样的。

我们现在要创建的第一个场景叫做 start ，它仅包含一张背景图与一个开始游戏按钮，用来预加载游戏资源和获取玩家的基本信息。

首先，创建一个文件夹 `js/states` ，并创建 `js/states/start.js` 。编辑 `start.js` 如下：

```
/**
 * 开始 state ，负责检查加载资源文件以及申请获得玩家基本资料
 */

/**
 * 创建“开始”按钮，点击后获取用户基本信息并调用回调，若用户拒绝则没有任何效果
 */
function addStartBtn(cb) {
  // 稍后添加
}

class Start extends Phaser.State {
  /**
   * Phaser state 的 preload 生命周期可以用来预加载游戏资源
   */
  preload() {
    // 稍后添加
  }

  /**
   * Phaser create 生命周期用来初始化游戏场景
   */
  create() {
    // 添加一个图片作为背景
    this.game.add.image(0, 0, 'bg_menu');
    // 添加“开始游戏”按钮
    const startBtn = addStartBtn((userInfo) => {
      // 销毁开始按钮
      startBtn.destroy()
      // 将玩家信息存入 global object
      go.userInfo = userInfo
      // 预加载玩家头像，微信头像为空则不加载
      if (go.userInfo.avatarUrl !== '') {
        this.load.image(go.userInfo.avatarUrl, go.userInfo.avatarUrl)
        // 在 preload 生命周期函数以外进行的资源加载必须手动开始加载
        this.load.start()
      }
      // 跳转主菜单场景
      this.game.state.start('menu')
    })
  }
}

module.exports = Start
```

在上面的代码中，我们创建了一个名为 `Start` 的类并让它继承于 `Phaser.state` ，这就是我们的第一个游戏场景。 `Phaser.state` 的 `create` 方法适用于初始化场景，我们在这里配置并创建了获取用户基本信息的按钮，以及一张背景图片。`preload` 方法则是用于预加载游戏资源，我们的游戏资源不多，在这里一次加载完是个不错的选择。编辑 `preload` 函数：

```

/**
  * Phaser state 的 preload 生命周期可以用来预加载游戏资源
  */
preload() {
  // 配置画面缩放
  this.scale.pageAlignHorizontally = true
  this.scale.pageAlignVertically = true
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
  // 预加载资源
  this.load.image('bg_menu', 'images/bg_menu.png')
  this.load.image('bg_playing', 'images/bg_playing.png')
  this.load.image('bg_rank', 'images/bg_rank.png')
  this.load.image('bg_waiting', 'images/bg_waiting.png')
  this.load.image('avatar', 'images/avatar.png')
  this.load.image('avatar_unknow', 'images/avatar_unknow.png')
  this.load.image('btn', 'images/btn_menu.png')
  this.load.image('o', 'images/o.png')
  this.load.image('x', 'images/x.png')
  this.load.image('row', 'images/rank_row.png')
  this.load.image('avatars', 'images/result_avatars.png')
  this.load.image('win', 'images/result_win.png')
  this.load.image('lose', 'images/result_lose.png')
  this.load.image('draw', 'images/result_draw.png')
  this.load.image('bunting', 'images/bunting.png')
}
```

`create` 中还用了一个叫 `addStartBtn` 的函数来创建开始游戏按钮，编辑 `addStartBtn` 函数来实现这个功能：

```
/**
 * 创建“开始”按钮，点击后获取用户基本信息并调用回调，若用户拒绝则没有任何效果
 */
function addStartBtn(cb) {
  const config = {
    type: 'Image',
    image: 'images/btn_start.png',
    style: {
      left: 248 / SCALE,   // 除以 SCALE 是为了将设计稿尺寸转为 canvas 实际尺寸
      top: 870 / SCALE,
      width: 254 / SCALE,
      height: 91 / SCALE,
    },
  }
  // wx.createUserInfoButton() 是小游戏 API ，用于创建获取用户信息的按钮，
  // 文档链接：https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/wx.createUserInfoButton.html
  const startBtn = wx.createUserInfoButton(config)
  startBtn.onTap((res) => {
    // 若用户拒绝授权，则返回值没有 userInfo 值
    if (res.userInfo) {
      cb(res.userInfo)
    }
  })
  return startBtn
}
```

`addStartBtn` 中用到了一个微信小游戏的 API [`wx.createUserInfoButton()`](https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/wx.createUserInfoButton.html) 它可以创建一个按钮，点击后能够获得用户基本信息，后面我们会需要其中的昵称和头像地址。

这时，可能有读者发现调试器出现了 `wx.createUserInfoButton is not a function` 的报错，这是因为使用的调试基础库版本较低（使用系统游戏模板创建的项目，使用 `1.9.x` 版本的调试基础库），需要在开发者工具中进行修改：

![调试基础库](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/26/16613b2cc60cc073~tplv-t2oaga2asx-image.image)

> 读者请避免大段复制粘贴，我们在注释中详细讲解了大量概念定义、 API 用法、注意事项以及设计考虑等。这些内容难以脱离实例讲解，忽略它们将可能导致无法理解后续的内容。

现在我们创建了第一个游戏场景，微信开发者工具将会在每次保存后自动重新运行游戏，如果读者操作正确，此时报错应该已经消失，左侧模拟器会显示如下画面：

![第一个场景](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af508a6f4c68d~tplv-t2oaga2asx-image.image)

恭喜，我们已经踏出了第一步，现在我们有了一个能正常运行起来的小游戏，让我们趁热打铁，继续完成下一个“主菜单”游戏场景。

#### 主菜单场景（menu）

创建 `js/states/menu.js` 并编辑：

```
/**
 * 主菜单
 */

/**
 * 单机练习按钮回调
 */
function practice() { console.log('practice') }

/**
 * 好友对战按钮回调
 */
function battle() { console.log('battle') }

/**
 * 排行榜按钮回调
 */
function rank() { console.log('rank') }

/**
 * 添加主菜单
 */
function addMenu() {
  [
    // x    y     按钮文本    回调函数
    [  248, 750,  "单机练习", practice],
    [  248, 900,  "好友约战", battle],
    [  248, 1050, "好友排行", rank],
  ].map((btnConfig) => {
    // 调用 common 中的 addBtn 函数创建按钮
    go.common.addBtn({
      x: btnConfig[0],
      y: btnConfig[1],
      text: btnConfig[2],
      callback: btnConfig[3],
    })
  })
}

class Menu extends Phaser.State {
  create() {
    // 背景图
    this.add.image(0, 0, 'bg_menu')
    // 添加主菜单
    addMenu()
  }
}

module.exports = Menu
```

此时如果运行游戏并点击开始游戏，调试器会提示我们：

```
Phaser.StateManager - No state found with the key: menu
```

这是因为我没还没有向游戏注册主菜单场景（menu），回到 `game.js` 进行注册：

```
// ...

const game = new Phaser.Game(config)
game.state.add('start', require('./js/states/start'))
game.state.add('menu', require('./js/states/menu'))  // 添加这一行
game.state.start('start')
```

现在重新运行，点击开始游戏，依旧会报错，提示：

```
Cannot read property 'addBtn' of null
```

出问题的是这一部分：

```
    // 调用 common 中的 addBtn 函数创建按钮
    go.common.addBtn({  // go.common 没有 addBtn 属性
      x: btnConfig[0],
      y: btnConfig[1],
      text: btnConfig[2],
      callback: btnConfig[3],
    })
```

回到 `game.js` 可以看到我们对 `go.common` 的注释是“公共函数”。创建按钮是一个非常常用的功能，符合这个定义，因此我们决定将它的实现写到 `go.common` 中。目前 `go.common` 还是 `null` ，现在我们就来实现它。

首先创建 `js/common.js` 并编辑：

```
/**
 * 公共函数
 */

const common = {
  /**
   * 获取当前的场景
   */
  curState: () => go.game.state.getCurrentState(),

  /**
   * 绘制按钮
   */
  addBtn: ({ x, y, callback, context, text }) => {
    // 向当前场景添加按钮
    const btn = common.curState().add.button(x, y, 'btn', callback, context, 0)
    // 创建文本标签
    const label = common.curState().make.text(btn.width / 2, btn.height / 2, text, {
      font: "36px", fill: "#ff5420"
    })
    // 将锚点定位在标签中间
    label.anchor = { x: 0.5, y: 0.5 }
    // 将标签加入到按钮中
    btn.addChild(label)
    return btn
  },
}

module.exports = common
```

然后回到 `game.js` ，引入 `common.js` ：

```
// go: Global Object 用于在 state 之间共享数据和方法
window.go = {
  game: null,                    // 游戏实例
  userInfo: null,                // 玩家信息
  opponentInfo: null,            // 对手信息
  common: require('js/common'),  // 公共函数         // 修改这行
  server: null,                  // 与服务器的交互
  launchRoomId: null,            // 进入主菜单时需要加入的房间 id
  battle: null,                  // 对战状态
}
```

若读者操作正确，此时点击“开始游戏”我们就能成功进入主菜单场景了：

![第二个场景](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af508a6ec05e5~tplv-t2oaga2asx-image.image)

#### 单机练习场景

终于进入了我们这章的重点，现在我们需要进行单机练习部分的开发。同样的我们首先需要创建一个场景，我们决定叫他 `practice` 。这里我们将它的创建作为一个小练习留给你，还记得前两个场景的创建步骤么？请参考它们完成创建，并编辑内容：

```
/**
 * 单人练习
 */

let cd             // 倒计时
let board          // 棋盘
let currentPlayer  // 当前玩家
let intervalId     // 倒计时定时器 Id ，用于清理倒计时定时器
let lastTimestamp  // 用于计算倒计时
let renderCD       // 渲染倒计时
let setPiece       // 落子

// 游戏结束
function over(result) {
  // 清理倒计时定时器
  clearInterval(intervalId)
  // 调用 go.common.showResult 显示结果层
  go.common.showResult({
    result,
    // start 场景中，我们把玩家的基本信息存到了 go.userInfo 中
    meName: go.userInfo.nickName,
    // 新注册的微信用户头像地址为空字符串，遇到这种情况，我们提供一个默认头像
    meAvatar: go.userInfo.avatarUrl || 'avatar_unknow',
    opponentName: '电脑',
    opponentAvatar: 'avatar_unknow',
    // 结果层 UI 中有一个“回到首页”按钮，这里可以设置它的点击回调
    callback: () => {
      // 点击后回到主菜单场景
      go.game.state.start('menu')
    }
  })
}

/**
 * 落子，并返回游戏是否结束
 */
function placePiece(row, col) {
  // 玩家落子
  board[row][col] = currentPlayer
  setPiece(row, col, currentPlayer)
  // 检查游戏结果
  if (checkOver()) return true
  // 双方换手
  currentPlayer = 1 - currentPlayer
  return false
}

/**
 * 重设游戏
 */
function reset() {
  // 重设棋盘，0 是自己, 1是对手，-1是空
  board = [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ]

  // 随机选择先手玩家
  currentPlayer = Math.round(Math.random())

  // 倒计时（每人 60 秒）
  cd = [60000, 60000]
  lastTimestamp = Date.now()
  intervalId = setInterval(() => {
    // 定时更新倒计时
    const current = Date.now()
    const delta = current - lastTimestamp
    lastTimestamp = current
    cd[currentPlayer] = cd[currentPlayer] - delta
    renderCD(cd[0], cd[1])

    // 时间到，当前执子玩家判负
    cd[0] <= 0 && over('lose')
    cd[1] <= 0 && over('win')
  }, 500)
}

/**
 * 检查游戏结果
 */
function checkOver() {
  // 调用 go.common.checkWin 判断是否形成胜局
  if (go.common.checkWin(board)) {
    // 若形成胜局且当前玩家执子，则获胜
    if (currentPlayer === 0) over('win')
    // 否则失败
    else over('lose')
    return true
  // 调用 go.common.checkDraw 判断是否形成平局
  } else if (go.common.checkDraw(board)) {
    over('draw')
    return true
  }
  return false
}

class Practice extends Phaser.State {
  create() {
    // 画背景
    this.add.image(0, 0, 'bg_playing')

    // 重设游戏
    reset()

    // 调用 go.common.addBattleInfo 绘制游戏信息
    // 该函数会绘制游戏信息，并返回一个用于更新倒计时的函数
    renderCD = go.common.addBattleInfo({
      meAvatar: go.userInfo.avatarUrl || 'avatar_unknow',
      meName: go.userInfo.nickName,
      opponentAvatar: 'avatar_unknow',
      opponentName: '电脑',
    })
    // 传入玩家及对手的倒计时，进行更新
    renderCD(cd[0], cd[1])

    // 调用 go.common.addPieces 画棋盘
    // 该函数接受一个函数作为棋子被点击后的回调函数，传入 row col 值
    // 并返回一个用于落子的函数
    setPiece = go.common.addPieces((row, col) => {
      // 判断有没有轮到玩家落子
      if (currentPlayer !== 0) return

      // 玩家落子
      const isOver = placePiece(row, col)
      if (isOver) return

      // 超级人工智能落子。。。
      const stratage = [
        [1, 1],
        [0, 0], [0, 2], [2, 0], [2, 2],
        [0, 1], [1, 0], [1, 2], [2, 1],
      ]
      // 找一个空位
      const availableCoord = stratage.find(coord => board[coord[0]][coord[1]] === -1)
      // 落子
      placePiece(availableCoord[0], availableCoord[1])
    })

    // 若随机到电脑先下
    if (currentPlayer === 1) {
      placePiece(1, 1)
    }
  }
}

module.exports = Practice
```

目前代码还不能运行，因为有大量的 UI 相关代码放在了 `go.common` 中去实现，因为多人对战场景也要用到它们。`js/common.js` 文件到这已经是最终版本，后面不会再有修改，由于是业务代码且篇幅过长，请读者直接阅读源码并参考注释进行理解。

重新编辑 `js/common.js` 为项目代码库版本后再次运行游戏，若一切正常，就能够进行单人游戏了：

![单人游戏](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af508a6f710a4~tplv-t2oaga2asx-image.image)

## 3\. 常见问题

### start 场景的“开始游戏”按钮为什么不用公共的 `go.common.addBtn` 工具函数创建？

“开始游戏”按钮是一个特殊的按钮，实际上它并不是游戏画面的一部分，而是悬浮在我们的 canvas 上方。它是小游戏提供的用于获取用户基本信息的 API ，可以参考[小游戏相关文档](https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/wx.createUserInfoButton.html)。

### 源码中有多种跳转场景的方式，它们的区别是什么？

源码中一种出现了三种跳转 Phaser 场景的方式，实际上它们是完全一致的：

1.  `game.state.start('start')` （game.js）
2.  `go.game.state.start('practice')` \(menu.js\)
3.  `this.game.state.start('menu')` （start.js）

即使读者没有参考 Phaser 文档，跟随着本文走到这里应该也已经明白了跳转场景的模式：

```
<Phaser 游戏实例>.state.start(<注册的场景名>)
```

因此前两种情况很简单，第三种情况出现在 Start 类的方法中，`this` 会指向到 start 场景，而 Phaser 的场景会保留一个 Phaser 游戏实例的引用。因此 `this.game` 也可以获得我们创建的游戏实例。其实我们完全可以用 `go.game` 替换 `this.game` ，效果是一样的。

我们鼓励读者在遇到疑惑与困难时多多修改尝试，这是非常有效的学习方式。若困惑来自于某些第三方库的使用，则可以培养“不懂装懂”的能力，暂时先将疑惑心安理得的放下，保证阅读的流畅性。在读完本小册，使用 Phaser 自行实现游戏时，再参考其文档，细细研究琢磨。

## 4\. 小结

这恐怕是本小册到现在为止最辛苦的一节了！各位严格遵守要求看到这里的读者，给自己点个赞吧！我们先用模版创建了一个小游戏作为体验，然后把它删干净又从头实现了自己的小游戏。中间涉及到了：

- 创建与开发小游戏的流程
- 理解部分游戏开发的专有概念
- Phaser 游戏引擎的使用
- 小游戏平台部分 API 的使用
- 三个场景的开发以及相互跳转（其中有一个是你自己没有指导的情况下创建的）

如果不是主菜单上还有两个点了没反应的“好友对战”和“排行榜”按钮，我们已经可以说自己完成一个小游戏了！所以在后面的章节中，我们会讲到部署服务器部分，邀请好友来对战，发现游戏的更大乐趣。

## 5\. 练习

- 游戏中，玩家的棋子类型总是 o ，电脑的总是 x ，不符合 o 先手 x 后手的直觉，读者可以尝试完善这部分。
- 我们的超级人工智能的下棋策略似乎有点水，你有更好的主意么，修改代码实现它吧！（参考资料：[博弈树](https://zh.wikipedia.org/wiki/%E7%AB%B6%E8%B3%BD%E6%A8%B9)、[极小化极大算法](https://zh.wikipedia.org/wiki/%E6%9E%81%E5%B0%8F%E5%8C%96%E6%9E%81%E5%A4%A7%E7%AE%97%E6%B3%95)）
- 继续到处修修改改，弄清楚模糊不清的地方，直到你满意为止。（别忘了备份，后面还得继续用呢）
    