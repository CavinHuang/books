
# Polyfill 垫片思想在前端的应用
---

前面章节中，我们讲了什么是构建、为什么需要构建、然后对比了几种常见的构建工具。在构建中，很重要的一个过程就是通过语法降级来兼容低版本浏览器。在前端领域中，用来为旧浏览器提供其没有的最新原生支持的代码片段，我们将其称之为“polyfill” ，翻译过来就是“垫片”，也就是打补丁的意思。

比如说我们想使用 `fetch` 发请求，我们在 [can i use 网站](https://caniuse.com/?search=promise) 上查询到，很多低版本的浏览器是不支持该 API 的，所以我们就需要使用 polyfill 比如 `whatwg-fetch` 来让这些低版本的浏览器支持该 API。`whatwg-fetch` 会首先判断浏览器是否原生支持 fetch，如果不支持，则结合 Promise 使用 `XMLHttpRequest` 的方式来实现 fetch。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bfe8e132d354386826291850da3692a~tplv-k3u1fbpfcp-zoom-1.image)

不得不说，你永远不知道用你产品的用户还在使用多么古老的浏览器，为了少数用户的体验，我们还是要支持低版本浏览器\(/□＼\*\)，作为一个前端开发工程师，必备的一项技能就是处理兼容性问题，本篇文章就带你一起看下前端 polyfill 方案。

目前，前端 polyfill 的实现主要有以下几种方案：

- 手动打补丁
- 根据覆盖率动态打补丁
- 在线动态打补丁

接下来，我们就来看下这几种方法分别是怎么实现的并且分析下其优缺点。

## 手动打补丁

最方便的解决兼容性问题，首先想到的应该是手动写一个转换函数，将新语法转换为旧语法实现降级。比如 `Object.assign()`，我们如果要自己写一个 `Object.assign()` 的话，应该怎么实现呢？

- 首先需要判断原生 `Object` 中是否存在该函数，如果不存在的话创建一个 `assign` 函数，并使用`Object.defineProperty` 将该函数绑定到 `Object` 上。
- 然后需要对传参进行判断，处理异常情况。
- 之后我们需要将传入的对象转换为 `Object` 对象，保存并返回。
- 最后我们循环遍历出上一步返回对象的所有可枚举的自有属性，并复制给新的目标对象。

具体代码如下：

```
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign !== 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target === null || target === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource !== null && nextSource !== undefined) {
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}
```

上面的过程是不是让你想起来了面试时常见题型"手撕xxx代码"，确实如此。如果我们采用手动打补丁的方式，需要模拟浏览器原生语法，不只是将功能实现出来就好，我们还需要处理各种各样的边界情况和异常处理，这对开发者的编程基本功有一定的要求。

但是其优点是，直接简单，并且天然的支持“按需”使用，不会有其他冗余代码，在性能上比较友好，但是缺点就是这不是一种工程化的解决方案，不易管理和维护，且复用性低。

## 根据覆盖率自动打补丁

我们都知道，`babel` 是将 `ECMAScript 2015+` 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中的工具链。`@babel/preset-env` 会根据目标环境来进行编译和打补丁，如果想在最近 3个 浏览器版本和 安卓4.4 版本以及 iOS 9.0 以上版本运行我们的代码，那么我们可以这样配置 babel：

```
...
   presets: [
     [
       '@babel/preset-env',
       {
         targets: {
           "browsers": [
             "last 3 versions",
             "Android >= 4.4",
             "iOS >= 9.0"
           ],
         }
       },
     ],
   ]
...
```

这样就可以实现根据我们设置的 target ，按需加载加载需要使用的插件。

`babel-preset-env` 的实现原理也很简单，大致步骤如下：

- 首先需要检测浏览器对 JS 的支持程度，可以通过 [browserslist](https://github.com/browserslist/browserslist), [compat-table](https://github.com/kangax/compat-table), [electron-to-chromium](https://github.com/Kilian/electron-to-chromium) 这些开源项目来获取数据。
- 然后利用上一步获取到的数据来维护一个 JS 特性 跟 特定的 babel插件的映射。
- 最后根据开发者的配置信息确定需要哪些插件。

更多关于 `babel` 的细节我会在下一章再着重给你介绍。

## 在线动态打补丁

除了上面的两种方式之外，我们还可以“在线动态打补丁”。上面两种方式都有一个弊端是：如果该浏览器支持该特性的话，那么针对该特性的 polyfill 就不需要引入。那么如何减少这种冗余呢？在线动态打补丁就是一个方案。

<https://polyfill.io/v3/> 就是实现该方案的服务，其提供 CDN 资源，会根据浏览器的 UA 不同，返回不同的内容。

比如我们可以打开 [polyfill.io](https://polyfill.io/v3/url-builder/) 网站，比如我选择了需要 es2015 的 polyfill，就会生成一个 polyfill bundle，也会生成一个链接：[https://polyfill.io/v3/polyfill.min.js\?features=default\%2Ces2015](https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3121b1fc5de4f11bd0270103a06de22~tplv-k3u1fbpfcp-zoom-1.image)

在我们的业务中，可以直接引入该 polyfill bundle，如果是在低版本的浏览器中，将会得到该 polyfills bundle

```
<script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015"></script>
```

我们也可以直接在现代浏览器上打开看下这个文件的内容，因为我的浏览器版本已经是挺高的了，所以直接返回了 `No polyfills needed for current settings and browser`。 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db09617a75d34b06ab8fa628a0dfbb48~tplv-k3u1fbpfcp-zoom-1.image)

在线打补丁的方案的有点是在高版本浏览器的情况下，会减少冗余 polyfill 的加载。其缺点就是多引入了资源会导致额外的资源加载。

## 总结

随着前端的发展，尤其是 ECMAScript 的迅速成长以及浏览器的频繁更新换代，前端在越来越多的地方会使用都 polyfill。那么如何在工程中，侵入性更小，工程化、自动化成都更高、对业务的影响最低的使用 polyfill 呢？我们一般会在项目中使用 babel 来进行处理，我们会在下面的章节中介绍具体的使用方法。
    