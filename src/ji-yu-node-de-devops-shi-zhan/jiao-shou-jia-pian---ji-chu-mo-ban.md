
# 脚手架篇 - 基础模板
---

## 前言

上一章是一个基础的 CLI 工具的构建，但开发者平常最多的还是在开发业务代码，仅仅依靠 CLI 从 devops 末端去约束是远远不够的，所以一般的小团队也会从脚手架入手。

本章将以 React 为例定制一套自定义脚手架以及对之前的 CLI 进行升级。

## 自定义 React 脚手架

脚手架设计一般分为两块，一块是基础架构，一块是业务架构。

基础架构决定脚手架的技术选型、构建工具选型以及开发优化、构建优化、环境配置、代码约束、提交规范等。

业务架构则是针对业务模块划分、请求封装、权限设计等等于与业务耦合度更高的模块设计。

### 搭建基础架构

跟 CLI 一样都是从 0 搭建这个脚手架，所以起手还是初始化项目与 ts 配置。

```javascript
npm init
tsx --init
```

如上先将 `package.josn` 与 `tsconfig.json` 生成出来，`tsconfig.json` 的配置项可以直接使用下面的配置或者根据自己需求重新定义。

```json
{
  "include": [
    "src"
  ],
  "compilerOptions": {
    "module": "CommonJS",
    "target": "es2018",
    "outDir": "dist",
    "noEmit": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "moduleResolution": "node",
    "strict": true,
    "noUnusedLocals": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": "./",
    "keyofStringsOnly": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  }
}
```

下面是 `package.josn` 的依赖与一些其他的配置，也一起附上，**这里不再针对每个依赖包做单独说明，如果对哪个模块有不理解的地方，可以在留言区评论咨询。**

```json
{
  "name": "react-tpl",
  "version": "1.0.0",
  "description": "a react tpl",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "cross-env NODE_ENV=development webpack-dev-server --config ./script/webpack.config.js",
  },
  "author": "cookieboty",
  "license": "ISC",
  "dependencies": {
    "@babel/cli": "^7.14.5",
    "@babel/core": "^7.14.6",
    "@babel/preset-env": "^7.14.7",
    "@babel/preset-react": "^7.14.5",
    "@babel/preset-typescript": "^7.14.5",
    "babel-loader": "^8.2.2",
    "clean-webpack-plugin": "^4.0.0-alpha.0",
    "cross-env": "^7.0.3",
    "css-loader": "^6.1.0",
    "file-loader": "^6.2.0",
    "html-webpack-plugin": "^5.3.2",
    "less": "^4.1.1",
    "less-loader": "^10.0.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "style-loader": "^3.1.0",
    "typescript": "^4.3.5",
    "webpack": "^5.45.1",
    "webpack-cli": "3.3.12",
    "webpack-dev-server": "^3.11.2"
  },
  "devDependencies": {
    "@types/react": "^17.0.14",
    "@types/react-dom": "^17.0.9"
  }
}

```

#### 配置 webpack

新建 `script/webpack.config.js` 复制下述配置。

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
    historyApiFallback: true,
    compress: true,
  },
  resolve: {
    alias: {
      '@': path.resolve('src')
    },
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: require.resolve('babel-loader')
        },
        exclude: [/node_modules/],
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader'
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'tpl/index.html'
    }),
  ]
};
```

这里有个需要注意的点是 `webpack-cli` 与 `webpack-dev-server` 的**版本需要保持一致**，都是用 3.0 的版本或者全部更新到 4.0 即可，如果版本不一致的话，会导致报错。

#### 配置 React 相关

新建 `tpl/index.html` 文件（html 模板），复制下述代码

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

新建 `src/index.tsx` 文件（入口文件），复制下述代码

```ts
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
```

新建 `.babelrc` 文件（babel 解析配置），复制下述代码

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    [
      "@babel/preset-typescript",
      {
        "isTSX": true,
        "allExtensions": true
      }
    ]
  ]
}
```

完成上述一系列配置之后，同时安装完依赖之后，运行 yarn start，此时应该是能够正常运行项目如下图所示

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e74798a5c954624af9bb91160f2020a~tplv-k3u1fbpfcp-watermark.image)

浏览器打开 `http://localhost:8081/`，即可看到写出来的展示的页面

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90248c310d0c4cbca63d10911ea4d2bc~tplv-k3u1fbpfcp-watermark.image)

