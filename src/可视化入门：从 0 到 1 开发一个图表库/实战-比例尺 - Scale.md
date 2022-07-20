
# 实战-比例尺 - Scale
---

上一章我们认识并且开发了一个简单的渲染引擎。我们了解到渲染引擎主要负责数据可视化中的绘制部分，而接下来的比例尺（Scale），是就负责数据处理部分了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e93df0e7d1af400aa64f4ff03076c1b9~tplv-k3u1fbpfcp-zoom-1.image)

比例尺是可视化中一个很重要且有用的抽象，主要用于将数据的某一个属性映射为图形的视觉属性，比如名字属性映射图形的颜色属性，身高属性映射为图形的位置属性。

在[数据分析模型](https://juejin.cn/book/7031893648145186824/section/7032095221731033125)那一章的最后我们提到，在设计一个可视化方案的时候，其中一个强有力的手段是“编码”，而编码就是通过比例尺完成。不同的数据需要不同的的编码方式，如何根据当前的数据选择合适的比例尺就是我们在可视化中遇见的一个常见的挑战。

同时比例尺也是我们在使用一些图表库中比较难以理解、容易引起困惑的部分，比如有如下常见的问题：

- 为啥最后坐标轴生成的刻度的数量和希望的不一样？
- nice 到底有什么用？
- Threshold, Quantile, Quantile 比例尺有什么区别？

为了帮助大家更好的理解上面的这些问题，同时也为了给 Sparrow 提供数据映射的能力，我们接下来先从比例尺理论讲起，从根本上理解比例尺，然后通过实战加深对其理解，最后通过拓展去了解更多和比例尺相关的东西。

## 比例尺理论

比例尺的概念其实早就藏在我们的日常生活中了，比如我们有度量长度的比例尺：把空间上的一段距离映射为一个数字，有度量重量的比例尺：把一定重量映射为一个数字。

**而在可视化中的比例尺，就是用来度量数据属性的，将数据抽象的属性映射为一个视觉属性**。这决定了我们如何理解图形的颜色、大小、形状和位置等。选择一个比例尺的时候，需要我们去思考度量的是什么以及这些度量的含义，最终这些选择将决定我们如何理解一个图形。

比如我们希望用点来代表某个数据集中的每一条数据，数据中有 sex 这一个属性，对应有两个值：male 和 female。我们选择用点的颜色去度量 sex 这个数据属性，如果一条数据的 sex 属性是 male 那么对应的点是红色，否者是绿色。所以在理解每一个点的时候，如果这个点是红色，那么它对应的数据的 sex 属性就是 male，否者就是 female。

如果用代码把上面的功能如下描述：

```js
function scale(value) {
  return value === 'male' ? 'red': 'green';
}

scale('male'); // 'red'
scale('female'); // 'green'
```

上面的代码非常的简单，但是通用性太差，只适用于这个特例。有没有什么通用的办法呢？当然是有的。

其实不难发现，**比例尺本质上是一个函数**，会将一个值（变量）从一个特定的范围（定义域）映射到另一个特定的范围（值域）。定义域（Domain）是由数据的属性决定，值域（Range）是由图形的视觉属性决定。根据定义域和值域的不同，我们需要选择不同的比例尺。

上面的 sex 和 颜色都是分类属性，所以会使用到我们之后要介绍的 Ordinal 比例尺，具体的使用方式如下。

```js
// 根据 options 返回一个函数
const scale = createOrdinal({
  domain: ['male', 'female'], // 定义域
  range: ['red', 'green'], // 值域
});

scale('male'); // 'red'
scale('female'); // 'green'
```

那么接下来我们就来看看不同的比例尺，分别了解它们的定义域和值域的类型、映射规则和使用场景。

## Identity

我们首先看一个最简单的比例尺：Identity 比例尺。它的功能和它的名字一样：“恒等映射”，也就是将输入原封不动的返回。

当希望数据的属性和图形的视觉属性保持一致的时候，我们就可以使用 Identity 比例尺，比如数据有一个属性是 color，而我们又希望我们图形的填充颜色和 color 保持一致，这个时候我们就可以使用 Identity 比例尺。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/adfdfe54e4a74aae8dc650b23c759bd6~tplv-k3u1fbpfcp-zoom-1.image)

Identity 比例尺的使用方式如下，它能保证输入和输出总是保持一致。

