
# 打包篇-Electron打包体积优化
---

## 前言

应用构建生成安装包，窃喜，欲分享，微信至张三，张三曰：“入夜，来吾陋室，共享之”，夜深，手挎电脑，进寝室，颤巍双手点鼠标，发送，少倾，啪的一声，张三怒而站起，曰：“汝为何之大！”

多大？来看看我们的应用程序大小。`219M`，想一想，我们也没写什么代码，咋就这么大了？

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29ef6c67f7774fc9ac80701f3076d0d8~tplv-k3u1fbpfcp-watermark.image?)

我们右键应用程序，选中“显示包内容”，点击进入到 `Contents`，可以看到一些文件夹。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c11efd0629e049df8620f884a993b0d9~tplv-k3u1fbpfcp-watermark.image?)

比如这个 `Frameworks` 里面放的是 v8 引擎和 chromium 内核，我们看看它有多大。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40b1d3136a1b453eaeda912932b6b9e6~tplv-k3u1fbpfcp-watermark.image?)

单单这个东西就占了 178M，另外的 40M 左右大小在哪呢？我们看看 `Contents/Resources` 文件夹下，有一个叫做 `app.asar` 的玩意。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4a4c9bac65464eda8533db9f8d32c07b~tplv-k3u1fbpfcp-watermark.image?)

哦豁，这是个什么东西，大小居然 40M，这个 asar 是个啥玩意？我们可以从[文档](https://fileinfo.com/extension/asar)中看到说明

> An ASAR file is an archive used to package source code for an application using Electron, an open source library used to build cross-platform programs. It is saved in a format similar to [.TAR](https://fileinfo.com/extension/tar) archives where files contained in the archive, such as [.HTML](https://fileinfo.com/extension/html), [.JS](https://fileinfo.com/extension/js), and [.CSS](https://fileinfo.com/extension/css) files, are concatenated together without using compression.

我们可以来解压一下 `app.asar`，网上搜对应文章就 OK 了。下面我们跟着阿宽解压一波

 1.     首先安装

```
npm install -g asar
```

 2.     进入到 `Contents/Resources` 文件夹内进行解压，下面解压到该文件夹下的 app 文件夹

```
asar extract app.asar ./app
```

你就会看到有一个 `app` 文件夹，点进去看一看

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e111c11458ff4a1ea205c78d41685bca~tplv-k3u1fbpfcp-watermark.image?)

## 优化方向

先来捋一捋，我们整个应用打包出来的文件夹是这样的

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/228c849b88004b79a1472de99c8e1b89~tplv-k3u1fbpfcp-watermark.image?)

关于 `Frameworks` 我们是操作不了了，里面放的是 v8 引擎和 chromium 内核，我们只能想办法优化 `Resources`，在 Resources 中好像很多文件夹都比较小，并且是默认生成的，正所谓“不做作就不会死”，改出了问题怎么办（关键你也不知道怎么改），所以说我们还是动熟悉的那块。

那么哪一块我们熟悉呢？`app.asar`解压后的 `dist` 和 `node_modules`，上面看到了，40M 里，node\_modules 占了大头，所以我们要做的是我们的应用能否不打包 `node_modules` 文件夹，或者是让打包的东西尽可能少？

## 打包优化

electron 在打包过程中，会读取 `package.json` 中的 `dependencies` 依赖，将其依赖 `“copy”` 一份放在 `Resources/app.asar` 中，也就是我们压缩之后的代码包。

**故此，想要减小包体积大小，就要减小 `node_modules` 的大小，想减小 `node_modules` 的大小，就要做到 `dependencise` 依赖尽可能少，想减少 `dependencise` 依赖，就要把没必要的包放在 `devDependencies`。**

方法告诉你了，赶紧动手试试吧！因为前面阿宽已经区分过了，等价于已经优化过一轮了。

> 你可以皮一下，把 package.json 中的 devDependencise 包都放在 dependencise，然后打个包看看体积多大，经过对比，验证结论。

## 知识点延伸

### 1\. 关于 dependencies 与 devDependencies

- dependencies 是产生环境下的依赖，比如说 Vue、React 等
- devDependencies 是开发环境下的依赖，比如 Webpack、ESLint、Babel 等

