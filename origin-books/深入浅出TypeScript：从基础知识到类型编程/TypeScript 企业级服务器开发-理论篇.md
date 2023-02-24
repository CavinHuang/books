
# TypeScript 企业级服务器开发-理论篇
---

# typescript 企业级服务器开发：理论篇

通常小打小闹的 Node.js 服务器开发基本用面条代码就可以了，但是一般用 typescript 开发 Node.js 后端项目，这个要求通常是企业级的，面条代码显然是不能写了，要有基本的分层、逻辑与配置分离等等，这个时候最好的方法是选择一个企业级框架，比如 Nest.js，或者在 egg.js、koa 这种低级别框架、库基础上封装一个企业级框架。

我们在 koa 的基础上封装一个框架的内容之多显然可以写一本书了，而且除非有特殊需求，最好的方式还是选择社区内已经比较成熟的框架进行开发，我们就学习一下 Node.js 生态中为数不多的企业级开发框架 Nest.js。

Nest.js 是 Node 渐进式框架，底层默认使用 express（可以通过 Adapter 转换到 fastify），可以使用 express 或者 fastify 所有中间件，完美支持 TypeScript，它大量借鉴了 Spring 和 Angular 中的设计思想。

我们先学习一下 Nest.js 中几个重要的概念。

## 依赖注入

如果你用过 Spring 或者 Angular，这个概念其实已经听过无数次了。

依赖注入（Dependency Injection，简称DI）是面向对象中控制反转（Inversion of Control，简称 IoC）最常见的实现方式，主要用来降低代码的耦合度。

假设你要造一辆车，你需要引擎和轮子：

```
import { Engine } from './engine'
import { Tire } from './tire'

class Car {
  private engine;
  private wheel;
  
  constructor() {
    this.engine = new Engine();
    this.tire = new Tire();
  }
}
```

这时候 `Car` 这个类依赖于 `Engine` 和 `Tire`，构造器不仅需要把依赖赋值到当前类内部属性上还需要把依赖实例化。假设，有很多种类的 `Car` 都用了 `Engine`，这时候需要把 `Engine` 替换为 `ElectricEngine`。

以上这种牵一发而动全身的后果，就是代码耦合度过高造成的，因此我们得想办法降低耦合度，这个时候我们就需要用到 IoC。

```
import { Engine } from './engine'
import { Tire } from './tire'

class Container {
  private constructorPool;

  constructor() {
    this.constructorPool = new Map();
  }

  register(name, constructor) {
    this.constructorPool.set(name, constructor);
  }

  get(name) {
    const target = this.constructorPool.get(name);
    return new target();
  }
}

const container = new Container();
container.bind('engine', Engine);
container.bind('tire', Tire);

class Car {
  private engine;
  private tire;
  
  constructor() {
    this.engine = container.get('engine');
    this.tire = container.get('tire');
  }
}
```

此时，`container`相当于`Car`和`Engine`、`Tire`之间的中转站，`Car`不需要自己去实例化一个`Engine`或者`Tire`，`Car`和`Engine`、`Tire`之间也就没有了强耦合的关系。

从上面例子看出，在使用 IoC 之前，`Car`需要`Engine`或者`Tire`时需要自己主动去创建`Engine`或者`Tire`，此时对`Engine`或者`Tire`的创建和使用的控制权都在`Car`手上。

在使用 IoC 之后，`Car`和`Engine`或者`Tire`之间的联系就切断了，当`Car`需要`Engine`或者`Tire`时，`IoC Container`会主动创建这个对象给`Car`使用，此时`Car`获取`Engine`或者`Tire`的行为由主动获取变成了被动获取，控制权就颠倒过来。当`Engine`或者`Tire`有任何变动，`Car`不会受到影响，它们之间就完成了解耦。

当我们需要测试`Car`时，我们不需要把`Engine`或者`Tire`全部`new`一遍来构造`Car`，只需要把 mock 的`Engine`或者`Tire`， 注入到 IoC 容器中就行。

在 Nestjs 中，通过`@Injectable`装饰器向 IoC 容器注册：

```
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

在构造函数中注入`CatsService`的实例：

```
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

`CatsService`作为一个`privider`，需要在`module`中注册，这样在该`module`启动时，会解析`module`中所有的依赖，当`module`销毁时，`provider`也会一起销毁。

```
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class ApplicationModule {}
```

## DTO

数据访问对象简称DTO（Data Transfer Object）， 是一组需要跨进程或网络边界传输的聚合数据的简单容器。它不应该包含业务逻辑，并将其行为限制为诸如内部一致性检查和基本验证之类的活动。

