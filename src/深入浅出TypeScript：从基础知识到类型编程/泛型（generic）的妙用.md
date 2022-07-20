
# 泛型（generic）的妙用
---

# 泛型（generic）的妙用

泛型是 TypeScript 中非常重要的一个概念，因为在之后实际开发中任何时候都离不开泛型的帮助，原因就在于泛型给予开发者创造灵活、可重用代码的能力。

## 初识泛型

假设我们用一个函数，它可接受一个 number 参数并返回一个 number 参数。

```
function returnItem (para: number): number {
    return para
}
```

我们按以上的写法貌似是没问题的，那么如果我们要接受一个 string 并返回同样一个 string 呢？逻辑是一样的，但是仅仅是类型发生了变化，难道需要再写一遍？

```
function returnItem (para: string): string {
    return para
}
```

这明显是重复性的代码，我们应该如何才能避免上述情况呢？

难道我们只能用 any 表示了？

```
function returnItem (para: any): any {
    return para
}
```

我们现在的情况是，我们在静态编写的时候并不确定传入的参数到底是什么类型，只有当在运行时传入参数后我们才能确定。

那么我们需要变量，这个变量代表了传入的类型，然后再返回这个变量，它是一种特殊的变量，只用于表示类型而不是值。

这个类型变量在 TypeScript 中就叫做「泛型」。

```
function returnItem<T>(para: T): T {
    return para
}
```

我们在函数名称后面声明泛型变量 `<T>`，它用于捕获开发者传入的参数类型（比如说string），然后我们就可以使用T\(也就是string\)做参数类型和返回值类型了。

## 多个类型参数

定义泛型的时候，可以一次定义多个类型参数，比如我们可以同时定义泛型 `T` 和 泛型 `U`：

```
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

## 泛型变量

我们现在假设有这样的需求，我们的函数接受一个数组，如何把数组的长度打印出来，最后返回这个数组，我们应该如何定义？

我们当然得运用上刚才学的泛型：

```
function getArrayLength<T>(arg: T): T {
  console.log(arg.length) // 类型“T”上不存在属性“length”
  return arg
}
```

糟糕，在编写过程中报错了，编译器告诉我们「他们不知道类型T上有没有 length 这个属性」。

所以我们得想办法告诉编译器，这个类型 T 是有 length 属性的，不然在编译器眼里，这个 T 是可以代表任何类型的。

我们已经明确知道要传入的是一个数组了，为什么不这样声明呢: `Array<T>`？

反正传入的类型不管如何，这起码是数组是可以确定的，在这里泛型变量 T 当做类型的一部分使用，而不是整个类型，增加了灵活性。

```
function getArrayLength<T>(arg: Array<T>) {
  
  console.log((arg as Array<any>).length) // ok
  return arg
}

```

## 泛型接口

泛型也可用于接口声明，以上面的函数为例，如果我们将其转化为接口的形式。

```
interface ReturnItemFn<T> {
    (para: T): T
}
```

那么当我们想传入一个number作为参数的时候，就可以这样声明函数:

```
const returnItem: ReturnItemFn<number> = para => para
```

## 泛型类

泛型除了可以在函数中使用，还可以在类中使用，它既可以作用于类本身，也可以作用与类的成员函数。

我们假设要写一个`栈`数据结构，它的简化版是这样的:

```
class Stack {
    private arr: number[] = []

    public push(item: number) {
        this.arr.push(item)
    }

    public pop() {
        this.arr.pop()
    }
}
```

同样的问题，如果只是传入 number 类型就算了，可是需要不同的类型的时候，还得靠泛型的帮助。

```
class Stack<T> {
    private arr: T[] = []

    public push(item: T) {
        this.arr.push(item)
    }

    public pop() {
        this.arr.pop()
    }
}

```

泛型类看上去与泛型接口差不多， 泛型类使用 `<>` 括起泛型类型，跟在类名后面。

## 泛型约束

现在有一个问题，我们的泛型现在似乎可以是任何类型，但是我们明明知道我们的传入的泛型属于哪一类，比如属于 number 或者 string 其中之一，那么应该如何约束泛型呢？

```
class Stack<T> {
    private arr: T[] = []

    public push(item: T) {
        this.arr.push(item)
    }

    public pop() {
        this.arr.pop()
    }
}

