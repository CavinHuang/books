
# 探索 npm 安装机制
---

在前面从 0 到 1 搭建现代前端项目那篇文章中，我们频繁看到一个命令：`npm run dev` 或者 `npm install`，那么 npm 到底是什么呢？同时，在平时的开发中，我们可能也会有以下疑问：如果我们项目依赖 A 和 B，并且 A 也依赖 B，那么 B 会被重复下载吗？为什么相同的 `package.json` 文件，不同开发者进行安装，最后依赖的版本会不同呢？在代码合并的时候，`lock`文件发生冲突了怎么办？`lock` 文件需要提交到远端吗？

至于这些问题的答案，相信你掌握了 npm 的安装机制之后就都清楚了。下面我们就来详细讲解。

## npm 简介

关于 npm，其官网原文是这么解释的：

> npm is the world's largest software registry. Open source developers from every continent use npm to share and borrow packages, and many organizations use npm to manage private development as well.

npm（Node Package Manager， `node` 的**包管理器**），是 `node` 默认的、以 JavaScript 开发的基于 Node.js 的**命令行工具**，本身也是 `node` 的一个包。

你可以这样简单来理解：**npm 是一个存储前端代码的大型仓库，发布者可以将自己的代码在仓库中发布，同时使用者也可以从仓库 clone 项目到本地，通过这样的方式，实现代码的共享**。

那 npm 是怎么发展起来的呢？

你可以试想一下在最初的 JQuery 时代，如果想要使用 JQuery 及其插件的话，那么需要怎么操作呢？

- 去 JQuery 官网上下载 JQuery 源码或者找一个 CDN 地址。
- 去 BootStrap 官网下载 BootStrap 源码或者找一个 CDN 地址。
- 如果想要使用某一个插件，比如轮播图 Swiper，那么就需要开发者将源代码上传到服务器上，使用者通过 CDN 地址获取源代码。

