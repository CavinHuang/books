
# 工具篇-飞书应用对接
---

## 前言

在上一章中，我们对 **CLI** 创建的基础工程模板添加了一些通用性的功能配置，也能满足大部分业务开发的需求。

在完成了基础配置之后，就可以根据自身团队的情况来开发专属的业务功能，例如团队中使用企业微信、钉钉、飞书等企业工具，可以对接匹配的三方功能。在用户系统中，为了开发便捷以及方便团队的使用，我们可以借助三方登录帮助获取团队和个人的信息。另外上述几个三方软件也提供了很多便捷的功能，例如机器人、消息通知、文档等。

在 [DevOps 小册](https://juejin.cn/book/6948353204648148995)中，使用钉钉作为三方拓展，为了带给大家不一样的学习体验，这次将使用飞书作为用例来完成我们用户、机器人等功能。

## 飞书应用对接

### 创建应用

要利用飞书的功能的话，首先先要去[开放平台](https://open.feishu.cn/app)创建一个飞书应用，如下图所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfe6b0b9245341da933be8c9c2f86091~tplv-k3u1fbpfcp-watermark.image?)

创建完毕之后，需要拿到飞书应用的 **App ID**（应用唯一的 ID 标识） 与 **App Secret**（应用的密钥） 才能调用飞书的 **Open API**。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/348117865caf41b09d9bdd7be54f82b3~tplv-k3u1fbpfcp-watermark.image?)

### 封装底层请求库

虽然 `NestJS` 内置了 `@nestjs/axios` 请求库，但是对于飞书的 `Open API` 封装，我们还是利用之前的模式，不将它与 `NestJS` 过度的耦合在一起。

> 将飞书 **Open Api** 独立封装之后，可以抽成一个工具库，后期可以提供给其他的 `SDK` 使用，如果跟 `NestJS` 耦合过多，想提供给其他 `SDK` 使用的话，就只能提供 `Http` 请求调用的方式，使用起来不太方便。看个人习惯，我倾向使用独立封装的模式。

 1.     添加应用配置，使用上一章节的环境配置功能，在 `yaml` 文件中添加飞书的配置项：

```
FEISHU_CONFIG:
  FEISHU_URL: https://open.feishu.cn/open-apis
  FEISHU_API_HOST: https://open.feishu.cn
  FEISHU_APP_ID: balabalabala
  FEISHU_APP_SECRET: balabalabala
```

> **ID** 与 **Secret** 的信息记得妥善保管，如果你创建的应用权限过高的话，意外泄密可能会导致不可预期的损失，**切记**！

 2.     新建 `utils/request.ts` 文件：

```ts
import axios, { Method } from 'axios';
import { getConfig } from '@/utils';

const { FEISHU_CONFIG: { FEISHU_URL } } = getConfig()

/**
 * @description: 任意请求
 */
const request = async ({ url, option = {} }) => {
  try {
    return axios.request({
      url,
      ...option,
    });
  } catch (error) {
    throw error;
  }
};

interface IMethodV {
  url: string;
  method?: Method;
  headers?: { [key: string]: string };
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

export interface IRequest {
  data: any;
  code: number;
}

/**
 * @description: 带 version 的通用 api 请求
 */
const methodV = async ({
  url,
  method,
  headers,
  params = {},
  query = {},
}: IMethodV): Promise<IRequest> => {
  let sendUrl = '';
  if (/^(http:\/\/|https:\/\/)/.test(url)) {
    sendUrl = url;
  } else {
    sendUrl = `${FEISHU_URL}${url}`;
  }
  try {
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...headers,
        },
        url: sendUrl,
        method,
        params: query,
        data: {
          ...params,
        },
      })
        .then(({ data, status }) => {
          resolve({ data, code: status });
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    throw error;
  }
};

export { request, methodV };
```

> 这里跟之前一样，封装了两种请求方法，一种是植入飞书请求的版本，另一种是自由请求，这个习惯也看个人，如果自己的项目不需要自由请求或者直接使用 `@nestjs/axios` 的请求模块的话，可以把 `request` 方法删除。

3.  创建飞书请求基础层，如下图所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5940e9416a8d4b4aa34c7fb4e0c8edf7~tplv-k3u1fbpfcp-watermark.image?)

