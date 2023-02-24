
# 分析-压抑的中世纪发生了什么？
---

上一章我们学习了如何用 Sparrow 和 [AntV S2](https://s2.antv.vision/) 去绘制表格，简单了解了一下我们分析任务中的数据。这一章我们将完成其中一个任务：**揭露中世纪是一个压抑的时代**，也就是去看看压抑的中世纪到底发生了什么？

本章我们先简单回顾一下之前学习的视觉编码理论，并且进行一些比较深入了解。这之后我们会用 Sparrow 基于提到的理论去完成相应的可视化，最后给大家介绍如何用信息图展示我们的结果。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73146a5c03984ad4a3851191fb60f1dc~tplv-k3u1fbpfcp-zoom-1.image)

## 视觉编码理论基础

- visual encodings 视觉编码是可视化设计的核心环节之一。
- 如何视觉编码？即让 mark 标记和控制其外观的 channel 视觉通道进行正交组合。

《Visualization Analysis \& Design》中，作者专门使用一章节介绍 mark 和 channel ：mark 标记是描述项目或链接的「基本几何元素」，channel 通道控制 mark 的「外观」。下面我们就以这本书的内容作为理论指导，介绍如何设计更有效、更友好的可视化。

简单回顾一下 mark 标记的类型：点、线、面。channel 通道类型：位置、颜色、形状、角度、尺寸。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66597bb2e02249a6afbcd14737c2e36d~tplv-k3u1fbpfcp-zoom-1.image)

channel 通道的有效性取决于它的类型：在感知上「magnitude 程度」通道与「ordered 有序」数据很匹配，而「identity 特征」通道与「categorical 分类」数据很匹配。下图总结了 channel 的有效性排行情况。我们可以看到左列排名前几为：同比例尺的位置通道、不同比例尺的位置通道、长度、角度、面积等等，右列则是空间区域、色相、运动、形状。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a77304e485994d6aa9328d6a94dcf427~tplv-k3u1fbpfcp-zoom-1.image)

上述 channel 的有效性排行还包括了5个维度的考虑：**准确性、可辨别性、可分离性、凸显性**和**分组能力**。我们进一步了解可视化设计还应该注意的维度：

- 准确性：Cleveland 和 McGill 提供了每种通道类型的感知准确性的排名（针对 magnitude 程度通道）：**这个排名是和上面图的左列排名相对应**。同为：同比例尺的位置通道、不同比例尺的位置通道、长度、角度、面积。Heer 和 Bostock 后来的工作发现长度和角度的准确性大致相等。

- 可辨别性：通道的程度差异是否是可感知的？如果程度差异很小，视觉上是很难区分差异的。因此应该确保该通道的**每个 bin 是有区分度的分段**。例如线的宽度：图下中用三个程度（500、250、100）来展示线宽度的分段范围。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d758c2be54c4aff919ac43debeacf53~tplv-k3u1fbpfcp-zoom-1.image)

- 可分离的：如下图所示，\*\*左1图是一对完全可分离的通道：位置和色相。\*\*我们可以很容易地看到点的位置分布及其颜色。左2图是大小和色相的组合。我们很容易根据圆的大小对其分类，但是色相在大小映射的混淆下不那么容易被区分。宽度和高度的组合衍生出了大小这个视觉通道，也变得更难被区分了。红色与绿色的组合则更甚。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5a355c52f6e4d45a664c6d69a0a9560~tplv-k3u1fbpfcp-zoom-1.image)

- 凸显性：许多通道具备凸显性，包括（a）倾斜，（b）大小，（c）形状，（d）接近，和（e）阴影方向。\(f\) 平行线的效果没有前者们佳。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3472281e5347454b98eb9875f007b29f~tplv-k3u1fbpfcp-zoom-1.image)

- 分组能力：如何设计才能展示分组的效果呢？
  - 方式一：**使用链接型的 mark 标记。** containment 包含区的分组性高于 connection 连接线。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/590948d62bd347deb70f1a2b3a7d09cb~tplv-k3u1fbpfcp-zoom-1.image)

- 方式二：**使用 identity 特征型通道。** identity 通道的感知分组不像使用 connection 或 containment 标记那样效果强烈，但好处是不会增加额外的杂乱。
- 方式三：**使用“亲近性”原则进行分组。** 即同组元素放置同一个区域里。

通过上述的知识，我们了解到了如何更有效地利用 channel 来展示可视化。但光是了解 mark 和 channel 还是不够的，设计还要从最根本的数据类型出发。

