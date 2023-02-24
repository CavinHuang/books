
# 内置工具类型基础-别再妖魔化工具类型了！
---

在很多时候，工具类型其实都被妖魔化了。它仿佛是武林中人人追捧的武功秘籍，修炼难度极其苛刻，掌握它就能立刻类型编程功力大涨，成为武林盟主傲世群雄。然而，这是非常错误的想法。

首先，工具类型学起来不难，它的概念也不复杂。很多同学觉得难，是因为还没完全熟悉所有类型工具，对类型系统还懵懵懂懂的情况下，就直接一头扎进各种复杂的类型编程源码中去。其实只要我们熟悉了类型工具的使用，了解类型系统的概念，再结合小册中对类型编程 4 大范式进行的分类解析，再复杂的类型编程也会被你所掌握的。

其次，**工具类型和类型编程并不完全等价**。虽然它是类型编程最常见的一种表现形式，但不能完全代表类型编程水平，如很多框架代码中，类型编程的复杂度也体现在**函数的重载与泛型约束**方面。但通过工具类型，我们能够更好地理解类型编程的本质。

此前我们已经了解了类型工具、类型系统的相关概念，那么这一节，我们就从内置工具类型解读开始，打开类型编程的新世界。

> 本节代码见：[Builtin Tool Types](https://github.com/linbudu599/TypeScript-Tiny-Book/tree/main/packages/10-builtin-tool-type)

## 工具类型的分类

内置的工具类型按照类型操作的不同，其实也可以大致划分为这么几类：

- 对属性的修饰，包括对象属性和数组元素的可选/必选、只读/可写。我们将这一类统称为**属性修饰工具类型**。
- 对既有类型的裁剪、拼接、转换等，比如使用对一个对象类型裁剪得到一个新的对象类型，将联合类型结构转换到交叉类型结构。我们将这一类统称为**结构工具类型**。
- 对集合（即联合类型）的处理，即交集、并集、差集、补集。我们将这一类统称为**集合工具类型**。
- 基于 infer 的模式匹配，即对一个既有类型特定位置类型的提取，比如提取函数类型签名中的返回值类型。我们将其统称为**模式匹配工具类型**。
- 模板字符串专属的工具类型，比如神奇地将一个对象类型中的所有属性名转换为大驼峰的形式。这一类当然就统称为**模板字符串工具类型**了。

这一节我们要讲解的 TypeScript 内置工具类型，包括了访问性修饰、结构、集合以及模式匹配工具类型这四种，我们会讲解它们的具体实现，也就是使用了哪些类型操作以及操作背后的原理，再思考它们存在哪些不足，存在的扩展方向有哪些。在第 17 节内置工具类型进阶，我们会将这些扩展方向一一实现，进一步拓宽你的类型编程思路。

## 属性修饰工具类型

这一部分的工具类型主要使用**属性修饰**、**映射类型**与**索引类型**相关（索引类型签名、索引类型访问、索引类型查询均有使用，因此这里直接用索引类型指代）。

在内置工具类型中，访问性修饰工具类型包括以下三位：

```typescript
type Partial<T> = {
    [P in keyof T]?: T[P];
};

type Required<T> = {
    [P in keyof T]-?: T[P];
};

type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

其中，Partial 与 Required 可以认为是一对工具类型，它们的功能是相反的，而在实现上，它们的唯一差异是在索引类型签名处的可选修饰符，Partial 是 `?`，即标记属性为可选，而 Required 则是 `-?`，相当于在原本属性上如果有 `?` 这个标记，则移除它。

如果你觉得不好记，其实 Partial 也可以使用 `+?` 来显式的表示添加可选标记：

```typescript
type Partial<T> = {
    [P in keyof T]+?: T[P];
};
```

需要注意的是，可选标记不等于修改此属性类型为 `原类型 | undefined` ，如以下的接口结构：

```typescript
interface Foo {
  optional: string | undefined;
  required: string;
}
```

如果你声明一个对象去实现这个接口，它仍然会要求你提供 optional 属性：

```typescript
interface Foo {
  optional: string | undefined;
  required: string;
}

// 类型 "{ required: string; }" 中缺少属性 "optional"，但类型 "Foo" 中需要该属性。
const foo1: Foo = {
  required: '1',
};

const foo2: Foo = {
  required: '1',
  optional: undefined
};
```

这是因为对于结构声明来说，一个属性是否必须提供仅取决于其是否携带可选标记。即使你使用 never 也无法标记这个属性为可选：

```typescript
interface Foo {
  optional: never;
  required: string;
}

const foo: Foo = {
  required: '1',
  // 不能将类型“string”分配给类型“never”。
  optional: '',
};
```

反而你会惊喜地发现你没法为这个属性声明值了，毕竟除本身以外没有类型可以赋值给 never 类型。

而类似 `+?`，Readonly 中也可以使用 `+readonly`：

```typescript
type Readonly<T> = {
    +readonly [P in keyof T]: T[P];
};
```

虽然 TypeScript 中并没有提供它的另一半，但参考 Required 其实我们很容易想到这么实现一个工具类型 Mutable，来将属性中的 readonly 修饰移除：

```typescript
type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};
```

### 思考

现在我们了解了 Partial、Readonly 这一类属性修饰的工具类型，不妨想想它们是否能满足我们的需要？假设场景逐渐开始变得复杂，比如以下这些情况：

- 现在的属性修饰是浅层的，如果我想将**嵌套在里面的对象类型**也进行修饰，需要怎么改进？
- 现在的属性修饰是全量的，如果我只想**修饰部分属性**呢？这里的部分属性，可能是**基于传入已知的键名**来确定（比如属性a、b），也可能是**基于属性类型**来确定\(比如所有函数类型的值\)？

## 结构工具类型

这一部分的工具类型主要使用**条件类型**以及**映射类型**、**索引类型**。

结构工具类型其实又可以分为两类，**结构声明**和**结构处理**。

结构声明工具类型即快速声明一个结构，比如内置类型中的 Record：

```typescript
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

