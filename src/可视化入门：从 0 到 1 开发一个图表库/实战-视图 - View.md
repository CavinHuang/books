
# 实战-视图 - View
---

上一章我们聊了一系列比较抽象的统计函数，了解了它们是如何改变几何图形的位置的。这一章我们来谈谈视图，了解一下什么是视图，又该如何组合它们去搭建一个拥有很多视图的界面（如下图）。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6837b9bc56f64094917df04c7a69a7ed~tplv-k3u1fbpfcp-watermark.image?)

首先我们还是从视图理论开始，然后进入实战部分，去实现几个视图组合函数，最后再进行简单的小结。那么废话不多说，我们马上进入视图的学习。

## 视图理论

在可视化中，一个完整的视图至少由两个部分构成：几何元素和辅助组件（如下图。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f78bba1e26754af7b95ca341ef4f92fc~tplv-k3u1fbpfcp-watermark.image?)

上面的这张图是一个单视图图表，因为它只有一个视图。而下面这张图是一个多视图图表，因为它将多个视图组合在了一起。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9493b2ef3fdb4078bea613880a7b346e~tplv-k3u1fbpfcp-watermark.image?)

对于多视图图表来说，它其实是由一棵视图树构成。视图树类似于前端开发中的 DOM 树，只不过每一个节点不是一个 DOM 而是一个视图，类似的概念还有渲染引擎中的场景图（Scene Graph）。

在数据结构层面，视图树就是一个如下的嵌套对象。

```js
const viewTree = {
  type: 'layer',
  children: [
    {
      type: 'row',
      children: [{/.../}, {/.../}]
    },
    {
      type: 'interval',
    }
  ]
};
```

用 TypeScript 可以如下简单定义。

```ts
type ViewTree = {
  type?: string, // 当前节点的种类
  children?: ViewTree[], // 包含的孩子节点
  [key: string]: any,
}
```

不同的视图节点有不同的布局方法和功能，在这里我们将实现3种视图节点：

- 图层（Layer）：`type: 'layer'`
- 弹性盒子（Flex）：`type: 'col | row'`
- 分面（Facet）：`type: 'facet'`

而视图这个模块要做的就是解析这棵视图树，计算出每个视图区域的位置和大小，以及在这个区域有几个视图（视图可以重叠，之后我们会看见）。

接下来我们就正式进入开发环节。

## 创建视图（createViews）

视图模块就导出一个函数：**createViews\(tree, computes\)**。

该函数有两个参数，第一个参数是一个描述视图树的嵌套对象，第二个参数是一个对象，该对象的每一个值是一个支持的视图计算函数。该函数返回一个数组，数组的每一个元素是一个元组。

元组的第一个元素是一个如下的区域的描述：

```ts
type Area = {
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  [key:string]: any
}
```

元组的第二个元素是一个数组，数组的每一个元素是当前区域的视图：

`ViewTree[]`。

接下来我们就来看代码的实现。

```js
// src/view/view.js

import { computeFlexViews } from './flex';
import { computeFacetViews } from './facet';
import { computeLayerViews } from './layer';
import { descendants, group } from '../utils';

// 支持 4 种类型的节点
export function createViews(root, computes = {
  layer: computeLayerViews,
  col: computeFlexViews,
  row: computeFlexViews,
  facet: computeFacetViews,
}) {
  // 获得视图树的所有节点
  const nodes = descendants(root);
  
  // 计算根节点视图区域大小
  const { width = 640, height = 480, x = 0, y = 0 } = root;
  const rootView = { width, height, x, y };
  
  // 根据节点索引视图
  const nodeView = new Map([[root, rootView]]);

  for (const node of nodes) {
    const view = nodeView.get(node);
    const { children = [], type } = node;
    const computeChildrenViews = computes[type];
    if (computeChildrenViews) {
      // 计算孩子节点的区域大小
      const childrenViews = computeChildrenViews(view, node);
      if (computeChildrenViews !== computeFacetViews) {
      // 如果不是分面节点，孩子节点和计算出来的区域一一对应
        for (const [i, child] of Object.entries(children)) {
          nodeView.set(child, childrenViews[i]);
        }
      } else {
      // 如果是分面节点，将产生一些新的孩子节点
        for (const child of children) {
          for (const view of childrenViews) {
            nodeView.set({ ...child }, view);
          }
        }
      }
    }
  }

  // 将计算好的视图根据区域去分组
  const key = (d) => `${d.x}-${d.y}-${d.width}-${d.height}`;
  const keyViews = group(Array.from(nodeView.entries()), ([, view]) => key(view));
  return Array.from(keyViews.values()).map((views) => {
    const view = views[0][1];
    const nodes = views.map((d) => d[0]);
    return [view, nodes];
  });
}
```

```js
// src/utils/tree.js

export function descendants(root) {
  const nodes = [];
  const push = (d) => nodes.push(d);
  bfs(root, push);
  return nodes;
}

// 使用宽度优先搜索遍历这棵树
export function bfs(root, callback) {
  const discovered = [root];
  while (discovered.length) {
    const node = discovered.pop();
    callback(node);
    discovered.push(...(node.children || []));
  }
}
```

