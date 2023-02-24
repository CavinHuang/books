
# 脚手架-提升团队开发利器
---

在上一讲中，我们从 0 到 1 使用 webpack 为构建工具创建了一个现代化前端项目。从一步一步繁琐的配置当中，相信你已经体会到了创建一个现代化前端项目并不像我大学时候老师教的那样：可以用记事本直接“手撕”代码。

现代化的前端项目已经不再是在 HTML 的头部写一点 CSS 样式，在底部写几段脚本就可以了。首先，现代化的前端项目一般都会选用 React、Vue 等为代表的前端框架来提高效率，同时会使用 sass\\less 等扩充 CSS 语言。除此之外，还需要搭建本地开发环境、在开发环境中进行热更新、构建并部署项目到服务器……

如果以上种种需要从 0 到 1 进行搭建的话，对于一个刚入门的前端新手而言还是有一定难度的。那么，对于刚入门的“新手”而言，怎么**快速**创建项目？或者对于一个“老手”而言，如何创建**团队风格一致**的项目呢？答案就是今天的主角——**脚手架**。

为了让你更好地了解前端脚手架相关知识，今天我会带你先剖析下为什么要使用脚手架，然后再给你介绍前端几个有代表性的脚手架工具，最后，还会手把手带你从头创建一个自己的脚手架工具。相信学完这些内容之后，你就可以**解开脚手架的神秘面纱并且收获一个属于自己的脚手架工具**了！

## 为什么要使用脚手架

在讲为什么要使用脚手架之前，我们先简单介绍下什么是脚手架。相信你在平时的生活中，路过工地时可能看到过下图这样的架子：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7e528a248e74606bca50d94c0f3b7ae~tplv-k3u1fbpfcp-zoom-1.image)

在建筑工程中，脚手架指的是：**为了保证各施工过程顺利进行而搭建的工作平台**。

那么在编程中，类比一下建筑工程，脚手架就是能够帮你将项目的框架代码生成好，然后开发同学只需要在脚手架上“添砖加瓦”就可以了。通过脚手架工具生成的代码通常包含了项目开发流程中所需的工作目录内的通用基础设施。

回到前端领域，在前端开发中，一个项目的基础建设需要投入大量的时间和精力，并且还需要至少两套的环境配置：线上环境和开发环境。这些最佳实践都是需要日积月累的试错得出，对于开发者的工程水平有一定的要求。脚手架就是可以搭建好项目的基础架构，然后开发者就可以将精力集中在业务代码的开发中了，这样可以极大程度地提高前期的开发效率。也就是说，**前端脚手架要做的事情就是搭建基础架构代码**。

经过上一讲的介绍，我们已经了解了在写业务需求代码之前需要怎么创建项目。那么，如果使用脚手架呢？

比如，我们选用 Vue Cli 来创建项目，那么只需要在安装完 Vue Cli 之后，执行 `vue create hello-world`就可以创建一个配置完善的 Vue 项目，同时还可以选择是否需要 TS、数据管理、路由管理等配置。

创建完之后，我们执行 `npm run dev` 就可以完成本地服务的搭建，将代码运行在本地服务器上，还有实时更新的功能，是不是很棒呢 ？\(๑•̀ㅂ•́\)و✧。

**除了可以快速创建代码之外，使用相同脚手架创建出来的项目，拥有着相同的文件结构、代码风格、依赖模块、开发工具，这对于同一个团队而言，减少了团队成员之间的沟通和维护成本。**

说了这么多，我们来总结一下到底为什么要使用前端脚手架。

- **方便快捷**：我们只需要下载对应的脚手架依赖然后在命令行执行一行命令或者一些初始化信息，就可以将项目的框架搭建完成，整个用时十分钟左右，而自己搭建少则一两个小时，多则一两天。

- **最佳实践**：不管我们使用的是官方提供的脚手架还是团队内部的脚手架，其中的配置或者模板肯定都是经过反复的试错之后提炼出来的最佳实践，我们使用脚手架相当于站在了巨人的肩膀上进行开发。

- **统一规范**：团队的内部使用相同的脚手架创建出来的项目，具有相同的组织结构、依赖模块、工具配置，有利于项目的维护和团队的合作。

## 有代表性的前端脚手架工具

在刚入门的前端教程中，比如 “60 分钟快速入门 Vue”“React 入门看这篇就够了” 这类的文章中，都会直接使用 Vue Cli 或者 Create-React-App 来创建项目。那么其中的 Vue Cli、Create-React-App 就是脚手架工具。

