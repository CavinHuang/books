
# 业务篇-如何写我们的Redux与File
---

## 如何编写我们的 Redux 与 jsonFile

上一章节，我们已将首页开发完毕，接下来将要进入简历制作，但在简历制作之前，我们先将数据存储模块加以实现。让我们思考篇一个问题点：

我们的简历平台最重要的是什么：数据！试想一下，你坐在电脑桌前，美滋滋的在做一份简历，隔壁家的熊孩子一不小心将你电源线拔了，电脑关机，数据丢失，此时你是不是很崩溃？你抱着最后一丝希望，重启应用，你是否期望应用能恢复你上次的数据信息？

本章节阿宽将带着小伙伴们，在应用中动手实现数据的储存：实时性数据存储与持久性数据存储。如果你忘了储存方案，可以回头看：👉 [设计篇-需求功能设计与数据存储方案设计](https://juejin.cn/book/6950646725295996940/section/6962435230061821952)

> 本章节将一步步带你实现建立平台应用中的数据存储层面的功能实现，这是一个循序渐进过程，如果你对本章节内容兴趣不大，可以快速阅读或跳过。

### 实时性数据存储

我们通过 redux 进行数据状态管理，为了避免繁琐的操作，采用 rc-redux-model 进行辅助开发，接下来跟着阿宽步伐，冲！

#### 1\. 安装

让我们先来安装一下

```js
npm install redux
npm install rc-redux-model --save-dev // 👉 安装这个库，简便redux操作
npm install redux-logger --save-dev // 👉 安装这个库，让我们在控制台看到redux数据
```

安装完成后，我们在 `app/renderer` 文件夹下，新增一个名为 `store` 的文件夹，存放着所有 redux model 相关的代码文件。在里面新增一个文件名为 `index.ts`，该文件主要引入我们所有的 model，经过 redux 的 API，导出一颗完整的数据状态树。（看下面代码注释）

```ts
// renderer/store/index.ts
import logger from 'redux-logger';
import RcReduxModel from 'rc-redux-model';
import { createStore, applyMiddleware, combineReducers } from 'redux';

// 👇 引入我们写好的 model
import globalModel from './globalModel';

// 👇 这里只需要调用 RcReduxModel 实例化一下得到最后的 reduxModel
const reduxModel = new RcReduxModel([globalModel]);

// 👇 无侵入式的使用 Redux，即使你写最原始的 reducer 也照样支持
const reducerList = combineReducers(reduxModel.reducers);

export default createStore(reducerList, applyMiddleware(reduxModel.thunk, logger));
```

上面我们引入了 `./globalModel`，那么我们在 store 文件夹下，追加一份 `globalModel.ts` 文件。

```ts
// renderer/store/globalModel.ts
const globalModel = {
  namespace: 'globalModel',
  openSeamlessImmutable: true,
  state: {
    appName: '简历应用平台',
  },
};

export default globalModel;
```

通过 [rc-redux-model](https://github.com/SugarTurboS/rc-redux-model) 官方文档介绍：在 model 中，**action 以及 reducer 我们均可忽略不写**。只需要定义好 state 值即可。

到目前为止，我们已经将 redux 文件信息创建好了，接下来在项目中使用，不过在使用前，先捋一下 react、redux、react-redux 的关系。

#### 2\. 为什么要用 react-redux

> 如果你还记得阿宽前面介绍的 react 数据流知识，想必你还有印象：当多个组件需要进行数据共享，交换双方的数据，**唯一的解决方案就是：提升 state**，将原本兄弟组件的 state 提升到共有的父组件中管理，由父组件向下传递数据，子组件进行处理，通过回调函数回传修改 state，这样的 state 一定程度上是响应式的。redux 也是这样的原理！

要知道 redux 是不区分技术栈的，意味着你也可以在 vue 中使用，只是我们经常搭配套餐使用 react。如上述的代码，我们通过 `createStore` 导出了数据状态树后，在组件中，我们如何得到数据值呢？只能通过 redux 提供的 `store.getState()` API，意味着我们每个组件都需要写:（下面为伪代码）

```js
import store from './store/index.ts';

function Home() {
  // 👇 每个组件都需要这么写才能拿到数据
  const state = store.getState();
}
```

另一种方式是你可以在根组件获取 store，通过 Props 层层传递，如果你中间组件断层，没传递 Props，就会导致下层组件获取不到值，为了在使用上简洁方便，我们才引入了 react-redux 库。

让我们安装一下

```
npm install react-redux
```

#### 3\. 在组件中使用 redux

当你捋清楚三者关系并安装 react-redux 之后，接下来在组件中使用 redux 不再是困难的事。我们将经过 `createStore` 生成的 store 挂载到 react-redux 提供的 Provider 组件上，这个 Provider 的工作任务是：通过 context 向子组件提供 store。

多说无益，上手试试，我们进入根组件 app.tsx 将其进行修改

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './router';

// 👇 引入 store
import store from './store';

// 引入 Provider
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

刷新一下页面，没有发生报错，也不会出现白屏，接下来我们在首页入口模块获取一下 redux 中的数据吧～ 上面我们已经给了一个初始值，`appName="简历应用平台"`，我们修改一下首页模块的 index.tsx

```ts
// renderer/container/root/index.tsx
import { useSelector } from 'react-redux';

function Root() {
  const appName = useSelector((state: any) => state.globalModel.appName);
  console.log('appName = ', appName);
}
```

刷新一下页面，打开控制台，看看打印的数据，很完美符合我们的预期。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7739510d860441fab7fbde1f6cd3c82f~tplv-k3u1fbpfcp-watermark.image)

#### 4\. 在组件中修改 redux

既然可以获取 redux 数据值，自然而然地，我们也需要修改 redux 的值。在[redux 官方文档](https://redux.js.org/introduction/core-concepts)中，很明确提到：**唯一改变 state 的方法就是触发 action**。

通过 dispatch 发起一个 action 就能修改 state 值，但仔细一想，每个 state，都对应一个 action，在简历这种多 state 值下，这是不是很麻烦呢？得益于 rc-redux-model，`它提供一个 action API，只需记住一个 action，就能修改 state 的任意值`。接下来我们来修改一下

```ts
// renderer/container/root/index.tsx
import { useSelector, useDispatch } from 'react-redux';

function Root() {
  const dispatch = useDispatch();
  const appName = useSelector((state: any) => state.globalModel.appName);

  useEffect(() => {
    setTimeout(() => {
      console.log('3s 后修改...');
      dispatch({
        type: 'globalModel/setStore',
        payload: {
          key: 'appName',
          values: 'visResumeMook',
        },
      });
    }, 3000);
  }, []);

  useEffect(() => {
    console.log('appName = ', appName);
  }, [appName]);
}
```

解读一下上面代码，我们在生命周期 `didMount` 中写了一段延时方法，在 3s 之后修改 appName，紧接着对 appName 进行监听，当它修改时，打印当前最新的值。小伙伴们猜测一下，3s 后数据是不是会发生改变呢？刷新页面，打开控制台，发现一切如我们预期一致。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c5e0e4e45b44a618d3a86b94479ba49~tplv-k3u1fbpfcp-watermark.image)

至此，我们能够已经能够项目中使用 redux 进行实时性数据的存储，更多的使用在接下来的实战过程中会讲到。

### 持久性数据存储

我们采用文件形式进行持久性数据存储，最重要的就是对文件的增删改查，接下来，我们实现一套文件操作方法，需要支持的方法有：

- 文件的创建
- 文件的读取
- 文件的更新
- 文件的删除
- 文件是否存在
- 文件是否可读
- 文件是否可写

得益于渲染进程也能使用 NodeJS 模块，我们可以通过 fs 进行文件相关的操作。通过 [Node 官网](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_readfile_path_options_callback) 我们发现大部分的函数方法都是通过回调函数的形式，将数据值返回，这样会造成 `回调地狱` 的形式。

仔细一想，通过 Promise 方式是否对我们更加友好？但好像改造成 Promise 又增加我们的工作量，有没有现成的 API 可用呢？在 Node 10 之后，提供了 [fs Promises API](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_promises_api) ，这里我们通过官方提供的 API 即可实现 Promise 操作 fs 模块。

下面通过实战进行开发，这是一个通用的工具方法，并且期望对文件的操作都进行统一管理，我们可以在 `renderer/common/utils` 中，新增一个名为 file.ts 的文件

```js
// renderer/common/utils/file.ts
// 👇 先打印一下Node版本
console.log(`Node Version：${process.versions.node}`);
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/21f7db92b43e47e5ab62444d2f75812b~tplv-k3u1fbpfcp-watermark.image)

> 在开发前请小伙伴们确定你的 Node 版本是 10 以上，这里阿宽的 Node 版本在 14，可以使用 fs Promises API，如果小伙伴们的 Node 版本较低，可以考虑升级或者自己尝试改造成 Promise 形式哦～

接下来我们封装一下 file.ts 的实现

```ts
// renderer/common/utils/file.ts
import fs, { promises as fsPromiseAPIs } from 'fs';

const fileAction = {
  read: (path: string, encoding: BufferEncoding): Promise<string> => {
    return fsPromiseAPIs.readFile(path, { encoding: encoding || 'utf8' });
  },
  write: (path: string, content: string, encoding: BufferEncoding): Promise<void> => {
    return fsPromiseAPIs.writeFile(path, content, { encoding: encoding || 'utf8' });
  },
  rename: (oldPath: string, newPath: string) => {
    return fsPromiseAPIs.rename(oldPath, newPath);
  },
  delete: (path: string) => {
    return fsPromiseAPIs.unlink(path);
  },
  hasFile: (path: string) => {
    return fsPromiseAPIs.access(path, fs.constants.F_OK);
  },
  canWrite: (path: string) => {
    return fsPromiseAPIs.access(path, fs.constants.W_OK);
  },
  canRead: (path: string) => {
    return fsPromiseAPIs.access(path, fs.constants.R_OK);
  },
};

export default fileAction;
```

接下来我们在简历模块处，读取一下文件内容，修改一下 `container/resume/index.ts`

```ts
// renderer/container/resume/index.ts
import React from 'react';
import './index.less';
import fileAction from '@common/utils/file';

function Resume() {
  // 👇 读取一下当前这个文件内容
  fileAction.read('./index.tsx').then((data) => {
    console.log(data);
  });

  return <div>我是简历模块</div>;
}
export default Resume;
```

将项目跑起来，进入到简历路由页面下，看看控制台输出什么？

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b73e70357c9e4f738efb03be53d572b1~tplv-k3u1fbpfcp-watermark.image)

读取错误，那怎样才能读到文件内容？是不是绝对路径就没问题呢？我们先试试这样能否读到文件数据

```ts
fileAction
  .read(
    '/Users/pengdaokuan/Desktop/pdk/visResumeMook/app/renderer/container/resume/index.tsx'
  )
  .then((data) => {
    console.log(data);
  });
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b046b4ccde84bb8aeb8b285e03919a5~tplv-k3u1fbpfcp-watermark.image)

