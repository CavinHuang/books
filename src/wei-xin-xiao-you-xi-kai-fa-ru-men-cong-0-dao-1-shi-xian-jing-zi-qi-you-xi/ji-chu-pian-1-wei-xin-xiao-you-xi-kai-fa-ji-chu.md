
# 基础篇 1-微信小游戏开发基础
---

# 基础篇 1：微信小游戏开发基础

微信小游戏区别于我们熟悉的 Web 应用，本篇将基于 [官方教程](https://developers.weixin.qq.com/minigame/dev/) 做总结和扩展，介绍小游戏的基础概念、运行框架、项目组成及开发者工具的使用。若已学习过官方教程，可选择跳过本篇内容。

## 1\. 基础概念

前文已经提到，小游戏运行的环境是一个绑定了一些方法的 JavaScript VM，只支持 JavaScript，当然可以编译为 JS 的 TypeScript 和 CoffeeScript 也可以作为开发语言。

### wx API

小游戏运行环境中，不支持 BOM 和 DOM API，只有微信原生 wx API。通过 wx API，可以调用微信提供的能力，如获取渲染、数据缓存、用户信息、文件系统等。

### Canvas

通过 wx API 可以实现游戏基础的渲染功能。小游戏 Canvas 对象的创建方法是 [`wx.createCanvas()`](https://developers.weixin.qq.com/minigame/dev/api/render/canvas/wx.createCanvas.html) 。

关于 Canvas，有两个重要概念需要了解：上屏 Canvas 与离屏 Canvas。简单理解，上屏 Canvas 上绘制的内容会显示在屏幕上；而离屏 Canvas 上绘制的内容不会显示在屏幕上，需要通过将离屏 Canvas 绘制到上屏 Canvas 上才能显示。离屏 Canvas 通常用来绘制一些需要复杂运算（如：多次调用 `drawImage` 绘图）的图像，或者优化绘制区域（只绘制需要更新的部分区域，避免上屏 Canvas 大面积刷新），以提高绘图的效率。

在小游戏运行期间，首次调用 `wx.createCanvas()` 接口创建的是一个上屏 Canvas，之后再调用 `wx.createCanvas()` 创建的都是离屏 Canvas。

### GameGlobal

小游戏环境既然不支持 BOM API，那么就没有 window 对象。但是小游戏的运行环境提供了全局对象 GameGlobal，所有全局定义的变量都是 GameGlobal 的属性。根据需要可以把封装的类或函数挂载到 GameGlobal 上：

```
GameGlobal.test = () => {
	console.log('test global')
}
test()
```

### 模块化

小游戏提供了 CommonJS 风格的模块 API，可以通过 `module.exports` 和 `exports` 导出模块，通过 `require` 引入模块。

### Adapter

小游戏的运行环境没有 DOM，也就没有全局的 document 对象。假设我们要创建一个 Canvas 元素，在小游戏环境下使用 `document.createElement('canvas')` 会引起报错，需要使用 `wx.createCanvas()`。

当然还有一个解决方案，使用 wx API 来进行模拟，这样一来，在小游戏环境下使用 `document.createElement('canvas')` 也可以正常运行，实现代码如下：

```
var document = {
    createElement: function (tagName) {
        tagName = tagName.toLowerCase()
        if (tagName === 'canvas') {
            return wx.createCanvas()
        }
    }
}
```

使用 wx API 模拟 BOM 和 DOM 的代码所组成的库称之为 Adapter。当我们直接使用 wx API 开发时，无需使用 Adapter。但如果是基于游戏引擎来开发或者移植现在的 H5 游戏时，Adapter 可以对游戏引擎（基于浏览器环境）或 H5 游戏在小游戏运行环境下做一层适配，确保游戏正常运行。

### weapp-adapter

微信小游戏官方实现了一个 Adapter，叫 [weapp-adapter](https://developers.weixin.qq.com/minigame/dev/tutorial/weapp-adapter.zip)。它模拟了 `document.createElement`、 `canvas.addEventListener`、 `localStorage`、 `Audio`、 `Image`、 `WebSocket`、 `XMLHttpRequest` 等对象和方法。

> 注意： 1. weapp-adapter 中预先调用 wx.createCanvas\(\) 创建了一个上屏 Canvas； 2. weapp-adapter 被视为第三方库，需要开发者在小游戏项目中自行引入，且官方已经不再维护。

## 2\. 运行框架

小游戏运行在微信原生环境中，其 JavaScript 是由 JS VM 层的 JavaScript 引擎来执行的（在 Android 平台中使用 Google 的 [V8](https://developers.google.com/v8/) 引擎，在 iOS 上使用苹果的 [JavaScriptCore](https://developer.apple.com/documentation/javascriptcore) 引擎）。有了 JS 引擎，在小游戏环境中就可以解析执行 JS 逻辑了。

前面提到，我们可以通过 wx API 来实现渲染、支付等原生和微信功能，这是通过脚本绑定技术 ① 来实现的。在小游戏环境中，通过脚本绑定技术将 iOS 和 Android 原生平台实现的渲染、网络、存储、音视频等接口，及微信原生层的用户、支付、文件、多媒体等接口绑定为 JavaScript 接口。

![运行框架](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d3447cb7c2efd~tplv-t2oaga2asx-image.image)

当然，在移植 H5 游戏到小游戏时，我们需要引入 Adapter，适配 BOM 和 DOM 的接口，以降低移植成本，抹平开发的差异性。加入 Adapter 后，开发者可调用的接口包括微信小游戏的图形渲染、微信 API 和浏览器 Adapter。

![运行框架 +adapter](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d3447cb8df38e~tplv-t2oaga2asx-image.image)

> 参考 ① ：脚本绑定技术即将原生语言的接口桥接到脚本接口上，当在脚本层调用接口时，会自动转发到原生层，调用原生接口。

## 3\. 项目结构及配置

### 目录结构

小游戏有两个必要的文件，放在根目录下：一个是 `game.js`，是项目的入口文件；另一个是 `game.json`，是项目的配置文件。

```
├── game.js
└── game.json
```

### 配置文件

开发者工具和客户端都需要读取 `game.json`，来完成相关界面渲染和属性设置。常用的配置项如下：

| key | 数据类型 | 说明 | 默认值 |
| :-- | :-- | :-- | :-- |
| deviceOrientation | String | 支持的屏幕方向 | portrait（竖屏："portrait"；横屏："landscape"） |
| showStatusBar | Boolean | 是否显示状态栏 | false |
| networkTimeout | Number | 网络请求的超时时间，单位：毫秒 | 6000 |

networkTimeout 的值还可以分别配置，示例如下：

```
{
    "deviceOrientation": "portrait",
    "showStatusBar": false,
    "networkTimeout": {	
        "request": 6000,				// wx.request 的超时时间
        "connectSocket": 6000,		// wx.connectSocket 的超时时间
        "uploadFile": 6000,			// wx.uploadFile 的超时时间
        "downloadFile": 6000			// wx.downloadFile 的超时时间
    }
}

```

除此之外，`game.json` 还可配置 workers（多线程 Worker 配置项），openDataContext（开放数据域），subpackages（分包加载配置项）等，之后的章节会在相关内容做进一步介绍。

### 分包加载的配置

分包加载，即把游戏内容按一定规则拆分成几个包，首次启动时先下载必要的包，即 “主包”。在主包内通过调用 [`wx.loadSubpackage()`](https://developers.weixin.qq.com/minigame/dev/document/subpackages/wx.loadSubpackage.html) 来触发其它分包的下载。分包加载的具体使用场景会在后文做介绍。

假设现有项目的目录结构如下：

```
├── game.js
├── game.json
├── stage1
│   └── game.js
│   └── images
│       ├── 1.png
└── stage2.js
```

现在希望将 stage1 和 stage2.js 都作做分包，需要在 `game.json` 中配置相应的 subpackages，subpackages 的路径 root 既可以是一个文件夹，也可以是单个 js 文件（没有配置在 `subpackages` 中的目录和 js，将会被打包到主包中）：

```
{
  ...
  "subpackages": [
    {
      "name": "stage1",
      "root": "stage1/" // 指定一个目录，该目录根目录下的 game.js 会作为入口文件，目录下所有资源将会统一打包
    }, {
      "name": "stage2",
      "root": "stage2.js" // 指定一个 JS 文件
    }
  ]
  ...
}
```

## 4\. 开发者工具

小游戏和小程序一样，使用微信开发者工具进行开发调试。通过微信开发者工具，开发者可以实现 API 和页面的开发调试、代码查看和编辑、小程序预览和发布等功能。

开发者工具可在 [微信公众平台](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 下载，使用时界面如下：

![开发者工具](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d3447cbbb3ca9~tplv-t2oaga2asx-image.image)

- A. 工具栏：包含编译、预览、上传和详情配置等；
- B. 模拟器：模拟小游戏在微信客户端的运行效果；
- C. 编辑器：可以对当前项目进行代码编写和文件的添加、删除以及重命名等基本操作；
- D. 调试器：使用方法和 Chrome Devtools 一致。

下面仅介绍小游戏开发调试过程中较为常用的功能，其他功能使用可查看 [官方文档](https://developers.weixin.qq.com/minigame/dev/devtools/devtools.html)：

### 编译 Ctrl\(⌘\) + B

项目编译可以使用普通编译，也可以添加自定义编译条件。自定义编译可以调试从不同场景值或携带不同参数进入具体页面的情况。微信开发者工具会自动监听脚本和配置的变动，发生变动时会自动更新。通过顶部的编译按钮也触发重新编译。

### 预览 Ctrl\(⌘\) + Shift + P

预览功能使开发者可以在真机上体验小游戏，通过点击预览按钮生成二维码，扫码即可进入小游戏。点击预览按钮后，开发者工具会对小游戏进行压缩，并将小游戏包上传到微信 CDN，所以需要一定的时间。若小游戏包超过指定体积 4096KB 则上传失败。

### 上传 Ctrl\(⌘\) + Shift + U

完成游戏的开发调试后，需要将小游戏进行上传，才能发布体验版或正式版。点击上传按钮，填写版本号及项目备注即可。上传完毕后，需要在 [微信公众平台](https://mp.weixin.qq.com) 的开发管理中将上传的包选为体验版或提交审核。

### 详情配置

详情配置中包含一些重要的项目配置选项：

![详情配置](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d3447cbfc66f1~tplv-t2oaga2asx-image.image)

- 调试基础库：展示已发布的基础库版本及用户占比，可根据需求选择对应的基础库版本（功能会有差别，在官方文档中体现）。
- ES6 转 ES5：是否将 ES6 脚本转换为 ES5（超过 500k 的文件会跳过转换）。
- 上传时代码自动压缩：是否压缩脚本（超过 500k 的文件会跳过压缩）。
- 不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书：本地测试或通过非正式域名测试时，需要勾选这个选项保证服务器的正常访问。

### 真机调试

通过预览功能，真机扫码二维码可体验游戏开发版。在真机中，通过 “打开调试” 按钮可以使用 [vConsole](https://github.com/Tencent/vConsole) 功能。具体步骤如下图：

![vConsole](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d3447cbf88459~tplv-t2oaga2asx-image.image)

## 5\. 小结

微信小游戏的开发与普通的 H5 游戏开发还是有所区分的，但始终离不开 Canvas 和 WebGL，无论是使用原生的开发，还是游戏引擎，都需要有先对 Canvas 和 WebGL 有一定的了解。在此基础上，学习微信 API，了解运行框架。现在我们对微信小游戏有了一定的认识，下一章我们将了解微信小游戏的开放能力，这决定了我们可以如何设计微信小游戏。
    