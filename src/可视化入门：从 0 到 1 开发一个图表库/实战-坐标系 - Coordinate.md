
# 实战-坐标系 - Coordinate
---

上一章给大家介绍了比例尺，它侧重于负责数据的映射，比如将数据映射为视觉元素的颜色、大小或者形状等属性。接下来会给大家介绍坐标系（Coordinate），它侧重于负责视觉元素的布局过程，将经过比例尺映射后的位置属性转换成画布坐标。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d95ca36382a4483596fdef144ee3dc3a~tplv-k3u1fbpfcp-zoom-1.image)

坐标系可以说是基于图形语法的图表库的一个独有的概念，它可以很方便的让图表在不同种类之间进行转换（比如从条形图转换成玫瑰图，堆叠条形图转换成饼图等等）。但是方便使用的同时，也带了实现上和理解的成本，所以希望大家看了这篇文章之后好好体会。

那么接下来我们将会从函数式编程讲起，因为 Coordinate 的开发和后续 Sparrow 的开发将依赖它。这之后再介绍坐标系理论以及实现方法，最后和前几章一样，进行简单的拓展。

## 函数式编程

我们首先进入函数式编程的学习。

相信大家都对面向对象编程这种编程模式（Object Oriented Programming，OOP）不陌生，毕竟很多人学习的第一门计算机编程语言可能就是 Java，而它就是一门典型的面相对象编程的语言。

这里将会给大家介绍另外一种编程模式：函数式编程（Funtional Programming, FP\)。在这里介绍函数式编程的目的主要有两个：

- 函数式编程相对于面向对象编程会有一些优点（我们之后会看见），Sparrow 的代码的目标就是尽量拥有这些优点，让代码更加函数式。了解函数式编程可以让我们更好理解 Sparrow 的代码架构和选择。
- Coordinate 的实现依赖于函数式编程两个非常重要的工具。

我们首先会从一个例子简单来认识函数式编程，然后介绍其中两个重要概念：一等公民（First Class）和纯函数（Pure Function），最后介绍上面提到的两个工具：函数合成（Compose）和函数柯里化（Curry）。

### 计算海鸥数量

