
---
title: 可视化入门：从 0 到 1 开发一个图表库
---

## 简介
理论结合实践，从 0 开发一个图表库，带你入门数据可视化

## 说明
## 作者介绍

![作者介绍-1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42f5aba4c992436f808dc31ce88f42f0~tplv-k3u1fbpfcp-watermark.image?)

- **万木**：蚂蚁体验技术部前端工程师，AntV G2 栈的核心维护者，多次在 IEEE Vast Challenge，ChinaVis Challenge 等数据分析挑战赛中获得优异成绩。喜欢写代码给自己带来的创造的快乐，开源爱好者，在 [GitHub](https://github.com/pearmini) 有一些简单有意思的项目。

- **逍为**：蚂蚁体验技术部 / 数智团队前端开发，前网易游戏测试开发。目前主要负责内部 BI 产品 DeepInsight 的迭代，以及 AntV 开源统计图表 G2 技术栈的研发。 [GitHub](https://github.com/hustcc) 上开源了诸多有趣可用的开源项目。

- **新茗**：蚂蚁体验技术部前端工程师，AntV 核心开发者，负责开源统计图表 G2、G2Plot 的研发，以及蚂蚁集团 BI 产品 DeepInsight 的迭代，从图表库到 BI 产品的一体化建设，对商业智能领域的数据可视化建设有较丰富经验。

- **福晋**：蚂蚁体验技术部前端工程师，AntV 核心开发者，从事可视分析相关业务以及可视化基建，负责过多个大型项目的前端交付，擅长小程序、可视化、H5、RN 等领域。

- **云极**：蚂蚁体验技术部/数智团队，主要从事于 BI 产品地理数据可视分析前端研发。曾混迹于 GIS 数字孪生应用创业公司，主要负责 WebGIS 研发工程师的前端架构研发。技术兴趣爱好广泛并热心技术分享，目前沉迷于可视化与 Golang 方向。

- **缨缨**：蚂蚁体验技术部前端工程师，负责蚂蚁集团 BI 产品 DeepInsight 表相关业务迭代。AntV 核心开发者，AntV S2 技术栈负责人。

## 小册介绍

在这个以数据为核心竞争力的时代，数据可视化已经和机器学习、统计学等热门领域一样，成为了其中最核心的分析工具之一。在 2020 年初新冠病毒爆发之时，各种疫情可视化工具如及时雨一般出现，在展现疫情情况、分析传播趋势等领域立下了汗马功劳，也间接拯救了千千万万脆弱的生命。

但是这个年轻却又古老的领域却依然小众，市面上也很少能见到同时将理论和实践兼顾得很好的课程。高校里面的数据可视化课程将理论讲得异常精彩，却又少了足够的实践让学生能够学以致用。

- [D3](https://github.com/d3/d3)、[ECharts](https://echarts.apache.org/zh/index)、[G2](https://g2.antv.vision/zh)、[Vega](https://github.com/vega/vega)、[Vega-lite](https://github.com/vega/vega-lite) 都可以做可视化，到底选择哪个？
- D3 学习曲线那么高，怎么入门？
- ECharts 和 G2 一个是配置式的 API，一个是函数式 API，到底有哪些区别？

网络上的教程尤其青睐将实践部分的数据渲染、性能优化等问题讲得透透彻彻，却又忽略了数据转换在数据可视化流程举足轻重的地位。就比如我们在开发迭代 G2 的过程中，也发现用户们有许多的问题。

- Quantile，Threshold，Quantize 比例尺有啥区别？
- 希望生成的坐标刻度是 6 个，但是为什么却生成了 8 个？
- nice 操作到底有什么用？

这些都是因为大家对数据可视化中的图形语法不了解，那为了图形语法能够普罗大众，我们简化了 API，增加了 G2Plot 项目。不仅如此，我们也希望能有机会来提升社区同学对可视化的理解广度，这是这本小册的初衷。

在这本小册中，我们为了解决大家学习数据可视化的痛点问题，将围绕着“可视化苏菲的世界”这个具体的数据分析任务展开。

首先你会学到 Tamara Munzner 的 《Visualization Analysis \& Design》这本书中如下的一个**数据分析的模型**，并且用它去完成完成“苏菲的世界”中可视化的设计。这里需要注意的因为小册子的篇幅有限，下面的内容不会深入讲解，只会讨论大部分相对重要一点的，剩余的简单提及。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb805da7d5694aa18f840ebb4da36c80~tplv-k3u1fbpfcp-zoom-1.image)

然后，我们会了解**前端工程的以下方面，并且搭建我们的开发环境**。同样因为篇幅有限，下面提到的工具不会深入细讲，但是会讲解各自的主要作用和基本使用方法，了解最核心的东西，并且给出深入学习的资源。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2268461fa8c4865906dd0e450de5a27~tplv-k3u1fbpfcp-watermark.image?)

接着，**我们会基于搭建好的开发环境，按照测试驱动的方式，从 0 到 1（不借助任何第三方框架）开发完成基于以下架构图的图形语法图表库：Sparrow** \[[Github](https://github.com/sparrow-vis/sparrow)、[官网](https://sparrow-vis.github.io/#/introduction)\]。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/723fb646abdc4a96acc3e50010abf1e8~tplv-k3u1fbpfcp-zoom-1.image)

**Sparrow 支持通过 JavaScript Object 去描述一个图表**。比如如下去绘制一个条形图。

```js
import { plot } from "@sparrow-vis/sparrow";

const data = [
  { genre: "Sports", sold: 275 },
  { genre: "Strategy", sold: 115 },
  { genre: "Action", sold: 120 },
  { genre: "Shooter", sold: 350 },
  { genre: "Other", sold: 150 },
];

// 通过 JavaScript Object 描述图表
const chart = plot({
  data,
  type: "interval",
  encodings: {
    x: "genre",
    y: "sold",
    fill: "genre"
  }
});

document.getElementById("container").appendChild(chart);
```

最后结果如下：

![example](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9859be57fb91422c8989cc6d9bca737a~tplv-k3u1fbpfcp-zoom-1.image)

同时使用 Sparrow 也有能力绘制出手绘风格的图表：

```js
import { plot } from "@sparrow-vis/sparrow";
import { createPlugin } from "@sparrow-vis/rough-renderer"

const data = [
  { genre: "Sports", sold: 275 },
  { genre: "Strategy", sold: 115 },
  { genre: "Action", sold: 120 },
  { genre: "Shooter", sold: 350 },
  { genre: "Other", sold: 150 },
];

const chart = plot({
  data,
  renderer: createPlugin(), // 使用手绘风格的渲染器插件
  type: "interval",
  encodings: {
    x: "genre",
    y: "sold",
    fill: "genre"
  }
});

document.getElementById("container").appendChild(chart);
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85ea1f4c167144798413f47e56215b14~tplv-k3u1fbpfcp-zoom-1.image)

Sparrow 可以支持常用的基本图表的绘制：条形图、堆叠条形图、分组条形图、饼图、折线图、面积图、热力图等，也可以和第三方插件配合绘制：词云、地图、力导向图等比较复杂的可视化。

![](https://gw.alipayobjects.com/mdn/rms_38d0f7/afts/img/A*qmh5SaBGuywAAAAAAAAAAAAAARQnAQ)

这之后，我们会学习统计图表可视化、图可视化、地理可视化的基本方法，并且用我们的 Sparrow 和下图中的 AntV 技术栈的相关工具去完成“可视化苏菲的世界”这个任务。下面的工具我们都会简单介绍，对于 AntV 技术栈的一些工具我们会在可视化工程中介绍基本用法：G2 \& G2Plot，L7 \& L7Plot，G6。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cf392a7f2e7446db0b6c0a6df534a53~tplv-k3u1fbpfcp-zoom-1.image)

最后，我们将得到如下的一些可视化结果（只展示了部分）。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30f7fdc76e1e4661972b4e23fd501598~tplv-k3u1fbpfcp-zoom-1.image)

学习理论最好的方法就是用理论去动手解决一个实际的问题，了解一个“轮子”的最好方式就是去写一个“轮子”\!

## 你会学到什么

- 了解数据可视化的流程；
- 知道怎么基于浏览器的 Canvas 和 SVG 绘图技术绘制条形图；
- 掌握图形语法，利用它去简化绘图流程；
- 从 0 到 1 开发一个基于图形语法的图表库：[Sparrow](https://github.com/sparrow-vis/sparrow)；
- 知道如何让一个图表库从 0 到 1，也知道怎么让它 1 再到 2。

## 适宜人群

- 在玲琅满目的可视化工具中不知道选择哪个来解决你的问题；
- 对可视化和数据分析感兴趣，在日常学习或者工作中常常和它们接触，想深入了解；
- 对前端或者前端工程化感兴趣，想开发一个完整的前端库来练练手，熟悉其中的主要流程；
- 想参与 G2 等开源社区的建设，却不知道从哪开始看代码；
- 想参加 Vast Challenge ，ChinaVis Challenge 等数据分析的挑战赛，但是无从下手；
- 想加入我们，但是怕通不过面试。

## 购买须知

1.  本小册为图文形式内容服务，共计 18 节；
2.  全部文章预计 2022 年 02 月 25 日前更新完成；
3.  购买用户可享有小册永久的阅读权限；
4.  购买用户可进入小册微信群，与作者互动；
5.  掘金小册为虚拟内容服务，一经购买成功概不退款；
6.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
7.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [开篇：可视化介绍](./开篇-可视化介绍.md)
- [基础：数据分析模型](./基础-数据分析模型.md)
- [基础：绘制一个条形图](./基础-绘制一个条形图.md)
- [基础：可视化工具概览](./基础-可视化工具概览.md)
- [实战：搭建开发环境](./实战-搭建开发环境.md)
- [实战：渲染引擎 - Renderer](<./实战-渲染引擎 - Renderer.md>)
- [实战：比例尺 - Scale](<./实战-比例尺 - Scale.md>)
- [实战：坐标系 - Coordinate](<./实战-坐标系 - Coordinate.md>)
- [实战：几何图形 - Geometry](<./实战-几何图形 - Geometry.md>)
- [实战：辅助组件 - Guide](<./实战-辅助组件 - Guide.md>)
- [实战：统计 - Statistic](<./实战-统计 - Statistic.md>)
- [实战：视图 - View](<./实战-视图 - View.md>)
- [实战：渲染流程 - Plot](<./实战-渲染流程 - Plot.md>)
- [分析：表格带你浅尝数据分析](./分析-表格带你浅尝数据分析.md)
- [分析：压抑的中世纪发生了什么？](./分析-压抑的中世纪发生了什么？.md)
- [分析：哲学家之间在讨论啥“八卦”？](./分析-哲学家之间在讨论啥“八卦”？.md)
- [分析：抽象的哲学问题又有谁来解？](./分析-抽象的哲学问题又有谁来解？.md)
- [分析：哲学流派的“组织架构”是啥样的？](./分析-哲学流派的“组织架构”是啥样的？.md)
- [分析：西方哲学中心的“迁徙之旅”](./分析-西方哲学中心的“迁徙之旅”.md)
- [总结：回顾过去，展望未来](./总结-回顾过去，展望未来.md)

    