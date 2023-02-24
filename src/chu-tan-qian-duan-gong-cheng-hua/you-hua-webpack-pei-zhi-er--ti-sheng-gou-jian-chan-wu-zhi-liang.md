
# 优化 webpack 配置（二）-提升构建产物质量
---

在上一节中，我们从开发体验角度讲解了如何优化项目中的 webpack 配置，主要是如何提升 webpack 的构建速度。除了开发体验，输出质量也是在构建过程中很重要的一个性能指标。本篇文章我们带大家一起来看下如何提升 webpack 构建产物的质量。我们的目的主要是减小打包后文件的体积大小、并且可以按需引入、以及压缩混淆代码，提高用户体验。下面是本篇文章的脑图，大家先睹为快。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26c0d0ca50764587a0845fa3f3680036~tplv-k3u1fbpfcp-zoom-1.image)

# 代码分割

在项目中，一般是使用同一套技术栈和公共资源。那么如果每个页面的代码中都有这些公开资源，是不是就会导致资源的浪费呢？在每一个页面下都会加载重复的公共资源，一是会浪费用户的流量，二是不利于项目的性能，造成页面加载缓慢，影响用户体验。

基本思路就是我们先要确定哪些是我们项目中使用内容长期不会更改的三方库（`react`、`react-dom` 等）和我们团队内部自己封装的公共 JS（`util.js` 等）。然后将其提取出放入到一个公共文件 `common.js` 中。这样，只要不升级基础库的版本，那么 `common.js` 文件的内容就不会变化，在访问页面的时候，就可以一直使用浏览器缓存中的资源。

在了解了提取公共代码的思路之后，我们看下在 `webpack` 中，怎么具体实现。在 `webpack3` 中我们可以使用 `CommonChunkPlugin` 这个插件来提取公共代码。我们希望提取第三方依赖库（这里只写了 `react`）作为公共代码实现持久缓存，这样配置的话，如果业务代码产生了改动，那么重新构建出来的 `vendor` 包的 `hash` 是不会变化的。可以进行如下配置：

```
var webpack = require('webpack');
var path = require('path');
module.exports = {
   entry: {
       main: './index.js',
       vendor: ['react']
   },
   output: {
       filename: '[chunkhash:8].[name].js',
       path: path.resolve(__dirname, 'dist')
   },
   plugins: [
       new webpack.optimize.CommonsChunkPlugin({
           names: ['vendor'],
           filename: '[name].js'
       }),
       new webpack.optimize.CommonsChunkPlugin({
           name: 'runtime',
           filename: '[name].js',
           chunks: ['vendor']
      }),
   ]
}
```

在 `webpack4` 中，移除了 `CommonChunkPlugin`，取而代之的是 `optimization.splitChunks` 和 `optimization.runtimeChunk`。我们创建一个 `commons` 代码块，其包含了所有被其他入口共享的代码，同时也创建一个 `vendors` 的代码块，其包含了整个应用来自 `node_modules` 的代码，也可以实现提取公共代码的功能。其配置如下：

```
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2
        },
        vendors: {
          test: /[\/]node_modules[\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  }
}
```

# 按需加载

## 路由组件按需加载

在我们使用 `react` 的时候，`React Router` 就有一套自己的按需加载的方案，可以实现对路由按需加载。也就是只加载当前路由匹配的组件代码，不加载其他组件的代码。

我们要让路由动态加载，需要将 `component`方法 换成 `getComponent`方法，`getComponent` 这个方法可以异步进行加载组件，也就是只有当前路由被匹配时，才会调用到这个方法。使用姿势如下：

```
import { createHashHistory } from "history";

const rootRoute = {
  path: '/',
  indexRoute: {
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('components/HelloWorld'))
      }, 'HelloWorld')
    },
  },
}

ReactDOM.render(
  (
    <Router history: createHashHistory(), routes={rootRoute}/>
  ), document.getElementById('root')
);
```

在 `getComponent` 中主要实现的按需加载的是 `require.ensure()` 方法。该方法是 `webpack` 提供的方法按需加载的方法，第一个参数是依赖 `deps`，第二个参数是回调函数，第三个参数是该 `chunk` 文件的 `chunkName`。

我们还可以使用 ES6 提供的 `import(*)` 动态导入的方式来实现按需加载，我们先看下如何在项目中使用：

