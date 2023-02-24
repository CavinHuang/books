
---
title: 微信小游戏开发入门：从 0 到 1 实现井字棋游戏
---

## 简介
构建自己的第一个微信小游戏，让你的社交和游戏创意变为现实

## 说明
## 小册介绍

### 认识微信小游戏

张小龙说：玩一个小游戏才是正经事。微信小游戏在正式上线后不到一年的时间里，已经累计发布超过 2000 款游戏，日广告流水达上千万。简单的交互、利用碎片化的游戏时间、丰富的社交互动、将游戏与社交完美融合，这些特点使得微信小游戏天然具备“呼朋引伴，说玩就玩，玩完即走”的优势，迅速吸引了亿级玩家。

同时，微信小游戏也对开发者全面开放，并提供良好的收入分成机制。随着微信小程序和小游戏生态的持续火爆，广大的 Web 开发者也可以借助微信小游戏平台，轻松实现自己的游戏创意，通过发挥开发才能，在红利期把握创收机遇，让开发一个小游戏，成为拥有大好“钱”途的正经事。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/18/165eb7369919c7d1~tplv-t2oaga2asx-image.image)

### 我们将为你带来什么

在微信小游戏开放能力发布之初，凹凸实验室团队就投入到了小游戏的开发实践中，并基于不同的游戏引擎，开发并上线了数款 2D / 3D 的小游戏。现在，我们将积累的开发经验与心得汇聚在这本小册里，并试图通过实现一个典型小游戏实例，为读者解答以下疑问：

> - 微信小游戏背后的技术本质是什么？提供哪些能力和玩法？
> - 如何从 0 到 1 去实现一款微信小游戏？
> - 如何选择游戏引擎进行微信小游戏开发？
> - 微信小游戏运营有哪些可靠的推广渠道？分成收入又如何？

本小册将以介绍开发一个简单经典的井字棋游戏「井字大作战」为主线，着重讲解以下五个方面的内容，带领大家打通微信小游戏开发的全流程。也期待读者后续在理解和入门小游戏开发的基础上，能继续发挥创意，自主构建一款独特又有趣的小游戏。

![内容模块](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d1c8ab1d77b0c~tplv-t2oaga2asx-image.image)

### 小册目录一览

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/20/165f44684336161d~tplv-t2oaga2asx-image.image)

## 作者介绍

![凹凸实验室](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/3/9/1620b10123fb5e5f~tplv-t2oaga2asx-image.image)

京东凹凸实验室 \(Aotu.io，英文简称 O2\) ，创立于 2015 年 10 月，为掘金最早一批联合编辑，拥有数千关注者。O2 对内负责京东 PC 端首页、多个频道页、小程序版本京东购物、微信手 Q 京东购物、M 端京东、各类营销 H5 活动、H5 小游戏等多个业务模块的前端开发工作，对外作为京东的多终端技术品牌一直活跃于掘金、GitHub 等知名知识共享平台。

## 名人推荐

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/18/165eb714408639c6~tplv-t2oaga2asx-image.image)

## 你会学到什么？

- 微信小游戏开发基础
- 微信小游戏开放能力
- 微信小游戏生态玩法
- 腾讯云服务器配置
- 基于 [PhaserJS](http://phaser.io/) 的小游戏开发
- 基于 [Socket.IO](https://socket.io/) 的对战服务搭建
- 从 0 开发并上线一款微信小游戏

## 适宜人群

- 熟练掌握 JavaScript 开发基础
- 有意向朝小游戏方向发展的 Web 开发者和其他领域开发者
- 想了解小游戏开发知识和全流程的学生、新手和其他互联网从业人员

## 购买须知

1.  本小册为图文形式内容服务，共计 13 节，上线时间为 2018 年 9 月 20 日；
2.  购买用户可享有小册永久的阅读权限；
3.  购买用户可进入小册微信群，与作者互动；
4.  掘金小册为虚拟内容服务，一经购买成功概不退款；
5.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
6.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io> 。

## 章节
- [开篇：微信小游戏介绍](./kai-pian-wei-xin-xiao-you-xi-jie-shao.md)
- [基础篇 1：微信小游戏开发基础](<./ji-chu-pian-1-wei-xin-xiao-you-xi-kai-fa-ji-chu.md>)
- [基础篇 2：微信小游戏开放能力](<./ji-chu-pian-2-wei-xin-xiao-you-xi-kai-fang-neng-li.md>)
- [基础篇 3：游戏开发引擎及支持情况](<./ji-chu-pian-3-you-xi-kai-fa-yin-qing-ji-zhi-chi-qing-kuang.md>)
- [实战篇 1：开发前的准备](<./shi-zhan-pian-1-kai-fa-qian-de-zhun-bei.md>)
- [实战篇 2：单机游戏实现](<./shi-zhan-pian-2-dan-ji-you-xi-shi-xian.md>)
- [实战篇 3：基于腾讯云的服务器环境搭建](<./shi-zhan-pian-3-ji-yu-teng-xun-yun-de-fu-wu-qi-huan-jing-da-jian.md>)
- [实战篇 4：基于 Socket.IO 的对战服务详解](<./shi-zhan-pian-4-ji-yu-socket.io-de-dui-zhan-fu-wu-xiang-jie.md>)
- [实战篇 5：对战游戏实现](<./shi-zhan-pian-5-dui-zhan-you-xi-shi-xian.md>)
- [实战篇 6：游戏排行实现](<./shi-zhan-pian-6-you-xi-pai-xing-shi-xian.md>)
- [实战篇 7：游戏生态接入](<./shi-zhan-pian-7-you-xi-sheng-tai-jie-ru.md>)
- [实战篇 8：发布小游戏](<./shi-zhan-pian-8-fa-bu-xiao-you-xi.md>)
- [总结篇：优化与总结](./zong-jie-pian-you-hua-yu-zong-jie.md)

    