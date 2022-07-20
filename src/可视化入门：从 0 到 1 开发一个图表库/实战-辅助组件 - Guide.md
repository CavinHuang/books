
# 实战-辅助组件 - Guide
---

在上一章几何图形（Geometry）结束以后，我们已经可以根据数据绘制出如下简单的图形元素了。虽然目前通过下面这些图我们已经能获得一些基本的信息，但是这些信息还不够明确。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a955edf23a1c4a1cb578a1a95364ca41~tplv-k3u1fbpfcp-watermark.image?)

比如：在上面的第一个柱形图中蓝色的条对应柱子最矮，说明其对应的数据实体的某个属性最小，但具体是哪个数据实体的哪个属性、这个属性的值又具体是多少，这些信息我们就不知道了。

所以我们除了基本的几何图形之外，还需要一些基本的辅助组件（Guide）来帮助我们理解图表，获取更多的信息，比如坐标轴（Axis），图例（Legend）和标注（Annotation）。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82543b7a6f47417b85b7ce9de2b93118~tplv-k3u1fbpfcp-watermark.image?)

那么接下来我们将从辅助组件理论讲起，然后深入了解并且实现坐标轴和图例，最后在小结部分简单介绍一下标注。

## 辅助组件理论（Guide）

辅助组件理论这部分主要介绍坐标轴和图例，理解它们的核心在于理解：**如果几何元素是对数据本身的可视化，那么坐标轴和图例就是对比例尺的可视化。**

对于每一个比例尺来说，它的辅助组件是坐标轴还是图例，取决于和比例尺绑定的视觉通道。而具体的坐标轴和图例的类型取决于比例尺的种类。

当一个比例尺和水平位置通道 x 或者和竖直位置通道 y 绑定的时候，那么它的辅助组件就是坐标轴。

比如下图中 x 通道绑定的 Band 比例尺对应底部的坐标轴，这种坐标轴是水平坐标轴（AxisX）。 y 通道绑定的 Linear 比例尺对应是左边坐标轴，这种坐标轴就是竖直坐标轴（AxisY）。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e131da6f9e344dd385c2bced026b1995~tplv-k3u1fbpfcp-watermark.image?)

如果是在极坐标系下，那么两种比例尺的展现又会有所不同。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f7f0135b47bf4134b57765c8f5cf8bda~tplv-k3u1fbpfcp-watermark.image?)

当一个比例尺和颜色，形状这些非位置通道绑定的时候，它对应的辅助组件就是图例。比如下图中颜色通道绑定的 Oridnal 比例尺对应底部的图例，因为 Ordinal 是离散的比例尺，所以对应的是样品图例（LegendSwatches）。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31f1e324c16d4ce1b60a5f308139c1e1~tplv-k3u1fbpfcp-watermark.image?)

当然如果这个颜色通道对应的是连续形比例尺的话，那么这个比例尺就是坡道图例（LegendRamp）。比如下面的颜色通道用的是 Linear 比例尺，所以对应的图例就是一个坡道图例。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5762dd0a684e44738365037b971b0793~tplv-k3u1fbpfcp-watermark.image?)

简单了解了一下坐标轴和比例尺，那么接下来就进入我们的开发环节。

## 坐标轴（Axis）

首先我们来看一看坐标轴的绘制。不管对应什么比例尺，一个比较完整的坐标轴会包含下面三个部分：刻度、标签和格子。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0b7405e6b0045f4acfd9ab64295242c~tplv-k3u1fbpfcp-watermark.image?)

**刻度**是由比例尺的 ticks 方法或者定义域决定的。如果是连续比例尺（Linear，Log 和 Time 等），它们的刻度就是 ticks 方法返回的值。如果是离散比例尺（Ordianl 和 Point 等），它们的刻度就是定义域本身。

比如下图中底部的坐标轴的刻度就是对应 Band 比例尺的定义域：`['1991', '1992', '1993', ...]`，而左边的坐标轴的刻度就是对应的 Linear 比例尺在 `[0, 13]` 这个范围内生成的 ticks。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e131da6f9e344dd385c2bced026b1995~tplv-k3u1fbpfcp-watermark.image?)

**格子**是根据刻度生成，每一个刻度都会生成一条线，根据坐标系的不同，这条线可能是直线，也可能是曲线。