至此，已经完成了一个初步的脚手架搭建，但是针对于业务来说，还是有很多的细节需要完善。接下来，我们一起针对平常开发需要使用到的模块对项目进行进一步的配置。

> 篇幅所致，这里并不会对 Webpack、Babel、React 的配置项做过多的说明，仅仅提供一个完整实例，可以根据步骤完成一个基础框架的搭建，如果有同学想了解更多相关的细节，建议直接搭建完毕之后阅读文档，然后根据文档说明来配置自己想要的功能，多思考、多动手。

### 优化 Webpck Dev 配置

#### 简化 server 信息输出

前面的配图可以看出 `webpack-dev-server` 输出的信息很乱，可以使用 Stats 配置字段对输出信息进行过滤。

一般我们只需要看到 error 信息即可，可以添加如下参数：

```javascript
devServer: {
    stats: 'errors-only', // 过滤信息输出
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
    historyApiFallback: true,
    compress: true,
},
```

#### 添加构建信息输出

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd0bca12152f4e4a9685e835dceafebf~tplv-k3u1fbpfcp-watermark.image)

ProgressPlugin 可以监控各个 hook 执行的进度 percentage，输出各个 hook 的名称和描述。

使用也非常简单，按照如下引用之后，就可以正常输出如图标红的构建进度。

```javascript
const { ProgressPlugin } = require('webpack')
plugins: [
    ...
    new ProgressPlugin(),
]
```

### 优化业务模块

先将项目目录划分好，约定好每个目录的文件的作用与功能。

这里的规范并不是一定的，具体要看各个团队自己的开发规范来定制，例如有的团队喜欢将公共的资源放在 `public` 目录等。

```
├── dist/                          // 默认的 build 输出目录
└── src/                           // 源码目录
    ├── assets/                    // 静态资源目录
    ├── config                     
        ├── config.js              // 项目内部业务相关基础配置
    ├── components/                // 公共组件目录
    ├── service/                   // 业务请求管理
    ├── store/                     // 共享 store 管理目录
    ├── util/                      // 工具函数目录
    ├── pages/                     // 页面目录
    ├── router/                    // 路由配置目录
    ├── .index.tsx                 // 依赖主入口
└── package.json
```

#### 配置路由

收敛路由的好处是可以在一个路由配置文件查看到当前项目的一个大概情况，便于维护管理，当然也可以使用约定式路由，即读取 pages 下文件名，根据文件命名规则来自动生成路由。但这种约束性我感觉还是不太方便，个人还是习惯自己配置路由规则。

首先改造 `index.tsx` 入口文件，代码如下：

```ts
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import routerConfig from './router/index'
import './base.less'

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        {
          routerConfig.routes.map((route) => {
            return (
              <Route key={route.path} {...route} />
            )
          })
        }
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
```

router/index.ts 文件配置，代码如下：

```ts
import BlogsList from '@/pages/blogs/index'
import BlogsDetail from '@/pages/blogs/detail'

export default {
  routes: [
    { exact: true, path: '/', component: BlogsList },
    { exact: true, path: '/blogs/detail/:article_id', component: BlogsDetail },
  ],
}
```

#### Service 管理

跟收敛路由是一样的意思，收敛接口也可以统一修改、管理这些请求，如果有复用接口修改可以从源头处理。

所有项目请求都放入 service 目录，建议每个模块都有对应的文件管理，如下所示：

```ts
import * as information from './information'
import * as base from './base'

export {
  information,
  base
}
```

这样可以方便管理请求，base.ts 作为业务请求类，可以在这里处理一些业务特殊处理。

```ts
import { request } from '../until/request'

const prefix = '/api'

export const getAllInfoGzip = () => {
  return request({
    url: `${prefix}/apis/random`,
    method: 'GET'
  })
}
```

util/request 作为统一引入的请求方法，可以自行替换成 fetch、axios 等请求库，同时可以在此方法内封装通用拦截逻辑。

```ts
import qs from 'qs'
import axios from "axios";

interface IRequest {
    url: string
    params?: SVGForeignObjectElement
    query?: object
    header?: object
    method?: "POST" | "OPTIONS" | "GET" | "HEAD" | "PUT" | "DELETE" | undefined
}

interface IResponse {
    count: number
    errorMsg: string
    classify: string
    data: any
    detail?: any
    img?: object
}

export const request = ({ url, params, query, header, method = 'POST' }: IRequest): Promise<IResponse> => {
    return new Promise((resolve, reject) => {
        axios(query ? `${url}/?${qs.stringify(query)}` : url, {
            data: params,
            headers: header,
            method: method,
        })
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                reject(error)
            })
    })
}
```

