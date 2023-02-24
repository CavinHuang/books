
# 高级类型之条件类型
---

# 高级类型之条件类型

之所以叫类型编程,是因为我们可以对_类型_进行编程了,比如之前我们的类型基本都是写死的,比如这样:

```
type F = string
```

但是有时候我们并不能再编写代码的时候就把类型确定了,到底是什么类型还是需要一些外部条件的,那么这个时候应该怎么办\?

TypeScript 在2.8版本之后引入了条件类型\(conditional type\).

## 条件类型的使用

条件类型够表示非统一的类型,以一个条件表达式进行类型关系检测，从而在两种类型中选择其一:

```
T extends U ? X : Y
```

上面的代码可以理解为: 若 `T` 能够赋值给 `U`，那么类型是 `X`，否则为 `Y`,有点类似于JavaScript中的三元条件运算符.

比如我们声明一个函数 `f`,它的参数接收一个布尔类型,当布尔类型为 `true` 时返回 `string` 类型,否则返回 `number` 类型:

```
declare function f<T extends boolean>(x: T): T extends true ? string : number;

const x = f(Math.random() < 0.5)
const y = f(false)
const z = f(true)
```

而 `x,y,z` 的类型分别如下:

![2019-09-25-23-14-23](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb142562f98dd~tplv-t2oaga2asx-image.image)

![2019-09-25-23-14-37](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb14257578f5b~tplv-t2oaga2asx-image.image)

![2019-09-25-23-14-51](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb142576db052~tplv-t2oaga2asx-image.image)

条件类型就是这样,只有类型系统中给出充足的条件之后,它才会根据条件推断出类型结果.

## 条件类型与联合类型

条件类型有一个特性,就是「分布式有条件类型」,但是分布式有条件类型是有前提的,条件类型里待检查的类型必须是`naked type parameter`.

好了,肯定有人已经晕了,什么是分布式有条件类型\?`naked type parameter`又是什么\?

`naked type parameter`指的是**裸类型参数**,怎么理解\?这个「裸」是指类型参数没有被包装在其他类型里,比如没有被数组、元组、函数、Promise等等包裹.

我们举个简单的例子:

```
// 裸类型参数,没有被任何其他类型包裹即T
type NakedUsage<T> = T extends boolean ? "YES" : "NO"
// 类型参数被包裹的在元组内即[T]
type WrappedUsage<T> = [T] extends [boolean] ? "YES" : "NO";
```

好了,`naked type parameter`我们了解了之后,「分布式有条件类型」就相对容易理解了,按照官方文档的说法是「分布式有条件类型在实例化时会自动分发成联合类型」.

这个说法很绕,我们直接看例子:

```
type Distributed = NakedUsage<number | boolean> //  = NakedUsage<number> | NakedUsage<boolean> =  "NO" | "YES"
type NotDistributed = WrappedUsage<number | boolean > // "NO"
```

当我们给类型`NakedUsage`加入联合类型`number | boolean`时,它的结果返回`"NO" | "YES"`,相当于联合类型中的`number`和`boolean`分别赋予了`NakedUsage<T>`然后再返回出一个联合类型,这个操作大家可以类比JavaScript中的`Array.map()`

> JavaScript中map\(\) 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。

我们看`NotDistributed`的结果,他接受的同样是联合类型`number | boolean`,但是返回一个特定的类型`"NO"`,而非一个联合类型,就是因为他的类型参数是被包裹的即`[<T>]`,不会产生分布式有条件类型的特性.

这一部分比较难以理解,我们可以把「分布式有条件类型」粗略得理解为类型版的`map()方法`,然后我们再看一些实用案例加深理解.

我们先思考一下,如何设计一个类型工具`Diff<T, U>`,我们要找出`T`类型中`U`不包含的部分:

```
type R = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
```

联合类型`"a" | "b" | "c" | "d"`与`"a" | "c" | "f"`相比,后者不包含`"b" | "d"`.

我们借助有条件类型很容易写出这个工具函数:

```
type Diff<T, U> = T extends U ? never : T;
```

同样的,我们可以生产出`Filter<T, U>` `NonNullable<T>`等工具类型:

```
// 类似于js数组的filter
type Filter<T, U> = T extends U ? T : never;
type R1 = Filter<string | number | (() => void), Function>;

// 剔除 null和undefined
type NonNullable<T> = Diff<T, null | undefined>;

type R2 = NonNullable<string | number | undefined>;  // string | number
```

我们会在后面专门的章节介绍如何构建这些工具类型,而工具类型的编写离不开「分布式有条件类型」的帮助.

## 条件类型与映射类型

这一小部分需要读者对映射类型有基本的了解,我们依然是先看一个思考题:

我没有一个interface `Part`,现在需要编写一个工具类型将interface中**函数类型**的**名称**取出来,在这个题目示例中,应该取出的是:

![2019-09-26-12-03-00](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1425771bb18~tplv-t2oaga2asx-image.image)

```
interface Part {
    id: number;
    name: string;
    subparts: Part[];
    updatePart(newName: string): void;
}

type R = FunctionPropertyNames<Part>;
```

那么你会如何设计这个工具类型\?

> 在一些有要求TS基础的公司,设计工具类型是一个比较大的考点.

这种问题我们应该换个思路,比如我们把interface看成js中的对象字面量,用js的思维你会如何取出\?

这个时候问题就简单了,遍历整个对象,找出value是函数的部分取出key即可.

在TypeScript的类型编程中也是类似的道理,我们要遍历interface,取出类型为`Function`的部分找出key即可:

```
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
```

我一步步分析一下上述工具类型\(我们按照js的思维讲解,可能有不严谨之处,但是有助于你的理解\):

 1.     假设我们把`Part`代入泛型`T`,`[K in keyof T]`相当于遍历整个interface
 2.     这时`K`相当于interface的key,`T[K]`相当于interface的value
 3.     接下来,用条件类型验证value的类型,如果是`Function`那么将value作为新interface的key保留下来,否则为`never`
 4.     到这里我们得到了遍历修改后的**新**interface即:

```
type R = {
    id: never;
    name: never;
    subparts: never;
    updatePart: "updatePart";
}
```

> 特别注意: 这里产生的新interface R中的value是老interface Part的key,取出新interface R的value就是取出了对应老interface Part的key

1.  但是我们的的要求是取出老interface Part的key,这个时候再次用`[keyof T]`作为key依次取出新interface的value,但是由于`id` `name`和`subparts`的value为`never`就不会返回任何类型了,所以只返回了`'updatePart'`.

> `never`类型表示不会是任何值,即什么都没有,甚至不是`null`类型

## 小结

这一节的信息量很大,如果没有仔细搞清楚之前的映射类型相关的知识,理解起来会比较困难,不过没关系,我们后面会有一个专门的章节讲工具类型的设计,还会涉及相关的内容,不过今天有一个思考题:

如何取出下面interface中的可选类型\?

```
interface People = {
  id: string
  name: string
  age?: number
  from?: string
}
```

即

```
type R = NullableKeys<People> // type R = "age" | "from"
```

> 提示: TypeScript中有一类符号,`+`或`-`允许控制映射的类型修饰符（例如\?或readonly\),`-?`意味着必须全部存在,意味着将消除类型映射的可选类型.
    