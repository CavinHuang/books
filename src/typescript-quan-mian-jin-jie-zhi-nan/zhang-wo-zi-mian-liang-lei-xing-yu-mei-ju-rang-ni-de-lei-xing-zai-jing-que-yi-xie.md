
# 掌握字面量类型与枚举，让你的类型再精确一些
---

了解了原始类型与对象类型以后，我们已经能完成简单场景的类型标注了。但这还远远不够，我们还可以让这些类型标注更精确一些。比如，有一个接口结构，它描述了响应的消息结构：

```typescript
interface IRes {
  code: number;
  status: string;
  data: any;
}
```

在大多数情况下，这里的 code 与 number 实际值会来自于一组确定值的集合，比如 code 可能是 10000 / 10001 / 50000，status 可能是 `"success"` / `"failure"`。而上面的类型只给出了一个宽泛的 number（string），此时我们既不能在访问 code 时获得精确的提示，也失去了 TypeScript 类型即文档的功能。

这个时候要怎么做？

> 本节代码见：[Literal and Enum](https://github.com/linbudu599/TypeScript-Tiny-Book/tree/main/packages/02-literal-and-enum)

## 字面量类型与联合类型

我们可以使用联合类型加上字面量类型，把上面的例子改写成这样：

```typescript
interface Res {
  code: 10000 | 10001 | 50000;
  status: "success" | "failure";
  data: any;
}
```

这个时候，我们就能在访问时获得精确地类型推导了。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a428d95d0eee4c269302df47bf45e7b3~tplv-k3u1fbpfcp-watermark.image?)

对于 `declare var res: Res`，你可以认为它其实就是快速生成一个符合指定类型，但没有实际值的变量，同时它也不存在于运行时中。上面引入了一些新的概念，我们来一个一个了解。

## 字面量类型

最开始你可能觉得很神奇，`"success"` 不是一个值吗？为什么它也可以作为类型？在 TypeScript 中，这叫做**字面量类型（Literal Types）**，它代表着比原始类型更精确的类型，同时也是原始类型的子类型（关于类型层级，我们会在后面详细了解）。

字面量类型主要包括**字符串字面量类型**、**数字字面量类型**、**布尔字面量类型**和**对象字面量类型**，它们可以直接作为类型标注：

```typescript
const str: "linbudu" = "linbudu";
const num: 599 = 599;
const bool: true = true;
```

为什么说字面量类型比原始类型更精确？我们可以看这么个例子：

```typescript
// 报错！不能将类型“"linbudu599"”分配给类型“"linbudu"”。
const str1: "linbudu" = "linbudu599";

const str2: string = "linbudu";
const str3: string = "linbudu599";
```

上面的代码，原始类型的值可以包括任意的同类型值，而字面量类型要求的是**值级别的字面量一致**。

单独使用字面量类型比较少见，因为单个字面量类型并没有什么实际意义。它通常和联合类型（即这里的 `|`）一起使用，表达一组字面量类型：

```typescript
interface Tmp {
  bool: true | false;
  num: 1 | 2 | 3;
  str: "lin" | "bu" | "du"
}
```

### 联合类型

而联合类型你可以理解为，它代表了**一组类型的可用集合**，只要最终赋值的类型属于联合类型的成员之一，就可以认为符合这个联合类型。联合类型对其成员并没有任何限制，除了上面这样对同一类型字面量的联合，我们还可以将各种类型混合到一起：

```typescript
interface Tmp {
  mixed: true | string | 599 | {} | (() => {}) | (1 | 2)
}
```

这里有几点需要注意的：

- 对于联合类型中的函数类型，需要使用括号`()`包裹起来
- 函数类型并不存在字面量类型，因此这里的 `(() => {})` 就是一个合法的函数类型
- 你可以在联合类型中进一步嵌套联合类型，但这些嵌套的联合类型最终都会被展平到第一级中

联合类型的常用场景之一是通过多个对象类型的联合，来实现手动的互斥属性，即这一属性如果有字段1，那就没有字段2：

```typescript
interface Tmp {
  user:
    | {
        vip: true;
        expires: string;
      }
    | {
        vip: false;
        promotion: string;
      };
}

declare var tmp: Tmp;

if (tmp.user.vip) {
  console.log(tmp.user.expires);
}
```