**标签**的位置一般由第一个或者最后一个刻度决定，它主要用于说明当前比例尺绑定的数据的对应属性。

在不同的坐标系下 AxisX 和 AxisY 的展现形式不同，根据是否是极坐标（isPolar）以及是否转置坐标系（isTranspose），可以将它们分别分为四种类型：

- `(isPolar: false, isTranspose: false)`
- `(isPolar: false, isTranspose: true)`
- `(isPolar: true, isTranspose: true)`
- `(isPolar: true, isTranspose: false)`

如果上面的四种类型分别用 `00`、 `01`、 `11`、 `10` 来表示，那么 axisX 在不同坐标系的展示如下。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1f9c55dfd314fe883f2a8f28222d5e2~tplv-k3u1fbpfcp-watermark.image?)

axisY 在不同坐标系的展示如下。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/630398aa27e84a10ade6a3af58152170~tplv-k3u1fbpfcp-watermark.image?)

了解了坐标轴的不同样子，接下来我们首先抽象出一个创建坐标轴的函数：`createAxis`。该函数会返回一个绘制坐标轴的函数，它根据当前的坐标系选择不同的刻度、标签和格子绘制函数，从而绘制整个坐标轴。

```js
// src/guide/axis.js

import { identity } from '../utils';

// components 不同坐标系对应的绘制组件
// labelOf 获取标签绘制需要的刻度
export function createAxis(components, labelOf) {
  // renderer 渲染器
  // scale 比例尺
  // cooridante 坐标系
  // domain 比例尺的定义域（对离散比例尺有用）
  // label 绘制的标签内容
  // tickCount 刻度数量（对连续比例尺有用）
  // formatter 格式化刻度的函数
  // tickLength 刻度的长度
  // fontSize 刻度文本和标签的字号
  // grid 是否绘制格子
  return (renderer, scale, coordinate, {
    domain, 
    label,
    tickCount = 5, 
    formatter = identity,
    tickLength = 5,
    fontSize = 12,
    grid = false,
  }) => {
    // 获得 ticks 的值
    const offset = scale.bandWidth ? scale.bandWidth() / 2 : 0;
    const values = scale.ticks ? scale.ticks(tickCount) : domain;

    // 处理一些绘制需要的属性
    const center = coordinate.center();
    // 转换成 00、01、11、10
    const type = `${+coordinate.isPolar()}${+coordinate.isTranspose()}`;
    const options = { tickLength, fontSize, center };
    
    // 根据当前坐标系种类选择对应的绘制格子、刻度和标签的方法
    const { grid: Grid, ticks: Ticks, label: Label, start, end } = components[type];
    
    // 计算得到刻度真正的坐标和展示的文本
    const ticks = values.map((d) => {
      const [x, y] = coordinate(start(d, scale, offset));
      const text = formatter(d);
      return { x, y, text };
    });

    // 按需绘制格子、刻度和标签
    if (grid && Grid) Grid(renderer, ticks, end(coordinate));
    if (tick && Ticks) Ticks(renderer, ticks, options);
    if (label && Label) Label(renderer, label, labelOf(ticks), options);
  };
}
```

通过 `createAxis` 函数我们可以看见刻度、格子和标签绘制组件是如何组合使用的，那么接下来我们就分别看看它们的实现。

### 刻度（Ticks）

在笛卡尔坐标系下我们主要会绘制三种刻度：`ticksBottom`、`ticksTop` 和 `ticksLeft`，它们的区别在于刻度线的方向以及刻度线和刻度文本的相对位置不同。

在极坐标系下绘制刻度的重点主要有两个：

- 旋转刻度使得刻度线指向圆心。
- 旋转刻度文本使得文本不颠倒。

具体的实现如下：

