
# 前端实战-Vite 2.0 + React + ZarmUI 搭建前端 H5 开发环境
---

## 前言

`React` 技术栈的 `UI` 组件库相比 `Vue`，会少一些。我们耳熟能详的便是 `Antd`，但是它针对的是 `PC` 端的，我们的项目目前是一个 `H5` 的网页（不排除后期做一个 PC 端）。所以我选择了 [Zarm](https:https://zarm.gitee.io/#/)。

这里再次强调，不是 `Zarm` 就比别的移动端组件库好，只是目前我开发的这款记账本项目，`Zarm` 比较适合。

#### 知识点

- 构架工具 `Vite`。

- 前端框架 `React` 和路由 `react-router-dom`。

- `CSS` 预加载器 `Less`。

- `HTTP` 请求库 `axios`。

- 移动端分辨率适配 `flexible`。

- 跨域代理。

## 初始化 Vite + React 项目

`Vite` 官方提供两种初始化项目的方式，一种是如下所示，可以自由选择需要的前端框架。

```bash
npm init @vitejs/app
```

另一种则是直接用官方提供的模板，一键生成项目：

```bash
# npm 6.x
npm init @vitejs/app react-vite-h5 --template react

# npm 7+, 需要额外的双横线：
npm init @vitejs/app react-vite-h5 -- --template react
```

我们使用第二种方式初始化项目，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32661c92fce54016949d56b5a57399ba~tplv-k3u1fbpfcp-zoom-1.image)

安装完 `node_modules` 之后，通过 `npm run dev` 启动项目，如下所示代表成功了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/874d34fcf2394af585b2c42a11cef607~tplv-k3u1fbpfcp-zoom-1.image)

## 引入路由插件 react-router-dom

没有路由的项目，那就不是一个完整项目，而是一个页面而已。真实项目都是存在各种模块之间的切换，各个模块的功能组合在一起才能叫做一个项目。

首选安装 `react-router-dom`，指令如下：

```bash
npm i react-router-dom -S
```

在项目 `src` 目录下新增 `container` 目录用于放置页面组件，再在 `container` 下新增两个目录分别是 `Index` 和 `About` ，添加如下内容：

```js
// Index/index.jsx
import React from 'react'

export default function Index() {
  return <div>
    Index
  </div>
}

// About/index.jsx
import React from 'react'

export default function About() {
  return <div>
    About
  </div>
}
```

再来新建 `src/router/index.js` 配置路由数组，添加如下内容：

```js
// router/index.js
import Index from '../container/Index'
import About from '../container/About'

const routes = [
  {
    path: "/",
    component: Index
  },
  {
    path: "/about",
    component: About
  }
];

export default routes
```

在 `App.jsx` 引入路由配置，实现切换浏览器路径，显示相应的组件：

```js
// App.jsx
import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import routes from '../src/router'
function App() {
  return <Router>
    <Switch>
      {
        routes.map(route => <Route exact key={route.path} path={route.path}>
          <route.component />
        </Route>)
      }
    </Switch>
  </Router>
}

export default App
```

启动项目 `npm run dev`，如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d67090d0f61641539e3fcd9061d27474~tplv-k3u1fbpfcp-zoom-1.image)

## 引入 Zarm UI 组件库

首先通过如下指令安装它：

```bash
npm install zarm -S
```

修改 `App.jsx` 的代码，全局引入样式和中文包：

```js
import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN'
import 'zarm/dist/zarm.css'

import routes from '../src/router'
function App() {
  return <Router>
    <ConfigProvider primaryColor={'#007fff'} locale={zhCN}>
      <Switch>
        {
          routes.map(route => <Route exact key={route.path} path={route.path}>
            <route.component />
          </Route>)
        }
      </Switch>
    </ConfigProvider>
  </Router>
}

export default App
```

此时 `zarm` 的样式，已经全局引入了，我们先查看在 `/container/Index/index.jsx` 添加一个按钮是否生效：

```js
// Index/index.jsx
import React from 'react'
import { Button } from 'zarm'

export default function Index() {
  return <div>
    Index
    <Button theme='primary'>按钮</Button>
  </div>
}
```

重启项目，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5196fda769074ec387a085af87b6bb92~tplv-k3u1fbpfcp-zoom-1.image)

此时恭喜你🎉，你已经成功将组件引入项目中。

#### 小优化

组件虽然引入成功了，但是有一个问题，我不希望所有的组件样式都被一次性的引入，因为这样代码会比较冗余，我只需要引入我使用到的组件样式，实现「按需引入」。

我们先看看，就目前现在这个情况，打完包之后，静态资源有多大。运行指令 `npm run build` ，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba361939748e48499cab35833093c012~tplv-k3u1fbpfcp-zoom-1.image)

