
# 下一代 JS 编译器-Babel
---

在上一章节中，我们介绍了几种前端 polyfill 的方案，其中一种就提到了 Babel。相信在读的各位，都使用过 Babel（没用过的赶紧去回炉重造\(_ﾟДﾟ_\) 。

我们在新创建一个项目的时候，都知道需要用 Babel 对代码进行转义。我们在刚使用的 Babel 的时候，往往都是打开谷歌浏览器，输入：“Babel 安装教程”。会搜索到要安装一大堆 npm 包，配置 transform-runtime、babel-polyfill... 按照第一篇文章配置之后，发现不生效，又换一篇文章，接着更改配置。终于，在快则 2 个小时，慢则一天的尝试之后，终于能够成功转译了！此时，虽然你也不知道是改动的哪一行代码生效了，也不知道为什么要这么配置，但是知道要赶紧按下保存按钮，生怕修改了配置又出问题了！祈祷下次可以直接将本次的配置拿来使用！！至于为什么要这样配置？下次一定... 下次一定...

无疑，Babel 是前端基建中重要的一环。提起 Babel，你可能会想起来一大串的名词：babel-core、babel-cli、babel-runtime，那么他们分别都有什么作用？babel 是怎么设计的？最重要的，怎么设置 babel 的配置文件？本篇文章就带大家一起了解这个让人又爱又恨的 babel。

# Babel 是什么

首先我们先来了解下 Babel 是什么，“Babel” 英文单词的含义是巴比伦文明里面的通天塔的意思。

> 当时地上的人们都说同一种语言，当人们离开东方之后，他们来到了示拿之地。在那里，人们想方设法烧砖好让他们能够造出一座城和一座高耸入云的塔来传播自己的名声，以免他们分散到世界各地。上帝来到人间后看到了这座城和这座塔，说一群只说一种语言的人以后便没有他们做不成的事了；于是上帝将他们的语言打乱，这样他们就不能听懂对方说什么了，还把他们分散到了世界各地，这座城市也停止了修建。这座城市就被称为“巴别城”。--《创世记》

Babel 的前身是 6to5 这个库，从字面意思就可以看出，它的主要功能是将 ES6 转成 ES5。最初的时候，转换 AST 的引擎是 frok acorn 的。在 2015 年的时候，将 6to5 这个库改名为 Babel，解析引擎改名为 Babylon。再后来，Babylon 移入到了 \@babel/parser。Babylon 读出来是巴比伦的意思，指的是巴比伦文明。

我们再来看下 Babel 的官网是如何介绍 Babel 的："Babel is a JavaScript compiler"，翻译过来为： Babel 是一个 JavaScript 的编译器。

随着前端语言特性和宿主环境的高速发展以及前端框架“自定义 DSL” 的崛起。前端各式各样的开发代码就要编译为宿主环境能够运行的 JavaScript 代码。Babel 的主要功能有：

- 语法转换：高级语言特性的降级
- polyfill：上一篇文章我们介绍过的打补丁
- 源码转换：我们可以将 jsx、vue 代码转换为浏览器可识别的 JS 代码。

Babel 的实现基于主要编译原理，深入 AST 来生成目标代码，同时，babel 也需要工程化的协作，比如要和 webpack 相互配合。

在 [babel 的 monorepo 仓库](https://github.com/babel/babel/tree/main/packages) 中，一共有 140+ 个包：，真是个庞大的家族呀  \(⊙ˍ⊙\)。我整理了个 xmind 将其比较重要的包名列举了出来。大家可以先简单看下（先混个脸熟），在下面的内容中详细给大家介绍。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abe081d25fca46aa9ffe82d3af40cd10~tplv-k3u1fbpfcp-zoom-1.image)

# Babel 设计思想

我们平时在使用 Babel 的时候，我们想要处理哪些功能就按照某个插件，Babel 的架构模式就是这种“**插件架构模式**” 。插件架构模式的特点就是将扩展功能从核心模块中抽出为插件。既降低了框架的复杂度也提升了架构的灵活程度。核心模块也就是 core 和 插件 plugin 以某种轻松的方式耦合，两者在功能不变的情况下，可以独立发布，互补影响。并且可以公开插件的接口，让开发者也有机会对功能进行扩展。plugin 依赖 core 并且各 plugin 之间互相独立也可以互相通信。

## ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7200a30926a6454292c0f55c898148ff~tplv-k3u1fbpfcp-zoom-1.image)

`@babel/core` 从名字就可以看出来这是 `Babel` 的核心库，库如其名，`@babel/core` 是 Babel 实现转换的核心，核心的 API 都在这个库中，比如 `transform`、`parse`、`generator`等。该库可以根据配置，对源码进行转换。

```
const babel = require("@babel/core");

babel.transform(code, options, (err, result) => {
	result; // => { code, map, ast }
})
```

# Babel 转译过程

`Babel` 的转译过程主要可以分为三个步骤，解析（parse）、转换（transform）、生成（generate），那么我们分别来看下这三个步骤都做了什么.

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23ba1b474efb40adb84d904f14583e3b~tplv-k3u1fbpfcp-zoom-1.image)

## 解析（parse）

首先，Babel 做的第一步就是将源代码解析为 AST（`Abstract Syntax Tree`）也就是我们常说的抽象语法树。在《你不知道的 JavaScript（上卷）》中，第一章作用域是什么中就介绍了解析和 AST。

在生成 AST 的过程前，会先经过分词（Tokenizing）阶段，分词会将由字符组成的字符串分解成有意义的代码块，这些代码块被称为词法单元（Token）。然后将分好的词法单元组转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树被称为“抽象语法树”也就是 `AST`。

