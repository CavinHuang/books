
# 配置篇-基础功能配置
---

## 前言

在上一章节中，我们学习了 `NestJS CLI` 的用法，得到了一套基础的项目工程。最开始做项目对比的时候也提到过，`NestJS` 作为一款**自定义程度较高**的框架，`CLI` 直接提供的基础功能并不是完善，但是同时也为开发者提供了非常多的内置或配套的功能例如**高速缓存、日志拦截、过滤器、微服务**等多种模块，方便开发者根据自身的业务需求定制适合当前业务的工程。

本章将根据业务需求或者团队规范，选择对应的模块搭建出一个符合要求的通用性脚手架。

## Fastify

对于网关系统来说，无论是资源还是 `API` 接口数据，它都将承担所有的请求转发，虽然外层可以有 `Nginx` 做负载均衡策略，但如果框架本身的性能越好，业务实现的效果就会越好，同时对业务代码要求也可以稍微降低一点。

> 框架或者语言带来的性能提升还是非常重要的。可以给大家举一个明显的例子，**Windows** 自带的 `VBS` 脚本可以操作 **Excel**，`Java` 或者其他语言框架也可以操作 **Excel**。但是，其他语言的操作效率会远超 `VBS`，即使是在操作更为复杂或者文件读写内容更多的情况下。这里我们并不去深究为什么其他语言的速度会更快，但是对于一个快速迭代的业务项目或者小团队来说，选择效率高、性能高的框架作为开发语言无疑是降低整体成本最好的一种方式。