具体通用拦截，请参考 axios 配置，或者自己改写即可，需要符合自身的业务需求。

在具体业务开发使用的时候可以按照模块名引入，容易查找对应的接口模块。

```ts
import { information } from "@/service/index";

const { data } = await information.getAllInfoGzip({ id });
```

> 这套规则同样可以适用于 store、router、utils 等可以拆开模块的地方，有利于项目维护。

上述是针对项目做了一些业务开发上的配置与约定，各位同学可以根据自己团队中的规定与喜好行修改。

### 资源添加版本号

在之前的内容中，应该知道创建版本的时候已经引入了版本号的概念，在创建分支版本的时候，也会带上版本号，创建的分支名为 feat/0.0.01，而我们发布的静态资源也是带了版本

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c6cb112641d4f3a853a937f22f29181~tplv-k3u1fbpfcp-zoom-1.image)

#### 改造 Webpack 路径

```javascript
const branch = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '')
const version = branch.split('/')[1] // 获取分支版本号

output: {
  publicPath: `./${version}`,
}
```

如上，我们先将分支版本号获取，再修改资源引用路径，即可完成资源版本的处理，如下图所示，h5 链接被修改成常规 url，**引用资源带上了版本号**

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a35be91aea034df0bb23fdfe0589a6d3~tplv-k3u1fbpfcp-zoom-1.image)

#### 版本号的优势

1.  可以快速定位 code 版本，针对性的修复
2.  每个版本资源保存上在 cdn 上，快速回滚只需要刷新 html，不必重新构建发布

### Webpack Plugin 开发

每次都手动修改版本号是不科学的也不可控的，所以需要借助插件来解决这个问题

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');
const childProcess = require('child_process')
const branch = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '')
const version = branch.split('/')[1]

class HotLoad {
  apply(compiler) { 
    compiler.hooks.beforeRun.tap('UpdateVersion', (compilation) => {
      compilation.options.output.publicPath = `./${version}/`
    })
  }
}

module.exports = HotLoad;

module.exports = {
  plugins: [
    new HotLoad() 
]}
```

如上，我们创建一个 webpack plugin，通过监听 webpack hooks 在任务执行之前修改对应的资源路径。

### 高级定制化

#### CDN 资源引入

之前我们引入了 cdn 的概念，所以可以将上述插件升级，构建的时候引入通用的 CDN 资源，减少构建与加载时间。

```javascript
const scripts = [
  'https://cdn.bootcss.com/react-dom/16.9.0-rc.0/umd/react-dom.production.min.js',
  'https://cdn.bootcss.com/react/16.9.0/umd/react.production.min.js'
]

class HotLoad {
  apply(compiler) { 
    compiler.hooks.beforeRun.tap('UpdateVersion', (compilation) => {
      compilation.options.output.publicPath = `./${version}/`
    })
    
    compiler.hooks.compilation.tap('HotLoadPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('HotLoadPlugin', (data, cb) => {
        scripts.forEach(src => [
          data.assetTags.scripts.unshift({
            tagName: 'script',
            voidTag: false,
            attributes: { src }
          })
        ])
        cb(null, data)
      })
    })
  }
}
```

上述我们借助了 HtmlWebpackPlugin 提供的 alterAssetTags hooks，主动添加了 react 相关的第三方 cdn 链接，这样在生产环境中，同域名下面的项目，可以**复用资源**。

#### 通过缓存解决加载 js

对于长期不会改变的静态资源，可以直接将资源缓存在本地，下次项目打开的时候可以直接从本地加载资源，提高二次开启效率。

首先，我们选择 indexDB 来进行缓存，因为 indexDB 较 stroage 来说，容量会更大，我们本身就需要缓存比较大的静态资源所以需要更大容量的 indexDB 来支持

```javascript
import scripts from './script.json';
import styles from './css.json';
import xhr from './utils/xhr'
import load from './utils/load'
import storage from './stroage/indexedDb'

const _storage = new storage()
const _load = new load()
const _xhr = new xhr()

class hotLoad {

