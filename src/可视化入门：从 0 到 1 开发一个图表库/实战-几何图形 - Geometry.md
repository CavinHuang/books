
# 实战-几何图形 - Geometry
---

上一章我们介绍了坐标系，了解了如何把经过比例尺映射后的位置属性，转换成可以绘制到画布上的点。那么接下来我们就来看看如何把转换之后的数据真正地画到画布上。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68663fd7ae66473ebc172cc73aca7c57~tplv-k3u1fbpfcp-zoom-1.image)

和前面一样，我们首先会从几何图形的相关理论讲起，然后在 Sparrow 中实现相关的部分。那么接下来废话不多说，就让我们开始吧。

## 几何图形理论

几何图形理论主要会介绍两个部分：几何图形（Geometry）和通道（Channel）。了解它们会对我们在选择视觉编码的时候会有帮助，就算再复杂的视觉编码也能被拆分成这两个部分去分析。

在可视化中，几何图形是根据数据集中的实体（Item）或者链接（Link）去绘制的图形元素，它还有一个同义词是标志（Mark）。通道又或者说视觉通道是用来控制几何图形的外观的。

下面是《Visualization Analysis \& Design》中的一个例子。\(a\)条形图中用条这个几何图形来编码两个属性，其中分类属性用条的水平位置通道编码，数值属性用条的竖直位置通道来编码。\(b\)散点图中用点这个几何图形来编码两个数值属性，它们分别用点的水平和竖直位置通道来编码。\(c\)用颜色通道来编码一个额外的分类属性。（d）用大小通道来编码一个额外的数值属性。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2039ec498d63406baaa5340ef22994f2~tplv-k3u1fbpfcp-watermark.image?)

不同的几何图形拥有不同的通道和外观，接下来我们会实现以下的几何图形。每个几何图形的特征和可以绘制的图表我们会在实现过程中介绍。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c02db69695cd4922b98ffee4105fa405~tplv-k3u1fbpfcp-watermark.image?)

下图中展示了一些常见的视觉通道，它们主要分为两类。数值通道（Magnitude Channel）会我们提供和有多少相关的信息，主要用来编码数值属性，比如下图中的位置（Position\)、大小（Size）和倾斜角度（Tilt）都是数值属性；特征通道（Identity Channel\)给我们提供是什么、在哪里相关的信息，主要用来编码分类属性，比如下图中的形状（Shape）和颜色（Color）。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1897de99008d43eab12b40a012c58f37~tplv-k3u1fbpfcp-watermark.image?)

在设计可视化的时候的一个难点就是：面对手中的数据，选择什么几何图形的什么通道去编码数据的属性，可以让可视化结果能更加高效地传递信息？这部分的内容我们会在后面的分析篇中涉及，接下来的主要内容是实现几何图形。

在代码中的几何图形和比例尺、坐标一样，都是一个函数，它会将处理好的数据转化成屏幕上的像素点，因为我们的渲染器是基于 SVG 的，所以其实是转换成对应的 SVG 元素。

需要注意的是：几何图形渲染的数据不是一个数组，而是一个对象。这个对象的每一个 key 都是该几何图形的一个通道，对应的 value 是一个数组，数组的每一个元素是数据和该通道绑定的属性的值。具体可以参考以下的例子。

```js
const data = [
  { x: 0.2, y: 0.3, color: 'red' },
  { x: 0.4, y: 0.8, color: 'yellow' },
  { x: 0.1, y: 0.6, color: 'blue' },
]

const values = {
  x: [0.2, 0.4, 0.1],
  y: [0.3, 0.8, 0.6],
  color: ['red', 'yellow', 'blue']
}
```

所有的几何图形都有如下的函数签名，同时也支持返回该几何图形拥有的通道。这些通道一方面可以对我们渲染的数据进行校验，另一方面可以在后面的开发中使用。

```js

/**
 * @param {Renderer} renderer 渲染引擎
 * @param {number []} I 索引数组
 * @param {[key:string] Scale} scales 每个通道用到的 scale
 * @param {[key:string]: number[]} values 每个通道需要渲染的值
 * @param {[key: string]: string} directStyles 图形的和通道无关的样式
 * @param {Coordinate} coordinate 使用的坐标系
 * @returns 渲染的 SVG 元素
 */
function geometry(renderer, I, scales, values, directStyles, coordinate) {}

geometry.channels = () => ({
  x: { name: 'x', optional: false },
  y: { name: 'y' }
})
```

