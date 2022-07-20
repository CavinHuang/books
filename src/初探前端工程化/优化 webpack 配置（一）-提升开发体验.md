
# 优化 webpack 配置（一）-提升开发体验
---

前面我们讲了常见的构建工具以及其对比，目前而言，最流行的模块化打包工具非 webpack 莫属，webpack 占据了巨大的市场份额。所以本篇文章和下一篇文章主要就 webpack 来给大家分享下如何从开发体验和输出质量两方面来优化项目中的 webpack 配置。

本篇文章我们先来看一下如何优化提升 webpack 的开发体验，优化开发体验主要目的是提升开发效率，让我们不必要每次要去抽一支烟才能等到项目启动或者构建完成。同时，也需要使用工程化的手段避免重复性劳动。下面是本篇文章的脑图（赶紧右键保存下来\(づ｡◕‿‿◕｡\)づ）

![如何提升 webpack 开发体验.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/012ce48d90be4428a44f2586104df9df~tplv-k3u1fbpfcp-watermark.image?)

# 优化开发体验

## HMR 模块热替换

模块热替换\(`Hot Module Replacement` 或 HMR\)是 `webpack` 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需刷新浏览器。

在我们平时开发中，最常做的操作就是修改代码，对于网页开发来说，大部分时候都需要我们实时在浏览器中去查看修改的结果。那么，我们就需要等编译完成后手动刷新浏览器，在工程化中，我们完全可以将这些重复的操作使用工程化的能力来帮助我们提效。

相信使用过 webpack 的同学应该都知道 webpack 有一个特别好用的功能：模块热替换\(`Hot Module Replacement` 或 HMR 或热更新\)，其可以在监听到本地源文件发生变化的时候，做到不刷新浏览器页面的情况下，将编译好的代码推送到浏览器，然后实时更新内容。

有了模块热替换，我们不仅可以节省实时预览的等待时间，还有一个很重要的原因是在不刷新浏览器页面的情况下，我们就可以尽可能的保存当前页面的运行状态，例如表单的填写和 Redux 状态管理。这样不至于修改一个样式就需要重新填写数据。

模块热替换的原理也很简单，大致步骤如下：

- webpack 在热更新模式下会启动一个 dev 服务器，让浏览器可以请求本地的静态资源，本地 server 启动之后，服务端就会建立一个和客户端之间的长链接（`websocket` 服务）。
- 每当文件修改后，服务端就会通过长链接向客户端推送消息告诉客户端有源文件进行了修改，你需要接收文件。
- 客户端收到请求之后，重新请求一个 JS 文件，该文件会替换掉 `__webpack_modules__` 中的部分代码。

[使用 XMR 的姿势](https://www.webpackjs.com/guides/hot-module-replacement/#%E5%90%AF%E7%94%A8-hmr) webpack 官网上也介绍的比较详细，大家可以自行查阅，这里就不展开讲了。

## 区分环境

因为我们在开发阶段的目标和代码在生产环境运行的目标是不一致的，所以在我们的项目中，最少是要有两套环境的：即开发环境和生产环境。

在开发阶段，我们要进行开发和调试，这就需要保留错误日志和调试工具。但是在生产环境中，我们需要尽可能缩小代码体积以减少网络传输，并且不应该将一些开发时候的 log 或者报错信息在用户面前展示。比如 React，其在开发环境下会包含类型检查、HTML 检查等针对开发者的警告日志，并会将报错抛出，但是在生产环境下就不会。同时，开发环境和测试环境需要使用的数据也应该是隔离的。

为了更好的复用代码，所以在 webpack 中，可以使用一套源代码，通过设置环境变量输出不同的代码。`webpack` 可以通过在命令行新增 `--env` 参数的方式传入环境变量。然后在 `webpack.config.js` 中可以访问到这些环境变量。相关代码如下：

```
// 命令行
npx webpack --env goal=local --env production --progress

// webpack.config.js
const path = require('path');

module.exports = (env) => {
  // Use env.<YOUR VARIABLE> here:
  console.log('Goal: ', env.goal); // 'local'
  console.log('Production: ', env.production); // true

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
```

我们还可以再 package.json 的脚本文件中设置环境变量。

```
// package.json
{
  ...,
  "scripts": {
    "start": "npm run dev",
    "dev": "cross-env NODE_ENV=development webpack serve --config ./config/webpack.config.js",
    "build:test": "cross-env NODE_ENV=test  webpack --config ./config/webpack.config.js",
    "build:pro": "cross-env NODE_ENV=production  webpack --config ./config/webpack.config.js"
  },
  ...
}
```

# 提升 webpack 的构建速度

## 构建时间

优化 webpack 构建速度的第一步是要知道构建时间，然后我们才可以具体问题具体分析。我们可以使用 `speed-measure-webpack-plugin` 插件测量你的 `webpack` 构建期间各个阶段花费的时间。使用姿势也很简单，只需要使用 `smp.wrap()` 将 `webpack` 配置内容包裹起来就好，具体使用如下 ：

```
// 分析打包时间
// webpack.config.js

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

// ...
module.exports = smp.wrap(prodWebpackConfig)
```

然后我们就可以在控制台看到各个阶段的构建时间，在有了各个阶段的构建之后我们就可以对症下药了。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4611da26cd904fc29c8ac3c04093018b~tplv-k3u1fbpfcp-zoom-1.image)

