
---
title: 深入浅出TypeScript：从基础知识到类型编程
---

## 简介
Vue3 源码及开发必备基础，从基础知识到类型工具设计，从理论到实战，手把手让你从零基础成为进阶使用者。

## 说明
## 小册介绍

如今越来越多的大型项目和团队选择了 TypeScript 作为主力开发语言，GitHub 发布 2018 编程语言 TOP10 中，TypeScript 在开源贡献者使用最多的语言中排名跃居第七。

![2019-10-21-16-12-53](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded6c96b8f36a2~tplv-t2oaga2asx-image.image)

而仅仅在一年之前，TypeScript 还未能进入前十，可见其近些年的发展势头之猛。

而最新开源的 Vue3 Pre-Alpha 版代码就是采用 TypeScript 重写而成。

![2019-10-08-22-14-01](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded1959edc84b8~tplv-t2oaga2asx-image.image)

除此之外，在前端开发群体中最受欢迎的编辑器之一 VS Code 就是基于 TypeScript 开发，三大框架之一的 Angular、著名后端框架 NestJS、机器学习框架 tfjs 都是基于 TypeScript 开发。

我们可以想象 Vue3.0 正式发布之后整个大型项目的生态会继续向 TypeScript 倾斜，可以说学习 TypeScript 已经是不可逆的趋势，但是与此同时我们发现在学习 TypeScript 过程中会踩到很多坑。

笔者当初学习 TypeScript 时就饱受折磨：

- 官方文档破碎：官方文档的知识点是破碎的，没有形成一个呼应的逻辑，也没有循序渐进地引导开发者，单单是罗列了一大堆知识点
- 学习资料过少：当初 TypeScript 还没有如今火热，学习资料很少，很多常见的关键字或者特性，官方文档没有体现，只能不断搜索或者去 issue、pr 中找寻蛛丝马迹
- 实践困难：虽然跟着官方文档敲几个简单的示例代码觉得难度不大，但是跟真实业务、流行框架结合会有很多困难，这些都是需要我们在实践中踩坑踩出来的

由于以上的种种问题，促成了本册子的诞生，笔者用44节超过5万字循序渐进地把 TypeScript 学习入门到进阶做了一个梳理，并结合实战、甚至拿出一节解析了一个有一定难度的面试题，在本册子里笔者力求把当初学习遇到的困难点都写出来，帮助大家少走弯路，更快地成为一个合格的 TypeScript 开发者。

在我心中 TypeScript 的开发者是分四个层级的:

1.  业务使用者: 这个层级的开发者可以在业务代码中熟练利用 TypeScript 编码，但是无法进行类型编程，也无法写出一些底层库，仅仅停留在使用阶段
2.  类型编程者: 这个层级的开发者可以对类型进行编程，可以开发出一些实用的工具类型，对于难以定义的类型也能驾轻就熟，在语言的使用层面不会再碰到太多棘手的问题了
3.  TS 定制者: 这个层级的开发者对 TypeScript 的类型系统比较熟悉，对 TypeScript 的语言设计也有一定的认知，可以开发 `TypeScript Transformer Plugin` 来定制化开发 TypeScript
4.  TS 设计者: 这个层面的开发者可以参与到 TypeScript 这门语言的设计中去,基本上能达到 PL 领域的从业人员的水准

本册子力力求能让读者读完后能达到第二个层级以上的水平，再往后的话我跟大家共勉...

我将小册相关的知识点制作成了脑图如下:

![2019-10-21-14-54-30](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded193de7017e5~tplv-t2oaga2asx-image.image)

## 作者介绍

寻找海蓝，前端工程师，《前端面试与进阶指南》开源书\(2k star\)作者，微信公众号「程序员面试官」作者。

TypeScript重度使用者，用TypeScript构建过多个中大型项目，有丰富的一线实战经验。

## 你会学到什么？

- 充分理解 TypeScript 各个基础类型，无痛使用 TypeScript 结合框架进行编码
- 充分理解 TypeScript 中的各种高级类型，可以进行类型编程，设计高级的工具类型例如: `Partial<T>`、`Merge<T, U>`、`Omit<T, U>` 等等
- 了解 TypeScript 的部分编译知识，可以为 TypeScript 开发转换插件，定制 TS 语法
- 读懂一些热门库的代码，甚至有机会成为贡献者，比如最近用TS重写的 Vue3.0
- 应对绝大部分关于 TypeScript 的面试题，我们会对一道很考验水平的 LeetCode 中国面试题进行解读

