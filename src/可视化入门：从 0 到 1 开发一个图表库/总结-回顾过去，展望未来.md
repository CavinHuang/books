
# 总结-回顾过去，展望未来
---

《可视化入门：从 0 到 1 开发一个图表库》到这里就快结束了，这一章我们来盘点一下我们学到了什么，还有什么地方是需要改进的。小册子一共分为4大部分：开篇、基础篇、实战篇和分析篇，我们接下来就分别来看看。

## 开篇

首先在开篇我们通过下面这两张图认识了数据可视化，知道了数据可视化就是：“**利用人眼的感知能力对数据进行交互的可视表达以增强认知的技术，将不可见或难以直接显示的数据转化为可感知的图形、符号、颜色、 纹理等，增强数据识别效率，传递有效信息。**”

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c6950be1078485a94bbdf8667939fa5~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3eb0045335644b59c8a8528197f3e85~tplv-k3u1fbpfcp-watermark.image?)

同时了解到人眼能提高数据分析效率的原因主要有两点：

- **在几种感官系统中，视觉系统获得信息是最高效的。**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe9592d6bc62461198e3cf96a95c84af~tplv-k3u1fbpfcp-watermark.image?)

- **图片可以加速人们查找和识别信息，因为信息会和空间信息相关联。**

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87ebdfa9cb1a481f8e5663025dff9e14~tplv-k3u1fbpfcp-watermark.image?)

这之后我们知道了不是所有的可视化都是好的，真正好的可视化具有四个特点：**新颖，充实，高效和美感。**

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1caa426f7ac47a4aaba715440f1232c~tplv-k3u1fbpfcp-watermark.image?)

但是凡事都有例外，信息图过多的装饰能让用户提高参与感、让用户更难忘让它也渐渐进入人们的视线中。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d2a3b1c8a484d3a98bfbe7d48835581~tplv-k3u1fbpfcp-watermark.image?)

最后我们知道了现在是一个大数据时代，分析数据获得信息和知识有助于帮助我们做决策，而数据可视化是其中一个不可替代的手段。

进一步来讲，数据可视化主要有三大分支：科学可视化、信息可视化和可视分析学，而日常生活中我们接触最多就是信息可视化。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaa9fd0e0b5f4cb38b6c2a2def24bc20~tplv-k3u1fbpfcp-watermark.awebp)

信息可视化在工作中的具体场景又会有：基于统计图表的可视化、移动端可视化、图可视化和地理可视化。

开篇主要让大家大体了解了一下数据可视化，接下来就进入了基础篇。

## 基础篇

在基础篇首先是给大家介绍了《Visualization Analysis \& Design，Tamara Munzner》提到的数据分析模型：What、Why、How，并且引入了“可视化苏菲的世界”这个任务。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93dab1c5186546a6bd4d84613079477f~tplv-k3u1fbpfcp-watermark.image?)

这之后给大家介绍了如何用 Canvas2d 和 SVG 绘制一个条形图，知道了它们的基本使用方法。但同时发现绘制起来过于繁琐，所以准备开发一个小工具 Sparrow 来加快这个过程。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca62d68ad63f45f88208957a0a27b60a~tplv-k3u1fbpfcp-watermark.image?)

在开发我们的小工具之前，我们先了解了社区上一些成熟的可视化工具，知道了它们的优点和缺点以及适用的场景。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fff4706e9f6f4c92baf8f726ee1b2608~tplv-k3u1fbpfcp-watermark.awebp?)

然后确定在“可视化语法”这一层去设计我们的 Sparrow 的 API，并且它的架构如下图。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c79d9edbde94357aed1adc1db0bf7eb~tplv-k3u1fbpfcp-watermark.image?)

这部分的最后我们根据下图去搭建了 Sparrow 的开发环境。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7f0e9257d6848debd48b226a6dfae5e~tplv-k3u1fbpfcp-watermark.image?)

## 实战篇

接下来就进入了实战篇，首先我们基于 SVG 封装了一个**渲染引擎**，用于提高图形元素的管理能力。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2cb1d69390c4588a72ca36606976aac~tplv-k3u1fbpfcp-zoom-1.image)

然后学习并且开发了**比例尺**，了解了数据属性是如何映射到视觉属性上的。**比例尺在可视化图表中非常重要，因为它是数据和视觉元素的桥梁。**

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bfe0184a30542d48ed3cf2fac7ec3e5~tplv-k3u1fbpfcp-watermark.image?)

了解完比例尺，我们学习了**函数形式编程**，知道了它相对于面向对象编程的优势；然后就开发了**坐标系**，其主要用于将归一化的数据转换成画布坐标数据。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acf15a94ecfe4d149943b434c8fceddf~tplv-k3u1fbpfcp-watermark.image?)

