
# 实战-渲染流程 - Plot
---

经过前面的学习，我们已经把渲染引擎和低级可视化模块开发完了，也了解了对应的可视化概念。那么这一章我们就把已经开发好的这些模块串起来，完成“从0到1开发一个图表库”的这一任务。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/723fb646abdc4a96acc3e50010abf1e8~tplv-k3u1fbpfcp-zoom-1.image)

这一章我们将从 Sparrow 的 API 介绍开始，然后梳理渲染流程，这之后再开始介绍关键代码。这一章可以说是整个实战环节的画龙点睛之笔，那么接下来就让我们开始吧！

## API 设计

首先我们来看看 API 设计，也就是了解一下该如何使用我们最后完成 Sparrow。

Sparrow 最终只暴露出一个函数：`plot`。该函数根据指定的 options 渲染图表并且返回一个渲染好的 SVG 元素。函数签名可以用 TypeScript 简单地如下定义：

```js
plot(options: SPSpec): SVGSVGElement
```

至于这个 options 的结构用 TypeScript 可以简单地如下定义：

```ts
type SPSpec = SPNode;

type SPNode = {
  type?: string;
  data?: any[],
  scales?: Recode<ChannelTypes, Scale>,
  transforms?: Transform[],
  statistics?: Statistic[],
  encodings?: Recode<ChannelTypes, Encode>,
  guides?: Recode<ChannelTypes, Guide>,
  styles?: Record<string, string>
  children?: SPNode[];
  paddingLeft?: number,
  paddingRight?: number,
  paddingTop?: number,
  paddingBottom?: number,
}
```

可以发现：它是一个嵌套的结构，描述的是上一章提到的视图树。

每一个节点的 type 除了上一章提到的 layer、col、row 这些**容器节点**之外，还可以是所有几何元素的类型：interval、area、text 等等，这些被称为**视图节点**，当然上一章提到的 facet 节点也算是一个视图节点。容器节点可以有 children 属性，但是视图节点不能有 children 属性。

下面对上面的节点的一些属性进行解释：

- data：任意类型的数据。
- scales：比例尺的配置，比如：`{type: 'ordinal', range: ['red', 'yellow']}`
- transforms：数据预处理配置，比如：`data => data.sort()`
- statistics：统计函数配置，比如：`{type: 'stackY'}`
- encodings：指定几何元素的每个通道用什么编码，比如：`{x: 'genre', y: 'sold'}`
- guides：指定辅助组件的配置，比如：`{type: 'axisY', display: false}`
- styles：指定几何元素的样式，比如：`{strokeWidth: 10}`
- paddingLeft：几何图形区域到整个图表区域的左边距。
- paddingRight：几何图形区域到整个图表区域的右边距。
- paddingTop：几何图形区域到整个图表区域的上边距。
- paddingBottom：几何图形区域到整个图表区域的下边距。

对于容器节点来说，上面的属性对其没有效果，但是会被后代中视图节点继承。比如下面两种写法其实是等价的。

```js
// 可以理解为是下面的语法糖
const options = {
  type: 'layer',
  encodings: {x: 'name', y: 'value'}
  children: [
    {type: 'point'},
    {type: 'line'}
  ],
}

const options = {
  type: 'layer',
  children: [
    // encodings 这个配置继承于父亲
    {type: 'point', encodings: {x: 'name', y: 'value'}},
    {type: 'line', encodings: {x: 'name', y: 'value'}}
  ],
}
```

有了上面的介绍，接下来来看一个简单的例子。

```js
const sports = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];
```

如果我们要用 Interval 去可视化上面的数据，那么我们将如下使用 Sparrow：

```js
import { plot } from '@sparrow-vis/plot';

plot({
  type: 'interval', // 指定节点的种类是 interval
  data: sports, // 指定数据
  encodings: {
    x: 'genre', // 指定 x 通道由数据的 genre 属性决定
    y: 'sold', // 指定 y 通道由数据的 sold 属性决定
  },
});
```

最后的效果如下图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7da9b55aa0584523b7a5bdbd5570c765~tplv-k3u1fbpfcp-watermark.image?)

接下来我们来看一个稍微复杂一点的例子，同样是上面的例子，这次我们来绘制一个饼图。