接下来还是用散点图的例子来看看几何图形的用法。

```js
import { createLinear } from "./scale";
import { createCoordinate, transpose, cartesian } from './coordinate';
import { point } from './geometry';

// 希望绘制一个散点图来看下面数据的分布
const data = [
  { height: 180, weight: 150 },
  { height: 163, weight: 94 },
  { height: 173, weight: 130 }
];

// 将对应的值提取出来
const H = data.map(d => d.height);
const W = data.map(d => d.weight);
const I = data.map((_, index) => index);
const extent = d => [Math.min(...d), Math.max(...d)];

// 将数据的 height 映射为点的 x 属性（这里注意 range 是 [0, 1]）
const scaleX = createLinear({
  domain: extent(H),
  range: [0, 1]
});

// 将数据的 width 映射为点的 y 属性（这里注意 range 是 [0, 1]）
const scaleY = createLinear({
  domain: extent(W),
  range: [0, 1],
})

// 创建一个坐标系
const coordinate = createCoordinate({
  // 指定画布的起点和宽高
  x: 0,
  y: 0,
  width: 600,
  height: 400,
  // 一系列坐标系变换
  transforms: [
    transpose(),
    cartesian(),
  ]
});

// 使用比例尺映射数据
const values = {
  x: H.map(scaleX),
  y: W.map(scaleY)
};

const scales = {
  x: scaleX,
  y: scaleY
};

// 设置样式
const styles = {
  fill: 'none',
  stroke: 'steelblue'
};

// 绘制点
point(renderer, scales, values, styles, coordinate);
```

在正式进入写代码环节之前，对 SVG 的 path 元素不了解的可以先去[这里](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths)学习一下，因为接下来的部分很多地方都需要用到它。

## 创建通道

首先我们先来实现通道的创建，每一个通道都是一个对象，它拥有的属性如下。

| 属性名 | 描述 | 可选 | 默认值 |
| --- | --- | --- | --- |
| name | 属性的名字 | 否 | \- |
| optional | values 里面是否需要该属性对应的值 | 否 | `true` |
| scale | 需要使用的比例尺 | 是 |  |

```js
// src/geometry/channel.js

export function createChannel({
  name, 
  optional = true,
  ...rest
}) {
  return { name, optional, ...rest };
}
```

对于一个标准的几何元素来说，都具有以下的通道。

```js
// src/geometry/channel.js

export function createChannels(options = {}) {
  return {
    x: createChannel({ name: 'x', optional: false }), // x 坐标
    y: createChannel({ name: 'y', optional: false }), // y 坐标
    stroke: createChannel({ name: 'stroke' }), // 边框颜色
    fill: createChannel({ name: 'fill' }), // 填充颜色
    ...options,
  };
}
```

## 创建几何图形

创建完通道，我们就来看看几何图形的创建。对于每一个几何图形，我们需要定义它的通道和渲染函数，并且在渲染之前检查一下是否提供了需要的数据和正确的比例尺。

```js
// src/geometry/geometry.js

export function createGeometry(channels, render) {
  const geometry = (renderer, I, scales, values, styles, coordinate) => {
    for (const [key, { optional, scale }] of Object.entries(channels)) {
      // 只有必选的通道才会被检查
      if (!optional) {
        // 如果没有提供对应的值就抛出异常
        if (!values[key]) throw new Error(`Missing Channel: ${key}`);
        // 目前只用判断一下 band 比例尺
        if (scale === 'band' && (!scales[key] || !scales[key].bandWidth)) {
          throw new Error(`${key} channel needs band scale.`);
        }
      }
    }
    return render(renderer, I, scales, values, styles, coordinate);
  };

  // 将需要的通道返回
  geometry.channels = () => channels;

  return geometry;
}
```

知道了如何创建一个几何图形，那么接下来我们就来一起实现一些基本的几何图形。

## 点（Point）

首先我们从点（Point）开始，点这个几何图形最基本的使用就是散点图，同时也可以用于气泡图、图可视化等中。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce68efe8e9414caf9bf48c22ad258d6e~tplv-k3u1fbpfcp-watermark.image?)

除了基本的通道以外，点还有一个半径（r）通道，去控制点的大小。结合上面的使用方法，下面的代码应该就不难理解了。

