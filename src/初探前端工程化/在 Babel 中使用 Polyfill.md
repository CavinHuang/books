
# 在 Babel 中使用 Polyfill
---

在前面两篇文章中，我们分别介绍了 Polyfill 和 Babel，那么本篇文章，我们就将两者结合起来，介绍下 Babel 中 polyfill 的解决方案。在上一篇文章中，我们简单介绍了 babel 转义的过程，先将源码解析为抽象语法树 AST，然后根据配置使用不同的插件对 AST 进行转换，然后再将转换后的 AST 输出为可编译的代码。

Babel 默认在编译时只会转换新的 JavaScript 语法（syntax），但不会转换 API，比如 Set、Maps、Generator、Proxy、Promise 等全局对象，以及一些定义在全局对象上的方法（比如Array.from、Object.assign）都不会被转译。

# \@babel/polyfill

关于 babel 转换 API 这个问题，Babel 官方的一个解决方案是推出 `@babel/polyfill` 库。其核心依赖是 `core-js@2` 和 `regenerater-runtime/runtime`。`core-js` 是 JS 标准库的 `polyfill`，为其提供垫片能力，`regenerater-runtime/runtime` 用来转译 `generators` 和 `async` 函数。

下面我们分别来介绍一下 `core-js` 和 `regenerator-runtime/runtime`。

## core-js

`core-js` 是一个 JavaScript 标准库，里面包含了 `ESCAScreipt 2020` 在内的多项特性的 `polyfill`。其作用主要有以下几点

- 支持最新的 ECMAScript 标准；
- ECMAScript 标准库提案；
- 一些 [WHATGW](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FWHATWG) / [W3C](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FWorld_Wide_Web_Consortium) 标准（跨平台或者 ECMAScript 相关）；
- 和 babel 密切集成。

在 `core-js3` 出来之前，最常用的版本是 `core-js@2`，但是 `core-js@2` 的一个最大问题就是包的体积太大\(大约有2M\)，因为其有很多被重复引用的文件。

### core-js\@3的重要改变

为了解决上述 `core-js2` 的问题，`core-js@3` 使用 `Monorepo` 进行拆包，拆成了 5 个相关的包，分别如下：

- core-js：是整个 `core-js` 的核心，提供了基础的垫片能力，但是直接使用 `core-js` 会污染全局命名空间和对象原型；
- core-js-pure：`core-js-pure` 提供了独立的命名空间，不污染全局变量；
- core-js-compact：根据 `Browserslist` 维护了不同宿主环境、不同版本下对应需要支持特性的集合；
- core-js-builder：结合 `core-js-compact` 以及 `core-js`，并利用 `webpack` 能力，根据需求打包出 `core-js`
- core-js-bundle

对于 ECMAScript 中已经稳定的功能，`core-js` 已经几乎完全支持，并在 `core-js@3` 中引入了一些新的功能

- 对于一些已经加入到 `ES2016-ES2019` 中的提案，现在已经被标记为稳定功能；
- 增加了 `proposals` 配置项，对处在提案阶段的 api 提供支持，但是因为提案阶段并不稳定，在正式加入标准之前，可能会有大的改动，需要谨慎使用；对于一些改变巨大的提案，也进行了对应的更新；
- 增加了对一些 web 标准的支持，比如 URL 和 `URLSearchParams`；
- 删除了一些过时的特性；

但是 `babel/polyfill` 并没有提供从 `core-js@2` 到 `core-js@3` 的平滑升级，所以 **当 core-js 升级到3.0的版本后，安装 babel\@2 的 \@babel/polyfill 将被弃用。**

在 `babel7.4.0` 之前，我们可以直接安装 `@babel/polyfill` 来转换 API，但是在 `7.4.0` 之后的 `Babel` 版本，就会提示让我们分开引入 `core-js/stable`\(默认安装3.x\)和 `regenerator-runtime/runtime`

```
warning @babel/polyfill@7.4.4: � As of Babel 7.4.0, this
package has been deprecated in favor of directly
including core-js/stable (to polyfill ECMAScript
features) and regenerator-runtime/runtime
(needed to use transpiled generator functions):

  > import "core-js/stable";
  > import "regenerator-runtime/runtime";
```

## 使用姿势

