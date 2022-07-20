
# Node 工具篇 - Gitlab Api
---

## 前言

通过之前的需求分析，可以知道整个工程架构是以 GitLab 为底层而搭建的 DevOps 系统，所以需要借助 GitLab 的 Open Api 将两个系统的信息互通串联。

本章将介绍如何使用 Egg 开发 GitLab Api 的工具类，并不涉及具体的业务代码。会对 GitLab 的授权、api 的使用有一个初步的了解，后期可以针对实际的业务需求做个性化定制与调整。

## Gitlab 授权

### 封装基础 GitLab Api 工具类

项目业务部分会通过 GitLab Api 获取对应的用户、项目信息，需要频繁地请求 [GitLab Api](https://docs.gitlab.com/ce/api/)，可以先将请求方法封装成统一的工具类方便后面使用。

详细的 api 请求方式这里不细说了，想要了解更多细节的同学们可以查看[官方文档](https://docs.gitlab.com/ce/api/)。

新建 `/app/helper/utils/http.ts`

```js
const qs = require("qs");

const baseUrl = "https://gitlab.xxxxxx.com"; // 此处替换为你自己的 gitlab 地址

export default (app) => {
  return {
    async post({url, params = {}, query = {}}) {
      const sendUrl = `${baseUrl}${url}?${qs.stringify(query)}`;
      try {
        const { data, code } = await app.curl(sendUrl, {
          dataType: "json",
          method: "POST",
          data: params,
        });
        return { data, code };
      } catch (error) {
        return error;
      }
    },
    async methodV({ url, method, params = {}, query = {} }) {
      const sendUrl = `${baseUrl}/api/v4${url}?${qs.stringify(query)}`;
      try {
        const { data, code } = await app.curl(sendUrl, {
          dataType: "json",
          method,
          data: params,
        });
        return { data, code };
      } catch (error) {
        return error;
      }
    },
  };
};
```

上面封装的请求方法有两种，稍微注意一下，Gitlab Api 处理用户模块相关的 url 前缀是不带 **'/api/v4'**，而其他的业务请求是需要带上 **'/api/v4'**， 因此会多封装一种不同类型的函数来请求对应的 Open Api。

### 认证授权

整个项目管理系统都是基于 GitLab 建立，要通过 Node 去调用 GitLab 获取对应仓库、用户等信息。

大多数API请求需要身份验证，或者只在没有提供身份验证时返回公共数据。由于项目需要获取更多的权限与信息，所以要拿到 GitLab 的授权。下面几种是 GitLab 提供的几种授权方式：

1.  [OAuth2 tokens](https://docs.gitlab.com/ee/api/README.html#oauth2-tokens)
2.  [Personal access tokens](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
3.  [Project access tokens](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html)
4.  [Session cookie](https://docs.gitlab.com/ee/api/README.html#session-cookie)
5.  [GitLab CI/CD job token](https://docs.gitlab.com/ee/api/README.html#gitlab-ci-job-token) \(Specific endpoints only\)

考虑到安全、便捷等情况，项目选择 OAuth2 来进行授权（其他的适用场景多数用于制作 cli 工具类或者脚本拉取项目进行构建等操作）。

OAuth2 授权有以下三种方式：

1.  Resource owner password credentials flow（客户端用户密码验证授权）
2.  Web application flow（Web 应用程序授权）
3.  Implicit grant flow（隐式授权流）

> 最新的 GitLab 的文档已经更新了，现在的 GitLab 的版本是 13，本章教程是按照 12 来写的，但这并不影响项目的正常开发，有兴趣的同学可以看看最新的授权文档。

项目将使用第 1、2 种方式来进行 OAuth2 授权。

#### Resource owner password credentials flow

客户端用户密码验证授权顾名思义，可以使用 GitLab 的`用户名/密码`直接通过请求从 GitLab 换取 access\_token。

先从简单的`用户名/密码`授权开始进行 OAuth2 授权。

 1.     首先创建 `/app/controller/user.ts`，粘贴以下代码：

```js
import { Controller } from 'egg';
import { Post, Prefix } from 'egg-shell-decorators';

@Prefix('user')
export default class UserController extends Controller {
  @Post('/getUserToken')
  public async getUserToken({
    request: {
      body: { params },
    },
  }) {
    const { ctx } = this;
    const { username, password } = params;

    // gitLab 获取 access_token
    const userToken = await ctx.service.user.getUserToken({
      username,
      password,
    });

    this.ctx.body = userToken;
  }
}
```

 2.     创建 `/app/service/user.ts`，粘贴以下代码：

```js
import { Service } from 'egg';

export default class User extends Service {

  public async getUserToken({ username, password }) {
    const { data: token } = await this.ctx.helper.utils.http.post({
      url: '/oauth/token',
      params: {
        grant_type: 'password',
        username,
        password,
      },
    });

    if (token && token.access_token) {
      return token;
    }
    return false;
  }
}
```

3.  使用 Postman 请求 `http://127.0.0.1:7001/user/getUserToken`，输入对应的 GitLab 的用户密码，可以获取到 OAuth2 `access_token`，然后通过 `access_token` 调用对应的 Open Api 即可拿到想要的信息。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b392cc4bcf44195a01e8ec1c64cb0a5~tplv-k3u1fbpfcp-zoom-1.image)

这样有个缺点，及时用户当前的 GitLab 已登陆，仍需要用户重新输入用户名、密码才能登陆项目，且可能存在相互用户信息不对称（两个系统登录了不同的用户）。

#### Web application flow

如果你拥有 GitLab 管理员权限的时候，那么使用 Web 应用程序授权将是非常方便的。流程是通过 GitLab 直接授权回调拿到 access\_token，这样就不需要两个项目都登录一遍，提高用户体验，也避免出现两个系统账号不一致的情况。

 1.     再次在 `controller/user.ts` 与 `service/user.ts` 添加对应的方法，复制下面代码：

```js
// /app/controller/user.ts
@Get('/getTokenByApp')
  public async getTokenByApplications({
    request: {
      query: { code },
    },
  }) {
    const { ctx } = this;
    // gitLab 获取 access_token
    const userToken = await ctx.service.user.getTokenByApplications({ code });
    this.ctx.body = userToken;
  }

// /app/service/user.ts
 public async getTokenByApplications({ code }) {
   const { data: token } = await this.ctx.helper.utils.http.post({
      url: '/oauth/token',
      params: {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: 'http://127.0.0.1:7001/user/getTokenByApp',
      },
    });

    if (token && token.access_token) {
      return token;
    }
    return false;
  }
```

由于 GitLab 授权是直接浏览器携带 code 参数重定向到指定的 `Redirect Uri`， 所以 `http://127.0.0.1:7001/user/getTokenByApp` 使用 Get 方式请求。

2.  使用管理员账号登陆之后，输入 `Name（随便取），Redirect URI:http://127.0.0.1:7001/user/getTokenByApp`。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02aa44a5f9434af39e86efe8d5217f2f~tplv-k3u1fbpfcp-watermark.image)

因为是实战项目，直接将除了 `trusted` ，`scopes` 里面的其他选型全部都选中，不需要后面再次修改。\(实际场景中，可能需要多种 application 组合使用，每个 application 的授权都不一样，配合业务选择合适的权限使用，不过一般都只使用 api 即可\)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b549cb33f204831ad62673828989df4~tplv-k3u1fbpfcp-watermark.image)

将得到的参数填入 `service/user.ts` 里面的 `getTokenByApplications` 方法。

- `Application Id 填入 方法里面的 client_id`
- `Secret 填入 client_secret`
- `Callback Uri 填入 redirect_uri`

3.  浏览器输入 `http://192.168.160.88:8888/oauth/authorize?client_id=CLIENT_ID&redirect_uri=http://127.0.0.1:7001/user/getTokenByApp&response_type=code`（**其中 client\_id 替换成自己获取**）。

不出意外的话，将会出现 GitLab 的授权页面

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85cb724652f149d38b771e12d783f752~tplv-k3u1fbpfcp-watermark.image)

4.  点击授权之后，GitLab 会携带 code 重定向到上述地址，然后可以通过 code 换取 `access_token`，再继续进行剩下的获取用户信息操作。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a4d2a6691f5847ee8c4242c2cdd7e6a6~tplv-k3u1fbpfcp-watermark.image)

如果没有出现授权界面，而是直接重定向了，应该是配置的时候将 `trusted` 选项勾选了，重新修改一下配置，或者不管都行，这毕竟只是一个 demo，可以给予完全的信任。

## 封装 GitLab Api 业务请求

GitLab 的 Api 文档涵盖的内容非常多，先将必备的一些文档提取出来，根据文档描述来封装对应的业务请求，如果想了解更多的同学也可以自行阅读 [GitLab Api](https://docs.gitlab.com/ce/api/)。

### GitLab Api 通用文档简介

#### 请求类型

| 请求类型 | 描述 |
| --- | --- |
| GET | 访问一个或多个资源并以JSON形式返回结果 |
| POST | 如果资源成功创建，则返回 201，并以JSON形式返回新创建的资源 |
| GET / PUT | 如果资源被成功访问或修改，则返回 200。\(修改后的\)结果以JSON的形式返回 |
| DELETE | 删除成功返回 204 |

#### 状态码

请求可能返回的状态码：

| 状态码 | 描述 |
| --- | --- |
| 200 OK | GET、POST、PUT、DELETE 请求成功，资源本身作为 JSON 返回 |
| 204 No Content | 服务器已经成功地完成了请求，并且在响应有效负载主体中没有额外的内容要发送 |
| 201 Created | POST 请求成功，资源以 JSON 的形式返回 |
| 304 Not Modified | 自上次请求以来，资源没有被修改过 |
| 400 Bad Request | 缺少 API 请求的必需属性。例如，一个问题的标题没有给出 |
| 401 Unauthorized | 用户未经过身份验证, 缺少 token |
| 403 Forbidden | 这个请求是不允许的，缺少权限 |
| 404 Not Found | 无法访问资源，请求资源错误 |
| 405 Method Not Allowed | 请求不被支持，错误使用对应 Api 请求类型 |
| 409 Conflict | 一个冲突的资源已经存在，例如一个项目创建相同命名的分支 |
| 412 | 这个请求被拒绝了。比如在试图删除资源时提供了 if - unmodified - since头 |
| 422 Unprocessable | 实体无法被处理 |
| 429 Too Many Requests | 日志含义用户超过应用程序速率限制，请求频率过多 |
| 500 Server Error | 服务器上出现了错误 |

#### 分页

当 GitLab project 或者 branch 非常多的时候，需要用到分页参数，不然请求的数据量会少

| 参数 | 描述 |
| --- | --- |
| page | 当前请求分页索引 \(default: 1\). |
| per\_page | 当前请求每页数量 \(default: 20, max: 100\). |

#### 分页请求 header

| 参数 | 描述 |
| --- | --- |
| x-next-page | 下一页索引 |
| x-page | 当前页索引 |
| x-per-page | 当前请求每页数量 |
| X-prev-page | 上一页索引 |
| x-total | 总数 |
| x-total-pages | 总页数 |

### GitLab 业务 Api

GitLab 的业务 Api 可以分为下述 3 个模块：

- Projects. - 项目相关的 Api
- Groups. - 团队相关的 Api
- Standalone. - 独立于上述额外的 Api

具体的内容也可以从 [地址](https://docs.gitlab.com/ee/api/api_resources.html) 获取，这里不在一一阐述，项目中主要使用的是跟 Projects 相关的 Api，所以只关注这一块即可。

#### Project Api

Project Api 主要是针对项目的一些操作，例如常见的增删改查。

下面是 project 返回的部分参数，这里删除了一些对项目无关或者无意义的字段，大部分的内容都可以通过字段名看出来，这里也不一一表述，想要知道更多的同学可以查看 [Projcet Api](https://docs.gitlab.com/ee/api/projects.html)

```json
{
  "id": 3,
  "description": null,
  "default_branch": "master",
  "visibility": "private",
  "ssh_url_to_repo": "git@example.com:diaspora/diaspora-project-site.git",
  "http_url_to_repo": "http://example.com/diaspora/diaspora-project-site.git",
  "web_url": "http://example.com/diaspora/diaspora-project-site",
  "readme_url": "http://example.com/diaspora/diaspora-project-site/blob/master/README.md",
  "owner": {
    "id": 3,
    "name": "Diaspora",
    "created_at": "2013-09-30T13:46:02Z"
  },
  "name": "Diaspora Project Site",
  "path": "diaspora-project-site",
  "created_at": "2013-09-30T13:46:02Z",
  "last_activity_at": "2013-09-30T13:46:02Z",
  "creator_id": 3,
  "import_status": "none",
  "import_error": null,
  "permissions": {
    "project_access": {
      "access_level": 10,
      "notification_level": 3
    },
    "group_access": {
      "access_level": 50,
      "notification_level": 3
    }
  },
  "avatar_url": "http://example.com/uploads/project/avatar/3/uploads/avatar.png",
}
```

阅读过项目分析与设计的同学，此时应该知道需要将哪些字段落库到本地了。

介绍几个后期最常用的几个 Project Api，各位同学可以将下述 api 封装好备用：

1.  [List user projects](https://docs.gitlab.com/ee/api/projects.html#list-user-projects) `GET /users/:user_id/projects`
2.  [Get single project](https://docs.gitlab.com/ee/api/projects.html#get-single-project) `GET /projects/:id`
3.  [Create project](https://docs.gitlab.com/ee/api/projects.html#create-project) `POST /projects`

具体的参数，可以点击链接去文档直接查看。

#### Branch Api

Branch Api 主要是针对项目分支的一些操作，例如常见的增删改查以及分支合并等操作。

下面是 Branch 的返回参数，基本都是需要的。

```json
{
  "name": "master",
  "merged": false,
  "protected": true,
  "default": true,
  "developers_can_push": false,
  "developers_can_merge": false,
  "can_push": true,
  "web_url": "http://gitlab.example.com/my-group/my-project/-/tree/master",
  "commit": {
    "author_email": "john@example.com",
    "author_name": "John Smith",
    "authored_date": "2012-06-27T05:51:39-07:00",
    "committed_date": "2012-06-28T03:44:20-07:00",
    "committer_email": "john@example.com",
    "committer_name": "John Smith",
    "id": "7b5c3cc8be40ee161ae89a06bba6229da1032a0c",
    "short_id": "7b5c3cc",
    "title": "add projects API",
    "message": "add projects API",
    "parent_ids": [
      "4ad91d3c1144c406e50c7b33bae684bd6837faf8"
    ]
  }
}
```

基本上所有的 Branch Api 后期都需要用到：

1.  [List repository branches](https://docs.gitlab.com/ee/api/branches.html#list-repository-branches) `GET /projects/:id/repository/branches`
2.  [Get single repository branch](https://docs.gitlab.com/ee/api/branches.html#get-single-repository-branch) `GET /projects/:id/repository/branches/:branch`
3.  [Create repository branch](https://docs.gitlab.com/ee/api/branches.html#create-repository-branch) `POST /projects/:id/repository/branches`
4.  [Delete repository branch](https://docs.gitlab.com/ee/api/branches.html#delete-repository-branch) `DELETE /projects/:id/repository/branches/:branch`

> 后续需要的其他 api，在对应的模块再举例介绍

### 封装 GitLab 工具类

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/648bbed0619f49faabc83c1391dc688d~tplv-k3u1fbpfcp-zoom-1.image)

这里之所以会将 GitLab Api 的业务请求多封装一层做成工具类是因为在后面的操作过程中，将会频繁的调用它。

而一般来说 Service 层是做数据处理，Controller 层是做业务处理，在实际使用中都会存在调用 api 的可能。可以直接把第三方的调用类都放在 helper 里面统一维护。

同样后期会使用到的 Jenkins、Gitlab CI 等第三方调用工具类也会封装于此。

接下来进行将使用频率非常高的 Project Api 为例子开始封装第一个经常用使用的项目请求类

```js
import AJAX from "../../utils/http";

module.exports = (app) => {
  const getProjects = async ({ pageSize, pageNum, accessToken }) => {
    const { data: projectList } = await AJAX(app).methodV({
      url: "/projects",
      method: 'GET',
      query: {
        per_page: pageSize,
        page: pageNum,
        access_token: accessToken,
      },
    });
    return { projectList };
  };

  const createProjects = async ({ gitParams }) => {
    const status = await AJAX(app).methodV({
      url: "/projects",
      method: 'POST',
      params: {
        ...gitParams,
      },
    });
    return status;
  };

  const deleteProtectedBranches = async (projectId: number) => {
    const url = `/projects/${projectId}/protected_branches/master`;
    const status = await AJAX(app).methodV({
      url,
      method: 'DELETE',
    });
    return status;
  };

  const protectedBranches = async (projectId: number) => {
    const url = `/projects/${projectId}/protected_branches`;
    const status = await AJAX(app).methodV({
      url,
      method: 'POST',
      params: {
        name: "master",
        push_access_level: 0,
        merge_access_level: 40,
      },
    });
    return status;
  };

  return {
    getProjects,
    createProjects,
    deleteProtectedBranches,
    protectedBranches,
  };
};
```

业务侧直接调用

```js
// Service
import { Service } from "egg";

export default class Project extends Service {
  public async getProjectList({ pageSize = 100, pageNum = 1, accessToken }) {
    const {
      projectList,
    } = await this.ctx.helper.api.gitlab.project.getProjects({
      pageSize,
      pageNum,
      accessToken,
    });
    return projectList;
  }
}

// Controller
import { Controller } from "egg";
import { Post, Prefix } from "egg-shell-decorators";

@Prefix("project")
export default class ProjectController extends Controller {
  @Post("/getProjectList")
  public async getProjectList() {
    const { ctx } = this;
    const { params } = ctx.body;
    const { pageSize, pageNum, accessToken } = params;
    const projectList = await ctx.service.project.getProjectList({
      pageSize,
      pageNum,
      accessToken,
    });
    ctx.body = projectList;
  }
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cba421bafab64f3ca0f262441c652009~tplv-k3u1fbpfcp-zoom-1.image)

如图，根据之前获取的 accessToken 已经可以正常的拿到对应用户的项目信息，同理可以提前封装项目未来将会使用到的常用 api，例如 branch、merge 等，也可以等到后期项目中使用到了在开发。

## 本章小结

本章学习了 GitLab Api 的授权与其他的 Open Api 的使用，并且封装了需要的业务请求模块，方便后期业务开发。

下一章将学习封装全局与其他的工具类。

如果你有什么疑问，欢迎在评论区提出，或者加群沟通。 👏
    