其中，`K extends keyof any` 即为键的类型，这里使用 `extends keyof any` 标明，传入的 K 可以是单个类型，也可以是联合类型，而 T 即为属性的类型。

```typescript
// 键名均为字符串，键值类型未知
type Record1 = Record<string, unknown>;
// 键名均为字符串，键值类型任意
type Record2 = Record<string, any>;
// 键名为字符串或数字，键值类型任意
type Record3 = Record<string | number, any>;
```

其中，`Record<string, unknown>` 和 `Record<string, any>` 是日常使用较多的形式，通常我们使用这两者来代替 object 。

在一些工具类库源码中其实还存在类似的结构声明工具类型，如：

```typescript
type Dictionary<T> = {
  [index: string]: T;
};

type NumericDictionary<T> = {
  [index: number]: T;
};
```

Dictionary （字典）结构只需要一个作为属性类型的泛型参数即可。

而对于结构处理工具类型，在 TypeScript 中主要是 Pick、Omit 两位选手：

```typescript
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

首先来看 Pick，它接受两个泛型参数，T 即是我们会进行结构处理的原类型（一般是对象类型），而 K 则被约束为 T 类型的键名联合类型。由于泛型约束是立即填充推导的，即你为第一个泛型参数传入 Foo 类型以后，K 的约束条件会立刻被填充，因此在你输入 K 时会获得代码提示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a4d98dda5fe424ba805f04793f4dd29~tplv-k3u1fbpfcp-zoom-1.image)

```typescript
interface Foo {
  name: string;
  age: number;
  job: JobUnionType;
}

