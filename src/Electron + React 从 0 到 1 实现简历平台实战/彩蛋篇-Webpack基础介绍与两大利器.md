
# 彩蛋篇-Webpack基础介绍与两大利器
---

## Webpack 概念

本小节主要介绍 Webpack 相关知识，聊聊 Webpack 的由来以为我们为什么要使用 Webpack，通过两大利器：Loader 与 Plugins 进行讲解，整篇内容相对较长，请耐住性子阅读。

> 如果对 Webpack 熟悉的同学，本章可以快速阅读或跳过，如果对 Webpack 不熟悉的同学，希望本章节可以帮你快速熟悉 Webpack 开发

要想快速知道 Webpack 是什么，最好的方式就是通过官网去了解它。通过官方介绍，我们可以知道：webpack 是一个现代 JavaScript 应用程序的静态模块打包器\(module bundler\)。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1565cb26fb9247519de7c1a3fc1e44b0~tplv-k3u1fbpfcp-watermark.image)

在最初，Webpack 并不被人熟知，它刚出现时，主打的优势是 [Code Splitting](https://webpack.docschina.org/guides/code-splitting/)，我们现在从官网也能看到对它的定义：

> Code Splitting : 代码分离指将代码分成不同的包/块，然后可以按需加载，而不是加载包含所有内容的单个包。

什么时候 Webpack 才受人关注？2014 年，Instagram 的前端团队在一次大会上**分享其内部前端页面加载性能优化，提到最重要的一点就是用到了 Webpack 的 Code Splitting**。

这简直就是为 Webpack 好友助力了一波，之后形成了一个热潮。Webpack 的风口来了，很多公司纷纷使用 Webpack，并贡献了无数的 Plugin、Loader，你一刀，我一刀，明天 Webpack 就出道，果不其然，短短时间内，Webpack 被推上了高潮。

大家都用，我需要用吗？如果说你的应用程序非常小，没有什么静态资源，只需要一个 JS 文件就可以满足需求，这时使用 Webpack 并不是一个好的选择。至于你用与不用，得靠你自身评估～

## 两大利器

得益于 Webpack 扩展性强，插件机制完善，官方提供了许多的 Loader、Plugin，接下来通过问题，配合简单明了的 demo，给大家讲解这两大利器，在此之前，我们先全局安装一下 Webpack。

```bash
npm install webpack@4.44.1 --save --dev
npm install webpack-cli@3.3.12 --save --dev
```

### Loader 模块打包方案

[官方](null)对 Loader 的介绍是：Webpack 可以使用 Loader 来预处理文件。这允许你打包除 JS 之外的任何静态资源。

在我看来，`Loader 就是一种模块打包方案`，怎么理解？给大家科普一个知识点：**Webpack 默认是知道如何打包 js 类型文件，但对于其他类型文件，它是不知道如何处理**，我们得告诉它，对这种类型文件，打包的方案是什么。接下来，我们通过例子，帮助小伙伴们理解为什么我说它是一种方案。

我们新建一个 `demo` 文件夹，创建一个 `index.js` 文件，文件结构是这样的

```
├── demo
│ └── index.js
└──...
```

此时我们在 `index.js` 中写下这行代码

```js
// index.js
const myName = '我叫彭道宽';
console.log(myName);
```

执行一下 `npx webpack index.js`，意思就是对我们的 index.js 文件打包。

我们在终端可以看到，在不配置任何东西情况下，Webpack 也能够打包 JS 类型文件，这说明 Webpack 默认对 JS 文件是有一套打包方案的

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bf000443fd54732ae601bcf0a1d5e1f~tplv-k3u1fbpfcp-watermark.image)

接下来，我们将代码改成这样，引入我们的图片

```js
// index.js
import myPdkAvatar from './avatar.jpg';

const myName = '我叫彭道宽';
console.log(myName);
```

同上，执行 `npx webpack index.js`，此时会报错。对 jpg 类型的文件打包失败了

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71d1fb1bf3fe44e691724e0422d1323c~tplv-k3u1fbpfcp-watermark.image)

Webpack 很友好，它会告诉你，你需要一个 loader 去处理此文件类型。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b0d4e224f134378a593e264a0a330b4~tplv-k3u1fbpfcp-watermark.image)