## 适宜人群

- 有 JavaScript 基础
- 了解 ES2015 语法

## 购买须知

1.  本小册为图文形式内容服务，共计 44 节；
2.  全部文章预计 10 月 28 日更新完成；
3.  购买用户可享有小册永久的阅读权限；
4.  购买用户可进入小册微信群，与作者互动；
5.  掘金小册为虚拟内容服务，一经购买成功概不退款；
6.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
7.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [小册食用指南](./小册食用指南.md)
- [到底为什么要学习 TypeScript？](<./到底为什么要学习 TypeScript？.md>)
- [开始使用 TypeScript](<./开始使用 TypeScript.md>)
- [Typescript 的原始类型](<./Typescript 的原始类型.md>)
- [Typescript 中其他常见类型](<./Typescript 中其他常见类型.md>)
- [深入理解枚举类型](./深入理解枚举类型.md)
- [接口\(interface\)](<./接口(interface).md>)
- [类\(Class\)](<./类(Class).md>)
- [函数\(Function\)](<./函数(Function).md>)
- [泛型（generic）的妙用](./泛型（generic）的妙用.md)
- [类型断言与类型守卫](./类型断言与类型守卫.md)
- [类型兼容性](./类型兼容性.md)
- [高级类型之交叉类型、联合类型、类型别名](./高级类型之交叉类型、联合类型、类型别名.md)
- [可辨识联合类型](./可辨识联合类型.md)
- [装饰器](./装饰器.md)
- [高级装饰器](./高级装饰器.md)
- [Reflect Metadata](<./Reflect Metadata.md>)
- [赋值断言、is 关键字、可调用类型注解和类型推导](<./赋值断言、is 关键字、可调用类型注解和类型推导.md>)
- [TypeScript 与 React 实战\(组件篇上\)](<./TypeScript 与 React 实战(组件篇上).md>)
- [TypeScript 与 React 实战\(组件篇下\)](<./TypeScript 与 React 实战(组件篇下).md>)
- [TypeScript与React实战\(Redux篇\)](<./TypeScript与React实战(Redux篇).md>)
- [高级类型之索引类型、映射类型](./高级类型之索引类型、映射类型.md)
- [高级类型之条件类型](./高级类型之条件类型.md)
- [高级类型之强大的infer关键字](./高级类型之强大的infer关键字.md)
- [常用工具类型解读](./常用工具类型解读.md)
- [TypeScript几个实用技巧](./TypeScript几个实用技巧.md)
- [解一道 LeetCode 中国招聘面试题](<./解一道 LeetCode 中国招聘面试题.md>)
- [TypeScript 的编译原理](<./TypeScript 的编译原理.md>)
- [编写TypeScript Transformer Plugin](<./编写TypeScript Transformer Plugin.md>)
- [模块与命名空间](./模块与命名空间.md)
- [理论:如何为编写声明文件](./理论-如何为编写声明文件.md)
- [实战:编写 JavaScript 库编写声明文件](<./实战-编写 JavaScript 库编写声明文件.md>)
- [TypeScript 工程化：tsconfig.json 配置](<./TypeScript 工程化-tsconfig.json 配置.md>)
- [TypeScript 工程化：代码检测](<./TypeScript 工程化-代码检测.md>)
- [TypeScript 工程化：单元测试](<./TypeScript 工程化-单元测试.md>)
- [TypeScript 工程化：环境搭建](<./TypeScript 工程化-环境搭建.md>)
- [TypeScript 企业级服务器开发：理论篇](<./TypeScript 企业级服务器开发-理论篇.md>)
- [TypeScript 企业级服务器开发：实战篇](<./TypeScript 企业级服务器开发-实战篇.md>)
- [Vue 实战：环境搭建](<./Vue 实战-环境搭建.md>)
- [Vue 实战：vue-property-decorator](<./Vue 实战-vue-property-decorator.md>)
- [Vue 实战：组件 UI 编写](<./Vue 实战-组件 UI 编写.md>)
- [Vue 实战：TypeScript 下的 Vuex](<./Vue 实战-TypeScript 下的 Vuex.md>)
- [常见问题答疑](./常见问题答疑.md)
- [TypeScript的学习之路与君共勉](./TypeScript的学习之路与君共勉.md)

    