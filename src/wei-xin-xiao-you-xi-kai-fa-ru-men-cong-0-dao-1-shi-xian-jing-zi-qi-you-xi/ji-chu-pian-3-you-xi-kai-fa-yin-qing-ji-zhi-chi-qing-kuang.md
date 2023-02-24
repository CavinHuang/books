
# 基础篇 3-游戏开发引擎及支持情况
---

# 基础篇3：游戏开发引擎及支持情况

在游戏开发中使用游戏引擎，可以让开发者更专注于业务逻辑的实现。微信小游戏同样可以与游戏引擎完美配合。在本节的内容中，将为大家带来游戏引擎的介绍和游戏开发的概念介绍。

## 1\. 游戏开发引擎

游戏开发引擎涵盖的内容非常多，大致可以划分为几个模块：图形渲染、UI、动画、多媒体、网络等，较为成熟的引擎还包括粒子系统、物理模块等。多数引擎都会将功能划分为不同的包模块，开发者可以根据实际需求按需引入。以下是 LayaAir 引擎的功能图：

![Laya 引擎](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d345a74715280~tplv-t2oaga2asx-image.image)

小游戏环境的基础之上，游戏引擎不仅封装了高层接口，还尽力抹平了浏览器与小游戏环境之间的差异，具体运行框架如下：

![小游戏+游戏引擎框架](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d345a746dd3ec~tplv-t2oaga2asx-image.image)

前文提到，Adapter 脚本官方已不再继续维护，使用游戏引擎后，开发者需要自行完成额外的接口适配。但部分引擎已支持小游戏开发，用户无需担心适配问题。游戏引擎的支持情况将在后文详细展开。

## 2\. 游戏引擎的选择