官方提供了一种专门处理此类型的方案：[file-loader](https://www.webpackjs.com/loaders/file-loader/)，我们安装一下这个 loader

```bash
npm install --save-dev file-loader
```

接着新增一个文件 `webpack.config.js`，此时的文件结构是这样的

```
├── demo
│ ├── index.js
│ └── webpack.config.js
└──...
```

我们在配置文件中，**添加一下对于 jpg 这种类型文件的处理方案**

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.jpg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ],
  },
};
```

解读一下这段代码，意思就是：当遇到模块\(module\)时，进行规则\(rules\)匹配，如果匹配到 `/\.jpg$/` 类型的文件，就采用 `file-loader` 方案进行打包，并且配置了参数：`name`与`outputPath`，意味着打包后的文件名是按照 `[文件名]_[哈希值].[源类型]` 规则命名，并且输出在 `images/` 目录下

理解了这段代码含义之后，我们再来打包，看看结果如何，执行 `npx webpack index.js`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e30b66c5ca71467aaba964b677b184bf~tplv-k3u1fbpfcp-watermark.image)

打包正常！我们再看看打包之后的 dist 文件下，是不是真的有个 `images/` 目录存放着打包后的图片\?

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27e0a5ea32264ae8815ff36bfdedd585~tplv-k3u1fbpfcp-watermark.image)

如我们所想，现在回过头细品，**Loader 就是一种模块打包方案**是不是也有点道理？下面写几行代码，大家细品细品

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        use: {
          loader: 'less-loader',
        },
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
        },
      },
    ],
  },
};
```

### Plugins 打包更加便捷

继续以上边的 Loader demo 为例子，回顾一下我们现在 demo 的文件目录结构

```
├── demo
│ ├── index.js
│ └── webpack.config.js
└──
```

我们先来执行一下 `npx webpack index.js`，来看看 dist 目录下有哪些文件

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ff96000b5354e869fb01aabae2dff36~tplv-k3u1fbpfcp-watermark.image)

> 通过官网可知，在我们未配置 `output` 属性时，它的默认值是 ./dist/main.js，其他生成文件默认放置在 ./dist 文件夹中。

> 因为我们都用的默认配置，所以打包生成的文件夹名就叫 dist，bundle 默认名称就是 main.js

接下来我们**手动**创建一个 HTML，加载打包后的 js 文件，如何加载呢？通过 script 加载打包后的 `main.js`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>webpack plugins demo</title>
  </head>
  <body>
    <div id="root"></div>

    <!-- 在这里加载打包好之后的 main.js 文件 -->
    <script src="./dist/main.js"></script>
  </body>
</html>
```

然后运行此页面，通过控制台，可以看到会打印出：`我叫彭道宽`

假设现在有一种场景，需要通过 hash 进行命名输出的 bundle。我们来修改一下 `webpack.config.js`

```js
module.exports = {
  // 1. webpack 执行构建的第一步将从 entry 开始，这里我们的入口文件为 index.js
  entry: './index.js',

  // 2. 经过一系列处理得到最终的代码，然后输出结果
  output: {
    // 这里将输出的结果代码文件自定义配置文件名
    filename: '[彭道宽]_[hash].bundle.js',
  },
  // ...
};
```

执行 `npx webpack index.js`，来看看打包之后的文件命名格式是否如我们预期

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d44610242aaf4ffe9b14fc3f1666ad7a~tplv-k3u1fbpfcp-watermark.image)

没毛病，这时候我们 HTML 加载该怎么办？**手动修改成正确的文件地址**

```html
<script src="./dist/[彭道宽]_657b45ee79dee39108f7.bundle.js"></script>
```

如果我们将 index.js 文件中的内容修改（👇 下面添加一行代码）

```js
// index.js
import myPdkAvatar from './avatar.jpg';

const myName = '我叫彭道宽';
console.log(myName);