这里我们会用 Franklin Frisby 教授的 [《Mostly Adequate Guide to Function Programming》](https://github.com/MostlyAdequate/mostly-adequate-guide/blob/master/ch01.md) 中的一个例子来初识函数式编程。

假如现有一个功能：计算多个海鸥群按照一定方式结合（Conjoin）和繁殖（Breed）后的海鸥总数。如果用面向对象的方式来实现该功能就如下：

```js
// 定义一个海鸥群
// 这个群可以和别的海鸥群结合（Conjoin)和繁殖（Breed）
class Flock {
  constructor(n) {
    this.seagulls = n;
  }

  conjoin(other) {
    this.seagulls += other.seagulls;
    return this;
  }

  breed(other) {
    this.seagulls *= other.seagulls;
    return this;
  }
}

const flockA = new Flock(4);
const flockB = new Flock(2);
const flockC = new Flock(0);
const result = flockA
  .conjoin(flockC)
  .breed(flockB)
  .conjoin(flockA.breed(flockB))
  .seagulls; // 32
```

上面这段代码不仅让我们难以跟踪一直在变的内部状态（群体的海鸥数量），而且计算结果也是不正确的：最后的总数应该是16，flockA 的数量在结合和繁殖过程中被永远改变了。

那么接下来我们如何用函数式编程来实现相同的功能。

```js
// add 相当于上面的 cojoin，multiply 相当于上面的 breed
// 这样命名的目的后面会讲
const add = (x, y) => x + y;
const multiply = (x, y) => x * y;

const flockA = 4;
const flockB = 2;
const flockC = 0;
const result =
    add(multiply(flockB, add(flockA, flockC)), multiply(flockA, flockB)); // 16
```

上面的这段代码不仅没有了难以跟踪的内部状态，也能让我们计算得到正确的结果，甚至如果大家熟悉加法交换律和乘法结合律等基本运算法则的话，上面的计算可以化简如下。

```js
const result = multiply(flockB, add(flockA, flockA));
```

对函数式编程有了一个大概的感觉之后，接下来我们来看看函数式编程中第一个重要概念：一等公民（First Class）。

### 一等公民（First Class）

一等公民（First Class）的意思是：在函数式编程中，函数是一等公民。

需要注意的是，这里的“一等”和我们平常理解的高人一等的“一等”不太一样，这里是指函数和其他基本数据类型（数值，字符串等）一样，没有什么特殊的地方。我们可以把函数存储在数组中，将它作为参数或者返回值，将它赋值给变量等等。

```js
const add = (x, y) => x + y; // 将函数赋值给变量
const multiply = (x, y) => x * y;
const operations = [add, multiply]; // 存储在数组里

// 包装函数
// 这是一个高阶函数（High Order Function, HOC)
// 参数和返回值都是函数
const logify = (fn) => { // 将函数作为变量
  return (...args) => { // 将函数作为返回值
    console.log(...args);
    fn(...args);
  }
}
```

看上去将函数看做是一等公民非常简单，但其实也没有那么容易。比如我们希望使用上面的 `logify` 函数去包装 `add` 函数，从而在每次调用 `add` 的时候先打印参数。我们很容易给出如下的实现。

```js
const logAddWithDelay = logify((x, y) => add(x, y));
```

上面的实现可以满足我们的需求，但是这样会不必要地延迟执行 `add` 函数，因为 `(x, y) => add(x, y)` 又包装了一层函数。真正把函数作为一等公民的写法应该如下。

```js
const logAdd = logify(add);
```

上面这样写处理可以避免不必要的延迟执行之外，还可以方便的修改被包装的函数 `add` 的参数。

```js
// 支持三个数的加法
const add = (x, y, z) => x + y + z;

// ❌ 和上面的写法保持不一致
const logAddWithDelay = logfiy((x, y, z) => add(x, y, z));

// ✅  和上面的写法保持一致
const logAdd = logify(add);
```

将函数作为一等公民的另外一个好处就是它不必和特定的数据类型关联起来，可以拥有更加通用的命名，从而更加通用。我们可以如下理解这个问题。

在代码中往往会有相同的逻辑，但是拥有不同的命名，这往往会造成疑惑。比如在上面的计算海鸥的例子中，海鸥的结合本质上是一个加法，如果对应函数命名为 `conjoin` 就会将其和海鸥这个特定的概念联系起来。

这样就两个坏处：一方面，不是所有人都熟悉海鸥结合这个概念，但是所有人都知道加法。另一方面，其他需要用到加法地方，也不可能直接用 `conjoin` 这个函数，需要重新实现或者赋值给新的拥有合适命名的变量，这都是不优雅的。

后面我们还可以看到将函数作为一等公民的更多的作用。

### 纯函数（Pure Function）

在了解了函数式编程中第一个重要概念之后，我们来看看第二个重要概念：纯函数（Pure Function）。纯函数就是当输入参数保持一致的情况下返回结果也保持一致的函数。

```js
const b = 1;

// 不是纯函数
// 参数 a 相同的情况下，返回结果依赖全局变量 b
const impureAdd = (a) => a + b;

// 是纯函数
// 参数 a, b 相同的下，返回的结果一定相同
const pureAdd = (a, b) = a + b;
```

纯函数意味着函数没有副作用（Side Effect）。副作用是在函数计算过程中改变了系统的状态或者和函数外部的世界有交互，它包括但不限于下面几种。

```js
// 打印日志
console.log('hello world');

// 发起 http 请求
axios.post(/*...*/);

// 查询 DOM
document.getElementById('container');

// 访问外部或者系统变量
const width = window.innerWidth;

// 可变（mutation）
const a = [3, 2, 1];
a.sort(); // sort 是不纯的，因为它改变了 a 的值
a // [1, 2, 3]

//...
```

一个纯函数拥有以下的有优点：

 -    便携性：一方面意味着这个函数容易理解，因为它的所有依赖都体现在参数里面。另一方面，意味着这个函数可以在任何地方运行，因为它需要的东西都是通过参数传递的。但是在面向对象编程中却不是这样，Erlang 的创建者 Joe Armstrong 说："在面向对象编程的世界里，我想要一个香蕉，却得到了一片丛林"
 -    可测试：我们只用给函数输入然后断言输出即可，不需要提供额外的状态。
 -    可并行运行：因为不会访问外部变量，所以不会访问共享的内存，从而不会出现竞争。
 -    可缓存：可以根据输入将输出缓存下来，下面是一个简单的实现。

```js
const memoize = (f) => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    cache[key] = cache[key] || f(...args);
    return cache[key];
  };
};

const squareNumber = memoize(x => x * x);
quareNumber(3); // 9, 
quareNumber(3); // 9, 返回缓存的的 9
squareNumber(4); // 16
squareNumber(4); // 16, 返回缓存的的 16
```

 -    引用透明（Referentially Transparent）：一段代码可以被它的计算后的值所替换而不改变程序的行为，那么它就是引用透明的。这个特性在重构代码的过程或者帮助我们理解代码非常有用。参考下面的例子。

```js
const impureMultiply = (a, b) => {
  console.log('multiply'); 
  return a * b;
}
const pureMultiply = (a, b) => a * b;

// pureMultiply 是引用透明的
// 如果 a = 2, c = 3，pureMutiply(a, c) 被替换成 6 = pureMutiply(2, 3)
// const pureFn = (a, b, c) => add(6 + pureMultiply(a, b));
// 函数的行为没有改变，所以是引用透明的
const pureFn = (a, b, c) => add(pureMultiply(a, c) + pureMultiply(a, b));

// impureMultiply 不是引用透明的
// 如果 a = 2, c = 3，impureMultiply(a, c) 被替换成 6 = pureMutiply(2, 3)
// const impureFn = (a, b, c) => add(6 + impureMultiply(a, b));
// 这样会打印一次 'multiply'，改变了程序行为，所以不是引用透明的
const impureFn = (a, b, c) => add(impureMultiply(a, c) + impureMultiply(a, b));
```

```js
// 根据乘法结合律：a * b + a * c = a * (b + c) 可以对 pureFn 函数重构化简
const pureFn = pureMultiply(a, add(b, c));

// 但是如果对 impureFn 函数按照相同方法化简就会有问题
// 'multiply' 这样就只会被打印一次了！！！
const impureFn = (a, b, c) => impureMultiply(a, add(b, c));
```

### 函数柯里化（Currying）

函数柯里化（Currying）的概念很简单：我们可以用少于期望数量的参数去调用一个函数，这个函数返回一个接受剩下参数的函数。

我们先来看看一个简单的`add` 函数，这个函数接受一个参数并且返回一个函数。

```js
const add = x => y => z => x + y + z;
add(1)(2)(3) // 6
```

上面的写法太麻烦了，我们可以实现一个通用的 `curry` 方法来实现上面的效果，期望的使用方法如下：

```js
const add = curry((x, y, z) => x + y + z);
add(1)(2, 3); //6
add(1, 2)(3); // 6
add(1, 2, 3); // 6
```

这样做的好处是我们可以固定一些参数，减少传入的参数，让我们能更灵活和简单的使用函数，也为我们接下来的函数合成（Compose）打下基础。

```js
// 将第一个参数固定为 1
const add1 = add(1);

add1(2, 3) // 6 
add1(3, 4) // 8

// 变成一个单参数的函数
const add1 = add(1, 0);
const add2 = add(2, 0);
const add3 = add(3, 0);

// 复合成一个函数
const add6 = x => add1(add2(add3(x)));

add6(1); // 7
add6(2); // 8
```

知道了 `curry` 函数的用途，那么接下来我们就来实现一个简单的版本。

```js
function curry(fn) {
  // 获得函数参数的数量
  const arity = fn.length;
  return function curried(...args) {
    // 如果当前收集到的参数数量大于需要的数量，那么执行该函数
    if (args.length >= arity) return fn(...args);
    // 否者，将传入的参数收集起来
    // 下面的写法类似于
    // return (...args1) => curried(...args, ...args1);
    return curried.bind(null, ...args);
  };
}
```

最后说一下可以发现柯里化后的函数非常契合纯函数的输入一个输出一个的特点：接受一个参数，返回一个接受剩余参数的函数。

### 函数复合（Compose）

在学习函数式编程的最后我们来看看另外一个有用的工具：函数复合（Compose）。

当一个值要经过多个函数转换，才能变成另外一个值，就可以把这些函数合成一个函数。这样，这个值就只用通过复合后的函数转换一次，就可以获得对应结果了。

```js
// x 依次经过 add1、add2、add3 三个函数转换之后获得结果
const x = 1;
const x2 = add1(x); // 2
const x3 = add2(x2); // 4
add3(x3); // 7

// 合成一个 add6 函数
const add6 = x => add1(add2(add3(x)));
add6(x); // 7
```

上面的过程就是函数复合，但是复合方法过于麻烦。我们希望实现一个 `compose` 函数来自动帮助我们方便得合成函数，期望的使用方式如下。

```js
// 满足 Pointfreee，没有描述处理的数据
const add6 = compose(add1, add2, add3);
add6(1); // 7
```

这样的写法不仅合成很方便，并且也满足了 Pointfree 这种风格：代码中不用描述数据。这样的风格可以让我们移除不必要的函数命名，也能保证函数的通用性。

```js
// 不是 Pointfree, x 就是数据
const add6 = x => add1(add2(add3(x)));

// 不是 Pointfree, x 就是数据
const add6 = x => compose(add1, add2, add3)(x);
```

可以发现一等公民、函数柯里化和函数合成都是有助于我们写出 Pointfree 风格的代码。

了解函数合成的基本概念，我们来下面这种一种简单的实现。这里的函数都是只有一个参数和一个返回值，并且复合后它们是按照从左到右的顺序执行的。

```js
function compose(fn, ...rest) {
  return rest.reduce((total, cur) => (x) => cur(total(x)), fn);
}
```

函数式编程就给大家介绍到这里了，接下来我们来看看我们的主角：坐标系（Coordinate）。

## 坐标系理论

在 《The Grammar of Graphics》 这本书里提到坐标系就是一系列点的集合，这些点是由一系列数字构成：`(x1, x2, ...xn)`。如果是在二维平面上点，这些就是：`(x1, x2)`。

其实坐标系本质上也是一个函数，和比例尺的不同的是：比例尺是将数据映射为视觉元素的属性，坐标系是将视觉元素的位置属性映射为在画布上的坐标。坐标系这个函数的函数签名如下:

```ts
// 输入是一个点，这个点的两个维度都是在 [0, 1] 的范围内
// 输入是一个点，这个点是可以直接绘制到画布坐标上的点
(point: [number, number]) => [number, number]
```

具体的使用看下面的这个例子。

```js
import { createLinear } from "./scale";
import { createCoordinate, transpose, cartesian } from './coordinate';

// 我们希望绘制一个散点图来看下面数据的分布
const data = [
  { height: 180, weight: 150 },
  { height: 163, weight: 94 },
  { height: 173, weight: 130 }
];

// 将数据的 height 映射为点的 x 属性（这里注意 range 是 [0, 1]）
const scaleX = createLinear({
  domain: [163, 180],
  range: [0, 1]
});

// 将数据的 width 映射为点的 y 属性（这里注意 range 是 [0, 1]）
const scaleY = createLinear({
  domain: [94, 150],
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

for (const { height, weight } of data) {
  // 通过比例尺将数据的 height 和 weight 属性
  // 分别映射为点的 x 和 y 属性
  const attributeX = scaleX(height);
  const attributeY = scaleY(weight);
  
  // 将点的 x 和 y 属性
  // 映射为最后的画布坐标
  const [x, y] = coordinate([attributeX, attributeY]);
  
  // 绘制点
  point(x, y);
}
```

就像上面的这个例子中坐标系的创建方式一样，每一个坐标系都包含两个部分：**画布的位置和大小**和**一系列坐标系变换函数**。

比如上面的坐标系的画布就是一个从 `(0, 0)` 开始，宽为600，高400的矩形，如下图。

![20211216223918.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f6ed8e137d04e9685b1594d63958d3c~tplv-k3u1fbpfcp-watermark.image?)

上面的坐标系包含两个坐标系变换：`transpose` 和 `cartesian`，现在我们不用知道他们具体含义，只用知道它们会把一个统计意义上的点，转换成画布上的点。

统计意义上的点是指：点的两个维度都被归一化了，都在 `[0, 1]` 的范围之内。这样在将点在真正绘制到画布上的之前，我们不用考虑它们的绝对大小，只用关心它们相对大小等统计学特征。这些特征在变换过程中都不会丢失。

不同的坐标系拥有的转换函数不同，这样得到点的位置也不同，从而让拥有相同属性的图形在不同坐标系下展现不同。比如笛卡尔坐标系下的矩形在极坐标系下却是扇形，这样就可以通过改变坐标系，把条形图转换成玫瑰图了。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c50f1eb5750e48c980951e40388ffbed~tplv-k3u1fbpfcp-zoom-1.image)