```js
// src/geometry/point.js

import { createChannel, createChannels } from './channel';
import { circle } from './shape';
import { channelStyles } from './style';

export function point(renderer, I, scales, channels, directStyles, coordinate) {
  //  默认的一些属性
  const defaults = {
    r: 3,
    fill: 'none',
  };
  // 获取每一个通道经过比例尺映射的值
  const { x: X, y: Y, r: R = [] } = channels;
  
  // 通过索引去获得每一条数据各个通道的值
  return Array.from(I, (i) => {
    const { r: dr, ...restDefaults } = defaults;
    const r = R[i] || dr;
    return circle(renderer, coordinate, {
      ...restDefaults,
      // 元素的样式由直接指定的样式和通过通道指定的样式决定
      // 经过通道指定的样式就是和数据相关的样式
      // 后的优先级更高
      ...directStyles,
      ...channelStyles(i, channels),
      // 圆心的位置
      cx: X[i],
      cy: Y[i],
      r,
    });
  });
}

point.channels = () => createChannels({
  r: createChannel({ name: 'r' }),
});
```

```js
// src/geometry/style.js

// 获得由通道指定的样式
export function channelStyles(index, channels) {
  const { stroke: S, fill: F } = channels;
  // 只有当 stroke 和 fill 这两个通道被指定的时候才会有用
  return {
    ...(S && { stroke: S[index] }),
    ...(F && { fill: F[index] }),
  };
}
```

```js
// src/geometry/shape.js

// 绘制不同坐标系下面的圆
// 绘制圆的函数和渲染器里面绘制圆的区别在于
// 这里需要考虑坐标系
export function circle(renderer, coordinate, { cx, cy, r, ...styles }) {
  // 对圆心进行坐标系变换
  const [px, py] = coordinate([cx, cy]);
  return renderer.circle({ cx: px, cy: py, r, ...styles });
}
```

最后运行[测试代码](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/geometry/point.spec.js)会有以下的结果。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f10e77f7ed34208b7d203db1d9d9597~tplv-k3u1fbpfcp-watermark.image?)

## 文字（Text）

文字（Text）和点很像，只不过额外拥有旋转角度（rotate）、字体大小（fontSize）和内容（text）这些通道。文本一个典型用法就是词云图。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/622e4d98592a408c84150838c3d1ab39~tplv-k3u1fbpfcp-watermark.image?)

它的实现和点类似。

```js
// src/geometry/text.js

import { createChannel, createChannels } from './channel';
import { createGeometry } from './geometry';
import { text as shapeText } from './shape';
import { channelStyles } from './style';

const channels = createChannels({
  rotate: createChannel({ name: 'rotate' }),
  fontSize: createChannel({ name: 'fontSize' }),
  text: createChannel({ name: 'text', optional: false }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {
    rotate: 0,
    fontSize: 14,
  };
  const { x: X, y: Y, text: T, rotate: R = [], fontSize: FS = [] } = values;
  return Array.from(I, (i) => shapeText(renderer, coordinate, {
    ...directStyles,
    ...channelStyles(i, values),
    x: X[i],
    y: Y[i],
    rotate: R[i] || defaults.rotate,
    fontSize: FS[i] || defaults.fontSize,
    text: T[i],
  }));
}

export const text = createGeometry(channels, render);
```

```js
// src/geometry/shape.js

export function text(renderer, coordinate, { x, y, rotate, text, ...styles }) {
  const [px, py] = coordinate([x, y]);
  renderer.save();
  // 将词旋转
  renderer.translate(px, py);
  renderer.rotate(rotate);
  const textElement = renderer.text({ text, x: 0, y: 0, ...styles });
  renderer.restore();
  return textElement;
}
```

最后运行[测试代码](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/geometry/text.spec.js)会有以下的结果。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26d8347b3ebf405599607b015aba2286~tplv-k3u1fbpfcp-watermark.image?)

## 链接（Link）

实现完了文字，我们接下来看看链接（Link）。链接可以用来绘制下面图中的边。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6006663372384df0889c5c5e4c9c64ab~tplv-k3u1fbpfcp-watermark.image?)

因为链接本质上就是一条直线，所以它需要通过两个点来确定。我们已经通过通道 x 和 y 去确定一个点了，所以它还需要通过额外的 x1 和 x2 这两个通道去确定另外一个点。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44a6ad31cd014bc2b2a9c7d22542f4de~tplv-k3u1fbpfcp-watermark.image?)

具体的实现如下。