```js
// Identity 是恒等映射，所以不需要指定定义域和值域
const scale = createIdentity();

scale(1); // 1
scale({ a: 1 }); // { a: 1 }
scale('sparrow'); // 'sparrow'
```

不难发现 Identity 比例尺可以表示为：`y = x`，而它的实现也非常的简单。

```js
// src/scale/identity.js

export function createIdentity() {
  return (x) => x;
}
```

## 连续比例尺

看完了最简单的比例尺，我们来看看最常用的一类比例尺：连续比例尺（Continuous）。连续比例尺主要用于数值属性的映射，它的特点是定义域和值域都是连续的，它们之间的关系可以表示为：`y = a * f(x) + b`。

对于所有的连续比例尺来说，除了拥有映射功能之外，还有一个很重要的功能：**生成坐标轴需要的坐标刻度**。在理解可视化图表的过程中，坐标轴往往是一个很好的辅助，因为它能给我们提供更多辅助信息。

在知道了连续比例尺的两个主要功能后，接下来将给大家介绍并且实现 Linear 和 Time 两个比例尺，另外一个 Log 比例尺的实现将作为大家的练习。

### Linear

\(1\) 线性映射

Linear 比例尺是支持线性映射的比例尺，它的表达式 `y = a * f(x) + b` 中的 `f(x)` 应该为 `f(x) = x`。

Linear 比例尺常常用于视觉元素的布局，比如在做散点图的时候，可以用 Linear 比例尺来完成对点的布局，比如将数据的某个数值属性映射为点的 x 坐标，将数据的另一个个数值属性映射为点的 y 坐标。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a96087ae573046158182330f405db527~tplv-k3u1fbpfcp-zoom-1.image)

它期望的使用方式如下：

```js
const scale = createLinear({
  domain: [0, 1], // 输入的范围是 [0, 1]
  range: [0, 10], // 输出的范围是 [0, 10]
})

scale(0.2); // 2
scale(0.5); // 5
```

通过使用方式我们不难看出：**输入在定义域里到两端的比例，应该和输出在值域到两端的比例相同**，比如 `(0.2 \- 0) / (1 \- 0.2)` 其实是和`(2 \- 0) / (10 \-2)` 一样的。

基于这个发现我们首先通过计算出输入在定义域的位置（归一化），然后根据这个结果在值域计算出相应的输出（插值），具体实现如下。

```js
// src/scale/linear.js

import { normalize } from './utils';

export function createLinear({
  domain: [d0, d1],
  range: [r0, r1],
  interpolate = interpolateNumber,
}) {
  return (x) => {
    const t = normalize(x, d0, d1);
    // 默认是使用线性的数值插值器
    // 如果是颜色可以使用颜色插入器
    return interpolate(t, r0, r1);
  };
}

export function interpolateNumber(t, start, stop) {
  return start * (1 - t) + stop * t;
}
```

```js
// src/scale/utils.js

export function normalize(value, start, stop) {
  return (value - start) / (stop - start);
}
```

最后将其可视化出来的结果如下图，可以发现输入 x 和输入 y 确实是线性相关的。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7851d519a2574addb9ed561e167dc422~tplv-k3u1fbpfcp-watermark.image?)

如果将上面的数值插值器（interpolateNumber）换成颜色插值器的话，就会得到以下的效果，可以发现颜色是均匀变化的。

