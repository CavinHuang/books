
# 类(Class)
---

# 类\(Class\)

传统的面向对象语言基本都是基于类的，JavaScript 基于原型的方式让开发者多了很多理解成本，在 ES6 之后，JavaScript 拥有了 class 关键字，虽然本质依然是构造函数，但是开发者已经可以比较舒服地使用 class了。

但是 JavaScript 的 class 依然有一些特性还没有加入，比如修饰符和抽象类等。

之于一些继承、静态属性这些在 JavaScript 本来就存在的特性，我们就不过多讨论了。

## 抽象类

抽象类做为其它派生类的基类使用,它们一般不会直接被实例化,不同于接口,抽象类可以包含成员的实现细节。

abstract 关键字是用于定义抽象类和在抽象类内部定义抽象方法。

比如我们创建一个 `Animal` 抽象类:

```
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
```

我在实例化此抽象类会报错：

![2019-06-25-07-50-23](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb116f92b95a0~tplv-t2oaga2asx-image.image)

我们不能直接实例化抽象类，通常需要我们创建子类继承基类,然后可以实例化子类。

```
class Cat extends Animal {

    makeSound() {
        console.log('miao miao')
    }
}

const cat = new Cat()

cat.makeSound() // miao miao
cat.move() // roaming the earch...
```

## 访问限定符

传统面向对象语言通常都有访问限定符，TypeScript 中有三类访问限定符，分别是: public、private、protected。

### public

在 TypeScript 的类中，成员都默认为 public, 被此限定符修饰的成员是可以被外部访问。

```
class Car {
    public run() {
        console.log('启动...')
    }
}

const car = new Car()

car.run() // 启动...
```

### private

当成员被设置为 private 之后, 被此限定符修饰的成员是只可以被类的内部访问。

![2019-06-25-08-14-12](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb116f9c298d7~tplv-t2oaga2asx-image.image)

### protected

当成员被设置为 protected 之后, 被此限定符修饰的成员是只可以被类的内部以及类的子类访问。

```
class Car {
    protected run() {
        console.log('启动...')
    }
}

class GTR extends Car {
    init() {
        this.run()
    }
}

const car = new Car()
const gtr = new GTR()

car.run() // [ts] 属性“run”受保护，只能在类“Car”及其子类中访问。
gtr.init() // 启动...
gtr.run() // [ts] 属性“run”受保护，只能在类“Car”及其子类中访问。
```

## class 可以作为接口

上一节我们讲到接口（interface），实际上类（class）也可以作为接口。

而把 class 作为 interface 使用，在 React 工程中是很常用的。

比如我之前写过一个轮播组件[rc-carousel](https://github.com/xiaomuzhu/rc-carousel/blob/master/src/props.ts)。

```
export default class Carousel extends React.Component<Props, State> {}
```

由于组件需要传入 `props` 的类型 `Props` ，同时有需要设置默认 `props` 即 `defaultProps`。

这个时候 class 作为接口的优势就体现出来了。

我们先声明一个类，这个类包含组件 `props` 所需的类型和初始值：

```
// props的类型
export default class Props {
  public children: Array<React.ReactElement<any>> | React.ReactElement<any> | never[] = []
  public speed: number = 500
  public height: number = 160
  public animation: string = 'easeInOutQuad'
  public isAuto: boolean = true
  public autoPlayInterval: number = 4500
  public afterChange: () => {}
  public beforeChange: () => {}
  public selesctedColor: string
  public showDots: boolean = true
}
```

当我们需要传入 `props` 类型的时候直接将 `Props` 作为接口传入，此时 `Props` 的作用就是接口，而当需要我们设置`defaultProps`初始值的时候，我们只需要:

```
public static defaultProps = new Props()
```

`Props` 的实例就是 `defaultProps` 的初始值，这就是 class 作为接口的实际应用，我们用一个 class 起到了接口和设置初始值两个作用，方便统一管理，减少了代码量。

## 小结

我们学习了 TypeScript 类特有的知识点，包括三个访问限定符public、protected、private，抽象类，以及实际应用中的class作为接口的优势，这些都是之后我们会反复用到的知识。
    