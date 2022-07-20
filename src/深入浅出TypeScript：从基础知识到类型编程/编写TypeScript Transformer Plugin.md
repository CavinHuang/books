
# 编写TypeScript Transformer Plugin
---

# 编写TypeScript Transformer Plugin

我们已经了解了,TypeScript的转化原理与Babel其实是近似的:

1.  先把源代码解析为token流,然后生成AST
2.  通过访问者模式访问AST节点并修改生成新的AST
3.  通过新的AST生成js代码

## AST遍历

我们现在就简单地进行一个小的操作,先看下面的代码:

```
// index.ts

const a = 1
const b = 2

function add(x: number, y: number): number {
    return x + y
}
```

我们先做一个简单的工作,就是遍历`index.ts`文件中的各个AST节点.

我们新建一个文件`transformer.ts`,在这里我们将进行对AST的一系列操作.

```
// transformer.ts

import ts from "typescript";

// 引入目标文件
const filePath = "./index.ts";

// 创建一个 program 实例
const program = ts.createProgram([filePath], {});

// 为我们的 program 做一个类型检查器
const checker = program.getTypeChecker();

// 获取 index.ts 源代码的AST
const source = program.getSourceFile(filePath);

// 创建 printer实例为我们打印最后的ast
const printer = ts.createPrinter();

// 我们提供给定类型的节点字符串的小助手
const syntaxToKind = (kind: ts.Node["kind"]) => {
  return ts.SyntaxKind[kind];
};
// 从根节点开始遍历并打印
ts.forEachChild(source!, node => {
  console.log(syntaxToKind(node.kind));
});

```

结果如下:

![结果](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1537911d335~tplv-t2oaga2asx-image.image)

我们看到通过遍历我们获得了AST上的节点,首先是两个变量声明\(VariableStatement\):

```
const a = 1
const b = 2
```

接着是一个函数声明\(FunctionDeclaration\):

```
function add(x: number, y: number): number {
    return x + y
}
```

最后的`EndOfFileToken`相当于结束标志.

## 选择转换方式

我们刚才直接利用了TypeScript提供的API进行了AST的遍历操作,但是如果涉及到转换操作,依然用TypeScript的API进行裸操作会很麻烦,有没有更方便的方法\?

目前TS转换有以下三种主流的方式:

- 适用于Webpack生态系统的[ts-loader](https://github.com/TypeStrong/ts-loader)
- 使用[ttypescript](https://github.com/cevek/ttypescript)代替tsc
- 编写自己的编译器包装器

其中应用最广泛、生态最完善的当属`ts-loader`\+ `webpack`.

其实还有一个重要原因就是我们目前的前端开发主要借助的就是webpack打包器,选择这种方式更加贴近实际开发.

它的使用方式很简单,给 ts-loader 配置 `getCustomTransformers`的选项:

```
{
  test: /\.tsx?$/,
  loader: 'ts-loader',
  options: {
    ... // other loader's options
    getCustomTransformers: () => ({ before: [yourImportedTransformer] })
  }
}
```

> 详见[ts-loader](https://github.com/TypeStrong/ts-loader)

## 编写 transformer Plugin

### 目标

我们要实现如下转换：

```
// before
import { Button } from 'antd'
// after
import Button from 'antd/lib/button'
```

### 了解需要改什么

Custom Transformer 操作是 AST，所以我们需要了解代码转换前后的 AST 区别在哪里.

转换前：

```
import { Button } from 'antd'
```

代码的 AST 如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb153794c07ff~tplv-t2oaga2asx-image.image)

转换后:

```
import Button from 'antd/lib/button'
```

代码的 AST 如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb15379ccae52~tplv-t2oaga2asx-image.image)

可以看出，我们需要做的转换有两处：

- 替换 ImportClause 的子节点，但保留其中的 Identifier
- 替换 StringLiteral 为原来的值加上上面的 Identifier

那么，该如何找到并替换对应的节点呢？

### 如何遍历并替换节点

TS 提供了两个方法遍历 AST：

- ts.forEachChild
- ts.visitEachChild

两个方法的区别是:

`forEachChild` 只能遍历 AST，`visitEachChild` 在遍历的同时，提供给此方法的 `visitor` 回调的返回节点，会被用来替换当前遍历的节点，因此我们可以利用 `visitEachChild` 来遍历并替换节点.

先看一下这个方法的签名：

```
/**
 * Visits each child of a Node using the supplied visitor, possibly returning a new Node of the same kind in its place.
 *
 * @param node The Node whose children will be visited.
 * @param visitor The callback used to visit each child.
 * @param context A lexical environment context for the visitor.
 */
function visitEachChild<T extends Node>(node: T, visitor: Visitor, context: TransformationContext): T
```

假设我们已经拿到了 AST 的根节点 SourceFile 和 `TransformationContext`，我们就可以用以下代码遍历 AST：

```
ts.visitEachChild(SourceFile, visitor, ctx)
function visitor(node) {
  if(node.getChildCount()) {
    return ts.visitEachChild(node, visitor, ctx)
  }
  return node
}
```

注意：visitor 的返回节点会被用来替换 visitor 正在访问的节点.

### 如何创建节点

TS 中 AST 节点的工厂函数全都以 create 开头，在编辑器里敲下：ts.create，代码补全列表里就能看到很多很多和节点创建有关的方法：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb15379d493ca~tplv-t2oaga2asx-image.image)

