
# Vue 实战-环境搭建
---

# Vue 实战：环境搭建

我们现在就用 Vue 最主流的技术栈结合 typescript 来实现一个「待办 WebAPP」。

## 安装 Vue CLI

要快速初始化项目首选肯定是 Vue 官方的 Vue CLI，首先我们在全局安装包：

```
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

> Node 版本要求 Vue CLI 需要 Node.js 8.9 或更高版本 \(推荐 8.11.0+\)。你可以使用 nvm 或 nvm-windows 在同一台电脑中管理多个 Node 版本。

安装之后，你就可以在命令行中访问 vue 命令。你可以通过简单运行 vue，看看是否展示出了一份所有可用命令的帮助信息，来验证它是否安装成功。

你还可以用这个命令来检查其版本是否正确 \(3.x\)：

```
vue --version
```

笔者的版本是 3.12.0，建议尽量跟我的版本一致。

## 创建项目

我们用命令行初始化项目：

```
vue create vue-ts-todo
```

当然，如果你不习惯命令行的操作可以用图形化界面：

```
vue ui
```

但是我还是习惯用命令行初始化，但是 UI 界面可视化效果更好，更有助于我们讲清楚配置过程，所以我们选择 UI 界面:

![2019-10-11-00-10-28](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc18656feea14a~tplv-t2oaga2asx-image.image)

接着我们创建目录名称、选择包管理工具、填入git仓库地址：

![2019-10-11-00-13-06](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc18656ff499c0~tplv-t2oaga2asx-image.image)

选择手动配置，然后选择 Vue 的全家桶，但是没有选择测试相关的内容，因为本项目主要目的是帮助大家进行实战练习，在非生产环境没必要测试：

![2019-10-11-00-16-02](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc1865723f3047~tplv-t2oaga2asx-image.image)

接着我们的配置如下，如下：

![2019-10-11-00-19-37](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc186573b916d1~tplv-t2oaga2asx-image.image)

这里有几项我们解释一下：

- Use class-style component syntax\? Y ：我们选择用组件装饰器语法，长什么之后大家就看到了，目前这个装饰器语法是 ts+vue 的主流选择
- Pick a linter / formatter config？ prettier：这个看个人喜好，我喜欢 prettier 代码美化这套美化方法
- Use Babel alongside TypeScript for auto-detected polyfills\? N：已经有了 TypeScript，我不想再引入 Babel 进行转义了
- 关于 CSS 预处理的问题，我选择了SASS，使用的是`node-sass`，目前而言 `node-sass` 比 `dart-sass` 似乎更快一些

大功告成

![2019-10-11-00-25-17](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc1865743fad90~tplv-t2oaga2asx-image.image)

## 改造项目

项目的整体目录结构是这样的：

![2019-10-10-23-44-07](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc186574ab951e~tplv-t2oaga2asx-image.image)

我们把注意力放在 `src/` 目录中：

```

src
├── App.vue
├── assets
│   └── logo.png
├── components
│   └── HelloWorld.vue
├── main.ts
├── registerServiceWorker.ts
├── router.ts
├── shims-tsx.d.ts
├── shims-vue.d.ts
├── store.ts
└── views
    ├── About.vue
    └── Home.vue
```

我们看 `src/` 目录下的项目主体：

- assets：存放图片等第三方资源的目录
- components：存放自定义组件的目录
- views：存放页面的目录

这里有一些地方需要我们改造：

- router：一个 SPA 项目路由一定不会简单，一个文件是不可能搞定的，我们应该创建一个 `router` 目录专门存放路由
- store：我们采用 vuex 管理管局状态，只用一个 `store.ts` 也不现实，因此我们也需要一个存放全局状态的目录 `store`

首先我们创建一个在 `src/` 下创建一个 `store/` 目录，如何把 `store.ts` 移动到目录中。

注意，因为有其他文件依赖了 `store.ts` 所以我们改变它的路径会导致其他文件的依赖失效，这时候我们在最开始的章节让大家安装的 VS Code 插件就派上用场了，它会自动询问是否帮助你更新路径：

![2019-10-10-23-55-41](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc1865d8186735~tplv-t2oaga2asx-image.image)

`router` 目录，再把 `router.ts` 移动到目录下。

最终我们的目录结构如下:

```
src/
├── App.vue
├── assets
│   └── logo.png
├── components
│   └── HelloWorld.vue
├── main.ts
├── registerServiceWorker.ts
├── router
│   └── router.ts
├── shims-tsx.d.ts
├── shims-vue.d.ts
├── store
│   └── store.ts
└── views
    ├── About.vue
    └── Home.vue
```

## 引入第三方库

想要开发一个完整的webapp，仅仅有 Vue CLI 提供的初始化模板是不够的的，我们需要引入另外一个关键库：

- UI 库：Vue 的移动端UI组件库非常多，但是有些要么流行度不够，要么维护不积极，我一直用的是有赞团队的 Vant，流行度、丰富度、维护积极性都没问题

我们引入依赖库：

1.  选择依赖，然后搜索 Vant

![2019-10-11-00-28-07](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc1865d98a0e0f~tplv-t2oaga2asx-image.image)

2.  安装 Vant

![2019-10-11-00-27-33](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc1865d856b928~tplv-t2oaga2asx-image.image)

现在依然有一个问题，就是当我们引入 vant 组件的时候其实是整体引入的，所有的代码都会打包进我们的app，这十分影响打包体积和性能：

```
import Vue from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
```

因此我们应该按需引入组件，避免不必要的组件引入影响我们的打包体积。

比如引入 Button 组件：

```
import Button from 'vant/lib/button';
import 'vant/lib/button/style';
```

当然，你可能会觉得这样的编写方式太繁琐了，其实在 JavaScript 中我们可以利用 `babel-plugin-import` 插件自动帮我们按需引入，在 TypeScript 中呢？

我们之前学过可以通过编写 TypeScript Transformer Plugin 来达到同样的效果，而之前我们提到的那个插件 `ts-import-plugin` 就可以帮助我们按需引入。

我们打开项目，下载插件：

```
npm i -D ts-import-plugin
```

下载完毕后打开根目录下的 `vue.config.js` 配置文件：

```
const merge = require("webpack-merge");
const tsImportPluginFactory = require("ts-import-plugin");

module.exports = {
  lintOnSave: true,
  chainWebpack: config => {
    config.module
      .rule("ts")
      .use("ts-loader")
      .tap(options => {
        options = merge(options, {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "vant",
                libraryDirectory: "es",
                style: true
              })
            ]
          }),
          compilerOptions: {
            module: "es2015"
          }
        });
        return options;
      });
  }
};

```

将以代码替换掉原代码即可。

随后我们运行 `npm run serve` 启动项目即可。

## 小结

本节我们介绍了利用 Vue CLI 快速初始化项目的过程，由于要引入第三方库，我们学习了利用之前提到过的 `ts-import-plugin` 来达到按需引入。

那么现在我们的项目环境以及配置完毕了，接下来我们开始正式编码，来创造一个简单的 TODO WebApp。
    