现代的前端开发，已经不再是写一两个浏览器页面或者特效就可以的了。现在的前端已经有了开发大型项目的能力。那么肯定会涉及到和他人的合作，需要引入一些开源框架、工具、团队内共用的模块。一个成熟的前端大型项目，可能要引入几十个不同的依赖，那么每一个依赖都需要自己去找 CDN 资源或者去网站上下载源码，想想就觉得十分麻烦呢！懒惰使人进步，推动科技发展，就有那么一个比较“懒”的伟大的程序小哥哥 [Isaac Z. Schlueter](https://link.zhihu.com/?target=https://github.com/isaacs) ，提出可以将这些代码集中到一起管理。于是，npm 的雏形就诞生了。

那么 npm 后续又是如何快速地发展壮大呢？这还要归功于 Node.js 的发展。因为在 Node.js 的初期刚好缺少一个包管理工具，这不恰好是 npm 的主要功能吗？所以，Node.js 就和 npm 合作，在 Node.js 中内置 npm。随着 Node.js 的大火，作为其包管理工具的 npm 也就跟着发展起来了。

那么在有了 npm 之后，又是怎么安装项目中的依赖呢？我们只需要使用一个安装命令 `npm install package-name`，npm 就会帮你将源码自动下载到 `node_modules` 中。

也就是说，只要知道安装包的名字，然后只用一行命令就可以下载源码，这是不是方便了不少呢？\(_\^▽\^_\)

## npm 安装流程

前面我们只是介绍了 `npm install` 是用来安装依赖的，下面再讲一下它到底是怎么安装的以及一些具体的安装细节。

**第一步：执行安装命令之后，npm 首先会去查找 npm 的配置信息。** 其中，我们最熟悉的就是安装时候的源信息。npm 会在项目中查找是否有 `.npmrc` 文件，没有的话会再检查全局配置的 `.npmrc` ，还没有的话就会使用 npm 内置的 `.npmrc` 文件。

**第二步：获取完配置文件之后，就会构建依赖树。** 首先会检查下项目中是否有 `package-lock.json` 🔐文件：存在 lock 文件的话，会判断 lock 文件和 `package.json` 中使用的依赖版本是否一致，如果一致的话就使用 lock 中的信息，反之就会使用 npm 中的信息；那如果没有 lock 文件的话，就会直接使用 `package.json` 中的信息生成依赖树。（具体是怎么生成依赖树的呢？下面会详细介绍。）

**第三步：在有了依赖树之后，就可以根据依赖树下载完整的依赖资源。** 在下载之前，会先检查下是否有缓存资源，如果存在缓存资源的话，那么直接将缓存资源解压到 `node_modules` 中。如果没有缓存资源，那么会先将 npm 远程仓库中的包下载至本地，然后会进行包的完整性校验，校验通过后将其添加的缓存中并解压到 `node_modules` 中。

npm 默认不会将依赖安装到全局，只会安装到当前的路径下，这样设计是为了不同的项目之间进行依赖隔离，互不影响。当然，用户也可以选择安装到全局，只需要在安装命令后带上 `-g` 参数即可。

**第四步：会生成 `package-lock.json` 文件。** 那么这个文件是干什么的呢？我们都知道，在 `package.json` 文件中，如果我们在依赖的版本号前增加 `^` 标志的话，比如 `^3.1.6` 意味着安装的时候会安装 3.x.x 的大版本中最新的小版本。这样，不同的时间执行安装操作就会有不同的结果。所以 lock 这个文件会将本次安装的依赖的版本信息记录下来，在下次再安装的时候，或者其他伙伴使用该包，或者通过 CI 工具的时候，就会安装相同版本的依赖。这样就会避免 `package.json` 中的内容一致但是实际上安装依赖的版本不一致而造成 Bug 出现的情况。

这里我也整理出了一张流程图，你可以结合着来理解：

![npm安装机制](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c87b3d0879fc411fbbde141261c0720d~tplv-k3u1fbpfcp-watermark.image?)

## 不同版本生成依赖树的区别

在上面安装流程的第二步是生成依赖树，那么具体是怎么生成的呢？这里要详细说一下，不同的版本生成依赖树的方式是有区别的，其中主要是 v2、v3 和 v5 的版本之间的区别，我们分别来看下。

### npm 2.X

在 npm 2.X 时期，还是使用的最简单的**循环遍历**方式，递归地下载所有的依赖包，只要有用到的依赖，都进行安装。

![npm2.x依赖查找过程](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f471d3ffa3904b389fb2c9abdd384e34~tplv-k3u1fbpfcp-watermark.image?)

直接递归这种方式很简单，很好理解对不对？ㄟ\(▔,▔\)ㄏ，但是稍微想一下就知道这个有坑啊！**项目之间难免有相同的依赖，然后就会有大量冗余的依赖**。随着项目规模的增大，node\_modules 的大小会呈指数增加。在 Windows 系统中，就有目录层级太深而导致文件路径过长报错的案例。这就是恐怖的 **node\_modules 黑洞**（如下示意图）！

![node_modules 黑洞](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff279aae473943ec99f9c0d085405698~tplv-k3u1fbpfcp-watermark.image?)

### npm 3.X

随着使用 npm 的开发人员越来越多，node\_module 黑洞这个问题肯定是要解决的（不然谁还用\~\~），所以在 3.X 版本，npm 团队就对生成依赖树的方式进行了优化：**将原有的循环遍历的方式改成了更为扁平的层级结构，将依赖进行平铺**。

在生成依赖树的时候，首先会遍历所有的依赖并将其放入树的第一层节点，然后再继续遍历每一个依赖。当有重复的模块时，如果依赖版本相同，就丢弃不放入依赖树中。如果依赖版本不一致，那么就将其放在该依赖下。

比如，现在项目有 A、B、C 三个依赖，A 和 B 都依赖 `D(v 0.0.1)`，C 依赖 `D (v 0.0.2)`，那么首先会遍历项目的所有节点将其放入树的第一层（此时树中有 A、B、C 三个节点）。然后再继续遍历树的第一层节点有哪些依赖。此时 A 有依赖 `D(v 0.0.1)`，在依赖树中没有该依赖，所以就将其放入依赖树的第一层节点中。然后找 B 的依赖，B 依赖 `D(v 0.0.1)`，此时 `D(v 0.0.1)` 已经在依赖树中了，所以就直接舍弃不放入到依赖树中。最后找到了 C，C 依赖 `D(v 0.0.2)`，和依赖树中的 `D(v 0.0.1)` 两者的版本不一致，所以就将 `D(v 0.0.2)` 放在 C 下面。

最终生成的依赖树如下图：

![npm3.x依赖查找过程](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7ab9c6706b44930b4ee87fc6fbb66a6~tplv-k3u1fbpfcp-watermark.image?)

但是采用这样的安装方式的话，又会有一个新问题：**生成的依赖树会因为依赖的顺序不同而不同**。比如在上图中，如果 C 的顺序在最前面，A、B 在 C 的后面，那么安装依赖的时候，第一层查找到了 C、A、B 三个依赖，依次将其放入到依赖树中。然后查找 C 中的依赖，C 依赖 D\(v 0.0.2\)，在依赖树中没有该依赖，就将其放入依赖树的第一层。然后继续查找，A 依赖 D\(v 0.0.1\)，此时依赖树中已经有 D\(v 0.0.2\) 了，和 D\(v 0.0.1\) 版本不同，所以就将 D\(v 0.0.1\) 放入 A 的节点下。然后继续查找，B 也依赖 D\(v 0.0.1\)，同样和依赖树中已经有 D\(v 0.0.2\) 了版本不同，所以也将 D\(v 0.0.1\) 放入 B 的节点下。

最后生成的依赖树如下：

![npm3.x依赖查找过程](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97f08391827f47b991b49eaa47fa2615~tplv-k3u1fbpfcp-watermark.image?)

所以，在 npm 3.X 版本中，虽然将生成依赖树的方式由无脑的循环遍历改为了平铺的方式，但是会因为依赖的先后顺序不同而导致安装的依赖结果不同。

### npm 5.X

为了解决 3.x 版本安装的不确定性问题，同时还会有一个风险就是在不同时机可能安装依赖的版本不同（比如我们常见到的在版本号前加 \^ 符号，就只会匹配最大版本的依赖包，自动升级小版本），所以**在 npm 5.X 版本中新增了 `package-lock.json` 锁文件**（在 yarn 中早就有了 o\(╥﹏╥\)o）。

在安装依赖流程中的最后一步，会生成 `package-lock.json` 文件，该文件存储的是确定的依赖信息。也就是说，只要 lock 文件相同，那么每次安装依赖生成的 `node_module` 就会是相同的。

`package-lock.json` 文件结构如下：

![package-lock.json文件结构](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6bb617bc1b3b4e338eb2cac1b59b6e9d~tplv-k3u1fbpfcp-watermark.image?)

同时，在项目中使用 `package-lock.json` 还可以**减少安装时间**。因为在 `package-lock.json` 锁文件中已经存放了每个包具体的版本信息和下载链接，这就不需要再去远程仓库进行查询，**优先会使用缓存内容从而减少了大量的网络请求**，并且对于弱网环境和离线环境更加友好。

## npm 的缓存机制

回想一下，在同一个团队中，基本上每一个项目都会用到相同的框架、工具库，那么每次安装同一个版本的依赖是不是有些浪费资源呢？特别是在弱网或者离线的状态下，如果明明本地已经有该依赖了，那么使用本地缓存依赖是不是比下载不成功要好一些呢？

作为一个成熟的包管理工具，缓存机制肯定也是需要考虑的一个常见设计，所以我们就来看一下 npm 的缓存机制到底是怎样的。

在前面安装流程的第三步中也提到了，在下载之前，会先检查下是否有缓存资源。

我们先来找一下缓存文件是存在我们电脑的哪个位置，执行 `npm config get cache` 命令，得到的缓存文件的路径如下：

- 在 Mac 下，`${user.home}.npm/_cacache` ；
- 在 Windows 下，`${user.home}/AppData/Roaming/npm-cache`。

我们根据上面的结果找到对应的文件看一下长什么样子，如下图所示：

![npm缓存目录](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9de74c8fbb514640ba493a78fd9cfaf6~tplv-k3u1fbpfcp-watermark.image?)

emmm， `_cacahe` 这文件夹里面的东西，好像有些看不懂哇！不要着急，我们这就来介绍下！可以看到，在 cache 文件夹中，在 `content-v2` 和 `index-v5` 两个文件夹中都是一些 2 位字符的文件夹，是不是很像索引文件？

根据文件夹的名字，我们可以大致猜测出： **content-v2 文件是用来存在缓存包的具体内容，index-v5 是用来存储依赖包的索引，根据 index-v5 中的索引去 content-v2 中查找具体的源文件 。**

我们可以下载一个依赖来验证一下我们的猜想，看一下依赖信息是怎么和缓存信息相对应上的。比如，我们先安装 `loadsh`，安装完后我们就可以在 `package-lock.json` 文件中看到 `dependencies` 字段中新增了一项 key 为 `lodash` 的字段：

```
"lodash": {

  "version": "4.17.21",

  "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",

  "integrity": "sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg=="

}
```

查找资料我们得知：npm 在安装依赖的过程中，会根据 `lock`文件中具体的包信息，用 `pacote:range-manifest:{url}:{integrity}` 规则生成出唯一的 key，然后用这个 key 通过 SHA256 加密算法得到一个 hash。这个 hash 对应的就是 `_cache/index-v5` 中的文件路径，前 4 位 hash 用来区分路径，剩下的几位就是具体的文件名。文件的内容就是该缓存的具体信息了。

如果依赖改变的话，生成的 hash 就没有对应的缓存信息可以命中，此时就会重新下载新依赖然后再更新缓存。

我们使用刚刚下载的 `lodash` 来验证一下，我在网上找了一个 SHA256 算法在线生成 hash 的网站来验证下，按照上面的规则生成的 hash 结果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fdb53a4686e47fa99b523c530e35e6e~tplv-k3u1fbpfcp-zoom-1.image)

