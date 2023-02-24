
# 可辨识联合类型
---

# 可辨识联合类型

在开始「可辨识联合类型」的学习之前我们要先搞清楚两个概念「类型字面量」与「字面量类型」,因为会在可辨识联合类型的学习中用到类型字面量的特性.

这看起来非常绕,但是「类型字面量」与「字面量类型」的关系就如同雷锋和雷峰塔一样,它们只是名字有些像,所以容易造成混淆,所以我们专门把两者放在同一节,主要聊一下两者的不同.

## 字面量类型

字面量（Literal Type）主要分为 真值字面量类型（boolean literal types）,数字字面量类型（numeric literal types）,枚举字面量类型（enum literal types）,大整数字面量类型（bigInt literal types）和字符串字面量类型（string literal types）。

```
const a: 2333 = 2333 // ok
const ab : 0b10 = 2 // ok
const ao : 0o114 = 0b1001100 // ok
const ax : 0x514 = 0x514 // ok
const b : 0x1919n = 6425n // ok
const c : 'xiaomuzhu' = 'xiaomuzhu' // ok
const d : false = false // ok

const g: 'github' = 'pronhub' // 不能将类型“"pronhub"”分配给类型“"github"”
```

字面量类型的要和实际的值的字面量一一对应,如果不一致就会报错,比如最后一个例子中字面量类型是 `github`,但是值却是 `pronhub`,这就会产生报错.

你可能会问这种只有单个类型的字面量类型有什么用处呢\?

当字面量类型与联合类型结合的时候,用处就显现出来了,它可以模拟一个类似于枚举的效果:

```
type Direction = 'North' | 'East' | 'South' | 'West';

function move(distance: number, direction: Direction) {
    // ...
}
```

效果如下:

![2019-10-08-13-54-45](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb124607d2898~tplv-t2oaga2asx-image.image)

## 类型字面量

类型字面量\(Type Literal\)不同于字面量类型（Literal Type\),它跟 JavaScript 中的对象字面量的语法很相似:

```
type Foo = {
  baz: [
    number,
    'xiaomuzhu'
  ];
  toString(): string;
  readonly [Symbol.iterator]: 'github';
  0x1: 'foo';
  "bar": 12n;
};
```

你会发现这个结构跟 `interface` 也有点相似,我们在类型别名那一节讲过,在一定程度上类型字面量可以代替接口.

## 可辨识联合类型

我们先假设一个场景,现在又两个功能,一个是创建用户即 `create`,一个是删除用户即 `delete`.

我们先定义一下这个接口,由于创建用户不需要id,是系统随机生成的,而删除用户是必须用到 id 的,那么代码如下:

```
interface Info {
    username: string
}

interface UserAction {
    id?: number
    action: 'create' | 'delete'
    info: Info
}
```

上面的接口是不是有什么问题\?

是的,当我们创建用户时是不需要 id 的,但是根据上面接口产生的情况,以下代码是合法的:

```
const action:UserAction = {
    action:'create',
    id: 111,
    info: {
        username: 'xiaomuzhu'
    }
}
```

但是我们明明不需要 id 这个字段,因此我们得用另外的方法,这就用到了上面提到的「类型字面量」了:

```
type UserAction = | {
    id: number
    action: 'delete'
    info: Info
} |
{
    action: 'create'
    info: Info
}
```

这似乎完美解决了,那么我们创建一个函数分别处理 `create` 和 `delete` 两者情况,两者的不同之处就在于一个有 id 另一个没 id 这个字段:

```
const UserReducer = (userAction: UserAction) => {
    console.log(userAction.id)
    ...
}
```

我们发现在编写过程中 IDE 就报错了:

![2019-10-08-14-35-26](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb124613e3b1e~tplv-t2oaga2asx-image.image)

类型别名 `UserAction` 是有两个类型字面量联合而成的,我们不知道其中传入的是有没有 `id` 字段的那个类型字面量,因此我们需要找到方法区分出到底是哪个类型字面量.

大家有没有想到最开始提到的「字面量类型」,它的特性不就是唯一性吗\?这就是区分两者的钥匙:

```
const UserReducer = (userAction: UserAction) => {
    switch (userAction.action) {
        case 'delete':
            console.log(userAction.id);
            break;
        default:
            break;
    }
}
```

效果如下:

![2019-10-08-14-38-11](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1246146cc76~tplv-t2oaga2asx-image.image)

我们上面提到了 `userAction.action` 就是辨识的关键,被称为**可辨识的标签**,我们发现上面这种模式要想实现必须要三个要素:

- 具有普通的单例类型属性—可辨识的特征,上文中就是 `delete` 与 `create` 两个有唯一性的字符串字面量
- 一个类型别名包含**联合类型**
- 类型守卫的特性,比如我们必须用 `if` `switch` 来判断 `userAction.action` 是属于哪个类型作用域即 `delete` 与 `create`

## 小结

熟悉 Redux 的同学看完本节应该似曾相识,我们可辨识联合类型的使用场景非常适用于 Redux 的那些样板代码,在之后的 Redux 实战环节,我们会大量运用可辨识联合这个高级类型.
    