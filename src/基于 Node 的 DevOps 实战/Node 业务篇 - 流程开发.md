
# Node 业务篇 - 流程开发
---

## 前言

前面已经介绍了 GitLab Api 的以及其他工具类的封装，通过前面的训练，大部分同学应该已经对 Egg 开发有一定的掌握。

本章将会介绍用户登录、创建项目、创建流程、流程变更等一套业务流程开发。

## 用户权限

根据之前的用户、权限设计方案，系统需要保存 GitLab Auth Api 授权之后用户信息与登录态，这块采取较通用、简单的 jwt，将用户数据及 access\_token 保存起来。

#### 安装 jwt

使用 jwt 需要用到：

 1.     `egg-cors` - 跨域包
 2.     `egg-jwt` - token 生成以及验证包

```js
npm install egg-cors egg-jwt --save
```

在 `app/config/plugin.ts` 文件配置开启插件

```js
import { EggPlugin } from "egg";

const plugin: EggPlugin = {
  static: true,
  jwt: {
    enable: true,
    package: "egg-jwt",
  },
  cors: {
    enable: true,
    package: "egg-cors",
  },
};

export default plugin;
```

在 `app/config/config.default.ts` 配置插件属性

```js
import { EggAppConfig, EggAppInfo, PowerPartial } from "egg";

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;
  config.security = {
    csrf: {
      enable: false,
    },
    // domainWhiteList: '*'  // 白名单
  };
  config.cors = {
    origin: (ctx) => ctx.get("origin"),
    credentials: true,
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
  };
  config.jwt = {
    secret: "123456", // 自定义 token 的加密条件字符串
  };
  return {
    ...config,
  };
};
```

由于是项目管理系统，基本上所有的业务请求都需要做权限校验，所以使用 jwt 权限中间件来拦截所有的路由请求，统一管理权限验证的代码，在验证权限，解析数据之后将用户数据存入 ctx 中，供后续业务侧调用。

新建文件 `app/middleware/jwt_auth.ts`，将下述代码复制进去。

```js
const excludeUrl = ["/user/getUserToken"]; // 请求白名单，过滤不需要校验的请求路径，例如登录、或其他不需要鉴权等接口。

export default () => {
  const jwtAuth = async (ctx, next) => {
    if (excludeUrl.includes(ctx.request.url)) {
      return await next();
    }
    const token = ctx.request.header.authorization;
    if (token) {
      try {
        // 解码token
        const deCode = ctx.app.jwt.verify(
          token.replace("Bearer ", ""), // jwt 中间件验证的时候，需要去掉 Bearer
          ctx.app.config.jwt.secret
        );
        ctx.user = deCode;
        await next();
      } catch (error) {
        ctx.status = 401;
        ctx.body = {
          code: 401,
          message: error.message,
        };
      }
      return;
    }
    ctx.status = 401;
    ctx.body = {
      code: 401,
      message: "验证失败",
    };
    return;
  };
  return jwtAuth;
};
```

在 `app/config/config.default.ts` 添加自定义中间件配置

```js
  config.middleware = ["jwtAuth"];
  config.jwtAuth = {};
```

上述已经完成 jwtAuth 中间件的开发，除了获取用户 token 的 `/user/getUserToken` 之外的接口都会做一次鉴权，中间件的具体使用可以参考 [egg 中间件](https://eggjs.org/zh-cn/basics/middleware.html)。

#### 业务使用代码

新建 `app/controller/user.ts`

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

新建 `app/service/user.ts`

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
}
```

上述是服务端 jwt 的使用实例，那么客户端的实例，将在 React 前端项目中单独说明。

#### 检测接口

接口开发完完毕之后，由于现在还没开始涉及前端页面，无法直接调用接口联调。所以使用 PostMan 来检测接口是否正常。

打开 PostMan 输入 `http://127.0.0.1:7001/user/getUserToken` ，根据下图填入正确的用户名密码，点击发送之后可以看到正常返回了 GitLab 的用户信息。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b79c906fe1b414db67938d8487e985a~tplv-k3u1fbpfcp-watermark.image)

将 Header authorization 字段的返回内容复制

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd39e1941663430a8b69440e38429e3c~tplv-k3u1fbpfcp-watermark.image)

将上个请求的拿到的 authorization 放在下图中的位置，获取用户信息的请求会通过中间件解析之后传给业务层处理，返回给前端当前登录的用户信息。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57684389d59b41a199ea62ccdfd6f3e7~tplv-k3u1fbpfcp-watermark.image)

上述是 jwt 的一个简单的使用，同学们可以作为参考写出更符合业务的鉴权功能。当然也可以配合 Redis 或者其他工具做更多的优化，这块后续有机会的话可以单独拎出来说说。

### GitLab 已有项目信息落库

#### Project

 1.     新建 `app/controller/project.ts`