Vue Cli 和 Create-React-App 是市面上最常见的成熟脚手架工具之一，它们二者都是为了特定的框架而诞生的脚手架（这点从名字也可以看得出来）。两者的使用姿势大同小异，都可以在终端交互式地询问用户需要创建的内容后，创建项目的基础结构并生成配置文件。

除了上述的两种只针对于特定框架的脚手架之外，还有一类就是以 Yeoman 为代表的通用性项目脚手架工具。根据一套模板，生成一个对应的项目结构，灵活且易扩展。

以上三种脚手架都是直接创建整个项目的脚手架，其实除了可以创建整个项目之外，脚手架还可以生产某一个文件或者某一段代码，这类的代表工具是 Plop。比如，你想在一个组件化或者模块化的项目中创建有固定文件结构或代码结构的新组件或者模块，就可以使用 Plop 更为便捷地进行创建。

那下面我们就来简单介绍这四种比较有代表性的前端脚手架—— Plop、Yeoman、Create-React-App 和 Vue-Cli，你可以对比着来学习。

### 1\. Plop

**Plop 是一款小而美的脚手架工具**，官网对其的定义为：micro-generator framework。Plop 可以使用已有的模板文件批量生成代码，省去了手动复制粘贴的过程。你可以在你代码的任何地方创建 routes、helpers、controllers、components……

这里我找来了一个官网的示例图：我们可以自由选择 generator 生成一个项目（如图的 helper），也可以生成某一段代码。如图所示，执行 `plop segment` 后，输入 `test-name-of-something` 和 `/index` 后自动帮你在 `/routes/index`路径下创建了 `index.html` 、`index.state.js` 和 `index.styl` 三个文件，生成的内容来源于 generator 中定义的内容。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96137af1c2574bb59810d0193a541cc2~tplv-k3u1fbpfcp-zoom-1.image)

### 2\. Yeoman

**Yeoman 是一款老牌、通用的脚手架工具**，与其说它是一个脚手架，不如说是一个脚手架的运行平台。其支持各种语言，比如 Web、Java、Python、C# 等。

作为早期的脚手架工具，Yeoman 不依赖于某个框架或者语言，你可以选择公开的生成器（generator）或者根据自身的需求编写不同的生成器，用不同的生成器去生成不同的项目或者代码片段。比如，你可以执行 `yo generator-webapp` 生成网站项目、`yo generator-venv` 生成 vue 项目（yo 是 Yeoman 的命令行管理工具）……

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fe15b2d358742899495d3928ad90fdb~tplv-k3u1fbpfcp-zoom-1.image)

Yeoman 和 Plop 类似，代表的是一般开源框架的理念。不指定具体的语言和技术栈，更加底层并且更加灵活，其目的是让开发者可以快速生成生成器（generator），并快速生成项目或代码片段。同时，Yeoman 也是一个生成器平台，你可以直接使用 Yeoman 提供的三方生成器。

### 3\. Create-React-App

和前面介绍的 Plop、Yeoman 不指定特定框架的脚手架生成器相比，Create-React-App（简称 CRA）和 Vue Cli 恰恰相反。

**CRA 是一款 React 官方提供的 React 开发工具集**，其中包含了 `create-react-app` 和 `react-script` 两个基础包。`create-react-app` 用于选择脚手架创建项目，而 `react-script` 是封装了项目启动、编译、测试等基础工具的运行时依赖包。

正是因为 CRA 将运行时的各项配置都封装在 `react-script` 中了，这大大降低了开发者的学习成本，你不需要选择使用哪个构建工具，不需要选择对应依赖包的版本，不需要去编写并测试那些繁琐的配置文件（特别是 webpack！），开箱即用！自己从 0 到 1 自己搭建过项目的同学都知道，要想成功地将项目启动，少则需要个把小时，多则需要一两天的时间 o\(╥﹏╥\)o，搭建项目两小时，开发十分钟。而使用 CRA，我们只需要执行 `npx create-react-app your-app-name` 就可以直接生成一个 React 项目。打开项目后，再执行 `npm run start` 就可以开发业务代码了！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3de11b15b8104f74806990a3a1bcb574~tplv-k3u1fbpfcp-zoom-1.image)

不过凡事都有利弊，CRA 将所有的细节都封装了起来，虽然降低了创建项目时的成本，但是却增加了后期的维护成本。比如你想要去修改 webpack 的某一项配置，是不能在项目中直接修改的。这个时候就要使用官方提供的 eject 选项将全部配置反编译回项目。但是一旦你这么做了，那么就意味着你放弃了官方提供的各个依赖包的维护。为此，官方又提供了修复包 `react-rewired` 和 `customize-cra` ，可以进行自定义配置 。

