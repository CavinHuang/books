
# Node 工具篇 - 全局与工具类
---

## 前言

上一章学习了如何将 GitLab Api 封装成工具类作为后期业务开发的基础。

除了 GitLab 工具类之外，实际开发中还会需要一些额外的工具类辅助开发，可以预先将这些工具类封装好，业务开发的时候效率更高。

本章会介绍其他的一些全局与工具类的开发与使用。

## 封装基础 Controller

上一章中，用户的业务 Controller 是继承了 BaseController 而不是直接继承 Egg 的 Controller，这是因为使用了运用继承的原理，对 Controller 做一层基础的封装，内置一些常用的功能，比如获取用户信息、全局返回参数等。

```js
import { Controller } from "egg";

export default class BaseController extends Controller {
  get user() {
    return this.ctx.user;
  }

  success(data) {
    this.ctx.body = {
      code: 0,
      data,
    };
  }

  error({ code, data, message }) {
    // 根据业务返回不同的错误 code，提供给前端做业务判断处理
    this.ctx.body = {
      code,
      data,
      message,
    };
  }
}
```

定义全局返回参数基础类之后，业务 Controller 继承基础类，业务类可以根据条件判断使用 success 或 error 方法，前端可以根据返回的 code 值进行业务判断。如果项目中还需要其他的额外处理，可以继续添加或者创建多个基础类。**合理利用继承的优势，可以提高代码质量**。

## 添加全局报错拦截

没有绝对安全的程序，所有程序在运行中可能因各种情况会出现异常，但有些情况并不需要将所有的报错内容直接抛给前端，展示给用户，所以全局错误回调是基础模块必要的。

全局错误拦截常用两种方式：

#### 框架内置异常处理

Egg 框架自带的 onerror 插件支持自定义配置错误处理方法，可以覆盖默认的错误处理方法，需要的话可以根据实际业务重写。

```js
// config/config.default.js
module.exports = {
  onerror: {
    all(err, ctx) {
      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      ctx.body = 'error';
      ctx.status = 500;
    },
    html(err, ctx) {
      // html hander
      ctx.body = '<h3>error</h3>';
      ctx.status = 500;
    },
    json(err, ctx) {
      // json hander
      ctx.body = { message: 'error' };
      ctx.status = 500;
    },
  },
};
```

#### 异常中间件

除了使用框架自带的 onerror 插件之外，也可以使用自定义中间件拦截所有请求，采用用 try/catch 统一捕获错误。

新建文件 `app/middleware/error_handler.ts`, 复制下述代码

```js
export default class HttpExceptions extends Error { // 继承修改 error 类型
  code: number;
  msg: string;
  httpCode: number;

  constructor({ msg = "服务器异常", code = 1, httpCode = 400 }) {
    super();
    this.msg = msg;
    this.code = code;
    this.httpCode = httpCode;
  }
}

import HttpExceptions from "../exceptions/http_exceptions"; // 全局拦截错误处理

export default () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit("error", err, ctx);

      let status = err.status || 500;
      let error: any = {};

      if (err instanceof HttpExceptions) {
        status = err.httpCode;
        error.requestUrl = `${ctx.method} : ${ctx.path}`;
        error.msg = err.msg;
        error.code = err.code;
        error.httpCode = err.httpCode;
      } else {
        // 未知异常，系统异常，线上不显示堆栈信息
        // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
        error.code = 500;
        error.errsInfo =
          status === 500 && ctx.app.config.env === "prod"
            ? "Internal Server Error"
            : err.message;
      }
      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = error;
      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
};
```

如上，添加错误中间件拦截全局异常，如果出现自定义异常抛出的时候，则处理全局异常，否则统一抛出 500 错误，去除敏感信息。自定义中间件的使用下一章的 jwtAuth 插件。

## 消息通知

项目中会有各种流程节点，比如发布状态、测试反馈、流程流转等等，如果只在 web 界面中展示状态变更，显然是不及时，可以先将消息通知的工具类开发完，后期业务侧可以直接调用。

#### 邮件推送

一般邮件是正式沟通交流的方式，例如状态流转比如提测、正式发布上线、测试打回等跟项目流程相关的内容，需要使用邮件通知。