```js
// src/utils/index.js

export * from './tree';
```

## 图层（Layer）

图层（Layer）节点的孩子视图都是重合在一起的，该节点主要用于在一个区域中绘制多个几何元素，就比如如下的例子。

```js
const temperatures = [
  { month: 'Jan', city: 'Tokyo', temperature: 7 },
  { month: 'Jan', city: 'London', temperature: 3.9 },
  { month: 'Feb', city: 'Tokyo', temperature: 6.9 },
  { month: 'Feb', city: 'London', temperature: 4.2 },
  { month: 'Mar', city: 'Tokyo', temperature: 9.5 },
  { month: 'Mar', city: 'London', temperature: 5.7 },
  { month: 'Apr', city: 'Tokyo', temperature: 14.5 },
  { month: 'Apr', city: 'London', temperature: 8.5 },
  { month: 'May', city: 'Tokyo', temperature: 18.4 },
  { month: 'May', city: 'London', temperature: 11.9 },
  { month: 'Jun', city: 'Tokyo', temperature: 21.5 },
  { month: 'Jun', city: 'London', temperature: 15.2 },
  { month: 'Jul', city: 'Tokyo', temperature: 25.2 },
  { month: 'Jul', city: 'London', temperature: 17 },
  { month: 'Aug', city: 'Tokyo', temperature: 26.5 },
  { month: 'Aug', city: 'London', temperature: 16.6 },
  { month: 'Sep', city: 'Tokyo', temperature: 23.3 },
  { month: 'Sep', city: 'London', temperature: 14.2 },
  { month: 'Oct', city: 'Tokyo', temperature: 18.3 },
  { month: 'Oct', city: 'London', temperature: 10.3 },
  { month: 'Nov', city: 'Tokyo', temperature: 13.9 },
  { month: 'Nov', city: 'London', temperature: 6.6 },
  { month: 'Dec', city: 'Tokyo', temperature: 9.6 },
  { month: 'Dec', city: 'London', temperature: 4.8 },
];
```

我们用折线图将上面的数据可视化得到如下的结果，可以发现在该图区域中有两种几何元素：线和点，它们的辅助元素可以简单理解为重合了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e33b1b467c0e4efe84d63a9163dbbf21~tplv-k3u1fbpfcp-watermark.image?)

对于如下的视图树，绘出来时如下的结果。

```js
const viewTree = {
  type: 'layer',
  children: [{}, {}],
};

const views = createViews(viewTree);
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c73acfa389c45b58881f6001d5541ef~tplv-k3u1fbpfcp-watermark.image?)

它的实现非常简单，把自己的区域大小返回作为孩子节点的区域就好。

```js
// src/view/layer.js

export function computeLayerViews(box, node) {
  const { children = [] } = node;
  return new Array(children.length).fill(0).map(() => ({ ...box }));
}
```

## 弹性盒子（Flex）

弹性盒子（Flex）节点的孩子视图在水平或者竖直方向都是充满父容器的，该概念来自于前端开发中的 [Flex 布局](https://ruanyifeng.com/blog/2015/07/flex-grammar.html)。

该节点主要用于将区域划分为子区域，不同的子区域拥有不同的视图。该节点节点又分为两种类型：row 和 col。比如如果将上面例子中的容器类型从 layer 改成 row 的话就会得到如下的结果。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c77cb283fcd042fcb50c40947d8aea30~tplv-k3u1fbpfcp-watermark.image?)

对于如下的视图树，绘出来有如下的结果。

```js
const viewTree = {
  type: 'row', // 孩子水平排列
  flex: [1, 1], // 指定孩子的节点区域的比例
  padding: 40, // 孩子节点区域的间距
  children: [
    {},
    // 孩子竖直排列
    { type: 'col', children: [{}, {}] }, 
  ],
};

const views = createViews(viewTree);
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31cab5209bf549d4984b2f9e697a9ebb~tplv-k3u1fbpfcp-watermark.image?)

具体的代码实现如下：

```js
// src/view/flex.js

export function computeFlexViews(box, node) {
  const { type, children, flex = children.map(() => 1), padding = 40 } = node;
  const [mainStart, mainSize, crossSize, crossStart] = type === 'col'
    ? ['y', 'height', 'width', 'x']
    : ['x', 'width', 'height', 'y'];

  const sum = flex.reduce((total, value) => total + value);
  const totalSize = box[mainSize] - padding * (children.length - 1);
  const sizes = flex.map((value) => totalSize * (value / sum));

  const childrenViews = [];
  for (let next = box[mainStart], i = 0; i < sizes.length; next += sizes[i] + padding, i += 1) {
    childrenViews.push({
      [mainStart]: next,
      [mainSize]: sizes[i],
      [crossStart]: box[crossStart],
      [crossSize]: box[crossSize],
    });
  }
  return childrenViews;
}
```

## 分面（Facet）

最后我们来看看分面（Facet）节点。分面是可视化中一个常用的手段，主要用于对数据进行分组，不同组的数据在不同的视图中展示。

