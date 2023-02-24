
# 进阶篇 6-运行时揭秘 - 小程序运行时
---

# 运行时揭秘 - 小程序运行时

为了使 Taro 组件转换成小程序组件并运行在小程序环境下， Taro 主要做了两个方面的工作：编译以及运行时适配。编译过程会做很多工作，例如：将 JSX 转换成小程序 .wxml 模板，生成小程序的配置文件、页面及组件的代码等等。编译生成好的代码仍然不能直接运行在小程序环境里，那运行时又是如何与之协同工作的呢？

## 注册程序、页面以及自定义组件

在小程序中会区分程序、页面以及组件，通过调用对应的函数，并传入包含生命周期回调、事件处理函数等配置内容的 object 参数来进行注册：

```
Component({
  data: {},
  methods: {
    handleClick () {}
  }
})
```

而在 Taro 里，它们都是一个组件类：

```
class CustomComponent extends Component {
  state = { }
  handleClick () { }
}
```

那么 Taro 的组件类是如何转换成小程序的程序、页面或组件的呢？

例如，有一个组件：customComponent，编译过程会在组件底部添加一行这样的代码（此处代码作示例用，与实际项目生成的代码不尽相同）：

```
Component(createComponent(customComponent))
```

createComponent 方法是整个运行时的入口，在运行的时候，会根据传入的组件类，返回一个组件的配置对象。

> 在小程序里，程序的功能及配置与页面和组件差异较大，因此运行时提供了两个方法 createApp 和 createComponent 来分别创建程序和组件（页面）。createApp 的实现非常简单，本章我们主要介绍 createComponent 做的工作。

createComponent 方法主要做了这样几件事情：

1.  将组件的 state 转换成小程序组件配置对象的 data
2.  将组件的生命周期对应到小程序组件的生命周期
3.  将组件的事件处理函数对应到小程序的事件处理函数

接下来将分别讲解以上三个部分。

## 组件 state 转换

其实在 Taro（React） 组件里，除了组件的 state，JSX 里还可以访问 props 、render 函数里定义的值、以及任何作用域上的成员。而在小程序中，与模板绑定的数据均来自对应页面（或组件）的 data 。因此 JSX 模板里访问到的数据都会对应到小程序组件的 data 上。接下来我们通过列表渲染的例子来说明 state 和 data 是如何对应的：

### 在 JSX 里访问 state

在小程序的组件上使用 wx:for 绑定一个数组，就可以实现循环渲染。例如，在 Taro 里你可能会这么写：

```
{ 
  state = {
    list: [1, 2, 3]
  }
  render () {
    return (
      <View>
        {this.state.list.map(item => <View>{item}</View>)}
      </View>
    )
  }
}
```

编译后的小程序组件模板：

```
<view>
  <view wx:for="{{list}}" wx:for-item="item">{{item}}</view> 
</view>
```

其中 state.list 只需直接对应到小程序（页面）组件的 data.list 上即可。

### 在 render 里生成了新的变量

然而事情通常没有那么简单，在 Taro 里也可以这么用：

```
{
  state = {
    list = [1, 2, 3]
  }
  render () {
    return (
      <View>
        {this.state.list.map(item => ++item).map(item => <View>{item}</View>)}
      </View>
    )
  }
}
```

编译后的小程序组件模板是这样的：

```
<view>
  <view wx:for="{{$anonymousCallee__1}}" wx:for-item="item">{{item}}</view> 
</view>
```

在编译时会给 Taro 组件创建一个 `_createData` 的方法，里面会生成 `$anonymousCallee__1` 这个变量， `$anonymousCallee__1` 是由编译器生成的，对 `this.state.list` 进行相关操作后的变量。 `$anonymousCallee__1` 最终会被放到组件的 data 中给模板调用：

```
var $anonymousCallee__1 = this.state.list.map(function (item) {
  return ++item;
});
```

render 里 return 之前的所有定义变量或者对 props、state 计算产生新变量的操作，都会被编译到 `_createData` 方法里执行，这一点在前面 JSX 编译成小程序模板的相关文章中已经提到。每当 Taro 调用 `this.setState API` 来更新数据时，都会调用生成的 `_createData` 来获取最新数据。

## 将组件的生命周期对应到小程序组件的生命周期