经过这两章比较抽象的数据处理学习之后，我们进入了直观形象的**几何图形**的学习：首先简单了解了一下视觉编码理论，然后看了看几何图形是如何把处理好的数据绘制成真正的 SVG 元素的。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cc3dd6db10145669ddcb71c04028c40~tplv-k3u1fbpfcp-watermark.image?)

几何图形之后就进入了**辅助组件**的学习，知道了它们可以加快人们理解几何图形的速度，也知道了它们和比例尺、坐标系之间的关系。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb4b259a27f84f39b2aea04d75b555b5~tplv-k3u1fbpfcp-watermark.image?)

这之后我们学习了**统计**，了解了统计函数是如何改变几何图形的位置和外观的。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0852cfa07d6449a1870cac2d6a4ef8a8~tplv-k3u1fbpfcp-watermark.image?)

学习完统计我们了解**视图**，看看其是如何绘制多视图和多几何元素的图表的。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9726351c3774cce82962a9304cecec6~tplv-k3u1fbpfcp-watermark.image?)

最后我们学习了**渲染流程**，把上面的模块串了起来，最后完成了 [Sparrow](https://sparrow-vis.github.io/#/) 的开发。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/879e056ccea346e1bca703561b752506~tplv-k3u1fbpfcp-watermark.awebp?)

## 分析篇

实战篇以后我们就进入了分析篇，不忘初心得开始完成我们最开始提出的分析任务。

对于我们的可视化设计，我们首先都用 Sparrow 去实现，发现总是有可以优化的空间，所以我们也介绍了 [AntV 技术栈](https://antv.vision/)的去完成相同的可视化设计。这个过程也接触了 [D3](https://d3js.org/) 的一些工具。

而我们的可视化设计也是涉及了基于**统计图表的可视化**、**图可视化**和**地图可视化。** 下面是我们的一些成果。

| 类型 | Sparrow + D3 | AntV |
| --- | --- | --- |
| 表格 | ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b70b52e51ea14613b4319788fe549021~tplv-k3u1fbpfcp-watermark.image?) | ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06342994cc2349deb16e396e39f120f9~tplv-k3u1fbpfcp-watermark.image?) |
| 散点图 | ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9a87220bea746c5844b5e0bc8eb0bc3~tplv-k3u1fbpfcp-watermark.image?) | ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7bfab54d2f54182898de9550a4a3cd0~tplv-k3u1fbpfcp-watermark.image?) |
| 词云 | ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7086a23f5f104f57ab4a1f8d4a4904a5~tplv-k3u1fbpfcp-watermark.image?) | ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fe881b7cf9e409c86d8509746c24207~tplv-k3u1fbpfcp-watermark.image?) |
| 力导向图 | ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c734d44cbb214dff8c6d1a51e699922b~tplv-k3u1fbpfcp-watermark.image?) | ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96982aa38da342f48fb57976cdaaf5c1~tplv-k3u1fbpfcp-watermark.image?) |
| 圆形树状图 | ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b309e121d642426799f58f33c1a8e3cb~tplv-k3u1fbpfcp-watermark.image?) | ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73855aabf82c4ebeaebc48beac8cf57c~tplv-k3u1fbpfcp-watermark.image?) |
| 地图 | ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77fb0365cf6444a3afe5a5599b3df301~tplv-k3u1fbpfcp-watermark.image?) | ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cc8fffe86864ceb8dc81d43d366fffc~tplv-k3u1fbpfcp-watermark.image?) |

## 总结

总的来说，这次可视化之旅还是很有意思的，我们理论和实战结合地去认识了数据可视化。

当然，最重要的是：我们收获了一个基于图形语法的可视化库，虽然它不具备动画和交互能力，但是它已经帮助我们做了最重要的事情：**把数据映射为视觉元素**。

小册子到这里就结束了，但数据可视化的学习之旅才开始，强烈推荐大家去阅读下面的几本书和 [D3](https://d3js.org/) 的官网，你将获益匪浅！

- [D3](https://d3js.org/)
- Visualization Analysis \& Design，Tamara Munzner
- Beautiful.Visualization，Julie Steele/ Noah Iliinsky
- The Grammar of Graphics, 2nd Edition, Leland Wilkinson

同时还有一点需要说明，在宣传里提到我们团队主要负责 G2 的维护，但是细心的同学可能已经发现： **Sparrow 的 API 设计、代码架构以及渲染流程和 G2 却不太一样！** 这是因为 Sparrow 的设计其实是参考我们团队今年年底将要发布的 G2 5.0 版本。

G2 5.0 将是一个尽量兼容 4.0 的全新版本，在解决已有问题，提高绘图能力的之外（图形语法、动画语法和交互与发放），它的目标就是**优雅**：优雅的图表、优雅的文档以及优雅的代码！欢迎大家关注[这里](https://www.yuque.com/antv/g2-docs/about-g2-5.x)，除了了解我们的最新进展，还可以参与贡献。

我们有一个缺点，缺点优秀的你们，所以到时候不见不散。
    