
# 实战-渲染引擎 - Renderer
---

> 感谢[厨神](https://github.com/Aarebecca)参与这篇文章：什么是渲染引擎、为什么需要渲染引擎以及 \@antv/g 相关部分的写作！

之前在使用 SVG 开发一个条形图的过程中，我们发现有一些地方不方便。比如我们每次绘制一个元素，都需要三步：创建元素，设置元素属性，最后再挂载元素。

```js
// 创建元素 
const rect = createSVGElement('rect'); 

// 设置属性 
rect.setAttribute('x', 10); 
rect.setAttribute('y', 10); 
rect.setAttribute('fill', 'red'); 
rect.setAttribute('width', 50); 
rect.setAttribute('height', 50); 

// 挂载元素 
g.appendChild('rect');
```

当画布中元素较少时，这种方式还可以忍受。但随着元素数量的增长，这会变得非常冗余和繁琐。所以我们需要开发一个非常简单和轻量级的**渲染引擎（Renderer\)**  ，用它简化我们绘图的流程。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c6c10529aa1492eaffaa83d9dc2688a~tplv-k3u1fbpfcp-zoom-1.image)

通过上图可以发现：Sparrow 将选择 SVG 而不是 Canvas2D 来作为绘图技术，这是因为 Sparrow 对性能没有要求，同时 SVG 相对于 Canvas2D 更好测试一点（SVG 有 DOM 结构，可以直接检查 DOM 来进行调试）。

接下来我们先从什么是渲染引擎讲起以及可视化需要它的原因，然后实现一个简单的渲染引擎，最后会简单拓展一下开源社区一些优秀的渲染引擎。

## 什么是渲染引擎