```js
// src/guide/ticks.js

import { rotationOf, unique } from './utils';
import { degree } from '../utils';

export function ticksBottom(renderer, ticks, { tickLength, fontSize }) {
  for (const { x, y, text } of ticks) {
    const x2 = x;
    const y2 = y + tickLength;
    renderer.line({ x1: x, y1: y, x2, y2, stroke: 'currentColor', class: 'tick' });
    renderer.text({ text, fontSize, x, y: y2, textAnchor: 'middle', dy: '1em', class: 'text' });
  }
}

export function ticksTop(renderer, ticks, { tickLength, fontSize }) {
  for (const { x, y, text } of ticks) {
    const x2 = x;
    const y2 = y - tickLength;
    renderer.line({ x1: x, y1: y, x2, y2, stroke: 'currentColor', class: 'tick' });
    renderer.text({ text, fontSize, x, y: y2, textAnchor: 'middle', dy: '-0.3em', class: 'text' });
  }
}

export function ticksLeft(renderer, ticks, { tickLength, fontSize }) {
  for (const { x, y, text } of ticks) {
    const x2 = x - tickLength;
    const y2 = y;
    renderer.line({ x1: x, y1: y, x2, y2, stroke: 'currentColor', class: 'tick' });
    renderer.text({ text, fontSize, x: x2, y, textAnchor: 'end', dy: '0.5em', dx: '-0.5em', class: 'text' });
  }
}

export function ticksCircular(renderer, ticks, { tickLength, fontSize, center }) {
  for (const { x, y, text } of unique(ticks)) {
    // 计算刻度和刻度文本的旋转角度
    const { tickRotation, textRotation } = rotationOf(center, [x, y]);
    const [x2, y2] = [0, tickLength];
    const dy = textRotation === 0 ? '1.2em' : '-0.5em';

    // 旋转刻度
    renderer.save();
    renderer.translate(x, y);
    renderer.rotate(degree(tickRotation));

    renderer.line({
      x1: 0, y1: 0, x2, y2, stroke: 'currentColor', fill: 'currentColor', class: 'tick',
    });

    // 在旋转刻度的基础上旋转文本
    renderer.save();
    renderer.translate(x2, y2);
    renderer.rotate(degree(textRotation));

    renderer.text({
      text: `${text}`, x: 0, y: 0, textAnchor: 'middle', fontSize, fill: 'currentColor', dy, class: 'text',
    });
    renderer.restore();
    renderer.restore();
  }
}
```

### 标签（Label）

标签绘制函数的实现没有太大的难点，这里就不具体介绍了。

```js
// src/guide/label.js

// 当 axis 在左边，且方向向上
export function labelLeftUp(renderer, label, tick, { fontSize }) {
  const { x, y } = tick;
  renderer.text({ text: `↑ ${label}`, x, y, fontSize, textAnchor: 'end', dy: '-1em', class: 'label' });
}

// 当 axis 在左边，且方向向下
export function labelLeftDown(renderer, label, tick, { fontSize }) {
  const { x, y } = tick;
  renderer.text({ text: `↓ ${label}`, x, y, fontSize, textAnchor: 'end', dy: '2em', class: 'label' });
}

// 当 axis 在底部，且方向向右
export function labelBottomRight(renderer, label, tick, { fontSize, tickLength }) {
  const { x, y } = tick;
  const ty = y + tickLength;
  renderer.text({ text: `${label} →`, x, y: ty, fontSize, textAnchor: 'end', dy: '2em', class: 'label' });
}

// 当 axis 在顶部，且方向向右
export function labelTopRight(renderer, label, tick, { fontSize, tickLength }) {
  const { x, y } = tick;
  const ty = y - tickLength;
  renderer.text({ text: `${label} →`, x, y: ty, fontSize, textAnchor: 'end', dy: '-1.2em', class: 'label' });
}
```

### 网格（Grid）

网格线的绘制也没有太多的难点，具体的实现参考下面的代码。

```js
// src/guide/label.js

import { dist } from '../utils';

// 垂直方向的线
export function gridVertical(renderer, ticks, end) {
  const [, y2] = end;
  for (const { x, y } of ticks) {
    renderer.line({ x1: x, y1: y, x2: x, y2, stroke: '#eee', class: 'grid' });
  }
}

// 水平方向的线
export function gridHorizontal(renderer, ticks, end) {
  const [x2] = end;
  for (const { x, y } of ticks) {
    renderer.line({ x1: x, y1: y, x2, y2: y, stroke: '#eee', class: 'grid' });
  }
}

// 绘制一系列从圆心发散的直线
export function gridRay(renderer, ticks, end) {
  const [x2, y2] = end;
  for (const { x, y } of ticks) {
    renderer.line({ x1: x, y1: y, x2, y2, stroke: '#eee', class: 'grid' });
  }
}

// 绘制一系列同心圆
export function gridCircular(renderer, ticks, end) {
  const [cx, cy] = end;
  for (const { x, y } of ticks) {
    const r = dist(end, [x, y]);
    renderer.circle({ fill: 'none', stroke: '#eee', cx, cy, r, class: 'grid' });
  }
}
```

