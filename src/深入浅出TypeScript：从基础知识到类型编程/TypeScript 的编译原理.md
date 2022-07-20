
# TypeScript 的编译原理
---

# TypeScript 的编译原理

我们的学习从本节开始进入了新的阶段，之前我们的所有内容只停留在 TypeScript 的使用阶段，而真正的 TypeScript 高手是可以定制 TypeScript 的，笔者也不是这方面的高手，只花两节的内容能粗略介绍下，只当做抛砖引玉。

我们都知道 Babel，他是 JavaScript 的转化工具，比如可以把 ES6+ 的代码转化成 ES5 的代码，我们开发者可以通过 Babel 暴露的接口来编写插件，通过插件我们可以自己定制JavaScript。

而 TypeScript 在 2.3 版本也暴露了相关的接口给开发者，允许开发者控制部分 JavaScript 的代码生产，因此，同样我们也可以通过编写 TypeScript Transformer Plugin 的方式控制最终生成的 js 代码。

在正式编写 TypeScript Transformer Plugin 之前，我们必须了解一些前置知识，那就是TypeScript的一些简单的编译原理知识。

## 编译器的组成

TypeScript有自己的编译器,这个编译器主要有以下部分组成:

- Scanner 扫描器
- Parser 解析器
- Binder 绑定器
- Emitter 发射器
- Checker 检查器

## 编译器的处理

扫描器通过扫描源代码生成token流:

```
SourceCode（源码）+ 扫描器 --> Token 流
```

解析器将token流解析为抽象语法树\(AST\):

```
Token 流 + 解析器 --> AST（抽象语法树）
```

绑定器将AST中的声明节点与相同实体的其他声明相连形成符号\(Symbols\),符号是语义系统的主要构造块:

```
AST + 绑定器 --> Symbols（符号）
```

检查器通过符号和AST来验证源代码语义:

```
AST + 符号 + 检查器 --> 类型验证
```

最后我们通过发射器生成JavaScript代码:

```
AST + 检查器 + 发射器 --> JavaScript 代码
```

## 编译器处理流程

TypeScript 的编译流程也可以粗略得分为三步:

- 解析
- 转换
- 生成

结合上部分的编译器各个组成部分,流程如下图:

![编译器处理流程](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1514537bc3b~tplv-t2oaga2asx-image.image)

我们主要控制的要编写的 transformer Plugin 作用于 Emitter 阶段.

## 抽象语法树

我们先了解一下抽象语法树是怎么来的,举个简单的例子,比如我们写一段变量声明的代码`var a = ...`,它要经历这样几个步骤:

- 字符流转化为被定义过的tokenliu
- 线性token流被转化为抽象语法树

![AST转换](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb15145b54b09~tplv-t2oaga2asx-image.image)

AST是一棵树,这棵树的节点代表了语法信息,这棵树的边代表了节点之间的组成关系。

一个例子:

```
const a = 3 + 4;
console.log(a);
```

它的AST以`ES Tree`规范来以JSON形式输出:

```
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "kind": "const",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "type": "BinaryExpression",
            "operator": "+",
            "left": {
              "type": "Literal",
              "value": 3,
            },
            "right": {
              "type": "Literal",
              "value": 4,
            }
          }
        }
      ]
    },
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "computed": false,
          "object": {
            "type": "Identifier",
            "name": "console"
          },
          "property": {
            "type": "Identifier",
            "name": "log"
          }
        },
        "arguments": [
          {
            "type": "Identifier",
            "name": "a"
          }
        ]
      }
    }
  ]
}
```

从解析源代码到生成AST之间的步骤是typescript控制的,我们无法干涉,我们能做的是访问AST的节点并修改其携带的信息和节点与节点之间的关系,最终生成新的AST,再根据新AST生成代码,这样我们就达到了控制代码转换的目的。

## 修改节点

接着上面的例子,我们想要修改节点就必须对节点进行访问,这就涉及到了**访问者模式**,这种模式使我们可以遍历一棵树，而不必实现or知道树中的所有信息。

例如,下面的代码将所有需要改变相关的每个标识符`a`为`b`：

```
tree.visit({
  Identifier(node) {
    if (node.name === 'a') {
      node.name = 'b';
    }
  },
})
```

在TypeScript的具体使用模板是这样的:

```
import * as ts from ‘typescript’
export default function(/*opts?: Opts*/) {
  function visitor(ctx: ts.TransformationContext, sf: ts.SourceFile) {
    const visitor: ts.Visitor = (node: ts.Node): ts.VisitResult => {
      // here we can check each node and potentially return 
      // new nodes if we want to leave the node as is, and 
      // continue searching through child nodes:
      return ts.visitEachChild(node, visitor, ctx)
    }
    return visitor
  }
  return (ctx: ts.TransformationContext): ts.Transformer => {
    return (sf: ts.SourceFile) => ts.visitNode(sf, visitor(ctx, sf))
  }
}
```

给TypeScript Transformer指定AST，然后通常一个转换将使用 `visitor` 来遍历 AST,访问者可以检查AST中的每个节点并在这些节点上执行操作,例如代码验证、分析然后确定是否以及如何修改代码。

## 小结

我们在本节很简略地讲解了 TypeScript 的编译过程,其实我们的目的不是搞清楚每一个细节,而是对大概的流程有一个粗略的认知,这有助于我们接下来的实战。
    