在了解了坐标系理论之后，我们就正式开始开发我们的坐标系。

## 基本变换

上面提到了坐标系的一个重要组成部分是坐标系变换，而坐标系变换又是由一些基本变换构成，接下来我们首先来实现一些需要的的基本变换。

基本变换本质上是一个函数，输入是变换前点的坐标，输入是变换后点的坐标。同时该变换函数有 `type` 方法返回自己的变换类型（后面会使用到）。

### 平移（Translate）

这里先用平移变换来举例。

```js
import { translate } from './transforms';

const map = translate(10, 10);
map([0, 0]); // [10, 10]
map([2, 3]); // [12, 13]
map.type(); // 'translate'
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdd44bb270c34fa9ba1fbe94895ce60f~tplv-k3u1fbpfcp-zoom-1.image)

通过平移变换的使用我们可以看出，不同的基本变换只是名字和变换函数不同，所以我们可以先抽象一个 `transform` 函数出来。

```js
// src/coordinate/transforms.js

function transform(type, transformer) {
  transformer.type = () => type;
  return transformer;
}
```

这个基础上 `translate` 函数的实现如下。

```js
// src/coordinate/transforms.js

export function translate(tx = 0, ty = 0) {
  return transform('translate', ([px, py]) => [px + tx, py + ty]);
}
```

### 缩放（Scale）

缩放变换的使用方法如下。

```js
import { scale } from './transforms';