在这个例子中，user 属性会满足普通用户与 VIP 用户两种类型，这里 vip 属性的类型基于布尔字面量类型声明。我们在实际使用时可以通过判断此属性为 true ，确保接下来的类型推导都会将其类型收窄到 VIP 用户的类型（即联合类型的第一个分支）。这一能力的使用涉及类型守卫与类型控制流分析，我们会在后面的章节详细来说。

我们也可以通过类型别名来复用一组字面量联合类型：

```typescript
type Code = 10000 | 10001 | 50000;

type Status = "success" | "failure";
```

除了原始类型的字面量类型以外，对象类型也有着对应的字面量类型。

### 对象字面量类型

类似的，对象字面量类型就是一个对象类型的值。当然，这也就意味着这个对象的值全都为字面量值：

```typescript
interface Tmp {
  obj: {
    name: "linbudu",
    age: 18
  }
}

const tmp: Tmp = {
  obj: {
    name: "linbudu",
    age: 18
  }
}
```

如果要实现一个对象字面量类型，意味着完全的实现这个类型每一个属性的每一个值。对象字面量类型在实际开发中的使用较少，我们只需要了解。

总的来说，在需要更精确类型的情况下，我们可以使用字面量类型加上联合类型的方式，将类型从 string 这种宽泛的原始类型直接收窄到 `"resolved" | "pending" | "rejected"` 这种精确的字面量类型集合。

需要注意的是，**无论是原始类型还是对象类型的字面量类型，它们的本质都是类型而不是值**。它们在编译时同样会被擦除，同时也是被存储在内存中的类型空间而非值空间。

如果说字面量类型是对原始类型的进一步扩展（对象字面量类型的使用较少），那么枚举在某些方面则可以理解为是对对象类型的扩展。

## 枚举

枚举并不是 JavaScript 中原生的概念，在其他语言中它都是老朋友了（Java、C#、Swift 等）。目前也已经存在给 JavaScript（ECMAScript）引入枚举支持的 [proposal-enum](https://github.com/rbuckton/proposal-enum) 提案，但还未被提交给 TC39 ，仍处于 Stage 0 阶段。

如果要和 JavaScript 中现有的概念对比，我想最贴切的可能就是你曾经写过的 constants 文件了：

```javascript
export default {
  Home_Page_Url: "url1",
  Setting_Page_Url: "url2",
  Share_Page_Url: "url3",
}

// 或是这样：
export const PageUrl = {
  Home_Page_Url: "url1",
  Setting_Page_Url: "url2",
  Share_Page_Url: "url3",
}
```

如果把这段代码替换为枚举，会是如下的形式：

```typescript
enum PageUrl {
  Home_Page_Url = "url1",
  Setting_Page_Url = "url2",
  Share_Page_Url = "url3",
}

const home = PageUrl.Home_Page_Url;
```

这么做的好处非常明显。首先，你拥有了更好的类型提示。其次，这些常量被真正地**约束在一个命名空间**下（上面的对象声明总是差点意思）。如果你没有声明枚举的值，它会默认使用数字枚举，并且从 0 开始，以 1 递增：

```typescript
enum Items {
  Foo,
  Bar,
  Baz
}
```

在这个例子中，`Items.Foo` , `Items.Bar` , `Items.Baz`的值依次是 0，1，2 。

如果你只为某一个成员指定了枚举值，那么之前未赋值成员仍然会使用从 0 递增的方式，之后的成员则会开始从枚举值递增。

```typescript
enum Items {
  // 0 
  Foo,
  Bar = 599,
  // 600
  Baz
}
```

在数字型枚举中，你可以使用延迟求值的枚举值，比如函数：

```typescript
const returnNum = () => 100 + 499;

enum Items {
  Foo = returnNum(),
  Bar = 599,
  Baz
}
```

但要注意，延迟求值的枚举值是有条件的。**如果你使用了延迟求值，那么没有使用延迟求值的枚举成员必须放在使用常量枚举值声明的成员之后（如上例），或者放在第一位**：

```typescript
enum Items {
  Baz,
  Foo = returnNum(),
  Bar = 599,
}
```

TypeScript 中也可以同时使用字符串枚举值和数字枚举值：

```typescript
enum Mixed {
  Num = 599,
  Str = "linbudu"
}
```