type PickedFoo = Pick<Foo, "name" | "age">
```

然后 Pick 会将传入的联合类型作为需要保留的属性，使用这一联合类型配合映射类型，即上面的例子等价于：

```typescript
type Pick<T> = {
    [P in "name" | "age"]: T[P];
};
```

联合类型的成员会被依次映射，并通过索引类型访问来获取到它们原本的类型。

而对于 Omit 类型，看名字其实能 get 到它就是 Pick 的反向实现：**Pick 是保留这些传入的键**，比如从一个庞大的结构中选择少数字段保留，需要的是这些少数字段，而 **Omit 则是移除这些传入的键**，也就是从一个庞大的结构中剔除少数字段，需要的是剩余的多数部分。

但它的实现看起来有些奇怪：

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

首先我们发现，Omit 是基于 Pick 实现的，这也是 TypeScript 中成对工具类型的另一种实现方式。上面的 Partial 与 Required 使用类似的结构，**在关键位置使用一个相反操作来实现反向**，而这里的 Omit 类型则是基于 Pick 类型实现，也就是**反向工具类型基于正向工具类型实现**。

首先接受的泛型参数类似，也是一个类型与联合类型（要剔除的属性），但是在将这个联合类型传入给 Pick 时多了一个 Exclude，这一工具类型属于工具类型，我们可以暂时理解为 `Exclude<A, B>` 的结果就是联合类型 A 中不存在于 B 中的部分：

```typescript
type Tmp1 = Exclude<1, 2>; // 1
type Tmp2 = Exclude<1 | 2, 2>; // 1
type Tmp3 = Exclude<1 | 2 | 3, 2 | 3>; // 1
type Tmp4 = Exclude<1 | 2 | 3, 2 | 4>; // 1 | 3
```

因此，在这里 `Exclude<keyof T, K>` 其实就是 T 的键名联合类型中剔除了 K 的部分，将其作为 Pick 的键名，就实现了剔除一部分类型的效果。

### 思考

- Pick 和 Omit 是基于键名的，如果我们需要**基于键值类型**呢？比如仅对函数类型的属性？
- 除了将一个对象结构拆分为多个子结构外，对这些子结构的**互斥处理**也是结构工具类型需要解决的问题之一。互斥处理指的是，假设你的对象存在三个属性 A、B、C ，其中 A 与 C 互斥，即 A 存在时不允许 C 存在。而 A 与 B 绑定，即 A 存在时 B 也必须存在，A 不存在时 B 也不允许存在。此时应该如何实现？

另外，你可能发现 Pick 会约束第二个参数的联合类型来自于对象属性，而 Omit 并不这么要求？官方团队的考量是，可能存在这么一种情况：

```typescript
type Omit1<T, K> = Pick<T, Exclude<keyof T, K>>;
type Omit2<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 这里就不能用严格 Omit 了
declare function combineSpread<T1, T2>(obj: T1, otherObj: T2, rest: Omit1<T1, keyof T2>): void;

type Point3d = { x: number, y: number, z: number };

declare const p1: Point3d;

// 能够检测出错误，rest 中缺少了 y
combineSpread(p1, { x: 10 }, { z: 2 });
```

这里我们使用 `keyof Obj2` 去剔除 Obj1，此时如果声明约束反而不符合预期。

此前我在掘金发表过一篇详细介绍这一问题的文章，你可以参考 [你的 Omit 类型还可以更严格一些](https://juejin.cn/post/7068947450714652709#comment)。

## 集合工具类型

这一部分的工具类型主要使用条件类型、条件类型分布式特性。

在开始集合类型前，我们不妨先聊一聊数学中的集合概念。对于两个集合来说，通常存在**交集、并集、差集、补集**这么几种情况，用图表示是这样的：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6fc9197877a41e1b017fe262b6191a8~tplv-k3u1fbpfcp-zoom-1.image)

我们搭配上图来依次解释这些概念。

- **并集**，两个集合的合并，合并时重复的元素只会保留一份（这也是联合类型的表现行为）。
- **交集**，两个集合的相交部分，即同时存在于这两个集合内的元素组成的集合。
- **差集**，对于 A、B 两个集合来说，A 相对于 B 的差集即为 **A 中独有而 B 中不存在的元素** 的组成的集合，或者说 **A 中剔除了 B 中也存在的元素以后剩下的部分**。
- **补集**，补集是差集的特殊情况，此时**集合 B 为集合 A 的子集**，在这种情况下 **A 相对于 B 的补集** + **B** = **完整的集合 A**。

内置工具类型中提供了交集与差集的实现：

```typescript
type Extract<T, U> = T extends U ? T : never;