渲染引擎这一概念在不同领域有着不同的含义。对于前端开发者来数，渲染引擎是 [WebKit](https://link.juejin.cn/?target=https%3A%2F%2Fwebkit.org%2F "https://webkit.org/")、[Blink](https://link.juejin.cn/?target=https%3A%2F%2Fwww.chromium.org%2Fblink "https://www.chromium.org/blink") 这样的浏览器排版引擎（或者说是内核），它负责解析 HTML 和 CSS 文档，并决定了文档里的元素将以怎样的形式放置在页面中的什么位置（即排版）。

对于艺术和计算机动画工作者来说，渲染引擎是基础图形绘制库，一般具有以下特点：

- 能够绘制基本图形，如：点、直线、多边形、曲线等
- 支持图形内部填充、阴影效果等
- 支持纹理与贴图
- 抗锯齿以及亚像素优化
- 跨平台运行

更高阶的渲染引擎甚至支持粒子系统、光线追踪等效果。

在数据可视化与可视分析领域，尤其是前端可视化方向，我们所使用的渲染引擎更偏向后者，但又有所区别。受平台及场景制约，前端可视化渲染引擎在具备上述特点的同时，还需要具备高性能、轻量化的特性，以满足在低网络传输带宽、低绘制性能等极端场景下的图形渲染需求。此外，在面向分析的可视化领域，3D 视图可能会导致意料之外的错误感知与洞察，因此 2D 渲染引擎得到了更大规模的应用。

## 为什么需要渲染引擎

用户大可直接在浏览器提供的 Canvas2D, SVG 和 WebGL 中使用原生语法直接绘制想要的图形，那么为什么还需要渲染引擎呢？包括上面提到的，这里给出几点原因：

- 管理图元：使用渲染引擎能够更轻松的绘制并管理图形元素。
- 提供完善的动画与事件机制：原声语法绘制动画相对比较麻烦。
- 性能优化：渲染引擎基于底层渲染器的特性进行了大量优化工作，如脏矩阵渲染、分层渲染等，能够取得更好的渲染性能。使得开发者能够专注于视图的构建。
- 多个渲染器之间任意切换：如果有同时在这两种渲染器中进行绘制的需求，需要针对不同的渲染器进行单独开发，提高工作量的同时也难以保证其一致性。使用渲染引擎绘制时只需要指定所需的渲染器即可完成切换。

现在我们从概念上简单聊了一下渲染引擎，就像我们一直强调的：具体的实战能帮助我们更好的理解概念，所以接下来我们就来开发 Sparrow 需要的渲染引擎。

## 功能设计

每一次开发都伴随着功能设计，它是我们接下来开发时候依据的蓝图。

因为 Sparrow 的功能相对简单，所以我们渲染器的功能用不复杂，主要侧重于更加轻松地绘制并且管理图形元素，简化我们绘制图形的流程。它主要有两个功能：

- 绘制基本图形：支持 `rect`、`circle`、`line`、`path`、`text`、`ring` 这几种基本图形的绘制。
- 进行坐标系变换：支持 `translate`，`scale`，`rotate` 这三种变换，同时可以使用类似 `Canvas2D` 的 `save` 和 `restore` 去管理坐标系变换的状态。

具体期望的使用方法如下：

```js
import { createRenderer } from 'renderer'; 

// 创建渲染器
const renderer = createRenderer(600, 400);

// 绘制基本图形 
renderer.rect({
  x: 10, 
  y: 10, 
  width: 50, 
  height: 50, 
  fill: 'red', 
});

// 坐标变换 
renderer.save(); 
renderer.scale(2, 2); 
renderer.rect({ 
  x: 10, 
  y: 10, 
  width: 50, 
  height: 50 
}); 
renderer.restore();
```

在开始将我们的功能设计落地之前，我们再来看看额外的一个和测试相关的约定。

## 测试约定

**本项目是测试驱动的，所以会有测试代码，但是不会在文章里面介绍它们。**  这主要是因为是因为篇幅有限，同时不是小册子的核心内容。当然每当我们新增一个功能的时候，会给出测试代码的仓库地址，大家完成相应的功能可以用提供的测试代码来验证功能是否正确。

比如大家开发完成了 `foo` 这个函数，就可以增加以下的测试代码，然后运行：`npx jest __tests__/hello.spec.js` 看是否有问题。

```js
// __tests__/hello.spec.js 

import { foo } from '../src/foo'; 

describe('test foo', () => { 
  it('should returns foo', () => { 
    expect(hello()).toBe('foo'); 
  }); 
});
```

同时我们在写代码的过程中不会完全遵循 `airbnb-base` 的规范，所以需要修改 .eslintrc.js 如下，关闭一些规则的校验。

```js
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    // 关闭 eslint 的如下功能
    'import/prefer-default-export': 0,
    'no-use-before-define': 0,
    'no-shadow': 0,
    'no-restricted-syntax': 0,
    'no-return-assign': 0,
    'no-param-reassign': 0,
    'no-sequences': 0,
    'no-loop-func': 0,
    'no-nested-ternary': 0,
  },
};
```

不小心又说了这么多废话，接下来我们直接进入开发！

## 创建渲染引擎（createRenderer）

我们首先来实现 `createRenderer` 这个函数来返回我们的渲染器对象。它的所有功能都是通过这个对象对外暴露的。根据上面的功能设计，我们不难得到以下的代码。

```js
// src/renderer/renderer.js

import { createContext } from './context';
import {
  line, circle, text, rect, path, ring,
} from './shape';
import {
  restore, save, scale, translate, rotate,
} from './transform';

export function createRenderer(width, height) {
  const context = createContext(width, height); // 创建上下文信息
  return {
    line: (options) => line(context, options), 
    circle: (options) => circle(context, options),
    text: (options) => text(context, options),
    rect: (options) => rect(context, options),
    path: (options) => path(context, options),
    ring: (options) => ring(context, options), // 绘制圆环
    restore: () => restore(context),
    save: () => save(context),
    scale: (...args) => scale(context, ...args),
    rotate: (...args) => rotate(context, ...args),
    translate: (...args) => translate(context, ...args),
    node: () => context.node, // 下面会讲解
    group: () => context.group, // 下面会讲解
  };
}
```

```js
// src/renderer/index.js

export { createRenderer } from './renderer';
```

通过上面的代码我们可以发现：在初始化一个渲染器的时候，首先会去创建一个上下文 ，然后再把它给其他函数使用。接下来我们先看看上下文的创建，之后再实现其他函数。

## 创建上下文（createContext）

对于渲染引擎来说，上下文（Context）主要用于保存一些绘制或者其他功能需要的全局的信息，比如挂载画布的容器，当前的填充颜色，边框粗细等。

对于 Sparrow 需要的渲染器来说，它需要的 Context 比较简单：

- 画布节点：这是一个 svg 节点，方便使用者将其挂载到 DOM 需要的位置。
- 挂载节点：这是一个 g 节点，是当前可以挂载新元素的节点。后面可以看到，我们可以通过更新它来到达管理坐标系变换的功能。

Context 的创建是由如下的 `createContext(width, height)` 这个函数实现的。

```js
// src/renderer/context.js

import { createSVGElement, mount } from './utils';

export function createContext(width, height) {
  // 创建画布 svg 节点，并且设置宽高
  const svg = createSVGElement('svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // 创建挂载 g 节点，并且把该 g 节点挂载到 svg 节点上
  const g = createSVGElement('g');
  mount(svg, g);

  //返回画布节点和挂载节点
  return {
    node: svg,
    group: g,
  };
}
```

```js
// src/renderer/utils.js

// 创建 SVG 元素
export function createSVGElement(type) {
  return document.createElementNS('http://www.w3.org/2000/svg', type);
}

// 将 child 节点挂载到 parent 节点上面
export function mount(parent, child) {
  if (parent) {
    parent.appendChild(child);
  }
}
```

在[这里](https://github.com/sparrow-vis/sparrow/blob/main/__tests__/renderer/renderer.spec.js)复制测试代码到本地，通过 `DEBUG_MODE=1 npx jest __tests__/renderer/renderer.spec.js` 运行它们，如果能得到下面的效果，那么就没有什么问题了。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9be0781bc77f4f97bf96c05dbd7bfb67~tplv-k3u1fbpfcp-zoom-1.image)

创建 Context 大概就是这样，接下来我们就看看如何基于这个 Context 去绘制基础图形。

## 绘制基本图形

像文章开头说的那样，在 SVG 环境下我们绘制一个基本图形需要三步：创建元素、设置属性和挂载元素。

因为绘制不同的图形只是在创建元素阶段指定不同的元素类型，所以我们把上面三步封装成一个通用的 `shape` 函数：

```js
// src/renderer/shape.js

import { applyAttributes, createSVGElement, mount } from './utils';

export function shape(type, context, attributes) {
  const { group } = context; // 挂载元素
  const el = createSVGElement(type); // 创建对应的元素
  applyAttributes(el, attributes); // 设置属性

  mount(group, el); // 挂载
  return el; // 返回该元素

}
```

```js
// src/renderer/utils.js

export function applyAttributes(element, attributes) {
  for (const [key, value] of Object.entries(attributes)) {
    // 这里需要把类似 strokeWidth 的属性转换成 stroke-width 的形式
    // 思路就是将大写字母替成 - + 对应的小写字母的形式
    // 下面涉及到正则匹配，不太了解的同学可以去下面的链接学习：
    // https://juejin.cn/post/6844903487155732494
    const kebabCaseKey = key.replace(/[A-Z]/g, (d) => `-${d.toLocaleLowerCase()}`);
    element.setAttribute(kebabCaseKey, value);
  }
}
```

当我们完成了 shape 函数之后，那么绘制 `line`、`rect`，`circle` 等这些基本元素就非常容易了，只要给 `shape` 传入不同的元素的种类并且根据需要进行简单增强即可。

```js
// src/renderer/shape.js

export function line(context, attributes) {
  return shape('line', context, attributes);
}

// rect 不支持 width 和 height 是负数，下面这种情况将绘制不出来
// <rect width="-60" height="-60" x="100" y="100" /> ❌
// 为了使其支持负数的 width 和 height，我们转换成如下的形式
// <rect width="60" height="60" x="40" y="40" /> ✅
export function rect(context, attributes) {
  const {
    width, height, x, y,
  } = attributes;

  return shape('rect', context, {
    ...attributes,
    width: Math.abs(width),
    height: Math.abs(height),
    x: width > 0 ? x : x + width,
    y: height > 0 ? y : y + height,
  });
}

export function circle(context, attributes) {
  return shape('circle', context, attributes);
}

// text 元素是将展示内容放在标签内部，而不是作为标签的属性
// <text text='content' /> ❌
// <text>content</text> ✅
export function text(context, attributes) {
  const { text, ...rest } = attributes;
  const textElement = shape('text', context, rest);
  textElement.textContent = text; // 通过 textContent 设置标签内的内容
  return textElement;
}

// 对 path 不熟悉的同学可以去这里学习
// https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths
// path 的属性 d （路径）是一个字符串，拼接起来比较麻烦，这里我们通过数组去生成
// [
//  ['M', 10, 10],
//  ['L', 100, 100],
//  ['L', 100, 10],
//  ['Z'],
// ];
// 上面的二维数组会被转换成如下的字符串
// 'M 10 10 L 100 100 L 100 10 Z'
export function path(context, attributes) {
  const { d } = attributes;
  return shape('path', context, { ...attributes, d: d.flat().join(' ') });
}
```

除了支持 SVG 本来就有的图形之外，我们还需要额外支持一个图形（后面 Dount 图表会使用）：圆环（Ring）。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e57f063bc06745929e76004257799e90~tplv-k3u1fbpfcp-zoom-1.image)

我们将用三个圆去模拟一个圆环，它们的填充色都是透明的，其中两个圆的边框去模拟圆环的边框\(上面的红色部分），用一个圆的边框去模拟圆环本身（上面蓝色部分）。实现细节如下：

```js
export function ring(context, attributes) {
  // r1 是内圆的半径，r2 是外圆的半径
  const {
    cx, cy, r1, r2, ...styles
  } = attributes;
  const { stroke, strokeWidth, fill } = styles;
  const defaultStrokeWidth = 1;
  const innerStroke = circle(context, {
    fill: 'transparent',
    stroke: stroke || fill,
    strokeWidth,
    cx,
    cy,
    r: r1,
  });
  const ring = circle(context, {
    ...styles,
    strokeWidth: r2 - r1 - (strokeWidth || defaultStrokeWidth),
    stroke: fill,
    fill: 'transparent',
    cx,
    cy,
    r: (r1 + r2) / 2,
  });
  const outerStroke = circle(context, {
    fill: 'transparent',
    stroke: stroke || fill,
    strokeWidth,
    cx,
    cy,
    r: r2,
  });
  return [innerStroke, ring, outerStroke];
}
```

同样复制[这里](https://github.com/sparrow-vis/sparrow/blob/main/__tests__/renderer/shape.spec.js)的测试代码并且运行，如果运行测试代码能得到如下的效果，那么就也没有什么大问题了。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2cb1d69390c4588a72ca36606976aac~tplv-k3u1fbpfcp-zoom-1.image)

实现了绘制图形就这个功能，那么接下来我们就来完成坐标系变换这个功能。

## 坐标系变换

通过前面的学习，我们了解到：在 SVG 中使用坐标变换的能力其实就是给 g 元素添加对应的 transform 属性，然后被 g 元素包裹的所有子元素都会应用这个 transform 属性所指定的变换。

我们的目标让我们的渲染引擎支持：平移（translate）、放缩（Scale\) 旋转（Rotate）这三种变换。这三种变换虽然名字和参数不同，但添加流程都是一样的，所以我们可以创建一个名叫 `transform` 的函数来统一这个流程。

```js
// src/renderer/transform.js

import { applyTransform, createSVGElement, mount } from './utils';

export function transform(type, context, ...params) {
  // type 是希望的变换种类：scale，translate，rotate 等
  const { group } = context;
  applyTransform(group, `${type}(${params.join(', ')})`);
}
```

```js
// src/renderer/utils.js

export function applyTransform(element, transform) {
  const oldTransform = element.getAttribute('transform') || '';
  // 将新的变换指定到后面的变换后，这里需要字符串拼接
  const prefix = oldTransform ? `${oldTransform} ` : '';
  element.setAttribute('transform', `${prefix}${transform}`);
}
```

这之后就不难实现如下的坐标系变换了。

```js
// src/renderer/transform.js

export function translate(context, tx, ty) {
  transform('translate', context, tx, ty);
}

export function rotate(context, theta) {
  transform('rotate', context, theta);
}

export function scale(context, sx, sy) {
  transform('scale', context, sx, sy);
}
```

在使用坐标系变换的时候，除了应用对应变换之外，还应该实现对变换状态的管理。这个地方的核心就是控制当前变换影响的元素范围。基于 SVG 通过 g 元素来指定变换的特点，我们只用更新当前挂载节点，使得当前变换只会影响当前挂载节点下面的元素即可。

```js
// src/renderer/transform.js

export function save(context) {
  const { group } = context;
  const newGroup = createSVGElement('g');
  mount(group, newGroup);
  context.group = newGroup;
}
```

```js
// src/renderer/transform.js

export function restore(context) {
  const { group } = context;
  const { parentNode } = group;
  context.group = parentNode;
}
```

一切正常的话，运行[这里](https://github.com/sparrow-vis/sparrow/blob/main/__tests__/renderer/transform.spec.js)的测试代码会有以下效果：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f77b14702d64565879b080bebe455de~tplv-k3u1fbpfcp-zoom-1.image)

Sparrow 需要的渲染引擎我们已经完成啦，完整的代码可以在[这里](https://github.com/sparrow-vis/sparrow/tree/main/src/renderer)查看。

## 拓展

虽然上面渲染引擎的开发很简单，但是一个真正优秀的渲染引擎远不如此。接下来我们就来了解几个社区上优秀且强大的渲染引擎。

首先我们来看看 [\@antv/g](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fantvis%2Fg "https://github.com/antvis/g") ，它是 AntV 技术栈 [G2](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fantvis%2Fg2 "https://github.com/antvis/g2")、[G6](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fantvis%2Fg6 "https://github.com/antvis/g6") 等成员的底层渲染引擎（最近 \@antv/g 也发布了5.0，大家可以去了解一下！），它具有以下特点：

- 强大、可扩展的渲染能力，并内置常用的基础图形。
- 极致的渲染性能，支持大数据量的可视化场景。
- 完整模拟浏览器 DOM 的事件，与原生事件的表现无差异。
- 流畅的动画实现，以及丰富的配置接口。
- 同时提供 Canvas 和 SVG 版本的实现，且两者的 API 基本保持一致。

用 \@antv/g 绘制一个简单的红色的圆形的代码如下：

```js
// 引入并选择渲染器
import { Renderer as CanvasRenderer } from '@antv/g-svg';
import { Canvas, Circle } from '@antv/g';


// 实例化渲染器
const canvasRenderer = new CanvasRenderer();

// 创建一个新的 G 画布
const canvas = new Canvas({
  container: 'container', // 画布的 DOM ID
  width: 500, // 画布宽度
  height: 500, // 画布高度
  renderer: canvasRenderer, // 渲染器实例化对象
});

// 创建一个圆形
const circle = new Circle({
  style: {
    x: 250,
    y: 250,
    r: 100,
    fill: 'red',
  },
});

// 绘制圆形
canvas.appendChild(circle);
```

如果说 \@antv/g 更注重性能上的提升，那么[p5.js](https://link.juejin.cn/?target=https%3A%2F%2Fp5js.org%2Fzh-Hans%2F "https://p5js.org/zh-Hans/") 就更注重易用性。

p5.js 表面上说是一个面向艺术家、设计师、教育家、初学者以及任何其他人的创意编程库，但是它本身其实是一个渲染引擎。它不仅提供了一套完整，简洁的绘制接口，还对 HTML5 元素（如文字、输入框、视屏、摄像头及音频）的使用有支持。

下面我们同样来看看 p5.js 是如何绘制一个圆形的。

```js
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  fill('red');
  circle(100, 100, 50, 50);
}
```

\@antv/g 和 p5js 都是绘制常规风格元素的渲染引擎，[rough.js](https://link.juejin.cn/?target=https%3A%2F%2Froughjs.com%2F "https://roughjs.com/") 就不一样了：它绘制出来元素的效果都是手绘风格！

```js
rc.circle(50, 50, 80, { fill: 'red' }); // fill with red hachure
rc.rectangle(120, 15, 80, 80, { fill: 'red' });
rc.circle(50, 150, 80, {
  fill: "rgb(10,150,10)",
  fillWeight: 3 // thicker lines for hachure
});
rc.rectangle(220, 15, 80, 80, {
  fill: 'red',
  hachureAngle: 60, // angle of hachure,
  hachureGap: 8
});
rc.rectangle(120, 105, 80, 80, {
  fill: 'rgba(255,0,200,0.2)',
  fillStyle: 'solid' // solid fill
});
```

上面的代码绘制出来的效果如下：

![68747470733a2f2f726f7567686a732e636f6d2f696d616765732f6d332e706e67.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7ca89ab5f4c485683a26feace1e8ced~tplv-k3u1fbpfcp-zoom-1.image)

## 作业

其实基于 roughjs 我们可以做出很多有意思的效果，比如我们可以基于 roughjs 封装和我们上面渲染器相同的 API 的手绘风格渲染器。这样当后面我们把 Sparrow 开发完成之后，我们只用修改渲染器就可以转换图表的绘制风格了。

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
  type: "interval",
  renderer: createPlugin(), // 使用自定义的渲染器
  encodings: {
    x: "genre",
    y: "sold",
    fill: "genre"
  },
});

document.getElementById("container").appendChild(chart);
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e2c2f7e0f2dc445bab8eebed6dce660a~tplv-k3u1fbpfcp-zoom-1.image)

这个作为作业大家可以自己尝试实现一下，也可以参考官方的[实现](https://github.com/sparrow-vis/rough-renderer/tree/main)。

## 小结

这一章我们了解了什么是渲染引擎，并且也知道了它想要解决的问题，了解到一个比较完整的渲染引擎应该具有以下特点：

- 轻松绘制和管理图形元素
- 优秀的渲染性能
- 对动画有比较好的支持
- 兼容不同渲染技术
- 完善的事件机制

这之后我们通过开发一个简单的渲染引擎，完成了绘制元素和坐标变换这两个功能。不仅加深了对渲染引擎的理解，也为后面 Sparrow 的更加轻松地绘制图形打下基础。

那么下一篇我们将进入第一个可视化模块的开发：比例尺（Scale），看看它是如何把数据属性映射为视觉属性的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e93df0e7d1af400aa64f4ff03076c1b9~tplv-k3u1fbpfcp-zoom-1.image)

最后的最后，这章我们算是正式进入 Sparrow 的开发了\!
    