然后我们再去 `_cacache/index-v5` 里看能不能找到对应的文件，根据前面我们在 `index-v5` 中的文件名命名规则，我们猜出前 4 位是用来区分路径的，所以我们就应该在 `7a` 下面的 `bb` 文件夹中看下有没有 `86ab....` 这个文件。见证奇迹的时刻到了！\(๑•̀ㅂ•́\)و✧

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6ae1f6189d9408b8b44d89bf160bd04~tplv-k3u1fbpfcp-zoom-1.image)

然后我们打开该文件看一下该文件里面的内容：

```
{
  "key":"pacote:range-manifest:https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz:sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==",
  "integrity":"sha512-C2EkHXwXvLsbrucJTRS3xFHv7Mf/y9klmKDxPTE8yevCoH5h8Ae69Y+/lP+ahpW91crnzgO78elOk2E6APJfIQ==",
  "time":1630917070855,
  "size":1,
  "metadata":{
    "id":"lodash@4.17.21",
    "manifest":{
      "name":"lodash",
      "version":"4.17.21",
      "dependencies":{},
      "optionalDependencies":{},
      "peerDependenciesMeta":{},
      "devDependencies":{},
      "bundleDependencies":false,
      "peerDependencies":{},
      "deprecated":false,                                                     "_resolved":"https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
      "_integrity":"sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==",
      "_shasum":"679591c564c3bffaae8454cf0b3df370c3d6911c",
      "_shrinkwrap":null,
      "_id":"lodash@4.17.21"
    },
    "type":"finalized-manifest"
  }
}
```