### 水平坐标轴（AxisX）

水平坐标轴在不同的坐标系下需要不同的绘制组件，具体如下面代码所展示的一样。

```js
// src/guide/axisX.js

import { createAxis } from './axis';
import { ticksBottom, ticksLeft, ticksCircular } from './ticks';
import { gridCircular, gridHorizontal, gridRay, gridVertical } from './grid';
import { labelLeftDown, labelBottomRight } from './label';

const components = {
  '00': {
    start: (d, scale, offset) => [scale(d) + offset, 1],
    end: (coordinate) => coordinate([0, 0]),
    grid: gridVertical,
    ticks: ticksBottom,
    label: labelBottomRight,
  },
  '01': {
    start: (d, scale, offset) => [scale(d) + offset, 1],
    end: (coordinate) => coordinate([0, 0]),
    grid: gridHorizontal,
    ticks: ticksLeft,
    label: labelLeftDown,
  },
  10: {
    start: (d, scale, offset) => [scale(d) + offset, 0],
    grid: gridRay,
    ticks: ticksCircular,
    end: (coordinate) => coordinate.center(),
  },
  11: {
    start: (d, scale, offset) => [scale(d) + offset, 1],
    grid: gridCircular,
    ticks: ticksLeft,
    end: (coordinate) => coordinate.center(),
  },
};

export const axisX = createAxis(components);
```

在不同的坐标系下，根据下面这个比例尺绘制水平坐标轴的效果如下。

```js
const scale = createLinear({
  domain: [0, 10],
  range: [0, 1]
});
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f1f9c55dfd314fe883f2a8f28222d5e2~tplv-k3u1fbpfcp-watermark.image?)

### 竖直坐标轴（AxisY）

竖直坐标轴在不同的坐标系下同样需要不同的绘制组件，具体如下面代码所展示的一样。

```js
// src/guide/axisY.js

import { createAxis } from './axis';
import { ticksTop, ticksLeft, ticksCircular } from './ticks';
import { gridCircular, gridHorizontal, gridRay, gridVertical } from './grid';
import { labelTopRight, labelLeftUp } from './label';

const components = {
  '00': {
    start: (d, scale, offset) => [0, scale(d) + offset],
    end: (coordinate) => coordinate([1, 0]),
    grid: gridHorizontal,
    ticks: ticksLeft,
    label: labelLeftUp,
  },
  '01': {
    start: (d, scale, offset) => [0, scale(d) + offset],
    end: (coordinate) => coordinate([1, 0]),
    grid: gridVertical,
    ticks: ticksTop,
    label: labelTopRight,
  },
  10: {
    start: (d, scale, offset) => [0, scale(d) + offset],
    grid: gridCircular,
    ticks: ticksLeft,
    end: (coordinate) => coordinate.center(),
  },
  11: {
    start: (d, scale, offset) => [0, scale(d) + offset],
    grid: gridRay,
    ticks: ticksCircular,
    end: (coordinate) => coordinate.center(),
  },
};

export const axisY = createAxis(components);
```

在不同的坐标系下，根据下面这个比例尺去绘制竖直坐标轴的效果如下。

```js
const scale = createLinear({
  domain: [0, 10],
  range: [1, 0]
});
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/630398aa27e84a10ade6a3af58152170~tplv-k3u1fbpfcp-watermark.image?)

## 图例（Legend）

了解完坐标轴的绘制，接下来我们来看看图例的绘制。图例的绘制会相对简单很多，因为绘制图例不需要考虑坐标系。但是为了保证辅助组件绘制函数接口的一致性，还是会把坐标系作为参数传入。

### 样品图例（LegendSwatches）

首先我们来看看样品图例，它主要针对离散比例尺，比如根据下面这个 Ordinal 比例尺来生成图例，将会得到如下图的效果。

```js
const scale = createOrdinal({
  domain: ['a', 'b', 'c'],
  range: ['#5B8FF9', '#5AD8A6', '#5D7092'],
});
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/355b0a28f0ee480da5770e9fb2832e52~tplv-k3u1fbpfcp-watermark.image?)

具体的实现如下，涉及一些简单的位置计算和图形绘制。

```js
// src/guide/legendSwatches.js

