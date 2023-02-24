
# 工具篇-数据库
---

## 前言

在上一章中，我们通过接入飞书应用以及机器人消息推送，对使用 `NestJS` 框架以及后端业务开发有了一定的经验，也开启了正式开发的第一步。

在一个普通的后端业务开发中基本上逃离不了 **CURD**，也就是对数据的常规操作。在技术选型中提到，网关系统中将同时使用 **2** 种数据库 `MySQL` 与 `MongoDB`（分别是关系型数据库与非关系数据库的代表）分别进行用户与物料服务的数据存储。

作为基础脚手架的搭建，为了便于业务开发同学的使用与开发体验，比较好的方式是使用配置模式提供统一的 **API** 调用减少开发的理解与接入成本。

本章我们将学习对数据库的封装以及常规的数据库操作。

## TypeORM

日常对数据库的操作需要借助于 `SQL`，至少需要掌握基础的 `SQL` 语法就有建表、增删改查等。但如果想要在代码中直接实现对数据库的操作，就需要去写大量 `SQL` ，这在**可读性、维护性、开发体验以及维护上都是非常糟糕的**。

所以 **ORM** 框架也就应运而生，这一类的框架是为了解决面型对象与关系数据库存在的互不匹配的现象，把面向 `SQL` 开发转变为面向对象开发，开发不需要关注底层实现细节，可以以操作对象的模式使用数据库。

> 对象关系映射（Object Relational Mapping，简称 ORM）模式是一种为了解决面向对象与关系数据库存在的互不匹配现象的技术。