1.  发送邮件使用 [nodemailer](https://nodemailer.com/about/)
2.  邮件模板使用 [nunjucks](https://nunjucks.bootcss.com/) 模板引擎，配置邮件模板
3.  邮件前端自定义内容使用 [marked](https://www.npmjs.com/package/marked) 插件解析 markdown 语法

nodemailer 发送邮件工具类封装

```js
import { MAIL_CONFIG } from "../../config/default.config";

const marked = require("marked"); // marked 转换
const nodemailer = require("nodemailer"); // 发送邮件
const nunjucks = require("nunjucks"); // 模板引擎
const path = require("path");

// 邮箱配置初始化
const transporter = nodemailer.createTransport({
  host: MAIL_CONFIG.service,
  secureConnection: true, // 使用 SSL 方式（安全方式，防止被窃取信息）
  port: MAIL_CONFIG.port,
  auth: {
    user: MAIL_CONFIG.user_email, // 账号
    pass: MAIL_CONFIG.auth_code, // 授权码
  },
});

const htmlModel = ({ storyMail, exitInfo, summitUser, iterationMail }) => {
  const html = nunjucks.render(path.join(__dirname, "./emailTpl/email.njk"), {
    storyMail,
    exitInfo,
    summitUser,
    iterationMail,
  });
  return html;
};

/*
 * toEmail: String 接收者,可以同时发送多个,以逗号隔开
 * subject: String 标题
 * cc: String 抄送
 * text: String 文本
 * html: Object titleList表头 conterFontList内容
 * attachments: any 附件
 * [
 *  {
     filename: 'img1.png',            // 改成你的附件名
     path: 'public/images/img1.png',  // 改成你的附件路径
     cid : '00000001'                 // cid可被邮件使用
    }
 * ]
 */

interface mailInterface {
  toEmail: string;
  subject: string;
  cc?: string;
  text?: string;
  html?: any;
  attachments?: any;
  storyMail?: any;
  exitInfo?: any;
  summitUser?: String;
  iterationMail?: any;
}

const sendMail = async (mailOptions: mailInterface) => {
  const {
    toEmail,
    subject,
    cc,
    text,
    attachments,
    storyMail,
    exitInfo,
    summitUser,
    iterationMail,
  } = mailOptions;
  Object.keys(exitInfo).forEach((key) => {
    exitInfo[key] = marked(exitInfo[key]);
  });
  const html = htmlModel({ storyMail, exitInfo, summitUser, iterationMail });
  const mailOpts = {
    from: MAIL_CONFIG.user_email, // 发送者,与上面的 user 一致
    to: toEmail,
    subject,
    cc,
    text,
    html,
    attachments,
  };
  try {
    transporter.sendMail(mailOpts);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default { sendMail };
```

nunjucks 模板使用

邮件模板可以使用 html 格式，但是自己直接画的话，样式并不好控制，可以使用 QQ 邮箱的邮件转代码功能

1.  如下图所示，先将邮件的内容填好

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27cf2d5272d740d39186d7121b6632b8~tplv-k3u1fbpfcp-watermark.image)

2.  点击格式，选择代码功能，可以将转成 code 的邮件内容复制出来

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/446b3fab68f344609bfe063717c92624~tplv-k3u1fbpfcp-watermark.image)

3.  最后转成 nunjucks 模板即可

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8bafbd2f77f4d84b53cb36104be7924~tplv-k3u1fbpfcp-watermark.image)

#### 群机器人

除了流程通知之外的，其他例如代码检测失败、构建状态通知，可以使用机器人这种聊天工具推送，时效、便捷。

群机器人这里选择钉钉群机器人，参考[钉钉机器人文档](https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq/FaE0F)下面附带具体的实现代码\(为了安全且简单，采用**加签**的安全验证\)。

