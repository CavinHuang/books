
# 模块化-分治思想在前端的应用
---

在前面几篇文章中，我们先给大家介绍了如何从 0 到 1 创建现代化前端项目，以及如何使用脚手架创建并在开发中提效。那么，在项目创建好之后，就要进入到开发的阶段了。接下来，就给大家介绍在开发阶段怎么使用工程化的手段进行提效。本篇文章就来给你介绍一下分治思想在前端的应用 —— **模块化**。

> 分治，字面上的解释是“分而治之”，就是把一个复杂的问题分成两个或更多的相同或相似的子问题，再把子问题分成更小的子问题……直到最后子问题可以简单的直接求解，原问题的解即子问题的解的合并。在计算机科学中，[分治法](https://baike.baidu.com/item/%E5%88%86%E6%B2%BB%E6%B3%95/2407337)就是运用分治思想的一种很重要的算法。

在最原始的软件开发时期，网页开发只需要实现简单的页面样式和页面交互逻辑即可，大部分任务只是“切图”。但是随着前端技术的发展和应用（比如 ajax 和 Node.js），使得前端也逐步具备开发大型项目的能力，网页开发也越来越趋向于桌面应用。在开发大型项目的道路上，项目的代码量和复杂度都在日益增长，JS 面临的首要问题就是：`如何组织代码以及如何进行复用代码`。

**模块化就是用了分治的思想，将项目拆分为一个个的模块，分而治之**。模块化是一种代码组织和代码复用的方式。模块化也是时代发展的产物，是前端可以开发大型项目的基石。

本文我就带你了解一下前端领域的模块化相关内容，先介绍什么是模块化以及模块化的发展历史，最后再分析一下常见的几种模块化规范。

## 什么是模块

> **模块**是指由数个基础功能组件组成的特定功能组件，可用来组成具完整功能之系统、设备或程序。 —— 维基百科

我们通常所说的“模块”指的是编程语言提供的一种组织代码的机制，可以将代码拆分为独立且通用的单元。在开发的时候，按照模块分别开发，最后再将不同的模块“组装”在一起。

具体到前端领域，模块指的就是实现某一功能的一段 JS 代码或者一个 JS 文件。每个模块其隐藏了内部的实现，通过暴露出来的接口进行互相的调用通信。

## 如何实现模块

在了解了什么是模块之后，我们再来看下如何去实现一个模块。

上面我们也提到了，模块是为了实现某个功能的代码集合。在 JS 中，最简单的将几个功能函数放在一起，就可以说是实现了一个模块。

比如，我们想要实现一个四则运算模块，我们可以定义加、减、乘、除四个函数 `add()、subtract()、multiply()、divide()` 然后将它们组合在一起，这就是一个四则运算模块。具体如下：

```
// arithmetic 模块

const add = () => {
  console.log('add')
}

const subtract = () => {
  console.log('subtract')
}

const multiply = () => {
  console.log('multiply')
}

const divide = () => {
  console.log('divide')
}
```

理论上来说这就是一个最简单的模块，但是在我们实际的开发中，应该没有人会直接这样使用。虽然这种方式定义的模块理解成本最低也最方便，但是缺点也很明显：**不仅存在污染全局命名空间的问题，而且各个模块之间的关系并没有体现，模块内都是相互独立的个体**。

更进一步，我们可以将这四个函数封装在 `arithmetic` 对象中，将其作为对象的属性，在使用的时候调用对象的属性即可，如下：

```
const add = () => {
  console.log('add')
}

const subtract = () => {
  console.log('subtract')
}

const multiply = () => {
  console.log('multiply')
}

const divide = () => {
  console.log('divide')
}

const arithmetic = {
  _initData: 0,
  add,
  subtract,
  multiply,
  divide,
}
```

这种将函数定义对象属性的写法更像是一个模块而不是 4 个独立的函数。但是这种方式也有缺点：**对象内的状态可能会被外部改写**。比如，我们可以在外部直接给 `_initData` 赋值为 1：

```
arithmetic._initData = 1;
console.log(arithmetic._initData)  // 1 
```

console 的结果是 1，说明我们可以直接将对象内部的值改掉，模块内的私有属性和私有方法被污染了。

我们继续优化，使用立即执行函数 `IIFE（Immediately-Invoked Function Expression）`的写法。IIFE 会创建一个只使用一次的函数，然后立即执行；IIFE 可以创建闭包进行作用域隔离，从而保护私有变量。使用 IIFE 方式实现的模块化可以解决上面的问题，不暴露私有成员从而满足我们的需求。

```
const arithmetic = (function() {
  const _initData = 0;
  const add = () => {
    console.log('add')
  }

  const subtract = () => {
    console.log('subtract')
  }

  const multiply = () => {
    console.log('multiply')
  }

  const divide = () => {
    console.log('divide')
  }
  return {
    add,
    subtract,
    multiply,
    divide,
  }
})();

console.log(_initData)    // undefined
```

我们现在尝试访问下 `_initData` 的值，就会发现是 `undefined`。也就印证我们上面的观点，使用 IIFE 的方式就无法读取内部私有变量了。

```
console.log(arithmetic._initData); // undefined
```

使用 IIFE 写法一则可以创建闭包保存状态，隔离作用域；二则可以作为一个独立的模块存在，防止命名冲突也可以自行注入命名空间。所以你会在各种很多开源框架中看到使用 IIFE 的例子。比如大家都熟知的 JQuery，将实参jQuery传入函数 `function($){...}`，通过形参 `$` 接收。

```
(function ($) {

  //...

})(jQuery);
```

除了 IIFE，还有其他实现模块化的方式，我们这里就不再展开讲了。

## 模块化规范

模块化不仅使我们的代码有更高的复用性和更好的可维护性、也避免重复耗时耗力的劳动，同时解决了 JS 全局命名空间冲突的问题，是在现代前端中必不可少的开发技能。

那么在一个复杂的项目中，必定是有很多个模块。有的是你自己开发的，有的是组内其他小伙伴开发的，还有的是社区中他人开发好的“轮子”。前面我们也介绍了，模块化的实现是灵活且多样的。`我们怎么保证姿势一致和最大程度的进行模块复用呢？`这个时候就需要统一的模块化规范。

> 模块化规范（Module Definition Specification）是对模块化代码书写格式和交互（模块间相互引用）规则的详细描述。

2009 年，Node.js 的诞生意味着 JavaScript 可以在服务端运行。脱离了浏览器宿主环境的限制，JS 可以干更多事情，也更加的像是一门真正的语言了。但是，如果想要做大、做强，那么一定要有一个很好的**模块化解决方案**。经过社区激烈的讨论之后，CommonJS 诞生了。随后，CommonJS 在 Node.js 中得到应用，为前端接来下的迅猛发展奠定了基础。

随后又推出了在浏览器环境下使用的模块化规范 AMD。紧接着又推出了对 AMD 规范改进的 CMD 规范。但是 CommonJS、AMD、CMD 都只是来自于社区的模块化规范，直到 ES2015，才有官方的模块化解决方案：ES Modules。

所以，我们常说的 **CMD、AMD、ESM 这些都是模块化规范**，而 [requirejs](https://github.com/requirejs/requirejs)、[sea.js](https://github.com/seajs/seajs) 这些是模块化规范的具体实现。

正是有了这些模块化规范和具体实现，才使得 JS 编写大型应用成为可能。下面我们分别来介绍下 CommonJS、AMD、CMD、ESM 的具体内容。

### CommonJS 规范

通过上面的介绍，我们可以简单地了解到：CommonJS 是随着 JS 在服务端的发展而发展起来的，Node.js 中的模块系统就是参照 CommonJS 规范实现的。

CommonJS 规范的具体内容如下：

- 一个文件就是一个模块；
- module 对象代表模块自身，module 中有两个属性，require 和 export；
- 使用 `require(path)` 方法引入外模模块，其中 path 可以是相对路径也可以是绝对路径；
- 使用 `export` 对象作为唯一出口导出模块。

比如，我们在 `index.js` 中需要引入 `a.js` 文件中导出的模块 `a`，其代码如下：

```
// a.js
export.a = 'a';

// index.js
const moduleA = require('./a.js');
console.log(moduleA);  // {a: 'a'}
```

### AMD

`CommonJS` 最开始是在服务端中使用，在浏览器环境中同样需要模块化规范。那么可不可以直接将 `CommonJS` 用于浏览器环境呢？

答案是否定的，因为 `CommonJS` 的设计思想是同步加载模块。在服务端，所有的模块都储存在本地硬盘，所以模块之间就算是同步加载的那么等待的时间也只是读取硬盘的时间，对于性能上的影响不大。

但是在浏览器环境就不一样了，浏览器环境下加载模块需要先将模块通过网络传输下载到本地，如果使用同步的方式加载模块的话，加载的时间就取决于所使用的设备、传输协议以及当时的网速。如果一个大型项目，所有的模块依赖都是同步的话，就会对性能产生有很大的影响。**所以，在浏览器环境中，模块的加载只能是异步的。**

`AMD（Asynchronous Module Definition）` 是 `requireJS` 在推广过程对模块定义的规范。使用异步加载而非同步加载的方式，模块在加载的时候就不会影响后面代码的执行。如果后面的代码依赖前面加载的内容，可以将其放在回调函数中，**AMD 相比于 `CommonJS`更适合浏览器环境**。

AMD 规范的具体内容如下：

```
// ts声明
/**
 * @param {string} id 模块名称
 * @param {string[]} dependencies 模块所依赖模块的数组
 * @param {function} factory 模块初始化要执行的函数或对象
 * @return {any} 模块导出的接口
 */
function define(id?, dependencies?, factory): any

// 设置模块名称为 alpha，使用 require，exports，beta 为依赖的模块
define("alpha", ["require", "exports", "beta"], function (require, exports, beta) {
   exports.verb = function() {
       return beta.verb();
       //Or:
       return require("beta").verb();
   }
});
```

`define()`是一个用来定义模块的全局函数，其中的 `alpha` 是模块名，`["require", "exports", "beta"]` 是模块的依赖。模块名和依赖都是可以省略的，在模块名省略的时候，会采用文件名作为模块名。比如：

```
// id 和 dependencies 被省略的情况。此时，id 就是文件名。
define(function (require, exports, module) {
	const a = require('a')
});
```

AMD 还有一个重要的设计思想就是**依赖前置**，AMD 会通过动态创建 `script` 标签的方式来异步加载模块，加载完成后立即执行该模块，只有当所有的依赖都加载并执行完之后才执行本模块，也就是说依赖的模块不管有没有使用，都会在运行时全量加载并执行（后面介绍的 CMD 则是先将文件缓存下来，在使用的时候才执行）。

### CMD

`CMD(Common Module Definition)` 规范是在 SeaJs 推广过程中对模块定义的规范而产生的，也是一种在浏览器环境使用的异步模块化规范。CMD 更贴近于 `CommonJS Modules/1.1` 和 `Node Modules` 规范：

- 一个文件就是一个模块；
- 使用 define 定义模块；
- require 方法用获取其他模块提供的接口。

刚刚也有说到，CMD 和 AMD 最大的不同在于：CMD 推崇**依赖就近、延迟执行**的原则。

CMD 规范的内容很简单：

```
define(factory)
```

其中，`factory` 可以是一个函数、一个对象或者是字符串。`factory` 为对象、字符串时，表示模块的接口就是该对象、字符串。如果为函数，则该函数表示的是模块的构造方法。执行该构造方法，可以得到模块向外提供的接口。

factory 默认有三个参数：`require、exports、module`。

```
define(function(require, exports, module) {
  // 模块代码
});
```

到这里是不是有点眼熟呢？是不是和刚刚介绍的 AMD 规范有些类似？在 AMD 中，如果省略了模块名称 id 和模块依赖 deeps，那么是不是就和 CMD 一样了呀\~\~

```
// AMD 依赖必须一开始就写好
define("alpha", ["require", "exports", "beta"], function (require, exports, module) {
  // 模块代码
  exports.verb = function() {
     return beta.verb();
   }
});

// CMD 依赖可以就近书写
define(function(require, exports, module) {
  // 模块代码
  var beta = require('./beta');
  beta.verb();
});
```

虽然这只是写法上的略有不同，但是这实际上是设计思想上的不同。CMD 推崇的是一个文件一个模块，所以可以直接省略模块名称，使用文件名作为模块名称。CMD 又推崇依赖就近，所以不在 `define` 中写依赖，而是直接在 factory 中写。

### ES Modules

终于来到了 ES Modules（下面简称 ESM）的时代了，ESM 是 JavaScript 官方突出的标准化模块系统。在 ES 2015（ES6）中，直接在语言标准层面上实现了模块的功能。并且是浏览器和服务端都支持的模块化解决方案。

ESM 规范很简单：`export` 用来导出模块接口，`import` 用来引入模块接口。`export` 可以直接导出也可以集中导出一个对象，只是写法不一样，实质是一样的。

```
// arithmetic.js
// 直接导出
export const add = () => {};
export const subtract = () => {};

// 集中导出一个对象
const add = () => {};
const subtract = () => {};

export {
  add,
  subtract,
}
```

import 可以整体导入模块也可以导入模块中的具体某一部分：

```
// 整体导入模块
import * from './add';

// 导入模块的某一部分
import { add } from './arithmetic.js';
```

在 ES2020 中，新引入了 `import()` 动态加载模块，该方法返回的是一个 `Promise` 对象，可以支持按需加载，大大提高了模块引用的灵活性。

```
function foo() {
  import('./config.js')
    .then(({ default }) => {
        default();
    });
}
```

ESM 导入模块是在编译阶段进行静态分析确定模块的依赖关系，并将 `import` 导入语句提升到模块首部，生成只读引用，链接到引入模块的 export 接口，所以，**ESM import 导入的是值的引用**。

例如：我们在 b.js 文件中定义一个变量 b 值为 0，然后在 1s 之后将其值改为 1。然后我们在 a.js 文件中引入变量 b。在引入语句之后打印变量 b 的值，然后在 2s 之后再次打印 b 的值。可以看到打印的结果证明了导出的 b 为引用值。

```
// a.js
import { b } from './b.js';
console.log(b);
setTimeout(() => {
  console.log(b);
}, 2000);

// b.js
export let b = 0;
setTimeout(() => {
  b = 1;
}, 1000);

// 0
// 1
```

正是因为 ESM import 导入的是值的引用，所以在遇到循环依赖的时候，ESM 只有在真正需要用到的时候才会去模块中取值。因为需要在编译阶段进行静态分析，所以 import 的只能是字符串，不能是表达式和变量。并且导入的是单例模式，所以在依赖循环的时候，一个模块被多次导入，但是只会执行一次。

### 几种模块化规范对比

|  | 运行环境 | 加载方式 | 运行机制 | 特点 |
| --- | --- | --- | --- | --- |
| CommonJS | 服务器 | 同步 | 运行时 | 第一次加载后会将结果缓存，再次加载会读取缓存的结构。 |
| AMD | 浏览器 | 异步 | 运行时 | 依赖前置，不管模块是否有用到，都会全量加载。 |
| CMD | 浏览器 | 异步 | 运行时 | 依赖就近，延迟加载 |
| ESM | 浏览器/服务端 | 异步 | 编译时 | 静态化，在编译时就确定模块之间的依赖关系，输入和输出。 |

## 总结

在本文中，我先给你介绍了什么是模块化以及为什么要使用模块化，然后说明了几种模块化的写法。最后，介绍和对比了现代化前端常见的几种模块化规范：CommonJS、AMD、CMD 和 ES Modules。

模块化是前端大型项目发展的基石，模块化的发展也是顺应前端的发展而逐步逐渐优化完善，最终推出了语言层面的官方的模块体系。
    