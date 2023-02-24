
---
title: Node + React 实战：从 0 到 1 实现记账本 
---

## 简介
Egg + React 全栈开发掘掘记账本，助力前端进击全栈。

## 说明
## 小册介绍

很多初级前端开发同学，在学习完某些知识后，经常会发出疑问，“我学完了 HTML、CSS、JavaScript，后面该学什么”。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/484c9ba2a1b04bffa342fc69c5395bc6~tplv-k3u1fbpfcp-watermark.image)

其实，多数做前端开发的同学，都会遇到这样的问题，“切图仔”做久了，觉得很枯燥，但又不知道该学习哪方面的知识。

**因此，本小册致力于通过一个实战项目——掘掘记账本，带着这部分前端同学入门 Node + React ，成为全栈工程师。**

> [记账本项目在线预览](http://cost.chennick.wang/)。测试账号：admin 测试密码：111111

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ecfbf8c760f4dce963d59ffaeff3452~tplv-k3u1fbpfcp-zoom-1.image)

> 全栈工程师的定义比较模糊，甚至跟你所在公司的大小也有一定关系。大厂对于 `Node` 开发人员的要求，多数是服务于中台，制作一些中间件或者是提效工具，提高前端开发人员的工作效率。小厂则可能是要求你可以运用 `Node` 相关知识，作为服务端的主语言，开发 `API` 接口供前端开发使用。

那么，为了让同学们有条理地学习前后端分离知识，我把这个记账本的实现分为两部分：「服务端部分」和「前端部分」。

### 服务端知识点

**首先，掘掘记账本的服务端部分，采用的是 `Node` 的上层解决方案 `Egg.js`。** 它的强大之处不言而喻，它专注于提供 `Web` 开发的核心功能和一套灵活可扩展的插件机制，它不会做出技术选型，因为固定的技术选型会使框架的扩展性变差，无法满足各种定制需求。通过 `Egg`，团队的架构师和技术负责人可以非常容易地基于自身的技术架构在 `Egg` 基础上扩展出适合自身业务场景的框架。

它有以下几个特性：

- 提供基于 `Egg` 定制上层框架的能力

- 高度可扩展的插件机制

- 内置多进程管理

- 基于 `Koa` 开发，性能优异

- 框架稳定，测试覆盖率高

- 渐进式开发

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17cee9e1c08448239bfa8890d5247bda~tplv-k3u1fbpfcp-zoom-1.image)

### 前端知识点

**其次，掘掘记账本的前端部分采用的是 `React` 框架。** 它的出镜率不必多说，也是各大厂频繁使用的框架，小册实战部分全程采用 `React Hooks` 的形式开发，并对其渲染机制进行简要的分析，让大家从原理上去理解函数组件的渲染机制。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c11fcf889f946159ba2fe127fac9b97~tplv-k3u1fbpfcp-zoom-1.image)

> 本小册内容，一册两用，只想学习前端部分的同学，笔者也提供了在线接口供大家使用。

## 你会学到什么？

- 数据库可视化工具 `DBeaver` 的使用。

- 入门 `Egg.js`，并通过它实现一套可用于生产环境的 `API` 接口。

- 利用 `egg-jwt` 实现 `token` 形式的多用户鉴权。

- 入门 `React`，并使用它搭建出一套可用于生产环境的前端种子项目。

- pm2 进程守护，自动化部署前端项目。

- 完成一整套从「整理需求」-> 「设计数据库」-> 「服务端接口开发」-> 「前端项目编写」-> 「部署上线」的流程。

## 适宜人群

1、前端职业生涯前期，遇到学习瓶颈的同学。

- 局限于前端的知识体系，会让你的思路也同样局限于前端的领域，拓展你的知识面，可以让你对整个技术的认知进入新的高度。

2、在校学生，希望通过开发实战项目，完成毕设的同学。

- 本项目带大家从 0 到 1 开发出一个完整的前后端项目，有助于即将毕业的同学很好的理解整个项目的开发过程，在写论文的时候，也能游刃有余。

3、想通过学习 `Node`，拓展技能树，升职加薪的同学。

- 多数在小厂做前端开发的同学应该有所体会，一直都是做一些不那么锻炼技术的后台管理系统。这些技能树可能不能很好地支撑你的涨薪诉求，入门 `Node` 后，你可以做一些提高开发效率的工具，帮助你获得更好的升职加薪的机会。