```js
// src/geometry/link.js

import { createChannels, createChannel } from './channel';
import { createGeometry } from './geometry';
import { link as shapeLink } from './shape';
import { channelStyles } from './style';

const channels = createChannels({
  x1: createChannel({ name: 'x1', optional: false }),
  y1: createChannel({ name: 'y1', optional: false }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {};
  const { x: X, y: Y, x1: X1, y1: Y1 } = values;
  return Array.from(I, (i) => shapeLink(renderer, coordinate, {
    ...defaults,
    ...directStyles,
    ...channelStyles(i, values),
    x1: X[i],
    y1: Y[i],
    x2: X1[i],
    y2: Y1[i],
  }));
}

export const link = createGeometry(channels, render);
```

```js
// src/geometry/shape.js

export function link(renderer, coordinate, { x1, y1, x2, y2, ...styles }) {
  const [p0, p1] = [[x1, y1], [x2, y2]].map(coordinate);
  return renderer.line({ x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], ...styles });
}
```

最后运行[测试代码](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/geometry/link.spec.js)会有以下的结果。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f2fa0c224a24b21a40f933884b2f568~tplv-k3u1fbpfcp-watermark.image?)

## 线（Line）

接下来我们来看看线（Line）这个几何图形的实现，线主要用来实现折线图或者雷达图等。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdd01dc047b641efbe7984b4e78984d8~tplv-k3u1fbpfcp-watermark.image?)

线是由多个点连接而成，连接它们的可以是直线，也可以是曲线，我们这里只实现通过直线来连接这些点。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a75d1a99343e4951be9db2e53bdec156~tplv-k3u1fbpfcp-watermark.image?)

线除了基本的通道之外，还有一个额外的 z 通道，用来对数据进行分组，从而绘制多条线，参考下面的例子。

```js
// z 通道表示种类
const values = {
  x: [0.1, 0.3, 0.5, 0.9, 0.2, 0.4, 0.6, 0.8],
  y: [0.2, 0.1, 0.9, 0.2, 0.9, 0.3, 0.5, 0.9],
  z: ['a', 'a', 'a', 'a', 'b', 'b', 'b', 'b'],
}

// 上面的 values 会被拆分成两部分数据
// 每部分数据对应一条线
// z 为 'a' 的值
const line1 = {
  x: [0.1, 0.3, 0.5, 0.9],
  y: [0.2, 0.1, 0.9, 0.2],
}

// z 为 'b' 的值
const line2 = {
  x: [0.2, 0.4, 0.6, 0.8],
  y: [0.9, 0.3, 0.5, 0.9]
}
```

理解了 z 通道，那么接下来的实现就不难理解了。

```js
// src/geometry/line.js

import { createChannel, createChannels } from './channel';
import { groupChannelStyles } from './style';
import { line as shapeLine } from './shape';
import { group } from '../utils';
import { createGeometry } from './geometry';

const channels = createChannels({
  z: createChannel({ name: 'z' }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {};
  const { x: X, y: Y, z: Z } = values;
  // 将索引 index 按照 z 通道的值分组
  // 每一个组对应一条直线
  // 如果 z 通道没有被指定，就默认一个分组，只绘制一条直线
  const series = Z ? group(I, (i) => Z[i]).values() : [I];
  return Array.from(series, (I) => shapeLine(renderer, coordinate, {
    ...defaults,
    ...directStyles,
    // 获该组的样式
    ...groupChannelStyles(I, values),
    X,
    Y,
    I,
    fill: 'none', // 直线是没有填充颜色的
  }));
}

export const line = createGeometry(channels, render);
```

```js
// src/geometry/style.js

// 获取这个组的第一个点的样式作为该条线的样式
export function groupChannelStyles([index], channels) {
  return channelStyles(index, channels);
}
```

```js
// src/utils/array.js

/**
 * 数据根据 key 分组
 * @param {T[]} array 需要分组的数据
 * @param {T => string} key 获得数据 key 的函数
 * @returns {Map<string, T>}
 * @example
 * const array = [
 *   {name:'a', value: 1},
 *   {name:'a', value: 2},
 *   {name:'b', value: 3}
 * ]
 * const groups = group(array, d => d.name);
 * groups // Map(2) {'a' => [{name: 'a', value:1}, {name: 'a', value: 2}], 'b' => [{name: 'b', value: 3}]}
 */
export function group(array, key = (d) => d) {
  const keyGroups = new Map();
  for (const item of array) {
    const k = key(item);
    const g = keyGroups.get(k);
    if (g) {
      g.push(item);
    } else {
      keyGroups.set(k, [item]);
    }
  }
  return keyGroups;
}
```