const map = scale(10, 10);
map([0, 0]); // [0, 0]
map([2, 3]); // [20, 30]
map.type(); // 'scale'
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64443f57ac5d4f84a6d995fe6bfe60dd~tplv-k3u1fbpfcp-zoom-1.image)

缩放变换具体的实现如下。

```js
// src/coordinate/transforms.js

export function scale(sx = 1, sy = 1) {
  return transform('scale', ([px, py]) => [px * sx, py * sy]);
}
```

### 反射（Reflect）

反射变换是一种特殊的缩放变换，它在两个维度的放缩比例都是 \-1。

```js
import { reflect } from './transforms';

const map = reflect();
map([1, 2]); // [-1, -2]
map([-2, 3]); // [2, -3]
map.type(); // 'reflect'
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff4a5e7edc7d42218f1ec8fd9e9ed0c3~tplv-k3u1fbpfcp-zoom-1.image)

```js
// src/coordinate/transforms.js

export function reflect() {
  return transform('reflect', scale(-1, -1));
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80c27b17c6a348b39b1e8f078020dd9b~tplv-k3u1fbpfcp-zoom-1.image)

```js
// src/coordinate/transforms.js

export function reflectX() {
  return transform('reflectX', scale(-1, 1));
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e9ac7c681a6410e9024349f68f28c7a~tplv-k3u1fbpfcp-zoom-1.image)

```js
// src/coordinate/transforms.js