```
import React, { lazy } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

const Login = lazy(() => import(/* webpackChunkName: "Login" */'@app/login'));
const UserInfo = lazy(() => import(/* webpackChunkName: "UserInfo" */'@app/UserInfo'));

class RouteWrapper extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/userInfo" component={UserInfo} />
      </Switch>
    );
  }
}
export default withRouter(connect(mapStateToProps)(RouteWrapper));
```

其中 `/* webpackChunkName: "Login" */` 的意思是 `webpack` 会为动态生成的 `chunk` 赋予一个名字，以方便我们的追踪和调试。如果不进行指定，则默认会使用 `[id].js`。（同时要记得在 `webpacl.config.js` 中配置相关支持可以动态生成 chunk 名称的配置）。

在使用该方法是，同时要注意浏览器需要支持 `Promise API`，因为 `webpack` 在处理 `import(*)` 的时候，最后会返回一个 `Promise`，文件加载成功时可以在 `Promise` 的 `then` 方法中获取其内容。对于不支持 `Promise` 的浏览器，要记得使用 `polyfill`。

## 第三方组件和工具库，按需加载使用

在我们使用 `Elment` 或者 `Antd` 这样的组件库时，我们可能只是需要其中的某一个或者几个组件，那么在使用这样的组件库或者其他工具库的时候，一定要注意使用其按需加载的功能（大部分大型组件库或者工具库都会提供按需加载的方式）。

