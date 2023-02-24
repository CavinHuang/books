
---
title: 基于 hapi 的 Node.js 小程序后端开发实践指南
---

## 简介
基于 Node.js 搭建敏捷高效的 RESTful 接口服务，走上小程序开发的全栈之路

## 说明
## 小册介绍

### 小程序的时代大背景

据 ZeniTH 数据报告统计，2018 年中国智能手机数量突破 13 亿。这个数字预示着互联网世界的中心已经从 PC 端转移到了移动端。随着微信用户的增加，如今的 10 亿微信用户，更是小程序成长的背景。

随着支付宝与微信支付的普及，二维码也逐渐走进了大众的视野，从此打开了连接线上与线下的通道。「新零售」、「共享经济」这些新领域的不断发展，标志着「场景融合」开始成为各个行业发展的重心。小程序就是在这样的背景下诞生。并且在短短 17 个月里，涌现出 100 多万款小程序，150 多万名小程序开发者，5000 多家第三方平台，小程序的爆发远比我们想象得激烈。

面对小程序领域的技术发展之迅速，市场产品需求之旺盛，业务需求变化之频繁，后端服务如何快速响应变化，以满足前端系统所需的数据支持，是一个整体研发效率上的挑战。

基于 JavaScript 的小程序的前端与具备后端服务能力的 Node.js 有着一致化的语言生态。笔者希望以我们日常生活中所熟悉的外卖小程序为案例抽象，将 Node.js 后端开发所需要的知识点，通过需求拆解、迭代实现，来帮助小程序应用的前端开发者们走上全栈之路。当然，也同样希望能帮助其他后端语言背景的开发者们，了解感受 Node.js 作为后端解决方案的技术魅力。

### API 接口化优先的 hapi

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/10/165c277d89b63c40~tplv-t2oaga2asx-image.image)

hapi 由沃尔玛实验室的移动团队创建的，该团队由 OAuth 的创建者 Eran Hammer 领导，hapi 被用来服务于「黑色星期五」这样的活动场景，这是美国日历上最繁忙的在线购物日之一。hapi 自身的性能可靠性，值得信赖。

笔者以为，国内基于 Express、Koa 的 Node.js 的教程书籍，已有相当的沉淀，而基于 hapi 的框架介绍却为数不多。但从 npm 的框架下载使用趋势图来看，hapi 的使用热度与 Koa 处在同一量级，并远超阿里的 egg。笔者希望借此小册，为 hapi 在后端服务框架的使用，做一份布道的贡献。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/10/165c2696d64b923a~tplv-t2oaga2asx-image.image)

如下图所示，hapi 拥有最少的 issues。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/10/165c26d05921d5d4~tplv-t2oaga2asx-image.image)

### 小册内容结构

- 基础篇

带你经历从业务需求分析、技术选型到代码实际开发所必经的一个重要准备流程。架构设计布局与基础准备工作大多在这个阶段进行，磨刀不误砍柴工。

- 实战篇

带你从程序项目工程的初始化，循序渐进地掌握后端开发必备的专业知识，完成业务需求分析中预设的程序设计目标。并利用腾讯云的服务发布上线，到达用户。

- 拓展篇

拓展初学者容易忽视的重要知识和技能。不会像实战篇里那样带来所见即所得的强烈成就感，但在实际商业项目开发过程中，这些知识技能点扮演着重要角色。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/11/165c79f5796886d0~tplv-t2oaga2asx-image.image)

## 你会学到什么？

- 基于 hapi 的 RESTful 接口设计规范
- hapi 配置优先的框架设计理念
- 多种 Node.js 开发调试姿势
- 接口契约文档化 Swagger
- 前后端分离的 JWT 认证
- Joi 接口入参校验
- Sequelize 对 MySQL 的数据库操作
- 数据库初始化迁移 migrate
- 数据库初始化填充 seed
- Node.js 生产部署流程
- 系统日志
- ... \(更多精彩\)

## 适宜人群

- 有小程序的前端开发经验，想尝试全栈开发，快速搭建后端 API 服务的同学
- 掌握一定 JavaScript 语法基础，想通过一个精炼的实战案例，来整体地学习 Node.js API 服务化开发的同学
- 有 Node.js 服务化开发经验，但想了解 hapi 作为应用框架如何解决问题的同学

## 你应该具备什么

- 基本的 JavaScript 语言基础
- 基本的 MySQL 数据库概念
- 基本的 HTTP 数据接口知识

## 作者介绍

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/11/165c79fac3990107~tplv-t2oaga2asx-image.image)

**叶盛飞**

