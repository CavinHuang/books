
# 下一代构建方案-no-bundle 构建
---

在前面两篇文章中，我们介绍了如何对 `webpack` 进行优化以提升开发体验和构建产物。`webpack` 无疑是功能强大的构建工具，但是也因为其繁琐的配置项饱受诟病，甚至网友调侃出“`webpack`配置工程师”这样的岗位。那么本篇文章讲给大家介绍一种新思想：`no-bundle` 构建方案，也就是无包构建。

## 什么是 `no-bundle` 构建

在《常见构建工具及对比》中，我们介绍了为什么在现代前端项目需要构建这个环节，并且对比了常见的几种构建工具。在过去的几年中，以 `webpack` 为主的构建工具无疑占据着主流地位。其核心思想是从一个或多个入口文件开始，根据入口文件递归寻找出依赖文件，然后构建出一个依赖图，最后将你项目中所需的每一个模块组合成一个或多个 `bundles`，然后在浏览器中加载处理好的 `bundles`。

`webpack` 在构建过程中提供了编译、代码效验、文件优化、自动化测试等强大的功能。但也因为如此所以大大增加我们现在 web 开发的复杂性。特别是我们在本地开发的时候，`webpack` 也会将模块打包为浏览器可读的 js 代码，需要将整个项目都重新构建一遍。项目越大，构建速度就会越慢。

在 `bundle` 构建时期，主要想解决的问题有以下几点：

- 模块化的兼容性问题
- 模块过多导致频繁发送请求影响性能问题

随着技术的发展，上面这些问题或多或少都已经得以解决，比如 `HTTP2` 的普及大大提高了浏览器对于并发请求的处理；并且现代浏览器普遍都已经支持 `ESM` 模块。所以前端工程师们又有了新的使命：探索怎么能够简化构建过程提升构建效率。在此背景下，`no-bundle` 构建方案就孕育而生了。

`no-bundle` 构建的思想是在构建的时候只处理模块的编译而无需打包，把模块间的依赖关系交给浏览器处理。浏览器加载模块入口之后，进行依赖分析，再通过网络请求加载被依赖的模块。

## JavaScript modules 模块

在《**模块化**》这部分中，我们带大家一起回顾了 JS 模块化发展的过程。在早期的时候，JS 往往被用来执行独立的脚本任务，简单且体量小。但是随着前端发展，时至今日，我们需要在项目中运行大量的 JS 代码。所以将 JS 拆分为可按需导入的独立模块成为日益明显的需求。

在社区中慢慢出现了一系列的模块化解决方案。`CommonJS`、`AMD`、`CMD` 等。在 `ES2015（ES6）` 中，官方终于在语言标准层面上实现了模块的功能，并且是浏览器和服务端都支持的模块化解决方案。`no-bundle` 无包构建的发展就得益于浏览器原生支持模块功能。

由于现代浏览器本身就支持 `ES Module`，会自动向依赖的Module发出请求。`no-bundle` 充分利用这一点，简化构建时需要处理的过程，提升构建效率。

## Vite

在了解了什么是 `no-bundle` 构建之后，我们再来看看具体的应用。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3b4d59cd3a2454b950a4bd13ba8cca9~tplv-k3u1fbpfcp-zoom-1.image)

相信一提到 `no-bundle` 构建工具，大家第一个想到的就应该是 `Vite`。`Vite` 是我们熟悉的 Vue 的作者尤雨溪在开发 `Vue3.0` 的时候开发的一个 **基于原生 ES-Module 的前端构建工具**。其本人在后来对 Vue3 的宣传中对 Vite 赞不绝口。在 Vite 的官网，我们可以看到对其的介绍是: 下一代前端开发与构建工具。可见对其寄予厚望。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6d2e854c6984ee2ae5db61963c945e2~tplv-k3u1fbpfcp-zoom-1.image)

`Vite` 主要从以下两方面提升开发体验：

