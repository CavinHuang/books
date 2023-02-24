
---
title: 基于 JavaScript 开发灵活的数据应用
---

## 简介
使用 JavaScript、ECharts、Vue.js 等开发工具，完成各种数据结构的处理、转换、动态过滤以及数据可视化的开发。

## 说明
## 小册介绍

> 作为前端工程师，你知道怎么在 Web 应用中对数据进行处理，甚至应用上统计学乃至数据挖掘技术吗？
> 
> 作为大数据工程师或机器学习工程师，你知道怎么让你的数据应用变得更加生动直观吗？
> 
> 作为数学、统计学甚至大数据专业的学生，你懂得怎么让自己的专业知识变成通俗易懂的实际应用吗？

大数据的概念正变得越来越受人关注，从原本只是工程师之间的讨论话题，变成了如今与人们生活息息相关的事物。从电视新闻展示国民大数据统计分析结果，到智能手机、智能手表上自己的健康数据，我们可以在各种地方看到各式各样的数据图表。

![charts](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/2/26/161cff7f42ddb30f~tplv-t2oaga2asx-image.image)

作为非统计部门、电视工作者的我们，还是开发更接地气的数据应用比较实际。而如今要快速开发高可用的应用程序，当选 Web 开发模式。事实上，在各种适用于不同场景的 Web 应用中，我们也能看到各种基于 Web 技术开发的数据图表。

[![chart](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/2/26/161cff7f3ffe1c5e~tplv-t2oaga2asx-image.image)](http://echarts.baidu.com/examples/editor?c=scatter-aqi-color)

上图为某月北京、上海和广州这三座城市所记录的 AQI 指数可视化图表，其中这份数据包含了 5 个不同的维度：城市、日期、AQI 指数、PM2.5 数值和二氧化硫数值，你可以点击图片，体验一下基于 ECharts 开发的交互性图表。

### 所以为什么要学习用 JavaScript 写数据应用？

得益于 HTML 和 CSS 的天作之合，Web 应用开发在 UI 表达能力上本就具有得天独厚的优势，而随后 SVG 和 Canvas API 的出现，更是让 Web 应用对于各种界面设计的表达如虎添翼。

虽然我们常说 DOM 渲染（HTML 和 CSS 的渲染）是 Web 应用性能上的一个短板，但是 SVG 和 Canvas 的主要开发目标是一个可以使用 JavaScript 进行内容操作的单独“图片”，其性能可以满足一些对性能要求较高的需求，比如游戏（在 Web 游戏应用中，绝大部分的实现基础为 Canvas），以及本小册后半部分会重点讲解的数据可视化图表。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/9/162aab0e252ba28b~tplv-t2oaga2asx-image.image)

再者 Web 应用开发是目前为止开发周期最短、最容易达成目标、最易于上手的应用开发手段之一。加之如今 Web 游戏、互联网金融、第三方云服务等应用场景的迅速发展，对数据的处理、可视化的需求会越来越多。

## 作者介绍

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/10/17162dd47bd05536~tplv-t2oaga2asx-image.image)

**小问** 多领域开发者，主要为 Web 开发、大数据与机器学习领域。目前在阿里巴巴淘系技术部负责营销页面答投平台的开发，做过一些数据相关的开源项目，如 [iwillwen/mindb](http://github.com/iwillwen/mindb)。多次以讲师身份参加国内外多个 Web 领域开发大会，如 JSConf China，并著有《实战 ES2015：深入现代 JavaScript 应用开发》一书。

## 名人推荐

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/9/162aaacfeb63cbc1~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/9/162aaad27022a383~tplv-t2oaga2asx-image.image)

## 你会学到什么？

- JavaScript 对基本数据类型的操作
- JavaScript 对复杂数据结构的操作
- 复杂数据结构的处理技巧
- 基于 ECharts 可视化工具库对简单数据和复杂数据进行图表绘制
- 结合 Vue.js 为数据流添加动态处理功能

## 你需要准备一些什么？

- 🔑 有一定的编程语言基础
- 🔢 对高中数学的基本理解
- ❤️ 一颗热爱数据科学的心

## 适宜人群