```
import { Prefix, Get } from "egg-shell-decorators";
import BaseController from "./base";

@Prefix("project")
export default class ProjectController extends BaseController {
  /**
   * @description: 获取 gitLab 对应自身的项目列表
   */
  @Get("/getList")
  public async getProjectList({ request: { query } }) {
    const { ctx } = this;
    const { access_token } = this.user;
    const { id: userId } = this.userInfo;
    const { pageSize, pageNum } = query;
    const projectList = await ctx.service.project.getProjectList({
      pageSize,
      pageNum,
      access_token,
      userId
    });
    this.success(projectList);
  }

  /**
   * @description: 获取 gitLab 单个项目
   */
  @Get("/get")
  public async getProject({ request: { query } }) {
    const { ctx } = this;
    const { projectId } = query;
    console.log('this.user==>', this)
    const { access_token } = this.user;
    const project = await ctx.service.project.getProject({
      projectId,
      access_token
    });

    this.success(project);
  }
}
```

 2.     新建 `app/service/project.ts`

```
import { Service } from "egg";
export default class Project extends Service {
  /**
   * @description: 根据 gitLab api 获取项目 list，数据落库
   */
  public async getProjectList({ pageSize = 100, pageNum = 1, access_token, userId }) {
    const { ctx } = this;
    const { projectList } = await ctx.helper.api.gitLab.project.getProjectByUser({
      pageSize,
      pageNum,
      access_token,
      userId
    });
    const selfProjectList: any = [];
    const opt: number[] = [];

    if (!projectList) return []

    projectList.forEach((project) => {
      if (project) {
        selfProjectList.push({
          projectSourceId: project.id,
          namespace: project.namespace.name,
          projectUrl: project.web_url,
          projectGitName: project.name,
          projectGitDesc: project.description,
          projectDesc: project.description,
          logo: project.logo,
          lastActivityAt: new Date(project.last_activity_at),
          nameWithNamespace: project.name_with_namespace,
        });
        opt.push(project.id);
      }
    });

    // 数据落库，批量更新
    if (selfProjectList.length > 0) {
      await ctx.model.Project.bulkCreate(selfProjectList, {
        updateOnDuplicate: [
          "projectGitDesc",
          "namespace",
          "projectUrl",
          "projectGitName",
          "lastActivityAt",
          "logo",
          "nameWithNamespace",
        ],
      });
    }

    const local: any = await ctx.model.Project.findAll({
      where: {
        projectSourceId: opt,
      },
    });

    return local;
  }

  /**
   * @description: 查询单个项目详情
   */
  public async getProject({ projectId, access_token }) {
    const { ctx } = this;
    const self_project = await ctx.model.Project.findOne({
      where: {
        id: projectId
      },
      raw: true,
    });
    const project = await ctx.helper.api.gitLab.project.getProject({
      id: self_project.projectSourceId,
      access_token
    });
    return { ...self_project, ...project };
  }
}
```

3.  新建 `app/model/project.ts`

根据之前的数据库设计，数据库字段将设计如下：

```ts
"use strict";

module.exports = (app) => {
  const { STRING, INTEGER, UUID, UUIDV4, DATE } = app.Sequelize;

  const Project = app.model.define(
    "project",
    {
      id: {
        type: UUID,
        allowNull: false,
        defaultValue: UUIDV4,
      },
      projectSource: {
        type: INTEGER,
        defaultValue: 0,
        primaryKey: true,
      },
      projectSourceId: {
        type: STRING(30),
        primaryKey: true,
      },
      projectName: STRING(30),
      projectType: {
        type: STRING(1000),
        primaryKey: true,
        set(val, name) {
          const vals = val && val.length > 0 ? val.join(",") : "";
          (this as any).setDataValue(name, vals);
        },
        get(val) {
          const value = (this as any).getDataValue(val);
          return value ? value.split(",") : [];
        },
      },
      namespace: STRING(30),
      projectUrl: STRING(100),
      projectGitDesc: STRING(200),
      projectDesc: STRING(200),
      projectGitName: STRING(30),
      projectFeat: {
        type: INTEGER,
        defaultValue: 0,
      },
      projectBugfix: {
        type: INTEGER,
        defaultValue: 0,
      },
      projectRelease: {
        type: INTEGER,
        defaultValue: 0,
      },
      lastActivityAt: DATE,
      nameWithNamespace: STRING(100),
      logo: STRING(100),
    },
    {
      freezeTableName: true,
    }
  );
  return Project;
};
```

4.  测试接口: Postman 输入 `http://127.0.0.1:7001/project/getList?pageSize=9&pageNum=1`

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/06957b0f87ce40a385329ee1e7b3a5e4~tplv-k3u1fbpfcp-watermark.image)

正常输出结果上所示

## 本章小结

本章是针对这个项目的用户、权限模块的设计与开发，可以看出 GitLab 确实一款非常优秀的项目管理工具，借助 GitLab 提供的 Open Api 可以节约大量的成本与时间。

其实并不是每样工具、功能都是需要从零开发，一个优秀的开发者（被社会捶打的老司机）会借助工具或者更轻便的脚本来完成所需的任务。当然作为学习目的的话，仍然建议亲自尝试将所有能够自己开发的内容、步骤都做一遍，虽然这样并不一定能提高代码功底，但是对底层设计与理解会有一定的锻炼与提升。

如果你有什么疑问，欢迎在评论区提出，或者加群沟通。 👏
    