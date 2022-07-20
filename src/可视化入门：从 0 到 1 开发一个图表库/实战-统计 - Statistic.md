
# 实战-统计 - Statistic
---

上一章介绍了辅助组件（Guide）相关的知识，聊了坐标轴、图例的本质和绘制方法，这一章我们将简单了解一下统计函数（Statistic），看一看它是如何改变几何图形的位置的。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45199749306c4a08ac2a15ac5a137957~tplv-k3u1fbpfcp-watermark.image?)

我们首先还是会从统计理论开始，然后实现几个比较常见的统计函数。接下来就让我们开始吧。

## 统计理论（Statistic）

在图形语法这本书中将统计定义为修改几何元素位置的函数，包括了以下这些函数。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c814d7303b804e2b9954ea93df53dc04~tplv-k3u1fbpfcp-watermark.image?)

这本书里除了统计可以修改几何元素的位置，几何元素的调整（Modifier）也是可以的，比如如下的这些。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33b35615a5fc44cd8fa8d1e7bacd984c~tplv-k3u1fbpfcp-watermark.image?)

因为它们拥有相同的功能，所以在这里我们都有统计函数去实现它们，并且在这里都把它们称为统计函数。接下来我们将实现以下的统计函数：

- 堆叠（StackY）
- 对称（SymmetryY）
- 归一化（NormalizeY）
- 分箱（BinX）

修改几何元素的位置就意味着修改或者产生位置通道的值，也就是在前面几何图形那章里面提到的 x、x1、y、y1 这些通道的值。这也是为什么上面的统计函数的名字是由 X 和 Y 结尾：X 说明该函数修改了该几何图形 x 通道的值，Y 说明该函数修改了该几何图形 x 通道的值。

具体的实现我们将在接下来的部分看到。正式开始写代码之前需要说明一点的是：**目前代码中各个模块下的 `utils.js` 文件的内容都统一放到了 `src/utils` 这个文件夹下。**

## 堆叠（StackY）

首先我们来看看堆叠（StackY），堆叠这个统计函数常常用于堆叠条形图和堆叠面积图。下面我们先来看一个简单的例子。

```js
const rainfall = [
  { city: 'London', month: 'Jan.', rainfall: 18.9 },
  { city: 'London', month: 'Feb.', rainfall: 28.8 },
  { city: 'London', month: 'Mar.', rainfall: 39.3 },
  { city: 'London', month: 'Apr.', rainfall: 81.4 },
  { city: 'London', month: 'May', rainfall: 47 },
  { city: 'London', month: 'Jun.', rainfall: 20.3 },
  { city: 'London', month: 'Jul.', rainfall: 24 },
  { city: 'London', month: 'Aug.', rainfall: 35.6 },
  { city: 'Berlin', month: 'Jan.', rainfall: 12.4 },
  { city: 'Berlin', month: 'Feb.', rainfall: 23.2 },
  { city: 'Berlin', month: 'Mar.', rainfall: 34.5 },
  { city: 'Berlin', month: 'Apr.', rainfall: 99.7 },
  { city: 'Berlin', month: 'May', rainfall: 52.6 },
  { city: 'Berlin', month: 'Jun.', rainfall: 35.5 },
  { city: 'Berlin', month: 'Jul.', rainfall: 37.4 },
  { city: 'Berlin', month: 'Aug.', rainfall: 42.4 },
];
```

当我们用条形图可视化上面的数据的时候，会得到下面的结果。这里有个奇怪的现象：条的数量和数据数量不一致！这是因为在同一月份的数量对应的条重合在一起了！

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18baba1a86dd485aa0a92e3f2f1df7e2~tplv-k3u1fbpfcp-watermark.image?)

为了解决上面的问题，其中一种方法就是通过堆叠函数把在相同月份的条堆叠起来，得到下面的效果。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2b80a9ba7ad4aedb5f8496a4b4a0ca2~tplv-k3u1fbpfcp-watermark.image?)

接下来我们就从数据层面来了解一下堆叠函数的原理。这里还是说一下，统计函数处理的数据不是我们的原始表格数据，而是一个和每个通道绑定的对象，参考下面的例子。

```js
// 原始数据
const raw = [
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 0, y: 3 }
];

// 和每个通道绑定的对象
const data = {
  index: [0, 1, 2],
  values: {
    x: [0, 0, 0],
    y: [1, 2, 3],
  },
};
```

了解了统计函数的输入之后我们就来看看堆叠函数的使用方式。可以发现它把 x 属性相同的数据的 y 属性的值堆叠起来，修改了 y 的值，并且产生了一个新的 y1 通道的值。