```js
import { interpolateNumber } from './linear';

const scale = createLinear({
  domain: [0, 1],
  range: [
    [255, 255, 255], // 白色
    [0, 255, 255], // 浅蓝色
  ],
  interpolate: interolateColor
});

function interolateColor(t, start, stop) {
  const r = interpolateNumber(t, start[0], stop[0]);
  const g = interpolateNumber(t, start[1], stop[1]);
  const b = interpolateNumber(t, start[2], stop[2]);
  return `rgb(${r}, ${g}, ${b})`;
}
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9999c22f70f64d35b980224c52d1b479~tplv-k3u1fbpfcp-watermark.image?)

（2）ticks 和 nice

介绍完 Linear 比例尺的映射功能，接下来我们来看看它生成坐标刻度的方法。下面我们首先来看看一个简单版本，看看它有啥问题。

```js
// min: 定义域的最小值
// max: 定义域的最大值
// count: 坐标刻度的数量
function simpleTicks(min, max, count) {
  const step = (max - min) / tickCount;
  const values = new Array(count);
  for(let i = 0; i < count; i++) { 
    values[i] = min + step * i;
  }
  return values;
}
```

上面的代码非常直觉，现在让我们来看看它的效果。

```js
const ticks = simpleTicks(0.1, 9.9, 6);
ticks // [0.1, 1.7333333333333336, 3.366666666666667, 5, 6.633333333333334, 8.266666666666667]
```

`simpleTicks` 方法确实按照要求生成了6个刻度，但是可读性太差：全是小数，那如果我们将这些刻度格式化一下呢？

```js
ticks.map(d => parseFloat(d.toFixed(1)));
ticks; // [0.1, 1.7, 3.4, 5, 6.6, 8.3];
```

看上去好一点了，但是我们会发现刻度不是均匀的，也就是相邻的刻度之间的间隔不一样：`3.4 \- 1.7 !== 1.7 \- 0.1`。

造成上面两个问题的根本原因就是我们没有选择合适的刻度间隔，也就是上面的 `const step = (max \- min) / count;` 太过简单。对于 Linear 比例尺来说，合适的刻度间隔应该是是**1或者2或者5乘上10的 n 次方**的数，也就是说希望 `step = 10 ^ n * (1 | 2 | 5)`。

获得上述刻度间隔的实现方式如下，该实现是来自于 [d3-array](https://github.com/d3/d3-array/blob/main/src/ticks.js#L46)。

```js
// src/scale/utils.js

// step0 是生成指定数量的刻度的间隔
// step1 是最后生成的刻度的间隔
// 我们希望 step1 满足两个条件：
// 1. step1 = 10 ^ n * b (其中 b=1,2,5)
// 2. step0 和 step1 的误差尽量的小
export function tickStep(min, max, count) {
  const e10 = Math.sqrt(50); // 7.07
  const e5 = Math.sqrt(10); // 3.16
  const e2 = Math.sqrt(2); // 1.41

  // 获得目标间隔 step0，设 step0 = 10 ^ m
  const step0 = Math.abs(max - min) / Math.max(0, count);
  // 获得 step1 的初始值 = 10 ^ n < step0，其中 n 为满足条件的最大整数
  let step1 = 10 ** Math.floor(Math.log(step0) / Math.LN10);
  // 计算 step1 和 step0 的误差，error = 10 ^ m / 10 ^ n = 10 ^ (m - n)
  const error = step0 / step1;
  // 根据当前的误差改变 step1 的值，从而减少误差
  // 1. 当 m - n >= 0.85 = log(e10) 的时候，step1 * 10
  // 可以减少log(10) = 1 的误差 
  if (error >= e10) step1 *= 10;
  // 2. 当 0.85 > m - n >= 0.5 = log(e5) 的时候，step1 * 5
  // 可以减少 log(5) = 0.7 的误差
  else if (error >= e5) step1 *= 5;
  // 3. 当 0.5 > m - n >= 0.15 = log(e2) 的时候，step1 * 2
  // 那么可以减少 log(2) = 0.3 的误差
  else if (error >= e2) step1 *= 2;
  // 4. 当 0.15 > m - n > 0 的时候，step1 * 1
  return step1;
}
```

这里简单解释一下使用 `Math.sqrt(50)`，`Math.sqrt(10)` 以及 `Math.sqrt(2)` 作为误差标准的原因（这里只是笔者的推断，仅供参考，如果更好的解释可以在评论处指出）。

通过上面的注释我们可以看出，为了让 `step0` 和 `step1` 之间误差尽量的少，就是让 `Math.abs(m \- n)` 尽量为 0。因为我们希望间隔是以 **1或者2或者5乘上10的 n 次方**数，所以只能通过乘 2，5或者10来减少误差。

乘10可以减少 log10 的误差 ，乘5可以减少 log5 的误差，乘2可以减少 log2 的误差。我们用数列 0，log2，log5 和 log10 两两之间的平均数来作为选择需要改变的误差的标准。也就是:

- `log(e2) = (0 + log2) / 2 = log(Math.sqrt(2))`
- `log(e5) = (log2 + log5) / 2 = log(Math.sqrt(2 * 5))`
- `log(e10) = (log5 + log10) / 2 = log(Math.sqrt(5 * 10))`

即 `e2 = Math.sqrt(2)`, `e5 = Math.sqrt(10)` 和 `e10 = Math.sqrt(50)`。

在这个 `tickStep` 的基础上我们可以获取如下的获得刻度的方法。

```js
// src/scale/utils.js