## 针对表格型数据的视觉编码理论

表格型数据无处不在，《苏菲的世界》的数据当然也包括了它。

那么我们如何对「表格型数据」进行可视化设计呢？包括两个方面：「arrange 排布」数据以及「map 映射」数据。

- 「arrange 排布」表格型数据：下图显示了四种设计选择。一是直接表达值。二是三种位置排布方式：对区域的分散、排序和对齐。三是轴的方向：矩形的、平行的或径向的。四是布局密度：密集的、空间填充型的。我们可以看到，他们都**与空间通道（位置）相关。**

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45c73364394a46d79e82b329c13825ff~tplv-k3u1fbpfcp-zoom-1.image)

- 「 map映射 」数据：颜色以及其他通道也是视觉编码的重要组成部分。这些与第一部分的 channel 介绍是差不多的，我们会在下面的分析问题中，将这些理论应用到可视化设计中去。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b83a5cbc84af426480d26ce805cbc4ee~tplv-k3u1fbpfcp-zoom-1.image)

## 问题分析

还记得小册子第二章的分析任务吗？我们可以用 Sparrow 来解决下面前两个问题：

- 揭露中世纪是一个压抑的时代。（Present）
- 哲学家们的年龄分布如何？有多少哲学家的寿命超过了 40 岁？（Discover）
- 进一步探索：研究哲学的国家随时间发生了变化吗？最小寿命的哲学家是谁？感兴趣的哲学家都发表了什么样的观点？（Discover）

上面两个问题可以换个思路提问：时代和哲学家寿命之间的**关系是**怎样的？这个问题可以侧面反映出哲学家在时代中的**分布情况**，同时又展现了哲学家的寿命情况（**异常值**）。

## 可视分析

_**第一步：准备数据，认识数据**_

根据想要了解的内容，我们从《苏菲的世界》中获取了关于哲学家信息的数据（[Github](https://github.com/sparrow-vis/visualize-sophie-world)）：

```javascript
const rawData = [
  {
    "points": ["水是万物之源。"],
    "words": [{
        "word": "水是",
        "weight": 11.739204307083542
    }, {
        "word": "之源",
        "weight": 9.23723855786
    }, {
        "word": "万物",
        "weight": 7.75434839431
    }],
    "name": "泰利斯",
    "lifespan": [-624, -546],
    "country": "希腊",
    "id": 66
	},
	...
]
```

观察数据后，我们知道「时代」和「哲学家的寿命」都可以从字段 lifespan 得来。将数据进行预处理一下，添加 born 出生年份和 age 年龄的维度： ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8b29be61f25469395ec295028d25663~tplv-k3u1fbpfcp-zoom-1.image)

```javascript
const data = rawData.map(datum => {
  const { lifespan } = datum;
  return {
    ...datum,
    born: lifespan[0],
    age: lifespan[1] - lifespan[0],
  }
})
```

**_第二步：视觉编码_**

现在数据和想要的维度已经有了，那么我们可以用什么图表来展示数据呢？

- 思路：考虑维度的类型和数量（what），结合目标任务（why），进而选择「排布 arrange」方式，接着完善「mark」+「channel」映射（how），形成最终的图表。
- 例子1：如果想查看两个具有数值型维度的组合结果（what），如观察相关性或关系（why），首先针对都是数值型的维度，对应直接表达值（arrange：express value）这种排布方式，即数值型维度被映射到沿轴分布的位置，且 mark 为一个点，因此用散点图来展示；
- 例子2：如果想组合一个分类型维度和一个数值型维度（what），以比较各类型的值大小（why），可以使用元素对其布局（arrange：align），即将分类维度在轴上排开排布，再用长度通道映射数值型维度。对应的 mark 是 line。因此用柱形图来表示；
- 例子3：如果我们要同时展示三个维度（why），维度分别是两个分类型+一个数值型（what），则让两个分类型维度分别沿着行、列对齐分布（arrange：align），mark 为 area，将数值型维度编码成颜色，因此热力图是合适的。

根据本文提供的两个属于「数值型」 的维度（born、age），通过下表分析可以得出散点图这个设计方案。

| **charts** | scatter plot |
| --- | --- |
| **What：Data** | 表格型数据：born 和 age 都是为数值型的数据维度。 |
| **How：Encode** | 1\. arrange：express value（横、纵方向）；2. mark：point ；3. channel：position on common scale |
| **Why：Task** | 关系：时代和哲学家寿命之间的关系；分布：哲学家的寿命分布；异常值：哲学家寿命的异常值 |

