
# 常见问题答疑
---

# 常见问题答疑

## TypeScript的结构类型系统是什么？

我们都知道 Anders Hejlsberg 先后设计了 c# 和 TypeScript ,两者有很多相似之处,但是其类型系统有本质区别:

- C# 采用的是 Nominal Type System（标明类型系统）
- TypeScript 考虑到 JavaScript 本身的灵活特性，采用的是结构类型系统（Structural Type System）

我们看两个例子体验一下两者的不同:

c#代码:

```

public class Foo  
{
    public string Name { get; set; }
    public int Id { get; set;}
}

public class Bar  
{
    public string Name { get; set; }
    public int Id { get; set; }
}

Foo foo = new Foo(); // Okay.
Bar bar = new Foo(); // Error!!!
```

虽然 `Foo` 和 `Bar` 两个类的内部定义完全一致，但是赋值时会报错，可见两者类型本质上是不同的。

TS 代码:

```
class Foo {
  method(input: string): number { ... }
}

class Bar {
  method(input: string): number { ... }
}

const foo: Foo = new Foo(); // Okay.
const bar: Bar = new Foo(); // Okay.
```

赋值成功，可见两者类型是相同的，这就是c#与ts最大的不同之处。

究其原因，TypeScript 比较的并不是类型定义本身，而是类型定义的形状（Shape），即各种约束条件：

> TypeScript的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

为什么采用更灵活的**结构类型系统**\?那就是因为 TS 为了兼容 js 那灵活的特性,这种类型系统用在 js 这种语言上最合适不过了。

## 如何防止两种类型在结构上兼容？

我们在上面提到了,TS采用了灵活的结构类型系统,那么会导致一些问题,比如:

```
interface ScreenCoordinate {
  x: number;
  y: number;
}
interface PrintCoordinate {
  x: number;
  y: number;
}
function sendToPrinter(pt: PrintCoordinate) {
  // ...
}
function getCursorPos(): ScreenCoordinate {
  return { x: 0, y: 0 };
}

sendToPrinter(getCursorPos());
```

由于 `ScreenCoordinate` 与 `PrintCoordinate` 的形状\(Shape\)相同，那么根据结构类型系统的特性，他们的类型是兼容的，但是你如果不想让他们是兼容的类型应该怎么操作\?

这时候需要添加一个 「brand」 成员:

```
interface ScreenCoordinate {
  _screenCoordBrand: any;
  x: number;
  y: number;
}
interface PrintCoordinate {
  _printCoordBrand: any;
  x: number;
  y: number;
}

// 报错
sendToPrinter(getCursorPos());
```

## TS类型的substitutability\?

我们先看以下例子会不会报错\?

```
function handler(arg: string) {
  // ....
}

function doSomething(callback: (arg1: string, arg2: number) => void) {
  callback('hello', 42);
}

// 很多人的预期是这里会报错,因为doSomething要求的回调函数是有两个参数的,但是handler只有一个参数
doSomething(handler);
```

为什么更少参数的函数能够赋值给具有更多参数的函数\?

并没有，究其原因是因为 `handler` 的类型 `(arg: string) => xx` 是可以作为 `(arg1: string, arg2: number) => void` 的替代品即 substitutability，在这种情况下是不会报错的。

类似的情况还有：

```
function doSomething(): number {
  return 42;
}

function callMeMaybe(callback: () => void) {
  callback();
}

// 有人认为这里会报错,原因是doSomething返回的是number,而callback返回的是void
callMeMaybe(doSomething);

```

为什么 TS 会有 substitutability 这种设计，原因也是要兼容 JavaScript 灵活的语法。

## 小结

TypeScript 是 JavaScript 的超集，毕竟是一门系统的编程语言，我们用 30+ 节的内容想做到面面俱到几乎不可能，因此如果你有什么疑问可以在下方留言，我会尽可能解答。
    