CRA 代表的是某一特定框架的理念，是官方提供的为了降低开发复杂度的最佳实践。将创建项目和项目运行时的依赖封装在一起供用户使用，开发者只需要按照其设定的流程就可以使用该框架完成开发和部署工作。

### 4\. Vue Cli

和 CRA 类似，Vue Cli 是一款 Vue 开发工具集。由 Vue.js 官方维护，**定位是 Vue.js 快速开发的完整系统**。

完整的 Vue Cli 由三部分组成：全局命令的 `@vue/cli`、运行时依赖 `@vue/cli-service`和功能插件 `@vue/cli-plugin-*`，并且还有一套完整的图形化创建和用户管理界面，可谓是良心售后了。

Vue Cli 吸取了 CRA 的教训，**在保留了创建项目开箱即用的优点的同时，也提供了覆盖原有配置的能力**。同时，在创建项目的时候`@vue/cli` 通过交互式的方式让用户自己选择需要哪些定制化功能，比如是否集成路由、是否需要 `TypeScript`、是否使用 `Babel`……

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b6abde759f34430914ceb78858f85b6~tplv-k3u1fbpfcp-zoom-1.image)

Vue Cli 代表的是更灵活的折中理念，也是官方提供的关于特定框架的最佳实践。但是，其只是在创建项目的时候根据你的需求集成不同的工具，并不在运行时有过多的干预，这样你就可以直接修改其中的内容，定制化能力增强。

## 如何自己开发一个脚手架

虽然官方提供的默认脚手架模板已经代表了对应技术栈的通用最佳实践，但是在实际开发中，我们还是时常有定制化的需求，比如：

- 为项目引入新的通用特性；
- 针对构建环节的 webpack 配置优化，来提升开发环境的效率和生产环境的性能；
- 定制团队内部规范的代码检测规则配置；
- 定制单元测试等辅助工具代码的配置项；
- 定制目录结构与通用业务模板，例如业务组件库、辅助工具类、页面模板等。

为了满足这些定制化的需求，我们还需要知道怎么自己去开发一款脚手架。那么，我们就来简单地做一个单文件类型的脚手架 Demo。我一直认为“**脚手架的灵魂从来不在于脚手架的搭建方式，更不在于自动化，而是在于脚手架的模板**”，所以这个 Demo 只是带你了解一下怎么去搭建一个脚手架，讲一下搭建的流程，其中最重要的模板内容还是需要你根据自己团队的规范和需求自己去创建。（在接下来的几篇文章中，我会详细讲解如何配置 webpack、babel 等等。）

下面我们就来创建一个单文件类型的脚手架，来体验一下脚手架究竟是怎么生成的吧\~\~

### 1\. 准备脚手架中的模板文件

**脚手架中的模板文件代表着该脚手架的灵活程度、边界范围等，是一个脚手架的灵魂所在。**