如果是企业微信用户的话，可以参考企业[微信机器人文档](https://work.weixin.qq.com/help?person_id=1&doc_id=13376)，两者使用原理差不多，都是通过 webhook 进行消息推送。

```js
const crypto = require("crypto");
const secret ="";
const sendUrl =""; // 替换成自己的

export default (app) => {
  return {
    async send(content) {
      const timestamp = Date.now();
      const str = crypto
        .createHmac("sha256", secret)
        .update(timestamp + "\n" + secret)
        .digest()
        .toString("base64", "UTF-8");

      try {
        const { res, data } = await app.curl(
          `${sendUrl}&timestamp=${timestamp}&sign=${encodeURIComponent(str)}`,
          {
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            method: "POST",
            data: JSON.stringify(content),
          }
        );
        return res;
      } catch (error) {
        return error;
      }
    },
    text({ content = {}, at }) {
      console.log("content===>", content);
      at = at || {};
      this.send({
        msgtype: "text",
        text: {
          content,
        },
        at,
      });
    },
  };
};

// 测试机器人 Controller
import { Post, Prefix, Get } from "egg-shell-decorators";
import BaseController from "./base";

@Prefix("robot")
export default class ProjectController extends BaseController {
  @Post("/ding")
  public async getProjectList({
    request: {
      body: { params },
    },
  }) {
    const { ctx } = this;
    const { content } = params;
    await ctx.helper.robot.ding.text({ content });
    this.success({});
  }
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b70195e81a6d4d6eabe72df436ea1ed0~tplv-k3u1fbpfcp-zoom-1.image)

上述只附带了 text 文本消息推送，markdown、link、FeedCard 等其他消息类型，照着例子直接上手改就行了

## Sequelize

Sequelize 提供了 sequelize-cli 工具来实现 Migrations，可以在 egg 项目中引入 sequelize-cli（具体介绍参考 [sequelize 操作](https://eggjs.org/zh-cn/tutorials/sequelize.html)）。下面是 Sequelize 的简单使用。

#### 配置

使用 `npm install \--save-dev sequelize-cli` 安装 sequelize-cli 工具，再通过下面配置生成需要的表。

根目录下新建 `.sequelizerc` 文件，复制下述代码

```js
use strict';
const path = require('path');

module.exports = {
  config: path.join(__dirname, 'database/config.json'),
  'migrations-path': path.join(__dirname, 'database/migrations'),
  'seeders-path': path.join(__dirname, 'database/seeders'),
  'models-path': path.join(__dirname, 'app/model'),
};
```

执行下述命令后会生成 `database/config.json` 文件和 `database/migrations` 目录

```js
npx sequelize init:config
npx sequelize init:migrations
```

修改一下 database/config.json 中的内容，将其改成项目中使用的数据库配置：

```js
{
  "development": {
    "username": "root", // 之前安装的 mysql 的用户名密码
    "password": "123456",
    "database": "devops_dev", // 新建数据库名
    "host": "127.0.0.1", // mysql 的地址
    "dialect": "mysql"
  },
}
```

再通过 `npx sequelize migration:generate \--name=init-users` 来创建用户表

```js
module.exports = { // 为了减少工作量，权限直接使用 gitlab 的，所以只需要落库以下字段
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, },
      name: STRING(30),
      username: STRING(30),
      email: STRING(100),
      avatar_url: STRING(200),
      web_url: STRING(200),
      created_at: DATE,
      updated_at: DATE,
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('users');
  },
};
```

最后执行 migrate 进行数据库变更，将表推送到数据库中

```js
# 升级数据库
npx sequelize db:migrate
# 如果有问题需要回滚，可以通过 `db:migrate:undo` 回退一个变更
# npx sequelize db:migrate:undo
# 可以通过 `db:migrate:undo:all` 回退到初始状态
# npx sequelize db:migrate:undo:all
```

`config/config.plugin.ts` 开启 sequelize 插件

```js
  sequelize: {
    enable: true,
    package: "egg-sequelize",
  }
```

`config/config.default.ts` 文件添加 sequelize 配置

```js
 // 数据库配置
  config.sequelize = {
    database: "devops_dev",
    delegate: "model", // load all models to app.model and ctx.model
    baseDir: "model", // load models from `app/model/*.js`
    dialect: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root123456",
  };
```

如果你有配置多环境数据库的时候，可以选择在 local.ts、prod.ts 里面添加对应的 sequelize 配置，会覆盖掉 default 配置，也可以按照自身的业务需求配置环境变量。

#### 使用

上面已经通过 sequelize-cli 成功创建了用户表，接下来承接上一章的内容，完善一下用户流程，将从 GitLab 获取到的用户信息落库到用户表中。

Service 层的官方定义如下：

- 保持 Controller 中的逻辑更加简洁。
- 保持业务逻辑的独立性，抽象出来的 Service 可以被多个 Controller 重复调用。
- 将逻辑和展现分离，更容易编写测试用例，测试用例的编写具体可以查看这里。

之前已经在 Service 层写过请求 GitLab 用户接口获取用户信息的代码，接下来操作数据库有关的代码也会放在 Service 层处理。

新建 `app/model/user.ts` 文件

```js
export default (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const User = app.model.define("user", {
    id: { type: INTEGER, primaryKey: true },
    name: STRING(30),
    username: STRING(30),
    email: STRING(100),
    avatarUrl: STRING(200),
    webUrl: STRING(200),
  });
  return User;
};
```

根据之前的用户设计，项目的用户系统依赖于 GitLab 体系，所以本地并不需要保存太多的字段，只需要将一些常规的使用字段落库到本地，方便后期调用即可，同样适用于其他的 api 接口，系统本身只会保留部分常用字段。

修改 `app/controller/user.ts` 文件

```js
import { Post, Prefix } from "egg-shell-decorators";
import BaseController from "./base";

