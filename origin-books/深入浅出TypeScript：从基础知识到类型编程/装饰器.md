
# 装饰器
---

# 装饰器

装饰器\(decorator\)最早在 Python 中被引入,它的主要作用是给一个已有的方法或类扩展一些新的行为，而不是去直接修改它本身.

在 ES2015 进入 Class 之后,当我们需要在多个不同的类之间共享或者扩展一些方法或行为的时候，代码会变得错综复杂，极其不优雅，这也就是装饰器被提出的一个很重要的原因.

但是推进比较缓慢,到目前为止也仅仅在 `stage 2` 阶段.

![2019-09-20-23-27-48](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb126ed5c70aa~tplv-t2oaga2asx-image.image)

所以在 JavaScript 中我们需要 Babel 插件 `babel-plugin-transform-decorators-legacy` 来支持 decorator,而在 Typescript 中我们需要在 `tsconfig.json` 里面开启支持选项 `experimentalDecorators`.

```
// tsconfig.json
"experimentalDecorators": true
```

我们先明确两个概念:

1.  目前装饰器本质上是一个函数,`@expression` 的形式其实是一个语法糖, expression 求值后必须也是一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入.
2.  JavaScript 中的 Class 其实也是一个语法糖,

比如在 JavaScript 中我们声明一个 Class:

```
class Person{
    say() {
        console.log('hello')
    }
}
```

上面这个 Person 类实际上相当于:

```
function Person() {}
Object.defineProperty(Person.prototype, 'say', {
    value: function() { console.log('hello'); },
    enumerable: false,
    configurable: true,
    writable: true
});
```

## 类装饰器

比如,我们声明一个函数 `addAge` 去给 Class 的属性 `age` 添加年龄.

```
function addAge(constructor: Function) {
  constructor.prototype.age = 18;
}

@addAge
class Person{
  name: string;
  age!: number;
  constructor() {
    this.name = 'xiaomuzhu';
  }
}

let person = new Person();

console.log(person.age); // 18
```

所以这段代码实际上基本等同于：

```
Person = addAge(function Person() { ... });
```

当装饰器作为修饰类的时候，会把构造器传递进去。 `constructor.prototype.age` 就是在每一个实例化对象上面添加一个 `age` 值 这里我们的 `addAge` 就添加了一个 `age` 值.

## 属性/方法装饰器

实际上一个Class的属性/方法也可以被装饰,我们分别给 `Person` 类加上 `say` 和 `run` 方法.

```
// 声明装饰器修饰方法/属性
function method(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
   console.log(target);
   console.log("prop " + propertyKey);
   console.log("desc " + JSON.stringify(descriptor) + "\n\n");
   descriptor.writable = false;
};

class Person{
  name: string;
  constructor() {
    this.name = 'xiaomuzhu';
  }

  @method
  say(){
    return 'instance method';
  }

  @method
  static run(){
    return 'static method';
  }
}

const xmz = new Person();

// 修改实例方法say
xmz.say = function() {
  return 'edit'
}

// 打印结果,检查是否成功修改实例方法
console.log(xmz.say());

```

得到的结果如下:

```
Person { say: [Function] }
prop say
desc {"writable":true,"enumerable":true,"configurable":true}


[Function: Person] { run: [Function] }
prop run
desc {"writable":true,"enumerable":true,"configurable":true}

xmz.say = function() {
       ^
TypeError: Cannot assign to read only property 'say' of object '#<Person>'
```

在属性/方法的装饰器定义过程中,与 class 的装饰器不同,我们的 `method` 函数中的参数变为了三个 `target`、`propertyKey`、`descriptor`.

对,这三个参数正是源于`Object.defineProperty`,也就是上面提到的 Class 本质是语法糖,实际上属性/方法装饰器是借助`Object.defineProperty`修改类的方法和属性的.

上面的方法装饰器代码相当于下面:

```
let descriptor = {
    value: function() { return 'instance method'},
    enumerable: false,
    configurable: true,
    writable: true
};

descriptor = readonly(Cat.prototype, "say", descriptor) || descriptor;

Object.defineProperty(Cat.prototype, "say", descriptor);
```

> 访问器属性getter或者setter同样可以用属性装饰器修饰

## 小结

虽然装饰器目前依然在 TC39 的草案阶段,但是其实他已经借助 Babel 或者 TypeScript 广泛运用于各种业务开发或者基础库中,这就得益于它强大的抽象与重用特性,比如 Angular 中就大量运用了装饰器,但是仅仅借助装饰器的力量是不够的,我们知道在 Java 中有与装饰器非常像的一种语法叫注解,这就不得不提 Reflect Metadata了.
    