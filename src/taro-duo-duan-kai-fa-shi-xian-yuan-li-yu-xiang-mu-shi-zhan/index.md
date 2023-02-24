
---
title: Taro 多端开发实现原理与项目实战
---

## 简介
剖析 Taro 多端开发框架的实现原理，并通过电商核心的项目实战，帮助开发者快速上手多端项目。

## 说明
## 作者介绍

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/12/1670626d2780cc65~tplv-t2oaga2asx-image.image)

凹凸实验室 \([Aotu.io](https://aotu.io/)，英文简称 O2\) ，创立于 2015 年 10 月，为掘金最早一批联合编辑，拥有数千关注者。O2 对内主要为京东商城、微信/手 Q 购物入口、TOPLIFE 等平台业务提供 WEB 前端开发、小程序开发、小游戏开发、H5 动画开发、APP 开发、后端服务开发等能力支持，对外作为多终端技术品牌一直活跃于[掘金](https://juejin.cn/user/1134351699149854)、[GitHub](https://github.com/o2team) 等知名知识共享平台。

本小册由凹凸实验室的多名开发工程师利用业余时间精心编写，他们来自：Taro 核心开发者、使用 Taro 开发「京东购物」小程序的开发者、使用 Taro 开发「TOPLIFE」小程序的开发者、使用 Taro 开发「壹赫兹 OneHertz」小程序的开发者，等等。

![凹凸实验室](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/3/9/1620b10123fb5e5f~tplv-t2oaga2asx-image.image)

## 小册介绍

[Taro](https://taro.aotu.io/) 是由凹凸实验室打造的一套遵循 React 语法规范的多端统一开发框架。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/12/1670625fb4afa598~tplv-t2oaga2asx-image.image)

本小册按开篇、基础篇、进阶篇、实战篇、总结篇进行编排，以便于读者按照自己的已有知识进行学习。

开篇和基础篇既可以作为小程序的入门亦可作为 Taro 的入门来学习，主要介绍前端多端统一开发背景与趋势开发， Taro 开发电商平台所需要的 React 知识和小程序开发入门知识，Taro 的安装使用和开发说明及注意事项，最后我们实现一个简单的 Todo 项目，并通过它的升级版了解如何在 Taro 中整合 Redux。

进阶篇主要介绍 Taro 的技术原理与细节，希望大家了解多端统一开发设计的思想及架构，CLI 原理及不同端的运行机制、文件转换处理、组件库及 API 的设计与适配，以及如何实现 JSX 转换微信小程序模板和 Taro 在小程序、H5、RN 各端的运行时等，让大家知其然知其所以然，期待大家参与到 Taro 的开发中来。

实战篇将以一个电商平台为例，挑选出黄金购物流程来和大家一一讲解，其中会涉及到授权、商品列表页、商品详情页、购物车、结算页、以及小程序云的介绍与使用，最后介绍多端的打包与发布。虽然不能面面俱到，但还是希望大家可以从我们对例子的分享中有所收获。

本小册会提供一份代码实例，其中包含：

- [《用 Taro 实现一个简单的 Todo 项目》的示例](https://github.com/o2team/taro-ebook-source/tree/master/todoList)
- [《在 Taro 中使用 Redux》的示例](https://github.com/o2team/taro-ebook-source/tree/master/todoList-Redux)
- [实战篇电商平台的示例](https://github.com/o2team/taro-ebook-source/tree/master/taro-demo)

欢迎新老读者继续支持我们的原创内容。

## 你会学到什么？

- 多端统一开发框架 Taro 的安装和使用
- 用 Taro 实现一个简单的 Todo 项目
- 在 Taro 中使用 Redux
- Taro 多端统一开发设计思想及架构
- taro-cli 原理及不同端的运行机制
- Taro 的文件转换处理
- Taro 组件库及 API 的设计与适配
- Taro 实现 JSX 转换微信小程序模板
- Taro 开发电商平台实践

## 适宜人群

- 想使用 React 开发多端应用的开发者
- 想开发小程序，但追求更高效率的开发者
- 想了解多端电商平台实践的开发者
- 想了解 Taro 设计思想及架构、技术细节的开发者

## 名人推荐

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/12/16706231257a0d80~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/13/1670b2c003890539~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/13/1670b2c29edef357~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/11/13/1670b2c4f3a1e98c~tplv-t2oaga2asx-image.image)

## 购买须知

1.  本小册为图文形式内容服务，共计 27 节，上线时间为 2018 年 11 月 13 日；
2.  购买用户可享有小册永久的阅读权限；
3.  购买用户可进入小册微信群，与作者互动；
4.  掘金小册为虚拟内容服务，一经购买成功概不退款；
5.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
6.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>
7.  小册所得资金将用于 Taro 开源基金（线下交流会、周边产品定制等）建设，并将拿出部分资金用于支持其他公益项目。

## 更新日志

根据读者的反馈与建议，我们不断优化本小册，主要更新如下：

- 2018.09.10: 完成初稿

## 章节
- [开篇：前端多端统一开发背景与趋势介绍](./kai-pian-qian-duan-duo-duan-tong-yi-kai-fa-bei-jing-yu-qu-shi-jie-shao.md)
- [基础篇 1：React 核心语法初识](<./ji-chu-pian-1-react-he-xin-yu-fa-chu-shi.md>)
- [基础篇 2：微信小程序开发入门与技术选型](<./ji-chu-pian-2-wei-xin-xiao-cheng-xu-kai-fa-ru-men-yu-ji-shu-xuan-xing.md>)
- [基础篇 3：多端统一开发框架 Taro 的安装与使用](<./ji-chu-pian-3-duo-duan-tong-yi-kai-fa-kuang-jia-taro-de-an-zhuang-yu-shi-yong.md>)
- [基础篇 4：Taro 开发说明与注意事项](<./ji-chu-pian-4-taro-kai-fa-shuo-ming-yu-zhu-yi-shi-xiang.md>)
- [基础篇 5：用 Taro 实现一个简单的 Todo 项目](<./ji-chu-pian-5-yong-taro-shi-xian-yi-ge-jian-dan-de-todo-xiang-mu.md>)
- [基础篇 6：在 Taro 中使用 Redux](<./ji-chu-pian-6-zai-taro-zhong-shi-yong-redux.md>)
- [进阶篇 1：Taro 设计思想及架构](<./jin-jie-pian-1-taro-she-ji-si-xiang-ji-jia-gou.md>)
- [进阶篇 2：CLI 原理及不同端的运行机制](<./jin-jie-pian-2-cli-yuan-li-ji-bu-tong-duan-de-yun-xing-ji-zhi.md>)
- [进阶篇 3：组件库及 API 的设计与适配](<./jin-jie-pian-3-zu-jian-ku-ji-api-de-she-ji-yu-gua-pei.md>)
- [进阶篇 4：JSX 转换微信小程序模板的实现（上）](<./jin-jie-pian-4-jsx-zhuan-huan-wei-xin-xiao-cheng-xu-mo-ban-de-shi-xian-shang-.md>)
- [进阶篇 5：JSX 转换微信小程序模板的实现（下）](<./jin-jie-pian-5-jsx-zhuan-huan-wei-xin-xiao-cheng-xu-mo-ban-de-shi-xian-xia-.md>)
- [进阶篇 6：运行时揭秘 - 小程序运行时](<./jin-jie-pian-6-yun-xing-shi-jie-mi---xiao-cheng-xu-yun-xing-shi.md>)
- [进阶篇 7：运行时揭秘 - H5 运行时](<./jin-jie-pian-7-yun-xing-shi-jie-mi---h5-yun-xing-shi.md>)
- [进阶篇 8：运行时揭秘 - RN 运行时](<./jin-jie-pian-8-yun-xing-shi-jie-mi---rn-yun-xing-shi.md>)
- [实战篇 1：多端电商平台完整项目概述及开发准备](<./shi-zhan-pian-1-duo-duan-dian-shang-ping-tai-wan-zheng-xiang-mu-gai-shu-ji-kai-fa-zhun-bei.md>)
- [实战篇 2：小程序云的介绍与使用](<./shi-zhan-pian-2-xiao-cheng-xu-yun-de-jie-shao-yu-shi-yong.md>)
- [实战篇 3：通过小程序云搭建电商后台服务](<./shi-zhan-pian-3-tong-guo-xiao-cheng-xu-yun-da-jian-dian-shang-hou-tai-fu-wu.md>)
- [实战篇 4：商品列表页开发及性能优化](<./shi-zhan-pian-4-shang-pin-lie-biao-ye-kai-fa-ji-xing-neng-you-hua.md>)
- [实战篇 5：商品详情页面开发](<./shi-zhan-pian-5-shang-pin-xiang-qing-ye-mian-kai-fa.md>)
- [实战篇 6：购物车开发](<./shi-zhan-pian-6-gou-wu-che-kai-fa.md>)
- [实战篇 7：结算页面开发](<./shi-zhan-pian-7-jie-suan-ye-mian-kai-fa.md>)
- [实战篇 8：微信小程序端用户授权处理](<./shi-zhan-pian-8-wei-xin-xiao-cheng-xu-duan-yong-hu-shou-quan-chu-li.md>)
- [实战篇 9：微信小程序开发填坑指南](<./shi-zhan-pian-9-wei-xin-xiao-cheng-xu-kai-fa-tian-keng-zhi-nan.md>)
- [实战篇 10：微信小程序端及 H5 端预览适配与发布](<./shi-zhan-pian-10-wei-xin-xiao-cheng-xu-duan-ji-h5-duan-yu-lan-gua-pei-yu-fa-bu.md>)
- [实战篇 11：React Native 端打包与发布](<./shi-zhan-pian-11-react-native-duan-da-bao-yu-fa-bu.md>)
- [总结](./zong-jie.md)

    