所以首先，我们要准备一个脚手架中的模板文件，因为这里只是给大家做一个例子，所以就给出一个最简单的 HTML 的模板。我们的目的是复制一份该模板并替换其中的 `title` 参数（这里我们使用了模板语言 [ejs](https://ejs.bootcss.com/)，感兴趣可以自行了解下，简单来说就是使用 `<%= %>` 标签表示输出数据到模板。）

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <meta name="referrer" content="no-referrer" />
    <title><%= title %></title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but cherry-blog doesn't work properly without JavaScript enabled. Please enable it to continue.
      </strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

有了模板之后，我们需要再有一个脚本文件，这个脚本的内容是在运行之后根据模板内容创建得到一个 HTML 文件，并且模板中的 title 参数会被我们传入的数据替换。

### 2\. 编写脚手架创建脚本

明确了脚本要实现的功能之后，我们就要来进一步实现该脚本。

这个脚本很简单，我们只需要将用户的输入通过模板解析工具和我们的模板相结合，然后再通过 IO 写操作重新生成一个文件即可。我们来看一些详细的步骤。

#### 2.1 获取用户输入

第一步，我们需要先获取用户的输入，可以使用三方依赖包 `inquirer` 来获取。

我们可以使用 `prompt` 方法来创建一个交互式命令行，将我们需要获取的参数封装为 JS 对象放入一个数组作为 `prompt` 的参数，用户的输入就会以回调的形式传给我们（其中的 answers 参数），例如：

```
const inquirer = require('inquirer');    // 用于与命令行交互
inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'file name?'
  },
  {
    type: 'input',
    name: 'title',
    message: 'document title?'
  }
]).then(answers => {})
```

#### 2.2 创建新文件

在拿到了用户的输入之后，我们就可以创建一个新文件，新文件的文件名是用户交互输入的、文件内容是模板的内容。这里我们就会用到 node 的 fs（file system 文件系统） 模块来进行 IO 读取的操作。

```
const inquirer = require('inquirer');    // 用于与命令行交互
const fs = require('fs');                // 用于处理文件
const path = require('path');            // 用于处理路径

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'file name?'
  },
  {
    type: 'input',
    name: 'title',
    message: 'document title?'
  }
]).then(answers => {
    const fileName = answers.name;
    const tempPath = path.join(__dirname, 'template.html');      // 获取模板文件的路径
    const filePath = path.join(__dirname, fileName + '.html');   // 创建新文件的路径
    const read = fs.createReadStream(tempPath);                  // 读取模板文件中的内容
    const write = fs.createWriteStream(filePath);                // 创建新文件
})
```

#### 2.3 替换模板中的参数

在目标文件创建好之后，我们接下来就可以进行最后一步，替换创建出来新文件中的参数了。这里我们使用到了解析 ejs 模板的工具和 node 的 stream 模块。

`read.pipe(transformStream).pipe(write)` 我们创建一个 pipe 管道流，先解析并替换模板文件中的内容，然后在替换后的内容传入刚刚我们创建的新文件。其中 `transformStream` 是具体的读取并替换模板文件的过程。

```
const inquirer = require('inquirer');    // 用于与命令行交互
const fs = require('fs');                // 用于处理文件
const path = require('path');            // 用于处理路径
const ejs = require('ejs');              // 用于解析 ejs 模板
const { Transform } = require('stream'); // 用于流式传输

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'file name?'
  },
  {
    type: 'input',
    name: 'title',
    message: 'document title?'
  }
 ]).then(answers => {
    const fileName = answers.name;
    const title = answers.title;
    const tempPath = path.join(__dirname, 'template.html');      // 获取模板文件的路径
    const filePath = path.join(__dirname, fileName + '.html');   // 创建新文件的路径
    const read = fs.createReadStream(tempPath);                  // 读取模板文件中的内容
    const write = fs.createWriteStream(filePath);                // 创建新文件
    const transformStream = new Transform({
      transform: (chunk, encoding, callback) => {
      const input = chunk.toString();               // 模板内容
      const output = ejs.render(input, { title });  // 解析模板
      callback(null, output);
    }
  })
   read.pipe(transformStream).pipe(write)
})
```

### 3\. 执行脚本

至此，整个能够创建一个 HTML 的脚手架的脚本就已经写完了。我们执行该脚本文件：

```
node cli.js
? file Name? new_html 
? document title? new_html_title
```

执行完之后，其结果图如下所示，可以看到，在我们的目录中新增了一个命名为 `new_html.html` 的文件。其中的内容就是刚刚我们所创建的模板中的内容，并且也可以看到其中的 `title` 标签的值被设置为了我们刚刚输入的内容 `new_html_title`。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ebf6fd55fd44f5682f2e1103c5ee5ec~tplv-k3u1fbpfcp-zoom-1.image)

经过上面的实践，一个单文件类型的脚手架工具就完成了，相信对于聪明的你而言一定不是难事 ٩\(๑>◡\<๑\)۶。

我们来回顾下上面的代码，可以发现其中大部分都是一些 IO 操作，如果你只是一个脚手架的使用者，那么这些 IO 操作并不是你要关心的重点，你可以使用 Yeoman 或者 Plop 来避免这些繁杂的 IO 操作，可以将重心放在你的脚手架模板上。

## 总结

在这一讲中，我们先阐述了使用脚手架的必要性，然后介绍了四款有代表性的前端脚手架工具，最后还带你一起手写了一个可以创建单文件类型的脚手架。

经过这一讲的学习，相信你会对脚手架的特性、能力和原理有了一定的了解，相信你在初期创建项目的时候也一定知道该选取哪一款脚手架工具来生成项目的基础代码，同时，如果你想自定义一个脚手架，想必也知道该怎么去实现了。 \(●ﾟωﾟ●\)

正如整篇文章一直提到的一个观点：脚手架的灵魂不在于脚手架的搭建方式，也不在于自动化，重点在于脚手架所使用的模板！那么在接下来的文章中，我们会再着重介绍下脚手架模板中比较重要的 webpack 和 babel 等其他配置项的内容。

同样，在学习过程中，如果你有什么不理解地方，或者有好的经验要分享，欢迎你留言，我们一起交流和进步哈。
    