// 👇 添加一行新代码
console.log('new add code ......');
```

然后把 dist 目录删除，再打包一次，看看文件 hash 是否一致？

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8ce090f88d04b75ad5274c442505ff5~tplv-k3u1fbpfcp-watermark.image)

通过对比，我们发现，每次修改，重新打包生成的 bundle 文件名哈希值都不一样。**等价于每次打包都需要手动修改 HTML 中的文件引用**。

太原始太麻烦了，低效率！为此，Webpack 提供了 Plugins 插件能力，让 Webpack 变得更加灵活。

官方提供了很多 Plugins，让我们的打包更加便捷，上面的问题，我们可以通过 [HtmlWebpackPlugin](https://v4.webpack.docschina.org/plugins/html-webpack-plugin/) 插件进行简化 HTML 文件的创建，这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用！

多说无益，上手试试，先根据文档，安装一下插件，看看它能实现怎样的效果

```bash
npm install --save-dev html-webpack-plugin
```

安装好之后，我们来修改 `webpack.config.js` 内容，将这个插件引入

```js
// 👇 引入此插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: '[彭道宽]_[hash].bundle.js',
  },
  // 👇 使用此插件
  plugins: [new HtmlWebpackPlugin()],
};
```

执行一下 `npx webpack index.js`，打包的出来的文件有哪些？

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a848d93d2c94ae9b4bf4aee312f219e~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5fd3562a81114c03bb370512f3e93022~tplv-k3u1fbpfcp-watermark.image)

**HtmlWebpackPlugin 会在打包结束后，自动帮我们生成一个 HTML 文件，同时把打包后的 bundle 自动引入**。当我们内容修改，重新打包，生成的 HTML 也会随着每次编译导致哈希变化的 bundle 自动引入。

是不是很完美呢？不，我们采用火眼金睛瞧一瞧由 HtmlWebpackPlugin 生成的 HTML 文件，你会发现好像有些问题？是不是 `body` 下少了一些 DOM 节点（比如 Vue、React 都会有一个 id 为 app 的 DOM 元素），怎么办？这是该插件默认生成的，有没有办法生成我想要的 DOM 结构呢？

HtmlWebpackPlugin 提供了一个配置参数 `template`，它允许你自定义 HTML 文件，以此文件为模版，生成一份一样的 HTML 并为你自动引入打包后的 bundle。

我们来动手实现一下，首先定义一份“别具一格”的 HTML 模版。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>我是 HtmlWebpackPlugin 的模版</title>
    <style>
      * {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div id="pdk">PDK Demo</div>
    </div>
  </body>
</html>
```

然后通过修改 `webpack.config.js` 配置，采用此模版为基础

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    filename: '[彭道宽]_[hash].bundle.js',
  },
  plugins: [
    // 👇 以我们写的 html 为模版生成
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
};
```

最后我们来瞧瞧，是否打包后自动生成的 HTML 文件结构跟我们的模版一致？

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79dfdeabf9094188bc81aafdba53f7bd~tplv-k3u1fbpfcp-watermark.image)

事实证明，确实一模一样。

官方还有很多精巧有用的 Plugins 插件，几乎每个插件目的都是出于让你的打包构建更加便捷。小伙伴们要善于使用搜索引擎去寻找所需的插件工具（官方插件或第三方 Plugins 插件）及解决问题的方法。

## 总结

- Loader 就是一种模块打包方案，换言之，它是一名具备文件类型转换的翻译员
- Plugins 用于扩展 Webpack 的功能，使得 webpack 变得极其灵活。
- Plugins 可以在 Webpack 运行到某个时刻，帮你做一些事情。学过 Vue、React 的小伙伴应该对生命周期不陌生，其实 Plugins 很像生命周期函数，在 Webpack 运行到某个生命周期去做些事情。

> 如上述例子中，HtmlWebpackPlugin 就是在 Webpack 打包过程结束的生命周期时刻，去做了一些事情——自动生成 HTML 文件，引入打包后的 bundle。

> 在比如 clean-webpack-plugin 第三方的插件，它其实就是在 Webpack 打包之前的生命周期时刻，去做了一些事情——删除我们打包的目录

这两个 Plugins 相信你们的项目中都会用到，回去翻一翻项目的配置，结合文档，在细品细品。

## 建议

官方提供了很多 Loader、Plugins ，小伙伴们如果在遇到对于某种类型文件打包有问题时，直接百度找资料，看文档，95\%的问题都能被解决。

再三思考下，还是没有讲解 Loader 的工作原理，以基础介绍为重点，生怕一上来就讲原理吓倒一批同学，如果有小伙伴对其原理感兴趣，阿宽可以再出一小彩蛋章节介绍。
    