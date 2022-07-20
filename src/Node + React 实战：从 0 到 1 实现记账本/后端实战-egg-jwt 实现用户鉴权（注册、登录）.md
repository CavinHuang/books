
# 后端实战-egg-jwt 实现用户鉴权（注册、登录）
---

## 前言

用户鉴权，是一个系统项目中的重中之重。几乎所有的需求，都是围绕用户体系去展开设计的。放眼市面上诸多项目，哪一个不是建立在用户体系基础上的，如博客、电商、工具、管理系统、音乐、游戏等等领域。所以我们将用户鉴权这块内容放在了第一个要实现的接口。

#### 知识点

- egg-jwt 插件的使用

- egg 中间件编写

- token 鉴权

## 用户鉴权是什么

引用百度百科对「用户鉴权」的定义：

> 用户鉴权，一种用于在通信网络中对试图访问来自服务提供商的服务的用户进行鉴权的方法。用于用户登陆到DSMP或使用数据业务时，业务网关或Portal发送此消息到DSMP，对该用户使用数据业务的合法性和有效性（状态是否为激活）进行检查。

我个人觉得上述解释过于官方，我还是喜欢将复杂的东西简单化。我认为鉴权就是用户在浏览网页或 `App` 时，通过约定好的方式，让网页和用户建立起一种相互信赖的机制，继而返回给用户需要的信息。

鉴权的机制，分为四种：

- HTTP Basic Authentication

- session-cookie

- Token 令牌

- OAuth\(开放授权\)

本小册采用的鉴权模式是 `token` 令牌模式，出于多端考虑，`token` 可以运用在如网页、客户端、小程序、浏览器插件等等领域。如果选用 `cookie` 的形式鉴权，在客户端和小程序就无法使用这套接口，因为它们没有域的概念，而 `cookie` 是需要存在某个域下。

## 注册接口实现

整个注册的流程大致如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14f50febe2c749b486f7cb2fb4491809~tplv-k3u1fbpfcp-zoom-1.image)

我们将第 2 章新建的 `egg-example` 项目改名为 `juejue-server`，这么做的目的是为了避免重复之前章节的内容，并且将里面的相关代码清理，避免后面写代码的时候产生干扰。

注意将 `config.default.js` 的数据库配置项中的数据库名称修改一下，因为我们上一章节新建了一个数据库：

```js
exports.mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: 'localhost',
    // 端口号
    port: '3306',
    // 用户名
    user: 'root',
    // 密码
    password: '你的数据库初始化密码', // Window 用户如果没有密码，可不填写
    // 数据库名
    database: 'juejue-cost',
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};
```

众所周知，用户在网页端注册的时候会上报两个参数，「用户名」和「密码」，此时我们便需要在服务端代码中拿到这俩参数。

在 `controller` 目录下新建 `user.js` 用于编写用户相关的代码，代码如下：

```js
// controller/user.js
'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body; // 获取注册需要的参数
  }
}

module.exports = UserController;
```

此时我们拿到了 `username` 和 `password`，我们需要判断两个参数是否为空。如果是空，则返回错误信息：

```js
// 判空操作
if (!username || !password) {
  ctx.body = {
    code: 500,
    msg: '账号密码不能为空',
    data: null
  }
  return
}
```

此时我们还需要一个判断，根据用户传入的 `username` 去数据库的 `user` 表查询，是否已经被注册。

> 由于没有手机验证短信服务，这里只能让 username 作为唯一标示。

我们需要在 `service` 目录下新建 `user.js`，并且添加 `getUserByName` 方法用于根据 `username` 查找用户信息，内容如下所示：

```js
//  service/user.js
'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  // 通过用户名获取用户信息
  async getUserByName(username) {
    const { app } = this;
      try {
        const result = await app.mysql.get('user', { username });
        return result;
      } catch (error) {
        console.log(error);
        return null;
      }
  }
}
module.exports = UserService;
```

> 使用 async 和 await 时，如果想捕获错误，需要使用 try...catch 来捕获，如果代码运行过程中发生错误，都将会被 catch 捕获。

我们回到 `controller/user.js` 继续添加逻辑，在 「判空操作」逻辑下，判断是否已经被注册的逻辑：

