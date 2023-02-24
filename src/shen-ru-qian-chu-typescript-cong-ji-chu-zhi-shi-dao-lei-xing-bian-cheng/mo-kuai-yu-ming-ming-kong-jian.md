
# 模块与命名空间
---

# 模块与命名空间

## 全局模块

假设我们在在一个 TypeScript 工程下建立一个文件 `1.ts`,我们写如下代码:

```
const a = 1
```

如果在相同的工程下我们再建立一个新的文件`2.ts`,如何写出如下代码:

```
const a = '1'
```

那么这个时候会报错:

![报错](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1553acd6213~tplv-t2oaga2asx-image.image)

IDE会提示我们重复声明了`a`变量，虽然我们在两个不同的文件夹内，但是他们所处的空间是全局的，所以需要引入模块系统来规避这个情况，比较全局变量是非常危险的事情。

## 模块系统

TypeScript 与 ECMAScript 2015 一样，任何包含顶级 `import` 或者 `export` 的文件都被当成一个模块。

相反地，如果一个文件不带有顶级的`import`或者`export`声明，那么它的内容被视为全局可见的。

比如我们改造一下上面的代码,我们在`1.ts`文件中改动代码如下:

```
export const a = 1
```

那么上面的问题就消失了，原因就是`export`把`a`变量变成了局部的命名空间内，与`2.ts`文件中的全局变量`a`不再产生冲突。

## 模块语法

我们可以用`export`关键字导出变量或者类型，比如:

```
// export.ts
export const a = 1
export type Person = {
    name: String
}
```

如果你想一次性导出，那么你可以:

```
const a = 1
type Person = {
    name: String
}
export { a, Person }
```

甚至你可以重命名:

```
const a = 1
type Person = {
    name: String
}
export { a as b, Person }
```

那么我们用关键字`import`导入模块

```
// import.ts
import { a, Person } from './export';
```

同样的我们也可以重命名导入的模块:

```
import { Person as P } from './export';
```

如果我们不想一个个导入,想把模块整体导入,可以这样:

```
import * as P from './export';
```

我们甚至可以导入后导出模块:

```
export { Person as P } from './export';
```

当然,除了上面的方法之外我们还有默认的导入导出:

```
export default (a = 1)
export default () => 'function'
```

## 命名空间

命名空间一个最明确的目的就是解决重名问题。

假设这样一种情况，当一个班上有两个名叫小明的学生时，为了明确区分它们，我们在使用名字之外，不得不使用一些额外的信息，比如他们的姓（王小明，李小明），或者他们父母的名字等等。

命名空间定义了标识符的可见范围，一个标识符可在多个名字空间中定义，它在不同名字空间中的含义是互不相干的。这样，在一个新的名字空间中可定义任何标识符，它们不会与任何已有的标识符发生冲突，因为已有的定义都处于其他名字空间中。

TypeScript 中命名空间使用 namespace 来定义，语法格式如下：

```
namespace SomeNameSpaceName {
   export interface ISomeInterfaceName {      }  
   export class SomeClassName {      }  
}
```

以上定义了一个命名空间 SomeNameSpaceName，如果我们需要在外部可以调用 SomeNameSpaceName 中的类类和接口，则需要在类和接口添加 export 关键字.

其实一个`命名空间`本质上一个`对象`，它的作用是将一系列相关的全局变量组织到一个对象的属性比如：

```
let a = 1;
let b = 2;
let c = 3;
// ...
let z = 26;
```

组织成：

```
const Letter = {};
Letter.a = 1;
Letter.b = 2;
Letter.c = 3;
// ...
Letter.z = 26;
```

在这里，`Letter`就是一个命名空间。

你在手动构建一个命名空间，但是在`ts`中，`namespace`提供了一颗语法糖。上述可用语法糖改写成：

```
namespace Letter {
  export let a = 1;
  export let b = 2;
  export let c = 3;
  // ...
  export let z = 26;
}
```

编辑成`js`：

```
var Letter;
(function (Letter) {
    Letter.a = 1;
    Letter.b = 2;
    Letter.c = 3;
    // ...
    Letter.z = 26;
})(Letter || (Letter = {}));
```

## 命名空间的用处

命名空间在现代TS开发中的重要性并不高,主要原因是ES6引入了模块系统,文件即模块的方式使得开发者能更好的得组织代码,但是命名空间并非一无是处,通常在一些非 TypeScript 原生代码的 `.d.ts` 文件中使用,主要是由于 ES Module 过于静态，对 JavaScript 代码结构的表达能力有限。

因此在正常的TS项目开发过程中并不建议用命名空间。

## 理解文件，模块与命名空间

之前在 SOF 中看到一个非常恰当的比喻 TypeScript 中文件，模块与命名空间概念。

### 三张桌子，三个盒子，三本书

我们看下面这三段代码。

**cola.ts:**

```
export module Drinks{
    export class Cola { ... }
}
```

**sprite.ts:**

```
export module Drinks{
    export class Sprite { ... }
}
```

**fanta.ts:**

```
export module Drinks{
    export class Fanta { ... }
}
```

每个文件都是一张桌子，每个 module 都是一个盒子，每个 class 都是一本书。

这三段代码描述的就是，每个桌子上面都有一个盒子，每个盒子里面又都有一本书。

它们都是不一样的事物，每个桌子都是独特的，每个盒子也都是独特的，尽管它们可能长的一样，名字一样，但是它们仍然是独一无二的。

### 地板，盒子与三本书

再看下面三段代码。

**cola.ts:**

```
namespace Drinks{
    export class Cola { ... }
}
```

**sprite.ts:**

```
namespace Drinks{
    export class Sprite { ... }
}
```

**fanta.ts:**

```
namespace Drinks{
    export class Fanta { ... }
}
```

全局空间就是地板，叫做 Drink 的命名空间是一个盒子，每个 class 都是一本书。

这三段代码描述的就是，在地板上摆放了一个叫做 Drink 的盒子，盒子里面放着三本书。

namespace 和 module 不一样，namespace 在全局空间中具有唯一性，也正是放在地板上，所以 namespace 才具有唯一性。桌子也是放在地板上，所以桌子也是具有唯一性（你不可能在同一个地方放同名的两个文件）。

### 三张桌子，三本书

接下来再看这三段代码。

**cola.ts:**

```
export class Cola { ... }
```

**sprite.ts:**

```
export class Sprite { ... }
```

**fanta.ts:**

```
export class Fanta { ... }
```

同样的，每个文件是一张桌子，每个 class 都是一本书。

这三段代码描述的就是，有三张桌子，每张桌子上面一本书。

## 小结

我们基本了解了模块、命名空间的联系与区别，总之在typescript的开发中不建议使用命名空间，现在他的舞台在`d.ts`中，下面一节我们就要探讨一下如何给一个旧JavaScript代码编写`d.ts`文件。

---

参考链接:

[TypeScript \- Namespace\? Module\?](https://blog.higan.me/namespace-and-module-in-typescript/)
    