接下来，我们就从以下几个方面着手进行分析：

- 减少执行编译的模块数量
- 提升单个模块构建的速度
- 并行构建以提升总体效率
- 并行压缩提高构建效率
- 合理使用缓存

下面我们分别来看一下：

## 减少执行构建的模块

提升编译模块阶段效率的第一个方向就是减少执行编译的模块。压根不去构建那些不需要构建的模块可以从根本上提升我们的构建速度。

### 缩小文件的搜索范

我们都知道，`webpack` 的构建过程是从 `entry` 出发，然后依次递归解析出文件的导入语句。在遇到导入语句的时候，要判断是否需要使用设置的 `loader` 去处理文件。因为这里涉及到了递归操作，所以在文件较少的时候性能问题可能不明显，在我们的项目逐步壮大有很多文件之后，依赖关系就会变得复杂，这个时候递归的速度的问题就会慢慢暴露出来了。所以我们先要缩小文件的搜索范围。

#### 优化 Resolve 配置

webpack 的 resolve 配置了模块会按照什么规则如何被解析，webpack 提供合理的默认值，但是还是可能会修改一些解析的细节。我们来看下如何修改 resolve 配置加快构建速度。

##### resolve.modules

webpack 的 `resolve.modules` 配置用于指定 `webpack` 去哪些目录下寻找第三方模块。其默认值是 `['node_modules']`，`webpack` 在寻找的时候，会先去当前目录的 `./node_modules` 下去查找，没有找到就会再去上一级目录 `../node_modules` 中去找，直到找到为止。

所以如果我们项目的第三方依赖模块放置的位置没有变更的话，可以使用绝对路径减少查找的时间，配置如下：

```
module.export = {
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // __diename 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')]
  }
}
```

##### resolve.extensions

`extensions` 是我们常用的一个配置，适用于指定在导入语句没有带文件后缀时，可以按照配置的列表，自动补上后缀。我们应该根据我们项目中文件的实际使用情况设置后缀列表，将使用频率高的放在前面、同时后缀列表也要尽可能的少，减少没有必要的匹配。同时，我们在源码中写带入语句的时候，尽量带上后缀，避免查找过程。

同时，我们在源码中写带入语句的时候，尽量带上后缀，避免查找过程。

```
module.export = {
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // __diename 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')]
    extensions: ['.sass', '.js', '.jsx', '.ts', '.tsx'],
  }
}
```

##### mainFieds

`mainFieds` 字段用于配置第三方模块使用哪个入口文件，为了减少搜索的步骤，**在明确第三方模块的入口文件描述字段时，可以直接设置为具体值。**

因为我们安装的第三方依赖可能会在多个运行环境中使用，比如可以同时在 `nodeJS` 环境和浏览器环境中使用。那么这些依赖会在 `package.json` 文件中指明不同环境的入口文件字段为哪一个。

