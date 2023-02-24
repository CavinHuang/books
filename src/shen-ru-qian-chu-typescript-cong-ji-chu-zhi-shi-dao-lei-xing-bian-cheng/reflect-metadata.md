
# Reflect Metadata
---

# Reflect Metadata

Reflect Metadata 属于 ES7 的一个提案,它的主要作用就是在声明的时候「添加和读取元数据」，我们上一节用手动的方法在属性上添加元数据，不仅不优雅而且影响开发效率。

Reflect Metadata 目前需要引入 npm 包才能使用:

```
npm i reflect-metadata --save
```

而且需要在 `tsconfig.json` 中配置 `emitDecoratorMetadata`.

之后我们就可以用装饰器来获取、添加元数据了.

```
@Reflect.metadata('name', 'A')
class A {
  @Reflect.metadata('hello', 'world')
  public hello(): string {
    return 'hello world'
  }
}

Reflect.getMetadata('name', A) // 'A'
Reflect.getMetadata('hello', new A()) // 'world'
```

总之:

- Relfect Metadata，可以通过装饰器来给类添加一些自定义的信息
- 然后通过反射将这些信息提取出来
- 也可以通过反射来添加这些信息

> 反射, ES6+ 加入的 Relfect 就是用于反射操作的,它允许运行中的 程序对自身进行检查，或者说“自审”，并能直接操作程序的内部属性和方法,反射这个概念其实在 Java/c# 等众多语言中已经广泛运用了.

## 基础概念

我们可以先粗略得扫一下 Relfect Metadata 的 API:

```
// define metadata on an object or property
Reflect.defineMetadata(metadataKey, metadataValue, target);
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);

// check for presence of a metadata key on the prototype chain of an object or property
let result = Reflect.hasMetadata(metadataKey, target);
let result = Reflect.hasMetadata(metadataKey, target, propertyKey);

// check for presence of an own metadata key of an object or property
let result = Reflect.hasOwnMetadata(metadataKey, target);
let result = Reflect.hasOwnMetadata(metadataKey, target, propertyKey);

// get metadata value of a metadata key on the prototype chain of an object or property
let result = Reflect.getMetadata(metadataKey, target);
let result = Reflect.getMetadata(metadataKey, target, propertyKey);

// get metadata value of an own metadata key of an object or property
let result = Reflect.getOwnMetadata(metadataKey, target);
let result = Reflect.getOwnMetadata(metadataKey, target, propertyKey);

// get all metadata keys on the prototype chain of an object or property
let result = Reflect.getMetadataKeys(target);
let result = Reflect.getMetadataKeys(target, propertyKey);

// get all own metadata keys of an object or property
let result = Reflect.getOwnMetadataKeys(target);
let result = Reflect.getOwnMetadataKeys(target, propertyKey);

// delete metadata from an object or property
let result = Reflect.deleteMetadata(metadataKey, target);
let result = Reflect.deleteMetadata(metadataKey, target, propertyKey);

// apply metadata via a decorator to a constructor
@Reflect.metadata(metadataKey, metadataValue)
class C {
  // apply metadata via a decorator to a method (property)
  @Reflect.metadata(metadataKey, metadataValue)
  method() {
  }
}
```

看完这些API的命名其实有经验的开发者已经可以猜出来这些API的大概作用了，我们后面会提及，而且这些API接受的参数一共就四种，我们在这里说明一下:

- `Metadata Key`: 元数据的Key，本质上内部实现是一个Map对象，以键值对的形式储存元数据
- `Metadata Value`: 元数据的Value，这个容易理解
- `Target`: 一个对象，表示元数据被添加在的对象上
- `Property`: 对象的属性，元数据不仅仅可以被添加在对象上，也可以作用于属性，这跟装饰器类似

## 常用方法

### 设置/获取元数据

我们首先了解一下如何添加元数据，这个时候需要用到 `metadata` API，这个 API 是利用装饰器给目标添加元数据:

```
function metadata(
  metadataKey: any,
  metadataValue: any
): {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
};
```

当然,如果你不想用装饰器这个途径的话，可以用 `defineMetadata` 来添加元数据.

```
// define metadata on an object or property
Reflect.defineMetadata(metadataKey, metadataValue, target);
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
```

我们通过装饰器就可以很简单得使用它:

```
import 'reflect-metadata'

@Reflect.metadata('name', 'xiaomuzhu')
class Person {

    @Reflect.metadata('time', '2019/10/10')
    public say(): string {
        return 'hello'
    }
}


console.log(Reflect.getMetadata('name', Person)) // xiaomuzhu
console.log(Reflect.getMetadata('time', new Person, 'say')) // 2019/10/10
```

可以看见我们在用 `metadata` 设置了元数据后，需要用 `getMetadata` 将元数据取出，但是为什么在取出方法 `say` 上的元数据时需要先把 Class 实例化\(即`new Person`\)呢\?

