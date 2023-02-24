
# Typescript 中其他常见类型
---

# Typescript 中其他常见类型

我们上一节了解了 TypeScript 中的原始类型,其实还有一些常见的类型没有涉及。

比如计算机类型系统理论中的[顶级类型](https://en.wikipedia.org/wiki/Top_type):

- any
- unknown

比如类型系统中的[底部类型](https://en.wikipedia.org/wiki/Bottom_type):

- never

再比如非原始类型\(non-primitive type\):

- object

当然还有比较常见的数组、元组等等。

## any

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。

这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。

这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用any类型来标记这些变量：

```
let notSure: any = 4;
notSure = "maybe a string instead";
```

`any`类型是多人协作项目的大忌，很可能把Typescript变成AnyScript，通常在不得已的情况下，不应该首先考虑使用此类型。

## unknown

`unknown` 是 TypeScript 3.0 引入了新类型,是 `any` 类型对应的安全类型。

`unknown` 和 `any` 的主要区别是 `unknown` 类型会更加严格:在对`unknown`类型的值执行大多数操作之前,我们必须进行某种形式的检查,而在对 `any` 类型的值执行操作之前,我们不必进行任何检查。

我们先看一下他跟 `any` 的共同点,它跟 `any` 一样,可以是任何类型:

```
let value: any;

value = true;             // OK
value = 1;                // OK
value = "Hello World";    // OK
value = Symbol("type");   // OK
value = {}                // OK
value = []                // OK
```

如果我们换成 `unknown`,结果一样

```
let value: unknown;

value = true;             // OK
value = 1;                // OK
value = "Hello World";    // OK
value = Symbol("type");   // OK
value = {}                // OK
value = []                // OK
```

那我们看看它们的区别在哪里:

```
let value: any;

value.foo.bar;  // OK
value();        // OK
new value();    // OK
value[0][1];    // OK

```

如果是 `unknown` 类型,那么结果大不相同:

```
let value: unknown;

value.foo.bar;  // ERROR
value();        // ERROR
new value();    // ERROR
value[0][1];    // ERROR
```

我们看到,这就是 `unknown` 与 `any` 的不同之处,虽然它们都可以是任何类型,但是当 `unknown` 类型被确定是某个类型之前,它不能被进行任何操作比如实例化、getter、函数执行等等。

而 `any` 是可以的,这也是为什么说 `unknown` 是更安全的 `any`, `any` 由于过于灵活的设定,导致它与 JavaScript 没有太多区别,很容易产生低级错误,很多场景下我们可以选择 `unknown` 作为更好的替代品.

那么上面情况下我们可以执行 `unknown` 呢\?那就是缩小其类型范围,我们在后面的章节会涉及「类型保护」的内容,它就可以缩小类型范围,比如:

```
function getValue(value: unknown): string {
  if (value instanceof Date) { // 这里由于把value的类型缩小为Date实例的范围内,所以`value.toISOString()`
    return value.toISOString();
  }

  return String(value);
}

```

## never

never 类型表示的是那些永不存在的值的类型，never 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 never 的子类型或可以赋值给 never 类型（除了never本身之外）。

> 即使any也不可以赋值给never。

两个场景中 never 比较常见:

```
// 抛出异常的函数永远不会有返回值
function error(message: string): never {
    throw new Error(message);
}

// 空数组，而且永远是空的
const empty: never[] = []
```

## 数组

数组有两种类型定义方式，一种是使用泛型:

```
const list: Array<number> = [1, 2, 3]
```

另一种使用更加广泛那就是在元素类型后面接上 `[]`:

```
const list: number[] = [1, 2, 3]
```

## 元组（Tuple）

元组类型与数组类型非常相似，表示一个已知元素数量和类型的数组，各元素的类型不必相同。

比如，你可以定义一对值分别为`string`和`number`类型的元组。

```
let x: [string, number];
x = ['hello', 10, false] // Error
x = ['hello'] // Error
```

我们看到，这就是元组与数组的不同之处，元组的类型如果多出或者少于规定的类型是会报错的，必须严格跟事先声明的类型一致才不会报错。

那么有人会问，我们的类型完全一致，只是顺序错了有没有问题，比如上个例子中我们把 `string`、`number` 调换位置：

```
let x: [string, number];
x = ['hello', 10]; // OK
x = [10, 'hello']; // Error
```

我们看到，元组非常严格，即使类型的顺序不一样也会报错。

元组中包含的元素，必须与声明的类型一致，而且不能多、不能少，甚至顺序不能不符。

我们可以把元组看成严格版的数组，比如`[string, number]`我们可以看成是:

```
interface Tuple extends Array<string | number> {
  0: string;
  1: number;
  length: 2;
}
```

元组继承于数组，但是比数组拥有更严格的类型检查。

此外，还有一个个元组越界问题，比如 Typescript 允许向元组中使用数组的push方法插入新元素:

```
const tuple: [string, number] = ['a', 1];
tuple.push(2); // ok
console.log(tuple); // ["a", 1, 2] -> 正常打印出来
```

但是当我们访问新加入的元素时，会报错:

```
console.log(tuple[2]); // Tuple type '[string, number]' of length '2' has no element at index '2'
```

## Object

object 表示非原始类型，也就是除 number，string，boolean，symbol，null 或 undefined 之外的类型。

```

// 这是下一节会提到的枚举类型
enum Direction {
    Center = 1
}

let value: object

value = Direction
value = [1]
value = [1, 'hello']
value = {}
```

我们看到,普通对象、枚举、数组、元组通通都是 `object` 类型。

## 小结

我们继续学习了 TypeScript 中常见的类型,以上这些类型多多少少在 JavaScript 中有一些对应,我们下一节会讲一个全新的类型,那就是枚举类型\(enum type\).
    