`resolve.mainFieds` 的默认值和当前项目设置的 `target` 有关系，如果当前 `target` 设置的是 `web` 的时候，`webpack` 会依次使用 `['browser', 'module', 'main']` 寻找模块的入口文件。如果设置的 `target` 不是 `web`，那么会按照 `['module', 'main']` 来寻找。

由于大部分第三方模块都会 `main` 字段去描述入口文件，所以，可以直接使用 `['main']` 作为入口文件的描述字段，以减少搜索步骤（但是需要一一排查每一个安装的三方依赖，避免导致其无法正常使用）。

```
module.export = {
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // __diename 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')]
    extensions: ['.sass', '.js', '.jsx', '.ts', '.tsx'],
    mainFieds: ['main'],
  }
}
```

##### noParse

`noParse` 配置的意思是让 `webpack` 忽略没有模块化的文件，比如 `JQuery`。这样就不需要对文件递归解析处理，提高构建速度。需要注意的是，被忽略掉的文件中如果包含 `import、require、define` 等模块化语句时，在构建产物中会包含浏览器无法解析的模块化语句。

```
module.export = {
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // __diename 表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')]
    extensions: ['.sass', '.js', '.jsx', '.ts', '.tsx'],
    mainFieds: ['main'],
    noParse: ['JQuery'],
  }
}
```

#### IgnorePlugin

