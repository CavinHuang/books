
# 团队协作规范（二）-项目结构、workflow、git commit
---

在上一篇文章中，我们给大家介绍了团队规范的优点，然后给大家推荐了几种命名规范方式。然后，着重给大家介绍了 UI 设计规范。首先介绍了 UI 设计规范的优点，其不仅可以培养用户心智、减少用户学习成本、让人机交互更加自然，还可以提高开发效率和项目的可维护性。然后从基础设计元素和组件两个方面介绍了 UI 设计规范的范围，最后具体说明了如何将规范进行落地，最后以 Button 组件为例，示范了怎么将 UI 设计规范应用在具体的开发中。

本篇文章我们就继续聊下其余的前端团队规范，主要包括项目结构规范、团队 workflow、和 git commit 规范。

## 项目结构规范

项目结构规范包括文件命名、文件目录组织方式。一个项目的文件结构就像是一本书的目录，是其他开发者了解项目最快的方法。代码的组织方式，也是项目架构设计的体现，比如如何划分视图层、控制层等。如果你是项目的创建者，那么你需要好好设计项目的文件结构和代码的组织方式，框架搭好了，再加砖添瓦就容易了。如果你是项目的维护者，那么你需要遵守项目的文件结构规范，风格统一了后续才好维护，同时也避免了公共函数\\组件重复开发的问题。

对于文件目录组织方式，通常我们会在根目录下，按照职能进行划分出多个目录。以 Vue 举例，一般的 Vue 项目一级目录内容如下：

- 存放公共资源的 `public`目录（该文件内容不会被 webpack 处理\)；
- 用来存放源代码资源的`src`目录；
- 用于存放测试用例的 `tests`目录；
- 还有自动安装的依赖 `node_modules`。

除了这些一级目录之外，还会有一些配置文件，比如 TS 的配置文件`tsconfig.json` 、babel 的配置文件 `babel.config.js`等，还有一些项目文档，比如说明文档 `README.md`。一个常见的 vue 项目的一级目录结构如下：

```
.
├── node_modules
├── public
├── src
├── tests
├── README.md
├── package-lock.json
├── package.json
├── babel.config.js
└── tsconfig.json
```

`src` 又可以细分为用于接口请求的`api` 目录、存放静态资源的目录 `assets`、存放公共组件的目录 `components`、存放样式文件的目录 `styles`、项目的路由统一存放在`router` 中、页面统一存储的变量`store`、一个公共工具`utils`、项目的视图集合`views`。

```
├─api （接口）
├─assets （静态资源）
├─components （公共组件）
├─styles （样式）
├─router （路由）
├─store （vuex）
├─utils （工具函数）
└─views （页面）
```

项目结构看似很简单，但确是在项目创建初期要仔细思考的问题。项目结构混乱，就如同一本书的目录混乱，目录混乱那么你项目的“读者”能快速争取的理解项目的内容吗？建立统一的目录结构和规范的命名方式有助于其他人快速找到需要的资源。

## 工作流程 workflow

编写代码，是软件开发交付过程的起点，发布上线，是开发工作完成的终点。代码分支模式贯穿了开发、集成和发布的整个过程，是工程师们最亲切的小伙伴。那如何根据自身的业务特点和团队规模来选择适合的分支模式呢？又如何进行多人代码管理呢？

说到分支管理和代码协作，首先想到的就是 Git，Git 是我们用到版本控制工具。主流的版本控制工具有两款：Git 和 svn。svn 的理念是集中式，必须要把代码提交到中心控制器。而 Git 的理念是分布式，每一个开发者在本地都有一个 Git 仓库。因为现在大部分公司或者个人使用 Git，所以在这里我们主要介绍 Git 相关的工作流程。

Git workflow 是有关如何使用 Git 以高效协作开发的规则或策略建议，下文这些常见工作流程只是作为指导参考，这些工作流不是一成不变的，我们应该根据自己的项目选择或制定合适自己的工作流。

我们先来了解下在 workflow 中常见的发布模式和分支模式。

### 发布模式

我们常见的发布模式有两种：

- 一种是有明确版本规划、需要有多个版本支持的“**版本发布**”模式，常用于终端类产品，比如我们常见的手机上的 APP 就是其中一种。
- 另一种是一个功能分支开发完毕没有问题后就立即可以发布上线的“**持续发布**”模式，常用于网页产品，因为其迭代快、无需审核，只需要关注最新版本即可。

### 分支模式

一般情况下，在开发的过程中，我们会使用到以下几种不同类型的分支：

