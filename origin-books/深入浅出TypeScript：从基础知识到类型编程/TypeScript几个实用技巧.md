
# TypeScript几个实用技巧
---

# TypeScript几个实用技巧

## 注释的妙用

我们可以通过`/** */`来注释 TypeScript 的类型，当我们在使用相关类型的时候就会有注释的提示，这个技巧在多人协作开发的时候十分有用，我们绝大部分情况下不用去花时间翻文档或者跳页去看注释。

![2019-06-26-14-47-37](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb148376ae827~tplv-t2oaga2asx-image.image)

## 巧用类型推导

TypeScript 能根据一些简单的规则推断（检查）变量的类型。

比如一个简单的 add 函数

```
function add(a: number, b: number) {
    return a + b
}
```

TypeScript 就可以通过参数与 return 的运算符推导出函数的返回值

![2019-06-26-15-21-14](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb14837abf150~tplv-t2oaga2asx-image.image)

如果想获取函数整体的类型那么可以借助 `typeof`

> 注意与 JavaScript 中的 typeof 区分开

```
type AddFn = typeof add
```

当然上述情况算是比较简单的情况，有时候我们的返回值类型其实比较复杂，这个时候借助类型推导和 `ReturnType` 就可以很轻松地获取返回值类型。

```
type returnType = ReturnType<typeof add> // number
```

上述技巧在对 redux 进行编码的时候非常适用，这样可以省略我们大量的重复代码，毕竟 redux 的编码工作是非常繁琐的。

## 巧用元组

有时候我们可能需要批量的来获取参数，并且每一个参数的类型还不一样，我们可以声明一个元组如：

```
function query(...args:[string, number, boolean]){
  const d: string = args[0];
  const n: number = args[1];
  const b: boolean = args[2];
}
```

## 巧用Omit

有时候我们需要复用一个类型，但是又不需要此类型内的全部属性，因此需要剔除某些属性，这个时候 `Omit` 就派上用场了。

```
interface User {
    username: string
    id: number
    token: string
    avatar: string
    role: string
}
type UserWithoutToken = Omit<User, 'token'>
```

这个方法在 React 中经常用到，当父组件通过 props 向下传递数据的时候，通常需要复用父组件的 props 类型，但是又需要剔除一些无用的类型。

![2019-06-26-16-00-56](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb14837a31a2a~tplv-t2oaga2asx-image.image)

## 运用Record

`Record` 是 TypeScript 的一个高级类型，但是相关的文档并不多，所以经常被人忽略，但是是一个非常强大的高级类型。

Record 允许从 Union 类型中创建新类型，Union 类型中的值用作新类型的属性。

举个简单的例子，比如我们要实现一个简单的汽车品牌年龄表，一下写法貌似没有问题。

```
type Car = 'Audi' | 'BMW' | 'MercedesBenz'

const cars = {
    Audi: { age: 119 },
    BMW: { age: 113 },
    MercedesBenz: { age: 133 },
}
```

虽然这个写法没问题，但是有没有考虑过类型安全的问题？

比如：

- 我们忘记写了一个汽车品牌，他会报错吗？
- 我们拼写属性名错误了，它会报错吗？
- 我们添加了一个非上述三个品牌的品牌进去，他会报错吗？
- 我们更改了其中一个品牌的名字，他会有报错提醒吗？

上述这种写法统统不会，这就需要 Record 的帮助。

```
type Car = 'Audi' | 'BMW' | 'MercedesBenz'
type CarList = Record<Car, {age: number}>

const cars: CarList = {
    Audi: { age: 119 },
    BMW: { age: 113 },
    MercedesBenz: { age: 133 },
}
```

当我们拼写错误:

![2019-06-26-17-21-45](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb14837d333b3~tplv-t2oaga2asx-image.image)

当我们少些一个品牌:

![2019-06-26-17-22-18](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb148380cc7e6~tplv-t2oaga2asx-image.image)

当我们添加了一个非约定好的品牌进去:

![2019-06-26-17-23-47](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb14838368006~tplv-t2oaga2asx-image.image)

在实战项目中尽量多用 Record，它会帮助你规避很多错误，在 vue 或者 react 中有很多场景选择 Record 是更优解。

## 巧用类型约束

在 .tsx 文件里，泛型可能会被当做 jsx 标签

```
const toArray = <T>(element: T) => [element]; // Error in .tsx file.
```

加 extends 可破

```
const toArray = <T extends {}>(element: T) => [element]; // No errors.
```

## 小结

本节介绍了几个在实战中实用的技巧，当然我们的技巧不止上面这些，TypeScript 的技巧很多，我们只是介绍了最常用的几种，包括上一节的类型映射、条件类型、索引类型和几个类型操作符都是非常常用的手段，在了解了这些技巧之后，我们就可以在实战中小试牛刀了。
    