比如，创建一个 1+2 的节点:

```
ts.createAdd(ts.createNumericLiteral('1'), ts.createNumericLiteral('2'))
```

### 如何判断节点类型

前面说过，ts.SyntaxKind里存储了所有的节点类型。同时，每个节点中都有一个 kind 字段标明它的类型。我们可以用以下代码判断节点类型:

```
if(node.kind === ts.SyntaxKind.ImportDeclaration) {
  // Get it!
}
```

也可以用 ts-is-kind 模块简化判断：

```
import * as kind from 'ts-is-kind'
if(kind.isImportDeclaration(node)) {
  // Get it!
}
```

那么，我们之前的 visitor 就可以继续补充下去：

```
import * as kind from 'ts-is-kind'
function visitor(node) {
  if(kind.isImportDeclaration(node)) {
    const updatedNode = updateImportNode(node, ctx)
    return updateNode
  }
  return node
}
```

因为 Import 语句不能嵌套在其他语句下面，所以 ImportDeclaration 只会出现在 SourceFile 的下一级子节点上，因此上面的代码并没有对 node 做深层递归遍历。

只要 updateImportNode 函数完成了之前图中表现出的 AST 转换，我们的工作就完成了。

### 如何更新 ImportDeclaration 节点

下面关注 updateImportNode 怎么实现.

我们已经拿到了 ImportDeclaration 节点，还记得到底要干什么吗？

- 用 Identifier 替换 NamedImports 的子节点
- 修改 StringLiteral 的值

为了方便找到需要的节点，我们对 ImportDeclaration 做递归遍历，只对 NamedImports 和 StringLiteral 做特殊处理：

```
function updateImportNode(node: ts.Node, ctx: ts.TransformationContext) {
  const visitor: ts.Visitor = node => {
    if (kind.isNamedImports(node)) {
      // ...
    }
    if (kind.isStringLiteral(node)) {
      // ...
    }
    if (node.getChildCount()) {
      return ts.visitEachChild(node, visitor, ctx)
    }
    return node
  }
}
```

首先处理 `NamedImports`:在 AST explorer 的帮助下，可以发现 `NamedImports` 包含了三部分，两个大括号和一个叫 `Button` 的 `Identifier`，我们在 `isNamedImports` 的判断下，直接返回这个 `Identifier`，就可以取代原先的 `NamedImports`：

```
if (kind.isNamedImports(node)) {
   const identifierName = node.getChildAt(1).getText()
  // 返回的节点会被用于取代原节点
  return ts.createIdentifier(identifierName)
}
```

再处理 `StringLiteral`:

发现要返回新的 `StringLiteral`，要用到 isNamedImports 判断里提取出来的 `identifierName`.

因此我们先把 identifierName 提取到外层定义，作为 updateImportNode 的内部状态.

同时，`antd/lib` 目录下的文件名没有大写字母，因此要把 identifierName 中首字母大写去掉：

```
if (kind.isStringLiteral(node)) {
  const libName = node.getText().replace(/[\"\']/g, '')
  if (identifierName) {
    const fileName = camel2Dash(identifierName)
    return ts.createLiteral(`${libName}/lib/${fileName}`)
  }
}
// from: https://github.com/ant-design/babel-plugin-import
function camel2Dash(_str: string) {
  const str = _str[0].toLowerCase() + _str.substr(1)
  return str.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`)
}
```

完整的 updateImportNode 实现如下：

```
function updateImportNode(node: ts.Node, ctx: ts.TransformationContext) {
  const visitor: ts.Visitor = node => {
  if (kind.isNamedImports(node)) {
    const identifierName = node.getChildAt(1).getText()
      return ts.createIdentifier(identifierName)
  }
    if (kind.isStringLiteral(node)) {
    const libName = node.getText().replace(/[\"\']/g, '')
    if (identifierName) {
      const fileName = camel2Dash(identifierName)
      return ts.createLiteral(`${libName}/lib/${fileName}`)
    }
  }
    if (node.getChildCount()) {
      return ts.visitEachChild(node, visitor, ctx)
    }
    return node
  }
}
```

以上，我们就成功实现了如下代码转换：

```
// before
import { Button } from 'antd'
// after
import Button from 'antd/lib/button'
```

以上代码整合起来，就是一个完整的 Transformer Plugin，完整代码请见：[newraina/learning-ts-transfomer-plugin](https://github.com/newraina/learning-ts-transfomer-plugin/blob/master/src/transformer.ts)

### 改进

刚才实现的只是一个最最精简的版本，距离 babel-plugin-import 的完整功能还有很远，比如：

- 同时 Import 多个组件怎么办，如`import { Button, Alert } from 'antd'`
- Import 时用 as 重命名了怎么办，如`import { Button as Btn } from 'antd'`
- 如果 CSS 也要按需引入怎么办
- …

以上都可以在 AST explorer 的帮助下找到 AST 转换前后的区别，然后按照本文介绍的流程实现。

## 小结

本文我们主要介绍了TypeScript Transformer Plugin的编写方法,我们可以从一个简单的TypeScript Transformer Plugin入手学习,就比如[ts-import-plugin](https://github.com/Brooooooklyn/ts-import-plugin)。

本文的后半部分来源于[写一个TypeScript Transformer Plugin](https://zhuanlan.zhihu.com/p/30360931),原因在于我想写一个TS版的 `babel-plugin-import` 作为案例,然后发现已经有文章写过了而且写得不错。
    