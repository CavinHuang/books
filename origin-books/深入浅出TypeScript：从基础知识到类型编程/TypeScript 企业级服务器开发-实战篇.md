
# TypeScript 企业级服务器开发-实战篇
---

# typescript 企业级服务器开发：实战篇

## Nest 初始化

我们先在全局安装 nest.js 的 cli，然后初始化我们的项目：

```
npm install -g @nestjs/cli
nest new nest-app
```

我们选择 npm 进行安装：

![2019-10-21-01-15-54](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded070281d3d31~tplv-t2oaga2asx-image.image)

我们安装完毕后打开编辑器，它的目录结构是这样的：

![2019-10-21-01-18-34](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded070282838ce~tplv-t2oaga2asx-image.image)

运行 `npm start` 后，在浏览器访问http://localhost:3000/，效果如下：

![2019-10-21-01-20-36](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded07028950d36~tplv-t2oaga2asx-image.image)

那么我们的第一个 Nest.js 程序就启动了。

## Controller

Controller 控制器，controller 负责处理传入的请求, 并调用对应的 service 完成业务处理，返回对客户端的响应。

我们创建一个新的 controller:

```
nest g co books
```

这个命令会产生两个动作：

1.  创建 controller 文件：

![2019-10-21-01-40-42](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded070288f5390~tplv-t2oaga2asx-image.image)

2.  将新创建的 controller 注册到 module 中去

![2019-10-21-01-41-35](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded07028c79ea1~tplv-t2oaga2asx-image.image)

我们看到生成的 `books.controller.ts` 文件：

```
import { Controller } from '@nestjs/common';

@Controller('books')
export class BooksController {}

```

`@Controller('books')` 指定了当前路由路径为 `books`，可见 Nest.js 采用的是分散式路由。

我们对此文件进行改写：

```
import { Controller, Get } from '@nestjs/common';

@Controller('books')
export class BooksController {
    @Get('/js')
    findJavaScript() {
        return 'JavaScript高级程序设计';
    }
}

```

这里引入的 `Get('/js')` 代表了 get 方法，针对 `books/js` 的路由下进行的处理。

我们现在把服务暂停，选择开发模式再次启动项目:

```
npm run start:dev
```

这个时候我们的每次更改都会触发项目的二次编译，就不用反复运行项目了。

访问 `http://localhost:3000/books/js` 路由，我们看到的结果如下：

![2019-10-21-01-49-29](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded07028b2f494~tplv-t2oaga2asx-image.image)

果然，Controller 可以控制处理路由，但是在实际开发中这些返回的数据并不是写死的，我们必须在 Controller 中调用 Service 来获取数据。

## Service

我们继续用命令行生成 Service:

```
nest g s books
```

效果如下：

![2019-10-21-01-54-56](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded07056a93717~tplv-t2oaga2asx-image.image)

我们改写 `books.service.ts` 如下：

```
import { Injectable } from '@nestjs/common';

@Injectable()
export class BooksService {
    getBooks() {
        return `本书找到了！`;
    }
}

```

改写 `books.controller.ts` 如下：

```
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {
    }

    @Get('/js')
    findBook() {
        const res = this.booksService.getBooks();

        return res;
    }
}

```

我们在 `BooksController` 注入了 `BooksService`，从而可以在 `BooksController` 调用相关的方法 `this.booksService.getBooks()`，这里就是依赖注入的运用。

但是仅仅有 Service、Controller 也是不够的，我们需要一个持久化储存数据的数据库，通常情况下我们在 Service 与 数据库之间需要加一层 DAO，开发者不应该直接操纵数据库，一方面性能没有保证，另一方面不易维护，这就涉及到了 TypeORM。

## TypeORM

TypeORM 是一个 ORM 框架，在 Nest.js 架构中充当 DAO 层，我们通过操纵 TypeORM 来间接操纵数据库。

我们先安装相关的库以便在 nest.js 框架中使用：

