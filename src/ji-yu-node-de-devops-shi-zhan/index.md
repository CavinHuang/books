
---
title: 基于 Node 的 DevOps 实战
---

## 简介
通过基于 Node 的项目实战，可以对 DevOps 有更深一步了解，包括不限于开发环节、测试环节、构建和部署环节等等。

## 说明
## 作者介绍

Hello，大家好，我是 **CookieBoty** 。

## 小册介绍

#### 什么是工程化

**一切以提高效率、降低成本、质量保证为目的的手段，都属于工程化**。

通过一系列的**规范、工具**提供**研发提效**、**自动化**、**质量保障**、**服务稳定**、**实时监控**等功能。

#### 为什么前端需要工程化

随着前端技术的发展（React/Vue/Angular、Webpack、TypeScript 以及其他基于 Node 的各种前端框架出现），Web 应用复杂度的增加，前端也从刀耕火种迈向工程化的时代，**组件化、工程化、自动化**成了前端发展的趋势。这些都已经成为一线互联网前端团队标配。稍具规模的团队大都会根据自身业务与梯度来设计开发符合当前业务的 **DevOps 流程**。

前端可以借助于 Node 渗透到传统界面开发之外的领域，将发展链路延伸到整个 DevOps 中去，从而脱离“切图仔”成为**前端工程师**。

之前在掘金连载过同系列博文，小册的内容会比之前系列文章更加细节、更体系化，适合初中级前端阅读学习。

#### 项目整体架构

##### 系统架构图

![系统架构设计.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5477428c78f14b7a877bfc53417aebee~tplv-k3u1fbpfcp-watermark.image)

##### 系统流程图

![项目流程图.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b41d473183904f8d97959d7670d69f01~tplv-k3u1fbpfcp-watermark.image)

上图是一份较完整的 DevOps 项目流程图，项目实战将会简化部分内容，保留整体主干架构来进行学习开发。

> 每个团队具体落地的流程都是要贴合自己的业务，本系列是结合之前的工作经验同时尽可能通过简单的项目实例来介绍。

## 你会学到什么？

小册的学习目录总共分为 20 个章节：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1295381354ba42b8a25af1587f1ccb5b~tplv-k3u1fbpfcp-watermark.image)

整个学习路线将以 **Node** 为作为切入点，可以对 **DevOps** 有更深一步了解，包括不限于**开发环节**、**测试环节**、**构建和部署环节**等等，随着学习内容的推进，你将获得下面的技能：

- 学会基本的 **Node 与 React 项目开发经验**
- 学会基础的**服务器与运维知识**
- 学会基本的**后台知识**
- 学会搭建一套**适合自己团队**的 DevOps 流程
- 学会使用 Jenkins、Docker、VsCode、Sonar、Sentry 等多种工具与插件的使用
- 对工程化有进一步的深入了解

## 阅读建议

小册的内容比较基础但也非常全面，建议阅读的同学不要**只看不动手**，基本的设计与代码都会在小册上体现，随着小册的学习，可以尝试动手搭建一套符合现有业务的工程体系。

本系列需要读者最好能具备下述基本技能：

- 了解 Node 的基本语法、模块导出引入等基础概念
- 了解 React 的基本语法，最好有实际项目开发经验
- 了解如何使用 npm / cnpm / yarn 等安装项目依赖模块
- 了解 Linux 系统，掌握基本的 shell 语法
- 具备基本的应用错误排查的能力

如果缺乏相关经验也不要紧，每一章都会尽可能的详细介绍设计思路，再配合代码辅助，阅读小册同时可以进行对应的实战操作。学完全部小册之后，也会基本掌握上述要求。

整本小册的内容涉及非常广，写作的时间会比较长。希望在接下来观看的过程中，你与我能够互相学习、共同成长。

## 购买须知

1.  本小册为图文形式内容服务，共计 20 节，2021年5月13日上线；
2.  全部文章已更新完成；
3.  购买用户可享有小册永久的阅读权限；
4.  购买用户可进入小册微信群，与作者互动；
5.  掘金小册为虚拟内容服务，一经购买成功概不退款；
6.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
7.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [环境篇 - 虚拟机 \& GitLab](<./huan-jing-pian---xu-ni-ji-and-gitlab.md>)
- [环境篇 - 环境配置](<./huan-jing-pian---huan-jing-pei-zhi.md>)
- [设计篇- 项目分析与设计](<./she-ji-pian--xiang-mu-fen-xi-yu-she-ji.md>)
- [Node 新手篇 - Egg](<./node-xin-shou-pian---egg.md>)
- [Node 工具篇 - Gitlab Api](<./node-gong-ju-pian---gitlab-api.md>)
- [Node 工具篇 - 全局与工具类](<./node-gong-ju-pian---quan-ju-yu-gong-ju-lei.md>)
- [Node 业务篇 - 流程开发](<./node-ye-wu-pian---liu-cheng-kai-fa.md>)
- [Node 业务篇 - Jenkins \& Node](<./node-ye-wu-pian---jenkins-and-node.md>)
- [学习里程碑 | 🏆 - 服务端完结](<./xue-xi-li-cheng-bei---fu-wu-duan-wan-jie.md>)
- [React 基础篇 - 前端界面开发](<./react-ji-chu-pian---qian-duan-jie-mian-kai-fa.md>)
- [脚手架篇 - CLI 工具](<./jiao-shou-jia-pian---cli-gong-ju.md>)
- [脚手架篇 - 基础模板](<./jiao-shou-jia-pian---ji-chu-mo-ban.md>)
- [插件篇 - Vscode](<./cha-jian-pian---vscode.md>)
- [学习里程碑 | 🏆 - 客户端完结](<./xue-xi-li-cheng-bei---ke-hu-duan-wan-jie.md>)
- [构建篇 - Docker](<./gou-jian-pian---docker.md>)
- [构建篇 - Jenkins 进阶](<./gou-jian-pian---jenkins-jin-jie.md>)
- [构建篇 - 代码审查卡点](<./gou-jian-pian---dai-ma-shen-cha-qia-dian.md>)
- [部署篇 - Kubernetes](<./bu-shu-pian---kubernetes.md>)
- [监控篇 - 线上埋点、预警](<./jian-kong-pian---xian-shang-mai-dian-yu-jing.md>)
- [监控篇 - 服务性能监控](<./jian-kong-pian---fu-wu-xing-neng-jian-kong.md>)
- [综合篇 - 整体流程打通](<./zong-he-pian---zheng-ti-liu-cheng-da-tong.md>)
- [最终章 | 🏆 - 旅程的终点](<./zui-zhong-zhang-lu-cheng-de-zhong-dian.md>)

    