export function reflectY() {
  return transform('reflectY', scale(1, -1));
}
```

### 转置（Transpose）

转置变换就是交换一个点的两个维度，可以理解为按照 `y = x` 这条直线对称。

```js
import { transpose } from './transforms';

const map = transpose();
map([1, 2]); // [2, 1]
map([-2, 3]); // [3, -2]
map.type(); // 'transpose'
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6ee8d52ae604da494717e48439cc0b9~tplv-k3u1fbpfcp-zoom-1.image)

具体的实现如下：

```js
// src/coordinate/transforms.js

export function transpose() {
  return transform('transpose', ([px, py]) => [py, px]);
}
```

### 极坐标（Polar）

最后一种基础变换就是极坐标变换，它会将极坐标系下的点转换到笛卡尔坐标系。

极坐标和笛卡尔坐标系的不同在于点的两个维度的意义不一样。 笛卡尔坐标系中的点 `(x, y)` 的 `x` 和 `y` 可以简单理解点分别到纵轴和横轴的距离。

而相同的点在极坐标系下就会被表示为 `(raduis, theta)`，`radius` 是到极点的距离，`theta` 是点和极点的连线和极轴的角度。两者可以相互转换。具体参考下面这张图。

![20211217162113.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08ad138879d7417693bed5f407fa51b1~tplv-k3u1fbpfcp-watermark.image?)