生命周期的对应工作主要包含两个部分：初始化过程和状态更新过程。

初始化过程里的生命周期对应很简单，在小程序的生命周期回调函数里调用 Taro 组件里对应的生命周期函数即可，例如：小程序组件 ready 的回调函数里会调用 Taro 组件的 componentDidMount 方法。它们的执行过程和对应关系如下图：

![asset/taro-weapp-runtime-lifecycle.jpg](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/8/166515c132121443~tplv-t2oaga2asx-image.image)

> 小程序的页面除了渲染过程的生命周期外，还有一些类似于 onPullDownRefresh 、 onReachBottom 等功能性的回调方法也放到了生命周期回调函数里。这些功能性的回调函数，Taro 未做处理，直接保留了下来。

小程序页面的 componentWillMount 有一点特殊，会有两种初始化方式。由于小程序的页面需要等到 onLoad 之后才可以获取到页面的路由参数，因此如果是启动页面，会等到 onLoad 时才会触发。而对于小程序内部通过 navigateTo 等 API 跳转的页面，Taro 做了一个兼容，调用 navigateTo 时将页面参数存储在一个全局对象中，在页面 attached 的时候从全局对象里取到，这样就不用等到页面 onLoad 即可获取到路由参数，触发 componentWillMount 生命周期。

状态更新：

![asset/taro-weapp-runtime-setstate](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/8/166515c132336584~tplv-t2oaga2asx-image.image)

Taro 组件的 setState 行为最终会对应到小程序的 setData。Taro 引入了如 nextTick ，编译时识别模板中用到的数据，在 setData 前进行数据差异比较等方式来提高 setState 的性能。

如上图，组件调用 setState 方法之后，并不会立刻执行组件更新逻辑，而是会将最新的 state 暂存入一个数组中，等 nextTick 回调时才会计算最新的 state 进行组件更新。这样即使连续多次的调用 setState 并不会触发多次的视图更新。在小程序中 nextTick 是这么实现的：

```
const nextTick = (fn, ...args) => {
  fn = typeof fn === 'function' ? fn.bind(null, ...args) : fn
  const timerFunc = wx.nextTick ? wx.nextTick : setTimeout
  timerFunc(fn)
}
```

除了计算出最新的组件 state ，在组件状态更新过程里还会调用前面提到过的 `_createData` 方法，得到最终小程序组件的 data，并调用小程序的 setData 方法来进行组件的更新。

组件更新如何触发子组件的更新呢？

这里用到了小程序组件的 properties 的 observer 特性，给子组件传入一个 prop 并在子组件里监听 prop 的更改，这个 prop 更新就会触发子组件的状态更新逻辑。细心的 Taro 开发者可能会发现，编译后的代码里会给每个自定义的组件传入一个 `__triggerObserer` 的值，它的作用正是用于触发子组件的更新逻辑。

由于小程序在调用 setData 之后，会将数据使用 JSON.stringify 进行序列化，再拼接成脚本，然后再传给视图层渲染，这样的话，当数据量非常大的时候，小程序就会变得异常卡顿，性能很差。Taro 在框架级别帮助开发者进行了优化。

 -    首先，在编译的过程中会找到所有在模板中用到到字段 ，并存储到组件的 \$usedState 字段中。例如，编译后的小程序模板：

```
<view>{{a}}<view>
```

那么在编译后的组件类里就会多这样一个字段：

```
{
  $usedState = ['a']
}
```

在计算完小程序的 data 之后，会遍历 \$usedState 字段，将多余的内容过滤掉，只保留模板用到的数据。例如，即使原本组件的状态包含：

```
{
  state = {
    a: 1,
    b: 2,
    c: 3
  }
}
```

最终 setData 的数据也只会包含 \$usedState 里存在的字段：

```
{
  a: 1
}
```

 -    其次在 setData 之前进行了一次数据 Diff，找到数据的最小更新路径，然后再使用此路径来进行更新。例如：

```
// 初始 state
this.state = {
  a: [0],
  b: {
    x: {
      y: 1
    }
  }
}

// 调用 this.setState

this.setState({
  a: [1, 2],
  b: {
    x: {
      y: 10
    }
  }
})
```

在优化之前，会直接将 this.setState 的数据传给 setData，即:

```
this.$scope.setData({
  a: [1, 2],
  b: {
    x: {
      y: 10
    }
  }
})
```

而在优化之后的数据更新则变成了:

```
this.$scope.setData({
  'a[0]': 1,
  'a[1]': 2,
  'b.x.y': 10
})
```

这样的优化对于小程序来说意义非常重大，可以避免因为数据更新导致的性能问题。

## 事件处理函数对应

在小程序的组件里，事件响应函数需要配置在 methods 字段里。而在 JSX 里，事件是这样绑定的：

```
<View onClick={this.handleClick}></View>
```

编译的过程会将 JSX 转换成小程序模板：

```
<view bindclick="handleClick"></view>
```

在 createComponent 方法里，会将事件响应函数 handleClick 添加到 methods 字段中，并且在响应函数里调用真正的 this.handleClick 方法。

在编译过程中，会提取模板中绑定过的方法，并存到组件的 \$events 字段里，这样在运行时就可以只将用到的事件响应函数配置到小程序组件的 methods 字段中。

在运行时通过 processEvent 这个方法来处理事件的对应，省略掉处理过程，就是这样的：

```
function processEvent (eventHandlerName, obj) {
  obj[eventHandlerName] = function (event) {
    // ...
	scope[eventHandlerName].apply(callScope, realArgs)
  }
}
```

这个方法的核心作用就是解析出事件响应函数执行时真正的作用域 callScope 以及传入的参数。在 JSX 里，我们可以像下面这样通过 bind 传入参数：

```
<View onClick={this.handleClick.bind(this, arga, argb)}></View>
```

小程序不支持通过 bind 的方式传入参数，但是小程序可以用 data 开头的方式，将数据传递到 event.currentTarget.dataset 中。编译过程会将 bind 方式传递的参数对应到 dataset 中，processEvent 函数会从 dataset 里取到传入的参数传给真正的事件响应函数。

至此，经过编译之后的 Taro 组件终于可以运行在小程序环境里了。为了方便用户的使用，小程序运行时还提供了更多的特性，接下来会举一个例子来说明。

## 对 API 进行 Promise 化的处理

Taro 对小程序的所有 API 进行了一个分类整理，将其中的异步 API 做了一层 Promise 化的封装。例如，`wx.getStorage`经过下面的处理对应到`Taro.getStorage`\(此处代码作示例用，与实际源代码不尽相同\)：

```
Taro['getStorage'] = options => {
  let obj = Object.assign({}, options)
  const p = new Promise((resolve, reject) => {
	['fail', 'success', 'complete'].forEach((k) => {
	  obj[k] = (res) => {
	    options[k] && options[k](res)
	    if (k === 'success') {
		  resolve(res)
	    } else if (k === 'fail') {
		  reject(res)
	    }
	  }
	})
	wx['getStorage'](obj)
  })
  return p
}
```

就可以这么调用了：

```
// 小程序的调用方式
Taro.getStorage({
  key: 'test',
  success() {
	
  }
})
// 在 Taro 里也可以这样调用
Taro.getStorage({
  key: 'test'
}).then(() => {
  // success
})
```

## 百度/支付宝小程序运行时

Taro 在支持转换到 **微信小程序** 的同时，已经支持转换到 **百度/支付宝小程序** 了，这两家小程序的使用方式与微信小程序相似程度非常高，所以其运行时机制也与微信小程序基本一致，读者朋友可以自行类比，或通过源码一探究竟。

## 小结

本章节主要讲解了两个方面的内容:

- Taro 小程序运行时是如何配合编译过程，抹平了状态、事件绑定以及生命周期的差异，使得 Taro 组件运行在小程序环境中。
- 通过运行时对原生 API 进行扩展，实现了诸如事件绑定时通过 bind 传递参数、通过 Promise 的方式调用原生 API 等特性。
- 本章节参考 Taro 源码
  - [\@tarojs/taro-weapp](https://github.com/NervJS/taro/tree/master/packages/taro-weapp)，微信小程序运行时
  - [\@tarojs/taro-swan](https://github.com/NervJS/taro/tree/master/packages/taro-weapp)，百度小程序运行时
  - [\@tarojs/taro-alipay](https://github.com/NervJS/taro/tree/master/packages/taro-weapp)，支付宝小程序运行时
    