而 `Nest` 作为一个上层框架，可以通过适配器模式使得底层可以兼容任意 `HTTP` 类型的 `Node` 框架，本身内置的框架有两种 [Express](https://expressjs.com/) 与 [Fastify](https://www.fastify.io/)。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3aaf3b9e3b64b6ca5bd0afb3d7b1d4b~tplv-k3u1fbpfcp-watermark.image?)

如上图所示，`Fastify` 与其他主流 `HTTP` 框架对比，其在 **QPS**\(**并发处理请求**\)的效率上要远超其他框架，达到了几乎两倍的基准测试结果，所以在网关系统这个对性能要求非常高的项目中使用 `Fastify` 无疑是一种非常好的选择。

> 当然具体的性能开销、优化大部分还是依赖业务复杂度以及代码质量，框架能够提供的是只是一层基础架构。能从这层架构上搭建出什么样的产品，取决于开发者自身。同时，我并不是鼓励所有的项目都使用 `Fastify`，在业务复杂度以及对性能要求并非十分敏感的项目中，`Express` 也是一种非常好的选择，作为老牌的框架，它经历了非常多的大型项目实战的考验以及长期的迭代，使得 `Express` 社区生态非常的丰富，遇到任何的问题都可以快速找到解决方案，这也是为什么 `NestJS` 采用 `Express` 作为默认基础框架的原因。

介绍完 `Fastify` 的优势之后，接下来我们开始着手改造模板项目框架。首先，通过 `CLI` 默认生成的项目框架中，底层平台使用的是 `Express`，代码如下所示：

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

毕竟 `Fastify` 作为唯二内置的平台，整体的替换过程会非常顺畅。首先，安装对应的适配器依赖 `@nestjs/platform-fastify`。其次，使用 `FastifyAdapter` 替换默认的 `Express` 。

```ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3000);
}
bootstrap();
```

## 版本控制

之前学习过 **DevOps** 小册的同学，应该对 [Gitlab OpenApi](https://docs.gitlab.com/ee/api/) 比较熟悉，肯定也使用过这样的请求 **<https://gitlab.example.com/api/v4/projects>** ，可以看出链接上面是带 v4 版本的。

因为我们有两种项目分别是**物料**与**用户**，这两款系统作为基础应用，后期也会对其他的项目提供类似的 Open Api，同时避免不了升级之后，需要兼容老项目的情况。此时就会存在多种版本的 Api，所以我们也在工程添加版本控制来避免未来升级的时候，造成其他系统崩溃的情况。

#### 单个请求控制

**第一步**：在 `main.ts` 启用版本配置：

```ts
  // 接口版本化管理
  app.enableVersioning({
    type: VersioningType.URI,
  });
```

**第二步**：启用版本配置之后再在 `Controller` 中请求方法添加对应的版本号装饰器：

```ts
import { Controller, Version } from '@nestjs/common';

  @Get()
  @Version('1')
  findAll() {
    return this.userService.findAll();
  }
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2015a74a73e04d32a9672c9a46e508c8~tplv-k3u1fbpfcp-watermark.image?)

配置完毕之后从上图可以看到，只有携带了版本号的请求 `http://localhost:3000/v1/user ` 能正常返回数据，而之前未携带版本号的请求 `http://localhost:3000/user` 返回了 404 错误。

除了针对某一个请求添加版本之外，同样也可以添加全局以及整个 `Controller` 的版本，具体的版本配置规则可以根据自己的实际需求取舍。

#### 全局配置请求控制

**第一步**：修改 `enableVersioning` 配置项：

```ts
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
```

**第二步**：修改 `Controller` 的配置，在 `Controller` 装饰器中添加 `version` 属性：

```
@Controller({
  path: 'user',
  version: '1',
})
```

完成上述的操作就可以对一整个 `Controller` 进行版本控制。但有的时候，我们需要做针对一些接口做兼容性的更新，而其他的请求是不需要携带版本，又或者请求有多个版本的时候，而默认请求想指定一个版本的话，我们可以在 `enableVersioning` 添加 `defaultVersion` 参数达到上述的要求：

```ts
  app.enableVersioning({
    defaultVersion: [VERSION_NEUTRAL, '1', '2']
  });
```

```ts

  @Get()
  @Version([VERSION_NEUTRAL, '1'])
  findAll() {
    return this.userService.findAll();
  }

  @Get()
  @Version('2')
  findAll2() {
    return 'i am new one';
  }
```

接下来访问对应的请求可以获取到如下的返回值：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/38d458d6dedc49a7949b5cd0d84def5b~tplv-k3u1fbpfcp-watermark.image?)

## 全局返回参数

在配置版本的过程中，也不断地测试了很多次接口，不难发现返回的接口数据非常的不标准，在一个正常的项目中不太合适用这种数据结构返回，毕竟这样对前端不友好，也不利于前端做统一的拦截与取值，所以需要格式化请求参数，输出统一的接口规范。

一般正常项目的返回参数应该包括如下的内容：

```json
{

    data, // 数据
    status: 0, // 接口状态值
    extra: {}, // 拓展信息
    message: 'success', // 异常信息
    success：true // 接口业务返回状态
}
```

想要输出上述标准的返回参数格式的话：

**第一步**：新建 `src/common/interceptors/transform.interceptor.ts` 文件：

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        status: 0,
        extra: {},
        message: 'success',
        success: true,
      })),
    );
  }
}
```

**第二步**：修改 `main.ts` 文件，添加 `useGlobalInterceptors` 全局拦截器，处理返回值

```
// 统一响应体格式
app.useGlobalInterceptors(new TransformInterceptor());
```

然后我们再次访问之前的请求，就能获取到标准格式的接口返回值了：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/826099eac0d4471b922d919d64e6040e~tplv-k3u1fbpfcp-watermark.image?)

## 全局异常拦截

再处理完毕正常的返回参数格式之后，对于异常处理也应该同样做一层标准的封装，这样利于开发前端的同学统一处理这类异常错误。

**第一步**：新建 `src/common/exceptions/base.exception.filter.ts` 与 `http.exception.filter.ts` 两个文件，从命名中可以看出它们分别处理**统一异常**与 `HTTP` 类型的接口相关异常。

`base.exception.filter` => **`Catch` 的参数为空时，默认捕获所有异常**

```ts
import { FastifyReply, FastifyRequest } from "fastify";

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ServiceUnavailableException,
  HttpException,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    request.log.error(exception)

    // 非 HTTP 标准异常的处理。
    response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: new ServiceUnavailableException().getResponse(),
    });
  }
}
```

`http.exception.filter.ts` => `Catch` 的参数为 `HttpException` 将只捕获 `HTTP` 相关的异常错误

```ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.getResponse(),
    });
  }
}
```

**第二步**：在 `main.ts` 文件中添加 `useGlobalFilters` 全局过滤器：

```ts
  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