极坐标变换可以如下把条形图转换成玫瑰图。

![20211217145857.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7b226eb7bb44811aee7599207eb6957~tplv-k3u1fbpfcp-watermark.image?)

具体的实现如下：

```js
// src/coordinate/transforms.js

export function polar() {
  // 这里我们把点的第一个维度作为 theta
  // 第二个维度作为 radius
  return transform('polar', ([theta, radius]) => {
    const x = radius * Math.cos(theta);
    const y = radius * Math.sin(theta);
    return [x, y];
  });
}
```

基本变换就这些了，但是它们还不能直接被坐标系使用，它们需要被组合，才能被坐标系直接使用，接下来我们就一起来看看坐标系变换。

## 坐标系变换

坐标系变换会据画布的位置和大小，以及基本变换本身需要的参数去生成一个由基本变换构成的数组。所以所有的坐标系变换都应该接受两个参数：`transformOptions` 和 `canvasOptions`，然后返回一个数组。我们首先通过笛卡尔坐标系变换来理解这个概念。

### 笛卡尔坐标系变换

Cooridante 里的笛卡尔坐标系变换是将统计学上的点线性转换成画布上的点。

![20211217165953.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ff670e4f4f84450a0ff1feaf5206f5b~tplv-k3u1fbpfcp-watermark.image?)

它的使用方法如下：

```js
import { cartesian } from './cartesian';

const canvasOptions = {
  x: 0,
  y: 0,
  width: 600,
  hieght: 400,
};

// cartesian 不需要 transformOptions
const transforms = cartesian(undefined, canvasOptions);
// 合成一个函数
const map = compose(...transforms);

map([0, 0]); // [0, 0]
map([0.5, 0.5]); // [300, 200]
map([1, 1]); // [600, 400]
```

但是这里存在一个问题 `transformOptions` 在定义坐标系的时候需要用户显示指定的，`canvasOptions` 是在执行坐标系函数的时候被传入的，两者被传入的时间不同。

这个时候就需要延迟函数的执行，只有当 `transformOptions` 和 `canvasOptions` 都被传入的时候才执行该函数。这久可以用到我们前面提到的函数柯里化了。柯里化后的 `cartesian` 就可以如下使用。

```js
const transforms = cartesian()(canvasOptions);
```

笛卡尔坐标系变换的实现如下：

```js
// src/coordinate/cartesian.js

import { curry } from '../utils';
import { scale, translate } from './transforms';

function coordinate(transformOptions, canvasOptions) {
  const {
    x, y, width, height,
  } = canvasOptions;
  return [
    scale(width, height),
    translate(x, y),
  ];
}

export const cartesian = curry(coordinate);
```

当然这里使用的 `curry` 会和之前提到的有一点不一样：当不传入参数的时候，需要等价于传入了 `undefined` 参数。也就是在使用柯里化后的 `cartesian` 函数的时候 `cartesian()` 等价于`caresian(undefined)`。

```js
// src/utils/helper.js

export function curry(fn) {
  const arity = fn.length;
  return function curried(...args) {
    // 如果没有传入参数就把参数列表设置为 [undefined]
    const newArgs = args.length === 0 ? [undefined] : args;
    if (newArgs.length >= arity) return fn(...newArgs);
    return curried.bind(null, ...newArgs);
  };
}
```

### 极坐标系变换

接下来我们来看看我们的第二个坐标系变换：极坐标系变换，这里的极坐标系变换和前面的极坐标变换的区别在于：

