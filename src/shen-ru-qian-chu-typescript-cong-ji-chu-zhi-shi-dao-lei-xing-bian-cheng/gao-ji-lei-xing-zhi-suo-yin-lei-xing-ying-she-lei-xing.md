
# 高级类型之索引类型、映射类型
---

# 高级类型之索引类型、映射类型

我们从本节开始进入TypeScript学习的进阶阶段，因为我们要大量接触**类型编程**了。

本节我们将会学习比较抽象的索引类型，这个高级类型虽然相对要难理解一些，但是配合上类型操作符可以做出很多有趣的事情。

## 索引类型

我们先看一个场景，现在我们需要一个 pick 函数，这个函数可以从对象上取出指定的属性，是的，就是类似于 `lodash.pick` 的方法。

在 JavaScript 中这个函数应该是这样的:

```
function pick(o, names) {
  return names.map(n => o[n]);
}
```

如果我们从一个 `user` 对象中取出 id ，那么应该这样:

```
const user = {
    username: 'Jessica Lee',
    id: 460000201904141743,
    token: '460000201904141743',
    avatar: 'http://dummyimage.com/200x200',
    role: 'vip'
}
const res = pick(user, ['id'])

console.log(res) // [ '460000201904141743' ]
```

那么好了，我们应该如何在 TypeScript 中实现上述函数？结合我们之前学到的知识，你会怎么做？

如何描述 pick 函数的第一个参数 `o` 呢\?你可能会想到之前提到过的`可索引类型`，这个对象的 `key` 都是 `string` 而对应的值可能是任意类型，那么可以这样表示:

```
interface Obj {
    [key: string]: any
}
```

而第二个参数 `names` 很明显是个字符串数组，这个函数其实很容易就用 `TypeScript` 写出来了:

```
function pick(o: Obj, names: string[]) {
    return names.map(n => o[n]);
}
```

这样似乎没什么问题，但是如果你够细心的话，还是会发现我们的类型定义不够严谨：

- 参数 `names` 的成员应该是参数 `o` 的属性，因此不应该是 string 这种宽泛的定义，应该更加准确
- 我们 pick 函数的返回值类型为 `any[]`，其实可以更加精准，pick 的返回值类型应该是所取的属性值类型的联合类型

我们应该如何更精准的定义类型呢？

这里我们必须了解两个类型操作符：索引类型查询操作符和索引访问操作符。

## 索引类型查询操作符

`keyof`，即索引类型查询操作符，我们可以用 keyof 作用于泛型 `T` 上来获取泛型 T 上的所有 public 属性名构成联合类型。

举个例子，有一个 Images 类，包含 `src` 和 `alt` 两个 public 属性，我们用 `keyof` 取属性名：

```
class Images {
    public src: string = 'https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
    public alt: string = '谷歌'
    public width: number = 500
}

type propsNames = keyof Images
```

效果如下：

![2019-06-26-06-17-29](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13efd03fd86~tplv-t2oaga2asx-image.image)

`keyof` 正是赋予了开发者查询索引类型的能力。

## 索引访问操作符

我们可以通过 `keyof` 查询索引类型的属性名，那么如何获取属性名对应的属性值类型呢？因为在上面提到的 pick 函数中，我们确实有一个需求时获取属性名对应的属性值类型的需求。

这就需要索引访问符出场了，与 JavaScript 种访问属性值的操作类似，访问类型的操作符也是通过 `[]` 来访问的，即 `T[K]`。

再看上面的例子，我们已经取出属性名 `propsNames` ，然后通过类型访问的操作符来获取值的类型。

```
class Images {
    public src: string = 'https://www.google.com.hk/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'
    public alt: string = '谷歌'
    public width: number = 500
}

type propsNames = keyof Images

type propsType = Images[propsNames]
```

效果如下：

![2019-06-26-06-18-48](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13efd59d908~tplv-t2oaga2asx-image.image)

当我们了解了这两个访问符之后，上面的问题就迎刃而解了。

首先我们需要一个泛型 `T` 它来代表传入的参数 `o` 的类型，因为我们在编写代码时无法确定参数 `o` 的类型到底是什么，所以在这种情况下要获取 `o` 的类型必须用面向未来的类型--泛型。

那么传入的第二个参数 `names` ，它的特点就是数组的成员必须由参数 `o` 的属性名称构成，这个时候我们很容易想到刚学习的操作符`keyof`, `keyof T`代表参数o类型的属性名的联合类型，我们的参数names的成员类型`K`则只需要约束到`keyof T`即可。

我们的返回值就更简单了，我们通过类型访问符`T[K]`便可以取得对应属性值的类型，他们的数组`T[K][]`正是返回值的类型。

```
function pick<T, K extends keyof T>(o: T, names: K[]): T[K][] {
    return names.map(n => o[n]);
}

const res = pick(user, ['token', 'id', ])
```

我们用索引类型结合类型操作符完成了 TypeScript 版的 pick 函数，它不仅仅有更严谨的类型约束能力，也提供了更强大的代码提示能力：

![2019-06-26-06-41-43](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13efd379db1~tplv-t2oaga2asx-image.image)

因此，学会上述操作，对于写基础的类库和工具十分有用。

## 映射类型

在了解映射类型之前，我们不妨看一个例子.

我们有一个User接口，现在有一个需求是把User接口中的成员全部变成可选的，我们应该怎么做？难道要重新一个个`:`前面加上`?`,有没有更便捷的方法？

```
interface User {
    username: string
    id: number
    token: string
    avatar: string
    role: string
}
```

这个时候映射类型就派上用场了，映射类型的语法是`[K in Keys]`:

- K：类型变量，依次绑定到每个属性上，对应每个属性名的类型
- Keys：字符串字面量构成的联合类型，表示一组属性名（的类型）

那么我们应该如何操作呢？

首先，我们得找到`Keys`，即字符串字面量构成的联合类型，这就得使用上一节我们提到的`keyof`操作符，假设我们传入的类型是泛型`T`，得到`keyof T`，即传入类型`T`的属性名的联合类型。

然后我们需要将`keyof T`的属性名称一一映射出来`[K in keyof T]`，如果我们要把所有的属性成员变为可选类型，那么需要`T[K]`取出相应的属性值，最后我们重新生成一个可选的新类型`{ [K in keyof T]?: T[K] }`。

用类型别名表示就是：

```
type partial<T> = { [K in keyof T]?: T[K] }
```

我们坐下测试

```
type partialUser = partial<User>
```

果然所有的属性都变成了可选类型：

![2019-06-26-09-10-03](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13efd95cbeb~tplv-t2oaga2asx-image.image)

## 小结

索引类型与映射类型相对难理解，笔者在刚开始接触的时候也一时半会无法消化，其实最快最好地把这些内容消化的方式就是实战，后面的实战内容我们也会涉及到相关内容，帮助大家更好地消化。
    