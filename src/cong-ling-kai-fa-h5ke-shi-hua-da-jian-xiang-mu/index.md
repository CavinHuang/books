
---
title: 从零开发H5可视化搭建项目
---

## 简介
配套视频教学！由浅入深从根上理解可视化搭建这回事，紧贴业务设计符合业务需要的搭建体系。

## 说明
## 小册介绍

在当下业务需求迭代飞快的互联网环境下，如何助力业务，为业务快速试错、迭代提供基础支持是不可规避的挑战之一。这其中最重要的一环就是“快”。有的时候为了满足业务诉求，我们不得不重复去开发一些活动页。所以你可能和我一样，非常想通过一款可以由运营自主组装页面的工具来自动生成页面，规避掉重复、无技术含量的劳动。

相比业界现状，不管在阿里还是腾讯等大厂都有适配自己内部业务诉求场景的一套可视化搭建体系。实现细节虽然有着出入但是核心思想都是希望把原本由开发人肉堆代码的活，通过可视化的方式表达给运营同学使用。或者通过 `lowcode` 的形式减少开发者的重复劳动。因为与业务相关，所以基本上都不会开源。而现在大多数开源的可视化搭建项目，也只是实现了部分可视化搭建的能力，并不能完全结合业务场景使用。

笔者希望借这本小册，一方面为没有接触过可视化搭建的同学提供一个解决问题的思路和方法。 另一方面本小册将会从背景到架构设计再到技术实现细节来一步步介绍如何落地一个围绕业务场景的可视化搭建需求。

## 小册说明

由于可视化搭建课题本身设计到的知识面相对想多，为了帮助读者更好的理解和学习本小册，我们同步推出了免费的配套视频教程，视频更加注重细节，小册更加注重全局实现，读者可以结合视频一起学习本小册的内容，效果更棒！

视频从 2021 年 11 月 9 日开始更新，预计每周更新一集。

小册视频空间地址：<https://space.bilibili.com/355783263/video>

## 作者介绍

muwoo，前端攻城狮。之前在 51信用卡 搞过一年的可视化搭建平台鲁班，半年内发布了 1000+ 活动页。后面辗转反侧去了蚂蚁集团，接触到内部的云凤蝶项目，对自己的可视化搭建理念产生了一定的影响。现在团队内也落地了一套可视化搭建体系，也是踩过了颇多的坑。

你可以在这里找到我

Github: <https://github.com/muwoo>

知乎：<https://www.zhihu.com/people/monkey-wang->

小册涉及源码：<https://github.com/coco-h5>

小册视频地址：<https://space.bilibili.com/355783263/video>

## 小册目录

- [x]  1. 前言：可视化搭建诞生背景
- [x]  2. 架构设计
- [x]  3. 前置基础知识准备
- [x]  4. 模板设计
- [x]  5. 模板通信设计
- [x]  6. 模板动态化设计
- [x]  7. 稳定性-模板更新策略
- [x]  8. 全局组件设计
- [x]  9. 全局组件注册
- [x]  10. 稳定性-组件更新策略
- [x]  11. 设计实现 CLI 为开发助力
- [x]  12. 可视化编辑区实现
- [x]  13. 可视化编辑区mock\&预览
- [x]  14. vue3 Form render 实现
- [x]  15. Server 端编译实现
- [x]  16. 发布流程设计
- [x]  17. 写在最后
- [x]  18. 加餐：当前可视化搭建未解决的问题
- [x]  19. 加餐：H5 可视化搭建项目如何在本地跑起来

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b215a28552848e78b8a307ef44b8f1a~tplv-k3u1fbpfcp-watermark.image)

## 你会学到什么？

- 可视化搭建的历史背景和方向选择
- 了解可视化搭建的技术设计思想
- 可视化搭建的编辑区设计
- 可视化搭建动态表单设计
- 可视化搭建模板的设计
- 可视化搭建组件设计
- 可视化搭建 CLI 设计
- 可视化搭建发布流
- 可视化搭建页面更新策略和版本设计
- 可视化搭建页面的未来发展方向

## 适宜人群

- 熟悉常用的 js 框架 Vue 或者 React
- 对 h5 可视化搭建有兴趣的前端开发者

## 购买须知

1.  本小册为图文形式内容服务，共计 19 节；
2.  全部文章已于 03 月 01 日更新完成；
3.  购买用户可享有小册永久的阅读权限；
4.  购买用户可进入小册微信群，与作者互动；
5.  掘金小册为虚拟内容服务，一经购买成功概不退款；
6.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
7.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [前言：可视化搭建诞生背景](./qian-yan-ke-shi-hua-da-jian-dan-sheng-bei-jing.md)
- [架构设计](./jia-gou-she-ji.md)
- [前置基础知识准备](./qian-zhi-ji-chu-zhi-shi-zhun-bei.md)
- [模板设计](./mo-ban-she-ji.md)
- [模板通信设计](./mo-ban-tong-xin-she-ji.md)
- [模板动态化交互](./mo-ban-dong-tai-hua-jiao-hu.md)
- [稳定性-模板更新策略](./wen-ding-xing-mo-ban-geng-xin-ce-lue.md)
- [全局组件设计](./quan-ju-zu-jian-she-ji.md)
- [全局组件注册](./quan-ju-zu-jian-zhu-ce.md)
- [稳定性-组件更新策略](./wen-ding-xing-zu-jian-geng-xin-ce-lue.md)
- [设计实现 CLI 为开发助力](<./she-ji-shi-xian-cli-wei-kai-fa-zhu-li.md>)
- [可视化编辑区实现](./ke-shi-hua-bian-ji-qu-shi-xian.md)
- [可视化编辑区mock\&预览](<./ke-shi-hua-bian-ji-qu-mock-and-yu-lan.md>)
- [vue3 Form render 实现](<./vue3-form-render-shi-xian.md>)
- [Server 端编译实现](<./server-duan-bian-yi-shi-xian.md>)
- [发布流程设计](./fa-bu-liu-cheng-she-ji.md)
- [写在最后](./xie-zai-zui-hou.md)
- [加餐：当前可视化搭建未解决的问题](./jia-can-dang-qian-ke-shi-hua-da-jian-wei-jie-jue-de-wen-ti.md)
- [加餐：H5 可视化搭建项目如何在本地跑起来](<./jia-can-h5-ke-shi-hua-da-jian-xiang-mu-ru-he-zai-ben-di-pao-qi-lai.md>)

    