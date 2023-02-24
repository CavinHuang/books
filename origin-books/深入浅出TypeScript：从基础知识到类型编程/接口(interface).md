
# 接口(interface)
---

# 接口\(interface\)

TypeScript 的核心原则之一是对值所具有的结构进行类型检查,它有时被称做“鸭式辨型法”或“结构性子类型化”。

在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

## 接口的使用

比如我们有一个函数，这个函数接受一个 `User` 对象，然后返回这个 `User` 对象的 `name` 属性:

```
const getUserName = (user) => user.name
```

在我们自定义的 TypeScript 开发环境下这个是会报错的：

![2019-06-25-03-05-40](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb114ddc7e1ec~tplv-t2oaga2asx-image.image)

我们必须用一种类型描述这个 `user` 参数，但是这个类型又不属于上一节介绍到的各种基本类型。

这个时候我们需要 interface 来描述这个类型:

```
interface User {
    name: string
    age: number
    isMale: boolean
}

const getUserName = (user: User) => user.name
```

这个接口 `User` 描述了参数 `user` 的结构，当然接口不会去检查属性的顺序，只要相应的属性存在并且类型兼容即可。

## 可选属性

那么还有一个问题，当这个 user 属性可能没有 `age` 时怎么办？比如我们在前端处理表单的时候，年龄 `age` 这个字段本身是可选的，我们应该如何用接口描述这种情况？

我们可以用可选属性描述这种情况:

```
interface User {
    name: string
    age?: number
    isMale: boolean
}
```

当我们看到代码提示的时候，这个 `age` 属性既可能是number类型也可能是 `undefined` 。

![2019-06-25-03-13-26](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb114decc413e~tplv-t2oaga2asx-image.image)

## 只读属性

还有一个问题，当我们确定 `user` 的性别之后就不允许就改了， `interface` 可以保证这一点吗？

利用 `readonly` 我们可以把一个属性变成只读性质，此后我们就无法对他进行修改

```
interface User {
    name: string
    age?: number
    readonly isMale: boolean
}
```

一旦我们要修改只读属性，就会出现警告⚠️。

![2019-06-25-03-32-31](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb114ded29ca2~tplv-t2oaga2asx-image.image)

## 函数类型

那么接下来，如果这个 `user` 含有一个函数怎么办？

比如:

```
user.say = function(words: string) {
    return 'hello world'
}
```

我们应该如何描述这种情况？一种是直接在 interface 内部描述函数:

```
interface User {
    name: string
    age?: number
    readonly isMale: boolean
    say: (words: string) => string
}
```

另一种方法，我们可以先用接口直接描述函数类型:

```
interface Say {
    (words: string) : string
}
```

然后在 `User` 内使用

```
interface User {
    name: string
    age?: number
    readonly isMale: boolean
    say: Say
    }
```

## 属性检查

假设我们有一个 `Config` 接口如下

```
interface Config {
  width?: number;
}

function  CalculateAreas(config: Config): { area: number} {
  let square = 100;
  if (config.width) {
      square = config.width * config.width;
  }
  return {area: square};
}

let mySquare = CalculateAreas({ widdth: 5 });

```

注意我们传入的参数是 `widdth`，并不是 `width`。

此时TypeScript会认为这段代码可能存在问题。对象字面量当被赋值给变量或作为参数传递的时候，会被特殊对待而且经过“额外属性检查”。 如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。

```
// error: 'widdth' not expected in type 'Config'
let mySquare = CalculateAreas({ widdth: 5 });

```

目前官网推荐了三种主流的解决办法：

第一种使用类型断言：

```
let mySquare = CalculateAreas({ widdth: 5 } as Config);

```

第二种添加字符串索引签名：

```
interface Config {
   width?: number;
   [propName: string]: any;
}

```

这样Config可以有任意数量的属性，并且只要不是width，那么就无所谓他们的类型是什么了。

第三种将字面量赋值给另外一个变量：

```
let options: any = { widdth: 5 };
let mySquare = CalculateAreas(options);
```

本质上是转化为 any 类型，除非有万不得已的情况，不建议采用上述方法。

## 可索引类型

我们再假设一个场景，如果 `User` 还包含一个属性，这个属性是 `User` 拥有的邮箱的集合，但是这个集合有多少成员不确定，应该如何描述？

比如小张的信息如下:

```
{
    name: 'xiaozhang',
    age: 18,
    isMale: false,
    say: Function,
    phone: {
        NetEase: 'xiaozhang@163.com',
        qq: '1845751425@qq.com',
    }
}
```

而小明的信息如下:

```
{
    name: 'xiaoming',
    age: 16,
    isMale: true,
    say: Function,
    phone: {
        NetEase: 'xiaoming@163.com',
        qq: '784536325@qq.com',
        sina: 'abc784536325@sina.com',
    }
}
```

我们观察这两个人的信息，他们的 `phone` 属性有共同之处，首先他们的 key 都是 string 类型的，其次 value 也是 string 类型，虽然数量不等。

这个时候我们可以用可索引类型表示，可索引类型具有一个索引签名，它描述了对象索引的类型，还有相应的索引返回值类型。

> 可索引类型会在后面的章节详细讲

```
interface Phone {
    [name: string]: string
}

interface User {
    name: string
    age?: number
    readonly isMale: boolean
    say: () => string
    phone: Phone
}
```

## 继承接口

我们有一天又有一个新需求，就是需要重新创建一个新的VIP `User` ，这个 `VIPUser` 的属性与普通 `User` 一致，只是多了一些额外的属性，这个时候需要重新写一个接口吗？

并不需要，我们可以用继承的方式，继承 `User` 的接口。

```
interface VIPUser extends User {
    broadcast: () => void
}
```

你甚至可以继承多个接口:

```
interface VIPUser extends User, SupperUser {
    broadcast: () => void
}
```

## 小结

我们通过本节的学习了解了接口（interface）的基本用法，我们甚至可以用修饰符来修饰接口成员字段的特性，比如可选属性、只读属性等等。

接口（interface）是一个非常强大的代码类型定义描述，是我们今后编码非常常用的一个功能，在今后的章节还会大量使用此特性。
    