```js
// controller/user.js
async register() {
  ...
  // 验证数据库内是否已经有该账户名
  const userInfo = await ctx.service.user.getUserByName(username) // 获取用户信息

  // 判断是否已经存在
  if (userInfo && userInfo.id) {
    ctx.body = {
      code: 500,
      msg: '账户名已被注册，请重新输入',
      data: null
    }
    return
  }
}
```

经过上述两层判断之后，接下便可将账号和密码写入数据库，我们继续在上述代码后，添加逻辑：

```js
// controller/user.js
// 默认头像，放在 user.js 的最外，部避免重复声明。
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'
// 调用 service 方法，将数据存入数据库。
const result = await ctx.service.user.register({
  username,
  password,
  signature: '世界和平。',
  avatar: defaultAvatar
});

if (result) {
  ctx.body = {
    code: 200,
    msg: '注册成功',
    data: null
  }
} else {
  ctx.body = {
    code: 500,
    msg: '注册失败',
    data: null
  }
}
```

我们继续前往 `service/user.js` 添加 `register` 写入数据库的方法：

```js
// service/user.js
...
// 注册
async register(params) {
  const { app } = this;
  try {
    const result = await app.mysql.insert('user', params);
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
}
```

此时上述代码的作用，便是将用户注册数据存入到数据库中的 `user` 表。通过在 `router.js` 将接口抛出，如下所示：

```js
// router.js
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/user/register', controller.user.register);
};
```

打开 `Postman`，进行手动测试，观察是否能成功将数据存入数据库。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/baa2eef02e414d3593847075ffe11b52~tplv-k3u1fbpfcp-zoom-1.image)

查看数据库是否生效：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e0e2c3534ed49ac958a65ebb618e375~tplv-k3u1fbpfcp-zoom-1.image)

可以看到我们注册的信息已经进入数据库，此时我们验证一下，再次发起相同的请求，查看服务端代码的判断是否生效。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0e2bccf98434c2481b15aaf854be6f7~tplv-k3u1fbpfcp-zoom-1.image)

不出意外，你将会看到“账户名已被注册，请重新输入”。

通常情况下，我们需要将密码通过 `md5` 或者其他的形式加密，避免数据库泄漏之后，导致用户信息被窃取，造成一些不必要的损失。加密这块，是一个比较深的知识点，为了让大家顺利的走完整个项目流程，这里不展开讲解。

## 登录接口实现

注册完成之后，紧接着就是登录流程。我们通过注册的「用户名」和「密码」，调用登录接口，接口会返回给我们一个 `token` 令牌。这个令牌的生成和使用我们通过一张流程图来分析：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/090527aa47c444f0bcf03f1a7cdb7cdd~tplv-k3u1fbpfcp-zoom-1.image)

网页端获取到 `token` 之后，需要将其存在浏览器本地，它是有过期时间的，通常我们会设置 24 小时的过期时间，如果不是一些信息敏感的网站或app，如银行、政务之类，我们可以将过期时间设置的更长一些。

之后每次发起请求，无论是获取数据，还是提交数据，我们都需要将 `token` 带上，以此来标识，此次获取\(GET\)或提交\(POST\)是哪一个用户的行为。

你可能会有疑问，服务端是怎么通过 `token` 来判断是哪一个用户在发起请求。既然 `egg-jwt` 有加密的功能，那也会有解密的功能。通过解密 `token` 拿到当初加密 `token` 时的信息，信息的内容大致就是当初注册时候的用户信息。我们通过一张流程图来分析：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/179bd765019a45c6b030a711790913bd~tplv-k3u1fbpfcp-zoom-1.image)

意思就是登录的时候，你使用的是：

```json
{
  username: '张三',
  password: '123'
}
```

那么这个 `token` 内就会含有上述信息，在服务端解析 `token` 的时候，便会解析出上述「用户名」和「密码」。知道是谁发起的请求，那后续就是针对该用户进行数据的获取和存储。

分析完上述鉴权的流程之后，我们开始登录接口的编写。

首先我们需要在项目下安装 `egg-jwt` 插件，执行如下指令：

```bash
npm i egg-jwt -S
```

