
# 解一道 LeetCode 中国招聘面试题
---

# 解一道 LeetCode 中国招聘面试题

LeetCode 在其 github 上几道面试题,将代码发送 review 后可能获得免一轮面试的机会,其中就有一道 TypeScript 题目,主要考察如何编写复杂的 TypeScript 类型.

这个面试题目很有水平,如果能在几分钟内就整理好思路,那么候选人的TS水平大概率是没问题的,是有写有一定复杂度的TS底层库的能力.

一路从第一节读到现在的小伙伴,如果认真把前面的内容搞清楚的话,这道题也并不难,我们现在就利用之前的知识整合在一起,解一下这个面试题.

> [题目地址](https://github.com/LeetCode-OpenSource/hire/blob/master/typescript_zh.md)

## 题目

### 问题定义

假设有一个叫 `EffectModule` 的类

```
class EffectModule {}
```

这个对象上的方法**只可能**有两种类型签名:

```
interface Action<T> {
  payload?: T
  type: string
}

asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>

syncMethod<T, U>(action: Action<T>): Action<U>
```

这个对象上还可能有一些任意的**非函数属性**：

```
interface Action<T> {
  payload?: T;
  type: string;
}

class EffectModule {
  count = 1;
  message = "hello!";

  delay(input: Promise<number>) {
    return input.then(i => ({
      payload: `hello ${i}!`,
      type: 'delay'
    });
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: "set-message"
    };
  }
}
```

现在有一个叫 `connect` 的函数，它接受 EffectModule 实例，将它变成另一个一个对象，这个对象上只有**EffectModule 的同名方法**，但是方法的类型签名被改变了:

```
asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>  变成了
asyncMethod<T, U>(input: T): Action<U> 
```

```
syncMethod<T, U>(action: Action<T>): Action<U>  变成了
syncMethod<T, U>(action: T): Action<U>
```

例子:

EffectModule 定义如下:

```
interface Action<T> {
  payload?: T;
  type: string;
}

class EffectModule {
  count = 1;
  message = "hello!";

  delay(input: Promise<number>) {
    return input.then(i => ({
      payload: `hello ${i}!`,
      type: 'delay'
    });
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: "set-message"
    };
  }
}
```

connect 之后:

```
type Connected = {
  delay(input: number): Action<string>
  setMessage(action: Date): Action<number>
}
const effectModule = new EffectModule()
const connected: Connected = connect(effectModule)
```

### 要求

在 [题目链接](https://codesandbox.io/s/o4wwpzyzkq) 里面的 `index.ts` 文件中，有一个 `type Connect = (module: EffectModule) => any`，将 `any` 替换成题目的解答，让编译能够顺利通过，并且 `index.ts` 中 `connected` 的类型与:

```
type Connected = {
  delay(input: number): Action<string>;
  setMessage(action: Date): Action<number>;
}
```

**完全匹配**。

## 分析题目

这道题的题目非常长,但是如果你写过类 Redux 数据流解决方案（DVA就是此类方案）的话，应该会知道这就是一个类 Redux 数据流解决方案的 TypeScript 版.

但是本题目的重点并不在于这个数据流框架如何设计，而是如何设计类型，笔者曾经写过TS版的数据流解决方案，这个解决方案其实难点之一就是设计类型，让框架的使用者可以非常友好地获得类型提示与完整的类型定义。

如果你用过 Dva 的话就知道，虽然它有`d.ts`文件定义类型，但是根本不会有太多提示，其实跟写 JS 区别不大，在 TS 环境下的开发体验并不好。

好了，我们回到题目中，题目的要求很简单，就是我们设计类型把 `type Connect` 中的 `any` 替换掉,并符合:

```
type Connected = {
  delay(input: number): Action<string>;
  setMessage(action: Date): Action<number>;
}
```

并编译通过。

我们再把问题简化一下，就是设计一个工具类型，让题目中的 `EffectModule` 的实例转化为符合要求的 `Connected`。

即:

```
type Connect = (module: EffectModule) => xxx ---> type Connected = {
  delay(input: number): Action<string>;
  setMessage(action: Date): Action<number>;
}
```

仔细观察上面的伪代码实例,`Connected` 其实是一个对象类型，其中包含的 `key-value` 就是 `EffectModule` 中的方法转化而来的，所以我们的入手处就是想办法将 `EffectModule` 中的方法转化为对应的 `Connected` 中的 `key-value`。

```
type Connect = (module: EffectModule) => {
  ...
}
```

再观察 `Connected` 的属性与 `EffectModule` 的方法是不是有共同之处\?他们的名字是一样的，所以我们得先设计一个工具类型把 `EffectModule` 中的方法名取出来。

这就用到我们之前学的知识了，我们先得"遍历"\(in关键字\)属性，而且 `EffectModule` 包含非方法的「属性」，所以得做个判断，如果是属性值类型是函数那么取出，否则不要取出，这种条件判断很容易让人联想到这里需要运用「条件类型」，即：

```
type methodsPick<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]
```

解决了取 `key` 的问题，我们要解决一个更难的问题就是取 `value` 类型+转换，我们已经注意到了，虽然 `Connected` 的属性与 `EffectModule` 的方法的 `key` 一样，但是其 `value` 类型是不同的，比如在 `EffectModule` 中异步方法的类型是 `asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>` 我们需要转化为 `asyncMethod<T, U>(input: T): Action<U>`。

我们先把转换前的方法类型与转换后的先定义出来:

```
type asyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>> // 转换前
type asyncMethodConnect<T, U> = (input: T) => Action<U> // 转换后
type syncMethod<T, U> = (action: Action<T>) => Action<U> // 转换前
type syncMethodConnect<T, U> = (action: T) => Action<U> // 转换后
```

接下来我们开始着手转化工作,这里用到了「条件类型」+「推断类型」。

```
type EffectModuleMethodsConnect<T> = T extends asyncMethod<infer U, infer V>
  ? asyncMethodConnect<U, V>
  : T extends syncMethod<infer U, infer V>
  ? syncMethodConnect<U, V>
  : never
```

这是本题目的关键部分,我们简略分析一下:

1.  `EffectModuleMethodsConnect<T>` 中泛型 `T` 接受的是 `EffectModule` 的方法类型
2.  接下来进行一个判断,如果是可分配给 `asyncMethod<infer U, infer V>` 的话,说明是异步方法,那么把它转化为 `asyncMethodConnect<U, V>`
3.  如果可分配给 `syncMethod<infer U, infer V>` 那么是同步方法,转化为 `syncMethodConnect<U, V>`
4.  上面的条件全部不符,那么就返回 `never`

接下来我们做收尾工作，目前我们有两个主要的工具类型 `EffectModuleMethodsConnect` 负责类型的转化,`methodsPick` 负责取出方法名,现在我们先把方法名取出:

```
type EffectModuleMethods = methodsPick<EffectModule>
```

最后,我们用「映射类型」把转化后的字段写入,其中 `[M in EffectModuleMethods]` 中 `M` 就是方法名,`EffectModule[M]` 是方法类型,`EffectModuleMethodsConnect<EffectModule[M]>` 则是将方法类型转化为题目中规定的目标类型:

```
type Connect = (module: EffectModule) => {
  [M in EffectModuleMethods]: EffectModuleMethodsConnect<EffectModule[M]>
}
```

至此我们的类型设计就完成了.

## 小结

之所以在这里探讨一个面试题就是想把之前的知识做一个总结,恰好这个题目非常符合我们的标准,我们涉及的高级类型这里都有运用,所以这确实是一个能考察出候选人水平的题目.

目前我已经把答案分享在[链接](https://codesandbox.io/embed/typescript-problem-5lzyp)中了.
    