_**第三步：数据可视化**_

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82241c24e1a140599f561c38addb4e87~tplv-k3u1fbpfcp-watermark.image?)

```javascript
(async () => {
  const response = await fetch(
    "https://gw.alipayobjects.com/os/bmw-prod/d345d2d7-a35d-4d27-af92-4982b3e6b213.json"
  );
  const data = await response.json();
  return sp.plot({
    data,
    // 简单处理一下数据
    transforms: [
      (data) =>
        data.map((d) => ({
          born: +new Date(d.lifespan[0], 0, 1),
          age: d.lifespan[1] - d.lifespan[0],
          name: d.name,
        })),
    ],
    type: "point",
    paddingTop: 30,
    guides: {
      x: {
        formatter: (d) => {
          const year = new Date(d).getFullYear();
          return ((year / 50) | 0) * 50;
        },
      },
    },
    encodings: {
      x: "born",
      y: "age",
    },
  });
})();
```

_**第四步：数据洞察**_

- 上述的图表印证了我们的第一个观点：中世纪是一个压抑的时代。中世纪的范围是-5～1500年，从图中看出很少有哲学家被提及。当时的主流观点是，人类只是自然界的一部分，他们更关注上帝而不是自己。
- 不同时期的哲学家大部分都是比较长寿的，在 60～90 岁之间。
- 有一位哲学家小于 40 岁。

## 丰富表现力

上文我们通过位置的通道映射，用散点图印证了「抑郁的时代」，了解了时代与哲学家年龄的关系以及年龄的情况。但是，这个图表显然不是令人印象深刻的。并且 Sparrow 还不能进一步做交互来发现细节信息。

接下来，我们使用 g2 ，采用**隐喻的手法**进一步丰富视觉效果，并增加一些交互，回答这些问题：研究哲学的国家随时间发生了变化吗？最小寿命的哲学家是谁？感兴趣的哲学家都发表了什么样的观点？

我们把每一位哲学家比作一朵花，来营造「百花齐放」的氛围。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4306885761474e0bb98f23a66981f919~tplv-k3u1fbpfcp-zoom-1.image)

最终效果图如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73146a5c03984ad4a3851191fb60f1dc~tplv-k3u1fbpfcp-zoom-1.image)

对应的映射设计思路如下：我们基于原有的散点图来扩展设计。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78e7f5ef71b84ee58c51339ea89bc16a~tplv-k3u1fbpfcp-zoom-1.image)

首先 born 和 age 的映射不变，然后让颜色映射不同的国家，并增加元素花瓣来隐喻哲学家的观点：

| **数据属性** | **视觉标记 mark** | **视觉通道 channel** | **隐喻** |
| --- | --- | --- | --- |
| born | 花蕊 \(point\) | position | 所在时间轴位置反应出生的时间 |
| age | 花蕊 \(point\) | position | 高度比喻寿命长短 |
| points | 花瓣 | / | 一个花瓣比喻一个观点，花瓣越多，产出的观点越多 |
| country | 花瓣 | color | 不同的花瓣颜色=不同种类，比喻不同的国家 |

实现如下：我们需要用 g2 的 registerShape 方法来自定义一些图形。先来实现一个简单的花蕊（散点）+花瓣：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2703cf9309be4230a74a4af82d4c4598~tplv-k3u1fbpfcp-zoom-1.image)

```javascript
// 1. 自定义 shape
G2.registerShape('point', 'glyph', {
  draw(cfg, container) {
    cfg.points = this.parsePoints(cfg.points);
    const group = container.addGroup();
    // 花瓣
    createPetals(group, cfg);
    // 花蕊
    createStamen(group, cfg);
    return group;
  }
});

// 2. 创建图表
const chart = new G2.Chart({
  container: 'container',
  autoFit: false,
  width: 700,
  height: 400,
});

// 3. 绑定数据，调整比例尺
chart
  .data(data)
  .scale('born', {
    tickCount: 10,
    nice: true,
  })
  .scale('age', {
    nice: true,
    max: 100
  });

// 4. 绘制点，绑定维度（包括组件样式调整）
chart.point()
  .shape('circle')
  .position('born*age')
	.color('#7693eb')

chart.legend('age', false);
chart.axis('age', {
  grid: null
});

// 5. 渲染图表
chart.render();
```