```js
import { createStackY } from '../../src/statistic';

const data = {
  index: [0, 1, 2],
  values: {
    x: [0, 0, 0],
    y: [1, 2, 3],
  },
};
const stack = createStackY();
stack(data);
// {
//   index: [0, 1, 2],
//   values: {
//     x: [0, 0, 0],
//     y1: [0, 1, 3],
//     y: [1, 3, 6],
//   },
// }
```

接下来我们就来看看具体的实现。

```js
// src/statistc/stack.js

import { group } from '../utils';

export function createStackY() {
  return ({ index, values }) => {
    const { x: X, y: Y } = values;
    
    // 根据 x 通道值分组
    const series = X ? Array.from(group(index, (i) => X[i]).values()) : [index];
    
    // 生成两个新的通道的值
    const newY = new Array(index.length);
    const newY1 = new Array(index.length);
    
    // 对每个分组的 y 进行累加
    for (const I of series) {
      for (let py = 0, i = 0; i < I.length; py = newY[I[i]], i += 1) {
        const index = I[i];
        newY1[index] = py;
        newY[index] = py + Y[index];
      }
    }
    
    return {
      index,
      // 返回修改后的 y 通道的值，并且新增一个 y1 通道
      values: { ...values, y: newY, y1: newY1 },
    };
  };
}
```

## 归一化（NormalizeY）

了解了堆叠这个统计函数之后，我们再来看看归一化这个统计函数。该函数常用于百分比条形图：比如在上面的堆叠条形图的基础上使用归一化统计函数，就会得到下面的例子。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4208f5c788f646119155883f51511667~tplv-k3u1fbpfcp-watermark.image?)

看完了例子，我们来看看使用方法。其实不难发现，归一化其实就是把 y 通道的值都变成了 `[0, 1]` 这个范围之内。

```js
import { createNormalizeY } from '../../src/statistic';
const data = {
  index: [0, 1, 2],
  values: {
    x: [0, 1, 2],
    y1: [2, 4, 6],
    y: [10, 10, 10],
  },
};
const normalizeY = createNormalizeY();
// {
//   index: [0, 1, 2],
//   values: {
//     x: [0, 1, 2],
//     y1: [0.2, 0.4, 0.6],
//     y: [1, 1, 1],
//   },
// }
```

接下来我们就来看看具体的实现。

```js
// src/statistc/normalize.js

import { group } from '../utils';

export function createNormalizeY() {
  return ({ index, values }) => {
    const {x: X } = values;
    
    // 按照 x 通道分组
    const series = X ? Array.from(group(index, (i) => X[i]).values()) : [index];
    
    // 生成定义了的 y 方向的通道值
    const newValues = Object.fromEntries(
      ['y1', 'y']
        .filter((key) => values[key])
        .map((key) => [key, new Array(index.length)]),
    );
    
    // 处理每一个分组
    for (const I of series) {
      // 找到该分组最大的 y
      const Y = I.flatMap((i) => Object.keys(newValues).map((key) => values[key][i]));
      const n = Math.max(...Y);
      
      // 归一化每一条数据的每一个 y 方向通道的值
      for (const i of I) {
        for (const key of Object.keys(newValues)) {
          newValues[key][i] = values[key][i] / n;
        }
      }
    }
    
    return {
      index,
      values: {
        ...values,
        ...newValues,
      },
    };
  };
}
```

## 对称（SymmetryY）

这之后我们来看看对称（SymmetryY），对称这个统计函数常常用于漏斗图和河流图。下面我们先来看一个简单的例子。

```js
export const countries = [
  { country: 'Europe', year: '1750', value: 163 },
  { country: 'Europe', year: '1800', value: 203 },
  { country: 'Europe', year: '1850', value: 276 },
  { country: 'Europe', year: '1900', value: 628 },
  { country: 'Europe', year: '1950', value: 547 },
  { country: 'Europe', year: '1999', value: 729 },
  { country: 'Europe', year: '2050', value: 408 },
  { country: 'Oceania', year: '1750', value: 200 },
  { country: 'Oceania', year: '1800', value: 200 },
  { country: 'Oceania', year: '1850', value: 200 },
  { country: 'Oceania', year: '1900', value: 460 },
  { country: 'Oceania', year: '1950', value: 230 },
  { country: 'Oceania', year: '1999', value: 300 },
  { country: 'Oceania', year: '2050', value: 300 },
  { country: 'Africa', year: '1750', value: 106 },
  { country: 'Africa', year: '1800', value: 107 },
  { country: 'Africa', year: '1850', value: 111 },
  { country: 'Africa', year: '1900', value: 1766 },
  { country: 'Africa', year: '1950', value: 221 },
  { country: 'Africa', year: '1999', value: 767 },
  { country: 'Africa', year: '2050', value: 133 },
  { country: 'Asia', year: '1750', value: 502 },
  { country: 'Asia', year: '1800', value: 635 },
  { country: 'Asia', year: '1850', value: 809 },
  { country: 'Asia', year: '1900', value: 5268 },
  { country: 'Asia', year: '1950', value: 4400 },
  { country: 'Asia', year: '1999', value: 3634 },
  { country: 'Asia', year: '2050', value: 947 },
];
```