原因就在于元数据是被添加在了实例方法上，因此必须实例化才能取出，要想不实例化，则必须加在静态方法上.

### 内置元数据

上面的例子中，我们的元数据是开发者自己设置的，其实我们也可以获取一些 TypeScript 本身内置的一些元数据。

比如，我们通过 `design:type` 作为 key 可以获取目标的类型，比如在上例中，我们获取 `say` 方法的类型:

```
...
// 获取方法的类型
const type = Reflect.getMetadata("design:type", new Person, 'say')

[Function: Function]
```

通过 `design:paramtypes` 作为 key 可以获取目标参数的类型，比如在上例中，我们获取 `say` 方法参数的类型:

```
// 获取参数的类型,返回数组
const typeParam = Reflect.getMetadata("design:paramtypes", new Person, 'say')

// [Function: String]
```

使用 `design:returntype` 元数据键获取有关方法返回类型的信息:

```
const typeReturn = Reflect.getMetadata("design:returntype", new Person, 'say')
// [Function: String]
```

## 实践工作

通过上面的学习我们基本了解了 Reflect Metadata 的使用方法，在实际开发中其实我们会经常用到这个特性。

比如在 Node.js 中有一些框架，比如 Nestjs 会有分散式的装饰器路由，比如 `@Get` `@Post` 等，正是借助 Reflect Metadata 实现的。

比如一个博客系统的文章路由，可能会是下面的代码:

```
@Controller('/article')
class Home {
    @Get('/content')
    someGetMethod() {
      return 'hello world';
    }
  
    @Post('/comment')
    somePostMethod() {}
}
```

那么我现在一步步实现一下。

我们先实现一个生产控制器 `Controller` 的装饰器工厂函数:

```
const METHOD_METADATA = 'method'
const PATH_METADATA = 'path'
// 装饰器工厂函数,接受路由的路径path返回一个装饰器
const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(PATH_METADATA, path, target);
  }
}
```

接着需要实现 `Get` `Post` 等方法装饰器:

```
// 装饰器工厂函数,首先接受一个方法,比如get/post,如何再接受一个路由路径,返回一个携带了上述两个信息的装饰器
const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value!);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value!);
  }
}

const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');
```

这里的代码可能理解上有点难度,`createMappingDecorator` 是柯里化的，你实际上可以把这个函数看成做了两件事,第一件事，接受一个参数确定 http 的方法，比如是 get 还是 post，然后第二件事，确定路由的路径 path。

> 在计算机科学中，柯里化（英语：Currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

到这里为止我们已经可以向Class中添加各种必要的元数据了，但是我们还差一步，就是读取元数据。

我们需要一个函数来读取整个Class中的元数据:

```

/** 工具函数 **/

function isConstructor(symbol: any): boolean {
  return notUndefined(symbol) &&
      symbol instanceof Function &&
      symbol.constructor &&
      symbol.constructor instanceof Function &&
      notUndefined(new symbol) &&
      Object.getPrototypeOf(symbol) !== Object.prototype &&
      symbol.constructor !== Object &&
      symbol.prototype.hasOwnProperty('constructor');
};

function notUndefined(item: any): boolean {
  return item != undefined && item != 'undefined';
}

function isFunction(value: any): value is Function {
  return typeof value === 'function';
}


function mapRoute(instance: Object) {
const prototype = Object.getPrototypeOf(instance);

// 筛选出类的 methodName
const methodsNames = Object.getOwnPropertyNames(prototype)
                            .filter(item => !isConstructor(item) && isFunction(prototype[item]));
return methodsNames.map(methodName => {
  const fn = prototype[methodName];

  // 取出定义的 metadata
  const route = Reflect.getMetadata(PATH_METADATA, fn);
  const method = Reflect.getMetadata(METHOD_METADATA, fn);
  return {
    route,
    method,
    fn,
    methodName
  }
})
};


Reflect.getMetadata(PATH_METADATA, Home);

const info = mapRoute(new Home());

console.log(info);
// [
//   {
//     route: '/home',
//     method: undefined,
//     fn: [Function: Home],
//     methodName: 'constructor'
//   },
//   {
//     route: '/article',
//     method: 'GET',
//     fn: [Function],
//     methodName: 'someGetMethod'
//   },
//   {
//     route: '/comment',
//     method: 'POST',
//     fn: [Function],
//     methodName: 'somePostMethod'
//   }
// ]


```

## 小结

我们通过这一节终于了解了 Reflect Metadata 的基本用法和实践，实际上 Reflect Metadata 的作用就是附加元数据，这一点跟 Java 中的注解非常相似。

Angular 或者 Nestjs 这样的框架就是通过 Decorator + Reflect.metadata 的组合来模拟注解\(Annotation\)的功能，上面的路由实践环节就是如此。
    