例如，在 [Element 的使用指南](https://element-plus.org/zh-CN/guide/quickstart.html#%E6%89%8B%E5%8A%A8%E5%AF%BC%E5%85%A5)中，已经给我们指明了道路，我们只需要按照官网给的姿势使用就可以：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc07810847c441848ac50465d3e5f297~tplv-k3u1fbpfcp-zoom-1.image)

在 [AntD 的官网](https://ant.design/docs/react/getting-started-cn)中，也有详细的介绍：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ca29b4b3de445e6a75c172313719130~tplv-k3u1fbpfcp-zoom-1.image)

其他的还有一些 `SDK` 等，有的也会提供按需加载的能力，尽量都在需要的时候再去加载，不要直接写在 `main.js` 中。

# 压缩代码

我们都知道，在浏览器中，运行 JS 代码是需要先将代码文件从浏览器通过服务器下载下来后再进行解析执行。那么在相同的网络环境下文件的大小会直接影响到网页加载的时长。那么，对代码进行压缩就是最简单高效的操作。

## UglifyJS \& OptimizeCssAssetsPlugin

`UglifyJS` 相信大家一定听说过，它是目前最成熟的 `JavaScript` 代码压缩工具，不仅可以压缩代码体积，还可以进行代码混淆避免我们的代码被他人下载后进行破解。`UglifyJS` 会分析 `JavaScript` 代码的语法树，理解代码含义，然后去除掉无效的代码、日志输出代码以及缩短变量名等优化。其功能强大，使用简单，并且压缩和混淆效果明显，深受广大前端同学的喜爱。

在 `webpack` 中，我们可以使用 `UglifyJsPlugin` 插件来优化 JS 资源，使用 `OptimizeCssAssetsPlugin` 这个插件优化或者压缩 CSS 资源，我们可以进行如下配置，部分 API 含义在参考注释。

```
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [
      // 优化 JS 资源
      new UglifyJsPlugin({
        exclude: /.min.js$/,   // 过滤掉已压缩文件
        cache: true,
        parallel: 4,             // 开启并行压缩，充分利用cpu
        sourceMap: false,        // 是否为压缩后的代码生成 Source Map，默认不生成，开启耗时会增大。
        extractComments: false,  // 移除注释
        uglifyOptions: {
          compress: {
            unused: true,
            warnings: false,     // 是否在 uglifyJS 删除没有用到的代码时输出警告信息，默认为输出
            drop_console: true,  // 是否删除代码中所有的 console 语句，默认为不删除
          },
          output: {
            beautify: false,     // 是否输出可读性较强的代码，即会保留空格和指标符，为达到更好的压缩效果，可设置为 false
            comments: false      // 是否保留代码中的注释
          }
        }
      }),
      // 用于优化css文件
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /.css$/g,
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true },
          mergeLonghand: false,
          discardComments: {
            removeAll: true
          }
        },
        canPrint: true
      })
    ]
  }
}
```

## Gzip

除了前端在打包的时候将无用的代码或者 `console`、注释剔除之外。一般情况下，我们都会使用 `Gzip` 在服务端对文件进行压缩。`Gzip` 原本是 `UNIX` 系统的文件压缩，后来逐步成为 `web` 领域主流的压缩工具。那么浏览器和服务端是如何通信来支持 `Gzip` 呢？

- 当用户访问 web 站点的时候，会在 `request header` 中设置 `accept-encoding:gzip`，表明浏览器是否支持 `Gzip`。
- 服务器在收到请求后，判断如果需要返回 `Gzip` 压缩后的文件那么服务器就会先将我们的 `JS\CSS` 等其他资源文件进行 `Gzip` 压缩后再传输到客户端，同时将 `esponse headers` 设置 `content-encoding:gzip`。反之，则返回源文件。
- 浏览器在接收到服务器返回的文件后，判断服务端返回的内容是否为压缩过的内容，然后进行解压操作。
- 一般情况下，浏览器和服务器都是支持 `Gzip` 的。`Gzip` 的压缩效率大概在 30\% 左右，效果还是很明显的。

# Scope Hoisting

`Scope Hoisting` 是 `webpack3` 的功能，翻译过来的意思是“作用域提升”。在 `JavaScript` 中，也有类似的概念，“变量提升”、“函数提升”，`JavaScript` 会把函数和变量声明提升到当前作用域的顶部，`Scope Hoisting` 也是类似。`webpack` 会把引入的 js 文件“提升”顶部。

在没有使用 `Scope Hoisting` 的时候，`webpack` 的打包文件会将各个模块分开使用 `__webpack_require__` 导入，在使用了 `Scope Hoisting` 之后，就会把需要导入的文件直接移入使用模块的顶部。这样做的好处有

- 代码中函数声明和引用语句减少，减少代码体积
- 不用多次使用 `__webpack_require__` 调用模块，运行速度会的得以提升。

所以，`Scope Hoisting` 可以让 `webpack` 打包出来的代码文件体积更小，运行更快。`Scope Hoisting` 的原理也很简单，主要是其会分析模块之间的依赖关系，将那些只被引用一次的模块进行合并，减少引用的次数。

因为 `Scope Hoisting` 需要分析模块之间的依赖关系，所以源码必须采用 ES6 模块化语法。也就是说如果你使用非 `ES6` 模块或者使用 `import()` 动态导入的话，则不会有 `Scope Hoisting`。

`Scope Hoisting` 是 `webpack` 内置功能，只需要安装 `ModuleConcatenationPlugin`（模块关联）插件即可，相关配置文件如下：

```
// webpack.config.js
module.exports = {
  plugins: [
    // 开启 Scope Hoisting 功能
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
```

# 输出分析

我们介绍了很多优化打包后代码体积的方式，但是怎么能够定位我们项目的问题在哪？又怎么去检验我们的优化成果呢？这就需要对输出的结果进行分析。

最直接的分析方式当然是查看我们每次打包后在控制台输出的结果，例如

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12ac56eb8ec4432c9e90727f31428ec5~tplv-k3u1fbpfcp-zoom-1.image)

但是这样的输出结果的可读性非常差并且不直观。我们可以使用可视化分析工具更简单、直观的查看打包结果，方便分析和排查问题。

`webpack` 官方推出了 [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 工具，该工具应该是迄今为止使用最多的 webpack 可视化分析工具。其使用姿势很简单，在安装完插件之后，进行如下的配置：

```
# NPM 安装插件
npm install --save-dev webpack-bundle-analyzer

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```

在重新执行 `build` 命令就会发现浏览器重新打开了个窗口，展示本项目本次 `build` 的结果的可视化分析： ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6dd41b5ae9b47918c8a0b4f00f1dae1~tplv-k3u1fbpfcp-zoom-1.image)

通过该图，我们可以很直观的看出：

- 打包出了哪些文件；
- 每个文件的所占区块越大代表着其在打包总产物的占比越大，帮助我们指定优化的优先级。
- 也可以看出模块之间的包含关系。

# 总结

本文我们列举了常见的优化 `webpack` 构建产物的方案，主要的目标是减少构建产物的体积、可以按需引入、以及压缩混淆代码，提高用户体验。主要从代码分割、按需加载、代码压缩、按需打包等方向进行优化。在文章的最后，也给大家介绍了怎么使用分析工具来可视化、量化我们的打包结果。

优化构建产物的质量是为了用户的体验，主要是一些老生常谈的问题，比如减少首屏加载时间（当然，减少首屏加载时间又是另一个话题）。项目优化不是一蹴而就，每个项目都有每个项目不同的问题，这就需要作为开发者的你耐心去寻找一套适合你们项目的最优解决方案。
    