```

> **这里一定要注意引入自定义异常的先后顺序，不然异常捕获逻辑会出现混乱**。

完成上述操作之后开始检验是否配置正常。首先访问一个不存在的接口 `http://localhost:3000/test` ，此时可以对比自定义与原生的异常返回参数区别。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0b8f5e7f9b24dcaacf33ab10d88f613~tplv-k3u1fbpfcp-watermark.image?)

验证完 `HTTP` 异常之后，我们接着伪造一个程序运行异常，来验证常规异常是否能被正常捕获：

```
  @Get()
  @Version([VERSION_NEUTRAL, '1'])
  findAll() {
    const a: any = {}
    console.log(a.b.c)
    return this.userService.findAll();
  }
```

再次访问 `http://localhost:3000/user` ，此时可以看到原生与自定义返回的异常错误存在一定的区别了。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98d4b49c1c72486d8bdb2406a3b2c5b3~tplv-k3u1fbpfcp-watermark.image?)

除了全局异常拦截处理之外，我们需要再新建一个 `business.exception.ts` 来处理业务运行中预知且主动抛出的异常：

```ts
import { HttpException, HttpStatus } from '@nestjs/common';
import { BUSINESS_ERROR_CODE } from './business.error.codes';

type BusinessError = {
  code: number;
  message: string;
};

export class BusinessException extends HttpException {
  constructor(err: BusinessError | string) {
    if (typeof err === 'string') {
      err = {
        code: BUSINESS_ERROR_CODE.COMMON,
        message: err,
      };
    }
    super(err, HttpStatus.OK);
  }

  static throwForbidden() {
    throw new BusinessException({
      code: BUSINESS_ERROR_CODE.ACCESS_FORBIDDEN,
      message: '抱歉哦，您无此权限！',
    });
  }
}
```

```ts
/*
 * @Author: Cookie
 * @Description: business.error.codes
 */
export const BUSINESS_ERROR_CODE = {
  // 公共错误码
  COMMON: 10001,

  // 特殊错误码
  TOKEN_INVALID: 10002,

  // 禁止访问
  ACCESS_FORBIDDEN: 10003,

  // 权限已禁用
  PERMISSION_DISABLED: 10003,

  // 用户已冻结
  USER_DISABLED: 10004,
};

```

简单改造一下 `HttpExceptionFilter`，在处理 `HTTP` 异常返回之前先处理业务异常：

```ts
    // 处理业务异常
    if (exception instanceof BusinessException) {
      const error = exception.getResponse();
      response.status(HttpStatus.OK).send({
        data: null,
        status: error['code'],
        extra: {},
        message: error['message'],
        success: false,
      });
      return;
    }
```

> 由于异常拦截的返回函数使用的是 `Fastify` 提供的，所以我们使用的返回方法是 `.send（）`，如果你没有使用 `Fastify` 作为 `HTTP` 底层服务的话，拦截返回的方法要保持跟官网一致（官网默认的是 `Express` 的框架，所以返回方法不一样）。

完成配置之后，我们再继续伪造一个业务异常的场景：

```ts
  @Get()
  @Version([VERSION_NEUTRAL, '1'])
  findAll() {
    const a: any = {}
    try {
      console.log(a.b.c)
    } catch (error) {
      throw new BusinessException('你这个参数错了')
    }
    return this.userService.findAll();
  }
```

访问接口 `http://localhost:3000/user` （~~这个接口是老演员了~~），可以看到能够返回我们预期的错误了。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79719ad2bb394e72897aa8d95adae77d~tplv-k3u1fbpfcp-watermark.image?)

> 自定义业务异常的优点在于，当你的业务逻辑复杂到一定的地步，在任意的一处出现可预知的错误，此时可以直接抛出异常让用户感知，不需要写很多冗余的返回代码。

## 环境配置

一般在项目开发中，至少会经历过 `Dev` \-> `Test` \-> `Prod` 三个环境。如果再富余一点的话，还会再多一个 `Pre` 环境。甚至在不差钱的情况下，每个环境可能都会有**多套配置**。那么对应的使用的数据库、`Redis` 或者其他的配置项都会随着环境的变换而改变，所以在实际项目开发中，多环境的配置非常必要。

#### 自带环境配置

`NestJS` 本身也自带了多环境配置方法

 1.     安装 `@nestjs/config`

```
$ yarn add  @nestjs/config
```

 2.     安装完毕之后，在 `app.module.ts` 中添加 `ConfigModule` 模块

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