在 Nestjs 中，可以使用 TypeScript 接口或简单的类来完成。配合 `class-validator`和`class-transformer` 可以很方便地验证前端传过来的参数：

```
import { IsString, IsInt, MinLength, MaxLength } from "class-validator";
import { ApiModelProperty } from '@nestjs/swagger'

export class CreateCatDto {
  @ApiModelProperty()
  @IsString()
  @MinLength(10, {
    message: "Name is too short"
  })
  @MaxLength(50, {
    message: "Name is too long"
  })
  readonly name: string;
  
  @ApiModelProperty()
  @IsInt()
  readonly age: number;
  
  @ApiModelProperty()
  @IsString()
  readonly breed: string;
}
```

## ORM

ORM 是”对象-关系映射”（Object/Relational Mapping） 的缩写，通过实例对象的语法，完成关系型数据库的操作。通过 ORM 就可以用面向对象编程的方式去操作关系型数据库。

在 Java 中，通常会有 DAO（Data Access Object， 数据访问对象）层，DAO 中包含了各种数据库的操作方法。通过它的方法，对数据库进行相关的操作。DAO 主要作用是分离业务层与数据层，避免业务层与数据层耦合。

在 Nestjs 中，可以用 TypeORM 作为你的 DAO 层，它支持 MySQL / MariaDB / Postgres / CockroachDB / SQLite / Microsoft SQL Server / Oracle / MongoDB / NoSQL。

在 typeORM 中数据库的表对应的就是一个类，通过定义一个类来创建实体。实体（Entity）是一个映射到数据库表（或使用 MongoDB 时的集合）的类，通过`@Entity()`来标记。

```
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

}
```

上面代码将创建以下数据库表：

```
+-------------+--------------+----------------------------+
|                          user                           |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| firstName   | varchar(255) |                            |
| lastName    | varchar(255) |                            |
| isActive    | boolean      |                            |
+-------------+--------------+----------------------------+
```

使用 `@InjectRepository()` 修饰器注入 对应的`Repository`，就可以在这个 `Repository` 对象上进行数据库的一些操作。

```
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
```

## 面向切面编程

面向切面编程（Aspect Oriented Programming，简称AOP）主要是针对业务处理过程中的切面进行提取，在某个步骤和阶段进行一些操作，从而达到 DRY（Don’t Repeat Yourself） 的目的。AOP 对 OOP 来说，是一种补充，比如可以在某一切面中对全局的 Log、错误进行处理，这种一刀切的方式，也就意味着，AOP 的处理方式相对比较粗粒度。

在 Nestjs 中，AOP 分为下面几个部分（按顺序排列）：

- Middlewares
- Guards
- Interceptors \(在流被操纵之前\)
- Pipes
- Interceptors \(在流被操纵之后\)
- Exception filters \(如果发现任何异常\)

在 Nest.js 中分层处理的过程是这样的：

![2019-10-21-00-53-00](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded06ce1ba3219~tplv-t2oaga2asx-image.image)

- Pipes 一般用户验证请求中参数是否符合要求，起到一个校验参数的功能
- middleware 中间件就是 express 的中间件，我们甚至可以复用 express 中的中间件，我们可以在中间件中接受 response 和 request 作为参数，并且可以修改请求对象 request 和结果返回对象 response
- Guards 守卫：作用就是决定一个请求是否应该被处理函数接受并处理，当然我们也可以在 middleware 中间件中来做请求的接受与否的处理，与 middleware 相比，Guards 可以获得更加详细的关于请求的执行上下文信息
- interceptors拦截器：interceptors 拦截器在函数执行前或者执行后可以运行，如果在执行后运行，可以拦截函数执行的返回结果，修改参数等，比如超时处理器就可以用 interceptors 拦截器实现。
- Exception filters异常过滤器：Exception filters异常过滤器可以捕获在后端接受处理任何阶段所跑出的异常，捕获到异常后，然后返回处理过的异常结果给客户端（比如返回错误码，错误提示信息等等）

## 小结

我们学习了 Nest.js 的几个重要概念，对于没有 Spring 、 Angular 经验的人理解起来可能有一些吃了，我们接下来会进行一个小实战来帮助我们理解。

---

参考：

- [从Express到Nestjs，谈谈Nestjs的设计思想和使用方法](https://github.com/forthealllight/blog/issues/35)
- [浅析控制反转](https://zhuanlan.zhihu.com/p/60995312)
    