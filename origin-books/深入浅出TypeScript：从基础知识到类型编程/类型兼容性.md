
# 类型兼容性
---

# 类型兼容性

类型兼容性用于确定一个类型是否能赋值给其他类型，这看起来并没有什么太大用处，而实际上当我们了解了兼容性之后才会规避之后实际编程中的很多低级错误，笔者也是后来才意识到这一点的。

## 结构类型

TypeScript 里的类型兼容性是基于「结构类型」的，结构类型是一种只使用其成员来描述类型的方式，其基本规则是，如果 x 要兼容 y，那么 y 至少具有与 x 相同的属性。

我们做一个简单的实验，我们构建一个类 `Person`,然后声明一个接口 `Dog`，`Dog` 的属性 `Person` 都拥有，而且还多了其他属性，这种情况下 `Dog` 兼容了 `Person`。

```
class Person {
    constructor(public weight: number, public name: string, public born: string) {

    }
}

interface Dog {
    name: string
    weight: number
}

let x: Dog

x = new Person(120, 'cxk', '1996-12-12') // OK
```

但如果反过来，`Person` 并没有兼容 `Dog`，因为 `Dog` 的属性比 `Person` 要少了一个。

## 函数的类型兼容性

### 函数参数兼容性

函数类型的兼容性判断，要查看 x 是否能赋值给 y，首先看它们的参数列表。

x 的每个参数必须能在 y 里找到对应类型的参数,注意的是参数的名字相同与否无所谓，只看它们的类型。

这里，x 的每个参数在 y 中都能找到对应的参数，所以允许赋值:

```
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;

y = x; // OK
x = y; // Error 不能将类型“(b: number, s: string) => number”分配给类型“(a: number) => number”。
```

那么当函数的参数中出现了可选参数或者 rest 参数时会怎么样呢？

```
let foo = (x: number, y: number) => {};
let bar = (x?: number, y?: number) => {};
let bas = (...args: number[]) => {};

foo = bar = bas;
bas = bar = foo;
```

如果你在 `tsconfig.json` 默认配置下上面的兼容性都是没问题的，但是在我们严格检测的环境下还是会报错的:

![2019-06-25-15-58-11](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb11f033a581a~tplv-t2oaga2asx-image.image)

原因就是可选类型的参数可能为 `undefined`，在这种情况下不能与 `number` 兼容。

> 当我们把 strictNullChecks 设置为 false 时上述代码是兼容的。

那么甚至他们的参数数量都不一致呢\?

```

let foo = (x: number, y: number) => {};
let bar = (x?: number) => {};

foo = bar // ok
bar = foo //报错
```

我们看到参数较多的 foo 兼容了 bar。

## 枚举的类型兼容性

枚举与数字类型相互兼容:

```
enum Status {
  Ready,
  Waiting
}

let status = Status.Ready;
let num = 0;

status = num;
num = status;
```

## 类的类型兼容性

仅仅只有实例成员和方法会相比较，构造函数和静态成员不会被检查:

```
class Animal {
  feet: number;
  constructor(name: string, numFeet: number) {}
}

class Size {
  feet: number;
  constructor(meters: number) {}
}

let a: Animal;
let s: Size;

a = s; // OK
s = a; // OK
```

私有的和受保护的成员必须来自于相同的类:

```
class Animal {
  protected feet: number;
}
class Cat extends Animal {}

let animal: Animal;
let cat: Cat;

animal = cat; // ok
cat = animal; // ok

class Size {
  protected feet: number;
}

let size: Size;

animal = size; // ERROR
size = animal; // ERROR
```

## 泛型的类型兼容性

泛型本身就是不确定的类型,它的表现根据是否被成员使用而不同.

就比如下面代码:

```

interface Person<T> {

}

let x : Person<string>
let y : Person<number>

x = y // ok
y = x // ok

```

由于没有被成员使用泛型,所以这里是没问题的。

那么我们再看下面:

```
interface Person<T> {
    name: T
}

let x : Person<string>
let y : Person<number>

x = y // 不能将类型“Person<number>”分配给类型“Person<string>”。
y = x // 不能将类型“Person<string>”分配给类型“Person<number>”。

```

这里由于泛型 `T` 被成员 `name` 使用了,所以类型不再兼容。

## 小结

了解各个类型的兼容性有助于我们更高效地编写代码,也避免了众多低级错误,最后留一个思考题:

如下代码,`Person` 和 `Animal` 的形状是一样的,这就代表两者互相兼容,那么我们的 `getPersonName` 函数是要获取 `Person` 类的某些属性,但是由于 `Person` 和 `Animal` 兼容,此时传入 `Animal` 类型也是不会报错的,这很烦人,如何在这种情况下让他们不兼容\?

```
interface Person {
	name: string;
	age: number;
	weight: number;
}

interface Animal {
	name: string;
	age: number;
	weight: number;
}

function getPersonName(p: Person) {
	...
}
```
    