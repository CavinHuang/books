
# 前端预备-Vite 2.0 下一代前度开发构建工具
---

## 前言

我还是那句话，工具永远是服务于需求的。纵观整个前端生态的项目构建工具，有服务于 `React` 生态的 `create-react-app`、`umi`、`Next.js` 等。服务于 `Vue` 生态的 `Vue CLI`、`Vite`、`Nuxt.js` 等。它们都是耳熟能详的团队和大佬，为了解决各自需求而研发出来的前端构建工具。而我们要做的其实就是根据项目的需求，进行合理的选择和学习。说白了，在你没有决定权的时候，公司用什么，你就学什么。在你有话语权，能自己抉择的时候，哪个让你开发起来比较舒服，就用哪个。

这些构建工具中，有一个比较特殊，那就是 `Vite`，它是尤雨溪在发布 `Vue 3.0` 时，同步推出的一款前端构建工具。它不光服务于 `Vue`，同时也对其他的框架如 `React`、`Svelte`、`Preact` 都有一定的支持，我们本着学新不学旧的理念，在项目中引进了 `Vite` 作为构建工具。

在开始使用 `Vite` 之前，我们来认识一下它。

#### 知识点

- `Vite` 是什么。

- `Vite` 与 `Webpack` 相比优势在哪里。

- `Vite` 的构建原理。

## Vite 是什么

我们引用官方的一句话来介绍它，“下一代前端开发与构建工具”。

它有以下几个特点：

1、 快速启动，`Vite` 会在本地启动一个开发服务器，来管理开发环境的资源请求。

2、相比 `Webpack` 的开发环境打包构建，它在开发环境下是无需打包的，热更新相比 `Webpack` 会快很多。

3、原生 `ES Module`，要什么就当场给你什么。而 `Webpack` 则是先将资源构建好之后，再根据你的需要，分配给你想要的资源。

尤雨溪在发布 `Vite` 前，发过这么一条微博。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b6344806ae94c96b9060fb0a3b13381~tplv-k3u1fbpfcp-zoom-1.image)

从话语间可以看出，尤雨溪团队对该打包工具也是报以厚望，所以这里大家可以不必担心后续它们会放弃维护这个项目，当然也不能打包票。

## Vite 与 Webpack 相比优势在哪里

接下来我们来聊聊，为什么说它是下一代前端开发与构建工具。是不是当代构建工具出了什么问题？

我们知道当代的前端构建工具有很多，比较受欢迎的有 `Webpack`、`Rollup`、`Parcel`等，绝大多数脚手架工具都是使用 `Webpack` 作为构建工具，如 `Vue-CLI`。

在利用 `Webpack` 作为构建工具时，开发过程中，每次修改代码，都会导致重新编译，随着项目代码量的增多，热更新的速度也随之变慢，甚至要几秒钟才能看到视图的更新。

生产环境下，它将各个模块之间通过编码的方式联系在一起，最终生成一个庞大的 `bundle` 文件。

导致这些问题出现的原因，有以下几点：

1、`HTTP 1.1` 时代，各个浏览器资源请求并发是有上限的（如谷歌浏览器为 6 个，这导致你必须要减少资源请求数）。

2、浏览器并不支持 `CommonJS` 模块化系统（它不能直接运行在浏览器环境下，它是 `Node` 提出的模块化规范，所以需要经过 `Webpack` 的打包，编译成浏览器可识别的 JS 脚本）

3、模块与模块之间的依赖顺序和管理问题（文件依赖层级越多，静态资源也就变得越多，如果一个资源有 100 个依赖关系，可能需要加载 100 个网络请求，这对生产环境可能是灾难，所以在生产环境最终会打包成一个 `bundle` 脚本，会提前进行资源按需加载的配置。）

#### 那么为什么现在又出现了不打包的构建趋势？

1、工程越来越庞大，热更新变得缓慢，十分影响开发体验。推动着我们不断地去创新，不断地尝试着去突破瓶颈。

2、各大浏览器已经开始慢慢的支持原生 `ES Module` \(谷歌、火狐、`Safari`、`Edge` 的最新版本，都已支持。这让我们看到了希望\)。

3、`HTTP 2.0` 采用的多路复用。不用太担心请求并发量的问题。

4、越来越多的 `npm` 包开始采用了原生 `ESM` 的开发形式。虽然还有很多包不支持，但是我相信这将会是趋势。

我们通过表格的形式，对比一下 `bundle` 和 `bundleless` 的区别。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff916f65816b469989198bdc2ec18fd1~tplv-k3u1fbpfcp-zoom-1.image)

## Vite 构建原理

众所周知，`Vite` 的生产模式和开发模式是不同的概念。我们先聊聊，`Vite` 的开发模式。

首先要明确一点，`Vite` 在开发模式下，有一个 依赖预构建 的概念。

#### 什么是依赖预构建

在 `Vite` 启动开发服务器之后，它将第三方依赖的多个静态资源整合为一个，比如 `lodash`、`qs`、`axios` 等这类资源包，存入 ·node\_modules/.vite 文件下。