- 在开发时提供开发服务器，基于原生 `ESM` 提供丰富的内建功能。首次启动以及在模块热更新上速度快到惊人。
- 针对生产环境使用 `Rollup` 进行打包代码，输出高可用资源。

也就是在开发环境使用浏览器自带的模块处理能力处理构建过程，只编译不打包，而在生产环境下再使用 `Rollup` 打包的这种方式，理论上即提高了开发效率，也能够保证生产环境的代码要求。

### Vite 原理

下面我们就带大家来看下 `Vite` 的原理。

在前面的文章中我们也有讲到，在 `bundle` 构建时期，例如 `webpack` 这样的构建工具会从入口文件出发，依次查找文件，生成一个庞大的依赖关系图\(`dependency graph`\)，其中包含应用程序需要的每个模块,然后将所有这些模块打包成一个或多个 `bundle`。

不管是在开发调试还是打包上线的阶段，都会先将你的项目文件打包为一个个的 `bundle`，进行全量构建。有的同学会说，不是还有懒加载吗？懒加载是发生在项目运行时候的优化手段，在构建的阶段，`webpack` 还是会将这部分提前构建好的。在项目越来越大的时候，本地开发项目的启动就会越来越慢，达到分钟级别也不足为奇。同时修改代码后的热更新时间也会增加。Vite 为了解决这个问题，使用了浏览器的原生 `ESM`，并且使用了预编译和 esbuild。

下面我们来具体操作体会下 `Vite` 的魅力，我们按照姿势一步一步来进行操作，首先我们使用 `Vite` 来创建一个 Vue 项目（注意 node 版本需要 `>= 12.0.0`）：

```bash
$ npx create-vite-app my-vue-app -- --template vue 
npx: 7 安装成功，用时 16.216 秒
Scaffolding project in /Users/workspace/self/my-vue-app...

Done. Now run:

  cd my-vue-app
  npm install (or `yarn`)
  npm run dev (or `yarn dev`)
```

创建完毕之后，再按照提示依次执行一下命令来打来项目、安装依赖并启动项目：

```
// 进入到项目目录
cd my-vue-app

// 安装依赖
npm install

// 启动项目
npm run dev
```

在我们执行完 `npm run dev` 进行项目启动的时候，就可以明显有秒开的感觉 ￣ω￣=。大家可以操作体验下\~，顺利的话，浏览器会打开 `3000` 端口并展示如下页面：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e5cbac6d16e49f4a5c911ca74347ca8~tplv-k3u1fbpfcp-zoom-1.image)

在我们开发的时候，`Vite` 主要做的以下三步内容：**拦截请求、替换内容、解析返回结果。** 接下来我们就分别来详细看下这部分内容。

### 请求拦截

我们将上一步下载好的 `Vue` 模板文件中的内容稍微修改下，能够让我们更加直观看到处理过程，我们将 `main.js` 中的内容直接放在 `index.html` 中。这时的 `index.html` 内容如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" >
    import { createApp } from 'vue'
    import App from './src/App.vue'

    createApp(App).mount('#app')
  </script>
