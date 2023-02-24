
# 函数(Function)
---

# 函数\(Function\)

函数是 JavaScript 应用程序的基础,它帮助你实现抽象层、模拟类、信息隐藏和模块。

在 TypeScript 里,虽然已经支持类、命名空间和模块,但函数仍然是主要的定义行为的地方,TypeScript 为 JavaScript 函数添加了额外的功能，让我们可以更容易地使用。

## 定义函数类型

我们在 TypeScript 中的函数并不需要刻意去定义，比如我们实现一个加法函数:

```
const add = (a: number, b: number) => a + b
```

实际上我们只定义了函数的两个参数类型，这个时候整个函数虽然没有被显式定义，但是实际上 TypeScript 编译器是能『感知』到这个函数的类型的:

![2019-06-25-10-43-43](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1194a11bb4c~tplv-t2oaga2asx-image.image)

我们通过 VS Code 的类型提示看到，TypeScript 已经推断出了整个函数的类型，虽然我们并没有显式定义出来，这就是所谓的『类型推断』。

那么我应该如何显式定义一个函数的类型呢？

![2019-06-25-10-47-16](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1194a4d9eff~tplv-t2oaga2asx-image.image)

括号里的 `(a: number, b: number)` 为参数类型,而通过 `=>` 来连接参数与返回值, 最后则是返回值的类型。

## 函数的参数详解

### 可选参数

一个函数的参数可能是不存在的，这就需要我们使\\用可选参数来定义.

我们只需要在参数后面加上 `?` 即代表参数可能不存在。

```
const add = (a: number, b?: number) => a + (b ? b : 0)
```

参数b有`number`与`undefined`两种可能。

![2019-06-25-10-53-47](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1194a559f31~tplv-t2oaga2asx-image.image)

### 默认参数

默认参数在 JavaScript 同样存在，即在参数后赋值即可。

```
const add = (a: number, b = 10) => a + b
```

### 剩余参数

剩余参数与JavaScript种的语法类似，需要用 `...` 来表示剩余参数，而剩余参数 `rest` 则是一个由number组成的数组，在本函数中用 reduce 进行了累加求和。

```
const add = (a: number, ...rest: number[]) => rest.reduce(((a, b) => a + b), a)
```

## 重载（Overload）

重载这个概念在很多传统编译语言中都存在，如果你有类似 Java 的经验静很容易理解。

那么在 TypeScript 中它的作用是什么呢？

先看一下例子：

```
function assigned (a: number, b?: number, c?: number, d?: any) {
    if (b === undefined && c === undefined && d === undefined) {
      b = c = d = a
    } else if (c === undefined && d === undefined) {
      c = a
      d = b
    }
    return {
      top: a,
      right: b,
      bottom: c,
      left: d
    }
}
```

如果上述代码是我的同事写的，我只负责调用这个函数，那么我如果不看具体实现，只通过代码提示能搞清楚需要传几个参数吗？传不同的参数其返回值是一样的吗？

对于我而言，我只能去看这个函数的实现，来决定我如何传参，那么上述函数实现算是比较简单的，如果是个复杂函数呢？这增加了协作的成本也造成了类型的不安全。

比如上面的函数实际上只接受1、2、4个参数，但是如果我传入三个，是不会报错的，这就是类型的不安全。

![2019-06-25-11-38-38](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1194a6633b1~tplv-t2oaga2asx-image.image)

为了解决上述问题，因此函数重载出现了。

我们用同样的函数名声明参数分别为1、2、4情况下

```
// 重载
interface Direction {
  top: number,
  bottom?: number,
  left?: number,
  right?: number
}
function assigned(all: number): Direction
function assigned(topAndBottom: number, leftAndRight: number): Direction
function assigned(top: number, right: number, bottom: number, left: number): Direction

function assigned (a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a
  } else if (c === undefined && d === undefined) {
    c = a
    d = b
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d
  }
}

assigned(1)
assigned(1,2)
assigned(1,2,3)
assigned(1,2,3,4)
```

最后我们分别传入不同数量的参数，发现只有三个参数的情况下报错了.

![2019-06-25-13-04-12](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1194a792df6~tplv-t2oaga2asx-image.image)

函数重载在多人协作项目或者开源库中使用非常频繁，因为一个函数可能会被大量的开发者调用，如果不使用函数重载，那么会造成额外的麻烦。

## 小结

这一节我们学习了函数类型相关的知识，其中最重要的莫过于函数重载，虽然在普通的开发中使用到这个功能的几率并不大，但是一旦涉及多人使用的库相关开发，函数重载可谓是必不可少的利器。

值得一提的是,著名的全局状态管理库 `Redux` 的[compose](https://github.com/reduxjs/redux/blob/26f216e066a2a679d3cae4fb1a5c4e5d15e9fac6/src/compose.ts#L16)就是运用大量函数重载的典型案例,感兴趣的同学可以阅读一下 Redux 用 TypeScript 重写后的源码:

![2019-10-07-23-36-08](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1194a7ec2fd~tplv-t2oaga2asx-image.image)
    