```

我们可以用 `<T extends xx>` 的方式约束泛型，比如下图显示我们约束泛型为 number 或者 string 之一，当传入 boolean 类型的时候，就会报错。

![2019-06-25-14-41-19](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded4ce42f572c9~tplv-t2oaga2asx-image.image)

## 泛型约束与索引类型

我们先看一个常见的需求，我们要设计一个函数，这个函数接受两个参数，一个参数为对象，另一个参数为对象上的属性，我们通过这两个参数返回这个属性的值，比如：

```
function getValue(obj: object, key: string) {
  return obj[key] // error
}
```

我们会得到一段报错，这是新手 TypeScript 开发者常常犯的错误，编译器告诉我们，参数 `obj` 实际上是 `{}`,因此后面的 `key` 是无法在上面取到任何值的。

因为我们给参数 `obj` 定义的类型就是 `object`，在默认情况下它只能是 `{}`，但是我们接受的对象是各种各样的，我们需要一个泛型来表示传入的对象类型，比如 `T extends object`:

```
function getValue<T extends object>(obj: T, key: string) {
  return obj[key] // error
}
```

这依然解决不了问题，因为我们第二个参数 `key` 是不是存在于 `obj` 上是无法确定的，因此我们需要对这个 `key` 也进行约束，我们把它约束为只存在于 `obj` 属性的类型，这个时候需要借助到后面我们会进行学习的索引类型进行实现 `<U extends keyof T>`，我们用索引类型 `keyof T` 把传入的对象的属性类型取出生成一个联合类型，这里的泛型 U 被约束在这个联合类型中，这样一来函数就被完整定义了：

```
function getValue<T extends object, U extends keyof T>(obj: T, key: U) {
  return obj[key] // ok
}
```

比如我们传入以下对象：

```
const a = {
  name: 'xiaomuzhu',
  id: 1
}

```

这个时候 `getValue` 第二个参数 `key` 的类型被约束为一个联合类型 `name | id`,他只可能是这两个之一，因此你甚至能获得良好的类型提示：

![2019-10-18-14-52-35](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded4ce432593b0~tplv-t2oaga2asx-image.image)

## 使用多重类型进行泛型约束

> 注意，本示例是在非 「--strictPropertyInitialization」或者「--strict」下测试的

我们刚才学习了通过单一类型对泛型进行约束的方式，那么我们再设想以下场景，如果我们的泛型需要被约束，它只被允许实现以下两个接口的类型呢？

```
interface FirstInterface {
  doSomething(): number
}

interface SecondInterface {
  doSomethingElse(): string
}
```

我们或许会在一个类中这样使用：

```
class Demo<T extends FirstInterface, SecondInterface> {
  private genericProperty: T

  useT() {
    this.genericProperty.doSomething()
    this.genericProperty.doSomethingElse() // 类型“T”上不存在属性“doSomethingElse”
  }
}
```

但是只有 `FirstInterface` 约束了泛型 `T`，`SecondInterface` 并没有生效，上面的方法并不能用两个接口同时约束泛型，那么我们这样使用呢：

```
class Demo<T extends FirstInterface, T extends SecondInterface> { // 标识符“T”重复
  ...
}
```

上述的语法就是错误的，那么应该如何用多重类型约束泛型呢\?

比如我们就可以将接口 `FirstInterface` 与 `SecondInterface` 作为超接口来解决问题：

```
interface ChildInterface extends FirstInterface, SecondInterface {

}
```

这个时候 `ChildInterface` 是 `FirstInterface` 与 `SecondInterface` 的子接口，然后我们通过泛型约束就可以达到多类型约束的目的。

```
class Demo<T extends ChildInterface> {
  private genericProperty: T

  useT() {
    this.genericProperty.doSomething()
    this.genericProperty.doSomethingElse()
  }
}
```

经过评论区 \@塔希 同学的提醒，我们可以利用交叉类型来进行多类型约束，如下：

```
interface FirstInterface {
  doSomething(): number
}

interface SecondInterface {
  doSomethingElse(): string
}

class Demo<T extends FirstInterface & SecondInterface> {
  private genericProperty: T

  useT() {
    this.genericProperty.doSomething() // ok
    this.genericProperty.doSomethingElse() // ok
  }
}

```

以上就是我们在多个类型约束泛型中的使用技巧。

## 泛型与 new

我们假设需要声明一个泛型拥有构造函数，比如：

```
function factory<T>(type: T): T {
  return new type() // This expression is not constructable.
}
```

编译器会告诉我们这个表达式不能构造，因为我们没有声明这个泛型 `T` 是构造函数，这个时候就需要 `new` 的帮助了。

```
function factory<T>(type: {new(): T}): T {
  return new type() // ok
}
```

参数 `type` 的类型 `{new(): T}` 就表示此泛型 T 是可被构造的，在被实例化后的类型是泛型 T。

## 小结

设计泛型的关键目的是在成员之间提供有意义的约束，这些成员可以是：

- 接口
- 类的实例成员
- 类的方法
- 函数参数
- 函数返回值

除了本节介绍的泛型用法之外，还有一些更高级的用法，后面我们会讲到，泛型十分重要，值得我们多进行代码练习来巩固知识。
    