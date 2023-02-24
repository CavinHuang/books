
---
title: 基于 Python 实现微信公众号爬虫
---

## 简介
爬虫基本原理、使用、抓包分析、存储数据、分析数据、数据可视化

## 说明
## 小册介绍

### 为什么要学爬虫？

爬虫是一个非常具有实践性的编程技能，它并不是程序员的专属技能，任何具有一定编程基础的人都可以学习爬虫，写个爬虫分析一下股票走势，写个爬虫YouTube下载视频，上链家爬个房源数据分析房价趋势，爬知乎、爬豆瓣、爬新浪微博、爬影评，爬虫有太多可以做的事情，人工智能时代，对数据的依赖越来越重要。

> 马云说：数据是新一轮技术革命最重要的生产资料。

数据主要的来源就是通过爬虫获取，通过爬虫获取数据可以进行市场调研和数据分析，可以作为机器学习和数据挖掘的原始数据，我们通过微信公众号爬虫得到的数据对新媒体内容提供运营策略。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/27/16096069a668a0a3~tplv-t2oaga2asx-image.image)

通过爬虫发现原来我4年前就在公众号写了文章，最近一年写了一百多篇，这些数据在微信平台是没法统计的，只有通过爬虫自己来统计分析。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/27/16093c99e7a08cd9~tplv-t2oaga2asx-image.image)

对小白来说，爬虫可能是一个很复杂的事情，现在我们带着一个具体的目标（以爬虫微信公众号文章为例），在目标的驱动下，跟着这本小册一步一步学会爬虫，同时，那些所谓的前置知识也在这个过程中学会了。在这本小册中，我将以手把手的方式教会你如何进行网络爬虫。

### 为什么要学Python

Python 作为一门连小学生都可以学会的语言，非常适合没有编程基础的同学。它可以让你更快的理解编程的思想，能让你体会到通过编程来解决问题带来快乐，它没有复杂的语法，最为接近伪代码的语言，没有繁琐的编译过程，也不需要你手动管理内存，类库非常丰富，解决各种问题都有很多现成的工具，无需自己造轮子。

> Python之父说：人生苦短，我用Python。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/27/160963c415dfa3d1~tplv-t2oaga2asx-image.image)

### 你会学到什么？

- 爬虫基本原理
- 爬虫工具 Requests 的基本使用
- 数据抓包分析工具 Fiddler 的基本使用
- MongoDB 数据库的基本使用
- 使用 Pandas 进行数据分析
- 使用 Matplotlib 进行数据可视化展示

### 你需要准备什么？

任何对网络爬虫感兴趣者，或者是对微信公众号数据感兴趣的人都可以参与到这本小册中来，你需要准备的东西包括：

 -    一台移动设备（Android或者iOS手机）
 -    一个可登录的微信帐号
 -    一台可以联网的电脑
 -    还需要会一点点Python编程基础

```text
温馨提醒
最后还是要声明一下，爬虫与反爬虫就像矛与盾，它们之间的较量是一场没有硝烟的战争，所以需要提醒广大爬友，爬取微信公众号文章数据过程中可能会受到微信服务器反爬虫机制的抵抗，虽然我没有遇到过明显地账号被限制的情况，但是我并不能保证你的微信号不会出现异常，在爬虫过程中，一定要控制好节奏，别惹怒了微信爸爸，为了保险起见，用小号进行测试爬虫是最安全的。
```

## 作者介绍

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/27/160970f401e7bb36~tplv-t2oaga2asx-image.image) 刘志军，Python 开发者，多年大型互联网公司工作经验，知乎 Python 话题活跃回答者，CSDN 公开课 讲师，在微信公众号「Python之禅」有4万+读者。

## 购买须知

1.  本小册为图文形式内容服务，共计 11 节，上线时间为 2017 年 12 月 22 日；
2.  购买用户可享有小册永久的阅读权限；
3.  购买用户可进入小册微信群，与作者互动；
4.  掘金小册为虚拟内容服务，一经购买成功概不退款；
5.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
6.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [微信公众号爬虫的基本原理](./wei-xin-gong-zhong-hao-pa-chong-de-ji-ben-yuan-li.md)
- [使用 Requests 实现一个简单网页爬虫](<./shi-yong-requests-shi-xian-yi-ge-jian-dan-wang-ye-pa-chong.md>)
- [使用 Fiddler 抓包分析公众号请求过程](<./shi-yong-fiddler-zhua-bao-fen-xi-gong-zhong-hao-qing-qiu-guo-cheng.md>)
- [抓取微信公众号第一篇文章](./zhua-qu-wei-xin-gong-zhong-hao-di-yi-pian-wen-zhang.md)
- [抓取微信公众号所有历史文章](./zhua-qu-wei-xin-gong-zhong-hao-suo-you-li-shi-wen-zhang.md)
- [将爬取的文章存储到MongoDB](./jiang-pa-qu-de-wen-zhang-cun-chu-dao-mongodb.md)
- [获取文章阅读数、点赞数、评论数、赞赏数](./huo-qu-wen-zhang-yue-du-shu-dian-zan-shu-ping-lun-shu-zan-shang-shu.md)
- [搭建数据分析环境：Anaconda、Jupyter Notebook](<./da-jian-shu-ju-fen-xi-huan-jing-anaconda-jupyter-notebook.md>)
- [利用 Pandas 对爬取数据进行分析](<./li-yong-pandas-dui-pa-qu-shu-ju-jin-xing-fen-xi.md>)
- [基于 Matplotlib 实现数据可视化展示](<./ji-yu-matplotlib-shi-xian-shu-ju-ke-shi-hua-zhan-shi.md>)
- [小结](./xiao-jie.md)

    