对应的 createPetals 和 createStamen 函数：

```javascript
/**
 * 创建花瓣
 * @param group 元素容器
 * @param cfg 每个 item 的 cfg 配置信息
 */
function createPetals(group, cfg) {
  const { data, color } = cfg;
  const { points } = data;
  const maxCount = points.length === 2 ? 5 : points.length;
  const angleUnit = (Math.PI * 2) / maxCount;
  const { x, y } = cfg.points[0];
  const petalSize = 25;
  for (const index in points) {
    const petal = group.addShape("path", {
      attrs: {
        path: `
        M${x} ${y}
        C${x - petalSize / 2.7} ${y - petalSize / 2.5}
        ${x - petalSize / 2.7} ${y - petalSize / 1.5}
        ${x} ${y - petalSize / 1.2}
        C${x + petalSize / 2.7} ${y - petalSize / 1.5}
        ${x + petalSize / 2.7} ${y - petalSize / 2.5}
        ${x} ${y}
        `,
        shadowBlur: 50,
        shadowColor: color,
        fillOpacity: 1,
        fill: `l(90) 0:${color} 0.2:${color} 1:#fff`
      }
    });
    petal.rotateAtPoint(x, y, angleUnit * index);
  }
}

/**
 * 创建花蕊
 * @param group 元素容器
 * @param cfg 每个 item 的 cfg 配置信息
 */
function createStamen(group, cfg) {
  const { points, color } = cfg;
  const { x, y } = points[0];
  group.addShape('circle', {
    attrs: {
      r: 2,
      x,
      y,
      stroke: color,
      fillOpacity: 1,
      shadowColor: '#eee',
      shadowBlur: 5,
      fill: color,
      lineWidth: 0,
    }
  });
}
```

继续添加映射与隐喻：花茎与叶子。剩下的代码思路是差不多的，详见\([CodeSandBox](https://codesandbox.io/s/jolly-mopsa-739hf?file=/src/index.js)\)：

| **数据属性** | **视觉标记 mark** | **视觉通道 channel** | **隐喻** |
| --- | --- | --- | --- |
| born | 花蕊 | position | 所在时间轴位置反应出生的时间 |
| age | 花蕊 \(point\)、花茎 | position、length | 花蕊高度、花茎长度比喻寿命长短 |
| points | 花瓣 | / | 一个花瓣比喻一个观点，花瓣越多，产出的观点越多 |
| country | 花瓣 | color | 不同的花瓣颜色=不同种类，比喻不同的国家 |
| words | 叶子 | / | 一片叶子比喻一个关键词，表示叶子与花瓣不可分的关系 |
| weight | 叶子 | size | 关键词权重比喻叶子的养分 |

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82bec5b753ef4c6fad4eeda11880564c~tplv-k3u1fbpfcp-zoom-1.image) 接下来，增加 tooltip 以查看细节： ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ec4ebb1b96944d3bff1f16d70581472~tplv-k3u1fbpfcp-zoom-1.image)

回看该 channel 的设计如何结合视觉编码理论基础：

- 从channel 准确性角度来说，针对数值型维度，使用了排名 1 的同比例尺的位置通道；针对分类型维度，“国家”属性使用空间区域映射可能是更合适的，由于散点图限制，结合隐喻使用了排名 2 的色相通道。
- 由于映射通道较多，需要关注通道的可分离性，因此使用了最合适的位置 + 颜色的组合。
- size 通道会影响 color 通道的效果。例如看不清颜色或者容易忽略花瓣的数量，尤其是颜色较多的情况下。所以在此之前，撤回了对花瓣的大小通道映射。

数据洞察：

- 各国哲学家分阶段出现：国家从最初的雅典、希腊，转变成意大利，再到英法德。
- 交互探索：寿命最短的是耶稣，仅34岁；
- 交互探索：笛卡尔、康德、祁克果、马克思贡献的观点最多；观点内容包含了关于上帝、人类、物质的话题。
- 权重最大的关键词“事物”来自亚里士多德。

## 小结

这一章和大家一起用“朴素”和“炫酷”的方式完成了：“**揭露中世纪是一个压抑的时代**”这一个任务，这里主要涉及的是**表格数据**的可视化方法。下一章我们将去看看“哲学家之间在讨论啥‘八卦’”，去看看文本可视化的其中一种方法。

> 参考：Munzner, Tamara. _Visualization analysis and design_. CRC press, 2014.
    