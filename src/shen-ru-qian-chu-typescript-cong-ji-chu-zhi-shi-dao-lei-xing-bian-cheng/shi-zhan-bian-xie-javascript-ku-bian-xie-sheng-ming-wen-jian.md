
# 实战-编写 JavaScript 库编写声明文件
---

# 实战:编写 JavaScript 库编写声明文件

本节我们正式开始声明文件的编写实战,因此我们得找一个没有 `d.ts` 声明的开源库,比较常用但是却用纯 js 编写的库我想到了 `events`,这个库就是 Node.js 中 `events` 模块的浏览器和 node 通用版,具体的 API 可见 [EventEmitter](https://nodejs.org/api/events.html)。

## 搭建环节

我们先把库从 github 上克隆下来

```
git clone https://github.com/Gozala/events.git && events && npm i
```

## 如何入手

在根目录下新建一个文件 `index.d.ts`，我们的声明文件就在这里编写。

为 js 库编写 `d.ts` 需要我们从两方面入手，一个就是官方的 API 文档，另一个就是库的源码。

`events`库的API与 Node.js 10.1 的API是一样的,所以我们可以结合Node 10.x的[文档](https://nodejs.org/docs/latest-v10.x/api/events.html)编码.

不管是从文档 api 的使用方式还是项目本身的源码都表明，我们主要在使用 `events` 库暴露出来的一个类 `EventEmitter`.

```
var EventEmitter = require('events')

var ee = new EventEmitter()
ee.on('message', function (text) {
  console.log(text)
})
ee.emit('message', 'hello world')
```

因此我们要先声明一个类并导出:

```
export class EventEmitter {

}
```

然后我们继续读官方文档，看看这个类暴露出了哪些方法或者属性:

## 静态属性/方法

![events的文档](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb158f633ffc4~tplv-t2oaga2asx-image.image)

我们先从最简单的入手，通过文档我们发现这个类暴露出了一个 `EventEmitter.defaultMaxListeners` 静态属性，通常情况下我们的事件最多注册10个监听器，但是我们可以通过改变 `EventEmitter.defaultMaxListeners` 来修改这个默认值，很显然这是个 `number` 类型的静态属性。

```
export class EventEmitter {
  static defaultMaxListeners: number;

}
```

除此之外，该类还有一个被**废弃**的静态方法就是 `EventEmitter.listenerCount(emitter, type)`，返回指定事件的监听器数量，虽然已经被废弃了，但是官方依然没有删除此方法，因此我们也需要为他编写类型:

```
export class EventEmitter {
  static defaultMaxListeners: number;
  static listenerCount(emitter: EventEmitter, type: string | number): number;
}
```

## 实例属性/方法

我们发现这个类暴露出来的实例方法多达15个，这个时候不要着急去编码，我们得先观察一下这些方法是不是有一些共同的类型，我们先定义出来，否则会重复写很多类型，这也是大家之后编写 `d.ts` 文件要注意的地方之一。

共同类型一: `type`，指事件的名称，注意这里 `events` 库的表示事件名称的参数名称与node官方不一样，在node官方文档中是 `eventName`，大家知道 `events` 库中的 `type` 其实就是官方文档的 `eventName` 就行了，都是指**事件名称**。

这个 `type` 的类型既可以是 `string` 又可以是 `symbol`。

共同类型二: `listener`，指事件回调函数，往往作为某事件触发的回调函数:

我们可以先把这两个需要反复使用的类型声明出来:

```

type Type = string | symbol
type Listener = (...args: any[]) => void;

export class EventEmitter {
  static defaultMaxListeners: number;
  static listenerCount(emitter: EventEmitter, type: Type): number;
}
```

接下来的情况就简单多了，我们根据文档把实例方法的类型定义出来即可:

```
export type Listener = (...args: any[]) => void;
export type Type = string | symbol

export class EventEmitter {
  static listenerCount(emitter: EventEmitter, type: Type): number;
  static defaultMaxListeners: number;

  eventNames(): Array<Type>;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  emit(type: Type, ...args: any[]): boolean;
  addListener(type: Type, listener: Listener): this;
  on(type: Type, listener: Listener): this;
  once(type: Type, listener: Listener): this;
  prependOnceListener(type: Type, listener: Listener): this;
  removeListener(type: Type, listener: Listener): this;
  off(type: Type, listener: Listener): this;
  removeAllListeners(type?: Type): this;
  listeners(type: Type): Listener[];
  listenerCount(type: Type): number;
  prependListener(type: Type, listener: Listener): this;
  rawListeners(type: Type): Listener[];
}
```

## 使用体验

我已经把定义好的 `d.ts` 连同 `events` 发不到了 npm 上,npm 名称为 `xiaomuzhu-events`。

我们新建一个TS项目,然后下载 `xiaomuzhu-events` 包:

```
npm i -S xiaomuzhu-events
```

然后开始正常编码,使用过程很流畅,有完整的类型提示和报错

![类型提示](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb158f703344e~tplv-t2oaga2asx-image.image)

至此我们的声明文件编写就完毕了。

## 小结

`events` 库相对比较简单，我们也算是抛砖引玉，如果想进一步学习如何编写声明文件，可以移步[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)，那里有非常多的案例值得学习。
    