通过上图可以看到，绝对路径是能读到文件数据的，于是问题聚焦于：我们如何获取当前应用程序所在目录？也就是 `/Users/pengdaokuan/Desktop/pdk/visResumeMook` 路径的获取。

**electron 提供一个 [app](https://www.electronjs.org/docs/api/app#app) 模块**，该模块提供了一个 [getAppPath\(\)](https://www.electronjs.org/docs/api/app#appgetapppath) 方法，用于获取当前应用程序在本机中的目录路径，但有个问题在于，该 app 模块仅能在主进程中使用，而我们期望在渲染进程中得到此目录路径，只能通过 IPC 进程间通信获取。

#### IPC 获取应用程序所在的目录路径

在 utils 目录下，新增一个文件名为：appPath.ts，该文件用于获取项目的绝对路径。我们通过 Promise 来写一下它：

```ts
// renderer/common/utils/appPath.ts

// 监听主进程与渲染进程通信
import { ipcRenderer } from 'electron';

// 获取项目绝对路径
export function getAppPath() {
  return new Promise(
    (resolve: (value: string) => void, reject: (value: Error) => void) => {
      ipcRenderer.send('get-root-path', '');
      ipcRenderer.on('reply-root-path', (event, arg: string) => {
        if (arg) {
          resolve(arg);
        } else {
          reject(new Error('项目路径错误'));
        }
      });
    }
  );
}
```

接着我们在主进程中，通过 app 模块获取项目路径，通过 ipcMain 回复渲染进程，修改一下 `app/main/electron.ts`

```ts
import { app, ipcMain } from 'electron';

const ROOT_PATH = path.join(app.getAppPath(), '../');

// 👇 监听渲染进程发的消息并回复
ipcMain.on('get-root-path', (event, arg) => {
  event.reply('reply-root-path', ROOT_PATH);
});
```

这时候我们再回过头去简历模块处，稍微修改

```ts
import React from 'react';
import './index.less';
import fileAction from '@common/utils/file';
import { getAppPath } from '@common/utils/appPath';

function Resume() {
  getAppPath().then((rootPath: string) => {
    console.log('应用程序的目录路径为: ', rootPath);
    console.log('文件读取，内容数据为: ');
    fileAction
      .read(`${rootPath}app/renderer/container/resume/index.tsx`)
      .then((data) => {
        console.log(data);
      });
  });

  return <div>我是简历模块</div>;
}
export default Resume;
```

一定要记住，修改完之后，重新跑一下主进程命令，因为主进程并不会热更新

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc70221b7e524692a5d8e466ef0ab266~tplv-k3u1fbpfcp-watermark.image)

上图所示，我们就完成了持久性数据文件的基本操作，对于更新、新增、删除文件等操作这边就不演示了，小伙伴们可以拉取一下：[👉 chapter-07](https://github.com/PDKSophia/visResumeMook/tree/chapter-07) 分支代码进行阅读哈

## 代码优化

上面我们实现了基本功能，接下来我们优化一下代码，将上边为了验证 Redux 的无用代码删除，并且为各方法添加对应注释与类型约束。

这里的优化相对简单，大部分是注释补全与类型约束，优化后的代码可访问: [👉 chapter-07-op](https://github.com/PDKSophia/visResumeMook/tree/chapter-07-op) 分支

## 总结

本章节主要带着大家在项目中使用 Redux 以及对本地文件的一系列操作，**数据存储是应用程序至关重要的一环**，掌握它是我们实战开发中的重中之重。接下来将使用封装好的方法进行信息的录入和存储。

**如果您在边阅读边实践时，发现代码报错或者 TS 报错，那么小伙伴们可以根据报错信息，去线上看看相应的代码。**

如果对本章节存在疑问，欢迎在评论区留言。
    