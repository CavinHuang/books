
---
title: 剖析 Vue.js 内部运行机制
---

## 简介
把原理抽象为小 Demo，以一种对新手友好的方式带领读者漫游 Vue.js 的世界

## 说明
## 小册介绍

之前写[《Vue.js 源码解析》](https://github.com/answershuto/learnVue)的时候笔者就一直在思考，**如何写出让新手同学能够读懂的文章呢**？当时采用通篇的源码加上注释的方式讲解，笔者发现这样做不但导致文章体量大代码多，而且对没有阅读过源码或者没有阅读大型项目源码经历的同学来说并不友好。因为源码中有很多细节的东西，这些东西对于理解整个项目的内部运行机制并不那么重要，应该是先理解内部运行机制，然后再去深剖这些细节。

> **那么怎么样让新手更容易理解这些内容呢？**
> 
> 于是笔者就诞生了一个想法：把 Vue.js 的核心源码抽离出来，写成一个一个代码量更小更精细的 Demo ，形成一个简易版的 Vue.js 轮子，尝试用更少量的代码讲解核心部分内容，这样能更好地让人理解，毕竟大段的源码在没有上下文的情况下会让人觉得晦涩难懂。

所以这本小册就这样诞生啦，期望能以一种对新手更加友好的方式来讲解 Vue.js 内部运行机制。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/16/160fd1305bfb0545~tplv-t2oaga2asx-image.image)

讲了那么多，我们还是要介绍一下 [Vue.js](https://vuejs.org/) 这一款优秀的 MVVM 框架。 Vue.js 是一款专注于视图层、用于构建用户交互界面的响应式渐进框架。除了大大提高了开发效率并降低了维护成本以外，它还拥有着优雅的 API 设计、快速上手的特性，这使它已经成为了目前主流前端框架之一。

但是你们有没有思考过：

- Vue.js 究竟是如何在我们对数据进行操作的时候影响视图的呢？
- 修改的数据如何批量高效地映射到视图上呢？
- 传统的 DOM 操作又在何时进行的呢？

很多同学并没有对其原理有一个更深一层的理解，导致在遇到一些难以琢磨的问题的时候会感到无从下手。

本小册希望通过一种对新手更加友好直观的方式讲解 Vue.js 内部运行机制。把 Vue.js 拆分成多个小模块，讲解模块间的依赖以及调用关系。然后将源码核心部分抽离压缩，各个模块以小 Demo 的形式展现出来，用最少的代码讲解内部实现。掌握了这些模块的核心原理之后，再去阅读 Vue.js 源码或者是解决 Vue.js 的疑难杂症时，相信会更加得心应手。

程序界的「二八定律」，百分之八十的问题可以运用百分之二十的知识来解决，而剩下的百分之二十的问题需要运用百分之八十的知识来解决。准备好那百分之八十的知识，才会在遇到有挑战的问题时更加游刃有余，机会永远留给准备好的人。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/17/16102b7244c478b8~tplv-t2oaga2asx-image.image)

本小册希望用一种对新手更加友好的方式来讲解 Vue.js 内部运行机制，带领大家漫游 Vue.js 的世界，旨在帮助每一名想要进一步学习 Vue.js 的开发者。

## 作者介绍

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/21/1686fb1d9edb209d~tplv-t2oaga2asx-image.image)

染陌，前端工程师，掘金专栏作者。 前 C++ 后端工程师，技术涉猎广泛。GitHub 千星项目《Vue.js 源码解析》作者，对 Vue.js 有着较为深入的研究。

GitHub：<https://github.com/answershuto>

## 名人推荐

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/17/16102ba83431fd79~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/17/16102bb35339d0a9~tplv-t2oaga2asx-image.image)

## 你会学到什么？

- 了解 Vue.js 内部运行机制，理解调用各个 API 背后的原理
- 学习精准定位基于 Vue.js 构建的项目中的各种问题原因
- 深入了解 Vue.js 的「响应式」机制
- 知道 Vue.js 是如何进行「依赖收集」，准确地追踪所需修改
- 理解 template 模板的编译机制
- 明白 Virtual DOM 是什么，并了解如何基于它实现比对应用及跨平台
- 深入理解 Vue.js 的批量异步更新策略
- 知晓 Vuex 的工作原理

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/15/160f7d5318fea08c~tplv-t2oaga2asx-image.image)

> 了解基本实现有利于想去阅读 Vue.js 源码的同学更快更有效地阅读源码，不会再觉得大量的源码难以入手

## 适宜人群

- 熟悉 JavaScript 语言
- 熟悉 Vue.js 的基本使用

## 你需要准备什么？

- 💻 JavaScript 语言基础以及 Vue.js 基础
- ☕️ 一台电脑一杯咖啡
- ❤️ 一颗热爱前端的心

## 购买须知

1.  本小册为图文形式内容服务，共计 9 节，上线时间为 2018 年 1 月 17 日；
2.  购买用户可享有小册永久的阅读权限；
3.  购买用户可进入小册微信群，与作者互动；
4.  掘金小册为虚拟内容服务，一经购买成功概不退款；
5.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
6.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [Vue.js 运行机制全局概览](<./vue.js-yun-xing-ji-zhi-quan-ju-gai-lan.md>)
- [响应式系统的基本原理](./xiang-ying-shi-xi-tong-de-ji-ben-yuan-li.md)
- [响应式系统的依赖收集追踪原理](./xiang-ying-shi-xi-tong-de-yi-lai-shou-ji-zhui-zong-yuan-li.md)
- [实现 Virtual DOM 下的一个 VNode 节点](<./shi-xian-virtual-dom-xia-de-yi-ge-vnode-jie-dian.md>)
- [template 模板是怎样通过 Compile 编译的](<./template-mo-ban-shi-zen-yang-tong-guo-compile-bian-yi-de.md>)
- [数据状态更新时的差异 diff 及 patch 机制](<./shu-ju-zhuang-tai-geng-xin-shi-de-chai-yi-diff-ji-patch-ji-zhi.md>)
- [批量异步更新策略及 nextTick 原理](<./pi-liang-yi-bu-geng-xin-ce-lue-ji-nexttick-yuan-li.md>)
- [Vuex 状态管理的工作原理](<./vuex-zhuang-tai-guan-li-de-gong-zuo-yuan-li.md>)
- [总结 \& 常见问题解答](<./zong-jie-and-chang-jian-wen-ti-jie-da.md>)

    