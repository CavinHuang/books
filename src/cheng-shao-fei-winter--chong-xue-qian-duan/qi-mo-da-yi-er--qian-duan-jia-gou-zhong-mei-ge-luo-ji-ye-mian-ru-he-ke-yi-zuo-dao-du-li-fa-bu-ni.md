
---
title: 程劭非（winter）-重学前端
---

期末答疑（二）：前端架构中，每个逻辑页面如何可以做到独立发布呢？

你好，我是winter。

上一期的答疑文章发布之后，同学们的热情很高，我在后台又收到了一批新的问题，今天我们继续来答疑。

**1\. 请问前端架构中，每个逻辑页面如何可以做到独立发布呢？**

答：首先，我们要知道发布是什么意思，我们平时开发好一个网页，把它放到线上真实对用户服务的机器上，这个过程叫做发布。

正常来讲，前端工程师发布的原材料是HTML，产出是一个线上的URL地址。

各个公司的发布系统差异非常的大，有的是前端发HTML，有的是前端把代码给服务端同学，改成JSP之类的代码，再一起发布。

对于逻辑页面而言，我们需要发布的从HTML变成了JavaScript，这个JavaScript代码的作用就是渲染一个页面的内容。同时我们线上还需要一个公共的HTML文件来运行这些JavaScript。

最后这些JavaScript文件只要能够做到独立发布，我们就可以认为逻辑页面是独立发布了。

**2\. 对于一个后端开发者来说，前端最困难的东西永远是CSS布局而不是JavaScript，我们对CSS有很大畏惧和恐慌在于：CSS没有很好的调试工具能解决问题，即使chrome dev这样的顶级debug工具，有时候也很难解释诸如“为什么页面上的这个盒子在这个地方”这样的问题。感觉CSS完全不符合编程的思路，老师有没有办法缓解一下这个问题？**

<!-- [[[read_end]]] -->

答：其实我在课程中已经解释过了，早期的CSS从思路上来说就很别扭， 任何人都会觉得别扭，现在有了Flex布局，我认为这个问题基本可以算解决了。

**3\. 最近一直在研究前端性能优化和线上错误收集，收效甚微，老师可以讲解一下大厂是怎么处理的吗？**

答：这一部分，首先你需要一个比较通用的日志服务，能接受前端用HTTP请求的方式打一些日志进去，一般公司都会有这样的系统，如果没有，就需要新建一个，这部分比较麻烦，需要一定的专业知识。

有了这个日志服务，剩下的就是在每个前端页面插入一个JavaScript代码，监听Window.onerror可以得到错误，取window.performance可以得到性能，拿到以后，打日志就行了。

至于后续怎么去展示，展示了以后又怎么去推动执行，这块就需要你自己根据公司实际情况去找到解决方案了。

**4\. 老师，想问一下用float排版的时候margin值在不同的浏览器中会显示不同，是什么原因导致的呢？**

答：我是从IE6时代过来，我还真没听说过margin值有什么兼容问题，你可以拿具体的案例来，我们一起看一看。不过我建议早日切到flex，我们不要在没价值的事情上浪费生命。

**5\. 把链接分为超链接类和外部资源类是您自己的理解么，还是官方有这种分类呀，我没找到。老师可以说一下么？**

答：不是，链接这个概念来自HTML标准（4.6.1位置）。

- <https://html.spec.whatwg.org/>

我在HTML的部分都在讲这个问题，你可以关注一下。

**6\. 老师，关于线上监控的数据采集和数据显示您有好的插件或者方案推荐？**

这个其实没有现成的，这个东西，如果公司从数据安全的角度考虑，一般都不让用第三方的。