```js
// src/utils/index.js

export * from './array';
```

这里稍微提一下绘制一条线的函数：每一条线是一条 path，这条 path 的点由直线的点构成。在极坐标系下这条线需要闭合，所以需要将第一个点加入到最后。

```js
// src/geometry/shape.js

import { line as pathLine } from './d';

export function line(renderer, coordinate, { X, Y, I: I0, ...styles }) {
  const I = coordinate.isPolar() ? [...I0, I0[0]] : I0;
  const points = I.map((i) => coordinate([X[i], Y[i]]));
  const d = pathLine(points);
  return renderer.path({ d, ...styles });
}
```

```js
// src/geometry/d.js

export function line([p0, ...points]) {
  return [
    ['M', ...p0],
    ...points.map((p) => ['L', ...p]),
  ];
}
```

最后运行[测试代码](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/geometry/line.spec.js)会有以下的结果。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dfd097d9451f481c9c89633e1cf12e7c~tplv-k3u1fbpfcp-watermark.image?)

## 区域（Area）

理解了线，那么理解区域（Area）就比较容易了。两条直线如下首位连接起来就成了一个区域。所以对于区域来讲，我们需要 x1 和 y1 两个额外的通道。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6513ce3c94f465aab37bbdc064cba88~tplv-k3u1fbpfcp-watermark.image?)

区域的常见用途就是面积图，河流图和带填充颜色的雷达图。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfcaa8a14c4b46e39c090283e8d3e18f~tplv-k3u1fbpfcp-watermark.image?)

```js
// src/geometry/area.js

import { createChannel, createChannels } from './channel';
import { groupChannelStyles } from './style';
import { area as shapeArea } from './shape';
import { group } from '../utils';
import { createGeometry } from './geometry';

const channels = createChannels({
  x1: createChannel({ name: 'x1', optional: false }),
  y1: createChannel({ name: 'y1', optional: false }),
  z: createChannel({ name: 'z' }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {};
  const { x: X, y: Y, z: Z, x1: X1, y1: Y1 } = values;
  const series = Z ? group(I, (i) => Z[i]).values() : [I];
  return Array.from(series, (I) => shapeArea(renderer, coordinate, {
    ...defaults,
    ...directStyles,
    ...groupChannelStyles(I, values),
    X1: X,
    Y1: Y,
    X2: X1,
    Y2: Y1,
    I,
  }));
}

export const area = createGeometry(channels, render);
```

绘制每一个区域的时候我们也需要针对不同的坐标系使用不同的绘制方式。和线一样，在极坐标系下我们也需要把区域的首尾连接起来。

```js
import { contour } from './primitive';
import { area as pathArea } from './d';

export function area(renderer, coordinate, { X1, Y1, X2, Y2, I: I0, ...styles }) {
  // 连接首尾
  const I = coordinate.isPolar() ? [...I0, I0[0]] : I0;
  
  // 将点按照顺时针方向排列
  const points = [
    ...I.map((i) => [X1[i], Y1[i]]),
    ...I.map((i) => [X2[i], Y2[i]]).reverse(),
  ].map(coordinate);

  // 如果是在极坐标系下，绘制等高线
  if (coordinate.isPolar()) {
    return contour(renderer, { points, ...styles });
  }
  
  // 否者直接绘制区域
  return renderer.path({ d: pathArea(points), ...styles });
}
```

```js
// src/geometry/d.js

// 和 line 的区别就是进行了闭合操作
export function area(points) {
  return [
    ...line(points),
    ['Z'],
  ];
}
```