export function ticks(min, max, count) {
  const step = tickStep(min, max, count);
  // 让 start 和 stop 都是 step 的整数倍
  // 这样生成的 ticks 都是 step 的整数倍
  // 可以让可读性更强
  const start = Math.ceil(min / step);
  const stop = Math.floor(max / step);
  const n = Math.ceil(stop - start + 1);
  // n 不一定等于 count，所以生成的 ticks 的数量可能和指定的不一样
  const values = new Array(n);
  for (let i = 0; i < n; i += 1) {
    values[i] = round((start + i) * step);
  }
  return values;
}

// 简单解决 js 的精读问题：0.1 + 0.2 !== 0.3
export function round(n) {
  return Math.round(n * 1e12) / 1e12;
}
```

下面来看看 `ticks` 方法获得的效果。

```js
ticks(0.1, 9.9, 6); // [2, 4, 6, 8]
```

现在发现生成的刻度不仅是均匀的，而且拥有很不错的可读性！但是美中不足的是定义域 `[0.1, 9.9]` 本身的可读性不是很强，但如果我们能根据刻度间隔去调整定义域的范围，使得最小值和最大值都是刻度间隔的整数倍，又会发生什么？这就是 `nice` 操作，具体的实现如下。

```js
// src/scale/utils.js

export function nice(domain, interval) {
  const [min, max] = domain;
  return [interval.floor(min), interval.ceil(max)];
}

export function ceil(n, base) {
  return base * Math.ceil(n / base);
}

export function floor(n, base) {
  return base * Math.floor(n / base);
}
```

我们可以如下使用上面新增的函数，可以发现改算法根据刻度间隔`2`去调整了定义域，使得其从`[0.1, 9.9]`变成了`[0, 10]`，从而生成了`[0, 2, 4, 6, 8]`这样可读性更强的刻度。

```js
let d0 = 0.1;
let d1 = 9.9;
const step = tickStep(d0, d1, tickCount);
[d0, d1] = nice([0.1, 9.9], {
  floor: (x) => floor(x, step),
  ceil: (x) => ceil(x, step),
});

d0; // 0
d1; // 10
ticks(d0, d1, 6); // [0, 2, 4, 6, 8]
```

因为上面的 `ticks` 以及 `nice` 和 Linear 比例尺是强相关的，所以我们把它们作为 Linear 的两个方法，最后 Linear 比例尺的实现如下。

```js
// src/scale/linear.js

import {
  normalize, tickStep, nice, floor, ceil, ticks,
} from './utils';

export function createLinear({
  domain: [d0, d1],
  range: [r0, r1],
  interpolate = interpolateNumber,
}) {
  const scale = (x) => {
    const t = normalize(x, d0, d1);
    return interpolate(t, r0, r1);
  };

  scale.ticks = (tickCount) => ticks(d0, d1, tickCount);
  scale.nice = (tickCount) => {
    const step = tickStep(d0, d1, tickCount);
    [d0, d1] = nice([d0, d1], {
      floor: (x) => floor(x, step),
      ceil: (x) => ceil(x, step),
    });
  };

  return scale;
}

export function interpolateNumber(t, start, stop) {
  return start * (1 - t) + stop * t;
}
```

### Time

Linear 比例尺要求定义域都是数字，但是有的时候我们希望定义域是浏览器的时间对象（Date），这个时候就需要用到 Time 比例尺了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75f389be0b9c484495ccbb599a1bc2e6~tplv-k3u1fbpfcp-zoom-1.image)

比如我们在做折线图的时候，希望把和时间相关的属性映射为折线图的 x 坐标，我们就会如下使用 Time 比例尺。

```js
const map = createTime({
  domain: [new Date(2000, 0, 1), new Date(2000, 0, 2)],
  range: [0, 960],
});

map(new Date(2000, 0, 1, 5)); // 200
map(new Date(2000, 0, 1, 16)); // 640
map(new Date(2000, 0, 2)); // 960
```

根据上面的描述，其实不难看出 Time 比例尺的表达式 `y = a * f(x) + b`中的 `f(x)` 应该为 `f(x) = x.getTime()`。所以我们可以在 Linear 比例尺的基础上如下实现 Time 比例尺。

```js
// src/scale/time.js

import { createLinear } from './linear';