#### 为什么需要依赖预构建

如果直接采用 `ES Module` 的形式开发代码，会产生一大串依赖，就好像俄罗斯套娃一样，一层一层的嵌套，在浏览器资源有限的情况下，同时请求大量的静态资源，会造成浏览器的卡顿，并且资源响应的时间也会变慢。

我们先不通过 `Vite`，而是手动搭建原生 `ES Module` 开发形式，通过引入 `lodash-es` 包，实现一个数组去重的小例子，来详细分析为什么需要依赖预构建。

新建 `test1` 文件夹，通过 `npm init \-y` 初始化了一个前端工程：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eabc5b637e734347b8e7965496669fee~tplv-k3u1fbpfcp-zoom-1.image)

手动新建 `index.html`，通过 `script` 标签，引入 `main.js`。这里注意，需要将 `type` 属性设置为 `module`，这样才能支持 `ES Module` 模块化开发。

通过 `npm` 安装 `lodash-es`，这里我们之所以不使用 `lodash`，是因为 `lodash` 不是通过 `ES Module` 形式开发的，直接通过相对路径引入会报错，需要通过 `Webpack` 打包构建。

```bash
npm i lodash-es
```

新建 `main.js` 添加去重逻辑：

```javascript
import uniq from './node_modules/lodash-es/uniq.js'

const arr = [1, 2, 3, 3, 4]

console.log(uniq(arr))
```

这里我们采用 `VSCode` 的插件，`Live Server`，来启动项目。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30054fefbeaf485a96db8d4a4d8f5aad~tplv-k3u1fbpfcp-zoom-1.image)

安装完之后，在项目中双击 `index.html`，找到右下角的 「Go Live」，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64858bc1bd3e4206a4b996c8ba4f5d74~tplv-k3u1fbpfcp-zoom-1.image)

点击后，自动启动一个 `Web` 服务，浏览器自动打开，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3858ec887f744781b6c45fadad638c2c~tplv-k3u1fbpfcp-zoom-1.image)

结果正确，数组中的 3 被去除了，接下来关键的一个点，我们点击 `Network` 查看，资源引入情况：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9b9e60c097184e20a78cb8198968b199~tplv-k3u1fbpfcp-zoom-1.image)

我们只是获取去重方法，却意外引入了 59 资源，这是为什么呢？

我们先查看 `main.js` 内的代码，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f001d806817f4ed5a9ad521c9a91a6d5~tplv-k3u1fbpfcp-zoom-1.image)

代码中只有在首行通过 `import` 引入了 `./node_modules/lodash-es/uniq.js`，所以 `uniq.js` 被作为资源引入进来，我们再看 `uniq.js` 的情况：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b21e238127c47ec8f69b16775b4bb08~tplv-k3u1fbpfcp-zoom-1.image)

`uniq.js` 中，首行通过 `import` 引入了 `_baseUniq.js`，我们继续：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6392953fd6b043ea99355687a5569763~tplv-k3u1fbpfcp-zoom-1.image)

`_baseUniq.js` 中，引入了上图箭头中的一些脚本，不用往下看，我盲猜这种俄罗斯套娃的模式，会一直引用到 `uniq.js` 相关的所有脚本代码。

这只是一个 `uniq` 方法，足足就引入了 59 个资源，这仿佛是在军训浏览器，也就是谷歌能跟它博弈几个回合，引入的包再多几个，我估计也是顶不住的。

所以这时候 `Vite` 便引入了「依赖预构建」的概念。

#### 依赖现预构建浅析

同样的，再通过 `Vite` 构建出一个 `React` 项目，去实现上述逻辑，我们观察 `Vite` 是怎么作的。

首先通过 `Vite` 指令生成项目：

```bash
npm init @vitejs/app test2 --template react
```

并安装 `lodash-es`，修改入口脚本 `main.jsx`：

```javascript
import uniq from 'lodash-es/uniq.js'

const arr = [1, 2, 3, 3, 4]

console.log(uniq(arr))
```

我们观察浏览器的 `Network`，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dce2afc266e84fa79ee8c9a0c0266c85~tplv-k3u1fbpfcp-zoom-1.image)

注意上图，执行 `npm run dev` 后，脚本中引用 `lodash-es/uniq` 的路径是在 `/node_modules/.vite` 文件夹下，并且左下角的请求资源数，也没有我们之前原生 `ES Module` 时的多，少了足足 3/4 还多。

再观察文件目录：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/715c51aaea93420dac55e3ccca003222~tplv-k3u1fbpfcp-zoom-1.image)

`lodash-es/uniq` 已经被 `Vite` 提前预编译到了 `.vite` 文件夹下，这样代码中直接去这个文件夹拿现成的包，就不必再递归地去加载很多静态资源脚本。

## 总结

本章节，通过实例分析，对 `Vite` 有了初步的了解。那么下一章节，我将带大家通过 `Vite` 去搭建一个 `React` 的完整开发环境。
    