```js
const facet = [
  { city: 'London', month: 'Jan.', rainfall: 18.9, type: 'a' },
  { city: 'London', month: 'Feb.', rainfall: 28.8, type: 'a' },
  { city: 'London', month: 'Mar.', rainfall: 39.3, type: 'a' },
  { city: 'London', month: 'Apr.', rainfall: 81.4, type: 'a' },
  { city: 'London', month: 'May', rainfall: 47, type: 'b' },
  { city: 'London', month: 'Jun.', rainfall: 20.3, type: 'b' },
  { city: 'London', month: 'Jul.', rainfall: 24, type: 'b' },
  { city: 'London', month: 'Aug.', rainfall: 35.6, type: 'b' },
  { city: 'Berlin', month: 'Jan.', rainfall: 12.4, type: 'a' },
  { city: 'Berlin', month: 'Feb.', rainfall: 23.2, type: 'a' },
  { city: 'Berlin', month: 'Mar.', rainfall: 34.5, type: 'a' },
  { city: 'Berlin', month: 'Apr.', rainfall: 99.7, type: 'a' },
  { city: 'Berlin', month: 'May', rainfall: 52.6, type: 'b' },
  { city: 'Berlin', month: 'Jun.', rainfall: 35.5, type: 'b' },
  { city: 'Berlin', month: 'Jul.', rainfall: 37.4, type: 'b' },
  { city: 'Berlin', month: 'Aug.', rainfall: 42.4, type: 'b' },
];
```

比如如果如上的数据 x 方向按照 type 字段分组，y 方向按照 city 字段分组就会得到如下的结果。不难发现：在左上角的条形图中只包含 `city === "Berlin"` 以及 `type === "a"` 的数据。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/086c1312ad0c4d9dbe4ec28e369e17dc~tplv-k3u1fbpfcp-watermark.image?)

根据上面的案例我们可以发现，分面节点除了会计算孩子节点区域的大小，还会去过滤数据，所以它还会额外返回一个过滤数据的函数。使用方式如下：

```js
const data = [
  { sex: 'male', skin: 'white' },
  { sex: 'male', skin: 'black' },
  { sex: 'female', skin: 'white' },
  { sex: 'female', skin: 'yellow' },
];

const views = createViews({
  type: 'facet',
  // 通过 encodings 这个配置去指定 x 和 y 方向的分组
  encodings: {
    x: 'sex', // 根据 sex 属性分组
    y: 'skin', // 根据 skin 属性分组
  },
  data,
  padding: 20, // 指定区域之间的间隔
  children: [{}, {}],
});

const [, [view]] = views;
const { transform } = view; // 获取过滤数据的函数
transform(data); // [{ sex: 'male', skin: 'white' }]
```

最后绘制出来的效果如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32c343ef4a4341ea8021fd168b2cf2c0~tplv-k3u1fbpfcp-watermark.image?)

代码实现如下：

```js
// src/view/flex.js

import { group } from '../utils';

export function computeFacetViews(box, {
  data, encodings = {}, padding = 0,
  paddingLeft = 45, paddingRight = 45, paddingBottom = 45, paddingTop = 60,
}) {
  const { x, y } = encodings;
  const cols = x ? Array.from(group(data, (d) => d[x]).keys()) : [undefined];
  const rows = y ? Array.from(group(data, (d) => d[y]).keys()) : [undefined];
  const n = cols.length;
  const m = rows.length;
  const views = [];
  const width = box.width - paddingLeft - paddingRight;
  const height = box.height - paddingTop - paddingBottom;
  const boxWidth = (width - padding * (n - 1)) / n;
  const boxHeight = (height - padding * (m - 1)) / m;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < m; j += 1) {
      const transform = (data) => {
        const inRow = (d) => d[x] === cols[i] || cols[i] === undefined;
        const inCol = (d) => d[y] === rows[j] || rows[j] === undefined;
        return data.filter((d) => inRow(d) && inCol(d));
      };
      views.push({
        x: paddingLeft + box.x + padding * i + i * boxWidth,
        y: paddingRight + box.y + padding * j + j * boxHeight,
        width: boxWidth,
        height: boxHeight,
        transform, // 指定过滤函数
      });
    }
  }
  return views;
}
```

本章的所有视图计算函数就开发完成了，完整的代码可以在[这里](https://github.com/sparrow-vis/sparrow/tree/main/src/view)浏览，同样也可以通过[这里](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/view)的测试代码来验证代码的正确性。

## 小结

分面这一章就到这里结束了，我们通过这一章了解到了如下的几种视图组合方式：

- 图层（Layer）
- 弹性盒子（Flex）
- 分面（Facet）

不同的组合方式有不同的使用场景，它可以帮助我们搭建复杂的可视化图表界面，也可以提高我们的分析能力。

到目前为止，我们已经把渲染引擎和低级可视化模块开发完成了。接下来是时候将它们串联起来了，看看在整个渲染流程中它们该如何使用。下一章我们将进入 Sparrow 渲染流程 Plot 模块的开发。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/723fb646abdc4a96acc3e50010abf1e8~tplv-k3u1fbpfcp-zoom-1.image)
    