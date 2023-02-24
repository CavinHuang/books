
# Canvas 的应用场景
---

# Canvas 的应用场景

经过第 1 节的介绍，你应该了解

- Canvas 的介绍
- Canvas 提出的背景
- Canvas 和其他在 Web 中显示图像的技术的区别

你应该已经明白 Canvas 究竟是什么和 Canvas 的大致用途。\(づ｡◕‿‿◕｡\)づ

这一节将为你展示 30+ 个 Canvas 实例，让你感受下 Canvas 的强大作用。

## 绘制图表

绘制图表应该是 Canvas 最为**实用**的功能之一了吧\(๑•̀ㅂ•́\)و✧

因为 Canvas 通过 JavaScript 可以动态传入参数绘制图形，所以我们可以使用 Canvas 作为容器，通过 JavaScript 动态传入的参数将数据以图表的形式显示出来。

不仅显示更为方便，而且修改数据也同样的简单。同时也可以有一些简单的动画和交互效果，对于可视化的数据展示更为友好。

这些都是传统的 png/jpg 静态显示图片所不能比拟的。

现在的一些数据可视化的 js 库（如 ECharts）大部分都是使用 Canvas 实现的。

![ECharts 官网示例](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe27895fb5fb70~tplv-t2oaga2asx-image.image)

## 小游戏

如今人们使用手机的频率越来越高，因此用浏览器打开网址就可以玩的游戏越来越受到开发者和用户的喜爱。

而 Canvas 因其独特的性质可以说是 Web 游戏的不二之选，基本上所有的 HTML5 游戏引擎都是基于 Canvas 开发的。那么为什么会使用 Canvas 来开发游戏呢？

首先是因为 Canvas 不需要借助任何插件就可以在网页中绘图。并且其强大的绘图 API 可以操纵页面上的每一个元素。

下面我们来欣赏一下用 Canvas 制作的几款简单的小游戏\~

![赛车小游戏](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe27a59790d64c~tplv-t2oaga2asx-image.image)

这是一款小型的赛车游戏，可以使用键盘的方向键来控制赛车的行驶方向，没有按键操作，速度就会变成 0。

![五子棋小游戏](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe27b6ba8f06b5~tplv-t2oaga2asx-image.image)

这是一款五子棋的小游戏，模拟五子棋游戏规则，游戏开始时一方先走，然后另一方再走，依次循环，直至一方有连成一条线的五个棋子，会自动判断输赢。

![俄罗斯方块](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe27eb875ad23e~tplv-t2oaga2asx-image.image)

就连经典的俄罗斯方块游戏也可以使用 Canvas 来制作。也是需要通过键盘的方向键来控制方块，左右方向键是控制方块移动的方向，下键是加速下落，上键是翻转方块，直至某一行完全被填满就被消除。

![你画我猜小游戏](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe28005f725c9a~tplv-t2oaga2asx-image.image)

还有前一段挺火的你画我猜小游戏也可以通过 Canvas 来实现。保存了鼠标的轨迹，还有清除屏幕和橡皮擦等功能。也可以将其保存为一张图片。

![迷宫小球小游戏](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe274320d11c8b~tplv-t2oaga2asx-image.image)

手残党，这个 gif 录制了好几遍\(ಥ\_ಥ\)。 这是一款迷宫类的小游戏，同样是通过键盘的方向键来控制小球的移动，最终到达某个地点就会判定通过游戏。

## 活动页面

相信很多的营销活动大家都做过，Canvas 也可以写活动页面哦\~\(๑•̀ㅂ•́\)و，✧这是很多公司的营销策略\~

例如： ![转盘抽奖活动](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe28125880f46e~tplv-t2oaga2asx-image.image)

很常见的活动页面，某宝店铺的常见套路，模拟转盘抽奖。点击按钮，转盘转动，然后转盘停止，指针落在哪个区域就提示中奖的奖品。

![刮刮乐抽奖活动](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe2817fd861e29~tplv-t2oaga2asx-image.image)

另一个比较常见的活动页面是刮刮乐的页面，在刮刮乐的区域，鼠标会显示为硬币的形状，然后按住鼠标并拖动，经过区域就会显示出最底层的图片，同时上层图片消失。模拟刮刮乐效果，刮开一定比例面积之后“刮奖”完成，返回回调函数。

## 小特效

Canvas 还可以做一些小特效哦，这些小特效可以装饰你 的网站，使它变得更加精致\~

![纸片下落特效](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe283202248787~tplv-t2oaga2asx-image.image)