这文件里面的大部分字段我们都已经见过了，只有一个 `_shasum` 我们并不是很熟悉。这个 `_shasum` 是 SHA-1 加密返回的 40 位十六进制小写密文。这一步中 `_shasum` 又充当了源文件包索引的作用，我们可以用这个 `_shasum` 去 `_cache/content-v2` 中找一下对应的文件。

```
➜  _cacache file >> content-v2/sha1/67/95/91c564c3bffaae8454cf0b3df370c3d6911c 
content-v2/sha1/67/95/91c564c3bffaae8454cf0b3df370c3d6911c: gzip compressed data, from Unix, original size modulo 2^32 2269184
```

可以看到这是一个 gzip 文件。然后我们解压看下里面的内容，可以看到这就是我们刚刚下载的 lodash 的源码！

```
➜  _cacache tar tf >>  content-v2/sha1/67/95/91c564c3bffaae8454cf0b3df370c3d6911c 
package/LICENSE
package/fp/__.js
package/_apply.js
package/_arrayAggregator.js
package/_arrayEach.js
package/_arrayEachRight.js
package/_arrayEvery.js
package/_arrayFilter.js
package/_arrayIncludes.js
package/_arrayIncludesWith.js
package/_arrayLikeKeys.js
package/_arrayMap.js
...
```

说了这么多，那 npm 的缓存机制到底是怎么样的呢？现在我们就来总结下。

- 在安装资源的时候，npm 会根据 lock 中的 integrity、version、name 信息生成一个唯一的 key。
- 然后用这个 key 经过 SHA256 算法生成一个 hash，根据这个 hash 在 `index-v5` 中找到对应的缓存文件，该缓存文件中记录着该包的信息。
- 根据该文件中的信息我们在 `content-v2` 中去找对应的压缩包，这样就找到了对应的缓存资源了。
- 最后再将该压缩包解压到 `node_modules` 中，节省了网络开销和安装时间，完美！

## npm 如何检查资源的完整性

在 npm 安装流程的第三步中，将依赖从远程文件下载到本地后会进行包的完整性校验，以保证在下载的过程中没有出现错误。**资源完整性校验是** **npm** **安装机制的安全保证**，npm 必须要确保你下载的代码是完整的、没有被侵害的恶意代码……

那 npm 是怎么保证资源完整性的呢？下面我们就来简单介绍下。

在下载依赖之前，该资源包就有一个 hash 值，我们可以在 npm 提供的网站上看到所有这个包的版本信息：<https://registry.npmjs.com/lodash，> 找一下我们下载的 `4.17.21` 这个版本：