```js
// src/geometry/primitive.js

import { area as pathArea, line as pathLine } from './d';

// 绘制等高线
export function contour(renderer, { points, ...styles }) {
  const end = points.length;
  const mid = end / 2;
  // 用一条 path 绘制等高线本身
  const contour = renderer.path({ d: pathArea(points), ...styles, stroke: 'none' });
  // 用一条 path 绘制外边框
  const outerStroke = renderer.path({ d: pathLine(points.slice(0, mid)), ...styles, fill: 'none' });
  // 用一条 path 绘制内边框
  const innerStroke = renderer.path({ d: pathLine(points.slice(mid, end)), ...styles, fill: 'none' });
  return [innerStroke, contour, outerStroke];
}
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64fd3b40f2b04e04aa10cf5a90c1b800~tplv-k3u1fbpfcp-watermark.image?)

最后运行[测试代码](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/geometry/area.spec.js)会有以下的结果。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b08ff93df704468faf20c76a21c68459~tplv-k3u1fbpfcp-watermark.image?)

## 矩形（Rect）

接下来我们来看矩形（Rect），矩型最常见的用法就是矩阵树图。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/920942cd6e694632856c1589c37d5194~tplv-k3u1fbpfcp-watermark.image?)

矩形除了拥有基本的通道之外，还应该如下图拥有 x1 和 这个两个额外的通道。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3421620cafc4e5d8a1e6bbeb59e905d~tplv-k3u1fbpfcp-watermark.image?)

```js
// src/geometry/rect.js

import { createChannel, createChannels } from './channel';
import { createGeometry } from './geometry';
import { rect as shapeRect } from './shape';
import { channelStyles } from './style';

const channels = createChannels({
  x1: createChannel({ name: 'x1', optional: false }),
  y1: createChannel({ name: 'y1', optional: false }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {};
  const { x: X, y: Y, x1: X1, y1: Y1 } = values;
  return Array.from(I, (i) => shapeRect(renderer, coordinate, {
    ...defaults,
    ...directStyles,
    ...channelStyles(i, values),
    x1: X[i],
    y1: Y[i],
    x2: X1[i],
    y2: Y1[i],
  }));
}

export const rect = createGeometry(channels, render);
```

每一个矩形的绘制可以说是本章最复杂的部分，因为在不同的坐标系下矩形的形状是不同的。假如我们用矩形的四个顶点\(p0, p1, p2, p3\)去描述它，那在不同坐标系下它的展示方式如下。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa28840636ed49d3bb62d64e70329e67~tplv-k3u1fbpfcp-watermark.image?)

同时如果坐标系发生了转置，我们需要改变顶点的顺序。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfdb63dd161d4cc7a5ab5eae763d0a84~tplv-k3u1fbpfcp-watermark.image?)

```js
// src/geometry/shape.js

import { dist, sub, equal } from '../utils';
import { ring } from './primitive';
import { sector as pathSector } from './d';

export function rect(renderer, coordinate, { x1, y1, x2, y2, ...styles }) {
  const v0 = [x1, y1];
  const v1 = [x2, y1];
  const v2 = [x2, y2];
  const v3 = [x1, y2];
  
  // 如果坐标系转置了，改变顶点的顺序
  const vs = coordinate.isTranspose() ? [v3, v0, v1, v2] : [v0, v1, v2, v3];
  const ps = vs.map(coordinate);
  const [p0, p1, p2, p3] = ps;

  // 笛卡尔坐标系绘制矩形
  if (!coordinate.isPolar()) {
    const [width, height] = sub(p2, p0);
    const [x, y] = p0;
    return renderer.rect({ x, y, width, height, ...styles });
  }

  // 获得圆心的位置
  const center = coordinate.center();
  const [cx, cy] = center;

  // 如果角度小于360度
  // 判断的方法是顶点是否重合
  // 绘制扇形
  if (!(equal(p0, p1) && equal(p2, p3))) {
    return renderer.path({ d: pathSector([center, ...ps]), ...styles });
  }

  // 如果角度等于360度，绘制圆环
  const r1 = dist(center, p2); // 内半径
  const r2 = dist(center, p0); // 外半径
  return ring(renderer, { cx, cy, r1, r2, ...styles });
}
```

```js
// src/geometry/d.js

import { dist, angleBetween, sub } from '../utils';

// 生成绘制扇形的路径
export function sector([c, p0, p1, p2, p3]) {
  const r = dist(c, p0);
  const r1 = dist(c, p2);
  const a = angleBetween(sub(p0, c), sub(p1, c));
  const l = a > Math.PI ? 1 : 0;
  const l1 = a > Math.PI ? 1 : 0;
  return [
    ['M', p0[0], p0[1]],
    ['A', r, r, 0, l, 1, p1[0], p1[1]],
    ['L', p2[0], p2[1]],
    ['A', r1, r1, 0, l1, 0, p3[0], p3[1]],
    ['Z'],
  ];
}
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1d2af96904b4ee78693110d02f5fd4c~tplv-k3u1fbpfcp-watermark.image?)

```js
// src/geometry/primitive.js

import { ring as pathRing } from './d';

// 绘制圆环
// 绘制圆环的能力从渲染引擎里面移出了
// 为了更好的扩展性，直接在这里绘制即可
export function ring(renderer, { cx, cy, r1, r2, ...styles }) {
  // 用一个路径去绘制圆环本身
  const ring = renderer.path({ ...styles, d: pathRing([[cx, cy], [r1, r2]]), stroke: 'none' });
  // 分别用两个圆去绘制圆环的边框
  const innerStroke = renderer.circle({ ...styles, fill: 'none', r: r1, cx, cy });
  const outerStroke = renderer.circle({ ...styles, fill: 'none', r: r2, cx, cy });
  return [innerStroke, ring, outerStroke];
}
```

```js
// src/geometry/d.js

// 生成绘制圆环的路径
// 用两个扇形来模拟
export function ring([c, [r1, r2]]) {
  const [cx, cy] = c;
  const p0 = [cx, cy - r2];
  const p1 = [cx, cy + r2];
  const p2 = [cx, cy + r1];
  const p3 = [cx, cy - r1];
  return [
    ...sector([c, p0, p1, p2, p3]),
    ...sector([c, p1, p0, p3, p2]),
  ];
}
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92ca71d712c7459e8bf6db1d972fe3db~tplv-k3u1fbpfcp-watermark.image?)

```js
// src/utils/vector.js

export function equal([x0, y0], [x1, y1]) {
  return closeTo(x0, x1) && closeTo(y0, y1);
}

export function closeTo(x, y, tol = 1e-5) {
  return Math.abs(x - y) < tol;
}

export function dist([x0, y0], [x1 = 0, y1 = 0] = []) {
  return Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2);
}