这是它的[仓库地址](https://github.com/okoala/egg-jwt#readme)，仓库内有一些简易的文档，具体的操作其实很多都没有写在文档里，我也是搜了很多相关的资料，才设计出这样一套鉴权流程。

在 `config/plugin.js` 下添加插件：

```js
...
jwt: {
  enable: true,
  package: 'egg-jwt'
}
...
```

紧接着前往 `config/config.default.js` 下添加自定义加密字符串：

```js
config.jwt = {
  secret: 'Nick',
};
```

`secret` 加密字符串，将在后续用于结合用户信息生成一串 `token`。`secret` 是放在服务端代码中，普通用户是无法通过浏览器发现的，所以千万不能将其泄漏，否则有可能会被不怀好意的人加以利用。

在 `/controller/user.js` 下新建 `login` 方法，逐行添加分析，代码如下：

```js
async login() {
    // app 为全局属性，相当于所有的插件方法都植入到了 app 对象。
    const { ctx, app } = this;
    const { username, password } = ctx.request.body
    // 根据用户名，在数据库查找相对应的id操作
    const userInfo = await ctx.service.user.getUserByName(username)
    // 没找到说明没有该用户
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        msg: '账号不存在',
        data: null
      }
      return
    }
    // 找到用户，并且判断输入密码与数据库中用户密码。
    if (userInfo && password != userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '账号密码错误',
        data: null
      }
      return
    }
}
```

`app` 是全局上下文中的一个属性，`config/plugin.js` 中挂载的插件，可以通过 `app.xxx` 获取到，如 `app.mysql`、`app.jwt` 等。`config/config.default.js` 中抛出的属性，可以通过 `app.config.xxx` 获取到，如 `app.config.jwt.secret`。

所以我们继续编写后续的登录逻辑，上述的判断都通过之后，后续的代码逻辑如下：

```js
async login () {
  ...
  // 生成 token 加盐
  // app.jwt.sign 方法接受两个参数，第一个为对象，对象内是需要加密的内容；第二个是加密字符串，上文已经提到过。
  const token = app.jwt.sign({
    id: userInfo.id,
    username: userInfo.username,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // token 有效期为 24 小时
  }, app.config.jwt.secret);
  
  ctx.body = {
    code: 200,
    message: '登录成功',
    data: {
      token
    },
  };
}
```

我们把获取到的 `userInfo` 中的 `id` 和 `username` 两个属性，通过 `app.jwt.sign` 方法，结合 `app.config.jwt.secret` 加密字符串（之前声明的 `Nick`），生成一个 `token`。这个 `token` 会是一串很长的加密字符串，类似这样 `dkadaklsfnasalkd9a9883kndlas9dfa9238jand` 的一串密文。

完成上述操作之后，我们在路由 `router.js` 脚本中，将登录接口抛出：

```js
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
};
```

我们尝试用 `Postman` 去测试一下接口是否可行，运行成功的话，会是如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e452db8ce6a4d8ab7a8fa70d7cd67df~tplv-k3u1fbpfcp-zoom-1.image)

你可以这么理解这个 `token`，它里面藏着 `username` 和 `id` 两个参数，但是我在客户端拿到这个 `token` 并不能破解出它内部的内容。必须要利用加密字符串，结合 `egg-jwt` 的方法，才能解析出 `username` 和 `id`。所以，用户的权限就通过这样的形式建立起来。

包括 `cookie` 其实也是类似的原理，每次请求，请求头 `requert` 都会带上 `cookie`，服务端通过获取请求中带上的 `cookie` 去解析出对应的用户信息，然后操作相应的请求。

那么我希望验证一下，在发起一个带上 `token` 接口请求时，如何在服务端解析出 `token` 内的信息。我们在 `/controller/user.js` 中，新增一个验证方法 `test`，如下所示：

```js
// 验证方法
async test() {
  const { ctx, app } = this;
  // 通过 token 解析，拿到 user_id
  const token = ctx.request.header.authorization; // 请求头获取 authorization 属性，值为 token
  // 通过 app.jwt.verify + 加密字符串 解析出 token 的值 
  const decode = await app.jwt.verify(token, app.config.jwt.secret);
  // 响应接口
  ctx.body = {
    code: 200,
    message: '获取成功',
    data: {
      ...decode
    }
  }
}
```

我们发起请求的时候，通过在请求头 `header` 上，携带认证信息，让服务端可以通过 `ctx.request.header.authorization` 获取到 `token`，并且解析出内容返回到客户端，别忘了去 `router.js` 抛出这个接口：