前网易高级开发工程师，Adobe 中国认证讲师，PC 时代 Adobe Flash RIA 专家。

前全球最大 ActionScript 开发者社区 9ria 技术合伙人，前社交电商平台最吃货网创始人。

多年互联网早期项目创业者，擅长技术与业务的融合之道，持续实践高效敏捷可扩展的工程化解决方案。

## 名人推荐

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/11/165c7a01564294f3~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/11/165c7a0450b5e8f2~tplv-t2oaga2asx-image.image)

## 特殊贡献伙伴

好伙伴侯文涛与彭祥，帮助参与了部分章节的知识点整理。  
李梦娜老师\@掘金，帮助参与了章节的排版整理、结构优化与文案润色。

## 购买须知

1.  本小册为图文形式内容服务，共计 17 节，上线时间为 2018 年 9 月 12 日；
2.  购买用户可享有小册永久的阅读权限；
3.  购买用户可进入小册微信群，与作者互动；
4.  掘金小册为虚拟内容服务，一经购买成功概不退款；
5.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
6.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>。

## 章节
- [开篇： 小程序的 Node.js 全栈之路](<./kai-pian--xiao-cheng-xu-de-node.js-quan-zhan-zhi-lu.md>)
- [基础篇 1：小程序需求分析与基础设计](<./ji-chu-pian-1-xiao-cheng-xu-xu-qiu-fen-xi-yu-ji-chu-she-ji.md>)
- [基础篇 2：后端技术选型 —— Node.js \& hapi](<./ji-chu-pian-2-hou-duan-ji-shu-xuan-xing------node.js-and-hapi.md>)
- [基础篇 3：欲善事先利器 —— Node.js 调试技巧](<./ji-chu-pian-3-yu-shan-shi-xian-li-qi------node.js-diao-shi-ji-qiao.md>)
- [实战篇 1：项目工程初始化 —— 使用 hapi](<./shi-zhan-pian-1-xiang-mu-gong-cheng-chu-shi-hua------shi-yong-hapi.md>)
- [实战篇 2：接口契约与入参校验 —— 使用 Swagger \& Joi](<./shi-zhan-pian-2-jie-kou-qi-yue-yu-ru-can-xiao-yan------shi-yong-swagger-and-joi.md>)
- [实战篇 3：表结构设计、迁移与数据填充 —— 使用 Sequelize-cli](<./shi-zhan-pian-3-biao-jie-gou-she-ji-qian-yi-yu-shu-ju-tian-chong------shi-yong-sequelize-cli.md>)
- [实战篇 4：小程序列表获取 —— 使用 Sequelize](<./shi-zhan-pian-4-xiao-cheng-xu-lie-biao-huo-qu------shi-yong-sequelize.md>)
- [实战篇 5：身份验证设计 —— 使用 JWT](<./shi-zhan-pian-5-shen-fen-yan-zheng-she-ji------shi-yong-jwt.md>)
- [实战篇 6：身份验证实现 —— 使用 hapi-auth-jwt2](<./shi-zhan-pian-6-shen-fen-yan-zheng-shi-xian------shi-yong-hapi-auth-jwt2.md>)
- [实战篇 7：小程序登录授权 与 JWT 签发](<./shi-zhan-pian-7-xiao-cheng-xu-deng-lu-shou-quan-yu-jwt-qian-fa.md>)
- [实战篇 8：小程序订单创建 —— 使用事务](<./shi-zhan-pian-8-xiao-cheng-xu-ding-dan-chuang-jian------shi-yong-shi-wu.md>)
- [实战篇 9：小程序订单支付 —— 微信支付](<./shi-zhan-pian-9-xiao-cheng-xu-ding-dan-zhi-fu------wei-xin-zhi-fu.md>)
- [实战篇 10：服务部署发布 —— 使用小程序开发者工具](<./shi-zhan-pian-10-fu-wu-bu-shu-fa-bu------shi-yong-xiao-cheng-xu-kai-fa-zhe-gong-ju.md>)
- [拓展篇 1：系统监控与记录 —— 使用 Good 插件](<./tuo-zhan-pian-1-xi-tong-jian-kong-yu-ji-lu------shi-yong-good-cha-jian.md>)
- [拓展篇 2：系统稳定性测试 —— 使用 Lab \& Code](<./tuo-zhan-pian-2-xi-tong-wen-ding-xing-ce-shi------shi-yong-lab-and-code.md>)
- [尾声 ：项目回顾，温故知新](<./wei-sheng--xiang-mu-hui-gu-wen-gu-zhi-xin.md>)

    