type Exclude<T, U> = T extends U ? never : T;
```

这里的具体实现其实就是条件类型的分布式特性，即当 T、U 都是联合类型（视为一个集合）时，T 的成员会依次被拿出来进行 `extends U ? T1 : T2` 的计算，然后将最终的结果再合并成联合类型。

比如对于交集 Extract ，其运行逻辑是这样的：

```typescript
type AExtractB = Extract<1 | 2 | 3, 1 | 2 | 4>; // 1 | 2

type _AExtractB =
  | (1 extends 1 | 2 | 4 ? 1 : never) // 1
  | (2 extends 1 | 2 | 4 ? 2 : never) // 2
  | (3 extends 1 | 2 | 4 ? 3 : never); // never
```

而差集 Exclude 也是类似，但需要注意的是，差集存在相对的概念，即 A 相对于 B 的差集与 B 相对于 A 的差集并不一定相同，而交集则一定相同。

为了便于理解，我们也将差集展开：

```typescript
type SetA = 1 | 2 | 3 | 5;

type SetB = 0 | 1 | 2 | 4;

type AExcludeB = Exclude<SetA, SetB>; // 3 | 5
type BExcludeA = Exclude<SetB, SetA>; // 0 | 4

type _AExcludeB =
  | (1 extends 0 | 1 | 2 | 4 ? never : 1) // never
  | (2 extends 0 | 1 | 2 | 4 ? never : 2) // never
  | (3 extends 0 | 1 | 2 | 4 ? never : 3) // 3
  | (5 extends 0 | 1 | 2 | 4 ? never : 5); // 5

type _BExcludeA =
  | (0 extends 1 | 2 | 3 | 5 ? never : 0) // 0
  | (1 extends 1 | 2 | 3 | 5 ? never : 1) // never
  | (2 extends 1 | 2 | 3 | 5 ? never : 2) // never
  | (4 extends 1 | 2 | 3 | 5 ? never : 4); // 4
```

除了差集和交集，我们也可以很容易实现并集与补集，为了更好地建立印象，这里我们使用集合相关的命名：

```typescript
// 并集
export type Concurrence<A, B> = A | B;

// 交集
export type Intersection<A, B> = A extends B ? A : never;

// 差集
export type Difference<A, B> = A extends B ? never : A;

// 补集
export type Complement<A, B extends A> = Difference<A, B>;
```

补集基于差集实现，我们只需要约束**集合 B 为集合 A 的子集**即可。

内置工具类型中还有一个场景比较明确的集合工具类型：

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type _NonNullable<T> = Difference<T, null | undefined>
```

很明显，它的本质就是集合 T 相对于 `null | undefined` 的差集，因此我们可以用之前的差集来进行实现。

在基于分布式条件类型的工具类型中，其实也存在着正反工具类型，但**并不都是简单地替换条件类型结果的两端**，如交集与补集就只是简单调换了结果，但二者作用却**完全不同**。

联合类型中会自动合并相同的元素，因此我们可以默认这里指的类型集合全部都是类似 Set 那样的结构，不存在重复元素。

### 思考

- 目前为止我们的集合类型都停留在一维的层面，即联合类型之间的集合运算。如果现在我们要处理**对象类型结构的集合运算**呢？
- 在处理对象类型结构运算时，可能存在不同的需求，比如合并时，我们可能希望**保留原属性或替换原属性**，可能希望**替换原属性的同时并不追加新的属性**进来（即仅使用新的对象类型中的属性值覆盖原本对象类型中的同名属性值），此时要如何灵活地处理这些情况？

## 模式匹配工具类型

这一部分的工具类型主要使用**条件类型**与 **infer 关键字**。

在条件类型一节中我们已经差不多了解了 infer 关键字的使用，而更严格地说 infer 其实代表了一种 **模式匹配（pattern matching）** 的思路，如正则表达式、Glob 中等都体现了这一概念。

首先是对函数类型签名的模式匹配：

```typescript
type FunctionType = (...args: any) => any;

type Parameters<T extends FunctionType> = T extends (...args: infer P) => any ? P : never;

type ReturnType<T extends FunctionType> = T extends (...args: any) => infer R ? R : any;
```

