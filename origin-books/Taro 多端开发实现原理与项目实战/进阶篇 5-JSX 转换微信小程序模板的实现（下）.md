
# 进阶篇 5-JSX 转换微信小程序模板的实现（下）
---

# JSX 转换微信小程序模板的实现（下）

在 《[JSX 转换微信小程序模板的实现（上\)](https://juejin.cn/book/6844733744830480397/section/6844733744931143688)》我们已经了解了 Taro 编译器的理论基础。本章我们将一步步地探究 Taro 是如何将一个 JSX 文件转换成 JavaScript 文件、CSS 文件以及 JSON 文件。以一个简单 Page 页面为例：

```
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

class Home extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    numbers: [1, 2, 3, 4, 5]
  }

  handleClick = () => {
    this.props.onTest()
  }

  render () {
    const oddNumbers = this.state.numbers.filter(number => number & 2)
    return (
      <ScrollView className='home' scrollTop={false}>
        奇数：
        {
          oddNumbers.map(number => <Text onClick={this.handleClick}>{number}</Text>)
        }
        偶数：
        {
          numbers.map(number => number % 2 === 0 && <Text onClick={this.handleClick}>{number}</Text>)
        }
      </ScrollView>
    )
  }
}
```

## 设计思路

Taro 的结构主要分两个方面：运行时和编译时。运行时负责把编译后到代码运行在本不能运行的对应环境中，你可以把 Taro 运行时理解为前端开发当中 `polyfill`。举例来说，小程序新建一个页面是使用 `Page` 方法传入一个字面量对象，并不支持使用类。如果全部依赖编译时的话，那么我们要做到事情大概就是把类转化成对象，把 `state` 变为 `data`，把生命周期例如 `componentDidMount` 转化成 `onReady`，把事件由可能的类函数（Class method）和类属性函数\(Class property function\) 转化成字面量对象方法（Object property function）等等。

但这显然会让我们的编译时工作变得非常繁重，在一个类异常复杂时出错的概率也会变高。但我们有更好的办法：实现一个 `createPage` 方法，接受一个类作为参数，返回一个小程序 `Page` 方法所需要的字面量对象。这样不仅简化了编译时的工作，我们还可以在 `createPage` 对编译时产出的类做各种操作和优化。通过运行时把工作分离了之后，再编译时我们只需要在文件底部加上一行代码 `Page(createPage(componentName))` 即可。

> 如果你是从 `Taro CLI` 的 `dist` 文件夹看编译后的代码会发现它相当复杂，那是因为代码会再经过 `babel` 编译为 ES5。
> 
> 除了 `Page` 类型之外，小程序还有 `Component` 类型，所以 Taro 其实还有 `createComponent` 方法。由于 `Component` 在小程序里是全局变量，因此我们还得把 `import { Component } from '@tarojs/taro'` 的 `Component` 重命名。

![设计思想](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/8/1665157cb5a81196~tplv-t2oaga2asx-image.image)

回到一开始那段代码，我们定义了一个类属性 `config`，`config` 是一个对象表达式（Object Expression），这个对象表达式只接受键值为标识符（Identifier）或字符串，而键名只能是基本类型。这样简单的情况我们只需要把这个对象表达式转换为 JSON 即可。另外一个类属性 `state` 在 `Page` 当中有点像是小程序的 `data`，但它在多数情况不是完整的 `data`（下文会继续讨论`data`）。这里我们不用做过多的操作，`babel`的插件 `transform-class-proerties` 会把它编译到类的构造器中。函数 `handleClick` 我们交给运行时处理，有兴趣的同学可以跳到 [Taro 运行时原理](https://juejin.cn/book/6844733744830480397/section/6844733744935337992)查看具体技术细节。

再来看我们的 `render()` 函数，它的第一行代码通过 `filter` 把数字数组的所有偶数项都过滤掉，真正用来循环的是 `oddNumbers`，而 `oddNumbers` 并没有在 `this.state` 中，所以我们必须手动把它加入到 `this.state`。和 React 一样，Taro 每次更新都会调用 `render` 函数，但和 React 不同的是，React 的 `render` 是一个创建虚拟 DOM 的方法，而 Taro 的 `render` 会被重命名为 `_createData`，它是一个创建数据的方法：在 JSX 使用过的数据都在这里被创建最后放到小程序 `Page` 或 `Component` 工厂方法中的 `data` 。最终我们的 `render` 方法会被编译为：

```
_createData() {
  this.__state = arguments[0] || this.state || {};
  this.__props = arguments[1] || this.props || {};

  const oddNumbers = this.__state.numbers.filter(number => number & 2);
  Object.assign(this.__state, {
    oddNumbers: oddNumbers
  });
  return this.__state;
}
```

## WXML 和 JSX

在 Taro 里 `render` 的所有 JSX 元素都会在 JavaScript 文件中被移除，它们最终将会编译成小程序的 `WXML`。每个 `WXML` 元素和 `HTML` 元素一样，我们可以把它定义为三种类型：`Element`、`Text`、`Comment`。其中 `Text` 只有一个属性: 内容（content），它对应的 AST 类型是 `JSXText`，我们只需要将前文源码中对应字符串的奇数和偶数转换成 `Text` 即可。而对于 `Comment` 而言我们可以将它们全部清除，不参与 `WXML` 的编译。`Element` 类型有它的名字（tagName）、children、属性（attributes），其中 `children` 可能是任意 `WXML` 类型，属性是一个对象，键值和键名都是字符串。我们将把重点放在如何转换成为 `WXML` 的 `Element` 类型。

首先我们可以先看 `<View className='home'>`，它在 AST 中是一个 `JSXElement`，它的结构和我们定义 `Element` 类型差不多。我们先将 `JSXElement` 的 `ScrollView` 从驼峰式的 JSX 命名转化为短横线（kebab case）风格，`className` 和 `scrollTop` 的值分别代表了 `JSXAttribute` 值的两种类型：`StringLiteral` 和 `JSXExpressionContainer`，`className` 是简单的 `StringLiteral` 处理起来很方便，`scrollTop` 处理起来稍微麻烦点，我们需要用两个花括号 `{}` 把内容包起来。

> `JSXExpressionContainer` 其实可以包含任何合法的 JavaScript 表达式，本例中我们只传入了一个字面量的布尔值，直接用双括号包裹在 `WXML` 是合法的。但 `WXML` 的模板支持的表达式是有限的，当表达式包含函数时 Taro 将生成一个匿名的 `state` 放在当前表达式作用域的前一行，并处理作用域命名的问题。

接下来我们再思考一下每一个 `JSXElement` 出现的位置，你可以发现其实它的父元素只有几种可能性：`return`、循环、条件（逻辑）表达式。而在上一篇文章中我们提到，`babel-traverse` 遍历的 AST 类型是响应式的——也就是说只要我们按照 `JSXElement` 父元素类型的顺序穷举处理这几种可能性，把各种可能性大结果应用到 JSX 元素之后删除掉原来的表达式，最后就可以把一个复杂的 JSX 表达式转换为一个简单的 `WXML` 数据结构。

> `JSXElement` 的父元素其实可能有很多种情况，例如父元素可能是一个 `JSXAttribute`，这类情况 Taro 还不支持，我们用 ESLint 插件规避了这样的写法。还有一些情况，例如赋值表达式和 `If` 表达式处理起来较为复杂，本文不过多赘述。

我们先看第一个循环：

```
oddNumbers.map(number => <Text onClick={this.handleClick}>{number}</Text>)
```

`Text` 的父元素是一个 `map` 函数（CallExpression），我们可以把函数的 callee: `oddNumbers` 作为 `wx:for` 的值，并把它放到 state 中，匿名函数的第一个参数是 `wx:for-item`的值，函数的第二个参数应该是 `wx:for-index` 的值，但代码中没有传所以我们可以不管它。然后我们把这两个 `wx:` 开头的参数作为 `attribute` 传入 `Text` 元素就完成了循环的处理。而对于 `onClick` 而言，在 Taro 中 `on` 开头的元素参数都是事件，所以我们只要把 `this.` 去掉即可。`Text` 元素的 `children` 是一个 `JSXExpressionContainer`，我们按照之前的处理方式处理即可。最后这行我们生成出来的数据结构应该是这样：

```
{
  type: 'element',
  tagName: 'text',
  attributes: [
    { bindtap: 'handleClick' },
    { 'wx:for': '{{oddNumbers}}' },
    { 'wx:for-item': 'number' }
  ],
  children: [
    { type: 'text', content: '{{number}}' }
  ]
}
```

有了这个数据结构生成一段 `WXML` 就非常简单了，你可以参考 [himalaya](https://github.com/andrejewski/himalaya/blob/master/src/stringify.js) 的代码。

再来看第二个循环表达式：

```
numbers.map(number => number % 2 === 0 && <Text onClick={this.handleClick}>{number}</Text>)
```

它比第一个循环表达式多了一个逻辑表达式（Logical Operators），我们知道 `expr1 && expr2` 意味着如果 `expr1` 能转换成 `true` 则返回 `expr2`，也就是说我们只要把 `number % 2 === 0` 作为值生成一个键名 `wx:if` 的 `JSXAttribute` 即可。但由于 `wx:if` 和 `wx:for` 同时作用于一个元素可能会出现问题，所以我们应该生成一个 `block` 元素，把 `wx:if` 挂载到 `block` 元素，原元素则全部作为 `children` 传入 `block` 元素中。这时 `babel-traverse` 会检测到新的元素 `block`，它的父元素是一个 `map` 循环函数，因此我们可以按照第一个循环表达式的处理方法来处理这个表达式。

这里我们可以思考一下 `this.props.text || this.props.children` 的解决方案。当用户在 JSX 中使用 `||` 作为逻辑表达式时很可能是 `this.props.text` 和 `this.props.children` 都有可能作为结果返回。这里 Taro 将它编译成了 `this.props.text ? this.props.text: this.props.children`，按照条件表达式（三元表达式）的逻辑，也就是说会生成两个 `block`，一个 `wx:if` 和一个 `wx:else`：

```
<block wx:if="{{text}}">{{text}}</block>
<block wx:else>
    <slot></slot>
</block>
```

条件表达式（Conditional Expression）的处理比逻辑表达式稍微复杂一些，因为表达式返回的结果可以是任意类型。但万变不离其宗，我们只要一直处理 JSX 元素的父元素，如果支持不了就用 ESLint 警告，如果能够支持就把表达式转换成对应的属性挂载在到 JSX 元素中再把表达式删除，直到我们能将这个 JSX 元素移除为止。

## 小结

本章节我们介绍 Taro 转换 JSX 的运行机制和一些基本的转换操作。由于篇幅所限我们也没法面面俱到，读者朋友们不妨思考一些更复杂的情况：例如在循环中有 `wxml` 不支持的复杂表达式，`wxml` 的 `wx:for` 的值是否有变化？复杂的表达式在 `wxml` 里应该用什么来替代？如果循环中有 `if` 表达式怎么办？

思考之后就不难发现，当处理简单的 JSX 转换时是比较容易的，但情况复杂起来转换的复杂度会相应地大幅增加。开源几个月以来，不管从运行时机制还是转换机制来讲 Taro 都是「摸着石头过河」，远远称不上完美。但目前 Taro 还是在没有前人探索过的道路上披荆斩棘走了一段路，未来的路，我们还需要在你和社区伙伴的帮助下一起走下去。
    