- 有意向大数据、数据挖掘等领域发展的前端开发工程师
- 希望开发出更为实用的数据科学应用的数据科学相关工程师
- 正在学习计算机、数学、统计学甚至大数据数据科学的学生

## 小册代码

本小册的代码将会在 GitHub 仓库 [iwillwen/data-book-codes](https://github.com/iwillwen/data-book-codes) 中更新，其中每一节后提供的习题也可以在该仓库的 Issues 页面中进行回答交流。

## 购买须知

1.  本小册为图文形式内容服务，共计 22 节，上线时间为 2018 年 4 月 12 日；
2.  文章已全部更新完毕；
3.  购买用户可享有小册永久的阅读权限；
4.  购买用户可进入小册微信群，与作者互动；
5.  掘金小册为虚拟内容服务，一经购买成功概不退款；
6.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
7.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [基于 JavaScript 的数据应用开发概述](<./ji-yu-javascript-de-shu-ju-ying-yong-kai-fa-gai-shu.md>)
- [基本数据处理 · 字符串和数字](<./ji-ben-shu-ju-chu-li-zi-fu-chuan-he-shu-zi.md>)
- [基本数据处理 · 对象字面量](<./ji-ben-shu-ju-chu-li-dui-xiang-zi-mian-liang.md>)
- [基本数据处理 · 数组](<./ji-ben-shu-ju-chu-li-shu-zu.md>)
- [基本数据处理 · 基本统计](<./ji-ben-shu-ju-chu-li-ji-ben-tong-ji.md>)
- [复杂数据处理 · 使用序列](<./fu-za-shu-ju-chu-li-shi-yong-xu-lie.md>)
- [复杂数据处理 · 树形](<./fu-za-shu-ju-chu-li-shu-xing.md>)
- [复杂数据处理 · 关系图谱](<./fu-za-shu-ju-chu-li-guan-xi-tu-pu.md>)
- [复杂数据处理 · 结构转换（上）](<./fu-za-shu-ju-chu-li-jie-gou-zhuan-huan-shang-.md>)
- [复杂数据处理 · 结构转换（下）](<./fu-za-shu-ju-chu-li-jie-gou-zhuan-huan-xia-.md>)
- [基于ECharts 的基础表达性统计图表 · 散点图与折线图](<./ji-yu-echarts-de-ji-chu-biao-da-xing-tong-ji-tu-biao-san-dian-tu-yu-zhe-xian-tu.md>)
- [基于ECharts 的基础表达性统计图表 · 柱状图与饼图](<./ji-yu-echarts-de-ji-chu-biao-da-xing-tong-ji-tu-biao-zhu-zhuang-tu-yu-bing-tu.md>)
- [复杂数据图表 · 箱线图](<./fu-za-shu-ju-tu-biao-xiang-xian-tu.md>)
- [复杂数据图表 · 关系图谱](<./fu-za-shu-ju-tu-biao-guan-xi-tu-pu.md>)
- [复杂数据图表 · 树形图](<./fu-za-shu-ju-tu-biao-shu-xing-tu.md>)
- [数据分析师的好帮手 · 辅助线](<./shu-ju-fen-xi-shi-de-hao-bang-shou-fu-zhu-xian.md>)
- [更高维度的数据可视化图表](./geng-gao-wei-du-de-shu-ju-ke-shi-hua-tu-biao.md)
- [动态数据应用 · 用数据流概念重新理解数据转换](<./dong-tai-shu-ju-ying-yong-yong-shu-ju-liu-gai-nian-chong-xin-li-jie-shu-ju-zhuan-huan.md>)
- [动态数据应用 · 使用 Vue.js 为数据流添加动态转换过滤器](<./dong-tai-shu-ju-ying-yong-shi-yong-vue.js-wei-shu-ju-liu-tian-jia-dong-tai-zhuan-huan-guo-lu-qi.md>)
- [动态数据应用 · 应用高大上的动态数据流（上）](<./dong-tai-shu-ju-ying-yong-ying-yong-gao-da-shang-de-dong-tai-shu-ju-liu-shang-.md>)
- [动态数据应用 · 应用高大上的动态数据流（下）](<./dong-tai-shu-ju-ying-yong-ying-yong-gao-da-shang-de-dong-tai-shu-ju-liu-xia-.md>)

    