腚眼一看，全局引入样式的形式，直接打完包， `css` 静态资源就 `168.22kb` 了，我们尝试配置「按需引入」。

首先我们安装一个插件：

```bash
npm i vite-plugin-style-import -D
```

然后在 `vite.config.js` 配置文件内添加如下内容：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd0314c0446e4654bfcc73e3dee44291~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bcf00b0cb0c4293a2daf92bef93f451~tplv-k3u1fbpfcp-zoom-1.image)

打完包之后，肉眼可见，`css` 提及从 `168.22kb` \-> `35.22kb`。这种方式也是前端性能优化的其中一种。

## 配置 CSS 预处理器 Less

项目中采用的 `Less` 作为 `CSS` 预处理器，它能设置变量以及一些嵌套逻辑，便于项目的样式编写。

安装 `less` 插件包，`npm i less \-D`，因为上述配置我们使用的是 `less`，并且我们需要配置 `javascriptEnabled 为 true`，支持 `less` 内联 `JS`。

修改 `vite.config.js`，如下：

```js
{
  plugins: [...]
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      }
    }
  },
}
```

并且添加了 `css modules` 配置，这样我们就不用担心在项目中，自定义的样式重名的风险，我们尝试在 `/container/Index` 目录下添加样式文件 `style.module.less`，并且在 `/container/Index/index.jsx` 中引入它，如下：

```css
.index {
  span {
    color: red;
  }
}
```

```js
// Index/index.jsx
import React from 'react'
import { Button } from 'zarm'

import s from './style.module.less'

export default function Index() {
  return <div className={s.index}>
    <span>样式</span>
    <Button theme='primary'>按钮</Button>
  </div>
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8866be0be4824492b94297eea2eb4ca3~tplv-k3u1fbpfcp-zoom-1.image)

此时我只能再次恭喜你，`Less` 成功被引入。

## 移动端项目适配 rem

移动端项目，肯定是需要适配各种分辨率屏幕的，就比如你 10px 的宽度，在每个屏幕上的占比都是不一样的，我们这里不对分辨率做深入的探讨，我们目前的首要目的是完成项目移动端的分辨率适配。

首先我们需要安装 `lib-flexible`：

```bash
npm i lib-flexible -S
```

并在 `main.jsx` 中引入它：

```js
import React from 'react'
import ReactDOM from 'react-dom'
import 'lib-flexible/flexible'
import './index.css'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
```

然后再安装一个 `postcss-pxtorem`，它的作用是在你编写完 `css` 后，将你的单位自动转化为 `rem` 单位。

```bash
npm i postcss-pxtorem
```

在项目根目录新建 `postcss.config.js`：

```js
// postcss.config.js
// 用 vite 创建项目，配置 postcss 需要使用 post.config.js，之前使用的 .postcssrc.js 已经被抛弃
// 具体配置可以去 postcss-pxtorem 仓库看看文档
module.exports = {
  "plugins": [
    require("postcss-pxtorem")({
      rootValue: 37.5,
      propList: ['*'],
      selectorBlackList: ['.norem'] // 过滤掉.norem-开头的class，不进行rem转换
    })
  ]
}
```

修改 `Index/style.module.less`：

```css
.index {
  width: 200px;
  height: 200px;
  background: green;
  span {
    color: red;
  }
}
```

重启项目 `npm run dev`，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28c6f12ba2c446ef9f374f878636c1f0~tplv-k3u1fbpfcp-zoom-1.image)

可以看到，`200px` 已经被转化为 `5.3333rem`，我们设置的 `rootValue` 是 `37.5`，你可以换算一下 `5.33333 * 37.5 = 200`。

我们目前把浏览器调整成的是 `iphone 6`，`html` 的 `font-size` 为 `37.5px`，当我们手机变成其他尺寸的时候，这个 `font-size` 的值也会变化，这是 `flexible` 起到的作用，动态的变化 `html` 的 `font-size` 的值，从而让 `1rem` 所对应的 `px` 值一直都是动态适应变化的。

当我切换成 `iphone 6 plus` 时：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b787a8e1e96d4db58622c23d89592954~tplv-k3u1fbpfcp-zoom-1.image)

变成了 `41.4px`，而相应的，我们 `div` 还是 `5.33333rem`，所以此时 `div` 宽度就变大了，但是手机的屏幕宽度也变大了，这就不会影响视觉上的比例误差太大。

## 二次封装 axios

说到这里，那就要涉及到项目的服务端 `API` 接口，我们在前面的章节里，已经完成了服务端的代码编写，但是此时我们的服务端项目是跑在 `http://127.0.0.1/7001` 端口上的。

此时你是可以在后续的请求中，使用 `http://127.0.0.1/7001` 作为项目的 `baseURL`。但是照顾到有些同学没有启动服务端项目，直奔前端项目来的。这里我已经将接口提前部署到了线上环境，供大家使用。接口地址是 `http://api.chennick.wang`。