```js
router.get('/api/user/test', controller.user.test);
```

我们测试一下接口是否可行：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/638cf1177c4d4c75b47072c6e9f1d42e~tplv-k3u1fbpfcp-zoom-1.image)

注意，我们在请求头 `Headers` 上添加 `authorization` 属性，并且值为之前登录接口获取到的 `token` 值。发起请求后，我们得到返回值，`id = 1`、`username = Nick`。实际证明，我们的鉴权，基本上已经完成了。

## 登录验证中间件

中间件我们可以理解成一个过滤器，举个例子，我们有 `A`、`B`、`C`、`D` 四个接口是需要用户权限的，如果我们要判断是否有用户权限的话，就需要在这四个接口的控制层去判断用户是否登录，为代码如下：

```js
A() {
  if(token && isValid(token)) {
    // do something
  }
}

B() {
  if(token && isValid(token)) {
    // do something
  }
}

C() {
  if(token && isValid(token)) {
    // do something
  }
}

D() {
  if(token && isValid(token)) {
    // do something
  }
}
```

上述操作会有两个弊端：

1、每次编写新的接口，都要在方法内部做判断，这很费事。 2、一旦鉴权有所调整，我们需要修改每个用到判断登录的代码。

现在我们引入中间件的概念，在请求接口的时候，过一层中间件，判断该请求是否是登录状态下发起的。此时我们打开项目，在 `app` 目录下新新建一个文件夹 `middleware`，并且在该目录下新增 `jwtErr.js`，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f9c9e3a930f4f5ba50581d867250c45~tplv-k3u1fbpfcp-zoom-1.image)

我们为其添加如下代码：

```js
'use strict';

module.exports = (secret) => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization; // 若是没有 token，返回的是 null 字符串
    let decode
    if(token != 'null' && token) {
      try {
        decode = ctx.app.jwt.verify(token, secret); // 验证token
        await next();
      } catch (error) {
        console.log('error', error)
        ctx.status = 200;
        ctx.body = {
          msg: 'token已过期，请重新登录',
          code: 401,
        }
        return;
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: 'token不存在',
      };
      return;
    }
  }
}
```

首先中间件默认抛出一个函数，该函数返回一个异步方法 `jwtErr`，`jewErr` 方法有两个参数 `ctx` 是上下文，可以在 `ctx` 中拿到全局对象 `app`。

首先，通过 `ctx.request.header.authorization` 获取到请求头中的 `authorization` 属性，它便是我们请求接口是携带的 `token` 值，如果没有携带 `token`，该值为字符串 `null`。我们通过 `if` 语句判断如果有 `token` 的情况下，使用 `ctx.app.jwt.verify` 方法验证该 `token` 是否存在并且有效，如果是存在且有效，则通过验证 `await next()` 继续执行后续的接口逻辑。否则判断是失效还是不存在该 `token`。

编写完上述的中间件之后，我们就要前往 `router.js` 去使用它，如下所示：

```js
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret); // 传入加密字符串
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/test', _jwt, controller.user.test); // 放入第二个参数，作为中间件过滤项
};
```

我们模拟不带 `authorization` 的请求，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acae4df05f894e34b976e48f891332ae~tplv-k3u1fbpfcp-zoom-1.image)

勾去选项，发起请求，如上图所示，进入中间件，判断 `token` 不存在。我们在随便写一个 `token` 值验证无效的情况。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5dad61c4c634a2aab0ba2f87eae4401~tplv-k3u1fbpfcp-zoom-1.image)

可见，登录验证的中间件逻辑基本上已经实现了，后续我们如果想要新增一些接口是需要用户权限的，便可以在抛出方法的第二个参数，添加 `_jwt` 方法，这样便可在进入接口逻辑之前就进行用户权限的判断。

## 总结

本章节是整个服务端内容的精华所在，无论什么项目，要做用户权限的话，这些逻辑是避不开的。不过想要选择哪种鉴权方式，还是取决于项目以及团队的需要，做完上述鉴权之后，我们的项目就变成了面向多用户的项目。

#### 本章节源代码

[点击下载](https://s.yezgea02.com/1621494507475/juejue-server.zip)
    