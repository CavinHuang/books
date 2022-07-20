
# 深入理解枚举类型
---

# 深入理解枚举类型

枚举类型是很多语言都拥有的类型,它用于声明一组命名的常数,当一个变量有几种可能的取值时,可以将它定义为枚举类型。

## 数字枚举

当我们声明一个枚举类型是,虽然没有给它们赋值,但是它们的值其实是默认的数字类型,而且默认从0开始依次累加:

```
enum Direction {
    Up,
    Down,
    Left,
    Right
}

console.log(Direction.Up === 0); // true
console.log(Direction.Down === 1); // true
console.log(Direction.Left === 2); // true
console.log(Direction.Right === 3); // true
```

因此当我们把第一个值赋值后,后面也会根据第一个值进行累加:

```
enum Direction {
    Up = 10,
    Down,
    Left,
    Right
}

console.log(Direction.Up, Direction.Down, Direction.Left, Direction.Right); // 10 11 12 13
```

## 字符串枚举

枚举类型的值其实也可以是字符串类型：

```
enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}

console.log(Direction['Right'], Direction.Up); // Right Up
```

## 异构枚举

既然我们已经有了字符串枚举和数字枚举，那么这两个枚举是不是可以混合使用呢？

```

enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```

是的，这样也是没问题的，通常情况下我们很少会这样使用枚举，但是从技术的角度来说，它是可行的。

## 反向映射

我们看一个例子：

```
enum Direction {
    Up,
    Down,
    Left,
    Right
}

console.log(Direction.Up === 0); // true
console.log(Direction.Down === 1); // true
console.log(Direction.Left === 2); // true
console.log(Direction.Right === 3); // true
```

这就是我们数字枚举那一部分的例子，我们可以通过枚举名字获取枚举值，这当然看起来没问题，那么能不能通过枚举值获取枚举名字呢？

是可以的：

```
enum Direction {
    Up,
    Down,
    Left,
    Right
}

console.log(Direction[0]); // Up

```

这就很奇怪了，我们印象中一个 JavaScript 对象一般都是正向映射的，即 `name => value`，为什么在枚举中是可以正反向同时映射的？即 `name <=> value`。

我们往下看，通过了解枚举的本质，我们就可以理解这种正反向同时映射的特性了。

## 枚举的本质

以上面的 `Direction` 枚举类型为例,我们不妨看一下枚举类型被编译为 JavaScript 后是什么样子:

```
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 10] = "Up";
    Direction[Direction["Down"] = 11] = "Down";
    Direction[Direction["Left"] = 12] = "Left";
    Direction[Direction["Right"] = 13] = "Right";
})(Direction || (Direction = {}));
```

这个编译后的代码可能看起来比较复杂,不过我们可以把`Direction`看成一个对象,比如我们在 TypeScript 中做几个小实验:

```
enum Direction {
    Up = 10,
    Down,
    Left,
    Right
}

console.log(Direction[10], Direction['Right']); // Up 13
```

原因就在编译后的 JavaScript 中体现出来了,因为 `Direction[Direction["Up"] = 10] = "Up"` 也就是 `Direction[10] = "Up"` ,所以我们可以把枚举类型看成一个JavaScript对象，而由于其特殊的构造，导致其拥有正反向同时映射的特性。

## 常量枚举

枚举其实可以被 `const` 声明为常量的,这样有什么好处\?我们看以下例子:

```
const enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}

const a = Direction.Up;
```

大家猜一下它被编译为 JavaScript 后是怎样的\?

```
var a = "Up";
```

我们在上面看到枚举类型会被编译为 JavaScript 对象,怎么这里没有了\?

这就是常量枚举的作用,因为下面的变量 `a` 已经使用过了枚举类型,之后就没有用了,也没有必要存在与 JavaScript 中了, TypeScript 在这一步就把 `Direction` 去掉了,我们直接使用 `Direction` 的值即可,这是性能提升的一个方案。

> 如果你非要 TypeScript 保留对象 Direction ,那么可以添加编译选项 `--preserveConstEnums`

## 联合枚举与枚举成员的类型

我们假设枚举的所有成员都是字面量类型的值，那么枚举的每个成员和枚举值本身都可以作为类型来使用，

 -    任何字符串字面量,如：

```
const enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}
```

 -    任何数字字面量,如：

```
enum Direction {
    Up,
    Down,
    Left,
    Right
}
```

 -    应用了一元`-`符号的数字字面量,如:

```
enum Direction {
    Up = -1,
    Down = -2,
    Left = -3,
    Right = -4,
}
```

### 枚举成员类型

当所有枚举成员都拥有字面量枚举值时，它就带有了一种特殊的语义，即枚举成员成为了类型。

比如我们声明一个数字类型：

```
enum Direction {
    Up,
    Down,
    Left,
    Right
}

const a = 0

console.log(a === Direction.Up) // true
```

我们把成员当做值使用，看来是没问题的，因为成员值本身就是0，那么我们再加几行代码：

```
type c = 0

declare let b: c

b = 1 // 不能将类型“1”分配给类型“0”
b = Direction.Up // ok
```

我们看到，上面的结果显示这个枚举的成员居然也可以被当做类型使用，这就是枚举成员当做类型使用的情况。

## 联合枚举类型

由于联合联合枚举，类型系统可以知道枚举里的值的集合。

> 联合类型会在后面的章节提到

```
enum Direction {
    Up,
    Down,
    Left,
    Right
}

declare let a: Direction

enum Animal {
    Dog,
    Cat
}

a = Direction.Up // ok
a = Animal.Dog // 不能将类型“Animal.Dog”分配给类型“Direction”
```

我们把 `a` 声明为 `Direction` 类型，可以看成我们声明了一个联合类型 `Direction.Up | Direction.Down | Direction.Left | Direction.Right`，只有这四个类型其中的成员才符合要求。

## 枚举合并

我们可以分开声明枚举,他们会自动合并

```
enum Direction {
    Up = 'Up',
    Down = 'Down',
    Left = 'Left',
    Right = 'Right'
}

enum Direction {
    Center = 1
}
```

编译为 JavaScript 后的代码如下:

```
var Direction;
(function (Direction) {
    Direction["Up"] = "Up";
    Direction["Down"] = "Down";
    Direction["Left"] = "Left";
    Direction["Right"] = "Right";
})(Direction || (Direction = {}));
(function (Direction) {
    Direction[Direction["Center"] = 1] = "Center";
})(Direction || (Direction = {}));
```

因此上面的代码并不冲突。

## 为枚举添加静态方法

借助 `namespace` 命名空间，我们甚至可以给枚举添加静态方法。

我们举个简单的例子，假设有十二个月份:

```
enum Month {
    January,
    February,
    March,
    April,
    May,
    June,
    July,
    August,
    September,
    October,
    November,
    December,
}
```

我们要编写一个静态方法，这个方法可以帮助我们把夏天的月份找出来:

```
function isSummer(month: Month) {
    switch (month) {
        case Month.June:
        case Month.July:
        case Month.August:
            return true;
        default:
            return false
    }
}
```

> 「命名空间」在第 30 小节，读者可以暂时跳过下面内容

想要把两者结合就需要借助命名空间的力量了:

```
namespace Month {
    export function isSummer(month: Month) {
        switch (month) {
            case Month.June:
            case Month.July:
            case Month.August:
                return true;
            default:
                return false
        }
    }
}

console.log(Month.isSummer(Month.January)) // false
```

## 小结

我们本节深入理解了枚举类型,通过编译后的 JavaScript 了解到其实本质上是 JavaScript 对象.
    