所以在后续的封装过程中，我会提醒大家两种使用。

首先我们安装 `npm i axios \-S`，在 `src` 目录下新建 `utils` 目录，并新建 `axios.js` 脚本：

```js
// src/utils/axios.js
import axios from 'axios'
import { Toast } from 'zarm'

const MODE = import.meta.env.MODE // 环境变量

axios.defaults.baseURL = MODE == 'development' ? '/api' : 'http://api.chennick.wang'
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}`
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.show('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.code != 200) {
    if (res.data.msg) Toast.show(res.data.msg)
    if (res.data.code == 401) {
      window.location.href = '/login'
    }
    return Promise.reject(res.data)
  }

  return res.data
})

export default axios
```

我逐行为大家分析上述代码的情况情况。

```js
const MODE = import.meta.env.MODE
```

`MODE` 是一个环境变量，通过 `Vite` 构建的项目中，环境变量在项目中，可以通过 `import.meta.env.MODE` 获取，环境变量的作用就是判断当前代码运行在开发环境还是生产环境。

```js
axios.defaults.baseURL = 'development' ? '/api' : 'http://api.chennick.wang'
```

`baseURL` 是 `axios` 的配置项，它的作用就是设置请求的基础路径，后续我们会在项目实战中有所体现。配置基础路径的好处就是，当请求地址修改的时候，可以在此统一配置。

```js
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Authorization'] = `${localStorage.getItem('token') || null}`
axios.defaults.headers.post['Content-Type'] = 'application/json'
```

上述三个配置是用于请求头的设置，`Authorization` 是我们在服务端鉴权的时候用到的，我们在前端设置好 `token`，服务端通过获取请求头中的 `token` 去验证每一次请求是否合法。

最后一行是配置 `post` 请求是，使用的请求体，这里默认设置成 `application/json` 的形式。

```js
axios.interceptors.response.use(res => {
  if (typeof res.data !== 'object') {
    Toast.show('服务端异常！')
    return Promise.reject(res)
  }
  if (res.data.code != 200) {
    if (res.data.msg) Toast.show(res.data.msg)
    if (res.data.code == 401) {
      window.location.href = '/login'
    }
    return Promise.reject(res.data)
  }

  return res.data
})
```

`interceptors` 为拦截器，拦截器的作用是帮你拦截每一次请求，你可以在回调函数中做一些“手脚”，再将数据 `return` 回去。上述代码就是拦截了响应内容，统一判断请求内容，如果非 200，则提示错误信息，`401` 的话，就是没有登录的用户，默认跳到 `/login` 页面。如果是正常的响应，则 `retrun res.data`。

最后我们将这个 `axios` 抛出，供页面组件请求使用。

在 `utils` 下新建一个 `index.js`，内容如下：

```js
import axios from './axios'

export const get = axios.get

export const post = axios.post
```

这样获取的时候，能少写几行代码，能少写点就少写点。

## 代理配置

`baseURL` 为什么在 `development` 环境下，用 `/api` 这样的请求地址。其实它就是为了代理请求而配置的。

这样配置完后，在请求接口的时候，请求地址大概长这样：

```js
/api/userInfo
```

于是我们需要去配置代理，打开 `vite.config.js`，添加如下代码：

```js
server: {
  proxy: {
    '/api': {
      // 当遇到 /api 路径时，将其转换成 target 的值
      target: 'http://api.chennick.wang/api/',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
    }
  }
}
```

这样配置完之后，开发环境下，`/api/userInfo` \-> `http://api.chennick.wang/api/userInfo`。这样就解决了大家老大难的跨域问题。

但是其实服务端只要设置好白名单，就不会有这样那样的跨域问题。

## resolve.alias 别名设置

这里我们必须得设置好别名，否则在页面中，你会写出很长一串类似这样的代码 `../../../`。

打开 `vite.config.js`，添加配置如下：

```js
...
import path from 'path'

export default defineConfig({
  ...
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'utils': path.resolve(__dirname, 'src/utils') // src 路径
    }
  },
})
```

此时我们便可以修改之前的代码如下：

**router/index.js**

```js
import Index from '@/container/Index'
import About from '@/container/About'
```

**App.jsx**

```js
import routes from '@/router'
```

## 总结

行文至此，我们的基础开发环境已经搭建完毕，涉及构建工具、前端框架、`UI` 组件库、`HTTP` 请求库、`CSS` 预加载器、跨域代理、移动端分辨率适配，这些知识都是一个合格的前端工程师应该具备的，所以请大家加油，将他们都通通拿下。

#### 本章节源码

[点击下载](https://s.yezgea02.com/1622181388552/react-vite-h5.zip)
    