上图中封装的模块比较少，只有权限、用户等模块，实际开发中需要按照业务需求选择性封装对应的模块，比如群组、消息、通讯录等等。下面以获取 `Token` 的方法做一个简单的示例：

```ts
import { APP_ID, APP_SECRET } from './const';
import { methodV } from 'src/utils/request';

export type GetAppTokenRes = {
  code: number;
  msg: string;
  app_access_token: string;
  expire: number;
};

export const getAppToken = async () => {
  const { data } = await methodV({
    url: `/auth/v3/app_access_token/internal`,
    method: 'POST',
    params: {
      app_id: APP_ID,
      app_secret: APP_SECRET,
    },
  });
  return data as GetAppTokenRes;
};
```

以上就已经完成了一个独立的飞书应用底层请求层的封装，接下来看如何在业务中使用。

## 调用飞书 API

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ff30c28ef3a46a789afab078648819d~tplv-k3u1fbpfcp-watermark.image?)

飞书的调用文档还是非常详细的，正确的按照上图所示的流程操作，一般出现异常的概率不大。

第 **1**,**2** 步骤，我们已经完成了（应用申请与权限授予），按照步骤 **3** 需要封装 [API 访问凭证](https://open.feishu.cn/document/ukTMukTMukTM/uMTNz4yM1MjLzUzM) 方便后续的调用。

#### 封装 API 访问凭证

根据文档描述，飞书提供了下述 **3** 种访问凭证，分别有不同的用途：

| 访问凭证类型 | 是否需要用户授权 | 是否需要租户管理员授权 | 适用的应用场景 |
| --- | --- | --- | --- |
| app\_access\_token | 不需要 | 不需要 | 纯后台服务等 |
| tenant\_access\_token | 不需要 | 需要 | 网页应用、机器人、纯后台服务等 |
| user\_access\_token | 需要 | 不需要 | 小程序、网页应用等 |

凭证的有效期是 **2** 小时，只有在小于 **30** 分钟的时候调用才会返回新的凭证，否则返回的还是原凭证，所以频繁调用返回的价值不大。

调用三方接口获取凭证后，再使用凭证调用 **API** 的链路过程比较长，同时也可能收网络波动、请求频率的限制，需要将凭证缓存在本地，等有效期小于 **30** 分钟时再去换取新的凭证，减少调用链接、降低请求频率。

`NestJS` 提供了**高速缓存**的插件 `cache-manager`，为对各种缓存存储提供程序提供了统一的 `API`，内置的是内存中的数据存储。

 1.     安装对应的依赖与 `@types`

```shell
$ yarn add cache-manager 
$ yarn add -D @types/cache-manager
```

 2.     再使用的 `Module` 中注册 `CacheModule`，新建 `src/user/user.module.ts`

```ts
import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { FeishuService } from './feishu/feishu.service';
import { FeishuController } from './feishu/feishu.controller';

@Module({
  imports: [
    CacheModule.register(),
  ],
  controllers: [
    FeishuController
  ],
  providers: [FeishuService],
})
export class UserModule { }
```

如果需要在其他地方也使用缓存，但又不想每次都引入 `CacheModule`，也可以在 `app.module.ts` 中引入，跟 `ConfigModule` 开启全局配置即可：

```
CacheModule.register({
  isGlobal: true,
}),
```

在 `yaml` 配置文件中添加缓存 `key` => `APP_TOKEN_CACHE_KEY`，注意如果不添加缓存 `key` 的话，在高速缓存里面可以读取数据，但是在下一章替换 `Redis` 的时候，由于未配置 `key`，程序将使用 `undefined` 读取 `Redis`，导致 `Redis` 报错。

```yaml
APP_TOKEN_CACHE_KEY: APP_TOKEN_CACHE_KEY
```

 3.     新建 `src/user/feishu/feishu.service.ts`

```ts
import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import {
  getAppToken,
  getUserAccessToken,
  getUserToken,
  refreshUserToken,
} from 'src/helper/feishu/auth';
import { Cache } from 'cache-manager';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FeishuService {
  private APP_TOKEN_CACHE_KEY
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {
    this.APP_TOKEN_CACHE_KEY = this.configService.get('APP_TOKEN_CACHE_KEY')
  }

  async getAppToken() {
    let appToken: string;
    appToken = await this.cacheManager.get(this.APP_TOKEN_CACHE_KEY);
    if (!appToken) {
      const response = await getAppToken();
      if (response.code === 0) {
        // token 有效期为 2 小时，在此期间调用该接口 token 不会改变。当 token 有效期小于 30 分的时候,再次请求获取 token 的时候，会生成一个新的 token，与此同时老的 token 依然有效。
        appToken = response.app_access_token;
        this.cacheManager.set(this.APP_TOKEN_CACHE_KEY, appToken, {
          ttl: response.expire - 60,
        });
      } else {
        throw new BusinessException('飞书调用异常')
      }
    }
    return appToken;
  }
}
```

为了和缓存管理器实例进行交互，需要使用 `CACHE_MANAGER` 标记将其注入 `cacheManager` 实例。

`Cache` 的实例 `cacheManager`，拥有 `get`、`set`、`del` 等多个方法，使用起来非常方便，也提供存储缓存过期时间的配置项 `ttl`（位于 `key` 与 `value` 之后的第三个传入参数），可以根据需求自行配置，上述代码就是配置了缓存时间的示例，在换取不到凭证或者本地缓存超时之后才会请求飞书的接口换取新的凭证。

#### 飞书机器人

封装完应用凭证之后就可以使用凭证调用飞书的 Open API，这里我们使用飞书机器人推送消息作为例子给大家演示一下。

1.  首先需要开启机器人的能力。 ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b07f7db3b604a5db992049e0e3447ef~tplv-k3u1fbpfcp-watermark.image?)