import { identity } from '../utils';

// marginLeft 色块和文字的距离
export function legendSwatches(renderer, scale, coordinate, {
  x,
  y,
  width = 48,
  marginLeft = 12,
  swatchSize = 10,
  fontSize = 10,
  formatter = identity,
  domain,
  label,
}) {
  renderer.save();
  renderer.translate(x, y);

  // 绘制 label
  if (label) {
    renderer.text({ text: label, x: 0, y: 0, fontWeight: 'bold', fontSize, textAnchor: 'start', dy: '1em' });
  }

  const legendY = label ? swatchSize * 2 : 0;
  for (const [i, label] of Object.entries(domain)) {
    // 绘制色块
    const color = scale(label);
    const legendX = width * i;
    renderer.rect({
      x: legendX,
      y: legendY,
      width: swatchSize,
      height: swatchSize,
      stroke: color,
      fill: color,
    });
    
    // 绘制文字
    const textX = legendX + marginLeft + swatchSize;
    const textY = legendY + swatchSize;
    renderer.text({ text: formatter(label), x: textX, y: textY, fill: 'currentColor', fontSize });
  }
  renderer.restore();
}
```

### 坡道图例（LegendRamp）

接下来是坡道图例，它主要针对连续比例尺，比如根据下面这个 Linear 比例尺来生成图例，将会得到如下图的效果。

```js
const scale = createLinear({
  domain: [0, 100],
  range: ['#5B8FF9', '#5AD8A6'],
  interpolate: interpolateColor,
});
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/011742ec813e4aee8d66915cd10a7779~tplv-k3u1fbpfcp-watermark.image?)

具体的实现如下，这里会用一条条颜色渐变的线来实现过度效果。

```js
// src/guide/legendRamp.js

import { createLinear } from '../scale';
import { identity } from '../utils';
import { ticksBottom } from './ticks';

export function legendRamp(renderer, scale, coordinate, {
  x,
  y,
  width = 120,
  height = 10,
  domain,
  tickCount = 5,
  tickLength = height + 5,
  formatter = identity,
  fontSize = 10,
  label,
}) {
  renderer.save();
  renderer.translate(x, y);

  // 绘制标签
  if (label) {
    renderer.text({ text: label, x: 0, y: 0, fontWeight: 'bold', fontSize, textAnchor: 'start', dy: '1em' });
  }

  // 用一条条紧靠的线来实现渐变效果
  // 将每条线的位置 x 转换到比例尺的定义域内
  const value = createLinear({ domain: [0, width], range: domain });
  const legendY = label ? height * 2 : 0;
  for (let i = 0; i < width; i += 1) {
    const stroke = scale(value(i));
    renderer.line({ x1: i, y1: legendY, x2: i, y2: legendY + height, stroke });
  }

  // 绘制 ticks
  const position = createLinear({ domain, range: [0, width] });
  const values = position.ticks(tickCount);
  const ticks = values.map((d) => ({
    x: position(d),
    y: legendY,
    text: formatter(d),
  }));
  ticksBottom(renderer, ticks, { fontSize, tickLength });

  renderer.restore();
}

```

坐标轴和图例就开发完成了，完整的代码可以在[这里](https://github.com/sparrow-vis/sparrow/tree/main/src/guide)浏览，同样也可以通过[这里](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/guide)的测试代码来验证代码的正确性。

## 小结

本章的主要内容就差不多这些了，这一章我们了解了辅助组件里面的坐标轴和图例，也知道了它们和比例尺之间密不可分的关系。

不过辅助组件里面还有很重要的一种没有给大家详细介绍：标注（Annotation）。标注和它的名字一样，主要用于来标注一些值得注意的数据点或者数据值，比如最大值，最小值，平均值这些。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93e8119bd28e4b3f9713ebeebcf12a69~tplv-k3u1fbpfcp-watermark.image?)

标注除了上图中的文字以外，还可以是线条、图片等等。这部分的内容就不再这里深入介绍了。

下一章我们将进入统计（Statistic），看看它是如何改变几何图形的位置的。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d295663040f0489491795330fd713b04~tplv-k3u1fbpfcp-watermark.image?)
    