export function createTime({ domain, ...rest }) {
  const transform = (x) => x.getTime();
  const transformedDomain = domain.map(transform);
  const linear = createLinear({ domain: transformedDomain, ...rest });
  const scale = (x) => linear(transform(x));

  scale.nice = (tickCount) => linear.nice(tickCount);
  scale.ticks = (tickCount) => linear.ticks(tickCount).map((d) => new Date(d));

  return scale;
}
```

这里需要注意的是 Time 比例尺和 Linear 比例尺的 `ticks` 和 `nice` 方法应该是不一样的，因为对于它们来说可读性强的刻度的含义不一样。对于 Time 比例尺来说，应该是如下的时间间隔：

- 1, 5, 15 和 30秒.
- 1, 5, 15 和 30分钟.
- 1, 3, 6 和 12-小时.
- 1 和 2天.
- 1周.
- 1 和 3月.
- 1年.

但是 Time 比例尺获得合适刻度间隔的算法相对更复杂的一点，所以这里就复用 Linear 比例尺的 `ticks` 算法，想了解更多的可以去里看 [d3-scale](https://github.com/d3/d3-scale/blob/main/src/time.js#L47) 的源码。

最后我们将 Time 比例尺可视化的效果如下，可以发现它和 Linear 比例尺一个最大的区别是 x 轴从数字变成了时间。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4f87162f9b34afb9c565955401a3578~tplv-k3u1fbpfcp-watermark.image?)

## 序数类比例尺

如果说连续比例尺负责数值属性的映射，那么序数类比例尺就负责序数属性的映射。

这里解释一下序数的含义。在[数据分析模型](https://juejin.cn/book/7031893648145186824/section/7032095221731033125)那一章我们了解到，数据属性分为：分类和可排序属性，可排序又分为数值和序数两种类型。为了简单，我们把分类属性也算作一种特殊的序数属性（所有值的大小都是相等的）。所以这里的序数属性包含分类属性和序数属性。

接下来我们来看看三个序数类比例尺：Ordinal、Band 和 Point。

### Ordinal

Ordinal 比例尺和开篇提到的一样，值域和定义域都是序数，主要用于将序数属性映射为同为序数属性的视觉属性，比如颜色，形状等。比如下面我们将水果的名字映射为颜色。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84eec5a4a1dc43daa458ebf36ca5459a~tplv-k3u1fbpfcp-zoom-1.image)

把上图的映射过程用代码描述如下：

```js
const scale = createOrdinal({
  domain: ["苹果", "香蕉", "梨", "西瓜"],
  range: ['red', 'yellow', 'green'],
});

scale("苹果"); // 'red'
scale("香蕉"); // 'yellow'
scale("梨"); // 'green'
scale("西瓜"); // 'red'
```

实现的思路也很简单：首先从定义域中找到输入对应的索引，然后返回值域中对应索引的元素。

```js
// src/scale/ordinal.js

export function createOrdinal({ domain, range }) {
  return (x) => {
    const index = domain.findIndex((d) => equal(d, x));
    // 取模的目的是为了应对 domain.length > range.length 的情况
    return range[index % range.length];
  };
}
```

```js
// src/scale/utils.js