这个特效也可以在活动页面中用到。逼真的模拟了纸片下落的过程，随机出现的纸片有随机生成的颜色，然后模拟重力下落过程。

![粒子组合文字特效](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe284d4b99886a~tplv-t2oaga2asx-image.image)

这个其实是很不错的，只不过 gif 图片看得不是特别清楚。随机生成的大小随机的圆形或方形粒子组成指定的文字，粒子会自动缩放，给人闪烁的感觉。

![数字时钟特效](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe2862d7603a24~tplv-t2oaga2asx-image.image)

这个特效也是由粒子组合成文字的特效，只不过文字的内容是当前的时间，因为是 gif 图，所以大家看不到和鼠标的交互，这里粒子散开是因为我鼠标进行了点击，就是点击屏幕，粒子就会散开，点击的时间越长，粒子就越分散。当松开鼠标之后，所有的粒子就又全部回到原位\~

试想一下，如果你的个人网站中的当前时间使用了这样一个小特效，是不是会让访客觉得很有趣呢\~٩\(๑>◡\<๑\)۶

![loading 特效](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/16/15fc364e6522d39d~tplv-t2oaga2asx-image.image)

同样的小特效还有这个 loading，使用 canvas 制作一个这样的 loading，也会给你的网站增添亮点。

## 炫酷背景

上述几种应用场景都只是带大家了解一下，不做过多的介绍，当然也还有其他的应用场景，这里也不过多的介绍，下面来介绍下本小册主要给大家分析的效果：炫酷背景特效。

因为 Canvas 的特性，所以如果你的网站想要一个炫酷的背景，那么 Canvas 无疑是最好的选择，让我们一起来欣赏一下 canvas 可以做出哪些炫酷的背景。

![3D 线条](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe28f9d8ee1449~tplv-t2oaga2asx-image.image)

这个特效是使用 three.js 和 Canvas 制作出的 3D 线条，随机生成的线条构建成 3D 的立体空间，还有和鼠标的交互，鼠标的移动会使得 3D 空间移动。

![气泡背景](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe2a6812d8a174~tplv-t2oaga2asx-image.image)

这个气泡背景也是很赞的，随机生成透明度不同的气泡，气泡不断移动，渐变色的背景也在不断变换，给人以梦幻的感觉。

![棱角背景](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe2aa2fc8c1e32~tplv-t2oaga2asx-image.image)

这个的变换频率其实没有这么快，两次变换中间是有几秒钟的停留时间的，因为制作的 gif 大小有要求，所以中间的给截掉了，只保留变换的部分。

这个特效给人的感觉是和钻石表面类似的菱角感觉，然后背景也是使用的渐变的颜色。一定时间就会变换一次。QQ 的登录框就是和这个类似的特效。

![代码雨背景](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe2b9426054ef9~tplv-t2oaga2asx-image.image)

这个背景是黑客帝国的代码雨特效，可能男程序员会比较喜欢，代码从上向下下落的效果。

![星空连线背景](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe2bd9b769d71e~tplv-t2oaga2asx-image.image)

我个人是很喜欢这个特效的，前一段时间也将其作为我的个人博客的背景，该特效的背景是一个渐变色，随机生成的“小星星”会从下向上移动，最重要的是和鼠标有互动。鼠标经过的地方会产生“星星”并自动和其他的星星连成线。

![流星雨特效](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe2bfc68ac5a1f~tplv-t2oaga2asx-image.image)

这个特效也是很不错的，模拟星空，随机生成的 “星星” 会有位移，透明度也在不断变化，会有 “流星” 随机从上向下掉落，并会有小尾巴的效果\~

![线条圈圈滚动背景](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/22/15fe2c1e63c319bf~tplv-t2oaga2asx-image.image)

这个特效是以黑色为背景，彩色的随机实心 + 空心圆圈构成，所有的圈圈用直线相连，并且一直移动。

![相交线特效](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/23/15fe78e69c06436c~tplv-t2oaga2asx-image.image) 这个相交线特效其实也很简单，随机生成的线条在移动，相交的地方为小圆点。

带大家欣赏完这么多的特效之后，你是不是已经想使用 Canvas 来装饰你的个人网站了呢？心动不如行动，下面来带大家一起从零开始，一点一点分析怎么制作属于你自己的炫酷网页背景特效\~ε==\(づ′▽\`\)づ

**划重点：第 3 节的最后给出了本小册中全部特效的源码\~ \(｡♥‿♥｡\)** ha
    