在上面数据的基础上，用区域几何图形加上堆叠统计函数我们可以得到以下的堆叠面积图。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46e5f1e22a5b48de8e207b2d73b28fe5~tplv-k3u1fbpfcp-watermark.image?)

但如果我们继续加入对称统计函数，就可以得到下面的河流图，可以发现它是关于 `y = 4000` 对称的！

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efa80dde41f84af2b6525ad6b79916a8~tplv-k3u1fbpfcp-watermark.image?)

接下来我们就从数据层面了解一下它的使用方式。可以发现对称其实是改变了 y 和 y1 这两个通道值。在根据 x 通道分组的基础上，让每个组 y 方向通道的平均值保持一致，并且选择最大的那一个平均值。

```js
import { createSymmetryY } from '../../src/statistic';

const data = {
  index: [0, 1, 2],
  values: {
    x: [0, 1, 2],
    y1: [2, 4, 6],
    y: [8, 8, 8],
  },
};

const symmetryY = createSymmetryY();
symmetryY(data);
// {
//   index: [0, 1, 2],
//   values: {
//     x: [0, 1, 2],
//     y1: [4, 5, 6],
//     y: [10, 9, 8],
//   },
// }
```

接下来我们就来看看具体的实现。

```js
// src/statistc/symmetry.js

import { group } from '../utils';

export function createSymmetryY() {
  return ({ index, values }) => {
    const {x: X} = values;
    
    // 按照 x 方向分组
    const series = X ? Array.from(group(index, (i) => X[i]).values()) : [index];
    const newValues = Object.fromEntries(
      ['y1', 'y']
        .filter((key) => values[key])
        .map((key) => [key, new Array(index.length)]),
    );

    // 计算每个分组 y 方向的平均值
    const M = new Array(series.length);
    for (const [i, I] of Object.entries(series)) {
      const Y = I.flatMap((i) => Object.keys(newValues).map((key) => values[key][i]));
      const min = Math.min(...Y);
      const max = Math.max(...Y);
      M[i] = (min + max) / 2;
    }

    // 找到最大的平均值
    const maxM = Math.max(...M);
    
    // 对 y 方向的通道进行调整
    for (const [i, I] of Object.entries(series)) {
      const offset = maxM - M[i];
      for (const i of I) {
        for (const key of Object.keys(newValues)) {
          newValues[key][i] = values[key][i] + offset;
        }
      }
    }
    
    return {
      index,
      values: {
        ...values,
        ...newValues,
      },
    };
  };
}
```

## 分箱（BinX）

最后我们来看看分箱（BinX），分箱这个统计函数常常用于直方图，用于看数据的分布。

```js
const rainfall = [
  { city: 'London', month: 'Jan.', rainfall: 18.9 },
  { city: 'London', month: 'Feb.', rainfall: 28.8 },
  { city: 'London', month: 'Mar.', rainfall: 39.3 },
  { city: 'London', month: 'Apr.', rainfall: 81.4 },
  { city: 'London', month: 'May', rainfall: 47 },
  { city: 'London', month: 'Jun.', rainfall: 20.3 },
  { city: 'London', month: 'Jul.', rainfall: 24 },
  { city: 'London', month: 'Aug.', rainfall: 35.6 },
  { city: 'Berlin', month: 'Jan.', rainfall: 12.4 },
  { city: 'Berlin', month: 'Feb.', rainfall: 23.2 },
  { city: 'Berlin', month: 'Mar.', rainfall: 34.5 },
  { city: 'Berlin', month: 'Apr.', rainfall: 99.7 },
  { city: 'Berlin', month: 'May', rainfall: 52.6 },
  { city: 'Berlin', month: 'Jun.', rainfall: 35.5 },
  { city: 'Berlin', month: 'Jul.', rainfall: 37.4 },
  { city: 'Berlin', month: 'Aug.', rainfall: 42.4 },
];
```

比如我们想看看上面数据中的 rainfall 这个属性的分布情况，就可以对该属性进行分箱，最后得到下面的直方图。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28ebc280b4324e309902d03fe3c49982~tplv-k3u1fbpfcp-watermark.image?)

