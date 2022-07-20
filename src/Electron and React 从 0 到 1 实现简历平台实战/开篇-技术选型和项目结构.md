
# 开篇-技术选型和项目结构
---

## 三分天下

古有东汉末年分三国，现存 React、Vue、Angular 三分天下。其实在前端刀耕火种时期，三大框架割据时代根本不存在，也没有那么多脚手架。

随着时代的迁移，前端技术的发展，三大框架出现并逐步瓜分市场，最先出现的是 Angular，紧随其后的是 React，在 2014 年，由尤大大开发的 Vue 横空出世，成为一匹黑马。

我个人是比较喜欢 React 的，它的核心语法在于 JSX，奈何浏览器并不认识 JSX 是什么东西（虽然你跟 JS 长得很像，但我浏览器慧眼识珠，一眼看出你不是我认定的人）为此，React 需要引入编译，将其编译为浏览器认识的 JS 语法。

那么通过什么进行编译？目前业界较为流行的解决方案是 `Babel`，它是一款 JS 编译器，把高版本语法编译成低版本语法，换言之，Babel 能将文件按照自定义规则转换成浏览器能识别的 js 语法。

需要区分 `Babel 编译器` 和 `Webpack打包编译`，这是两个不同的东西。Webpack 是打包工具，定义入口文件，将所有模块引入整理，通过 Loader 和 Plugin 处理后，打包输出。一个用于编译，一个用于打包输出，两者各司其职，直到有一天，有人就想将它们结合在一块，于是 `babel-loader` 出现了，它允许 Webpack 通过 babel-loader 使用 Babel。

## 技术选型

前边介绍三大框架出现顺序以及为什么需要使用 Babel、Webpack，接下来讲解此小册的技术选型～

**小册所配套的项目是通过 Electron + React Hooks ，搭配目前火热的 TypeScript，打造一款轻巧实用的简历平台桌面应用**。

我们选用目前相对热门的技术框架 `React` 构建用户界面，主要原因为：第一，笔者没接触过 Angular，第二，笔者近两年半没写 Vue ，从时间成本上考虑，笔者认为采用 React 开发会更快。

其次，还需要 `TypeScript`，通过 TS 可以让我们在编写代码阶段，避免许多低级报错，比如：

- Uncaught TypeError: Cannot read property
- Uncaught RangeError: Maximum call stack
- TypeError: undefined is not an object
- ......

当然还有另一个原因是：在求职过程中，它是你的亮点或者加分项，有些公司甚至已将其作为必备技能。所以掌握 TS 对你来讲是利大于弊。

要数目前较为热门的桌面应用框架，非 Electron 莫属，它自吹：**“如果你可以建一个网站，你就可以建一个桌面应用程序 ”**。它支持我们使用看家本领来构建应用。**实践是检验真理的唯一标准**，我们通过上手实践，开发一款简洁轻巧的桌面应用。至此，我们的主要框架结构如下图所示

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/354dda56771d480490654ec971b11645~tplv-k3u1fbpfcp-watermark.image)

> 如果你对上图关于 Electron 的知识点存在困惑，不用担心，阿宽会在第二章节中为你讲解。

## React 相关技术栈

必备技术栈：React 全家桶套餐，经济实惠！

存储方面，我们有诸多选择，例如 `localStorage`、`sessionStorage`、`indexDB`，或选择 `Redux`，得益于 Electron 内置了 Node 模块，自然而然地，我们还可以通过读写文件的方式进行存储。

我们来看看简历平台的数据特点：字段属性多、操作频繁、数据实时响应

假设采用 localStorage、sessionStorage、本地文件等方式来存储用户简历信息，那需要解决的一个重要问题是：**数据如何进行实时响应 \?**

业界内较为流行的方案是：采用 Redux，可能会有很多小伙伴会问，还有许多可选方案，如: Recoil、Dva、Mobx 等，为什么采用 Redux ？从成本、生态、热度等综合考虑，Redux 更甚一筹，并且 Redux 成名多年，生态圈完善，业内口碑不错，所以最后采用了 Redux 状态管理容器。