  constructor(props) {
    this.loadScript(props)
    this.issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  }

  async loadScript(props = []) {
    const status = await _storage.init()
    let _scripts = scripts
    const expandScripts = props

    if (status) {
      for (let script of _scripts) {
        const { version, type = 'js', name, url } = script
        if (this.issafariBrowser) {
          await _load.loadJs({ url })
        } else {
          const value = await _storage.getCode({ name, version, type });
          if (!value) {
            const scriptCode = await _xhr.getCode(url || `${host}/${name}/${version}.js`)
            if (scriptCode) {
              await _load.loadJs({ code: scriptCode })
              await _storage.setCode({ scriptName: `${name}_${version}_${type}`, scriptCode: scriptCode })
            }
          } else {
            await _load.loadJs({ code: value })
          }
        }
      }

      for (let style of styles) {
        const { url, name, version, type = 'css' } = style
        if (this.issafariBrowser) {
          await _load.loadCSS({ url })
        } else {
          const value = await _storage.getCode({ name, version, type })
          if (!value) {
            const cssCode = await _xhr.getCode(url || `${host}/${name}/${version}.css`)
            _storage.setCode({ scriptName: `${name}_${version}_${type}`, scriptCode: cssCode })
            _load.loadCSS({ code: cssCode })
          } else {
            _load.loadCSS({ code: value })
          }
        }
      }
    } else {
      for (let script of _scripts) {
        const { version, name } = script
        const scriptCode = await _xhr.getCode(script.url || `${host}/${name}/${version}.js`)
        if (scriptCode) {
          await _load.loadJs({ code: scriptCode })
        }
      }
      for (let style of styles) {
        const { url, name, version } = style
        const cssCode = await _xhr.getCode(url || `${host}/${name}/${version}.css`)
        _load.loadCSS({ code: cssCode })
      }
    }

    for (let script of expandScripts) {
      const { url } = script
      await _load.loadJs({ url })
    }

  }
}

window.hotLoad = hotLoad
```

上述代码是将第三方资源，通过 xhr 获取之后，使用 Blob + URL.createObjectURL 制造本地链接，使用 js 动态添加到页面中去。

```javascript
class load {
  constructor() { }
  // 加载js
  loadJs({ url, code, callback }) {
    let oHead = document
      .getElementsByTagName('HEAD')
      .item(0);
    let script = document.createElement('script');
    script.type = "text/javascript";
    return new Promise(resolve => {
      if (url) {
        script.src = url
      } else {
        let blob = new Blob([code], { type: "application/javascript; charset=utf-8" });
        script.src = URL.createObjectURL(blob);
      }
      oHead.appendChild(script)
      if (script.readyState) {
        script.onreadystatechange = () => {
          if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;
            callback && callback();
            resolve(true)
          }
        }
      } else {
        script.onload = () => {
          callback && callback();
          resolve(true)
        }
      }
    })
  }

  // 加载css
  loadCSS({ url, code }) {
    let oHead = document
      .getElementsByTagName('HEAD')
      .item(0);
    let cssLink = document.createElement("link");
    cssLink.rel = "stylesheet"
    return new Promise(resolve => {
      if (url) {
        cssLink.href = url
      } else {
        let blob = new Blob([code], { type: "text/css; charset=utf-8" });
        cssLink.type = "text/css";
        cssLink.rel = "stylesheet";
        cssLink.rev = "stylesheet";
        cssLink.media = "screen";
        cssLink.href = URL.createObjectURL(blob);
      }
      oHead.appendChild(cssLink);
      resolve(true)
    })
  }
}