</body>
</html>
```

再运行项目，我们可以在浏览器中看到，我们源代码的 `import { createApp } from'vue'`在浏览器中变成了 `import { createApp } from '/@modules/vue.js'`。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86a088e4093a4cf4880d44dec625cbbf~tplv-k3u1fbpfcp-zoom-1.image)

这是因为，在项目启动的时候，`Vite` 首先会先启动一个 `koa` 服务器拦截浏览器发出的 `ESM` 请求，使用 `ES Module Lexer` 进行处理，`Lexer` 会找到代码中的 `import` 语句导入的模块然后以数组的形式返回。然后 `Vite` 会根据不同的请求类型做不同的处理，最终将处理过的 `ESM` 的代码返回给客户端。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd8950bc099d4c9992bec87e9c5c1d04~tplv-k3u1fbpfcp-zoom-1.image)

`Vite` 在对请求进行处理的时候，会将模块分为 **依赖** 和 **源码** 两部分分别进行处理，依赖也就是我们存放在 `node_modules` 下面的三方依赖包，因为我们项目中使用的依赖一般数量会很多，有成百上千个依赖包也不足为奇，并且这些依赖包在开发中大部分情况是不会改变。基于此，`Vite` 在启动的时候会先使用 `esbuild` 进行预编译和代码转换（将不是 ESM 的依赖转换为 `ESM` ），然后将编译结果缓存起来。`esbuild` 是使用 Go 语言开发的，在速度上会比 `webpack` 使用的 `acorn`（JS 开发）要快很多。

### imports 替换

#### 依赖 imports 替换

`Vite` 将所有 `import { createApp } from'vue'` 这种使用 `node_modules`下的模块内容写法替换为了 `/@modules/xxx`，在浏览器中，发出的请求路径就是 `/@modules/xxx`，然后该请求再次被 `Vite` 拦截，并经过 `vite` 的处理之后去寻找正确的模块并返回。

在处理的时候，首先会进行正则匹配，如果是 `@modules`开头的请求，那么 `Vite` 就认为是三方依赖。`Vite` 内部会去 `node_modules` 中找到正确的依赖模块，将找到的内容经过 `esbuild` 返回给浏览器。

这样做是因为浏览器并不支持 `import { createApp } from'vue'` 这样去寻找 `node_modules`下模块内容的方式，浏览器只能去寻找相对路径或者绝对路径下的内容。我们以前习惯这样写是因为在使用 `webpack` 的时候，`webpack` 会帮助我们寻找依赖模块的真正路径，然后经过构建打包之后，返回给浏览器的是正确的路径。

#### 静态资源 import 替换

静态资源的处理就相对简单一些，请求路径如果匹配到了图片正则、媒体正则或者字体正则的时候，就会被 `Vite` 认为是静态资源，相关代码如下：

```js
// https://github.com/vitejs/vite/blob/1.x/src/node/utils/pathUtils.ts
const imageRE = /.(png|jpe?g|gif|svg|ico|webp)(?.*)?$/
const mediaRE = /.(mp4|webm|ogg|mp3|wav|flac|aac)(?.*)?$/
const fontsRE = /.(woff2?|eot|ttf|otf)(?.*)?$/i

/**
 * Check if a file is a static asset that vite can process.
 */
export const isStaticAsset = (file: string) => {
  return imageRE.test(file) || mediaRE.test(file) || fontsRE.test(file)
}
```

如果是一个静态资源的话，就会被处理成 ESM 返回。

```js
// https://github.com/vitejs/vite/blob/1.x/src/node/server/serverPluginAssets.ts
app.use(async (ctx, next) => {
  if (isStaticAsset(ctx.path) && isImportRequest(ctx)) {
    ctx.type = 'js'
    ctx.body = export default ${JSON.stringify(ctx.path)} // 输出是path
    return
  }
  return next()
})

