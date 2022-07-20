
# 类型断言与类型守卫
---

# 类型断言与类型守卫

## 类型断言

有些情况下 TS 并不能正确或者准确得推断类型,这个时候可能产生不必要的警告或者报错。

比如初学者经常会遇到的一类问题:

```
const person = {};

person.name = 'xiaomuzhu'; // Error: 'name' 属性不存在于 ‘{}’
person.age = 20; // Error: 'age' 属性不存在于 ‘{}’
```

这个时候该怎么办？由于类型推断，这个时候 `person` 的类型就是 `{}`，根本不存在后添加的那些属性，虽然这个写法在js中完全没问题，但是开发者知道这个 `person` 实际是有属性的，只是一开始没有声明而已，但是 typescript 不知道啊，所以就需要类型断言了:

```
interface Person {
  name: string;
  age: number;
}

const person = {} as Person;

person.name = 'xiaomuzhu';
person.age = 20;
```

但是类型断言不要滥用,在万不得已的情况下使用要谨慎,因为你强制把某类型断言会造成 TypeScript 丧失代码提示的能力。

## 双重断言

虽然类型断言是有强制性的,但并不是万能的,因为一些情况下也会失效:

```
interface Person {
	name: string;
	age: number;
}

const person = 'xiaomuzhu' as Person; // Error
```

这个时候会报错,很显然不能把 `string` 强制断言为一个接口 `Person` ,但是并非没有办法,此时可以使用双重断言:

```
interface Person {
	name: string;
	age: number;
}

const person = 'xiaomuzhu' as any as Person; // ok
```

先把类型断言为 `any` 再接着断言为你想断言的类型就能实现双重断言，当然上面的例子肯定说不通的，双重断言我们也更不建议滥用，但是在一些少见的场景下也有用武之地，当你遇到事记得有双重断言这个操作即可。

## 类型守卫

类型守卫说白了就是缩小类型的范围，我们看几个例子就容易理解了。

### instanceof

instanceof 类型保护是通过构造函数来细化类型的一种方式.

```

class Person {
    name = 'xiaomuzhu';
    age = 20;
}

class Animal {
    name = 'petty';
    color = 'pink';
}

function getSometing(arg: Person | Animal) {
    // 类型细化为 Person
    if (arg instanceof Person) {
        console.log(arg.color); // Error，因为arg被细化为Person，而Person上不存在 color属性
        console.log(arg.age); // ok
    }
    // 类型细化为 Person
    if (arg instanceof Animal) {
        console.log(arg.age); // Error，因为arg被细化为Animal，而Animal上不存在 age 属性
        console.log(arg.color); // ok
    }
}
```

### in

跟上面的例子类似，`x in y` 表示 x 属性在 y 中存在。

```
class Person {
	name = 'xiaomuzhu';
	age = 20;
}

class Animal {
	name = 'petty';
	color = 'pink';
}

function getSometing(arg: Person | Animal) {
	if ('age' in arg) {
		console.log(arg.color); // Error
		console.log(arg.age); // ok
	}
	if ('color' in arg) {
		console.log(arg.age); // Error
		console.log(arg.color); // ok
	}
}
```

### 字面量类型守卫

这个功能很重要，在后面的联合辨析类型中会用到此特性，当你在联合类型里使用字面量类型时，它可以帮助检查它们是否有区别:

```
type Foo = {
  kind: 'foo'; // 字面量类型
  foo: number;
};

type Bar = {
  kind: 'bar'; // 字面量类型
  bar: number;
};

function doStuff(arg: Foo | Bar) {
  if (arg.kind === 'foo') {
    console.log(arg.foo); // ok
    console.log(arg.bar); // Error
  } else {
    console.log(arg.foo); // Error
    console.log(arg.bar); // ok
  }
}
```

## 小结

本节的内容不多，基本属于小技巧类，这些小技巧能帮助我们快速解决一下棘手的问题，也能帮助我们编写一些高效的代码。
    