// 通过 xhr 拉取静态资源
class xhr {
  constructor() {
    this.xhr;
    if (window.XMLHttpRequest) {
      this.xhr = new XMLHttpRequest();
    } else {
      this.xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
  }

  // 同步请求js
  getCode(url) {
    return new Promise(resolve => {
      this.xhr.open('get', url, true);
      this.xhr.send(null);
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState == 4) {
          if (this.xhr.status >= 200 && this.xhr.status < 300 || this.xhr.status == 304) {
            resolve(this.xhr.responseText)
          }
        }
      }
    })
  }
}
```

**弱网环境下的直接加载**

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc9bae7b87c647b6a27da09ba800156f~tplv-k3u1fbpfcp-zoom-1.image)

**弱网环境下的缓存加载**

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/963d8129dea24256928d7e49ca19e700~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bab8a299446d498f8a071447d8af78bd~tplv-k3u1fbpfcp-zoom-1.image)

对比上图，可以明显看出，在网络环境波动的情况下，有缓存加持的网页二次开启的速度会**明显提效**，当然在性能上，由于需要判断第三方静态资源版本以及从本地读取资源，会消耗部分时间，可以针对业务自行取舍。

##### 优劣势对比

**优势**

1.  统一接管项目的依赖，可以针对性的升级通用资源。
2.  资源有版本依赖概念，缓存在本地的时候，可以快速切换版本。
3.  二次加载速度会上升。
4.  配合 Service Worker 有奇效。

**劣势**

1.  统一升级的过程，可能有引用项目存在不匹配造成程序崩溃的情况。
2.  其实强缓存所有共用静态 cdn 资源也是 ok 的，干嘛那么费劲呢？

## CLI 升级改造

在上述自定义 React 脚手架搭建完毕之后，我们如果直接用使用上一章搭建出来的 CLI 来构建项目是不会构建成功的，还有印象的同学，应该记得之前的 CLI 的入口文件是 `src/index.js`，html 模板使用的是 `public/index.html`。

很明显可以看出，此时的 CLI 是远远达不到要求的，我们并不能在每一次开发的时候都需要对 CLI 进行更新，这样是违背 CLI 的通用性原则。

那么该如何解决这个问题呢？

### 自定义配置文件

根目录新建 `cli.config.json` 文件，此文件将是需要读取配置的文件。

将此项目的自义定配置写入文件，供给 CLI 读取。

```json
{
  "entry": {
    "app": "./src/index.tsx"
  },
  "output": {
    "filename": "build.js",
    "path": "./dist"
  },
  "template": "tpl/index.html"
}
```

CLI 同步进行改造，代码如下：

```ts
require('module-alias/register')
import webpack from 'webpack';
import { getCwdPath, loggerTiming, loggerError } from '@/util'
import { loadFile } from '@/util/file'
import { getProConfig } from './webpack.pro.config'
import ora from "ora";

export const buildWebpack = () => {

  const spinner = ora('Webpack building...')

  const rewriteConfig = loadFile(getCwdPath('./cli.config.json')) // 读取脚手架配置文件

  const compiler = webpack(getProConfig(rewriteConfig));

  return new Promise((resolve, reject) => {
    loggerTiming('WEBPACK BUILD');
    spinner.start();
    compiler.run((err: any, stats: any) => {
      console.log(err)
      if (err) {
        if (!err.message) {
          spinner.fail('WEBPACK BUILD FAILED!');
          loggerError(err);
          return reject(err);
        }
      }
    });

    spinner.succeed('WEBPACK BUILD Successful!');
    loggerTiming('WEBPACK BUILD', false);
  })
}
```

`webpack.pro.config.ts` 代码如下：

```ts
import getBaseConfig from './webpack.base.config'
import { getCwdPath, } from '@/util'

interface IWebpackConfig {
  entry: {
    app: string
  }
  output: {
    filename: string,
    path: string
  }
  template: string
}

export const getProConfig = (config: IWebpackConfig) => {
  const { entry: { app }, template, output: { filename, path }, ...rest } = config

  return {
    ...getBaseConfig({
      mode: 'production',
      entry: {
        app: getCwdPath(app || './src/index.js')
      },
      output: {
        filename: filename || 'build.js',
        path: getCwdPath(path || './dist'), // 打包好之后的输出路径
      },
      template: getCwdPath(template || 'public/index.html')
    }),
    ...rest
  }
}
```

通过 `loadFile` 函数，读取脚手架自定义配置项，替换初始值，再进行项目构建，构建结果如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/03732260df604ea8b736b23ad0f9eb84~tplv-k3u1fbpfcp-watermark.image)

> 这个自定义配置只是初步的，后期可以自定义添加更多的内容，例如自定义的 babel 插件、webpack 插件、公共路径、反向代理请求等等。

### 接管 dev 流程

与接管构建流程类似，在我们进行自定义脚手架构建之后，可以以此为基础将项目的 dev 流程也接管，避免项目因为开发与构建的依赖不同而导致构建失败，从源头管理项目的规范与质量。

在前面脚手架中配置的 webpack-dev-server 是基于 webpack-cli 来使用的。

既然使用 CLI 接管 dev 环境，那么也就不需要将 `webpack-dev-server` 作为 `webpack` 的插件使用，而是直接调用 `webpack-dev-server` 的 `Node Api`。

将刚刚的脚手架的 webpack-dev-server 配置抽离，相关配置放入 CLI 中。

```ts
const WebpackDevServer = require('webpack-dev-server/lib/Server')