export const jsonPlugin: ServerPlugin = ({ app }) => {
  app.use(async (ctx, next) => {
    await next()
    // handle .json imports
    // note ctx.body could be null if upstream set status to 304
    if (ctx.path.endsWith('.json') && isImportRequest(ctx) && ctx.body) {
      ctx.type = 'js'
      ctx.body = dataToEsm(JSON.parse((await readBody(ctx.body))!), {
        namedExports: true,
        preferConst: true
      })
    }
  })
}
```

#### `*.vue` 文件的替换

下面我们来看一下 `Vite` 是怎么处理一个典型的 `Vue` 文件的。我们写一个 `App.vue` 代码如下：

```html
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
```

上面的 `App.vue` 文件包含了最基础的 `template`、`style` 和 `script` 三部分，`Vite` 在处理 `.vue` 后缀的文件时，会将 `.vue` 文件拆成了 `template、css、script` 三个模块并行处理。浏览器在请求到 `App.vue` 文件之后，解析到 `template` 和 `style` 的路径，然后再继续对 `template、css` 发送请求获取其内容。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74f4058a6f714cb5ab4a84ba933a7d33~tplv-k3u1fbpfcp-zoom-1.image)

在 `App.vue` 中，又将 `style` 和 `template` 部分重新组装了起来。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b268620835264581b37aa69d99347b53~tplv-k3u1fbpfcp-zoom-1.image)

这一步的源码在 [serverPluginVue](https://github.com/vitejs/vite/blob/1.x/src/node/server/serverPluginVue.ts) 中，核心逻辑是根据请求 `url` 的 `query` 参数不同来进行不同的处理，如果 `query` 没有 `type`，就认为是请求的是 `App.vue`，那么就会编译为上述截图中引入 `template` 和 `style` 的形式，源码如下：

```
// 如果没有 query 的 type，比如直接请求的 /App.vue
if (!query.type) {
  // watch potentially out of root vue file since we do a custom read here
  watchFileIfOutOfRoot(watcher, root, filePath)

  if (descriptor.script && descriptor.script.src) {
    filePath = await resolveSrcImport(
      root,
      descriptor.script,
      ctx,
      resolver
    )
  }
  ctx.type = 'js'
  // 编译 App.vue，编译成上面说的带有 script 内容，以及 template 和 style 链接的形式。
  const { code, map } = await compileSFCMain(
    descriptor,
    filePath,
    publicPath,
    root
  )
  ctx.body = code
  ctx.map = map
  // ETAG 缓存检测相关逻辑
  return etagCacheCheck(ctx)
}
```

如果 `query` 的 `type` 是 `template`，例如上图的 `/src/App.vue?type=template`，那么就会使用 `compileSFCTemplate` 函数将 `template` 编译为 `render function`。

```
// 如果 query 的 type 是 template，比如 /App.vue?type=template
if (query.type === 'template') {
  ctx.type = 'js'
  
  // 编译 template 生成 render function
  ctx.body = compileSFCTemplate( 
    // ...
  )
  return etagCacheCheck(ctx)
}
```

如果 `query` 的 `type` 是 `style`，比如 `/src/App.vue?type=style&index=0`，那么就会使用 `compileSFCStyle`函数将其编译为 `style`。

```
// 如果 query 的 type 是 style，比如 /src/App.vue?type=style&index=0
if (query.type === 'style') {
  const index = Number(query.index)
  const styleBlock = descriptor.styles[index]
  const result = await compileSFCStyle( // 编译 style
    // ...
  )
  if (query.module != null) { // 如果是 css module
    ctx.type = 'js'
    ctx.body = `export default ${JSON.stringify(result.modules)}`
  } else { // 正常 css
    ctx.type = 'css'
    ctx.body = result.code
  }
}
```

### 依赖预构建

在上面的部分我们简单有提到 `Vite` 在拿到资源后会进行依赖预处理这个过程，下面我们来详细看下依赖预构建的过程。

因为我们开发依赖的第三方模块不一定都是导出的 `ESM` 的代码，同时，`Vite` 又只支持 `ESM` 模块，所以我们势必是需要做代码的转换，将其他非 `ESM` 模块的代码转换为 `ESM`。其次，在使用某些依赖的时候，该依赖可能还依赖其他模块，这样递归下去，模块数量可能呈指数级别增长，将多个内部模块转换成单个模块，也是会极大的提高性能。比如官网的 `lodash` 的例子，我们在项目中只使用了一个 `debounce` 方法，浏览器会发 600 个请求。

我们在项目中安装 `lodash-es`：`npm i \-D lodash-es`，然后在 `App.vue` 中引入 `debounce` 方法：

```html
<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
<script>
import HelloWorld from './components/HelloWorld.vue'
import { debounce } from 'lodash-es'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>
```

我们再次打开浏览器，发现请求发了好几页还没有结束，并且页面的加载时间也由之前的 100多 毫秒增加到了 1.5秒。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c0fb1efc68024aecb1e605023b106277~tplv-k3u1fbpfcp-watermark.image?)

Vite 默认会将 `package.json`中的 `dependencies` 部分启动依赖预编译，将所有的内部模块打包到一个 `bundle` 中，同时处理为 `ESM` 模块。我们将我们的刚刚新增的 `loadsh-es` 依赖从 `devDependencies` 放到 `dependencies` 中，然后再重新启动应用，我们可以发现在控制台多了 `Pre-buildin` 的过程，这就表示 `Vite` 在对 `loadsh-es` 进行预编译。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88a98156cece4ae497d51f864ddd930f~tplv-k3u1fbpfcp-zoom-1.image)

等到启动结束，我们再次打开浏览器，发现页面打开的速度快了很多，并且只有 `lodash-es.js` 一个请求了

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c5904a3298642f29a506bba84d5850d~tplv-k3u1fbpfcp-zoom-1.image)

`Vite` 对 `dependencies` 中的依赖启用依赖预编译之后，会将编译的结果存放在缓存中，在启动 `devServer` 的时候就直接使用缓存的编译结果。

我们也可以通过在 `vite.config.js` 中配置 `optimizeDeps` 选项来控制哪些依赖需要进行依赖预编译。在启动的时候也可以加上 `--force options` 参数可以不使用之前缓存的结果，强制重新进行依赖预编译。

[](https://blog.csdn.net/qq_42049445/article/details/113806175)

这个时候，有的同学可能会有疑问了，Vite 不是号称 `no-bundle` 是不需要构建的，那为什么还会有依赖预构建呢？我个人的理解是，依赖预构建只是一种优化手段，没有依赖预构建，no-bundle 的方案也是可以跑的通的（就是时间久了点，请求多了点。

我们来看一下 Vite 是怎么实现预编译的，核心的逻辑在 [node/server/index.ts](https://github.com/vitejs/vite/blob/1.x/src/node/server/index.ts) 中，该文件主要的作用是创建一个本地开发服务器 devServer。我们在其核心方法 `createServer` 方法的最后可以找到如下代码：

```
export function createServer(config: ServerConfig): Server {
 // ...
 const listen = server.listen.bind(server)
  server.listen = (async (port: number, ...args: any[]) => {
    if (optimizeDeps.auto !== false) {
      await require('../optimizer').optimizeDeps(config)
    }
    return listen(port, ...args)
  }) as any

  server.once('listening', () => {
    context.port = (server.address() as AddressInfo).port
  })

  return server
}
```

我们可以看到，在本地开发服务器 `devServer` 启动之前，会调用 `optimizeDeps` 方法，该方法就是预编译的核心方法，该方法在 [node/optimizer/index.ts](https://github.com/vitejs/vite/blob/1.x/src/node/optimizer/index.ts) 中，代码比较多，就不带大家详细看了，这里总结一下该方法的几个关键步骤，首先会获取依赖的详细信息，然后对比缓存文件的 Hash 判断是否存在缓存，如果存在缓存，则直接 `return` 不进行 `esbuild` 构建。如果不存在缓存，则 处理 `optimizeDeps.includes` 相关的逻辑，然后再使用 `esbuild` 进行构建并返回构建结果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6ab014759ba41baa11d94ce915fc4db~tplv-k3u1fbpfcp-zoom-1.image)

在本地开发服务器 `devServer` 启动之后，当模块请求预编译的依赖的时候，`Vite` 会先判断依赖是否在缓存中，有则直接从缓存中获取编译后的结果，从而缩短了启动时间。

这里需要提一下 [esbuild](https://github.com/evanw/esbuild)，因为 `esbuild` 使用 Go 编写，所以构建速度会很快！这也是 `Vite` 能够 “秒启动” 的关键。

下图是官网给到的构建速度的对比（嗯，是碾压的级别了）。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd1161b1f37140129e371a55389e5b10~tplv-k3u1fbpfcp-zoom-1.image)

## Vite 和 Webpack 的对比

`Vite` 作为新生代构建工具，难免是需要和“老一辈”构建工具的王牌 `webpack` 做比较。值得肯定的是，两者都是及其优秀的构建工具，都值得我们深入学习和探索。我们就来简单对比下两款工具的区别。

**开发环境**：

- `Vite` 因为不需要分析所有的模块的依赖并且使用了 `esbuild` 所以初次启动非常快。而 `webpack` 会先进行打包再启动开发服务器，所以在初次启动速度会差一些。
- `Vite` 中，在一个模块有改动之后，浏览器只需要重新请求该模块即可，而 `webpack` 需要把模块的相关依赖模块重新编译。所以 `Vite` 的 `HMR` 优势明显，基本上是所见即所改。
- 因为 `Vite` 是基于 `ESM` 的，所以其在开发环境下必须使用支持 `ESM` 的现代浏览器。在生产环境下，编译目标参数 `esBuildTarget` 的默认值为 `es2019`，最低支持版本为 `es2015`。
- `Vite` 只支持 `Vue3`，不兼容低版本。

个人认为在开发环境下，`Vite` 的开发体验会更好，主要表现在启动速度快和热更新速度快。

**打包编译**：

- 在打包阶段，因为 `webpack` 有着丰富的编译、打包经验，所以其打包速度更胜一筹。

**社区支持：**

- `Vite` 还处于一个茁壮成长的青少年时期，其社区活跃度和插件的完善程度都还有待完善。
- 而 `webpack` 我们大部分的开发场景下都已经有最佳实践。

## Snowpack

除了 `Vite`，还有一款知名的 `no-bundle` 构建工具：`Snowpack`，其提出的时间甚至早与 `Vite`（可能是因为 Vite 是尤大写的推广程度比较好吧 =。=）。

`Snowpack` 和 `Vite` 都是 `no-bundle` 构建工具，核心思想大致相同，所提供的功能也大致相同。主要的区别是 `Snowpack` 在生产环境下也默认使用 `no-bundle` 构建，如果你需要打包，可以自己使用插件。

## `no-bundle` 构建的优点

`no-bundle` 构建的最大优势在于构建速度快，尤其是启动服务的初次构建速度要比目前主流的打包构建工具要快很多，原因如下：

- 初次构建启动快：打包构建流程在初次启动时需要一系列的模块依赖分析与编译，而在 `no-bundle` 构建流程中，这些工作都是在浏览器渲染页面时异步处理的。启动服务时只需要做少量的优化处理即可。所以启动非常快。
- 按需编译：在打包构建流程中，启动服务时即需要完整编译打包所有模块，而 `no-bundle` 构建流程是在浏览器渲染时，根据入口模块分析加载所需模块，编译过程按需处理，因此相比之下处理内容更少，速度也会更快
- 增量构建速度快：在修改代码后的 `rebuild` 过程中，主流的打包构建仍然包含编译被修改的模块和打包产物这两个主要流程，因此相比之下，只需处理编译单个模块的 `no-bundle` 构建在速度上也会更深一筹（尽管在打包构建工具中，也可以通过分包等方式尽可能地减少两者的差距）

## `no-bundle` 构建的缺点

- 浏览器网络请求数量剧增：`no-bundle` 构建最主要面对的问题是，它的运行模式决定了在一般项目里，渲染页面所需发起的请求数远比打包构建要多得多，使得打开页面会产生瀑布式的大量网络请求，将对页面的渲染造成延迟。这对于服务稳定性和访问性能要求更高的生产环境来说，通常是不太能接受的。尤其是对不支持 `http2` 的服务器而言，这种处理更是灾难性的。因此，一般是在开发环境下使用无包构建，在生产环境下则仍使用打包构建。
- 浏览器的兼容性：`no-bundle` 构建要求浏览器支持 `ESM`，尽管目前的主流浏览器已大多支持，但是对于需要兼容旧浏览器的项目而言，仍然不可能在生产环境下使用。

## 总结

`no-bundle` 构建产生的基础是浏览器对 `ESM` 的支持，这样才能把构建过程中分析模块依赖关系并打包的过程变为在浏览器中逐个加载引用的模块。但是这种加载模块的方式在实际项目中应用场景下还存在一些阻碍。
    