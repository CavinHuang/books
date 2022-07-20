
# 高级类型之交叉类型、联合类型、类型别名
---

# 高级类型之交叉类型、联合类型、类型别名

本节我们要真正进入 TypeScript 的新阶段了,因为从现在开始我们要接触**高级类型**.

## 交叉类型

交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。

在 JavaScript 中，混入是一种非常常见的模式，在这种模式中，你可以从两个对象中创建一个新对象，新对象会拥有着两个对象所有的功能。

交叉类型可以让你安全的使用此种模式：

```
interface IAnyObject {
    [prop: string]: any
}

function mixin<T extends IAnyObject, U extends IAnyObject>(first: T, second: U): T & U {
    const result = <T & U>{};
    for (let id in first) {
      (<T>result)[id] = first[id];
    }
    for (let id in second) {
      if (!result.hasOwnProperty(id)) {
        (<U>result)[id] = second[id];
      }
    }
  
    return result;
  }
  
  const x = mixin({ a: 'hello' }, { b: 42 });
  
  // 现在 x 拥有了 a 属性与 b 属性
  const a = x.a;
  const b = x.b;
```

## 联合类型

在 JavaScript 中，你希望属性为多种类型之一，如字符串或者数组。

这就是联合类型所能派上用场的地方（它使用 | 作为标记，如 string | number）。

```
function formatCommandline(command: string[] | string) {
  let line = '';
  if (typeof command === 'string') {
    line = command.trim();
  } else {
    line = command.join(' ').trim();
  }
}
```

联合类型表示一个值可以是几种类型之一，我们用竖线（|）分隔每个类型，所以number | string | boolean表示一个值可以是number、string、或boolean。

## 类型别名

类型别名会给一个类型起个新名字,类型别名有时和接口很像,但是可以作用于原始值、联合类型、元组以及其它任何你需要手写的类型.

你可以使用 `type SomeName = someValidTypeAnnotation`的语法来创建类型别名:

```
type some = boolean | string

const b: some = true // ok
const c: some = 'hello' // ok
const d: some = 123 // 不能将类型“123”分配给类型“some”
```

此外类型别名可以是泛型:

```
type Container<T> = { value: T };
```

也可以使用类型别名来在属性里引用自己：

```
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}
```

类型别名看起来跟 interface 非常像，那么应该如何区分两者？

interface 只能用于定义对象类型，而 type 的声明方式除了对象之外还可以定义交叉、联合、原始类型等，类型声明的方式适用范围显然更加广泛。

但是interface也有其特定的用处：

 -    interface 方式可以实现接口的 extends 和 implements
 -    interface 可以实现接口合并声明

```
type Alias = { num: number }
interface Interface {
    num: number;
}
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface): Interface;
```

此外,接口创建了一个新的名字,可以在其它任何地方使用,类型别名并不创建新名字,比如,错误信息就不会使用别名。

## 小结

本节我们学习了几个常见的高级类型，这些高级类型可以跟我们后面几节讲的各种类型操作符和高级类型进行组合，然后产生更加强大的新类型，也就是所谓的类型编程，从现在起我们进入了学习的重点与难点的地带。
    