- 极点不同：极点从画布左上角变成了画布中心。
- 大小不同：坐标系构成的圆形会内切画布。
- 范围不同：可以指定坐标系开始的角度：`startAngle` 和结束的角度 `endAngle`。也可以指定内半径 `innerRadius` 和外半径 `outerRadius` （范围都是：`[0, 1]`\)。

![20211217142537.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b314ab5aceea4c199a696d87fd965983~tplv-k3u1fbpfcp-watermark.image?)

为了达到上图中的效果，需要进行如下图的一些列变换：

![20211217154039.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d007b736c1d64c33846aa7c0d591158d~tplv-k3u1fbpfcp-watermark.image?)

代码实现如下：

```js
// src/coordinate/polar.js

import {
  translate, scale, reflectY, polar as polarT,
} from './transforms';
import { curry } from '../utils/helper';

function coordinate(transformOptions, canvasOptions) {
  const { width, height } = canvasOptions;
  const {
    innerRadius, outerRadius, startAngle, endAngle,
  } = transformOptions;
  
  // 保证最后经过 cartesian 变化之后是一个圆形
  // 需要根据画布宽高去调整
  const aspect = width / height;
  const sx = aspect > 1 ? 1 / aspect : 1;
  const sy = aspect > 1 ? 1 : aspect;
  
  return [
    // 以画布中心沿着 y 方向翻转
    translate(0, -0.5),
    reflectY(),
    translate(0, 0.5),
    
    // 调整角度和半径的范围
    scale(endAngle - startAngle, outerRadius - innerRadius),
    translate(startAngle, innerRadius),
    polarT(),
    
    // 改变大小内切画布
    scale(sx, sy),
    scale(0.5, 0.5),
    
    // 移动到画布中心
    translate(0.5, 0.5),
  ];
}

export const polar = curry(coordinate);
```

## 作业

出了笛卡尔和极坐标系变换，Sparrow 的 Coordinate 还支持转置坐标系变换。这个就当留给大家的作业了，期望的效果如下图。

![20211217144245.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62608ea22a0a434dbf53bc2c2cacb097~tplv-k3u1fbpfcp-watermark.image?)