`@nestjs/config` 默认会从**项目根目录**载入并解析一个 `.env` 文件，从 `.env` 文件和 `process.env` 合并环境变量键值对，并将结果存储到一个可以通过 `ConfigService` 访问的私有结构。

`forRoot()` 方法注册了 `ConfigService` 提供者，后者提供了一个 `get()` 方法来读取这些**解析/合并**的配置变量。

> 当一个键同时作为环境变量（例如，通过操作系统终端如`export DATABASE_USER=test`导出）存在于运行环境中以及`.env`文件中时，以运行环境变量优先。

默认的 `.env` 文件变量定义如下所示:

```
DATABASE_USER=test
DATABASE_PASSWORD=test
```

#### 自定义 YAML

虽然 `Nest` 自带了环境配置的功能，使用的 [dotenv](https://github.com/motdotla/dotenv) 来作为默认解析，但默认配置项看起来并不是非常清爽，我们接下来使用结构更加清晰的 `YAML` 来覆盖默认配置。

> 想要了解 `YAML` 更多细节的同学可以点击[链接](https://baike.baidu.com/item/YAML/1067697)看下，如果使用过 `Gitlab CICD` 的同学，应该对 `.yml` 文件比较熟悉了，这里就不对 `YAML` 配置文件做过多的阐述了。

 1.     在使用自定义 `YAML` 配置文件之前，先要修改 `app.module.ts` 中 `ConfigModule` 的配置项 `ignoreEnvFile`，禁用默认读取 `.env` 的规则：

```
ConfigModule.forRoot({ ignoreEnvFile: true, });
```

 2.     然后再安装 `YAML` 的 `Node` 库 `yaml`：

```
$ yarn add yaml
```

3.  安装完毕之后，在根目录新建 `.config` 文件夹，并创建对应环境的 `yaml` 文件，如下图所示：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71e2c740648641b499440a0bd0038e31~tplv-k3u1fbpfcp-watermark.image?)

 4.     新建 `utils/index.ts` 文件，添加读取 `YAML` 配置文件的方法：

```ts
import { parse } from 'yaml'
const path = require('path');
const fs = require('fs');

// 获取项目运行环境
export const getEnv = () => {
  return process.env.RUNNING_ENV
}

// 读取项目配置
export const getConfig = () => {
  const environment = getEnv()
  const yamlPath = path.join(process.cwd(), `./.config/.${environment}.yaml`)
  const file = fs.readFileSync(yamlPath, 'utf8')
  const config = parse(file)
  return config
}
```

 5.     最后添加自定义配置项即可正常使用环境变量：

```
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig]
    }),
```

> 注意：`load` 方法中传入的 `getConfig` 是一个函数，并不是直接 JSON 格式的配置对象，直接添加变量会报错。

#### 使用自定义配置

完成之前的配置后，就可以使用 `cross-env` 指定运行环境来使用对应环境的配置变量。

 1.     修改启动命令：

```
"start:dev": "cross-env RUNNING_ENV=dev nest start --watch",
```

在我们之前创建好的 `UserController` 中添加 `ConfigService` 以及新的请求：

```ts

export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) { }

  @Get('getTestName')
  getTestName() {
    return this.configService.get('TEST_VALUE').name;
  }
}
```

接下来访问 `http://localhost:3000/v1/user/getTestName ` 能看到已经能够根据环境变量拿到对应的值：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc2fc65526944018b70040715cbcb340~tplv-k3u1fbpfcp-watermark.image?)

> 这里应该注意到，我们并没有注册 `ConfigModule`。这是因为在 `app.module` 中添加 `isGlobal` 属性，开启 `Config` 全局注册，如果 `isGlobal` 没有添加的话，则需要先在对应的 `module` 文件中注册后才能正常使用 `ConfigService`。

## 热重载

`NestJS` 的 `dev` 模式是将 `TS` 代码编译成 `JS` 再启动，这样每次我们修改代码都会重复经历一次编译的过程，在项目开发初期，业务模块体量不大的情况下，性能开销并不会有很大的影响，但是在业务模块增加到一定数量时，每一次更新代码导致的重新编译就会异常痛苦。为了避免这个情况，`NestJS` 也提供了热重载的功能，借助 `Webpack` 的 `HMR`，使得每次更新只需要替换更新的内容，减少编译的时间与过程。