根据上述的介绍，我们已经知道了，`@babel/polyfill` 库已经是时代的产物了。但是我们仍然看下要如何使用 `babel/polyfill`（如上介绍，现在已经推荐使用 `core-js/stable` 和 `regenerator-runtime/runtime`，但是我认为，这两个包是 `babel/polyfill` 的子包，可以认为是同一种解决方案）转译 API。

### 单独使用

如果不依赖前端构建工具单独使用的话，使用姿势很简单，只需要安装依赖 `npm install \--save core-js regenerator-runtime`，然后需要在业务代码中需要进行引入：

```
import "core-js/stable";
import "regenerator-runtime/runtime";
```

但是要注意，这个时候就不能安装 `@babel/polyfill` 这个包了，因为 `@bable/polyfill` 也是依赖 `core-js` 并且会锁死 `2.x` 版本，`core-js 2.x` 的版本中是没有 stable 文件目录的，所以 `import "core-js/stable"` 这个引用就会报错。

### 在 webpack 中使用

那么如果我们依赖前端构建工具，比如 `webpack` 的话，我们需要怎么使用呢？安装依赖的过程不会变，仍然是需要安装 `npm install \--save core-js regenerator-runtime`这两个依赖。

安装完依赖之后，我们需要更改 `webpack` 的配置文件中的 `entry` 配置，webpack 配置如下：

```
// webpack.config.js
const path = require('path');
module.exports = {
  entry: ['core-js/stable', 'regenerator-runtime/runtime', './main.js'],
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, '')
  },
  mode: 'development'
};
```

# \@babel/preset-env

在上述 `@babel/polyfill` 的解决方案中，是将垫片全量进行引入的，完整的 `polyfills` 文件非常大，及其不利于我们打包出来的体积和页面的性能。

除了上述的方式，我们还可以使用 `Babel` 的预设或者插件做到按需使用。

在上一节中，我们简单介绍了 `@babel/preset-env` 这个预设。`@babel/preset-env` 预设包含所有标准的最新特性，转换那些已经被正式纳入 TC39 中的语法；该预设在 `Babel6` 的时候的名字是 `babel-preset-env` 在 `Babel7` 后，更名为 `@babel/preset-env`，该预设不只可以在编译时通过转换 AST 来进行语法转换，还有一个重要功能就是根据设置的参数针对性处理 polyfill。

例如，在不设置参数的情况下，最基础的配置文件如下：

```
module.exports = {
  presets: ["@babel/preset-env"],
  plugins: []
}
```

下面我们介绍几个 `@babel/preset-env` 常用的配置项。

## targets

我们可以设置 targets 配置项，来指定项目的运行环境。`@babel/preset-env` 会自动根据设置的目标环境来判断需要转译哪些语法和 API。如果没有配置 targets，那么 `@babel/preset-env` 会接着寻找项目中的 `browserslist` 配置，`browserslist` 配置只会控制语法的目标环境。如果 `targets` 和 `browserslist` 都没有，那么 `@babel/preset-env` 就会全量处理语法和 API。

比如我们可以将我们的目标环境设置为最近 3个 版本的浏览器和 安卓4.4 以上的系统以及 iOS 9.0 以上的系统，那么 babel 只会兼容该目标环境的代码。对应的配置如下（貌似这个已经出现了好几次了）：

```
module.exports = {
  presets: [["@babel/preset-env", {
  	targets: {
      browsers: [
        'last 3 versions',
        'Android >= 4.4',
        'iOS >= 9.0',
      ],
    },
  ]],
  plugins: []
}
```

## useBuiltIns

`useBuiltIns` 配置决定了 `@babel/preset-env` 该如何处理 `polyfill`。其选项有几个几个值："usage" 、"entry" 、和 false, 默认为 false。下面我们来一一介绍下：

### false

如果使用默认的 false，`polyfill` 就不会被按需处理会被全部引入。

### entry

如果 `useBuiltIn` 设置为 `entry`，需要手动导入 `@babel/polyfill`，其使用姿势在上一节中已经介绍过了，你可以直接导入 `core-js` 和 `regenerator-runtime` 也可以在 `webpack` 的 `entry` 中设置。`useBuiltIn: entry` 的作用就是会自动将`import "core-js/stable"` 和 `import "regenerator-runtime/runtime"` 转换为目标环境的按需引入。