**7\. 老师提到原生构造器无法继承。而[阮一峰老师](http://es6.ruanyifeng.com/#docs/class-extends)表示，es6已经可以继承原生构造函数，并且能定义子类。以我的理解来看，阮一峰老师的说法没有问题。不知道老师怎么看？**

答：我查了一下，你说的没错，还真是这样，这块我理解错了，我后面会迭代一下。

**8\. 活动页面样式风格多变，并且有些活动页面是存在交互和购买流程等交互，这些交互怎么做成模板化？**

答：这个答案很简单，只要能传参数，就能做成模板化。

**9\. DOM树就是一种嵌套的数据结构吗？然后是渲染引擎将这个数据结构处理成我们看到的网页吗 ？**

答：DOM树是嵌套的树形结构，渲染过程是把它变成位图，绘制过程是把它画到显示器上。关于这部分内容，你可以回顾一下浏览器原理部分的几节课。

**10\. 浏览器中大多数的对象都原型继承自Object，是否可以根据原型继承关系将Window上面的api绘制成一颗树？有了这些继承关系是否更容易理清这些全局属性呢？**

答：API不止有类，也有很多函数呀。所有的函数API的原型都是Function.prototype，这不就没意义了么。

**11\. “宿主对象（host Objects）：由 JavaScript 宿主环境提供的对象，它们的行为完全由宿主环境决定。”**

**但是下面对宿主对象的解释又是：“实际上，这个全局对象 windows上的属性，一部分来自 JavaScript 语言，一部分来自浏览器环境”。这并不像上面说的完全由宿主环境决定，这个怎么理解呢？**

答：请注意看了，我这里讲宿主对象有个“们”字。

所以，这里可不是对宿主对象的解释，这是对Window对象的解释。Window对象比较复杂，这块我没有详细讲，从JavaScript的Global Object的角度可以讲，浏览器部分还有个Window Proxy机制，我是觉得复杂又没什么实际意义就没有讲，你可以这样感性地理解一下：全局对象和Window对象合成了一个东西。

**12\. winter老师，我看到淘宝用了iframe标签，能给我讲一下这个标签的使用场景和注意点吗？**

答：我可以简单告诉你一个口诀：手机上不要用，PC上除了历史包袱不要用。

**13\. 请问下，link preload 解析执行时机和构建 CSSOM一样吗，HTML从上往下解析到link preload才会解析执行？还是说并行解析HTML和preload？**

答：从标准来看应该是可以并行，但是具体怎样这块需要看浏览器源代码确定。

**14\. 老师，在ES5之前版本规范中，会提及JavaScript的可执行代码分为全局、函数、Eval。但是在ES6之后版本规范中，再也不提及可执行代码的概念了，这是为什么呢？**

答：它们还在，只是现在执行过程更复杂了，没法这么简单分类了。

**15\. winter老师，你提倡多继承吗？还是说尽量用聚合来解决问题？我看着ES6里面要实现多继承的方式也挺别扭的。**

答：我不提倡多继承，Java也不支持多继承啊。如果你想抽象可以用接口来代替，想复用可以用Mixin来代替。

**16\. 我这里还有个问题，使用figureCaption标签后，img标签的alt属性可以缺失么？我一直觉得alt与src情同手足，什么都不应该把彼此拆散的。**

答：不可以缺失，这是两个意思，figureCaption可能是“图1”这种东西，可不一定在描述图片内容。

**17\. 老师，style 既然也可以这么用`<style>css` 规则`</style>`，为什么没有 `<style src=“”></style>`？**

答：你这个设计得不错，但是估计有了link以后，HTML懒得把style改成replacement了吧。

**18\. 老师好，想请问下，业务场景中需要嵌入公司其他行业线的页面，这种不使用iframe该怎么办？**

答：理论上应该让他们给你做个组件出来，但是如果实在没别的办法，就使用iframe吧。

**19\. 老师，目前有办法通过脚本反射的方式获取所有JavaScript原生对象吗？还是只能查文档？通过for. in 遍历全局对象是不可以的，因为这些JavaScript原生对象虽然挂到了全局，但是属于不可枚举成员。**

答：我们现在可以用Object.getOwnPropertyNames，但是你symbol还是拿不到。

**20\. 老师，jquery ajax 同步请求的原理是\?目前用axios库，不支持同步请求，如果希望执行同步请求有什么解决办法？**

答：原理是XMLHttpRequest这个可以传第三个参数，但是我不建议你用同步请求，会把JS执行线程卡住。

**21\. 老师您好，把JavaScript代码缓存在 localStorage 中，从 localStorage 取出后怎么执行？ 如果缓存的是 CSS 呢？**

答：执行JavaScript用eval，执行CSS用document.createElement\(“style”\)。

**22\. 请问：var,let 和 const 在 babel 中都会被编译为 var, 那怎么区分 const 是常量呢？**

答：如果你用babel的话，就不要管编译后的代码。

**23\. DOM树构建与CSSOM构建有先后关系吗？CSS计算与DOM树流式构建同步进行是不是意味着DOM树流式构建之前，CSSOM已经构建完成呢？**

答：我这里说的确实有点歧义，我在这里再厘清一下。CSSOM是有rule部分和view部分的，rule部分是在DOM开始之前就构件完成的，而view部分是跟着DOM同步构建的。

**24\. 老师能解释下这个么？**

```
var b = 10;
(function b(){
b = 20;
console.log(b); // [Function: b]
})();
```

答：这个地方比较特殊，“具有名称的函数表达式”会在外层词法环境和它自己执行产生的词法环境之间，产生一个词法环境，再把自己的名称和值当作变量塞进去。

所以你这里的b = 20 并没有改变外面的b，而是试图改变一个只读的变量b。这块儿的知识有点偏，你仅做理解掌握就好。

**25\. 关于状态机这一块，我觉得是不是可以先讲一节正则的知识点呢。理解了正则，那么大家对状态机的概念就有了更加直观的理解了。**

答：一般正则都是状态机实现的，讲正则对理解它底层的状态机并没有多少意义。

当然了，词法分析也可以用正则来实现，我这里没有这么做而已，我写过一个JavaScript的词法分析是用正则做的，你可以参考这里:

- <https://github.com/wintercn/JSinJS/blob/master/source/LexicalParser.js>

---

好了，今天的答疑就到这里，如果你还有问题，可以继续给我留言。我们一起讨论。
    