export function sub([x1, y1], [x0, y0]) {
  return [x1 - x0, y1 - y0];
}

// 计算两个向量之间的夹角
export function angleBetween(v0, v1) {
  const a0 = angle(v0);
  const a1 = angle(v1);
  if (a0 < a1) return a1 - a0;
  return Math.PI * 2 - (a0 - a1);
}

export function angle([x, y]) {
  const theta = Math.atan2(y, x);
  return theta;
}
```

```js
// src/utils/index.js

export * from './vector';
```

最后运行[测试代码](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/geometry/rect.spec.js)会有以下的结果。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4abdc8b703874602a21c0c74dab5921f~tplv-k3u1fbpfcp-watermark.image?)

## 格子（Cell）

格子（Cell）和矩形的形状都是一样的，不同的是格子没有 x1 和 x2 两个通道，它的 x1 和 x2 这个属性不是通过通道得到的，而是通过比例尺计算出来的。

下面我们用格子常被用于的热力图来举例子。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/476ea2b31b104257876c32b6e6e9a49a~tplv-k3u1fbpfcp-watermark.image?)

上面的中每一个格子的 x 和 y 两个通道是由数据本身决定的，但是宽度和高度是分别是由水平方向和竖直方向格子的数量来决定的，而这个过程是通过 band 比例尺计算而得的。我们用竖直方向举例子。

```js
import { createBand } from './scale';

const y = createBand({
 domain: ['Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday'],
 range: [0, 1]
});

const y = /* ... */;
const width = y.bandWidth();
const y1 = y + width;
```

所以对于格子来说，它 x 和 y 通道的比例尺必须是 band 比例尺，它的实现如下。

```js
// src/geometry/cell.js

import { createChannels, createChannel } from './channel';
import { createGeometry } from './geometry';
import { rect } from './shape';
import { channelStyles } from './style';