2.  发布应用并选择应用使用范围，如果不在应用可用范围的用户，机器人是没办法推送消息的。 ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7a9bee8fb874984850c08acf70cfb22~tplv-k3u1fbpfcp-watermark.image?)

3.  封装机器人发送消息对应的 API。

发送消息的接口为 <https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=[]> ，可用根据以下几种类型发送消息给指定的用户或群组：

`Query 参数 receive_id_type` **可选值**：

- `open_id`：以 open\_id 来识别用户\([什么是 Open ID](https://open.feishu.cn/document/home/user-identity-introduction/open-id)\) 。
- `user_id`：以 user\_id 来识别用户，需要有获取用户 userID 的权限 \([什么是 User ID](https://open.feishu.cn/document/home/user-identity-introduction/user-id)\)。
- `union_id`：以 union\_id 来识别用户\([什么是 Union ID](https://open.feishu.cn/document/home/user-identity-introduction/union-id)\)。
- `email`：以 email 来识别用户，是用户的真实邮箱。
- `chat_id`：以 chat\_id 来识别群聊，群 ID 说明请参考：[群ID 说明](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/chat-id-description) 。

根据发送用户与信息的类型有如下几种参数。

`Body` **参数**：

| 名称 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| receive\_id | string | 是 | 依据 receive\_id\_type 的值，填写对应的消息接收者 id**示例值**："ou\_7d8a6e6df7621556ce0d21922b676706ccs" |
| content | string | 是 | 消息内容，json 结构序列化后的字符串。不同msg\_type对应不同内容。消息类型 包括：text、post、image、file、audio、media、sticker、interactive、share\_chat、share\_user等，具体格式说明参考：[发送消息content说明](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/im-v1/message/create_json) |
| msg\_type | string | 是 | 消息类型 包括：text、post、image、file、audio、media、sticker、interactive、share\_chat、share\_user等，类型定义请参考[发送消息content说明](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/im-v1/message/create_json) |

根据上述的接口描述，可用封装如下的函数：

```ts
import { methodV } from 'src/utils/request';

export enum RECEIVE_TYPE { 'open_id', 'user_id', 'union_id', 'email', 'chat_id' }

export enum MSG_TYPE { text, post, image, file, audio, media, sticker, interactive, share_chat, share_user}

type MESSAGES_PARAMS = {
  receive_id: string
  content: string
  msg_type: MSG_TYPE
}

export const messages = async (receive_id_type: RECEIVE_TYPE, params: MESSAGES_PARAMS, app_token: string) => {
  console.log(receive_id_type, params, app_token)

  const { data } = await methodV({
    url: `/im/v1/messages`,
    method: 'POST',
    query: { receive_id_type },
    params,
    headers: {
      Authorization: `Bearer ${app_token}`,
    },
  });
  return data;
};
```

 4.     开发对应的 `Service`。

```ts
  async sendMessage(receive_id_type, params) {
    const app_token = await this.getAppToken()
    return messages(receive_id_type, params, app_token as string)
  }
```

注意：这里的 `app_token` 获取方式使用上述封装好的访问凭证方法，带有缓存的版本。

 5.     开发对应的 `Controller` 以及 `Dto`。

```ts
import { Body, Controller, Post, } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeishuService } from './feishu.service';
import { FeishuMessageDto } from './feishu.dto';

@ApiTags('飞书')
@Controller('feishu')
export class FeishuController {
  constructor(private readonly feishuService: FeishuService) { }
  
  @ApiOperation({
    summary: '消息推送',
  })
  @Post('sendMessage')
  sendMessage(@Body() params: FeishuMessageDto) {
    const { receive_id_type, ...rest } = params
    return this.feishuService.sendMessage(receive_id_type, rest);
  }
}
```

```ts
import { RECEIVE_TYPE, MSG_TYPE } from '@/helper/feishu/message';
import { ApiProperty } from '@nestjs/swagger';

export class FeishuMessageDto {
  @ApiProperty({ example: 'email'})
  receive_id_type: RECEIVE_TYPE

  @ApiProperty({ example: 'cookieboty@qq.com' })
  receive_id?: string

  @ApiProperty({ example: '{\"text\":\" test content\"}' })
  content?: string

  @ApiProperty({ example: 'text', enum: MSG_TYPE })
  msg_type?: keyof MSG_TYPE
}
```

6.  正常导入 `Module` 之后，打开 `swagger` 可以看到对应的接口信息。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8dd231ebdd648129c393dd01fc3c1e2~tplv-k3u1fbpfcp-watermark.image?)

7.  点击 **Try it out** 发送测试信息，如果按照步骤一路下来的话，应该能正常收到飞书机器人推送的消息了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eca80f9932d048e9b049c41d8515e29b~tplv-k3u1fbpfcp-watermark.image?)

以上就完成了飞书机器人推送消息的开发，大家可以发挥自己的想象，看在什么场景需要推送消息，例如：`CICD`、安全预警、流程流转、`Bug` 通知等等各种场景推送。

同时，飞书机器的消息有很多个性化的设计，例如卡片消息、富文本、语音等等，卡片消息飞书也提供了[可视化搭建的工具](https://open.feishu.cn/tool/cardbuilder)，非常方便定制化一套漂亮的卡片消息：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6608a7fe10e446449f548bdb2056c80f~tplv-k3u1fbpfcp-watermark.image?)

#### 完善体验

前面的流程都是正常请求，接下来我们看下非正常请求。首先，将 `receive_id_type` 的类型改成 `email2`，这个参数没有存在于飞书文档中提供的参数类型中，然后请求接口：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/825fe40a83e746b79e9256a51d5e70a9~tplv-k3u1fbpfcp-watermark.image?)

可以看到，返回的接口是业务性质的通用报错 503，但我们已经预先知道了请求参数类型有几种，这种错误可以在请求飞书之后就预先校验出来，减少请求次数同时给予用户正确的反馈，我们可以借助 `class-validator` 来做入参校验：

 1.     安装 `class-validator` 相关的依赖。

```shell
$ yarn add class-validator class-transformer
```

 2.     `main.ts` 添加 `ValidationPipe` 验证管道，从 `@nestjs/common` 导出。

```ts
  // 启动全局字段校验，保证请求接口字段校验正确。
  app.useGlobalPipes(new ValidationPipe());
```

 3.     使用 `class-validator` 内置的验证装饰器对需要验证的 Dto 参数添加校验。

```ts
export class FeishuMessageDto {
  @IsNotEmpty()
  @IsEnum(RECEIVE_TYPE)
  @ApiProperty({ example: 'email' })
  receive_id_type: RECEIVE_TYPE

  @IsNotEmpty()
  @ApiProperty({ example: 'cookieboty@qq.com' })
  receive_id?: string

  @IsNotEmpty()
  @ApiProperty({ example: '{\"text\":\" test content\"}' })
  content?: string

  @IsNotEmpty()
  @IsEnum(MSG_TYPE)
  @ApiProperty({ example: 'text'})
  msg_type?: keyof MSG_TYPE
}
```

我们使用了 `IsNotEmpty`（禁止传空）以及 `IsEnum`\(参数必须是有效的枚举）来约束前端传参数，然后一起来看看效果：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfcfaad80df64c5880949e773fe0f2bd~tplv-k3u1fbpfcp-watermark.image?)

如上图所示，由于 `email2` 并不存在于之前定义好的枚举 `RECEIVE_TYPE` 里面，所以在参数校验的时候就被拦截并且返回了具体的错误信息 `receive_id_type must be a valid enum value`，对于前端传参数与错误提示比较友好。

内置的验证装饰器非常多，下面只是简单的一些例子，更多的装饰器可以[翻阅文档](https://github.com/typestack/class-validator)

| 装饰器 | 描述 |
| --- | --- |
| **常见的验证装饰器** |  |
| `@IsDefined(value: any)` | 检查值是否已定义（\!== undefined, \!== null）。这是唯一忽略 skipMissingProperties 选项的装饰器。 |
| `@IsOptional()` | 检查给定值是否为空（=== null，=== undefined），如果是，则忽略该属性上的所有验证器。 |
| `@Equals(comparison: any)` | 检查值是否等于 \("==="\) 比较。 |
| `@NotEquals(comparison: any)` | 检查值是否不等于 \("\!=="\) 比较。 |
| `@IsEmpty()` | 检查给定值是否为空（=== ''、=== null、=== 未定义）。 |
| `@IsNotEmpty()` | 检查给定值是否不为空（！== ''，！== null，！== undefined）。 |
| `@IsIn(values: any[])` | 检查值是否在允许值的数组中。 |
| `@IsNotIn(values: any[])` | 检查 value 是否不在不允许的值数组中。 |
| **类型验证装饰器** |  |
| `@IsBoolean()` | 检查值是否为布尔值。 |
| `@IsDate()` | 检查值是否为日期。 |
| `@IsString()` | 检查字符串是否为字符串。 |
| `@IsNumber(options: IsNumberOptions)` | 检查值是否为数字。 |
| `@IsInt()` | 检查值是否为整数。 |
| `@IsArray()` | 检查值是否为数组 |
| `@IsEnum(entity: object)` | 检查值是否是有效的枚举 |

4.  完成了参数校验后，还剩下最后一步，先看下现在的文档描述。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db00ae1e05024339b3a14e9fe61609e2~tplv-k3u1fbpfcp-watermark.image?)

从上述页面中可以看出，接口字段描述使用 `enum` 类型在展示上并不直观，对接的前端同学无法感知到底用了什么、需要传什么值才能符合要求，这个可以使用 `Swagger` 中 `ApiProperty` 的 `enum` 参数，来让文档识别出对应的枚举参数：

```ts
  @IsNotEmpty()
  @IsEnum(RECEIVE_TYPE)
  @ApiProperty({ example: 'email', enum: RECEIVE_TYPE })
  receive_id_type: RECEIVE_TYPE
```

配置完毕之后可以看到 `Swagger` 的字段描述也能将对应的枚举正确显示了

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7fa969b31964fa3b43b1bcc264dc4b9~tplv-k3u1fbpfcp-watermark.image?)

## 写在最后

本章以**对接飞书应用**完成了一个简单的业务后端需求开发，包括飞书 **Open Api** 的对接以及**NestJs** 的缓存、`Controller`、`Service` 等模块的开发，从小的需求逐步熟悉 `NestJs` 框架的开发模式与后端业务开发逻辑。

飞书的三方应用还提供了很多额外的外部接口，例如飞书文档、组织架构（人员信息管理）、审批等等都是非常有用处的功能，在接下去的用户系统中我们就会使用组织架构中的接口作为自建用户系统的底层数据与三方登录。

大家可以根据自己团队的需求选择对应的模块来减少开发工作量，比如审批的任务流开发就非常麻烦，就算有开源的插件集成，还是需要额外对接消息通知。而直接利用飞书提供的审批接口不仅能减少代码量、提高开发效率同时也打通飞书的交互，给用户最小的心智学习成本。

如果你有什么疑问，欢迎在评论区提出或者加群沟通。 👏
    