```
module.exports = {
  presets: [["@babel/preset-env", {
  	useBuiltIns: "entry",
  ]],
  plugins: []
}
```

`entry`配置只针对目标环境，而不是具体代码，所以 `Babel` 会针对目标环境引入所有的 `polyfill` 扩展包，用不到的polyfill也可能会引入进来。所以，如果不需要考虑打包产物的大小，可以使用该配置。

### usage

如果 `useBuiltIns` 设置为 `usage`，则不需要手动导入 `polyfill`，`babel` 检测出此配置会自动进行 `polyfill` 的引入。其配置如下：

```
module.exports = {
  presets: [["@babel/preset-env", {
  	useBuiltIns: "usage",
  ]],
  plugins: []
}
```

`usage` 模式下，Babel 除了会针对目标环境引入 `polyfill` 的同时也会考虑项目代码代码中使用了哪些 ES6+ 的新特性，两者取一个最小的集合作为 polyfill 的导入。

所以，如果你希望代码尽可能的精简，那么 `usage` 模式是一个不错的选择，并且这也是官方推荐的使用姿势。

## core-js

`@babel/preset-env` 预设也可以让你自己选择需要使用 2 还是 3。并且这个参数只有 `useBuiltIn` 设置为 `usage` 或者 `entry` 时才会生效。

该配置默认值为 2，但是如果我们需要某些最新的 API 时，需要将其设置为 3。

# \@babel/runtime

`@babel/runtime` 是含有 babel 编译所需要的一些 `helpers` 函数。同时还提供了 `regenerator-runtime`，对 `generator` 和 `async` 函数进行编译降级。

具体的使用我们在下面的 `@babel/plugin-transform-runtime` 中会介绍。

# \@babel/plugin-transform-runtime

> A plugin that enables the re-use of Babel's injected helper code to save on codesize.

下面我们来介绍 babel 生态的另一个重要的插件：`@babel/plugin-transform-runtime` 其作用是可以重复使用 babel 注入的 helpers 函数，以节省代码体积（这句话先记下来，稍后会给大家解释）。