> 注意：`Webpack`并不会自动将（例如 `graphql` 文件）复制到 `dist` 文件夹中。同理，`Webpack` 与静态路径（例如 `TypeOrmModule` 中的 `entities` 属性）不兼容。所以如果有同学跳过本章，直接配置了 `TypeOrmModule` 中的 `entities`，反过来再直接配置热重载会导致启动失败。

由于我们是使用 `CLI` 插件安装的工程模板，可以直接使用 `HotModuleReplacementPlugin` 创建配置，减少工作量。

 1.     照例安装所需依赖：

```
$ yarn add webpack-node-externals run-script-webpack-plugin webpack
```

 2.     根目录新建 `webpack-hmr.config.js` 文件，复制下述代码：

```javascript
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/.js$/, /.d.ts$/],
      }),
      new RunScriptWebpackPlugin({ name: options.output.filename }),
    ],
  };
};
```

 3.     修改 `main.ts`，开启 `HMR` 功能：

```ts
declare const module: any;

async function bootstrap() {
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
```

 4.     修改启动脚本启动命令即可：

```
"start:hot": "cross-env RUNNING_ENV=dev nest build --webpack --webpackPath webpack-hmr.config.js --watch"
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7b960fe772e404cbac3276e5e167db9~tplv-k3u1fbpfcp-watermark.image?)

然后修改一段简单的代码（随意修改即可），测试一下热更新的是否正常生效：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/659b2d68c1d145d1b3a7f5bfff96ee98~tplv-k3u1fbpfcp-watermark.image?)

如上图所示，我们已经开启了 `HMR` 功能，具体什么时候使用可以根据自己的项目以及喜好开启，如果没有使用 `CLI` 创建的工程模板，但也想开启 `HMR` 功能的话，可以根据[文档](https://docs.nestjs.cn/8/recipes?id=%e6%b2%a1%e6%9c%89%e4%bd%bf%e7%94%a8-cli) 自行配置。

## 文档

作为一个后端服务，**API** 文档是必不可少的，除了接口描述、参数描述之外，自测也十分方便。`NestJS` 自带了 `Swagger` 文档，集成非常简单，接下来进行文档的配置部分。

 1.     工程之前使用了 `fastify` 所以需要安装以下依赖：

```
$ yarn add @nestjs/swagger fastify-swagger
```

 2.     依赖安装完毕之后，先创建 `src/doc.ts` 文件：

```ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as packageConfig from '../package.json'

export const generateDocument = (app) => {

  const options = new DocumentBuilder()
    .setTitle(packageConfig.name)
    .setDescription(packageConfig.description)
    .setVersion(packageConfig.version)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/api/doc', app, document);
}
```

> 为了节约配置项，`Swagger` 的配置信息全部取自 `package.json`，有额外需求的话可以自己维护配置信息的文件。

 4.     在 `main.ts` 中引入方法即可：

```ts
  // 创建文档
  generateDocument(app)
```

完成上述内容之后，浏览器打开 `http://localhost:3000/api/doc ` 就能看到 `Swagger` 已经将我们的前面写好的接口信息收集起来了。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e233a3ccde94463f87556955b5c4d5a4~tplv-k3u1fbpfcp-watermark.image?)

> 从上图可以看出，`Swagger` 会默认收集我们的接口信息，但是没有描述与分类，使用上很不方便，由于使用过程中的细节较多，具体的配置细节可以从[官网文档](https://docs.nestjs.cn/8/recipes?id=swagger)获取。

## 写在最后

本章主要介绍了，对 `CLI` 创建的标准工程模板进行一些常规项目必备的功能配置，例如替换底层 `Http` 框架、环境变量配置等等内容。

添加了上述**通用性基础配置**后的工程模板能基本满足一个小型的业务需求功能，如果还有其他要求的话可以增减功能或者修改某些配置来适配，总体还是看**团队自身的业务需求进行定制**，比如团队中有`统一权限控制的插件`或者`构建服务的脚本`都可以放在工程模板中，方便其他同学开箱即用。

现在，我们已经对 `NestJS` 有了初步了解。下一章，我们将正式使用 `NestJS` 开发业务需求。

如果你有什么疑问，欢迎在评论区提出或者加群沟通。 👏
    