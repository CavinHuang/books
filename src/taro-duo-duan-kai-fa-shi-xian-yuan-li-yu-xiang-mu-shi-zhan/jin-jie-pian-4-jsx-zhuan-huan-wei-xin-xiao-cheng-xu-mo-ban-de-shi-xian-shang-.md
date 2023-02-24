
# 进阶篇 4-JSX 转换微信小程序模板的实现（上）
---

# JSX 转换微信小程序模板的实现（上）

在[《Taro 设计思想及架构》](https://juejin.cn/book/6844733744830480397/section/6844733744926949384)中我们提到过 Taro 的设计思路：

> 在一个优秀且严格的规范限制下，从更高抽象的视角（语法树）来看，每个人写的代码都差不多。
> 
> 也就是说，对于微信小程序这样不开放不开源的端，我们可以先把 React 代码想象成一颗抽象语法树，根据这颗树生成小程序支持的模板代码，再做一个小程序运行时框架处理事件和生命周期与之兼容，然后把业务代码跑在运行时框架就完成了小程序端的适配。

这里其实我们是将 React 的 API 和 JSX 语法当成一种 DSL（Domain-specific language），只要将源代码编译成个各平台的对应语法就能达到跨平台的目的。而微信小程序和 React 的 API 和 JSX 语法差距巨大，Taro 是怎么编译的呢？这就要从代码是什么这个问题开始讲起。

## 代码的本质

不管是任意语言的代码，其实它们都有两个共同点：

1.  它们都是由字符串构成的文本
2.  它们都要遵循自己的语言规范

第一点很好理解，既然代码是字符串构成的，我们要修改/编译代码的最简单的方法就是使用字符串的各种正则表达式。例如我们要将 JSON 中一个键名 `foo` 改为 `bar`，只要写一个简单的正则表达式就能做到：

```
jsonStr.replace(/(?<=")foo(?="\s*:)/i, 'bar')
```

而这句代码就是我们的编译器——你看到这里可能觉得被骗了：“说好了讲一些编译原理高大上的东西呢？”但实际上这是理解编译器万里长征的第零步（也可能是最重要的一步）：**编译就是把一段字符串改成另外一段字符串**。很多同学觉得做编译一定是高大上的，但当我们把它拉下神坛，就可以发现它其实就是（艰难地）操作字符串而已。

我们再来看这个正则表达式，由于 JSON 规定了它的键名必须由双引号包裹且包裹键名的第二个双引号的下一个非空字符串一定是冒号，所以我们的正则一定能匹配到对应的键值。这就是我们之前提到的凡是语言一定有一个规范， JavaScript 作为 JSON 的超集也和 JSON 别无二致，也就是说不管是 JSON 还是 JavaScript 它们的代码都是结构化的，我们可以通过任意一个结构化的数据结构（Schema）把它们的对应语法描述出来。

对于我们的目标而言，我们打算用 JavaScript 去编译 JavaScript。其实要做的事情就是把一段 JavaScript 代码解析成一个让 JavaScript 易于操作的对象，然后我们操作这个对象用它来生成另外一段目标字符串，而那个易于操作的对象我们把它称之为抽象语法树（Abstract Syntax Tree，以下简称为 AST）。生成 AST 的解析器（parser）在一个完整编译器当中属于前端部分，这部分代码可以说是比较无聊、复杂又繁琐的部分，由于 ECMAScript 本身也在不断进化，新的规范在不断添加，parser 也变得越来越复杂。最新的 ECMAScript 规范（[ECMA-262](https://www.ecma-international.org/publications/standards/Ecma-262.htm)）已经是八百页的 PDF 文件，如果我们先把这八百页看完再从头去实现一个 parser 将会消耗掉大量的时间（可能就没有 Taro 也没有这篇文章了）。但好在社区已经有了非常好的 parser 可以供我们直接使用。

## Babel

JavaScript 社区其实有非常多 parser 实现，比如 Acorn、Esprima、Recast、Traceur、Cherow 等等。但我们还是选择使用 Babel，主要有以下几个原因：

1.  Babel 可以解析还没有进入 ECMAScript 规范的语法。例如装饰器这样的提案，虽然现在没有进入标准但是已经广泛使用有一段时间了；
2.  Babel 提供插件机制解析 TypeScript、Flow、JSX 这样的 JavaScript 超集，不必单独处理这些语言；
3.  Babel 拥有庞大的生态，有非常多的文档和样例代码可供参考；
4.  除去 parser 本身，Babel 还提供各种方便的工具库可以优化、生成、调试代码。

### Babylon（ `@babel/parser`）

Babylon 就是 Babel 的 parser。它可以把一段符合规范的 JavaScript 代码输出成一个符合 [Esprima](https://github.com/jquery/esprima) 规范的 AST。 大部分 parser 生成的 AST 数据结构都遵循 [Esprima](https://github.com/jquery/esprima) 规范，包括 ESLint 的 parser [ESTree](https://github.com/eslint/espree)。这就意味着我们熟悉了 [Esprima](https://github.com/jquery/esprima) 规范的 AST 数据结构还能去写 ESLint 插件。

我们可以尝试解析 `n * n` 这句简单的表达式：

```
import * as babylon from "babylon";

const code = `n * n`;

babylon.parse(code);
```

最终 Babylon 会解析成这样的数据结构：

![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/8/1665157669296bc1~tplv-t2oaga2asx-image.image)

你也可以使用 [ASTExploroer](https://astexplorer.net/) 快速地查看代码的 AST。

### Babel-traverse \(`@babel/traverse`\)

`babel-traverse` 可以遍历由 Babylon 生成的抽象语法树，并把抽象语法树的各个节点从拓扑数据结构转化成一颗路径（Path）树，Path 表示两个节点之间连接的响应式（Reactive）对象，它拥有添加、删除、替换节点等方法。当你调用这些修改树的方法之后，路径信息也会被更新。除此之外，Path 还提供了一些操作作用域（Scope） 和标识符绑定（Identifier Binding） 的方法可以去做处理一些更精细复杂的需求。可以说 `babel-traverse` 是使用 Babel 作为编译器最核心的模块。

让我们尝试一下把一段代码中的 `n * n` 变为 `x * x`：

```
import * as babylon from "@babel/parser";
import traverse from "babel-traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
```

### Babel-types（`@babel/types`）

`babel-types` 是一个用于 AST 节点的 Lodash 式工具库，它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理 AST 逻辑非常有用。例如我们之前在 `babel-traverse` 中改变标识符 `n` 的代码可以简写为：

```
import traverse from "babel-traverse";
import * as t from "babel-types";

traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});
```

可以发现使用 `babel-types` 能提高我们转换代码的可读性，在配合 TypeScript 这样的静态类型语言后，`babel-types` 的方法还能提供类型校验的功能，能有效地提高我们转换代码的健壮性和可靠性。

## 小结

在本章我们探索了代码究竟是什么：一段结构化的文本，本质是一种叫抽象语法树的复杂拓扑数据结构。也就是说只要我们在简单的情况把代码当做字符串处理，在复杂的情况把代码当做数据处理，这样几乎就可以把一段代码转译成任意的字符串（或数据结构）。我们还介绍了 Babel 一些重要的包以及它们的使用方法，我们了解到 Babel 是使用 JavaScript 处理 JavaScript 代码最成熟的技术方案。

现在，我们已经拥有了写一个转译器的理论基础和技术储备。下一章，我们将讨论 Taro 如何具体地将一段 React \(JSX\) 代码转译到小程序代码。

## 参考资料

### 1\. [《前端要以正确的姿势学习编译原理（上篇）》](https://zhuanlan.zhihu.com/p/36301857)

深入浅出地介绍了编译原理的基础知识，同时也给出大量的参考资料提供给后续的学习。

### 2\. [《对 Parser 的误解》](http://www.yinwang.org/blog-cn/2015/09/19/parser)

PL 届大神王垠的作品，他一针见血地指出了代码的本质，并对写 Parser 提供了一些建议。

### 3\. [Babel plugin handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md)

目前网上能找到最为详细的 Babel 教程，作者是 Babel 的维护者之一，同时也是 TC39 委员会的 Member。但也没有详细讲解 `babel-traverse` 中 `Path` 的核心方法。

### 4\. [《Parsing techniques》](https://dickgrune.com/Books/PTAPG_1st_Edition/BookBody.pdf)

相对于著名的龙书虎书鲸书来说，《Parsing techniques》专注在编译器的前端（也就是 Parser）部分。作者在行文的时候充分考虑了人文学科读者的阅读体验，将复杂繁复的技术讲得尽量易懂。
    