可能这么讲小伙伴们还是不怎么能区分，这么说吧。我写了一个 React UI 组件包，其中依赖了 AntDesign，那我需要将 AntDesign 和 React 放在 dependencies 中。

再比如说，我们项目中用到了 Redux，但是 Redux 的 devDependencies 里面有 jest、rxjs 等，在我们安装 Redux 时，我们是不会把 jest、rxjs 拉下来的（也就是 node\_modules 里是不会有 jest、rxjs）

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fbcb48a9e8a46bcb5eb11c7bf7bb471~tplv-k3u1fbpfcp-watermark.image)

一般我们开发过程中，会在项目中安装 webpack、webpack-dev-server、babel、eslint 的等工具库，或者是用于单元测试的 jest 库，这些依赖库都只是在我们项目开发过程中使用，应该写在 devDependencies 里。如果说我们依赖乱写，例如开发依赖放在生产，生产依赖放在开发，这会出现什么问题？

以 [rc-redux-model](https://github.com/SugarTurboS/rc-redux-model/blob/master/package.json)为例，我们可以看到它的依赖非常的少。这是一个 npm 包。当我们执行 `npm install rc-redux-model` 时，此时会将 dependencies 的依赖都安装，不会安装 devDependencies 里的依赖库。

但如果是通过克隆仓库项目代码，如 `git clone https://github.com/SugarTurboS/rc-redux-model`，然后再 `npm instal`，这时候会将 dependencies 和 devDependencies 里的依赖库都安装。

### 2\. devDependencise 包依赖会被打进去吗？

一开始我也有疑惑，如上所述的，electron 打包只会将 dependencise 依赖打进去，那假设我不小心把 `lodash`、`axios` 放在了 devDependencise 里。

结果是什么：electron 打包后的 `Resources/app.asar` 解压后，node\_modules 是找不到 `lodash`、`axios` 的！小伙伴们能理解吧？那么我不禁思考，我代码里肯定用到了 axios、lodash，为什么它不报错，为什么能正常运行？

于是我做了一个实验。新增一个空项目，然后写一份 package.json，安装一下，接着新增一个 a.js，编写下面代码，看看打包之后的内容。

```js
// 第一步：创建文件夹
mkdir test

// 第二步：进入文件夹
cd test

// 第三步：新增 package.json
touch package.json

// 第四步：编写 package.json，按照下面图片写一下就好了
vim package.json

// 第五步：新增 a.js
touch a.js

// 第六步：编写 a.js，按照下面图片写一下就好了
vim a.js

// 第七步：打包
npx webpack a.js
```

首先我们先来测试，`devDependencise` 依赖中有个叫 lodash 的库

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/900ea08f589c4522ba71703c0862282a~tplv-k3u1fbpfcp-watermark.image?)

再来测试一下，`dependencise` 依赖中有个叫 axios 的库

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d768099f3d964afc817fb0f65a69f177~tplv-k3u1fbpfcp-watermark.image?)

在测试一下，如果是插件类的 `devDependencise`，是不是也会打进去呢？试试 `webpack-merge`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/74a500f04cee4c459b6b89d84805ee35~tplv-k3u1fbpfcp-watermark.image?)

**结论：我个人认为，无论是 `devDependencise` 还是 `dependencise`，实际上都会把这些包打进 js 中。对于 web 应用项目来讲，依赖写在哪不是很重要，说实在话项目中多多少少还是会有一些依赖是处于混用状态。但这是个人主观意识，说白了就是有没有代码洁癖，是不是严格要求写依赖。**

> 对于 web 应用来讲，不是很重要，但对于开发第三方包来讲，一定要严格区分，正如我前面所说的，第三方包 `npm install` 时，只会安装 `dependencise` 的依赖。同时对于 electron 应用来说，也要严格区分，毕竟这是跟应用大小相关的东西。还是严格一点好。

## 最后

本章节的重点从 electron 的打包体积优化逐步变成 node\_modules 的体积优化，再演变为 `dependencies` 与 `devDependencies` 的区别，通过实验验证心中所存在的疑惑。

如果对本章节存在疑问，欢迎在评论区留言。如果觉得阿宽哪里表达错误，可指出，虚心请教～
    