```
npm install --save @nestjs/typeorm typeorm mysql
```

然后我们在 mysql 中新建一个数据库 `nest`:

![2019-10-21-02-26-06](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded07059cf8e97~tplv-t2oaga2asx-image.image)

我们在 `app.module.ts` 配置 `TypeOrmModule`：

```
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksController } from './books/books.controller';
import { BooksService } from './books/books.service';
import { BooksEntity } from './entities/books.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      keepConnectionAlive: true,
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest',
      synchronize: true,
      entities: [BooksEntity],
    }),
  ],
  controllers: [AppController, BooksController],
  providers: [AppService, BooksService],
})
export class AppModule {}

```

我们的 `Entity` 设置如下 `entities/books.entity.ts`:

```
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('books')
export class BooksEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 10 })
  author: string;
}

```

成功运行之后，我们的 `Entity` 会被映射到数据库中：

![2019-10-21-03-15-14](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded0706b482dc8~tplv-t2oaga2asx-image.image)

接下来我们就可以通过这层 DAO 进行数据库操作了, 在 `books.service.ts` 中如下：

```
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as _ from 'lodash';

import { BooksEntity } from '../entities/books.entity';
import { CreateBooksDto } from '../dtos/books.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BooksEntity)
    private readonly booksRepository: Repository<BooksEntity>,
  ) {}
  async getBooks(id: number) {
    return await this.booksRepository.findOne(id);
  }

  async createBooks(book: CreateBooksDto) {
    const res = await this.booksRepository.save(book);

    return _.pick(res, 'id');
  }
}

```

我们用 `@InjectRepository()` 修饰器向 `BooksService` 注入 `booksRepository`，这样我们就可以在 `BooksService` 中利用`this.booksRepository` 进行 DAO 的操作了，比如查找、删除、创建等等。

我们在 `books.controller.ts` 中编辑控制器，至于 HTTP 请求对象的内容，在大多数情况下, 不必手动获取它们。 我们可以使用专用的装饰器，比如 `@Body()` 或 `@Query()` 来自动获取。

```
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBooksDto } from '../dtos/books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get(':id')
  findBook(@Param('id') id: number) {
    return this.booksService.getBooks(id);
  }

  @Post()
  async create(@Body() createCatDto: CreateBooksDto): Promise<{ id: number }> {
    return await this.booksService.createBooks(createCatDto);
  }
}

```

接下来我们进行一下测试，我们在 PostMan 中进行如下测试：

![2019-10-21-04-21-18](https://xiaomuzhu-image.oss-cn-beijing.aliyuncs.com/0dbc5eaa8156ae71b886fc62f34671e4.png)

我们传入一个 json，包含书名和作者名字，用 post 方法发送，结果如下：

![2019-10-21-04-22-49](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded0707f1a273a~tplv-t2oaga2asx-image.image)

我们看到了 201 创建成功的状态码，并受到了我们的 book 的 id，再看看数据库是否保存了数据：

![2019-10-21-04-23-38](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded07086b137d5~tplv-t2oaga2asx-image.image)

没问题，我们继续尝试查询 id 为 14 的书籍信息:

![2019-10-21-04-24-22](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded0709aa3bb92~tplv-t2oaga2asx-image.image)

我们成功查询:

![2019-10-21-04-25-30](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded0709adcee82~tplv-t2oaga2asx-image.image)

我们这个简易的服务器搭建算是基本告一段落。

## 小结

我们学习了基于 Nest.js 的简易服务器搭建，其分层的思想无处不在：

- 我们通过 Controller 处理路由请求
- 通过 Service 进行计算和数据操作
- 通过 typeorm 生成 dao 层，我们间接操作数据库

各个层各司其职，通过依赖注入的方式充分解耦，这是企业级服务器开发的基本设计思想。

我已经把完整代码发布到了github [仓库](https://github.com/xiaomuzhu/nest-app) 中。
    