```
"4.17.21":{
  "name":"lodash",
  "version":"4.17.21",
  "description":"Lodash modular utilities.",
  "keywords":[
    "modules",
    "stdlib",
    "util"
  ],
  "homepage":"https://lodash.com/",
  "repository":{
    "type":"git",
    "url":"git+https://github.com/lodash/lodash.git"
  },
  "icon":"https://lodash.com/icon.svg",
  "license":"MIT",
  "main":"lodash.js",
  "author":{
    "name":"John-David Dalton",
    "email":"john.david.dalton@gmail.com"
  },
  "_id":"lodash@4.17.21",
  "_nodeVersion":"14.15.5",
  "_npmVersion":"6.14.11",
  "dist":{
    "integrity":"sha512-v2kDEe57lecTulaDIuNTPy3Ry4gLGJ6Z1O3vE1krgXZNrsQ+LFTGHVxVjcXPs17LhbZVGedAJv8XZ1tvj5FvSg==",
    "shasum":"679591c564c3bffaae8454cf0b3df370c3d6911c",
    "tarball":"https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
    "fileCount":1054,
    "unpackedSize":1412415,
  }
}
```

信息当中你可以看到一个熟悉的字段 `shasum` 。我们只需要在下载完成之后在本地用相同的算法再次计算得出一个 `shasum`，对比两个 `shasum`：如果相同，就代表下载的依赖是完整的；反之，则说明下载过程中出现了问题，会再次重新下载。

# 开发中的最佳实践

以下建议均为个人在开发中根据所遇到的问题而产生的最佳实践，大家可以参考下。

- 不同的 npm 版本的安装流程会有所不同，我们尽量使用 npm v5.7 以上版本（因为 `package-lock.json` 生成逻辑 在 5.0 - 5.6 版本中有过几次更新，npm 5.6 以上才逐渐稳定\)。
- 建议在项目中使用 `package-lock.json` 文件，并将其提交到远端仓库，从而提升依赖安装时间以及安装包的稳定性。
- 创建项目的时候使用 `npm install` 安装依赖，在提交代码的时候将 `package.json`、`package-lock.json` 提交到远端仓库，同时 ignore掉 `node_modules`文件。
- 其他成员在 `clone` 过代码之后执行 `npm install` 安装依赖，npm 会根据 `package.json` 和 `package-lock.json` 文件一起确定 `node_modules` 文件。
- 升级依赖使用 `npm` 命令安装\\更新\\删除依赖，此时 `package-lock.json` 文件会一同修改。然后将 `package.json` 文件和 `package-lock.json` 文件一起提交到远端仓库。
- 在远端的 `package.json` 文件和 `package-lock.json` 文件更新后，其他成员应该拉取最新的代码并执行 `npm install` 更新依赖。
- 如果 `package-lock.json` 文件冲突，应该先手动解决 `package.json` 的冲突，然后执行 `npm install --package-lock-only`，让 npm 自动帮你解冲突。可以参考 [官方推荐做法](https://docs.npmjs.com/cli/v6/configuring-npm/package-locks#resolving-lockfile-conflicts)。

## 总结

在这一讲中，我们详细讲解了 npm 是怎么进行依赖安装的、不同版本的 npm 是如何生成安装需要的依赖树的、在安装过程中的缓存机制是如何运作的，以及在安装过程中又是如何做资源的完整性校验的。

还记得文章开头的几个小问题吗？

> 如果我们项目依赖 A 和 B，并且 A 也依赖 B，那么 B 会被重复下载吗？为什么相同的 `package.json` 文件，不同开发者进行安装，最后依赖的版本会不同呢？在代码合并的时候，`lock`文件发生冲突了怎么办？`lock` 文件需要提交到远端吗？

相信你读完本篇文章，一定对 npm 有了更深入的了解，也一定知道了这几个问题的答案了。（不知道的童鞋向下翻）

同样，也欢迎你留言与我一起交流哈。

---

看评论留言大家对 lock 文件冲突的解决方式还有疑惑，这里回答一下：

## Q：`lock`文件发生冲突了怎么办？

A: **首先，我们应该尽量避免冲突**，在我们需要更新 `package.json` 文件的时候，不要手动去修改 `package.json` 中的依赖，使用 `npm` 命令更新/安装依赖；比如：`npm update`升级小版本、`npm install @version` 升级大版本、`npm uninstall` 删除依赖。同时，任何时候都不要手动修改 `package-lock.json` 文件。

在遇到 lock 文件冲突的时候，那么应该先手动解决 `package.json` 的冲突，然后执行 `npm install \--package-lock-only`，让 npm 自动帮你解冲突。可以参考 [官方推荐做法](https://docs.npmjs.com/cli/v6/configuring-npm/package-locks#resolving-lockfile-conflicts)。
    