4、想开启 **「远程工作」** 的同学。

- 远程工作，很多时候需要你既会前端，又得会后端，因为雇佣者开发成本有限，需要开发人员的技能树尽可能的多。

## 作者介绍

我是尼克陈，从业前端开发 6 年，目前就职于杭州某新媒体工具公司，曾参与知名微信生态工具 `Wetool` 的开发，现致力于企业微信相关辅助工具的研发。

[newbee-ltd](https://github.com/newbee-ltd) 开源项目贡献者之一。

## 购买须知

1.  本小册为图文形式内容服务，共计 21 节；
2.  全部文章现已更新完成；
3.  购买用户可享有小册永久的阅读权限；
4.  购买用户可进入小册微信群，与作者互动；
5.  掘金小册为虚拟内容服务，一经购买成功概不退款；
6.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
7.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [开篇词](./kai-pian-ci.md)
- [后端预备：Egg.js 基础入门及项目初始化介绍](<./hou-duan-yu-bei-egg.js-ji-chu-ru-men-ji-xiang-mu-chu-shi-hua-jie-shao.md>)
- [后端预备：MySql 本地安装\(Win + Mac\)](<./hou-duan-yu-bei-mysql-ben-di-an-zhuang-win-mac-.md>)
- [后端预备：可视化数据库工具 DBeaver 的安装和使用](<./hou-duan-yu-bei-ke-shi-hua-shu-ju-ku-gong-ju-dbeaver-de-an-zhuang-he-shi-yong.md>)
- [后端实战：数据库表的设计](./hou-duan-shi-zhan-shu-ju-ku-biao-de-she-ji.md)
- [后端实战：egg-jwt 实现用户鉴权（注册、登录）](<./hou-duan-shi-zhan-egg-jwt-shi-xian-yong-hu-jian-quan-zhu-ce-deng-lu-.md>)
- [后端实战：后端实战：用户信息相关接口实现（修改个签、修改密码、上传头像）](./hou-duan-shi-zhan-hou-duan-shi-zhan-yong-hu-xin-xi-xiang-guan-jie-kou-shi-xian-xiu-gai-ge-qian-xiu-gai-mi-ma-shang-chuan-tou-xiang-.md)
- [后端实战：账单及其相关接口实现](./hou-duan-shi-zhan-zhang-dan-ji-qi-xiang-guan-jie-kou-shi-xian.md)
- [🚩 上半场结束｜服务端总结](<./shang-ban-chang-jie-shu-fu-wu-duan-zong-jie.md>)
- [前端预备：现代前端框架单页面概念](./qian-duan-yu-bei-xian-dai-qian-duan-kuang-jia-dan-ye-mian-gai-nian.md)
- [前端预备：从一个数据请求，入门 React Hooks](<./qian-duan-yu-bei-cong-yi-ge-shu-ju-qing-qiu-ru-men-react-hooks.md>)
- [前端预备：Vite 2.0 下一代前度开发构建工具](<./qian-duan-yu-bei-vite-2.0-xia-yi-dai-qian-du-kai-fa-gou-jian-gong-ju.md>)
- [前端实战：Vite 2.0 + React + ZarmUI 搭建前端 H5 开发环境](<./qian-duan-shi-zhan-vite-2.0-react-zarmui-da-jian-qian-duan-h5-kai-fa-huan-jing.md>)
- [前端实战：底部导航栏](./qian-duan-shi-zhan-di-bu-dao-hang-lan.md)
- [前端实战：登录注册页面](./qian-duan-shi-zhan-deng-lu-zhu-ce-ye-mian.md)
- [前端实战：账单列表页](./qian-duan-shi-zhan-zhang-dan-lie-biao-ye.md)
- [前端实战：新增账单弹窗封装](./qian-duan-shi-zhan-xin-zeng-zhang-dan-dan-chuang-feng-zhuang.md)
- [前端实战：账单详情页](./qian-duan-shi-zhan-zhang-dan-xiang-qing-ye.md)
- [前端实战：账单数据统计页](./qian-duan-shi-zhan-zhang-dan-shu-ju-tong-ji-ye.md)
- [前端实战：个人中心](./qian-duan-shi-zhan-ge-ren-zhong-xin.md)
- [项目部署上线](./xiang-mu-bu-shu-shang-xian.md)
- [问题汇总\(持续更新\)](<./wen-ti-hui-zong-chi-xu-geng-xin-.md>)

    