枚举和对象的重要差异在于，**对象是单向映射的**，我们只能从键映射到键值。而**枚举是双向映射的**，即你可以从枚举成员映射到枚举值，也可以从枚举值映射到枚举成员：

```typescript
enum Items {
  Foo,
  Bar,
  Baz
}

const fooValue = Items.Foo; // 0
const fooKey = Items[0]; // "Foo"
```

要了解这一现象的本质，我们需要来看一看枚举的编译产物，如以上的枚举会被编译为以下 JavaScript 代码：

```typescript
"use strict";
var Items;
(function (Items) {
    Items[Items["Foo"] = 0] = "Foo";
    Items[Items["Bar"] = 1] = "Bar";
    Items[Items["Baz"] = 2] = "Baz";
})(Items || (Items = {}));
```

`obj[k] = v` 的返回值即是 v，因此这里的 `obj[obj[k] = v] = k` 本质上就是进行了 `obj[k] = v` 与 `obj[v] = k` 这样两次赋值。

但需要注意的是，仅有值为数字的枚举成员才能够进行这样的双向枚举，**字符串枚举成员仍然只会进行单次映射**：

```typescript
enum Items {
  Foo,
  Bar = "BarValue",
  Baz = "BazValue"
}

// 编译结果，只会进行 键-值 的单向映射
"use strict";
var Items;
(function (Items) {
    Items[Items["Foo"] = 0] = "Foo";
    Items["Bar"] = "BarValue";
    Items["Baz"] = "BazValue";
})(Items || (Items = {}));
```

除了数字枚举与字符串枚举这种分类以外，其实还存在着普通枚举与常量枚举这种分类方式。

### 常量枚举

常量枚举和枚举相似，只是其声明多了一个 const：

```typescript
const enum Items {
  Foo,
  Bar,
  Baz
}

const fooValue = Items.Foo; // 0
```

它和普通枚举的差异主要在访问性与编译产物。对于常量枚举，你**只能通过枚举成员访问枚举值**（而不能通过值访问成员）。同时，在编译产物中并不会存在一个额外的辅助对象（如上面的 Items 对象），对枚举成员的访问会被**直接内联替换为枚举的值**。以上的代码会被编译为如下形式：

```javascript
const fooValue = 0 /* Foo */; // 0
```

> 实际上，常量枚举的表现、编译产物还受到配置项 `--isolateModules` 以及 `--preserveConstEnums` 等的影响，我们会在后面的 TSConfig 详解中了解更多。

## 总结与预告

在这一节中，我们了解了字面量类型和枚举的使用，包括字面量类型的分类，与联合类型的结合使用，以及枚举与其编译产物等等。

对于字面量类型，我们可以使用它来提供更精确的类型标注。比如，你可以将如用户类型与请求状态码这一类属性的类型，都使用**字面量类型＋联合类型**的形式改写，获得更详细的类型信息与更严格的类型约束。

而对于枚举，我们可以使用它来替换掉之前使用对象进行常量收敛的代码，而如果你希望减少编译后的代码，可以进一步地使用在编译后会被完全抹除的常量枚举。

## 扩展阅读

### 类型控制流分析中的字面量类型

除了手动声明字面量类型以外，实际上 TypeScript 也会在某些情况下将变量类型推导为字面量类型，看这个例子：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eecde2e8de214264a42dd74da8c8e17b~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6931f3897d674a8d9803164e5f4d7f2f~tplv-k3u1fbpfcp-watermark.image?)

你会发现，使用 const 声明的变量，其类型会从值推导出最精确的字面量类型。而对象类型则只会推导至符合其属性结构的接口，不会使用字面量类型：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/742ad435155e41e293abedf0fe8d053e~tplv-k3u1fbpfcp-watermark.image?)

要解答这个现象，需要你回想 let 和 const 声明的意义。我们知道，使用 let 声明的变量是可以再次赋值的，在 TypeScript 中要求赋值类型始终与原类型一致（如果声明了的话）。因此对于 let 声明，**只需要推导至这个值从属的类型即可**。而 const 声明的原始类型变量将不再可变，因此类型可以直接一步到位收窄到最精确的字面量类型，但对象类型变量仍可变（但同样会要求其属性值类型保持一致）。

这些现象的本质都是 TypeScript 的类型控制流分析，我们会在后面的类型系统部分中讲到。
    