- master：主干分支，一个项目应该有且只有一个主干分支，并且为 protected 分支。作为最稳定的分支，通常情况是线上环境运行的分支。不能在 master 分支上直接开发，只能被其他分支合入。
- develop：开发分支，在不同的 workflow 中有不同的用途。
- feature：功能分支，针对每个功能创建一个 feature 分支进行独立开发。
- hotfix：bug 修复分支，针对已合并的功能分支有需要修复的 bug ，就创建一个 hotfix 分支。
- release：预发分支，在正式发版之前，需要一个预发布版本进行回归测试。

### 主流 workflow

在了解了常见的发布模式和分支模式之后，我们再看下传统的主流的 workflow。传统的主流 workflow 有三种：

- git flow
- github flow
- gitlab flow

我们分别来简单介绍下。

#### git flow

`git flow` 是诞生最早的一种 workflow。`git flow` 工作流下会长期存在两个稳定分支，`develop` 和 `master`。master 分支是生产环境运行的分支。而 develop 分支是待上线分支，包含了待上线的功能。大多数情况下，develop 分支的代码会领先 master 分支。

在新迭代开始的时候，会先从 develop 分支中拉取出 feature 或者 hotfix 分支用来平时的开发和 bug 的修复工作，开发完成后，会先将 feature 或 hotfix 合入 develop。然后根据发布计划，将 develop 分支合并到 master 分支进行版本发布的操作。具体工作流程如下图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7303491a0184d1c8d247e491e78c147~tplv-k3u1fbpfcp-zoom-1.image)

`git flow` 模式主要适用于“版本发布”模式。“版本发布”的特点是收集多个功能，并且通常只有在特定的时间才会进行新版本的发布。

#### github flow

github flow 是 [github](https://github.com/) 使用的工作流。github flow 只有 master 一个稳定分支。在新迭代开始的时候，从 master 创建一个 feature 或者 hotfix 分支进行开发或者 bug 修复。开发完毕后，需要向 master 发起一个 pull request，在 pull request 中可以对代码进行 code review，一旦 pull request 被合并（merge），那么该分支就会自动合并到 master 分支中。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08cb8f71f4714764b41515610dbcd11d~tplv-k3u1fbpfcp-zoom-1.image)

比起 git flow 适用于的“版本发布”模式，github flow 更适用于“持续发布”模式。

github flow 更适用于库、框架、工具这些非最终应用的产品，因为该 workflow 只有 master 一个稳定分支，所有的改动也都只合并（merge）到 master 中，所以这就对贡献者的代码质量要求较高。因为一些库、框架、工具通常都不需要调用数据库，可以在本地进行开发、调试和测试，所以开发完毕后只需要将开发分支合并到 master 分支就可以了。

#### gitlab flow

gitlab 是前面两者的结合，是 gitlab 使用的工作流，更适用于直接面向用户的产品，即可以支持“版本发布”也可以支持“持续发布”。

gitlab flow 也是只有一个主分支 master，并且还有一个原则就是“上游优先”，即只能在上游分支采纳的代码才能同步到其他分支，master 为最上游分支。

对于需要“持续发布”的项目，可以创建不同的环境分支，比如有开发环境（master）、预发环境（release）、生产环境（production）。那么开发环境就是预发环境的上游，预发环境就是生产环境的上游。代码合并遵循“上游优先”的原则，必须按照 开发环境 => 预发环境 => 生产环境 这样的顺序进行代码合并。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a01f664218743cfbf527a0b495c5c53~tplv-k3u1fbpfcp-zoom-1.image)

对于需要“版本发布”的项目，首先要有一个主分支 master 分支作为集成分支，每一个需要发布的版本从 master 新创建分支作为发布分支。发布分支只允许合入 bugfix 分支。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f464dc842da94bd6a3df3d17be741f2a~tplv-k3u1fbpfcp-zoom-1.image)

综合上面三种 workflow，团队内部可以根据团队的情况进行自由选择和组合，灵活选择。

## git commit 规范

在我们使用 Git 提交代码的时候，会要求写一个 commit 信息，简述本次提交的代码的目的。试想一下，现在线上出问题了，需要排查问题，你打开 gtihub\\gitlab，想要找到提交代码的记录，进行回滚操作。但是你发现 commit 的内容都是“。”、“提交”、“修改” 这样的信息，时间紧迫，你需要用最快的时间恢复故障，面对这样的 commit 信息你会不会直接口吐芬芳呢？就算是你自己写的代码你也不能第一时间就知道问题出现在哪个提交记录里面，于是只好一次提交记录一次提交记录的点开看里面的改动内容。点开看完了之后回到列表，咦？我刚刚看的是哪一个呀？ﾍ\(;´Д｀ﾍ\) 如果随便提交 commit 信息，会直接提升我们修复 bug、查找问题的难度，写好 commit message 还是很有必要的。

### commit message 作用

