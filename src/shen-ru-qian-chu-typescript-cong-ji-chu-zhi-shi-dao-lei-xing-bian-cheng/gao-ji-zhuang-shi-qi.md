
# 高级装饰器
---

# 高级装饰器

我们上一节了解到了最常用的四种装饰器: 类装饰器、属性装饰器、方法装饰器、访问符装饰器，这已经可以满足我们日常开发的需求了。

但是依然有一些比较高级的用法，这些用法虽然在日常开发中并不多见，但是被大量运用在了基础库层面，要想成为一个名高阶的 TypeScript 开发者还是需要更进一步学习。

## 参数装饰器

参数装饰器，顾名思义是用于修饰参数的装饰器，在 Angular 或者 Nestjs 中都有运用，当然很多基础库也用到了参数装饰器。

```
function logParameter(target: Object, propertyKey: string, index: number) {
    console.log(target, propertyKey, index);
}

class Person {
    greet(@logParameter message: string,@logParameter name: string): string {
        return `${message} ${name}`;
    }
}
const p = new Person();
p.greet('hello', 'xiaomuzhu');

// Person { greet: [Function] } greet 1
// Person { greet: [Function] } greet 0

```

我们看到参数装饰器需要三个参数 `target`、`propertyKey`、`index`：

- target —— 当前对象的原型，也就是说，假设 `Person` 是当前对象，那么当前对象 `target` 的原型就是 `Person.prototype`
- propertyKey —— 参数的名称，上例中指的就是 greet
- index —— 参数数组中的位置，比如上例中参数 name 的位置是 1, message 的位置为 0

参数装饰器其实有他的特殊之处，我们之前学到的装饰器是可以修改被修饰者的行为的，比如我们可以把一个方法的「可写性」禁用了，这就实现了类方法的「只读」效果，但是参数装饰器不可以，他没有`descriptor`参数，因此没有相关的 API 供它修改被修饰者的行为。

那么，这个参数装饰器还有啥用？

参数装饰器可以提供信息，给比如给类原型添加了一个新的属性，属性中包含一系列信息，这些信息就被成为「元数据」，然后我们就可以使用另外一个装饰器来读取「元数据」。

是的，这像极了Java中的注解。

当然我们那种直接修改类原型属性的方法并不优雅，后面我们会介绍有一种更通用更优雅的方式--元数据反射。

## 装饰器工厂

我们先假设这样一个场景，比如我们需要几个装饰器，分别把一个类中的部分属性、类本身、方法、参数的名称打印出来，我们应该怎么做\?

大家可能会写出四个不同的装饰器来分别装饰到不同成员上:

```
@logClass
class Person { 

  @logProperty
  public name: string;

  constructor(name : string) { 
    this.name = name;
  }

  @logMethod
  public greet(@logParameter message : string) : string { 
    return `${this.name} say: ${message}`;
  }
}

// 打印构造函数
function logClass(target: typeof Person) {
    console.log(target)
}

// 打印属性名
function logProperty(target: any, propertyKey: string) {
    console.log(propertyKey);   
}

// 打印方法名
function logMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(propertyKey);   
}

// 打印参数位置
function logParameter(target: Object, propertyKey: string, index: number) {
    console.log(index);
}

// name
// 0
// greet
// [Function: Person]
```

确实我们达到效果了，但是装饰器通常是用于抽象和重用，如果一个项目或者库有过量装饰器不仅不能达到上述效果，然而会让项目难以维护.

而且上述装饰器其实是有共同点的，他们都是打印一些关键信息，因此我们可以用一个**装饰器工厂**来进一步抽象上述代码。

```
function log(...args : any[]) {
  switch(args.length) {
    case 1:
      return logClass.apply(this, args);
    case 2:
      return logProperty.apply(this, args);
    case 3:
      if(typeof args[2] === "number") {
        return logParameter.apply(this, args);
      }
      return logMethod.apply(this, args);
    default:
      throw new Error("Decorators are not valid here!");
  }
}

```

我们之后直接用 `log` 代替 `logClass`、`logProperty`、`logMethod`、`logParameter` 即可.

> 装饰器工厂就是一个简单的函数，它返回一种类型的装饰器。

## 装饰器顺序

多个装饰器可以同时应用到一个声明上，就像下面的示例：

 -    书写在同一行上：

```
@f @g x
```

 -    书写在多行上：

```
@f
@g
x
```

在 TypeScript 里，当多个装饰器应用在一个声明上时会进行如下步骤的操作：

1.  由上至下依次对装饰器表达式求值。
2.  求值的结果会被当作函数，由下至上依次调用。

如果我们使用装饰器工厂的话，可以通过下面的例子来观察它们求值的顺序：

```
function f() {
    console.log("f(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}

function g() {
    console.log("g(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}

class C {
    @f()
    @g()
    method() {}
}
```

在控制台里会打印出如下结果：

```
f(): evaluated
g(): evaluated
g(): called
f(): called
```

类中不同声明上的装饰器将按以下规定的顺序应用：

- 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个实例成员。
- 参数装饰器，然后依次是方法装饰器，访问符装饰器，或属性装饰器应用到每个静态成员。
- 参数装饰器应用到构造函数。
- 类装饰器应用到类。

## 小结

虽然装饰器目前依然在 TC39 的草案阶段，但是其实他已经借助 Babel 或者 TypeScript 广泛运用于各种业务开发或者基础库中，这就得益于它强大的抽象与重用特性，比如 Angular 中就大量运用了装饰器，但是仅仅借助装饰器的力量是不够的，我们知道在Java中有与装饰器非常像的一种语法叫注解，这就不得不提Reflect Metadata了。
    