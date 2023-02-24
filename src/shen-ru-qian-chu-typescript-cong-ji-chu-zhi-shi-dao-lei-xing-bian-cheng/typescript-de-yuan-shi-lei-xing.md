
# Typescript 的原始类型
---

# Typescript 的原始类型

如果你了解 JavaScript 的基础类型，那么这一节你会很好理解。

TypeScript的原始类型包括: boolean、number、string、void、undefined、null、symbol、bigint。

## 布尔类型

我们用 `boolean` 来表示布尔类型，注意开头是小写的，如果你在Typescript文件中写成 `Boolean` 那代表是 JavaScript 中的布尔对象，这是新手常犯的错误。

```
const isLoading: boolean = false
```

> 这里需要提示一下，很多 TypeScript 的原始类型比如 boolean、number、string等等，在JavaScript中都有类似的关键字 Boolean、Number、String，后者是 JavaScript 的构造函数，比如我们用 Number 用于数字类型转化或者构造 Number 对象用的，而 TypeScript 中的 number 类型仅仅是表示类型，两者完全不同。

## 数字

JavaScript中的二进制、十进制、十六进制等数都可以用 `number` 类型表示。

```
const decLiteral: number = 6
const hexLiteral: number = 0xf00d
const binaryLiteral: number = 0b1010
const octalLiteral: number = 0o744
```

## 字符串

```
const book: string = '深入浅出 Typescript'
```

## 空值

表示没有任何类型，当一个函数没有返回值时，你通常会见到其返回值类型是 void：

```
function warnUser(): void {
    alert("This is my warning message");
}
```

实际上只有`null`和`undefined`可以赋给`void`:

```
const a: void = undefined
```

## Null 和 Undefined

TypeScript 里，undefined 和 null 两者各自有自己的类型分别叫做 undefined 和 null，和void相似，它们的本身的类型用处不是很大：

```
let a: undefined = undefined;
let b: null = null;
```

默认情况下 null 和 undefined 是所有类型的子类型，就是说你可以把 null 和 undefined 赋值给 number 类型的变量。

但是在正式项目中一般都是开启 `--strictNullChecks` 检测的，即 null 和 undefined 只能赋值给 any 和它们各自\(一个例外是 undefined 是也可以分配给void\)，可以规避非常多的问题。

## Symbol

**注意**：我们在使用 `Symbol` 的时候，必须添加 `es6` 的编译辅助库,如下：

![2020-01-05-20-49-18](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/5/16f75c0ca280fde9~tplv-t2oaga2asx-image.image)

Symbol 是在ES2015之后成为新的原始类型,它通过 `Symbol` 构造函数创建:

```
const sym1 = Symbol('key1');
const sym2 = Symbol('key2');
```

而且 Symbol 的值是唯一不变的：

```
Symbol('key1') === Symbol('key1') // false
```

## BigInt

`BigInt` 类型在 TypeScript3.2 版本被内置，使用 `BigInt` 可以安全地存储和操作大整数，即使这个数已经超出了JavaScript构造函数 `Number` 能够表示的安全整数范围。

**注意**：我们在使用 `BigInt` 的时候，必须添加 `ESNext` 的编译辅助库,如下：

![2020-01-05-20-47-38](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/5/16f75bf5587e2b69~tplv-t2oaga2asx-image.image)

在 JavaScript 中采用双精度浮点数,这导致精度有限，比如 `Number.MAX_SAFE_INTEGER` 给出了可以安全递增的最大可能整数，即`2**53-1`,我们看一下案例:

```
const max = Number.MAX_SAFE_INTEGER;

const max1 = max + 1
const max2 = max + 2

max1 === max2 //true
```

`max1`与`max2`居然相等？这就是超过精读范围造成的问题，而`BigInt`正是解决这类问题而生的:

```
// 注意，这里是 JavaScript 代码，并不是 typescript
const max = BigInt(Number.MAX_SAFE_INTEGER);

const max1 = max + 1n
const max2 = max + 2n

max1 === max2 // false
```

这是在 Chrome 浏览器 console 的结果:

![2019-10-07-22-22-48](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/10/16db4069694bc53a~tplv-t2oaga2asx-image.image)

值得注意的是我们需要用 `BigInt(number)` 把 Number 转化为 `BigInt`,同时如果类型是 `BigInt` ,那么数字后面需要加 `n` ,就如同上面例子的 `const max1 = max + 1n` 中的 `1n`。

在TypeScript中，`number` 类型虽然和 `BigInt` 都是有表示数字的意思，但是实际上两者类型是不同的:

```
declare let foo: number;
declare let bar: bigint;

foo = bar; // error: Type 'bigint' is not assignable to type 'number'.
bar = foo; // error: Type 'number' is not assignable to type 'bigint'.
```

## 小结

我们总结一下 TypeScript 中的原始类型：

- 布尔类型：`boolean`
- 数字类型：`number`
- 字符串类型：`string`
- 空值：`void`
- Null 和 Undefined：`null` 和 `undefined`
- Symbol 类型：`symbol`
- BigInt 大数整数类型：`bigint`

本节我们介绍了几个基本类型，难度并不大，通过简单了解我们可以读懂一些很基础的TS代码了。
    