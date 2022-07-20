
# 高级类型之强大的infer关键字
---

# 高级类型之强大的infer关键字

`infer` 是工具类型和底层库中非常常用的关键字,表示在 extends 条件语句中待推断的类型变量,相对而言也比较难理解,我们不妨从一个 typescript 面试题开始:

我们之前学过 `ReturnType` 用于获取函数的返回类型,那么你会如何设计一个 `ReturnType`\?

```
interface User {
    id: number
    name: string
    form?: string
}

type Foo = () => User

type R1 = ReturnType<Foo> // User
```

## 条件类型与infer

我们先看一个简单例子:

```
type ParamType<T> = T extends (param: infer P) => any ? P : T;
```

上面例子表示,如果 `T` 能赋值给 `(param: infer P) => any`，则结果是`(param: infer P) => any`类型中的参数 `P`，否则返回为 `T`,`infer P`表示待推断的函数参数.

我们再回到开始的面试题,由于接受的函数返回类型是未知的,所以我们需要用`infer P`代表函数返回类型,如下:

```
type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
```

其实TypeScript也内置了一个获取构造函数参数的工具类型:

 -    `ConstructorParameters<T>` -- 提取构造函数中参数类型

```
class TestClass {
    constructor(public name: string, public age: number) {}
}
  
type R2 = ConstructorParameters<typeof TestClass> // [string, number]
```

我们再试着把它实现一下:

```
type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any
  ? P
  : never;
```

我们一步步分析一下这个工具类型:

1.  `new (...args: any[]`指构造函数,因为构造函数是可以被实例化的.
2.  `infer P`代表待推断的构造函数参数,如果接受的类型`T`是一个构造函数,那么返回构造函数的参数类型`P`,否则什么也不返回,即`never`类型

## infer的应用

`infer`非常强大,由于它的存在我们可以做出非常多的骚操作.

 1.     tuple转union,比如`[string, number] -> string | number`:

```
type ElementOf<T> = T extends Array<infer E> ? E : never;

type TTuple = [string, number];

type ToUnion = ElementOf<ATuple>; // string | number
```

 2.     union 转 intersection，如：`string | number -> string & number`

```
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type Result = UnionToIntersection<string | number>;
```

union 转 intersection 的操作多用于 mixin 中.

## 小结

本节我们接触了 infer 关键字,简单而言 infer 关键字就是声明一个类型变量,当类型系统给足条件的时候类型就会被推断出来.

至此,我们基本上我们接触完了主要的类型编程内容,接下来我们可以放开身手利用类型编程设计一些非常实用的类型工具.
    