### \@babel/parser

在解析过程用到的工具包就是 \@babel/parse。\@babel/parse 是 JS 语言解析的解析器，其作用是接收源码，然后进行词法分析、语法分析，最终生成AST。其使用姿势如下：

```
// babelParser.parse(code, [options])

require("@babel/parser").parse("code", {
  sourceType: "module",
  plugins: [
    "jsx",
    "flow"
  ]
});
```

## 转换（transform）

在将源码转换为 `AST` 之后，我们需要对 `AST` 进行一系列的操作，使得 `Babel` 获取到转换后的 `AST` 并使用 `babel-traverse` 对其进行遍历。再进行添加、移除、更新等操作。我们使用的 Babel 插件就是作用于这一步的。

### \@babel/traverse

在转换阶段用到的工具就是 `@babel/traverse`，使用姿势如下：

```
const parser = require('@babel/parser')
const t = require('@babel/types')
const traverse = require('@babel/traverse').default

let code = 'function a() {}'
const ast = parser.parse(code)
traverse(ast, {
  FunctionDeclaration(path) {
    const node = path.node
    path.replaceWith()//替换为新的节点
    path.remove() // 删除当前节点
    path.skip() //跳过子节点
    let copyNode = t.cloneNode(node)//复制当前节点
    traverse(copyNode, {}, {}, path)// 对子树进行遍历和替换，不影响当前的path
  }
})
```

## 生成（generate）

在我们对 `AST` 进行了相应的转换操作之后，将转换后的 AST 再转换为可执行代码的过程被称为代码生成 （generate）。同时此过程也可以创建 `source map`。

### \@babel/generator

在 `generate` 阶段使用到的工具就是 `@babel/generator`。其使用方式如下:

```
const output = generate(
  ast,
  {
    /* options */
  },
  code
);
```

一个完整的解析流程如下：

```
const babel =  require("@babel/core");
const generate = require('@babel/generator').default;

const code = `function square(n) {
    return n * n;
}`;

const ast = babel.parse(code);

babel.traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  }
});

const output = generate(ast, { /* options */ }, code);

console.log('output', output.code)
```

# Babel 插件

上面我们提到过插件就是将扩展功能从核心模块中抽出的功能组件，在 Babel 中，插件大致上可以分为两类：

- 语法插件\(Syntax Plugins\)：其作用是解析特定类型的语法。它们能够帮助构造抽象语法树（AST）。典型的语法插件有：[syntax-async-functions](http://babeljs.io/docs/plugins/syntax-async-functions/) 以及 [syntax-jsx](http://babeljs.io/docs/plugins/syntax-jsx/)。
- 转换插件：其作用为修改抽象语法树。典型的转换插件有：[transform-async-to-generator](http://babeljs.io/docs/plugins/transform-async-to-generator/)、[transform-react-jsx](http://babeljs.io/docs/plugins/transform-react-jsx/)、[transform-es2015-arrow-functions](http://babeljs.io/docs/plugins/transform-es2015-arrow-functions/) 等。也就是在上面转义原理的第二步 transform 过程中我们所提到的。

# presets 预设

presets：预设，是一个预先确定的插件集。为了避免一个一个的添加插件，我们就可以使用 preset，方便用户对插件的使用和管理。

Babel 官方为我们提供了一些常见的 preset

- [\@babel/preset-env](https://www.dazhuanlan.com/babel)：包含所有标准的最新特性，转换那些已经被正式纳入 TC39 中的语法；
- [\@babel/preset-flow](https://www.dazhuanlan.com/babel)：为 Flow 提供的预设，包含所有 flow 相关的插件；
- [\@babel/preset-react](https://www.dazhuanlan.com/babel)：为 React 提供的预设，包含所有 React 相关的插件；
- [\@babel/preset-typescript](https://www.dazhuanlan.com/babel)：为 TS 提供的预设，包含所有 TS 相关的插件；

## \@babel/preset-env

在平时的开发中，我们经常使用的 [\@babel/preset-env](https://www.dazhuanlan.com/babel) 这个预设。下面我们就来简单介绍下该预设。该预设的前身是 `babel-preset-latest`，这个预设会随着 ECMA 规范的更新增加自身的内容。那么这样的问题就是，随着时间的推移，该预设的内容会越来越多，编译的速度也会越来越慢。并且随着时间的推移，冗余的插件也会越来越多。所以，目前 Babel 官方不再推出 `babel-preset-es2017` 以后的预设了。[\@babel/preset-env](https://www.dazhuanlan.com/babel) 可以根据开发者的配置按需加载需要的插件。

如果使用默认配置，那么就会和 `babel-preset-latest` 预设相同，会加载从 `ES2015` 开始的所有 `preset`。如果我们想让我们的代码在指定的平台和版本上运行，我们就可以使用 `target` 参数，例如，我们需要在最近 3个浏览器版本和 安卓4.4 版本以及 iOS 9.0 以上版本运行我们的代码，那么我们可以这样配置：

```
presets: [
   [
     '@babel/preset-env',
     {
       targets: {
         "browsers": [
           "last 3 versions",
           "Android >= 4.4",
           "iOS >= 9.0"
         ],
       }
     },
   ],
 ]
```

# 总结

在本篇文章中，我们带大家一起了解了什么是 Babel，然后简单讲述了 Babel 的设计思想以及转译过程，Babel 的转译过程主要分为三步：解析 => 转换 => 生成。然后又给大家介绍了 Babel 插件和常见的 Babel 预设。Babel 是一个强大且伟大的工具，能够让前端开发者使用最新的语言特性进行开发。在下一篇文章中，将会给大家介绍 `babel-polyfill`。
    