// 通过对象序列化结果简单判断两个对象是否相等
export function equal(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
```

### Band

Ordinal 比例尺要求值域必须是序数的，如果值域是数值类型的话，就需要 Band 比例尺了。Band 比例尺主要用于将离散的序数属性映射为连续的数值属性，往往用于条形图中确定某个条的位置。

比如下面我们将水果的名字映射为下面每个条的位置，其中每一个条使一个 Band，它的宽度为 BandWidth，条之间的间距为 Padding，步长是 BandWidth 和 Padding 之和。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab72ba856ece420297e57dbbdc5fea2c~tplv-k3u1fbpfcp-zoom-1.image)

把上图的映射过程用代码描述如下：

```js
const options = {
  domain: ["苹果", "香蕉", "梨"],
  range: [0, 320], // 上图中 width 的范围
  padding: 0.2, // 控制条之间的间距，上图中的 padding
}

const scale = createBand(options);
scale("苹果"); // 20
scale("香蕉"); // 120
scale("梨"); // 220
```

当然我们除了如上需要通过 Band 比例尺获得条的位置，还需要如下获得条的 BandWidth 和 Step。

```js
scale.bandWidth(); // 80
scale.step(); // 100
```

根据上面的介绍，发现 Band 比例尺可以直接基于 Ordinal 比例尺实现，只不过我们需要将其本身的值域进行转换，转换成间距相等的几个值。具体的实现方法如下：

```js
// src/scale/band.js

import { createOrdinal } from './ordinal';
import { band } from './utils';

export function createBand(options) {
  const { bandRange, bandWidth, step } = band(options);
  const scale = createOrdinal({ ...options, range: bandRange });

  scale.bandWidth = () => bandWidth;
  scale.step = () => step;

  return scale;
}
```

```js
// src/scale/utils.js

export function band({ domain, range, padding }) {
  const [r0, r1] = range;
  const n = domain.length;
  const step = (r1 - r0) / (n + padding);
  const bandWidth = step * (1 - padding);
  const interval = step - bandWidth;
  const x = (_, i) => r0 + interval + step * i;
  return {
    step,
    bandWidth,
    bandRange: new Array(n).fill(0).map(x),
  };
}
```

### Point

我们接下来看看最后的一种序数比例尺：Point。Point 比例尺是一种特殊的 Band 比例尺，它的 Padding 始终为 1，也就是说它的 BandWidth 始终为 0 。\(具体参考下图）

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc257ac4098241e3a8c2ab5ae0cebfcd~tplv-k3u1fbpfcp-zoom-1.image)

Point 比例尺主要用于散点图，它的使用方式如下：

```js
const options = {
  domain: ["苹果", "香蕉", "梨"],
  range: [0, 320], 
};

const scale = createBand(options);
scale("苹果"); // 80
scale("香蕉"); // 160
scale("梨"); // 240
```

Point 的比例尺可以基于 Ordinal 如下简单得实现。

```js
// src/scale/point.js

import { createBand } from './band';

export function createPoint(options) {
  return createBand({ ...options, padding: 1 });
}
```

## 分布比例尺

最后我们来看看分布比例尺，该类比例尺很多时候可以用来探索数据的分布。我们用 [Quantile, Quantize and Threshold scales](https://observablehq.com/@d3/quantile-quantize-and-threshold-scales) 这篇文章中的例子来认识这类比例尺。

上面的文章中有一个工资的数据集合：`salary = [11002,29017, ...]`，这个数据集一共有 100 条数据，范围是：`[0, 300577]`，我们现在希望绘制一个热力图来展现这些数据的分布：每一个格子代表一个人，将工资映射为格子的颜色。

首先我们可以先用如下 Linear 比例尺来看看效果。

```js
const scale = createLinear({
  domain: [0, 300577],
  range: ['white', 'red'],
  interpolate: interpolateColor
})
```

可视化后的效果如下图，可以发现我们能获得的信息很少，因为我们很难去区别这些颜色。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d55dbf591e3c4be6b596d56a3c8577b8~tplv-k3u1fbpfcp-zoom-1.image)

**所以我们需要离散的分布比例尺，将这些工资数据分组，每一个组使用一个颜色来编码**。而不同的分组方式需要使用不同的分布比例尺，我们接下来分别看看它们。

### Threshold

首先是 Threshold 比例尺，它的定义域是连续的，并且会被指定的分割值分成不同的组，它的使用方式如下。

```js
const scale = createThreshold({
  domain: [10000, 100000], // 1000, 100000 就是两个分割值
  range: ["white", "pink", "red"],
})
 // [0, 300577] 会被上面的分割值分成三组，然后如下映射：
 // [0, 10000) -> "white"
 // [10000, 100000) -> "pink"
 // [100000, 300577) -> "red"
```

使用上面声明的 Threshold 比例尺就会得到以下的效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5b0c659be8b48e59a199b5eaf77f415~tplv-k3u1fbpfcp-zoom-1.image)

现在我们就可以得到一些有效信息了：因为粉红色的格子最多，所以大多人的工资都在 `[10000, 100000)` 这个区间，少部分在 `[0, 10000)` 和 `[100000, 300577)` 这两个区间。

根据上面的介绍，以下 Threshold 比例尺的实现也不难理解了。

```js
// src/scale/threshold.js

export function createThreshold({ domain, range }) {
  const n = Math.min(domain.length, range.length - 1);
  return (x) => {
    const index = domain.findIndex((v) => x < v);
    return range[index === -1 ? n : index];
  };
}
```

### Quantize

相对于 Threshold 比例尺需要我们指定分割值，Quantize 比例尺会根据数据的范围帮我们选择分割值，从而把定义域分成间隔相同的组。

```js
// 因为 range 有3个值，所以 domain 会被分成三等份，
// 并且按照如下的规则映射
// [0, 300577 / 3) -> "white"
// [300577 / 3, 300577 * (2 / 3)) -> "pink"
// [300577 * (2 / 3), 300577) -> "red
const scale = createQuantize({
  domain: [0, 300577],
  range: ["white", "pink", "red"],
})
```

如果我们用 Quantize 比例尺可视化上面的数据，会得到如下的结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd59b46e540b4d268cc75bb32b075521~tplv-k3u1fbpfcp-zoom-1.image)

可以发现大部分人的工资都在前三分之一（白色）这个级别，只有极少数的人在后三分之一（红色）这个级别，这体现出了工资严重的分布不公平。这也是 使用 Quantize 比例尺存在的一个问题：当数据的分布有倾斜的时候，会出现几乎所有数据都在一个组，只有一些极端值在自己组的情况。

根据上面的描述，实现 Quantize 比例尺的关键就是计算得到分割值，然后在这个基础之使用 Threahold 比例尺即可，具体的实现如下。

```js
// src/scale/quantize.js

import { createThreshold } from "./threshold";

export function createQuantize({ domain: [d0, d1], range, ...rest }) {
  const n = range.length - 1;
  const step = (d1 - d0) / (n + 1);
  const quantizeDomain = new Array(n).fill(0).map((_, i) => step * (i + 1));
  return createThreshold({ domain: quantizeDomain, range, ...rest });
}
```

### Quantile

和 Quantize 比例尺不同是，Quantile 比例尺采用了另外得到分割值的策略： 根据数据出现的频率分组。

```js
// 首先把会 salary 按照升序排序
// 因为一共有100条数据，所以
// 前33条数据会被映射为 "white"
// 排名33到67的数据会被映射为 "pink"
// 最后33条数据会映射为 "red
const scale = createQuantile({
  domain: salary,
  range: ["white", "pink", "red"],
})
```

用 Quantize 比例尺进行可视化上面的数据会得到以下的效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae11fa51963b496081dd06418b84d39d~tplv-k3u1fbpfcp-zoom-1.image)

如果对上面的数据按照升序排序之后再进行可视化，就会得到如下的效果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0622843cf95d4624afc84e9cf8ed3106~tplv-k3u1fbpfcp-zoom-1.image)

可以发现，Quantile 比例尺把数据分成了每组数据的数量相同的三个组，也就是说通过上面的图我们可以真正能找到 “相对较低”、“普通”和“相对较高”这三个组对应的人。这里需要注意的是：Quantile 是根据数据在整个数据集的排名来分组的，所以会缺少数据绝对大小相关的分布信息。

类似于 Quantize 比例尺，我们在实现 Quantile 比例尺的时候也需要计算对应的分割值，具体的计算方式如下。

```js
// src/scale/quantile.js

import { createThreshold } from "./threshold";

export function createQuantile({ domain, range, ...rest }) {
  const n = range.length - 1;
  const sortedDomain = domain.sort((a, b) => a - b);
  const step = (sortedDomain.length - 1) / (n + 1);
  const quantileDomain = new Array(n).fill(0).map((_, index) => {
    const i = (index + 1) * step;
    const i0 = Math.floor(i);
    const i1 = i0 + 1;
    const v0 = sortedDomain[i0];
    const v1 = sortedDomain[i1];
    return v0 * (i1 - i) + v1 * (i - i0);
  });
  return createThreshold({ domain: quantileDomain, range, ...rest });
}
```

## 作业

最后给大家布置一个小任务，就是基于 Linear 比例尺，参考 Time 比例尺实现 Log 比例尺。除了实现 Log 比例尺的映射功能之外，也要实现它的 `ticks` 和 `nice` 方法。

Log 比例尺的表达式 `y = a * f(x) + b`中的 `f(x)` 应该为 `f(x) = Math.log(x)`， 这里只需要考虑 x 大于零的情况。对于 Log 比例尺来说，可读性较强的刻度就是指定 base 的指数。

```js
import { createLog } from './log.js';

const scale = createLog({
  domain: [10, 100],
  range: [10, 200],
  base: 2
});

scale.ticks(5); // [16, 32, 64]  = [2 ^ 4, 2 ^5, 2 ^6]

scale.nice(5); 
sclae.ticks(5); // [8, 16, 32, 64, 128];
```

具体的实现参考[这里](https://github.com/sparrow-vis/sparrow/blob/main/src/scale/log.js)，测试代码在[这里](https://github.com/sparrow-vis/sparrow/blob/main/__tests__/scale/log.spec.js)。

当我们实现了 Log 比例尺之后，我们就把常用的、Sparrow 后面会用到的比例尺都开发完成了，是不是觉得收获满满？最后把它们全部导出即可。

```js
// src/scale/index.js

export { createLinear, interpolateNumber } from './linear';
export { createIdentity } from './identity';
export { createOrdinal } from './ordinal';
export { createBand } from './band';
export { createPoint } from './point';
export { createQuantile } from './quantile';
export { createThreshold } from './threshold';
export { createQuantize } from './quantize';
export { createTime } from './time';
export { createLog } from './log';
```

完整的代码可以在[这里](https://github.com/sparrow-vis/sparrow/tree/main/src/scale)浏览，同样也可以通过[这里](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/scale)的测试代码来验证代码的正确性。

## 拓展

虽然在上面的开发过程中每一个比例尺最多就10几行代码，但其实真正能在实际场景下使用的比例尺远没有这么简单。这里有两点需要注意：

第一个是比例尺的丰富度。数据映射的场景很多，我们介绍的比例尺只是用于最常见的几种场景，更多的数据场景会使用一些更复杂的比例尺：比如 [Symlog](https://github.com/d3/d3-scale#symlog-scales)、[Sequential](https://github.com/d3/d3-scale#sequential-scales)，

第二个是性能上的要求。因为对每一个数据都会进行数据映射，所以在大数据的情况下，效率不高的比例尺实现会带来巨大的性能损失。

比如在目前 Ordinal 比例尺的实现中，找到 index 的算法的时间复杂度是 `O(n)`：和定义域的数据规模呈线性相关。

```js
export function createOrdinal({ domain, range }) {
  return (x) => {
    // findIndex 的每次都会遍历一次 domain
    const index = domain.findIndex((d) => equal(d, x));
    return range[index % range.length];
  };
}
```

这在数据量大的情况下这是不可接受的，但是它经过如下的优化就可以变成时间复杂度为 `O(1)` 的算法。

```js
export function createOrdinal({ domain, range }) {
  const indexMap = new Map(domain.map((d, i) => [d, i]));
  return (x) => {
    const index = indexMap.get(x); // O(1)
    return range[index % range.length];
  };
}
```

这里不会深入讲解优化和实现更多比例尺的细节，感兴趣的同学可以去参考：[d3-scale](https://github.com/d3/d3-scale) 和 [\@antv/scale](https://github.com/antvis/scale) 里面的实现。

## 小结

这篇文章我们先从了解比例尺理论开始，知道了比例尺的本质是一个函数，然后实现了一些常用的且在 Sparrow 后面会用到的比例尺。

这里简单总结一下根据数据属性的种类选择比例尺的思路。

| **定义域** | **值域** | **比例尺** |
| --- | --- | --- |
| 数值 | 数值 | Linear、Time、Log |
| 数值 | 序数 | Band、Point |
| 序数 | 序数 | Ordinal |
| 数值 | 序数 | Threshold、Quantile、Quantize |

同时我们也可以回答最开始提出的三个问题了。

- 为啥最后坐标轴生成的刻度的数量和希望的不一样？- 为了保证生成刻度的可读性，需要在希望刻度数量的基础上进行调整。
- nice 到底有什么用？- 调整定义域的范围，从而生成可读性更强的刻度。
- Threshold, Quantize, Quantile 比例尺有什么区别？- 获得将定义域分组的分割值的依据不同。Threshold 是使用指定的分割值，Quantize 是根据数据的绝对大小计算分割值，Quantile 是根据数据的排名来计算分割值。

文章的最后也提出了我们可以优化的空间，希望大家可以多去了解。在开发完比例尺模块之后，下一章将带大家认识坐标系（Coordinate）。如果说比例尺侧重于编码的映射过程，那么坐标系就侧重于编码的布局过程了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d95ca36382a4483596fdef144ee3dc3a~tplv-k3u1fbpfcp-zoom-1.image)

> 参考
> 
> - The Grammar of Graphics, 2nd Edition, Leland Wilkinson
> - [d3-scale](https://github.com/d3/d3-scale)
> - [Quantile, Quantize and Threshold scales](https://observablehq.com/@d3/quantile-quantize-and-threshold-scales)
    