具体的实现可以参考[这里](https://github.com/sparrow-vis/sparrow/blob/main/src/coordinate/transpose.js)，测试代码在[这里](https://github.com/sparrow-vis/sparrow/blob/main/__tests__/coordinate/transpose.spec.js)。

## createCoordinate

在了解一些基本变换和坐标系变换之后，理解 `createCoordinate` 的实现就没有太多困难了。

前面我们提到，坐标系本身是一个函数，它会将我们输入的点进行一系列坐标变换，然后得到该点在画布上的坐标。这个场景就是一个使用函数复合的典型场景：将一系列变换合成一个复合变换。具体的实现如下。

```js
// src/coordinate/coordinate.js

import { compose } from '../utils';

export function createCoordinate({
  x, y, width, height,
  transforms: coordinates = [],
}) {
  // coordinates 是坐标系变换函数
  // 它们是已经接受了 transformOptions 的柯里化函数
  // 它们还需要我们传入 canvasOptions
  // 它们返回一个由基本变换构成的数组，所以在复合前需要通过 flat 把数组拍平
  // [[transpose, reflect], [transpose, reflect]]
  // -> [transpose, reflect, transpose, reflect]
  const transforms = coordinates
    .map((coordinate) => coordinate({
      x, y, width, height, // 传入 canvasOptions
    }))
    .flat(); // 拍平
  const output = compose(...transforms); // 复合
  
  // 某些场景需要获得坐标系的种类信息
  const types = transforms.map((d) => d.type());
  
  // 判断是否是极坐标系
  output.isPolar = () => types.indexOf('polar') !== -1;
  
  // 判断是否转置
  // 只有是奇数个 'transpose' 的时候才是转置
  // 这里使用了异或：a ^ b， 只有当 a 和 b 值不相同的时候才为 true，否者为 false
  output.isTranspose = () => types.reduce((is, type) => is ^ (type === 'transpose'), false);
  
  // 获得坐标系画布的中心
  output.center = () => [x + width / 2, y + height / 2];
  
  return output;
}
```

Sparrow 中使用的 `compose` 的功能会和之前介绍的有一点不同：当没有参数传入的时候，会返回一个 `identity` 函数。

```js
const identity = compose();
identity(1); // 1
identity(2); // 2
```

所以这里的 `compose` 的实现会和之前有些略微的不同。

```js
// src/utils/helper.js

export function identity(x) {
  return x;
}

export function compose(...fns) {
  return fns.reduce((total, cur) => (x) => cur(total(x)), identity);
}
```

最后不要忘记将我们需要的东西导出。

```js
// src/coordinate/index.js

export { createCoordinate } from './coordinate';
export { cartesian } from './cartesian';
export { polar } from './polar';
export { transpose } from './transpose';
```

完整的代码可以在[这里](https://github.com/sparrow-vis/sparrow/tree/main/src/coordiante)浏览，同样也可以通过[这里](https://github.com/sparrow-vis/sparrow/tree/main/__tests__/coordiante)的测试代码来验证代码的正确性。

## 拓展

这一篇文章的主要内容就到这里了，其主要分为两大块：函数式编程和坐标系。

函数式编程只给大家介绍了其中的一些基本概念和工具，更深入的学习推荐大家去阅读这本书：[《Mostly Adequate Guide to Function Programming》](https://github.com/MostlyAdequate/mostly-adequate-guide)。本篇文章中关于函数式编程的介绍几乎都来自于它的前面几节，后面会介绍范畴论和函子等比较高级的话题。同时也推荐大家去使用和阅读 [lodash/fb](https://github.com/lodash/lodash/tree/npm/fp): 一个函数式编程的工具库，更加深入理解函数式编程。

至于坐标系，这里其实只给大家介绍了其中三种最基础的坐标系变换，还有更多的坐标系变换，比如平行坐标系、鱼眼等\(如下图）。大家感兴趣可以去这里看[在线展示](https://observablehq.com/@pearmini/antv-coord)，也可以去看 [\@antv/coord](https://github.com/antvis/coord) 的相关实现。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b00aaa25ba1a4cda9291adf60e8ae7d3~tplv-k3u1fbpfcp-zoom-1.image)

## 小结

最后，又到了我们的小结时间了。

本篇文章我们首先通过一个计算海鸥数量的例子带大家认识了函数式编程，然后学习其中两个重要概念：一等公民和纯函数，接下来又认识了函数柯里化和函数复合这两个强有力的工具。

大家也许对函数式编程相关的东西还是云里雾里的，没有关系，这里大家注意一点就好：**在 Sparrow 的后续开发过程中，我们尽量使用纯函数去实现我们的功能**。也就是说尽量将一个函数的不纯的部分抽离出去。至于这样做的好处，在纯函数那部分也说的比较清楚了。

在介绍完函数式编程之后，就大家介绍了坐标系的基本概念和实现方法，知道了它的主要功能是对视觉元素进行布局。在学习坐标系的过程中，我们知道了它的本质其实是一个由多个基础变换复合而来的函数，用于将统计意义上的点转换成画布坐标。

目前为止，结合上一章的比例尺，我们已经将编码的映射和布局过程需要用到的工具都实现了！因为都是涉及数据处理，所以这两部分会相对比较抽象。

但好消息是，数据处理相关的东西暂时告一段落了。下一章我们将进入生动形象的内容：几何图形（Geometry），看看如何把我们处理好的数据绘制出来。这个过程不仅仅能加深大家对比例尺和坐标系的理解，也是将直接展示 Sparrow 能力的地方！

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68663fd7ae66473ebc172cc73aca7c57~tplv-k3u1fbpfcp-zoom-1.image)

> 参考资料
> 
> - [Mostly Adequate Guide to Function Programming, Professor Franklin Frisby](https://github.com/MostlyAdequate/mostly-adequate-guide)
> - [函数式编程入门教程, 阮一峰](http://ruanyifeng.com/blog/2017/02/fp-tutorial.html)
> - [蒯因与引用透明](https://www.jdon.com/42422)
> - The Grammar of Graphics, 2nd Edition, Leland Wilkinson
    