export const devWebpack = () => {
  const spinner = ora('Webpack running dev ...')

  const rewriteConfig = loadFile(getCwdPath('./cli.config.json'))
  const webpackConfig = getDevConfig(rewriteConfig)

  const compiler = webpack(webpackConfig);

  const devServerOptions = {
    contentBase: 'dist',
    hot: true,
    historyApiFallback: true,
    compress: true,
    open: true
  };
  
  const server = new WebpackDevServer(compiler, devServerOptions);

  server.listen(8000, '127.0.0.1', () => {
    console.log('Starting server on http://localhost:8000');
  });
}
```

然后在脚手架的 package.json scripts 添加对应的命令就可以完成对 dev 环境的接管，命令如下：

```json
"scripts": {
     "dev": "cross-env NODE_ENV=development fe-cli webpack",
     "build": "cross-env NODE_ENV=production fe-cli webpack"
 }
```

运行对应的命令即可运行或者打包当前脚手架内容。

### 优化 webpack 构建配置

上一章就已经介绍过了，目前的构建产物结果很明显并不是我们想要的，也不符合普通的项目规范，所以需要将构建的配置再优化一下。

#### mini-css-extract-plugin

`mini-css-extract-plugin` 是一款样式抽离插件，可以将 css 单独抽离，单独打包成一个文件，它为每个包含 css 的 js 文件都创建一个 css 文件。也支持 css 和 sourceMaps 的按需加载。配置代码如下：

```ts
{
    rules: [
        test: /\.(css|less)$/,
            use: [MiniCssExtractPlugin.loader],
          }
    ]
}
  
plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
        ignoreOrder: true,
      })
    ]
```

#### 提取公共模块

我们可以使用 webpack 提供的 `splitChunks` 功能，提取 `node_modules` 的公共模块出来，在 webpack 配置项中添加如下配置即可。

```javascript
 optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
},
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2687f2fe2c87455abab8f4701004a219~tplv-k3u1fbpfcp-watermark.image)

如图，现在构建出来的产物是不是瞬间清晰多了。

#### 优化构建产物路径

上述的构建产物虽然已经优化过了，但是目录依然还不够清晰，我们可以对比下图的 cra 构建产物，然后进行引用路径的优化。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e218591420054c019e0e6c3bb5153744~tplv-k3u1fbpfcp-watermark.image)

其实很简单，将所有构建产物的路径前面统一添加 `static/js`，这样在进行构建得到的产物就如下图所示。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7288b3db68fa4e2da2518a3ee7125379~tplv-k3u1fbpfcp-watermark.image)

#### 配置增量构建（持久化缓存）

这是 webpack 5 的新特性，在 webpack 4 的时候，我们常用优化构建的手段是使用 `hard-source-webpack-plugin` 这个插件将**模块依赖**缓存起来，再第二次构建的时候会直接读取缓存，加快构建速度。

这个过程在 webpack 5 里面被 cache 替代了，官方直接内置了持久化缓存的功能，配置起来也非常方便，添加如下代码即可：

```ts
import { getCwdPath } from '@/util'

export default {
  cache: {
    type: 'filesystem',  //  'memory' | 'filesystem'
    cacheDirectory: getCwdPath('./temp_cache'), // 默认将缓存存储在 当前运行路径/.cache/webpack
    // 缓存依赖，当缓存依赖修改时，缓存失效
    buildDependencies: {
      // 将你的配置添加依赖，更改配置时，使得缓存失效
      config: [__filename]
    },
    allowCollectingMemory: true,
    profile: true,
  },
}
```

然后在运行构建或者开发的时候，会在当前运行目录生产缓存文件如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/553f6ef9a3ef4337be69b787b8a64df0~tplv-k3u1fbpfcp-watermark.image)

现在让我们一起来看看，构建速度的提升有多少：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd1c6a3b38594f8a8fe137c03cbd15a7~tplv-k3u1fbpfcp-watermark.image)