const channels = createChannels({
  x: createChannel({ name: 'x', scale: 'band', optional: false }),
  y: createChannel({ name: 'y', scale: 'band', optional: false }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {};
  const { x, y } = scales;
  const { x: X, y: Y } = values;
  const width = x.bandWidth();
  const height = y.bandWidth();
  return Array.from(I, (i) => rect(renderer, coordinate, {
    ...defaults,
    ...directStyles,
    ...channelStyles(i, values),
    x1: X[i],
    y1: Y[i],
    x2: X[i] + width,
    y2: Y[i] + height,
  }));
}

export const cell = createGeometry(channels, render);
```

最后运行[测试代码](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/geometry/cell.spec.js)会有以下的结果。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86df8f3edb394fc286877fa3e3aa855e~tplv-k3u1fbpfcp-watermark.image?)

## 间隔（Interval）

最后来看看间隔（Interval），间隔一种很强大的几何图形，用它可以绘制出很多图表：条形图，柱状图，玫瑰图，甜甜圈，饼图，瀑布图等等。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8844fa18b7647c3a2c884741c3a5d4d~tplv-k3u1fbpfcp-watermark.image?)

间隔和格子有会有点不同，间隔还需要额外的 y1 通道，用来确定矩形的高度。它的宽度同样还是根据 x 通道绑定的 band 比例尺来实现。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0e4660726d444a2b2b96c28124fa933~tplv-k3u1fbpfcp-watermark.image?)

这里需要注意的是间隔还有额外的 z 通道，这点和线、区域是一样的，都是用来分组的。不同的是，这里的 z 通道会绑定一个 band 比例尺，计算间隔在组内的偏移。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2263ed64965348d894a88f1ca44d61ca~tplv-k3u1fbpfcp-watermark.image?)

```js
import { createChannel, createChannels } from './channel';
import { channelStyles } from './style';
import { rect } from './shape';
import { createGeometry } from './geometry';

const channels = createChannels({
  x: createChannel({ name: 'x', scale: 'band', optional: false }),
  z: createChannel({ name: 'z', scale: 'band' }),
  y1: createChannel({ name: 'y1', optional: false }),
});

function render(renderer, I, scales, values, directStyles, coordinate) {
  const defaults = {
    z: 0,
    x: 0,
  };
  const { x, z } = scales;
  const { x: X, y: Y, y1: Y1, z: Z = [] } = values;
  const groupWidth = x.bandWidth();
  const intervalWidth = z ? z.bandWidth() : 1;
  const width = groupWidth * intervalWidth;
  return Array.from(I, (i) => {
    const { z: dz, x: dx, ...restDefaults } = defaults;
    const offset = (Z[i] || dz) * groupWidth; // 计算偏移
    const x1 = (X[i] || dx) + offset;
    return rect(renderer, coordinate, {
      ...restDefaults,
      ...directStyles,
      ...channelStyles(i, values),
      x1,
      y1: Y[i],
      x2: x1 + width,
      y2: Y1[i],
    });
  });
}

export const interval = createGeometry(channels, render);
```

最后运行[测试代码](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/geometry/interval.spec.js)会有以下的结果。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a955edf23a1c4a1cb578a1a95364ca41~tplv-k3u1fbpfcp-watermark.image?)

## 作业

又到了给大家布置小作业的时间了，这里大家可以尝试实现一下路径（Path）这个几何图形。它主要有三个通道如下表。

| 通道名 | 描述 | 可选 | 默认值 |
| --- | --- | --- | --- |
| d | 路径字符串或者数组 | 否 | \- |
| fill | 填充颜色 | 否 | \- |
| stroke | 边框颜色 | 是 | \- |

它主要用来绘制自定义的图形，比如地图等。

```js
const index = [0, 1];

const values =  {
    fill: ['#5B8FF9', '#5AD8A6'],
    d: [ 
      'M 10 10 L 10 200 L 200 200 Z',
      [
        ['M', 250, 250],
        ['L', 250, 300],
        ['L', 300, 300],
        ['Z'],
      ],
    ],
};

path(renderer, index, scales, values, coordinate);
```

[上面的代码](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/geometry/path.spec.js)可以绘制出以下的效果。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f11f4cfb7e94c8daf526941e1359a2e~tplv-k3u1fbpfcp-watermark.image?)

具体的实现可以参考[这里](https://github.com/sparrow-vis/sparrow/tree/main/src/geometry/path.js)。

## 小结

这一章就到这里结束了。我们从认识几何图形和通道开始，知道了几何图形通过通道来控制它的外观，然后了解一些基本的通道和分类的方法。这之后认识并且实现了几种常用的几何图形，并且知道了它们的用途。

也许大家现在还对很多东西比较模糊，不用着急，我们在后面的章节会有很多和几何图形以及通道接触的机会，越到后面大家对它们的理解会更加深刻。

最后这里为下一章做一下预告，下一章我们将进入辅助组件（Guide），看看它们是如何加快我们理解几何图形的速度的。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82543b7a6f47417b85b7ce9de2b93118~tplv-k3u1fbpfcp-watermark.image?)
    