[TypeORM](https://github.com/typeorm/typeorm) 作为 `Node.js` 中老牌的 `ORM` 框架，无论是接口定义，还是代码实现方面都简单易懂、可读性高，也很容易对接多种数据源。

虽然市面上也有其他不错的 `ORM` 框架，比如 [Sequelize](https://sequelize.org/)、[Prisma](https://www.prisma.io/) 等，但 `TypeORM` 使用 `TypeScript` 编写，在 `NestJS` 框架下运行得非常好，也是 `NestJS` 首推的 `OMR` 框架，有开箱即用的 `@nestjs/typeorm` 软件包支持。

综上所述，我们的 `ORM` 框架也将选用 `TypeORM` 来开发（看个人喜好与需求，如果喜欢 **GraphQL** 的，使用 [Prisma](https://www.prisma.io/) 更好）。

#### 封装

`NestJS` 使用 `TypeORM` 的方式有两种。一种是 `NestJS` 提供的 `@nestjs/typeorm` 集成包，可以导出 `TypeOrmModule.forRoot` 方法来连接数据库，同时可以使用 `ormconfig.json` 将数据库链接配置项剥离。另外一种是直接使用 `typeorm`，自由封装 `Providers` 导入使用。

两种方案各有优缺点，使用 `@nestjs/typeorm` 集成的方案较为简便，但自建的业务脚手架需要两种数据库保证在开发中体验一致性，此外之前已经自定义了全局环境变量的配置，没有必要再多一个 `ormconfig.json` 的配置来增加额外理解成本，所以接下来我们将使用第二种方案来连接数据库。

**第一步**：跟之前一样，为了使用 `TypeORM`，先安装以下依赖。

```shell
$ yarn add typeorm mysql
```

**第二步**：在 `dev.yaml` 中添加数据库配置参数。

```
MONGODB_CONFIG:
  name: "fast_gateway_test"          # 自定义次数据库链接名称
  type: mongodb                      # 数据库链接类型
  url: "mongodb://localhost:27017"   # 数据库链接地址
  username: "xxxx"                   # 数据库链接用户名
  password: "123456"                 # 数据库链接密码
  database: "fast_gateway_test"      # 数据库名
  entities: "mongo"                  # 自定义加载类型
  logging: false                     # 数据库打印日志
  synchronize: true                  # 是否开启同步数据表功能
```

以上是数据库连接的必要参数，其他的参数可以[参考文档](https://typeorm.io/data-source-options)根据需求添加，例如 `retryAttempts`（重试连接数据库的次数）、`keepConnectionAlive`（应用程序关闭后连接是否关闭） 等配置项。

**第三步**：新建 `src/common/database/database.providers.ts`

```ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { Page } from '@/page/page.mongo.entity';
import { PageConfig } from '@/page/page-config/page-config.mongo.entity';

// 设置数据库类型
const databaseType: DataSourceOptions['type'] = 'mongodb';
import { getConfig } from 'src/utils/index'
const path = require('path');
const { MONGODB_CONFIG } = getConfig()

const MONGODB_DATABASE_CONFIG = {
  ...MONGODB_CONFIG,
  type: databaseType,
  entities: [path.join(__dirname, `../../**/*.${MONGODB_CONFIG.entities}.entity{.ts,.js}`)],
}

const MONGODB_CONNECTION = new DataSource(MONGODB_DATABASE_CONFIG)

// 数据库注入
export const DatabaseProviders = [
  {
    provide: 'MONGODB_CONNECTION',
    useFactory: async () => {
      await MONGODB_CONNECTION.initialize()
      return MONGODB_CONNECTION
    }
  }
];
```

**第四步**：新建 `database.module.ts`

```ts
import { Module } from '@nestjs/common';
import { DatabaseProviders } from './database.providers';

@Module({
  providers: [...DatabaseProviders],
  exports: [...DatabaseProviders],
})

export class DatabaseModule { }
```

至此我们已经封装了 `MongoDB` 的 `Provider`，如果需要引入 `Mysql` 或者其他类型数据库的话，只需要替换对应的配置参数，重复上述步骤即可。

> 在我写这个小册的时候，用的 `TypeORM` 版本是 `0.3.5+，`而 `0.3.5+` 的中英文文档是不同步的，中文文档是 `0.2.37+` 的版本，如果你出现开发过程中发现一些兼容的问题，此时中文文档是对应不上的，需要查看[英文文档](https://typeorm.io/)。

#### 使用

**第一步**：注册实体，创建 `src/user/user.mongo.entity.ts`

```ts
import { Entity, Column, UpdateDateColumn, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id?: number;

  @Column({ default: null })
  name: string;
}
```

在 `MongoDB` 里面使用的是 `ObjectIdColumn` 作为类似 `Mysql` 的自增主键，来保证数据唯一性，只是类似，并不是跟普通自增主键一样会递增，把它看成 `uuid` 类似即可。

此外应该注意我们创建的实体类文件命名后缀为 `entity.ts`，而在上文数据库连接的配置中有一个 `entities` 参数：

```
entities:[path.join(__dirname, `../../**/*.${MONGODB_CONFIG.entities}.entity{.ts,.js}`)]
```

这个属性配置代表：只要是以 `entity.ts` 结尾的实例类，都会被自动扫描识别，并在数据库中生成对应的实体表。

所以想使用 `Mysql` 又同时想使用自动注册这个功能的话，一定要区分后缀名，不然会出现混乱注册的情况，`mysql` 的配置例如下面所示：

```
MYSQL_CONFIG:
  name: "user-test"
  type: "mysql"
  host: "localhost"
  port: 3306
  username: "xxxx"
  password: "123456"
  database: "user-test"
  entities: "mysql" # 这里的命名一定要跟 MongoDB 里面的配置命名区分开
  synchronize: true
```

> MongoDB 是无模式的，所以即使在配置参数开启了 `synchronize`，启动项目的时候也不会去数据库创建对应的表，所以不用奇怪，并没有出错，但 `Mysql` 在每次应用程序启动时自动同步表结构，容易造成数据丢失，生产环境记得关闭，以免造成无可预计的损失。

**第二步**：创建 `user.providers.ts`：

```ts
import { User } from './user.mongo.entity';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: async (AppDataSource) => await AppDataSource.getRepository(User),
    inject: ['MONGODB_CONNECTION'],
  },
];
```

**第三步**：创建 `user.service.ts`，新增添加用户 `service`：

```ts
import { In, Like, Raw, MongoRepository } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.mongo.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: MongoRepository<User>
  ) { }

  createOrSave(user) {
   return this.userRepository.save(user)
  }
}
```

**第四步**：创建 `user.controller.ts`，添加新增用户的 `http` 请求方法:

```ts
import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AddUserDto } from './user.dto';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @ApiOperation({
    summary: '新增用户',
  })
  @Post('/add')
  create(@Body() user: AddUserDto) {
    return this.userService.createOrSave(user);
  }
}
```

`user.dto.ts` 的内容如下：

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AddUserDto {
  @ApiProperty({ example: 123, })
  id?: string;

  @ApiProperty({ example: 'cookie' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'cookieboty@qq.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'cookieboty' })
  @IsNotEmpty()
  username: string;
}
```

**第五步**：创建 `user.module.ts`，将 `controller`、`providers`、`service` 等都引入后，**切记**将 `user.module.ts` 导入 `app.module.ts` 后才会生效，这一步别忘记了 :

```ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/common/database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProviders } from './user.providers';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [
    UserController
  ],
  providers: [...UserProviders, UserService],
  exports: [UserService],
})
export class UserModule { }
```

完成上述所有步骤之后，此时打开 `Swagger` 文档可以看到，已经创建好了 `/api/user/add` 新增用户的 `http` 接口：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a2ab7e0c5f1468f93b1fe3a445b51eb~tplv-k3u1fbpfcp-watermark.image?)

点击测试能正常得到如下返回值的话，则代表数据插入成功，功能正常：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f96c873a40a4c8da2c2a5570ae82945~tplv-k3u1fbpfcp-watermark.image?)

## Redis

在技术选型中，我们提到了 `Redis` 虽然作为数据库，但是常见的用法是作为统一、高速缓存服务来使用。

在基础功能配置中，使用了 `NestJS` 自带的高速缓存插件 `cache-manager` 来缓存飞书的接口凭证，`cache-manager` 除了提供本地的高速缓存之外，也提供了替换底层缓存服务的能力。

跟我们上文封装的数据库工具一样，`cache-manager` 将底层的多种缓存对接逻辑进行封装，屏蔽底层接口的差异性，对外则提供了一致的 `API` 调用，可以减少接入与理解成本，对于开发者来说可以很方便的把之前的缓存类型由本地替换成 `Redis`。

**第一步**：安装对应的 `cache-manager-redis-store` 依赖

```shell
$ yarn add cache-manager-redis-store
```

**第二步**：`yaml` 中新增 `Redis` 配置参数：

```
REDIS_CONFIG:
  host: "localhost"  # redis 链接
  port: 6379         # redis 端口
  auth: "xxxx"       # redis 连接密码
  db: 1              # redis 数据库
```

**第三步**：改造之前获取环境变量的方法，可以根据传入的变量名获取对应的配置：

```ts
export const getConfig = (type?: string) => {
  const environment = getEnv()
  const yamlPath = path.join(process.cwd(), `./config/${environment}.yaml`)
  const file = fs.readFileSync(yamlPath, 'utf8')
  const config = parse(file)
  if (type) {
    return config[type]
  }
  return config
}
```

**第四步**：修改 `CacheModule` 初始化方法：

```ts
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: getConfig('REDIS_CONFIG').host,
      port: getConfig('REDIS_CONFIG').port,
      auth_pass: getConfig('REDIS_CONFIG').auth,
      db: getConfig('REDIS_CONFIG').db
    })
```

完成上述操作之后，之前业务调用方法不需要做任何额外的改动，就已经完成了 `Redis` 的接入。

可以使用之前的飞书消息推送的接口，正常访问得到如下结果则代表替换完成：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/750d0e0ef5314e828e0d0ae7fe3c9853~tplv-k3u1fbpfcp-watermark.image?)

如果想要查看 `Redis` 的缓存数据，比较简单的方式可以使用 `VSCODE` 带的 `Redis` 插件：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c182110d5bb74431a19d3336ccd4e0c7~tplv-k3u1fbpfcp-watermark.image?)

点击配置 `Redis` 参数直连服务：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d07d3569d64847c8823dc79c3a0fe479~tplv-k3u1fbpfcp-watermark.image?)

输入以下命令即可获取存储的 `token` 内容：

```shell
$ GET APP_TOKEN_CACHE_KEY
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9033d365c8cd4fc59169d1f472c913f0~tplv-k3u1fbpfcp-watermark.image?)

在对接完毕 Redis 之后，即使集群部署服务，都可以使用统一的缓存，也不担心重启服务之后缓存数据丢失的情况。

## 写在最后

本章的内容是后端业务 `CURD` 中最重要的一块 => **数据库相关的内容**，介绍了如何基于 `TypeORM` 封装数据库方法以及使用方法，使用 `user` 进行简单的新增 `demo` 演示，更多 `TypeORM` 与数据库的使用方法在后面的业务开发代码中会结合实例介绍。

另外对 `Redis` 的使用也做了部分介绍，主要是利用了 `cache-manager` 提供的功能，如果用兴趣的话可以使用 `redis` 库按照封装数据库的方式自己封装对应的模块，或者直接使用 `Service` 封装一套缓存的 `API` 也行。

对于此类工具的封装以及使用的方法非常多，看自己的需求以及喜好开发即可，但是在基础建设中一定要切记，如果出现多种底层数据、工具来源，一定要在适配层抹平差异化，对外提供的 `API` 调用保证一致性。

可以参考一下我之前的博客[项目实战|缓存处理](https://juejin.cn/post/6854573211594522631)，对于前端的 `Cookie`、`Storage`、`indexDb` 等多种缓存数据源都做了适配抹平底层接口差异化的处理，业务同学在使用的过程中替换数据源非常简便，学习与开发成本降低很多。

如果你有什么疑问，欢迎在评论区提出，或者加群沟通。 👏
    