@Prefix("user")
export default class UserController extends BaseController {
  @Post("/getUserToken")
  public async getUserToken({
    request: {
      body: { params },
    },
  }) {
    const { ctx, app } = this;
    const { username, password } = params;

    // gitlab 获取 access_token
    const userToken = await ctx.service.user.getUserToken({
      username,
      password,
    });

    // gitlab 获取用户信息
    const userInfo = await ctx.service.user.getUserInfo({
      accessToken: userToken.access_token,
    });
    
    
    // 添加用户数据本地落库，此段代码为用户落库
     ctx.service.user.saveUser({
       userInfo,
     });

    // 将用户信息及 token 使用 jwt 注册
    const token = app.jwt.sign(
      {
        userToken,
        userInfo,
      },
      app.config.jwt.secret
    );
    
    ctx.set({ authorization: token }); // 设置 headers
    this.success(userInfo);
  }
}
```

修改 `app/service/user.ts`

```js
import { Service } from "egg";

export default class User extends Service {
  // 使用 gitlab api 获取 access_token
  public async getUserToken({ username, password }) {
    const { data: token } = await this.ctx.helper.utils.http.post(
      "/oauth/token",
      {
        grant_type: "password",
        username,
        password,
      }
    );
    if (token && token.access_token) {
      return token;
    }
    return false;
  }

  // 使用 gitlab api 获取 gitlab 用户信息
  public async getUserInfo({ accessToken }) {
    const userInfo = await this.ctx.helper.api.gitlab.user.getUserInfo({
      accessToken,
    });
    return userInfo;
  }
  
   // 新增用户信息落库方法，此段代码为用户落库
   public async saveUser({ userInfo }) {
     const { ctx } = this;
     const {
       id,
       name,
       username,
       email,
       avatar_url: avatarUrl,
       web_url: webUrl,
     } = userInfo;
 
     // 查询用户是否已经落库
     const exist = await ctx.model.User.findOne({
       where: {
         id,
       },
       raw: true,
     });
 
     // 创建用户信息
     if (!exist) {
       ctx.model.User.create({
         id,
         name,
         username,
         email,
         avatarUrl,
         webUrl,
       });
     };
   }
}
```

按照正常的流程，此时请求用户信息的时候，如果用户不存在的话，会将用户信息保存在数据库中，存在则不会修改。

上述的方法合并一下，将 findOne 方法修改成 findOrCreate，当查询用户数据不存在时就创建，存在时就直接返回查询出来的用户信息。

```js
ctx.model.User.findOrCreate({
  where: {
    id,
  },
  defaults: {
    id,
    name,
    username,
    email,
    avatarUrl,
    webUrl,
  }
});
```

如果想要信息随时同步的话，可以再选择再进一步改造一下

```js
ctx.model.User.findOrCreate({
  where: {
    id,
  },
  defaults: {
    id,
    name,
    username,
    email,
    avatarUrl,
    webUrl,
  }
}).then(([user, created]) => {
  if (!created) {
    ctx.model.User.update({
      name,
      username,
      email,
      avatarUrl,
      webUrl,
    }, {
      where: {
        id,
      }
    })
  }
});
```

findOrCreate 的返回参数可以判断是否是新增数据，当为 false 的时候，执行数据更新。具体的同步流程跟字段可以根据自身的业务调整。

上述是对 Sequelize 的简单使用，更多 [Sequelize](https://www.sequelize.com.cn/) 的使用方法，可以点击查看对应的 Api 与使用方法。

## 本章小结

本章主要内容是中间件与工具类的开发，主要学习了 egg-sequelize 的使用。

到目前为止，通过一系列的环境配置与基础学习接触了 Node 开发相关的内容。

下一章开始将进入项目业务逻辑的开发。

如果你有什么疑问，欢迎在评论区提出，或者加群沟通。 👏
    