根据 infer 的位置不同，我们就能够获取到不同位置的类型，在函数这里则是参数类型与返回值类型。

我们还可以更进一步，比如只匹配第一个参数类型：

```typescript
type FirstParameter<T extends FunctionType> = T extends (
  arg: infer P,
  ...args: any
) => any
  ? P
  : never;

type FuncFoo = (arg: number) => void;
type FuncBar = (...args: string[]) => void;

type FooFirstParameter = FirstParameter<FuncFoo>; // number

type BarFirstParameter = FirstParameter<FuncBar>; // string
```

除了对函数类型进行模式匹配，内置工具类型中还有一组对 Class 进行模式匹配的工具类型：

```typescript
type ClassType = abstract new (...args: any) => any;

type ConstructorParameters<T extends ClassType> = T extends abstract new (
  ...args: infer P
) => any
  ? P
  : never;

type InstanceType<T extends ClassType> = T extends abstract new (
  ...args: any
) => infer R
  ? R
  : any;
```

Class 的通用类型签名可能看起来比较奇怪，但实际上它就是声明了可实例化（new）与可抽象（abstract）罢了。我们也可以使用接口来进行声明：

```typescript
export interface ClassType<TInstanceType = any> {
    new (...args: any[]): TInstanceType;
}
```

对 Class 的模式匹配思路类似于函数，或者说这是一个通用的思路，即基于放置位置的匹配。放在参数部分，那就是构造函数的参数类型，放在返回值部分，那当然就是 Class 的实例类型了。

### 思考

- infer 和条件类型的搭配看起来会有奇效，比如在哪些场景？比如随着条件类型的嵌套每个分支会提取不同位置的 infer ？
- infer 在某些特殊位置下应该如何处理？比如上面我们写了第一个参数类型，不妨试着来写写**最后一个参数类型**？

## 总结与预告

在这一节，我们对 TypeScript 内置的工具类型进行了全面地讲解，从它们的原理、使用的类型操作、使用场景，到对它们进行扩展的可能方向。在学习完毕本节内容以后，你可能会发现某些工具类型很好地解决了曾困扰你的问题，也可能发现某些工具类型离解决问题还差上那么一些？

这个时候，不妨回想下我们前面学到的这么多类型工具，条件类型、索引类型、映射类型等以及各种关键字，思考下如果把泛型当成函数参数，你要如何写一个函数才能实现自己想要的效果？然后尝试将函数的逻辑迁移到类型编程中，或许你会恍然大悟。

## 扩展阅读

### infer 约束

在某些时候，我们可能对 infer 提取的类型值有些要求，比如我只想要数组第一个为字符串的成员，如果第一个成员不是字符串，那我就不要了。

先写一个提取数组第一个成员的工具类型：

```typescript
type FirstArrayItemType<T extends any[]> = T extends [infer P, ...any[]]
  ? P
  : never;
```

加上对提取字符串的条件类型：

```typescript
type FirstArrayItemType<T extends any[]> = T extends [infer P, ...any[]]
  ? P extends string
    ? P
    : never
  : never;
```

试用一下：

```typescript
type Tmp1 = FirstArrayItemType<[599, 'linbudu']>; // never
type Tmp2 = FirstArrayItemType<['linbudu', 599]>; // 'linbudu'
type Tmp3 = FirstArrayItemType<['linbudu']>; // 'linbudu'
```

看起来好像能满足需求，但程序员总是精益求精的。泛型可以声明约束，只允许传入特定的类型，那 infer 中能否也添加约束，只提取特定的类型？

TypeScript 4.7 就支持了 infer 约束功能来实现**对特定类型地提取**，比如上面的例子可以改写为这样：

```typescript
type FirstArrayItemType<T extends any[]> = T extends [infer P extends string, ...any[]]
  ? P
  : never;
```

实际上，infer + 约束的场景是非常常见的，尤其是在某些连续嵌套的情况下，一层层的 infer 提取再筛选会严重地影响代码的可读性，而 infer 约束这一功能无疑带来了更简洁直观的类型编程代码。
    