为了简化 Redux 的繁琐操作，笔者引入了 [🌈 rc-redux-model](https://github.com/SugarTurboS/rc-redux-model) 进行提高效率。

为此，我们 React 最后的技术栈为：

- react 全家桶套餐
  - react: 版本在 `^17.0.1` ，用新不用旧嘛
  - react-router
  - react-router-dom
- redux: 状态管理容器
- rc-redux-model: 让 redux 使用起来更加方便
- redux-logger: 控制台看到最新 redux 的数据

## 配置相关技术栈

**Babel**

当前主流的 JS 编译器，我们可以从官网看到 [Babel 和 React JSX](https://babeljs.io/docs/en/#jsx-and-react) 的关系。所以通过 Babel 将我们的 React JSX 转成浏览器所能识别的 JS 语法是有必要的。

**Webpack**

好评率较高的打包工具，如果说你的应用程序非常小，没有什么静态资源，只需要一个 JS 文件就可以满足需求，这时使用 Webpack 并不是一个好的选择。很明显，我们的简历平台并不符合这种场景。

> 如果你对 Webpack 还不太了解，建议阅读[彩蛋篇-Webpack基础介绍与两大利器](https://juejin.cn/book/6950646725295996940/section/6962895331730620423)

我们可能会遇到一些问题：

- webpack 将我们模块打包好之后，我们手动写一个 html，加载打包好的资源，这没问题，但能自动化的事情，不香吗？不禁思考，能否通过 webpack 来生成 html 页面？
- build 打包后的 index.html 直接打开即可，但随即带来的问题是: 没有热更新，我改一个字母、一句文案，都需要 build 一次才能看到结果，这种开始方式有些原始，怎么办？
- 环境区分，很多时候我们需要针对不同环境进行不同操作，当配置文件大了之后，里边充斥着大量的三元运算符用户环境判断，属实蛋疼，怎么办？

上述问题业界内较好的解决方案是 [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/#root)、[webpack-dev-server](https://webpack.js.org/configuration/dev-server/) 和 [webpack-merge](https://webpack.js.org/guides/production/#setup)，同学们可以私下了解它们的工作原理。

**TypeScript**

小伙伴们是否有过这种体会，奋笔疾书的写下了一段代码，Ctrl+S 保存，Hot 热更新，然后页面白屏。

回头一看，原来 `[...Array.from()]` 写成了 `[...Array.form()]`， 诸如此类问题还有许多，[Rollbar 平台统计了前端项目中 Top10 的错误类型](https://rollbar.com/blog/top-10-javascript-errors/)，排在最前面的就是：

```
Uncaught TypeError: Cannot read property xxx of undefined
```

为了在编写代码阶段，就能规避此类低级 Bug 问题，我们引入了 TypeScript。同时采用 eslint + prettier 进行代码风格检查和代码自动格式化，毕竟阿宽有点代码洁癖。

为此，我们相关配置最后的技术栈为：

- Babel
- Webpack
- Eslint
- Prettier
- TypeScript
- ......

## 部分效果图

> 关于最后一个章节-[期望篇-可视化自定义独特的简历模版](https://juejin.cn/book/6950646725295996940/section/6953057711445671943)的截图将在之后进行补全，可以期待一下～

1.  首页

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/922146a39661431aa8a5f9f053e8d747~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b27b764c0b274def99ce8d6f728955e0~tplv-k3u1fbpfcp-watermark.image)

2.  模版列表页

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b313159241145d2ad15dade1063ead1~tplv-k3u1fbpfcp-watermark.image)

3.  制作简历页

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3576e5eaf45b42c38429af364c51644d~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b3d5b58d9954914962fdd44b37be1b0~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c70eab719d2c4d6981717e23d6780be3~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9748987bac0b4f97913dd2b274cf87f1~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c92abf2246e64a13a9c0b9b7beb262f7~tplv-k3u1fbpfcp-watermark.image)

4.  导出简历信息

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02490b74bb564a27902d6cee051c7fdb~tplv-k3u1fbpfcp-watermark.image)

5.  导出 `名字+学校+职位` PDF

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7d7fdab52954dbfa6995b95b95deef3~tplv-k3u1fbpfcp-watermark.image)

> 上述是部分截图，其中的布局、样式、交互均纯手工制作，未采用任何 UI 库，导出的简历并不模糊，可放心使用

## 总结

以开发者的身份，在动手前大致罗列所需的技术栈，以提问的方式去述说技术的选型，接下来将会在动手前，讲解其中的一些技术知识点。望与大家一起进步

如果对本章节存在疑问，欢迎在评论区留言。
    