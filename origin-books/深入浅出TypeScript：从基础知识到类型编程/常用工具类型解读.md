
# 常用工具类型解读
---

# 常用工具类型解读

用 JavaScript 编写中大型程序是离不开 lodash 这种工具集的，而用 TypeScript 编程同样离不开类型工具的帮助，类型工具就是类型版的 lodash.

我们在本节会介绍一些类型工具的设计与实现，如果你的项目不是非常简单的 demo 级项目，那么在你的开发过程中一定会用到它们。

起初，TypeScript 没有这么多工具类型，很多都是社区创造出来的，然后 TypeScript 陆续将一些常用的工具类型纳入了官方基准库内。

比如 `ReturnType`、`Partial`、`ConstructorParameters`、`Pick` 都是官方的内置工具类型.

其实上述的工具类型都可以被我们开发者自己模拟出来,本节我们学习一下如何设计工具类型.

## 工具类型的设计

### 泛型

我们说过可以把工具类型类比 js 中的工具函数，因此必须有输入和输出，而在TS的类型系统中能担当类型入口的只有泛型.

比如`Partial`,它的作用是将属性全部变为可选.

```
type Partial<T> = { [P in keyof T]?: T[P] };
```

这个类型工具中,我们需要将类型通过泛型`T`传入才能对类型进行处理并返回新类型,可以说,一切类型工具的基础就是泛型.

### 类型递归

是的,在类型中也有类似于js递归的操作,上面提到的`Partial`可以把属性变为可选,但是他有个问题,就是无法把深层属性变成可选,只能处理外层属性:

```
interface Company {
    id: number
    name: string
}

interface Person {
    id: number
    name: string
    adress: string
    company: Company
}

type R1 = Partial<Person>
```

![2019-09-26-20-43-21](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/6/16da1a8b34dc7e54~tplv-t2oaga2asx-image.image)

这里想处理深层属性,就必须用到类型递归:

```
type DeepPartial<T> = {
    [U in keyof T]?: T[U] extends object
    ? DeepPartial<T[U]>
    : T[U]
};

type R2 = DeepPartial<Person>
```

![2019-09-26-20-48-25](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/6/16da1a8b34f7a170~tplv-t2oaga2asx-image.image)

这个原理跟js类似,就是对外层的value做个判断,如果恰好是`object`类型,那么对他也进行属性可选化的操作即可.

### 关键字

像`keyof`、`typeof`这种常用关键字我们已经了解过了,现在主要谈一下另外一些常用关键字.

`+` `-`这两个关键字用于映射类型中给属性添加修饰符,比如`-?`就代表将可选属性变为必选,`-readonly`代表将只读属性变为非只读.

比如TS就内置了一个类型工具`Required<T>`,它的作用是将传入的属性变为必选项:

```
type Required<T> = { [P in keyof T]-?: T[P] };
```

当然还有很常用的`Type inference`就是上一节infer关键字的使用,还有之前的`Conditional Type`条件类型都是工具类型的常用手法,在这里就不多赘述了。

## 常见工具类型的解读

### Omit

`Omit`这个工具类型在开发过程中非常常见,以至于官方在3.5版本正式加入了`Omit`类型.

要了解之前我们先看一下另一个内置类型工具的实现`Exclude<T>`:

```
type Exclude<T, U> = T extends U ? never : T;
type T = Exclude<1 | 2, 1 | 3> // -> 2
```

`Exclude` 的作用是从 `T` 中排除出**可分配**给 `U`的元素.

> 这里的可分配即`assignable`,指可分配的,`T extends U`指T是否可分配给U

那么`Exclude`跟`Omit`有什么关系呢\?

其实`Omit` = `Exclude` + `Pick`

```
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

type Foo = Omit<{name: string, age: number}, 'name'> // -> { age: number }
```

`Omit<T, K>`的作用是忽略`T`中的某些属性.

### Merge

`Merge<O1, O2>`的作用是将两个对象的属性合并:

```
type O1 = {
    name: string
    id: number
}

type O2 = {
    id: number
    from: string
}

type R2 = Merge<O1, O2>
```

结果

![2019-09-26-23-34-57](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1464cc80532~tplv-t2oaga2asx-image.image)

这个类型工具也非常常用,他主要有两个部分组成:

`Merge<O1, O2>` = `Compute<A>` + `Omit<U, T>`

`Compute`的作用是将交叉类型合并.即:

```
type Compute<A extends any> =
    A extends Function
    ? A
    : { [K in keyof A]: A[K] }

type R1 = Compute<{x: 'x'} & {y: 'y'}>
```

结果如下:

![2019-09-26-23-41-30](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1464cbb2ca3~tplv-t2oaga2asx-image.image)

Merge的最终实现如下:

```
type Merge<O1 extends object, O2 extends object> =
    Compute<O1 & Omit<O2, keyof O1>>
```

### Intersection

`Intersection<T, U>`的作用是取`T`的属性,此属性同样也存在与`U`.

```

type Props = { name: string; age: number; visible: boolean };
type DefaultProps = { age: number };

// Expect: { age: number; }
type DuplicatedProps = Intersection<Props, DefaultProps>;
```

`Intersection`是`Extract`与`Pick`的结合

`Intersection<T, U>` = `Extract<T, U>` + `Pick<T, U>`

```

type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

```

### Overwrite

`Overwrite<T, U>`顾名思义,是用`U`的属性覆盖`T`的相同属性.

```
type Props = { name: string; age: number; visible: boolean };
type NewProps = { age: string; other: string };

// Expect: { name: string; age: string; visible: boolean; }
type ReplacedProps = Overwrite<Props, NewProps>
```

即:

```
type Overwrite<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T>
> = Pick<I, keyof I>;
```

### Mutable

将 `T` 的所有属性的 `readonly` 移除

```
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}
```

## 小结

本节我们介绍了几种常见的高级类型工具,尤其是前三个非常常用,当然如果你想进一步学习类型工具的设计,建议阅读[utility-types](https://github.com/piotrwitek/utility-types)的源码,本节部分实现就是源于此类型工具库.
    