```js
import { plot } from '@sparrow-vis/plot';

plot({
  type: 'interval',
  data: sports,
  // 将数据的 sold 字段转换成百分比形式
  transforms: [(data) => {
    const sum = data.reduce((total, d) => total + d.sold, 0);
    return data.map(({ genre, sold }) => ({ genre, sold: sold / sum }));
  }],
  // 使用两个坐标系变换：transpose 和 polar
  coordinates: [{ type: 'transpose' }, { type: 'polar' }],
  // 使用一个统计变换 stackY
  statistics: [{ type: 'stackY' }],
  // 设置 x 通道使用的比例尺的 padding 属性
  // interval 的 x 通道必须使用 band 比例尺，所以有 padding 属性
  scales: {
    x: { padding: 0 },
  },
  guides: {
    x: { display: false }, // 不显示 x 方向的坐标轴
    y: { display: false }, // 不显示 y 方向的坐标轴
  },
  encodings: {
    y: 'sold', // y 通道和 sold 属性绑定
    fill: 'genre', // fill 通道和 genre 属性绑定
  },
  // 设置饼图的样式
  styles: {
    stroke: '#000', 
    strokeWidth: 2,
  },
})
```

最后的效果如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a83a2a45f0d24cd0819c06c21aa1baee~tplv-k3u1fbpfcp-watermark.image?)