参考上面的例子：分箱可以简单理解为对连续数据进行分组。对于离散数据的分组很好理解，但是对于连续数据听上去就有点奇怪了：连续的怎么分？所以我们首先需要计算一些均匀的分割值，把连续的数据范围分成一段段的，然后对每一段所包含的数据进行聚合。

下面我们通过使用方式去深入了解一下它。可以发现我们将数据划分为了 `[0, 5, 10, 15, 20, 25, 30, 35]` 这些区间，每个区间的聚合方式选择了计数，并且将产生值作为了 fill 这个通道。同时根据划分的区间，修改了 x 和 y 通道，生成了 x1 通道。

```js
import { createBinX } from '../../src/statistic';
const data = {
  index: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  values: {
    x: [3, 6, 7, 12, 13, 12, 13, 13, 16, 17, 18, 23, 33, 30],
    y: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
};

const binX = createBinX({ channel: 'fill' });
binX(data);
// {
//   index: [0, 1, 2, 3, 4, 6],
//   values: {
//     x: [0, 5, 10, 15, 20, 25, 30],
//     x1: [5, 10, 15, 20, 25, 30, 35],
//     fill: [1, 2, 5, 3, 1, 0, 1],
//     y: [1, 1, 1, 1, 1, undefined, 1],
//   },
// }
```

接下来我们就来看看具体的实现。

```js
// src/statistc/bin.js

import { bisect, ticks, identity, group, tickStep, floor, ceil, firstOf, min, max } from '../utils';

// 计算划分区间
// 这里我们使用 linear scale 的 ticks 算法
function bin(values, count = 10, accessor = identity) {
  // 计算原始 step
  const minValue = min(values, accessor);
  const maxValue = max(values, accessor);
  const step = tickStep(minValue, maxValue, count);
  
  // 计算 nice 之后的 step
  const niceMin = floor(minValue, step);
  const niceMax = ceil(maxValue, step);
  const niceStep = tickStep(niceMin, niceMax, count);
  
  // 生成区间
  const thresholds = ticks(niceMin, niceMax, count);
  
  // 区间包含首位两个值，并且去重
  return Array.from(new Set([
    floor(niceMin, niceStep),
    ...thresholds,
    ceil(niceMax, niceStep),
  ]));
}

export function createBinX({ count = 10, channel, aggregate = (values) => values.length } = {}) {
  return ({ index, values }) => {
    const { [channel]: C, x: X, x1, ...rest } = values;
    const keys = Object.keys(rest);
    
    // 计算区间
    const thresholds = bin(X, count);
    const n = thresholds.length;
    
    // 分组，依据是二分查找找到对应的区间
    const groups = group(index, (i) => bisect(thresholds, X[i]) - 1);
    
    // 过滤掉没有数据点的区间
    const I = new Array(n - 1).fill(0).map((_, i) => i);
    const filtered = I.filter((i) => groups.has(i));
    
    return {
      index: filtered,
      values: Object.fromEntries([
        // 修改其余的原始通道
        // 取该组该通道的第一个值作为新生成的值
        ...keys.map((key) => [key, I.map((i) => {
          if (!groups.has(i)) return undefined;
          return values[key][firstOf(groups.get(i))];
        })]),
        
        // 聚合并且产生新的通道
        // 这里的聚合方式为简单的计数
        [channel, I.map((i) => {
          if (!groups.has(i)) return 0;
          return aggregate(groups.get(i).map((index) => values[index]));
        })],
        
        // 生成 x 和 x1 通道
        ['x', thresholds.slice(0, n - 1)],
        ['x1', thresholds.slice(1, n)],
      ]),
    };
  };
}
```

本章的所有统计函数就开发完成了，完整的代码可以在[这里](https://github.com/sparrow-vis/sparrow/tree/main/src/statistic)浏览，同样也可以通过[这里](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/statistic)的测试代码来验证代码的正确性。

## 小结

这一章的内容大到这里就全部结束了。统计是一个比较难以理解的部分，在之后了解整个渲染流程之后，大家应该会更加清楚一点。

相同的效果也可以通过预处理数据得到，比如使用 AntV 的 [DataSet](https://github.com/antvis/data-set) 这个库。但是这样就不是一个统一的数据分析流程了，因为它不在 Sparrow 的可视化渲染流程之内，使用起来会比较割裂。

在了解完统计之后，下一章我们将进入视图（View），看看如何一次绘制多个图表。

> 参考资料
> 
> - The Grammar of Graphics, 2nd Edition, Leland Wilkinson
    