可以很明显看出，第一构建速度比之前要慢 2s 左右，但是第二次构建速度明显提升，毕竟脚手架目前的内容太少了，初次构建使用增量的时候会比普通编译多了存储缓存的过程。

这里有个需要注意的点，因为我们是调用 webpack 的 Node Api 来构建，所以需要显示关闭 compiler 才能正常生产缓存文件。

```ts
const compiler = webpack(webpackConfig);

  try {
    compiler.run((err: any, stats: any) => {

      if (err) {
        loggerError(err);
      } else {
        loggerSuccess('WEBPACK SUCCESS!');
      }
      compiler.close(() => {
        loggerInfo('WEBPACK GENERATE CACHE'); // 显示调用 compiler 关闭，生成缓存
      });
      loggerTiming('WEBPACK BUILD', false);
    });
  } catch (error) {
    loggerError(error)
  }
```

> 有兴趣的同学可以试试 dev 环境，启动速度一样会缩短到秒开级别。

## 接入 DevOps 流程

由于项目的权限系统全部都是以 GitLab 为基础的，所以接入的方式，我们可以选择两种

1.  所有的请求都通过 node 服务来调用
2.  部分的请求可以通过直接调用 GitLab 的 Api 来实现

那么为了 CLI 的通用性，我们选择第二种来实现。

#### 命令行交互工具

交互的方式也有很多种，例如启动一个 express 服务，网页页授权到本地，但对于 CLI 工具来说，我们可以使用 `inquirer` 来与用户进行交互。

首先要拿到用户的信息与 GitLab 的地址，所以交互的操作可以如下：

```ts
import inquirer from 'inquirer';
import { gitLabInit } from '@/gitlab'
import { loggerWarring } from '@/util'

const promptList = [
  {
    type: 'list',
    message: '请选择仓库类型:',
    name: 'gitType',
    choices: [
      "gitlab",
      "github",
    ]
  },
  {
    type: 'input',
    message: '请输入 Git 地址:',
    name: 'gitUrl',
    default: 'http://gitlab.cookieboty.com'
  },
  {
    type: 'input',
    message: '请输入用户名:',
    name: 'username',
    default: "cookieboty"
  },
  {
    type: 'password',
    message: '密码:',
    name: 'password',
  }
];

export default () => {
  inquirer.prompt(promptList).then((answers: any) => {
    const { gitType, gitUrl, username, password } = answers
    switch (gitType) {
      case 'gitlab': {
        gitLabInit(gitUrl, username, password)
        break
      }
      case 'github': {
        loggerWarring('Waiting')
        break
      }
      default: {
        gitLabInit(gitUrl, username, password)
      }
    }
  })
}
```

再将我们之前在 Egg 项目中封装过的 GitLab Api 迁移部分到 CLI 工具，这样我们可以根据拿到的用户名密码，通过 GitLab Api 获取到 token 保存在本地。

```ts
/**
 * @description: 获取用户信息
 * @param {string} username
 * @param {string} password
 * @return {*}
 */
export const getToken = async (gitUrl: string, username: string, password: string): Promise<IToken> => {
  const token = await gitPost<IToken>({
    GIT_URL: gitUrl,
    url: '/oauth/token',
    params: {
      grant_type: 'password',
      username,
      password,
    }
  });
  return token
}

/**
 * @description: 初始化 Git 信息
 * @param {string} gitUrl
 * @param {string} username
 * @param {string} password
 * @return {*}
 */
const gitLabInit = async (gitUrl: string, username: string, password: string) => {
  if (username && password) {
    try {
      const { access_token } = await getToken(gitUrl, username, password)
      writeFile(getDirPath('../config'), '.default.gitlab.config.json', JSON.stringify({
        "GIT_Lab_URL": gitUrl,
        "GIT_Lab_TOKEN": access_token
      }, null, "\t"))
      loggerSuccess('Login Successful!')
    } catch (error) {
      loggerError(error)
    }
  }
}

export {
  gitLabInit,
}
```

后续就可以通过 `access_token` 操作 GitLab 的 Api，同时由于我们的用户体系是基于 GitLab 的，所以可以将 Egg 提供的 CICD 与其他的项目管理能力也封装进 CLI 中。

## 本章小结

本章的内容较多，除了 React 脚手架的搭建之外，更多的是配合 CLI 的升级，与之前的 DevOps 项目的结合。

如果你有什么疑问，欢迎在评论区提出，或者加群沟通。 👏
    