Babel 在转译 syntax 时，有时候会使用一些辅助的函数来帮忙，比如我们需要转译 class 类，默认的转译结果如下: [babel playground](<https://www.babeljs.cn/repl#?browsers=ie <=11&build=&builtIns=usage&corejs=3.6&spec=false&loose=false&code_lz=MYGwhgzhAEAKCmAnCB7AdtA3gKGtCYAngBLwggoAUaYAtvAJRa57SLwAuArohgAalyKaABJMNegF8-LSdjkA3MImgAvABZg0AcwIYAvNDTwA7nCSo0lBtmDpUIeADoK2yhq26tTgiTIVKAHIQAEsIEMCGBgBuIA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=true&timeTravel=false&sourceType=script&lineWrap=true&presets=env,react,stage-0,stage-1,stage-2,stage-3,typescript,flow&prettier=true&targets=&version=7.17.1&externalPlugins=&assumptions={}>)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43975758f1d445bf87a769ddffbf1e90~tplv-k3u1fbpfcp-zoom-1.image)

我们可以看到，在 `class` 语法的转换过程中， `@babel/preset-env` 自定义了 `_classCallCheck` 这个函数来辅助转换。这个函数就是 `helper` 函数。这是 `@babel/preset-env` 在做语法转换的时候，注入了这些 `helpers` 函数声明，以便语法转换后使用。

从上图中可以看到，`helper` 函数在转译后的文件中被定义了一遍。也就是说，项目中有多少个文件中存在需要转换的 class，那么在打包的产物中就会有多少个 `_classCallCheck helper` 函数，这显然不“程序员”。

所以解决思路是将这些 `helpers` 函数都放入到某个依赖包中，在使用的时候直接从该包中引入即可，这样打包出来的产物中，就只有一份 `helpers` 函数。上面提到的 `@babel/runtime` 就是这个依赖包。

那么 `@babel/plugin-transform-runtime` 这个插件是干嘛的呢？`@babel/plugin-transform-runtime` 是帮我们用工程化的手段解决来解决问题的。我们使用 `@babel/plugin-transform-runtime` 自动将需要引入的 `helpers` 函数替换为 `@babel/runtime` 中的引用。

我们在 [babel-playground](<https://www.babeljs.cn/repl#?browsers=ie <=11&build=&builtIns=usage&corejs=3.6&spec=false&loose=false&code_lz=MYGwhgzhAEAKCmAnCB7AdtA3gKGtCYAngBLwggoAUaYAtvAJRa57SLwAuArohgAalyKaABJMNegF8-LSdjkA3MImgAvABZg0AcwIYAvNDTwA7nCSo0lBtmDpUIeADoK2yhq26tTgiTIVKAHIQAEsIEMCGBgBuIA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=true&timeTravel=false&sourceType=script&lineWrap=true&presets=env,react,stage-0,stage-1,stage-2,stage-3,typescript,flow&prettier=true&targets=&version=7.17.1&externalPlugins=@babel/plugin-transform-runtime@7.17.0&assumptions={}>) 上加入了 `@babel/plugin-transform-runtime` 这个插件之后，可以看到原来在文件中定义的 `_classCallCheck helper` 函数变成了从 `"@babel/runtime/helpers/classCallCheck"` 中引入。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10536d71a53f464a9a77d3feabca0fee~tplv-k3u1fbpfcp-zoom-1.image)

`@babel/plugin-transform-runtime` 还有另一个关键的作用就是对 API 进行转换的时候，避免污染全局变量。

`babel/polyfill` 的处理机制是，对于例如 `Array.from` 等静态方法，直接在 `global.Array` 上添加；对于例如 `includes` 等实例方法，直接在 `global.Array.prototype` 上添加。

但是这样直接修改了全局变量的原型，有可能会带来意想不到的问题。这个问题在开发第三方库的时候尤其重要，因为我们开发的第三方库修改了全局变量，有可能和另一个也修改了全局变量的第三方库发生冲突，或者和使用我们的第三方库的使用者发生冲突。公认的较好的编程范式中，也不鼓励直接修改全局变量、

我们都知道，`polyfill` 的作用是对浏览器的全局对象重写其 API，以提供垫片能力。比如 `promise`，`polyfill` 会重写 `window.promise`，为不支持 `peomise` 的浏览器提供 `promise` 的能力。但是这样做会污染全局变量（这也是 `@babel/polyfill` 的一个缺点）。

```
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var obj = _promise["default"].resolve();
```

从代码可以看出，`@babel/plugin-transform-runtime` 将 `Promise` 转换为 `_promise["default"]`，而 `_promise["default"]` 拥有ES标准里 `Promise` 所有的功能。现在，即使浏览器没有 `Promise`，我们的代码也能正常运行。

我们来总结下，`transform-runtime` 插件的两个主要作用：

- 可以直接将 `helpers` 从文件中定义改为从 `@babel/runtime` 中引入，避免了多次引入 `helpers` 辅助函数。
- 可以将 `@babel/ployfill` 中 `API` 的 `polyfill` 直接修改原型改为从 `@babel/runtime-corejs3/helpers` 中获取，避免对全局变量和原型的污染。

# 总结

本篇文章我们介绍了 `polyfill` 在 `Babel` 中的实践，并且介绍了 `Babel` 官方推出的 `polyfill` 库 `@babel/polyfill`，然后分别介绍了 `@babel/polyfill` 的使用姿势以及其两个重要依赖，`core-js` 和 `regenerator-runtime`。如果直接使用 `@babel/polyfill` 有一个弊端就是不能实现按需加载。所以推荐使用 `@babel/preset-env` 预设。将 `useBuiltIns` 设置为 `usage` 就可以根据设置的 `targets` 目标环境和业务代码中实际用到的最新 ES 语法和 API 来进行按需加载。

只是使用 `@babel/preset-env` 还存在问题就是会有重复的 `helpers` 辅助函数并且在转换的时候会污染环境变量和原型，使用`@babel/plugin-transform-runtime` 可以解决这两个问题。

通过本篇以及前几篇有关 `polyfill` 和 `Babel` 的介绍文章之后，你是不是已经了解了 Babel 是怎么将 ES6+ 新功能转换为 ES5 的了？（不了解的再好好看文章呀 \(つД｀\)･ﾟ･

那么接下来将继续给大家给介绍如何优化 webpack 配置项 \(๑•̀ㅂ•́\)و✧
    