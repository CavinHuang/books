
---
title: Babel 插件通关秘籍
---

## 简介
深入探究 babel 编译原理，学完可以写任何 babel 插件。我们会进行大量的实战，最后还会手写一个简易的 babel。

## 说明
## 作者介绍

某一线大厂某架构组前端工程师，公众号\[神光的编程秘籍\]，维护公司的 builder 和 ide，对编译原理、前端工程化有一定的研究。

## 小册介绍

[实战案例源码](https://github.com/QuarkGluonPlasma/babel-plugin-exercize)

babel 已经是前端领域的必备工具了，它可以让我们使用一些新的语法和 api，babel 会在编译的过程中转为目标环境的支持的语法并引入 polyfill。除此以外，babel 也提供了强大的插件机制，我们可以通过它暴露出的 api 来开发各种代码转换插件。

babel 是一种源码到源码的转换编译器，学习 babel 的原理的过程也会学到编译原理的一些知识。

除了作为转译工具外，babel 也经常用来做静态分析，分析代码，提取信息，然后用于生成文档、lint、type check 等，我们会用大量的实战案例，让你真正能够把 babel 的静态分析能力用起来。

实战部分包括：

**自动国际化**：自动完成代码的国际化，帮大家扩展下思路，你会发现 babel 原来还可以用来做一些对业务有意义的自动化的事情。

**自动生成文档**：自动生成 api 文档，不再需要手动去维护。

**自动埋点**：自动进行函数插桩，埋点是一种常见的函数插桩。

**linter**： 探索 eslint、stylelint 等 lint 工具的实现原理，能够手写各种检查插件。

**type checker**：实现简单的 ts 类型检查，会对 typescript 的类型检查的原理会有更深的理解。

**压缩混淆**：前端必用工具之一，探索它的实现原理，压缩怎么做，混淆怎么做，怎么用 babel 实现，开阔下思路。

**js 解释器**： AST 除了转译、静态分析外，还可以直接解释执行，学完这个案例可以知道解释器是怎么解释代码的。

**模块遍历器**：基于 babel 做模块的遍历，理解打包工具的依赖图构建原理。

**手写 babel**： 手写 babel 是为了加深对 babel 的理解，真正掌握 babel。

小册分为 babel 插件基础、babel 插件进阶、babel 插件实战、手写简易的 babel 四部分内容：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a886e787d6f46afb2a9a1b42b19cb1d~tplv-k3u1fbpfcp-watermark.image)

## 你会学到什么？

- babel 的编译流程、AST、api
- babel 插件和 preset 的方方面面
- js parser 的历史
- babel macros
- babel 内置功能的实现思路
- 实现一个 lint 工具
- 实现一个 ts type checker
- 自动埋点
- 自动国际化
- 自动生成文档
- 压缩混淆的原理
- 打包工具的模块依赖图是怎么生成的
- 手写一个简易的 babel

## 适宜人群

- 熟悉 js 语法，用过 babel
- 想深入了解 babel 原理的前端开发者
- 想入门编译原理的工程师

## 购买须知

1.  本小册为图文形式内容服务，共计 33 节；
2.  全部文章已更新完成；
3.  购买用户可享有小册永久的阅读权限；
4.  购买用户可进入小册微信群，与作者互动；
5.  掘金小册为虚拟内容服务，一经购买成功概不退款；
6.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
7.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [Babel 的介绍](<./Babel 的介绍.md>)
- [Babel 的编译流程](<./Babel 的编译流程.md>)
- [Babel 的 AST](<./Babel 的 AST.md>)
- [Babel 的 API](<./Babel 的 API.md>)
- [实战案例：插入函数调用参数](./实战案例-插入函数调用参数.md)
- [JS Parser 的历史](<./JS Parser 的历史.md>)
- [traverse 的 path、scope、visitor](<./traverse 的 path、scope、visitor.md>)
- [Generator 和 SourceMap 的奥秘](<./Generator 和 SourceMap 的奥秘.md>)
- [Code- Frame 和代码高亮原理](<./Code- Frame 和代码高亮原理.md>)
- [Babel 插件和 preset](<./Babel 插件和 preset.md>)
- [Babel 插件的单元测试](<./Babel 插件的单元测试.md>)
- [Babel 的内置功能（上）](<./Babel 的内置功能（上）.md>)
- [Babel 的内置功能（下）](<./Babel 的内置功能（下）.md>)
- [Babel 配置的原理](<./Babel 配置的原理.md>)
- [工具介绍：VSCode Debugger 的使用](<./工具介绍-VSCode Debugger 的使用.md>)
- [实战案例：自动埋点](./实战案例-自动埋点.md)
- [实战案例: 自动国际化](<./实战案例- 自动国际化.md>)
- [实战案例:自动生成 API 文档](<./实战案例-自动生成 API 文档.md>)
- [实战案例: Linter](<./实战案例- Linter.md>)
- [实战案例: 类型检查](<./实战案例- 类型检查.md>)
- [实战案例: 压缩混淆](<./实战案例- 压缩混淆.md>)
- [实战案例: JS 解释器](<./实战案例- JS 解释器.md>)
- [实战案例: 模块遍历器](<./实战案例- 模块遍历器.md>)
- [Babel Macros](<./Babel Macros.md>)
- [手写 Babel：思路篇](<./手写 Babel-思路篇.md>)
- [手写 Babel： parser 篇](<./手写 Babel- parser 篇.md>)
- [手写 Babel： traverse 篇](<./手写 Babel- traverse 篇.md>)
- [手写 Babel： traverse -- path篇](<./手写 Babel- traverse -- path篇.md>)
- [手写 Babel： traverse -- scope篇](<./手写 Babel- traverse -- scope篇.md>)
- [手写 Babel： generator篇](<./手写 Babel- generator篇.md>)
- [手写 Babel： core篇](<./手写 Babel- core篇.md>)
- [手写 Babel： cli篇](<./手写 Babel- cli篇.md>)
- [手写 Babel： 总结](<./手写 Babel- 总结.md>)
- [小册总结](./小册总结.md)

    