那么 commit message 有哪些作用呢？commit message 可以提供更多的历史信息，方便快速浏览，便于快速查找信息，高效合作。良好的 git commit 规范，可以让人只看描述就清楚这次提交的目的，可以提高解决 bug、查找问题的效率。所以作为开发者，我们有责任写好每一次的 commit message。

在一个团队中，团队中的每一个成员都共同维护一个或者多个产品，如果团队之间遵守同一套 commit message 规范，可以过滤某些 commit（比如文档改动），还可以使用一些脚本文件自动生成变更历史 CHANGELOG，这就会提高项目\\产品的专业性，让其他开发者或者能够看到完整的产品功能迭代历史和发展线。所以，团队之间需要遵守同一套 commit message 规范。

### commit message 的格式

说了那么多统一 commit message 的好处，那么如何来写 commit message 呢？

目前使用最多的是 [Angular 规范](https://link.juejin.cn/?target=https%3A%2F%2Fdocs.google.com%2Fdocument%2Fd%2F1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y%2Fedit%23heading%3Dh.greljkmo14y0)，那么我们就来大致介绍下。一个 commit message 中包括 Header、Body、Footer 三个部分，并且一次可以提交多行信息。格式如下：

```
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

其中，第一行`<type>(<scope>): <subject>` 为 Header 部分，是必填字段，用于概括说明本次改动的内容，包括改动的类别\(type\)、影响范围\(scope\)、和简短的描述。后面两行分别为 Body 和 Footer，都是是选填字段，可以写一些对本次改动的详细描述和一些其他功能（比如关闭 Issue）。

#### Header

刚刚也说到了，在 Header 中又包括三个字段：type、scope、subject。

##### type

type 是用于说明 commit 的类别，只允许使用下面 7 个标识。

- feat：本次改动为新增功能；
- fix：本次改动为修补 bug；
- docs：本次改动为新增或修改文档（documentation）信息；
- style：本地改动为修改样式文件；
- refactor：本次改动为代码重构；
- test：本次改动为新增或修改测试用例；
- chore：构建过程或辅助工具的变动；

##### scope

scope 用于说明 commit 影响的范围，比如数据层、控制层、视图层或者会影响到那个功能或者改动的文件名称，视项目不同而不同。

##### subject

subject 是 commit 目的的简短描述，不超过50个字符。以动词开头，使用第一人称现在时，比如 change，而不是 changed 或 changes。第一个字母小写、结尾不加句号。

### body

Body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例。

```
产品新增功能：xxx
PRD 链接：xxx

主要改动点如下：
1. 新增 xxx
2. 修改 xxx
3. 删除 xxx
```

### Footer

Footer 部分只用于两种情况

 -    不兼容变动：如果当前代码与上一个版本不兼容，则 Footer 部分以 BREAKING CHANGE 开头，后面是对变动的描述、以及变动理由和迁移方法。
 -    关闭 Issue：如果当前 commit 针对某个 issue，那么可以在 Footer 部分关闭这个 issue

```
Closes #123, #456, #789
```

## 自动化

如果想更近一步，还可以用自动化的手段，方便生成、效验你的 commit message，也可以针对符合格式的 commit messag 使用脚本自动生成变更记录 CHANGELOG 文件。

Commitizen：这款插件可以根据交互式询问的方式更加友好的帮你生成 commit message

validate-commit-msg：这款插件可以在提交 commit 的时候检查你的 commit message 是否符合规范，不符合的不允许提交。

conventional-changelog：这款插件可以通过脚本自动根据你的 commit message 信息生成 CHANGELOG.md 文件。

## 其他规范

- 前后端接口规范
- 文档规范
- 代码分支规范

## 总结

我们分两篇文章从命名、UI、项目结构、项目结构、workflow、git commit 等多个方面总结了前端再开发过程中所遇到的团队规范。我认为团队规范最大的用处在于**统一认知，减少认知误差**。毕竟人和人都是有个体差异的，大家对于事务的理解程度和看法是不一样的。而团队规范就是统一认知，使得大家都按照同一套规范去实施，在开发的过程中就可以**减少沟通成本**，并且落地的一些规范可以**抽象出标准化的产出**，**提高可复用性**。这样开发出来的项目也**便于维护**，杂乱无章的代码会让后期维护的同学无迹可寻，摸不着头脑（甚至我觉得都不撑不到别人接手代码，如果开发者自己没有一套开发规范，自己写的代码可能半个月后再看自己就看不懂了 \(╯>д\<\)╯。

要强调的一点是，规范这个东西的目的为了我们更高效的进行开发，而不是为了制约我们！（当然，规范的统一肯定会造成部分同学的不适）。每个团队的规范应该根据团队的成员人员构成、技术水平、合作方式等各方面情况综合指定。
    