了解完了 API 设计，接下来就来看看渲染流程，看看 plot 函数是如何将配置转换成 SVG 元素的，或者是如何把数据转换成像素点的。\(更多的使用方式可以参看这里的[测试代码](https://github.com/sparrow-vis/sparrow/blob/main/__tests__/plot/plot.spec.js)）。

**在开始看代码之前，大家可以先去 Sparrow 的[官网](https://sparrow-vis.github.io/#/introduction)看看案例，了解一下 Sparrow 的具体使用方式，然后可以先想想自己会如何去实现。** 这之后再读代码的话可以做到事半功倍的效果。

## 渲染流程

Sparrow 整个的渲染流程主要分为下面几个阶段：

- 预处理：视图节点继承祖先容器节点的属性，同时合并同一区域的属性。
- 获取通道值：
  - 通过 transforms 函数转换数据，获得需要可视化的表格数据。
  - 根据编码 encodings 配置从数据中去提取几何图形每个通道对应的值。
  - 通过 statsitcs 函数处理获得的通道值，获得最后真正被可视化出来的通道值。
- 创建比例尺：根据当前的通道值以及 scales 配置去推断对应比例尺 种类，定义域和值域的值。
- 创建辅助组件：根据推断出来的比例尺以及 guides 配置去创建对应的辅助元素。
- 创建坐标系：根据 coordinates 配置去创建对应的坐标系。
- 绘制：
  - 绘制辅助组件。
  - 绘制几何元素。

我们通过上面饼图的例子来展示一下这个流程。最开始的数据如下：

```js
const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];
```

首先数据会经过如下 transforms 函数的转换，这里面的转换会被合成一个函数。

```js
plot({
  // ...
  transforms: [(data) => {
    const sum = data.reduce((total, d) => total + d.sold, 0);
    return data.map(({ genre, sold }) => ({ genre, sold: sold / sum }));
  }]
  // ...
})
```

这一步之后的数据如下：

```js
const transformedData = [
  { genre: 'Sports', sold: 0.2722772277227723 },
  { genre: 'Strategy', sold: 0.11386138613861387 },
  { genre: 'Action', sold: 0.1188118811881188 },
  { genre: 'Shooter', sold: 0.3465346534653465 },
  { genre: 'Other', sold: 0.1485148514851485 },
];
```

数据转换之后将会根据 encodings 去提取数据。

```js
plot({
  // ...
  encodings: {
    y: 'sold', // y 通道和 sold 属性绑定
    fill: 'genre', // fill 通道和 genre 属性绑定
  },
  // ...
})
```

根据如上的配置会得到如下的结果：

```js
const values = {
  // fill 和 'genre' 字段绑定，所以提取出来是 'genre' 字段的值
  fill: ['Sports', 'Strategy', 'Action', 'Shooter', 'Other'],
  // 没有指定 x 通道的值，默认为 0
  x: [0, 0, 0, 0, 0],
  // 没有指定 x 通道的值，默认为 0
  y1: [0, 0, 0, 0, 0],
  // y 和 'sold' 字段绑定，所以提取出来是 'sold' 字段的值
  y: [0.2722772277227723, 0.11386138613861387, 0.1188118811881188, 0.3465346534653465, 0.1485148514851485]
};
```

这之后就会就会经过 statistics 去处理数据。

```js
plot({
  // ... 
  statistics: [{ type: 'stackY' }],
  // ...
})
```

处理后的数据如下，可以发现 y 方向的通道已经被堆叠过了。这个阶段获得的 `transformedValues` 就是获得的通道值。

```js
const transformedValues = {
  // fill 和 'genre' 字段绑定，所以提取出来是 'genre' 字段的值
  fill: ['Sports', 'Strategy', 'Action', 'Shooter', 'Other'],
  // 没有指定 x 通道的值，默认为 0
  x: [0, 0, 0, 0, 0],
  // 没有指定 x 通道的值，默认为 0
  y1: [0, 0.2722772277227723, 0.38613861386138615, 0.504950495049505, 0.8514851485148515],
  // y 和 'sold' 字段绑定，所以提取出来是 'sold' 字段的值
  y: [0.2722772277227723, 0.38613861386138615, 0.504950495049505, 0.8514851485148515, 1]
};
```

接下来就是根据获得的通道值创建比例尺了。

```js
plot({
  // ... 
  scales: {
    x: { padding: 0}
  },
  // ...
})
```

下面只展示了根据通道值和 scales 配置推断出来的比例尺比较重要的属性。这里的推断规则会后面介绍。

```js
const scaleDescriptors = {
  // stroke 和 fill 通道都是用 color 比例尺
  color: {
    domain: ['Sports', 'Strategy', 'Action', 'Shooter', 'Other'],
    range: ['#5B8FF9', '#5AD8A6', /* ... */]
    type: 'ordinal',
  },
  // x 方向的通道（x1、x）都使用 x 比例尺
  x: {
    domain: [0],
    range: [0, 1],
    type: 'band'
  },
  // y 方向的通道（y1、y）都使用 y 比例尺
  y: {
    domain: [0, 1],
    range: [1, 0],
    type: 'linear'
  }
}
```

这之后会根据 scaleDescriptors 和 guides 的配置去推断 guidesDescriptors。

```js
plot({
  // ... 
  guides: {
    x: { display: false }, // 不显示 x 方向的坐标轴
    y: { display: false }, // 不显示 y 方向的坐标轴
  },
  // ...
})
```

最后得到的 guidesDescriptors 如下：

```js
const guidesDescriptors = {
  // color 通道的辅助组件是 legendSwatches
  // x 和 y 因为都设置为 display: false 了，所以不现实
  color: {
    domain: ['Sports', 'Strategy', 'Action', 'Shooter', 'Other']
    label: 'genre',
    type: 'legendSwatches',
    x: 45, 
    y: 0
  }
}
```

这之后创建坐标系，绘制辅助组件和几何图形就没有太多需要说的地方了。接下来就进入我们的写代码环节：因为 Plot 这个模块一共有 500 多行代码，所以就不全部在文章中讲解了，这里只会讲解一些比较重要的部分。

## plot

我们首先从 plot 函数开始，该函数会预处理我们的配置，然后解析描述的视图树，将嵌套的视图树拍平成一个视图树组，最后通过 plotView 函数绘制每一个视图。

```js
// src/plot/plot.js

import { createViews } from '../view';
import { createRenderer } from '../renderer';
import { createCoordinate } from '../coordinate';
import { create } from './create';
import { inferScales, applyScales } from './scale';
import { initialize } from './geometry';
import { inferGuides } from './guide';
import { bfs, identity, map, assignDefined } from '../utils';

export function plot(root) {
  // 创建渲染引擎
  const { width = 640, height = 480, renderer: plugin } = root;
  const renderer = createRenderer(width, height, plugin);
  
  // 将配置从容器节点流向视图节点
  flow(root);
  
  // 将视图树转换成视图树组
  const views = createViews(root);
  for (const [view, nodes] of views) {
    const { transform = identity, ...dimensions } = view;
    const geometries = [];
    const scales = {};
    const guides = {};
    let coordinates = [];
    const chartNodes = nodes.filter(({ type }) => isChartNode(type));
    // 合并同一区域的所拥有视图的配置
    for (const options of chartNodes) {
      const {
        scales: s = {},
        guides: g = {},
        coordinates: c = [],
        transforms = [],
        paddingLeft, paddingRight, paddingBottom, paddingTop,
        ...geometry
      } = options;
      assignDefined(scales, s); // 合并 scales 配置
      assignDefined(guides, g); // 合并 guides 配置
      // 合并 padding 等配置
      assignDefined(dimensions, { paddingLeft, paddingRight, paddingBottom, paddingTop });
      if (c) coordinates = c; // 使用最后一个视图的坐标系
      // 收集该区域的所有几何图形
      geometries.push({ ...geometry, transforms: [transform, ...transforms] }); 
    }
    // 绘制每一个区域
    plotView({ renderer, scales, guides, geometries, coordinates, ...dimensions });
  }
  // 返回 SVG 元素
  return renderer.node();
}
```

```js
// src/plot/plot.js

function flow(root) {
  bfs(root, ({ type, children, ...options }) => {
    if (isChartNode(type)) return;
    if (!children || children.length === 0) return;
    const keyDescriptors = [
      'o:encodings', 'o:scales', 'o:guides', 'o:styles',
      'a:coordinates', 'a:statistics', 'a:transforms', 'a:data',
    ];
    for (const child of children) {
      for (const descriptor of keyDescriptors) {
        const [type, key] = descriptor.split(':');
        if (type === 'o') {
          child[key] = { ...options[key], ...child[key] };
        } else {
          child[key] = child[key] || options[key];
        }
      }
    }
  });
}
```

```js
// src/plot/plot.js

function isChartNode(type) {
  switch (type) {
    case 'layer': case 'col': case 'row': return false;
    default:
      return true;
  }
}
```

## plotView

接下来我们来看看 plotView 函数，该函数是真正把图表渲染出来的地方。

在这个流程中有两个函数比较关键：第一个就是 `initialize` 函数，这是获取每个几何图形通道值的地方；第二就是 `inferScales` 这个函数，这是给每个通道选择比例尺的地方，只要比例尺选择对了，那么绘制的几何图形就基本上没有问题了。

```js
// src/plot/plot.js

function plotView({
  renderer,
  scales: scalesOptions,
  guides: guidesOptions,
  coordinates: coordinateOptions,
  geometries: geometriesOptions,
  width, height, x, y,
  paddingLeft = 45, paddingRight = 45, paddingBottom = 45, paddingTop = 60,
}) {
  // 获得每个通道的值
  const geometries = geometriesOptions.map(initialize);
  const channels = geometries.map((d) => d.channels);
  
  // 推断 scales 和 guides
  const scaleDescriptors = inferScales(channels, scalesOptions);
  const guidesDescriptors = inferGuides(scaleDescriptors, { x, y, paddingLeft }, guidesOptions);

  // 生成 scales 和 guides
  const scales = map(scaleDescriptors, create);
  const guides = map(guidesDescriptors, create);

  // 生成坐标系
  const transforms = inferCoordinates(coordinateOptions).map(create);
  const coordinate = createCoordinate({
    x: x + paddingLeft,
    y: y + paddingTop,
    width: width - paddingLeft - paddingRight,
    height: height - paddingTop - paddingBottom,
    transforms,
  });

  // 绘制辅助组件
  for (const [key, guide] of Object.entries(guides)) {
    const scale = scales[key];
    guide(renderer, scale, coordinate);
  }

  // 绘制几何元素
  for (const { index, geometry, channels, styles } of geometries) {
    const values = applyScales(channels, scales);
    geometry(renderer, index, scales, values, styles, coordinate);
  }
}
```

那么接下来我们就一起来看看 `initialize` 和 `inferScales` 这两个函数。

## initialize

`initialize` 主要流程代码如下，具体的实现可以参考注释。

```js
// src/plot/geometry.js

import { compose, indexOf } from '../utils';
import { inferEncodings, valueOf } from './encoding';
import { create } from './create';

export function initialize({
  data,
  type,
  encodings: E = {},
  statistics: statisticsOptions = [],
  transforms: transformsOptions = [],
  styles,
}) {
  // 执行 transform
  // 把所有的 transform 都合成一个函数
  const transform = compose(...transformsOptions.map(create));
  const transformedData = transform(data);
  const index = indexOf(transformedData);

  // 执行 valueOf
  // 从表格数据里面提取各个通道的值
  const encodings = inferEncodings(type, transformedData, E);
  const constants = {};
  const values = {};
  for (const [key, e] of Object.entries(encodings)) {
    if (e) {
      const { type, value } = e;
      if (type === 'constant') constants[key] = value;
      else values[key] = valueOf(transformedData, e);
    }
  }

  // 执行 statistics
  // 把所有的 statistics 都合成一个函数
  const statistic = compose(...statisticsOptions.map(create));
  const { values: transformedValues, index: I } = statistic({ index, values });

  // 创建通道
  const geometry = create({ type });
  const channels = {};
  for (const [key, channel] of Object.entries(geometry.channels())) {
    const values = transformedValues[key];
    const { optional } = channel;
    if (values) {
      channels[key] = createChannel(channel, values, encodings[key]);
    } else if (!optional) {
      throw new Error(`Missing values for channel:${key}`);
    }
  }

  // 返回处理好数据
  return { index: I, geometry, channels, styles: { ...styles, ...constants } };
}
```

其中比较关键的函数之一是 `inferEncodings`这个函数，这个函数一方面会推断出我们编码的种类，一方面会补全我们的编码信息。下面我们将通过两个例子来说明。

首先我们来看看对编码种类的推断。编码本质上也是一个函数，从数据里面提取一列数据。在 Sparrow 里面的编码有三种类型：

 -    field：从数据中提取对应字段的值。
 -    transform：对数据的每一条数据进行转换获得一列值。
 -    value：返回一个常量数组。

```js
// src/plot/encoding

export function valueOf(data, { type, value }) {
  if (type === 'transform') return data.map(value); // transform encoding
  if (type === 'value') return data.map(() => value); // value encoding
  return data.map((d) => d[value]); // field encoding
}
```

具体参考下面这个例子，最后的效果如下图。

```js
const sports = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];

const options = {
  type: 'interval',
  data: sports,
  encodings: {
    x: 'genre', // field encoding
    y: d => d.sold * 2, // transform encoding
    fill: 'steelblue' // value encoding
  },
}
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8804cd5b459a45468015ee2465e755bd~tplv-k3u1fbpfcp-watermark.image?)

具体的推断方法可以查看[这里](https://github.com/sparrow-vis/sparrow/blob/main/src/plot/encoding.js)的 `inferType` 函数。

接下来我们来看看补全编码信息。在上面绘制条形图的时候，我们对图表的描述如下：

```js
const options = {
  type: 'interval',
  data: sports,
  encodings: {
    x: 'genre',
    y: 'sold',
  },
}
```

可以发现在描述中我们是希望通过一个 interval 去可视化数据，并且指定了 interval 的 x 和 y 通道，但是 interval 的 y1 通道却没有指定！这个时候我们就需将这个 y1 通道的编码信息推断出来，最后的结果等于下面的图表描述：

```js
const options = {
  type: 'interval',
  data: sports,
  encodings: {
    x: 'genre',
    y: 'sold',
    y1: 0, // 推断出来 y1 为 0
  },
}
```

不同的几何图形有不同的推断规则，具体可以查看[这里](https://github.com/sparrow-vis/sparrow/blob/main/src/plot/encoding.js)的 `inferEncodings` 函数。

## inferScales

了解了 `initialize` 函数，我们接下来看看 `inferScales`，**这个函数可以说是整个渲染流程的灵魂**。因为通过前面的学习我们了解到：可视化就是一个数据到图形的过程，而从数据属性到视觉属性需要比例尺去映射。

创建比例尺是一个比较难以理解和麻烦的过程，是使用 D3 等底层可视化组件的过程中需要考虑的问题。但是对于上层可视化框架来说，这部分是要自动完成的的。

而比例尺的创建无非就三个步骤：

- 确定比例尺类型
- 确定值域
- 确定定义域

具体的实现如下：

```js
// src/plot/scale.js

import { firstOf, group, lastOf, map, defined } from '../utils';
import { interpolateColor, interpolateNumber } from '../scale';
import { categoricalColors, ordinalColors } from './theme';

export function inferScales(channels, options) {
  const scaleChannels = group(channels.flatMap(Object.entries), ([name]) => scaleName(name));
  const scales = {};
  for (const [name, channels] of scaleChannels) {
    const channel = mergeChannels(name, channels);
    const o = options[name] || {};
    const type = inferScaleType(channel, o); // 推断种类
    scales[name] = {
      ...o,
      ...inferScaleOptions(type, channel, o),
      domain: inferScaleDomain(type, channel, o), // 推断定义域
      range: inferScaleRange(type, channel, o), // 推断值域
      label: inferScaleLabel(type, channel, o), 
      type,
    };
  }
  return scales;
}
```

推断比例尺最核心的就是推断比例尺的类型，这里参考 \[Observable Plot\]\(<https://github.com/observablehq/plot/blob/main/src/scales.j> s\) 里面的推断方法，具体的实现如下。

```js
// src/plot/scale.js

function inferScaleType(channel, options) {
  const { name, scale, values } = channel; // 当前通道信息
  const { type, domain, range } = options; // options.scales 里面的配置
  
  // 如果通道本身有默认的 scale 种类就是返回当前的种类
  // 比如 interval 的 x 的 scale 就是 band
  if (scale) return scale;
  
  // 如果用户在配置中声明了 type 就返回当前 type
  // 比如 scales: { type: log }
  if (type) return type;
  
  // 如果配置中的 range 或者 domain 的长度大于了 2 就说明是离散比例尺
  // 比如 scales: {fill: {range: ['red', 'yellow', 'green']}}
  if ((domain || range || []).length > 2) return asOrdinalType(name);
  
  // 根据配置中 domain 的数据类型决定 scale 的种类
  if (domain !== undefined) {
    if (isOrdinal(domain)) return asOrdinalType(name);
    if (isTemporal(domain)) return 'time';
    return 'linear';
  }
  
  // 根据 channel 对应的 values 决定 scale 的种类
  if (isOrdinal(values)) return asOrdinalType(name);
  if (isTemporal(values)) return 'time';
  if (isUnique(values)) return 'identity';
  return 'linear';
}

function asOrdinalType(name) {
  if (isPosition(name)) return 'dot'; // 就是 point 比例尺
  return 'ordinal';
}

function isPosition(name) {
  return name === 'x' || name === 'y';
}

function isOrdinal(values) {
  return values.some((v) => {
    const type = typeof v;
    return type === 'string' || type === 'value';
  });
}

function isTemporal(values) {
  return values.some((v) => v instanceof Date);
}

function isUnique(values) {
  return Array.from(new Set(values)).length === 1;
}
```

本章的渲染流程比较重要的代码就在这里介绍完了，完整的代码可以在[这里](https://github.com/sparrow-vis/sparrow/tree/main/src/plot)浏览，同样也可以通过[这里](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/plot)的测试代码来验证代码的正确性。

## 小结

到目前为止，我们的 Sparrow 就全部开发完成了，没有借助任何依赖，不到 2000 行代码，可以绘制出平时使用的 80\% 的图表（具体的图表可以参考[这里](https://github.com/sparrow-vis/sparrow/blob/main/__tests__/plot/plot.spec.js)的测试代码），是不是很有成就感？（发布我们的图表库到 NPM 可以参考这篇[文章](https://juejin.cn/post/7052307032971411463)）

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/879e056ccea346e1bca703561b752506~tplv-k3u1fbpfcp-watermark.image?)

在实战部分，我们从渲染引擎开始，到一个个低级可视化绘制模块，最后再到本章的 Plot 模块的开发。这个过程我们不仅了解了更多可视化概念，这了解了一些编程方面的知识（比如函数式编程等）。

实战完了接下来就进入我们的分析环节，看看用我们的 Sparrow 能否回答之前提出的问题！
    