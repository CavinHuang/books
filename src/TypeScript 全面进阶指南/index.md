
---
title: TypeScript 全面进阶指南
---

## 简介
从类型编程到工程实践， 迈向 TypeScript 高级玩家

## 说明
## 你将获得

- 初出茅庐：掌握类型能力的核心 3 要素；
- 胸有成竹：建立 TypeScript 完整知识体系；
- 自成一派：彻底搞懂类型编程 4 大范式；
- 身经百战：提升工程与框架中的实践能力。

## 作者介绍

![作者简介(2100x389).jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12d1fca0b12a4be38bec6e638580beb5~tplv-k3u1fbpfcp-watermark.image?)

林不渡，阿里巴巴前端开发工程师。深耕 TypeScript，在团队中参与制定并推广 TypeScript 相关研发规约。热爱分享，曾在极客时间、前端早早聊等平台做过 TypeScript 主题分享，写过「TypeScript 的另一面：类型编程」专栏。同时也是一名开源爱好者，可以通过 [GitHub](https://github.com/linbudu599) 更多了解他。

## 小册介绍

![课程介绍(1624x623).jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68c96abe47d8445fa77faf657af66d40~tplv-k3u1fbpfcp-watermark.image?)

当下，TypeScript 正在逐渐成为与前端框架以及 ES6 语法同一地位的基础工具，**越来越多的开发者或团队已经将它作为首选语言之一**。TypeScript 带来的收益十分明显，在代码健壮性、可读性、开发效率与开发体验等多个方面，都能带来显著提升。因此，越来越多的前端开发者开始尝试使用以及学习 TypeScript。

但想要学好 TypeScript 并不是一件容易的事情。对 JavaScript 开发者来说，TypeScript 是一项全新的事物，有着一定的理解与上手成本。拿 TypeScript 的类型能力来说，它包括基础类型、内置类型、类型工具、类型编程、类型系统等数个概念，虽然这些概念分散开来并不复杂，但想要完全理解，达到融会贯通，需要大量的时间。

想要找到正确、高效地学习路径，我们可以从每个阶段使用 TypeScript 的目的出发。在项目开始阶段，类型能力可以**为 JavaScript 代码添加类型与类型检查来确保健壮性**。在项目优化阶段，**我们提前使用新语法或新特性来简化代码**。在编译阶段，我们可以利用 tsc 以及 tsc 配置（TSConfig），**最终获得可用的 JavaScript 代码**。

因此 **“类型-语法-工程”也是学习 TypeScript 的最佳路径**。小册也是这样设计的，你只需要跟着学下来，就能搭建出 TypeScript 的完整知识体系。

![1280X1280.PNG](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a9cf15f1a4c4dafbc195c03cb16d1d3~tplv-k3u1fbpfcp-watermark.image?)

- 在类型能力篇，我们会先从 TypeScript 的类型基础讲到泛型、条件类型等这些类型工具，再从内置工具类型讲解到内置工具类型进阶，带你建立起 TypeScript 类型能力知识体系，懂得结合使用各种类型工具进行类型编程，能够独立解决各种类型报错，理解类型世界的基本规则与运行规律。
- 在语法篇，我们会从 TypeScript 与 ECMAScript 的关系开始说起，介绍这些新语法的使用，对其中的重量级角色装饰器，我们更会搭配实战演练。
- 在最后的工程篇，除了 tsc 以及 TSConfig，我们还会有更多的工程实战，并与 React / ESLint 等框架或工具紧密结合，开发并部署一个基于 TypeScript 的 Node API。

就像这本小册的名字《 TypeScript 全面进阶指南 》一样，我们的目标是全方位、无死角地掌握 TypeScript。

## 你会学到什么？

- 掌握 TypeScript 类型能力的核心三要素：类型工具、类型系统与类型编程；
- 掌握 TypeScript 在实际工程中的实践经验，全链路的工具链集成以及 TSConfig 的配置解读；
- 基于类型系统核心概念与类型编程范式梳理，建立全面的 TypeScript 类型编程知识体系；
- 了解 TypeScript 中的 ECMAScript 语法，探索 TypeScript 的 Compiler API， 理解 TypeScript 的每一次版本更新都带来了什么新特性。

## 适宜人群

- 对 TypeScript 仅有简单了解与使用经验，想要开始学习 TypeScript；
- 已有一定 TypeScript 使用经验，想要更系统地学习 TypeScript 的类型编程知识；
- 想了解更多 TypeScript 的实战场景与各种工具链。

## 购买须知

1.  本小册为图文形式内容服务，共计 32 节；
2.  全部文章预计 8 月 17 日更新完成；
3.  购买用户可享有小册永久的阅读权限；
4.  购买用户可进入小册微信群，与作者互动；
5.  掘金小册为虚拟内容服务，一经购买成功概不退款；
6.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
7.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [开篇：用正确的方式学习 TypeScript](<./开篇-用正确的方式学习 TypeScript.md>)
- [工欲善其事：打造最舒适的 TypeScript 开发环境](<./工欲善其事-打造最舒适的 TypeScript 开发环境.md>)
- [进入类型的世界：理解原始类型与对象类型](./进入类型的世界-理解原始类型与对象类型.md)
- [掌握字面量类型与枚举，让你的类型再精确一些](./掌握字面量类型与枚举，让你的类型再精确一些.md)
- [函数与 Class 中的类型：详解函数重载与面向对象](<./函数与 Class 中的类型-详解函数重载与面向对象.md>)
- [探秘内置类型：any、unknown、never 与类型断言](<./探秘内置类型-any、unknown、never 与类型断言.md>)
- [类型编程好帮手：TypeScript 类型工具（上）](<./类型编程好帮手-TypeScript 类型工具（上）.md>)
- [类型编程好帮手：TypeScript 类型工具（下）](<./类型编程好帮手-TypeScript 类型工具（下）.md>)
- [类型编程基石：TypeScript 中无处不在的泛型](<./类型编程基石-TypeScript 中无处不在的泛型.md>)
- [结构化类型系统：类型兼容性判断的幕后](./结构化类型系统-类型兼容性判断的幕后.md)
- [类型系统层级：从 Top Type 到 Bottom Type](<./类型系统层级-从 Top Type 到 Bottom Type.md>)
- [类型里的逻辑运算：条件类型与 infer](<./类型里的逻辑运算-条件类型与 infer.md>)
- [内置工具类型基础：别再妖魔化工具类型了！](./内置工具类型基础-别再妖魔化工具类型了！.md)
- [反方向类型推导：用好上下文相关类型](./反方向类型推导-用好上下文相关类型.md)
- [函数类型：协变与逆变的比较](./函数类型-协变与逆变的比较.md)
- [了解类型编程与类型体操的意义，找到平衡点](./了解类型编程与类型体操的意义，找到平衡点.md)
- [内置工具类型进阶：类型编程进阶](./内置工具类型进阶-类型编程进阶.md)
- [基础类型新成员：模板字符串类型入门](./基础类型新成员-模板字符串类型入门.md)
- [类型编程新范式：模板字符串工具类型进阶](./类型编程新范式-模板字符串工具类型进阶.md)
- [工程层面的类型能力：类型声明、类型指令与命名空间](./工程层面的类型能力-类型声明、类型指令与命名空间.md)
- [在 React 中愉快地使用 TypeScript：内置类型与泛型坑位](<./在 React 中愉快地使用 TypeScript-内置类型与泛型坑位.md>)
- [让 ESLint 来约束你的 TypeScript 代码：配置与规则集介绍](<./让 ESLint 来约束你的 TypeScript 代码-配置与规则集介绍.md>)
- [全链路 TypeScript 工具库，找到适合你的工具](<./全链路 TypeScript 工具库，找到适合你的工具.md>)
- [说说 TypeScript 和 ECMAScript 之间那些事儿](<./说说 TypeScript 和 ECMAScript 之间那些事儿.md>)
- [装饰器与反射元数据：了解装饰器基本原理与应用](./装饰器与反射元数据-了解装饰器基本原理与应用.md)
- [控制反转与依赖注入：基于装饰器的依赖注入实现](./控制反转与依赖注入-基于装饰器的依赖注入实现.md)
- [TSConfig 全解（上）：构建相关配置](<./TSConfig 全解（上）-构建相关配置.md>)
- [TSConfig 全解（下）：检查相关、工程相关配置](<./TSConfig 全解（下）-检查相关、工程相关配置.md>)
- [基于 Prisma + NestJs 的 Node API ：前置知识储备](<./基于 Prisma + NestJs 的 Node API -前置知识储备.md>)
- [基于 Prisma + NestJs 的 Node API ：项目开发与基于 Heroku 部署](<./基于 Prisma + NestJs 的 Node API -项目开发与基于 Heroku 部署.md>)
- [TypeScript Compiler API 上手：打造 AST Checker 与 CodeMod](<./TypeScript Compiler API 上手-打造 AST Checker 与 CodeMod.md>)
- [总结：是结束，也是开始](./总结-是结束，也是开始.md)
- [漫谈：大厂一般是怎么考察候选人 TypeScript 技能水平的？](<./漫谈-大厂一般是怎么考察候选人 TypeScript 技能水平的？.md>)
- [漫谈：拥抱下一代 Node 框架—— DeepKit](<./漫谈-拥抱下一代 Node 框架—— DeepKit.md>)

    