有的依赖包，除了项目所需要的模块外，还会附带一些多余的模块。典型的例子就是 [moment](https://momentjs.com/) 这个包，一般情况下载构建时会自动引入其 `local` 目录下的多国语言包。

但是对于大多数情况而言，项目中只需要引入本国语言包即可，而 webpack 提供 `IgnorePlugin` 即可在构建模块时直接删除那些需要被排除的模块，从而提升模块的构建速度，并减少产物体积

```
new webpack.IgnorePlugin(/^./locale$/, /moment$/)
```

### DllPlugin

> Dynamic-link library \(DLL\) is Microsoft's implementation of the shared library concept in the Microsoft Windows and OS/2 operating systems. These libraries usually have the file extension DLL, OCX \(for libraries containing ActiveX controls\), or DRV \(for legacy system drivers\). The file formats for DLLs are the same as for Windows EXE files – that is, Portable Executable \(PE\) for 32-bit and 64-bit Windows, and New Executable \(NE\) for 16-bit Windows. As with EXEs, DLLs can contain code, data, and resources, in any combination.

`Dll(Dynamic-link library)` 翻译过来的意思是动态链接库，是 `Microsoft`操作系统中对共享库概念的实现。因为这些库通常文件扩展名为 `.dll`，所以我们我们一般都将其成为 DLL 技术。这些 `.dll`文件中是被其他模块调用的函数和数据。webpack 的 `DllPlugin` 和 `DllReferencePlugin` 是采用 Dll 的思想去拆分 `bundle`。

那么 Dll 是怎么提升构建速度的呢？一般来说，我们的代码可以分为业务代码和第三方依赖代码，如果不做 Dll 处理的话，那么每次在构建的时候都需要将所有的代码构建一次。但是，大部分情况下，我们都只是更新了业务代码，很少去更改第三方依赖（当然，有时会做一些升级操作）。那么我们可以借鉴 Dll 的思想，**将不经常改动的、复用性较高的第三方模块打包到单独的动态链接库中**（比如 `react`、`react-dom`），在这些三方模块不需要升级的时候，动态链接库就不需要重新打包，每次只需要构建业务代码即可，这样就可以提升构建速度。

具体的使用姿势和注意事项可以参考 [webpack 官网](https://webpack.docschina.org/plugins/dll-plugin/)，在这里也不再赘述了。

### Externals

`externals` 会告诉 Webpack 无需打包哪些库文件。比如，我们从 `CDN` 引入 [jQuery](https://jquery.com/) 的时候，就不需要将其再打包到 bundle 中：

```
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous"
></script>
```

我们就可以这样将 jQuery 配置在 `externals` 中，告诉 `webpack` 将 `JQuery` 模块从构建过程中移除，我们可以这样配置。

```
module.exports = {
  //...
  externals: {
    jquery: 'jQuery',
  },
};
```

## 提升单个模块构建的速度

提升 webpack 的构建速度除了减少需要构建的模块之外，我们还可以通过提升单个模块的构建速度来提升整体构建速度。这个方向的优化主要有以下几种：

### 优化 loader 配置

`loader` 对文件的转换是个耗时的操作，并且 `loader` 的配置会批量命中多个文件，所以我们需要根据自己的项目尽可能的精准命中哪些文件是需要被 loader 处理的。

webpack 提供了 `test、include、exclude` 三个配置项来命中 loader 。

`include` 的意思是只对命中的模块使用特定的 `loader` 进行处理，`exclude` 的意思是指定排除的文件，不使用该 `loader` 进行处理。

比如，我们只想对根目录 src 下的 js 文件使用 `babel-loader` 进行处理可以这样设置：

```
//webpack.config.js
const path = require('path');
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /.js?$/,
        use: ['babel-loader'],
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },
}
```

### SourceMap

`SourceMap` 是一个存储着位置信息的文件。其存储了我们代码在编译、打包等工程化转化前后对应的代码位置信息。在我们排查问题的时候，面对压缩混淆后的代码一定是毫无头绪的，就可以通过 `SourceMap` 找到对应的原始代码。`SourceMap` 可以提高我们排错效率。

`SourceMap` 虽然给我们排错提供了很大的方便，但同时输出 `SourceMap` 的质量和构建速度是呈反比的，也就是输出的 `SourceMap` 信息越完整那么构建的速度会越慢。一般来说，我们会在开发环境和生产环境使用的 `SourceMap` 策略不同。那么选择合适的 `SourceMap` 也是十分重要的。一般我们会这样设置`SourceMap`：

- **在开发环境下**：不需要做代码压缩，查阅源码相对方便，所以我们希望能够以最快的速度生产 `SourceMap` 文件，所以一般将其设置为 `cheap-module-eval-source-map`。
- **在生产环境下**：和开发环境相反，在生产环境下我们可以牺牲 `SourceMap` 的生成速度来换取详细的代码对应关系，我们需要详细的 `SourceMap` 以方便我们排查问题。所以一般将其设置为 `hidden-source-map`。

## 并行构建以提升总体效率

默认情况下，webpack 是单线程模型，一次只能处理一个任务，在文件过多时会导致构建速度变慢。所以在减少了需要执行构建的模块和降低了单个模块的构建速度之外，我们还可以并行构建，让 webpack 同时处理多个任务，发挥多核 CPU 的优势。

### HappyPack

`HappyPack` 是一个老牌的 `webpack` 并行处理任务的插件。其可以在 `loader` 的执行过程由单进程扩展为多进程模式。将任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。从而加速代码构建（但是仅限于对 loader 的处理）。

`HappyPack` 会自动进行分解和管理任务，我们在使用的时候只需要接入 `HappyPack` 插件即可。我们需要将通过 `Loader` 处理的文件先交给 `happyPack/loader` 去处理。每实例化一个 `HappyPack`，就是告诉 `HappyPack` 创建一个进程池来管理生成的子进程对象。其使用姿势如下：

```
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({size: 3})

module.exports = {
  module: {
    rules: [
      {
        test: /.js$/,
        // 用 HappyPack 的 loader 替换当前 loaders:
        loader: 'happypack/loader?id=happyBabel',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HappyPack({
      // id 标识 happypack 处理那一类文件
      id: 'happyBabel',
      // 配置loader
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true'
      }],
      // 共享进程池
      threadPool: happyThreadPool,
      // 日志输出
      verbose: true
    })
  ]
}
```

### Thread-loader

`Thread-loader` 和 `HappyPack` 类似，会创建多个 `worker` 池进行并发执行构建任务。这个 `loader` 放置在其他 `loader`之前， 放置在这个 `Thread-loader` 之后的 loader 就会在一个单独的 worker 池\(worker pool\) 中运行。

在 [webpack 官网](https://www.webpackjs.com/loaders/thread-loader/) 中也有提示，每个 worker 都是一个单独的有 600ms 限制的 `node.js` 进程。同时跨进程的数据交换也会被限制。所以建议仅在耗时的 loader 上使用。其使用姿势如下：

```
    module.exports = {
      entry: './src/js/index.js',
      module: {
        rules: [
              {
                test: /.js$/,
                exclude: /node_modules/,
                use: [
                  // 开启多进程打包。 
                  {
                    loader: 'thread-loader',
                    options: {
                      workers: 2 // 进程2个
                    }
                  },
                  {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env'],
                      cacheDirectory: true
                    }
                  }
                ]
              }
        ]
      }
```

## 并行压缩

### UglifyjsWebpackPlugin、TerserWebpackPlugin 开启 paralle

`UglifyjsWebpackPlugin` 插件是众所周知的用来压缩 JS 代码的插件，`webpack4` 默认内置使用 `terser-webpack-plugin` 插件进行压缩，功能类似。两者都可以设置 `parallel` 参数开启缓存并启用多进程并行来提高构建速度。在 [webpack 官网](https://webpack.docschina.org/plugins/uglifyjs-webpack-plugin/#parallel) 中也强烈推荐开启 `paralle` 使用并行化。

```
// webpack.config.js
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
      }),
    ],
  },
};
```

### ParallelUglifyPlugin

`ParallelUglifyPlugin` 和 `HappyPack` 类似，都是通过并行处理任务的方式提升构建速度。但是 `ParallelUglifyPlugin` 是作用在代码压缩阶段。和处理 Loader 一样，webpack 在使用 `UglifyJS` 进行压缩的时候也是只能一个一个进行处理。`ParallelUglifyPlugin` 所要做的就是开启多个子进程并行处理任务，将任务分配给多个子进程完成，每个子进程分别使用 `UglifyJS` 进行压缩。

其使用姿势可参考[官网](https://www.npmjs.com/package/webpack-parallel-uglify-plugin)，在次不再赘述。（PS: 此项目目前基本处于没人维护的阶段）。

## 缓存

在优化的方案中，缓存也是其中重要的一环。在构建过程中，我们可以通过使用缓存提升二次打包速度。主要有以下几种方式：

### babel-loader 开启缓存

`babel-loader` 在执行的时候，可能会产生一些运行期间重复的公共文件，造成代码体积大冗余，同时也会影响构建速度。我们可以使用 `cacheDirectory`参数开启缓存。

`cacheDirectory` 的默认值为 `false`。当有设置时，指定的目录将用来缓存 `loader` 的执行结果。之后的 `webpack` 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 `Babel` 重新编译过程\(recompilation process\)。如果设置了一个空值 `(loader: 'babel-loader?cacheDirectory')` 或者 `true (loader: 'babel-loader?cacheDirectory=true')`，`loader`将使用默认的缓存目录 `node_modules/.cache/babel-loader`，如果在任何根目录下都没有找到 `node_modules` 目录，将会降级回退到操作系统默认的临时文件目录。

### cache-loader 或者 HardSourceWebpackPlugin

在 `webpack` 中我们可以在一些性能开销较大的 `loader` 之前添加此 `cache-loader`，可以将结果缓存到磁盘中。不过保存和读取这些缓存文件也会有一些时间开销，所以建议只对性能开销较大的 `loader` 采用改缓存优化。其使用姿势如下：

```
module.exports = {
  module: {
    rules: [
      {
        test: /.ext$/,
        use: [
          'cache-loader',
          ...loaders
        ],
        include: path.resolve('src')
      }
    ]
  }
}
```

`HardSourceWebpackPlugin` 的作用是为模块提供中间缓存，缓存默认的存放在是 `node_modules/.cache/hard-source` 中。`HardSourceWebpackPlugin` 不会对首次构建时间有太大的提升，但是从第二次构建开始，构建时间会显著提高（约 80\%）。

具体使用姿势可以参考其[官网介绍](https://www.npmjs.com/package/hard-source-webpack-plugin)。

# 总结

本篇文章，我们介绍了在开发过程中，如何提高 webpack 的开发体验。主要从优化使用体验和优化构建速度两方面给大家介绍。在优化使用体验中，主要给大家介绍了模块热替换技术。在优化构建速度中，先讲了该如何减少需要构建的模块，然后介绍了如何提升单个模块的构建速度、怎么使用并行技术执行构建任务，最后介绍了如果在构建过程使用缓存优化。

下一篇文章，我们将介绍如何优化 webpack 的构建产物。
    