国内外有许多 JS 游戏开发引擎，包括：[Egret](https://www.egret.com/index)、[LayaAir](https://www.layabox.com/)、[Cocos2d-x](http://www.cocos.com/)、[Phaser](http://phaser.io/)、[CreateJS](https://www.createjs.com/)、[Three.js](https://threejs.org/)、[Hilo](http://hiloteam.github.io/) 等，开发者在开发前需根据实际需要谨慎选择。

游戏引擎的选择，可以从以下几个维度进行衡量：支持功能、工作流与生态、应用广度。

### 支持功能

游戏引擎实现的功能直接与我们的游戏需求相关。

如果实现 2D 的游戏，大多数游戏引擎都是可以满足 2D Canvas 渲染的，部分游戏引擎还支持 WebGL 2D 渲染，并且优先启动 WebGL，以获得更高的性能。如果游戏需实现 3D 或者 VR，当然要选择对应支持这两者的引擎。

> 关于 Canvas 与 WebGL 的区别与性能差异，可移步[《这里有你对 Web 游戏的疑问吗？》](https://aotu.io/notes/2017/07/23/some-doubts-about-web-games/) 进一步了解。

| 引擎 | 2D 渲染（Canvas） | 2D 渲染（WebGL） | 3D 渲染（WebGL） | VR |
| :-- | :-- | :-- | :-- | :-- |
| Egret | ✓ | ✓ | ✓ | ✓ |
| LayaAir | ✓ | ✓ | ✓ | ✓ |
| Cocos2d-x | ✓ | ✓ | ✗ | ✗ |
| Phaser | ✓ | ✓ | ✗ | ✗ |
| CreateJS | ✓ | ✓ | ✗ | ✗ |
| Three.js | ✗ | ✗ | ✓ | ✗ |
| Hilo | ✓ | ✓ | ✗ | ✗ |

### 工作流与生态

除了支持功能以外，一个游戏的生态是否完善，社区是否活跃，是否有持续迭代，这些都会显著影响开发效率。设想一下，我们在开发中遇到一个引擎的问题，在社区中提问，迟迟得不到回应，这将给开发工作带来许多麻烦。

当我们开发一个大型的游戏时，整体的工具流就显得尤为重要。以 UI 编辑器为例，大型游戏往往涉及多个场景，会有许多的 UI 状态等，使用编码的方式可以实现 UI 的开发，但元素的资源引入、尺寸设置、定位设置等都需要反复编译调试，控件/组件（如：滚动列表、单/复选框等）逻辑可能还需要自己处理。UI 编辑器将 UI 开发简化为简单的控件/组件拖拽和拼装，这无疑可以节省许多 UI 开发的时间。但对于小型游戏来说，使用 UI 编辑器就显得大材小用了，UI 编辑器背后往往对应一套封装好的 UI 解析逻辑及控件/组件库，这对小型游戏来说是个不小的体积负担。

另一方面，引擎的文档语言（中英文）、支持的开发语言（TypeScript、JavaScript 或 其他）对不同开发者来说，也有不同的需求。中英文文档会在一定程度上影响开发者对引擎的理解，使用不同开发语言也会影响游戏的开发效率。

| 引擎 | GitHub star 数 | 文档语言 | 示例 | 开发语言 | 周边产品 |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Egret | 2.5k | 中文 | 充足 | TypeScript、JavaScript | IDE（Egret Wing，包含 可视化 UI 编辑器）、资源管理工具、粒子编辑器、骨骼编辑器、纹理合并工具、项目管理工具 等一体化解决方案 |
| LayaAir | 1.4k | 中文 | 充足 | ActionScrpit、TypeScript、JavaScript | IDE（LayaAir IDE，包含 可视化 UI 编辑器） |
| Cocos2d-x | 12.3k | 中文 | 多为 C++ 示例，JS 不多 | C++、Lua、TypeScript、JavaScript | IDE（Cocos Creator，包含 可视化 UI 编辑器） |
| Phaser | 22.5k | 英文 | 充足 | TypeScript、JavaScript | 在线编辑器 |
| CreateJS | 6.9k | 英文 | 充足 | JavaScript | \- |
| Three.js | 44.6k | 英文 | 充足 | JavaScript | \- |
| Hilo | 4.7k | 中文 | 较少，均为官方示例 | JavaScript | \- |

### 应用广度

前面提到的几个维度都是从引擎本身出发的。除此之外，我们还从市场选择的角度来分析游戏引擎。JS 游戏发展迅猛，从 H5 游戏到微信小游戏，市面上涌现了许多优秀的游戏作品。分析开发引擎在市面上游戏中使用的情况，这也能从侧面来体现一个引擎的可用性。当然，除了引擎的整体占比，开发者还可通过参考同类型的游戏对引擎的选择来进行游戏引擎的决策。

微信小游戏方面，对引擎的统计数据不多，仅首批 17 个游戏有可靠的官方数据来源，具体如下：

| 序号 | 游戏名称 | 游戏类型 | 游戏引擎 |
| :-- | :-- | :-- | :-- |
| 1 | 欢乐斗地主 | 棋牌 | Cocos2d-x |
| 2 | 四川麻将 | 棋牌 | Cocos2d-x |
| 3 | 天天德州 | 棋牌 | Cocos2d-x |
| 4 | 腾讯中国象棋 | 棋牌 | Cocos2d-x |
| 5 | 爱消除乐园 | 休闲 | Cocos2d-x |
| 6 | 欢乐消消消 | 休闲 | Cocos2d-x |
| 7 | 保卫萝卜迅玩版 | 休闲 | Cocos2d-x |
| 8 | 欢乐坦克大战 | 竞技 | Cocos2d-x |
| 9 | 广东麻将 | 棋牌 | LayaAir |
| 10 | 贵州麻将 | 棋牌 | LayaAir |
| 11 | 悦动音符 | 休闲 | LayaAir |
| 12 | 星途WeGoing | 休闲 | LayaAir |
| 13 | 全民大乐斗 | 角色 | LayaAir |
| 14 | 跳一跳 | 休闲 | Three.js |
| 15 | 纪念碑谷2x给自己的成长语录 | 休闲 | Three.js |
| 16 | 大家来找茬腾讯版 | 休闲 | Phaser |
| 17 | 拳皇命运 | 休闲 | CreateJS |

小册核心功能在于介绍微信小游戏开发，此处不对具体引擎再做进一步深入。关于游戏引擎的更多介绍，可参考[《H5游戏开发：游戏引擎入门推荐》](https://aotu.io/notes/2017/12/27/h5-game-engine-recommend/)和[《HTML5 游戏引擎深度测评》](https://cloud.tencent.com/developer/article/1075163)。

## 3\. 游戏相关概念

虽然游戏引擎百花齐放，但游戏开发离不开一些通用的基础概念（不同引擎命名可能存在差异），下面将逐一介绍（暂不介绍 3D 概念）：

### 显示对象（DisplayObject）和显示容器（DisplayObjectContainer）

显示对象既包括在舞台上可见的图形、文本、图片、视频，也包括不可见但真实存在的显示对象容器。显示容器继承自显示对象，具有增删子对象、访问子对象、检测子对象和设置层叠顺序等方法。

### 舞台（Stage）

舞台是显示游戏元素的平台，游戏的元素必须添加到舞台才能被显示。因此，舞台也是放置显示对象的最终显示容器。舞台和任何对象一样，具有属性和方法。舞台对象具有宽、高、帧频等属性，具有添加显示对象等方法。

### 场景（Scene）

部分引擎（如：Cocos2d-x、Phaser）具有场景的概念。场景的目的在于呈现出游戏的可操作部分和展现游戏场景（如：开始页、主页面、排行榜等）。场景也是一种显示容器，是一种抽象的封装。场景本身会提供场景切换的逻辑和特效（在 Cocos2d-x 中称为导演）。若引擎没有提供，我们也可以自己简单实现。

### 精灵（Sprite）

精灵是 2D 游戏中最常见的显示图像的方式。精灵可以实现位置移动、旋转（以自身几何中心或以某个屏幕坐标为轴）、缩放、逐帧（按一定时间间隔连续显示一系列图像）等动效。精灵同时也是容器类，可用来添加多个子节点。

### 矢量图（Graphics）

通过 Graphics 可以绘制矢量图，矢量图包括矩形、圆形、直线、曲线、圆弧等，为优化矢量图渲染，部分引擎还会提供抗锯齿的配置。

### 坐标系与相对坐标（Coordinate）

坐标用来管理游戏世界中物体的位置。多数引擎坐标系是以左上角的屏幕第一点为坐标原点 \(0, 0\) ，横轴是 x 轴，往右是正方向（Cocos2d-x 以左下角为原点）。相对坐标指的是容器的子元素相对于父容器的起始点 \(0, 0\) 来计算，而并不是屏幕的原点。相对坐标和缩放、旋转、位移等操作强相关。

### 适配模式（Scale Mode）

随着移动端设备（手机、平板、电视）的增多，设备碎片化、屏幕碎片化的程度也在不断增加，为使游戏在不同机器上都有一个较好的展示，游戏引擎通常会提供多种适配模式，以白鹭引擎为例：

![屏幕适配](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d34bc02fee381~tplv-t2oaga2asx-image.image)

### 渲染模式（Render Mode）

许多 2D 游戏引擎都会提供两种渲染模式：Canvas 2D 和 WebGL。这两者 API 不相同，但游戏引擎会进行抽象封装，为开发者提供一致的 API。在支持 Canvas 2D 和 WebGL 的游戏引擎中，会优先启用性能较高的 WebGL，若不兼容则回退至 Canvas 2D。 了解更多关于 Canvas 2D 和 WebGL 的内容，可移步[《这里有你对 Web 游戏的疑问吗？》](https://aotu.io/notes/2017/07/23/some-doubts-about-web-games/)。

### 帧（Frame）与帧率（FPS）

帧是影像动画中最小单位的单幅影像画面，一帧就是一副静止的画面，连续的帧就形成动画。帧率是图形处理器每秒钟能够处理图片的帧数，也可以理解为每秒钟能够刷新几次，通常用FPS（Frames Per Second）表示。每一帧都是静止的图像，快速连续地显示帧便形成了运动的假象。FPS 越高，显示的动画也越流畅。

## 4\. 引擎支持情况

目前，[Cocos](http://docs.cocos.com/creator/manual/zh/publish/publish-wechatgame.html)、 [Egret](http://developer.egret.com/cn/github/egret-docs/Engine2D/minigame/introduction/index.html)、 [Laya](https://ldc.layabox.com/doc/?nav=zh-as-5-0-1) 都已经完成了自身引擎及其工具对小游戏的适配和支持，不仅实现了对应的 Adapter，还在开发工具中实现了将项目编译成微信小游戏代码的功能，对应的官方文档已经对接入小游戏开发做了介绍。

![Cocos](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d345a7499b403~tplv-t2oaga2asx-image.image)

![Egret](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d345a749ea086~tplv-t2oaga2asx-image.image)

![LayaAir](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d345a74a6300e~tplv-t2oaga2asx-image.image)

除了上述引擎，[Phaser](http://phaser.io/)、[CreateJS](https://github.com/CreateJS)、[Three.js](https://threejs.org/) 等热门框架，均已使用到正式发布的小游戏中，开发者可自行进行适配，或查找相关项目资料。后面实战篇中，我们将使用 [Phaser](http://phaser.io/) 进行开发，也有对 Adapter 做详细介绍。

## 5\. 小结

至此，我们的基础篇讲解全部结束。在基础篇中，我们先学习了小游戏开发必备的知识，包括基础概念、小游戏的运行框架、项目结构、开发者工具等；之后了解了小游戏当前及规划中的开放能力，以及通过这些能力能实现的玩法；最后我们了解了游戏开发的概念以及市面上的游戏引擎对小游戏开发的支持情况。

接下来，我们要进入实战篇的内容，通过一个实际的游戏开发项目，学习微信小游戏从开发到调试到上线的整个流程，在这个游戏项目中，还将带来单机游戏和对战游戏两种游戏模式的讲解。跟着我们的小册，开始迎接你的第一款微信小游戏吧！
    