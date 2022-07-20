
# 基础篇-Electron初步认识并掌握基础知识
---

## 你好，初次见面

本小节主要介绍 Electron 相关知识，整篇内容相对较长，请耐住性子阅读。

> 如果对 Electron 熟悉的同学，本章可以快速阅读或跳过，如果对 Electron 不熟悉的同学，希望本章节可以帮你快速熟悉 Electron 开发

我们访问它的[官网](https://www.electronjs.org/)，映入眼帘的是：**使用 JavaScript，HTML 和 CSS 构建跨平台的桌面应用程序**

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8f0d4dfbe672427db5657b0d0c547299~tplv-k3u1fbpfcp-watermark.image)

以前我们被称为切图仔，慢慢地，我们有了个头衔，叫做前端工程师，大部分情况下，我们前端仔都是跟浏览器打交道，如果会点 Node，还能写点后端秀一把。但如果涉及到“禁区”：原生应用，那就无能为力、束手无策了。

这时，天降正义，Electron 出现了，它建立在 Chromium 和 Node 之上，为我们提供了很多封装好的模块，跟系统原生 API 互通。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36ea79200054427ebe85a297e7d4ae3a~tplv-k3u1fbpfcp-watermark.image)

- Chromium 为 Electron 提供了强大的 UI 能力，让我们采用吃饭家伙进行开发页面
- Electron 内部支持 NodeJS 模块，让我们在写 UI 的同时，能够拥有操作系统底层 API 的能力，比如常用的 fs、path、child\_process 模块

可以这么理解，Chromium 负责界面展示，Node 负责背后逻辑，**你负责貌美如花，我负责赚钱养家**。

可喜可贺，Electron 还具有跨平台的特性，不同系统底层提供的 API 不同，但 Chromium、Node 本身就跨平台，帮我们处理了大部分跨平台的兼容问题，当然 Electron 在一些场景下，也做了一些跨平台的兼容处理，不得不说，Electron 真香。

## 应用程序结构

Electron 有三大核心

- **Chromium** 用于显示网页内容。
- **Node.js** 用于本地文件系统和操作系统。
- **Native APIs** 用于使用经常需要的本机函数。

另外 Electron 最重要的两大灵魂：**主进程和渲染进程**。在讲主进程与渲染进程，我们先来了解一下进程和线程，才能更好的了解 Electron 中的主进程和渲染进程。

## 进程与线程

### 为什么会有进程？

在刀耕火种时期，那时候操作系统混得不太行，只带得动一个运行程序小弟，随着科技的发展，党和人民的努力，CPU 的能力越来越强，内存越来越大，计算机混得越来越好，可以带更多的运行程序小弟。可随着运行程序越来越多，随机带来一系列的问题：

- 多个程序使用的数据如何辨别？
- 当一个程序暂停时，又如何恢复到它之前执行的状态？

为解决上述问题，进程就被发明出来了，用进程来对应一个程序，各个进程之间互不干扰，进程会保存了程序各个时刻的运行状态，当进程暂停时，它会将当前进程的状态（如进程标识、进程使用资源等）记在小本本上，在下次切换进程时，恢复该进程的之前状态。**进程就是一段程序动态执行过程。**

### 为什么会有线程？

我们所期望，每个进程能干更多的事，毕竟一个进程，在一个时间点上，只能干一件事，想同时干多件事，有点强人所难了。其次进程执行过程中，如果阻塞，整个进程就会被挂起。直到条件允许，操作系统才会将该进程从阻塞态变为就绪态，等待进程调度。

举个例子：将职级答辩看成一个进程，我们作为评委，`工作任务就是耳听答辩者演讲，眼看申请的职级 PPT，脑子还要想今天下班去吃什么`，才能高效完成职级答辩的任务。如果只提供进程这个机制，那么这三件事将不可能同时执行；其次答辩者如果演讲过程语塞了，他急了慌了，在思考如何救场，而我们呢？阻塞，停留在听或者看的环节，不能趁这个时候想想，吃谁家火锅，喝哪家奶茶。

为了解决上述的问题，线程出现了。

### 什么是进程？

进程是对运行时程序的封装，它是系统进行资源调度和分配的基本单位；

### 什么是线程？

线程是进程的子任务，是 CPU 调度和分派的基本单位，是操作系统可识别的最小执行和调度单位。

### 线程和进程的关系

1.  进程至少含一个线程，每一个进程都有一个主线程，进程能够创建、撤销线程；线程能创建线程，不能创建进程。
2.  进程拥有独立的内存地址，**多个进程之间的资源不共享，如果需要通信，可以通过 IPC**；线程无独立的内存地址，某个进程下的所有线程（可以直接读写进程数据段）共享该进程所拥有的所有资源。
3.  进程崩溃不会影响其他进程，线程挂了进程也会发生崩溃。

下图概括了进程与线程之间的关系，以及它们的通信方式

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7ffc1acd48c4986beb9fb2a58f388ea~tplv-k3u1fbpfcp-watermark.image)

## Electron 中的主进程和渲染进程

在 Electron 中，两大灵魂人物：[主进程与渲染进程](https://www.electronjs.org/docs/tutorial/quick-start#%E4%B8%BB%E8%BF%9B%E7%A8%8B%E5%92%8C%E6%B8%B2%E6%9F%93%E5%99%A8%E8%BF%9B%E7%A8%8B)，他两各司其职。

主进程就像是一个桥梁，连接着操作系统和渲染进程，等价于计算机和页面的中间人。在 Electron 中，运行 package.json 中的 main 脚本中的进程，我们称之为主进程。

> 在主进程中创建浏览器窗口（我们称之为渲染进程窗口），窗口加载我们的 Web 页面，通过运行主进程脚本，启动整个应用程序。

**一个 Electron 只会存在一个主进程，但它可以存在多个渲染进程**，由于 Electron 使用了 Chromium 来展示 UI 界面 \(应用程序中被称为 BrowserWindow\)，自然而然地，Chromium 的多进程架构也被引入。`当主进程每创建一个独立的 BrowserWindow 实例，Electron 都会初始化一个独立的渲染进程，隔离了不同窗口之间的环境`，每一个渲染进程，只需要关心自己内部的 Web 页面。

主进程这个职位很重要，它有什么特点呢？

- 可以使用和系统对接的 ElectronAPI，比如菜单创建等
- 支持 NodeJS，在主进程可以任意使用 NodeJS 的特性
- 创建多个渲染进程（在本小册[第 17 章节](https://juejin.cn/book/6950646725295996940/section/6962940676258398222)有实践）
- 有且只有一个，并且是整个程序的入口文件
- 控制整个应用程序的生命周期

在主进程调用 `browserWindow` 时，会生成一个渲染进程并对应一个浏览器窗口，恰如其名，渲染进程是负责渲染 Web 网页内容的。**渲染进程的入口是一个 HTML 文件**，那么渲染进程的特点是什么？

- 可以使用部分 Electron 的 API
- 全面支持 NodeJS
- 存在多个渲染进程
- 可以访问 DOM API

下面我们来讲讲主进程与渲染进程可访问的模块范围，通过官网文档也可知：

> 下面是以 [v11.3.0](https://github.com/electron/electron/tree/v11.3.0/docs) 文档进行整理，大家一定要看一遍，毕竟当官网的搬运工也很累

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3f45f50395d4991925e1b98b514ad3c~tplv-k3u1fbpfcp-watermark.image)

这里需要补充一点，渲染进程还可以访问 `DOM API`、`Broswer API`，那么接下来通过代码，让大家看看代码中对应的主进程和渲染进程：👉 [代码访问](https://github.com/PDKSophia/visResumeMook/tree/electron-init)

在 `package.json` 中指定程序的入口文件 `electron.js`，换言之，我们有且只有一个的主进程

```json
{
  "name": "electron-demo",
  "author": "彭道宽",
  "main": "electron.js", // 入口文件，也就是我们的主进程
  "scripts": {
    "start": "electron ." // 脚本命令，启动应用
  }
}
```

我们定义一个 electron.js 文件，在该文件中，生成我们的渲染进程窗口，并加载 我们写好的 index.html

```typescript
/**
 * @desc electron 主进程
 */
import { app, BrowserWindow } from 'electron';

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.loadURL('./index.html');
}

app.whenReady().then(() => {
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
```

如上述代码所示，在主进程中，调用 Electron 提供的 `BrowserWindow` API 创建浏览器窗口，每一个浏览器窗口我们可以认为就是浏览器的 Tab。Electron 在创建独立的渲染进程窗口后，隔离不同窗口之间的环境。每一个渲染进程，只需要关心自己内部的 Web 页面。以上代码就是创建一个给定高宽的窗口，在窗口中加载我们写好的 html 页面。

```html
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World！</h1>
    我是 electron-demo
  </body>
</html>
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/521dac15a8764c2d94ed6b22abb79012~tplv-k3u1fbpfcp-watermark.image)

## 主进程与渲染进程通信

前边讲到，Electron 是基于 Chromium + NodeJS 开发的，我们的 Chrome 也是基于 Chromium 开发的，先来看看，运行 Chrome，打开一个页面，会存在哪些进程。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8867078da1484b37bb3193184d219c2a~tplv-k3u1fbpfcp-watermark.image)

也就是说，当我们打开浏览器，就会存在 1 个浏览器进程（在 Electron 中叫做主进程）、1 个 GPU 进程、1 个网络进程、N 个渲染进程和 M 个扩展插件进程。

我们知道，Chromium 采用了多进程架构，每一个 Tab 都是一个渲染进程，执行在独立的沙箱环境中，并且无法访问操作系统的原生资源。要知道，**不同的进程间内存资源都是相互隔离的，鉴于浏览器对本地数据有严格的访问限制**，我们通常都会通过诸如 localStorage、window.postMessage 等方式进行窗口间的数据通信。

该方式同样适用于 Electron 中，但窗口之间大量的数据传输以及频繁进行数据通信，让人不由深思，这种通信方案是否属于最佳？传输效率是否有所影响？

Electron 中提供了 [ipcMain](https://www.electronjs.org/docs/api/ipc-main) 与 [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer) 作为主进程以及渲染进程间通讯的桥梁。**其本质是通过命名管道 IPC** ，提供更高的效率以及安全性。

> 感兴趣的同学可以去了解下进程间通信方式，其中有管道、信号、消息队列、socket 套接字等

### ipcMain

作用于主进程中，处理从渲染器进程发送出来的异步和同步信息。

### ipcRenderer

作用于渲染进程，可以通过 ipcRenderer 将异步和同步信息发送到主进程，并且可以接收由主进程回复的消息。

### 为什么要进行主进程和渲染进程的通信？

我们不禁思考，为什么要进行主进程与渲染进程通信？如果你还记得主进程与渲染进程可访问的模块范围，那么你应该知道，主进程可访问的模块比渲染进程还要多，比如 `app 模块`只能作用于主进程，如果在渲染进程调用此模块则会报错。

你可能会觉得，那我渲染进程不调用这些模块不就好了？梦想很美好，但现实很残酷，我们总会在渲染进程中用到某些数据，该数据只能通过主进程访问特定模块才能获取，解决方式只能通过将主进程作为中间人，借助它的能力拿到数据之后，再通过 IPC 将数据发送给渲染进程。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/133ee5aa89224cf699172334508bca3f~tplv-k3u1fbpfcp-watermark.image)

上图所示，主进程与渲染进程之间通过 IPC 方式进行数据通信，下面我们通过一个实际场景例子，帮助小伙伴们理解主进程渲染进程之间的通信流程：

我们在渲染进程中，需要得到实战应用程序所在的目录（绝对路径），可通过 Electron 提供的 [app](https://www.electronjs.org/docs/api/app#appgetapppath) 模块里 `getAppPath` 方法获得，但 app 模块只能作用于主进程，无奈之下只能拜托主进程调用此模块，然后再通过 IPC 将数据返回，下面是获取目录路径的代码：

```ts
// 在渲染进程中
import { ipcRenderer } from 'electron';

// 1. 向主进程发送消息，期望得到应用程序的路径
ipcRenderer.send('get-root-path', '');
// 2. 监听从主进程发送回来的消息
ipcRenderer.on('reply-root-path', (event, arg: string) => {
  if (arg) {
    console.log('应用程序路径: ', arg);
  } else {
    console.log('获取应用程序的路径出错');
  }
});
```

```ts
// 在主进程中
import { app, ipcMain } from 'electron';

const ROOT_PATH = app.getAppPath(); // 获取应用程序的路径

// 3. 监听渲染进程发送过来的消息
ipcMain.on('get-root-path', (event, arg) => {
  // 4. 监听到之后，主进程发送消息进行回复
  event.reply('reply-root-path', ROOT_PATH);
});
```

### remote

remote 模块为渲染进程和主进程通信提供了一种简单方法，在 Electron 中, GUI 相关的模块仅在主进程中可用, 在渲染进程中不可用（如 app 模块），所以当我们在渲染进程中需要用到 GUI 相关模块方法的数据时，通常都是在主进程中调用，得到数据之后，通过 ipcMain、ipcRenderer 来告知渲染进程。

开发过程想调用 GUI 模块的方法时，都需要通过 IPC 的方式，是不是很麻烦？于是 remote 模块就发挥它的作用了。它允许你在渲染进程中，调用主进程对象的方法, 而不必显式地发送进程间消息。

自然而然的，上述获取实战应用程序所在的目录（绝对路径），可以改为

```ts
// 在渲染进程
const app = require('electron').remote.app;

const rootPath = app.getAppPath();
```

不要看这种方式很简单，实际上，remote 本质还是发送一个同步的 IPC 消息，remote 方法只是不用我们显式的写发送进程间的消息的方法而已。

**官方声明**：_此模块在 v12.x 版本之后已经被[废弃](https://github.com/electron/electron/issues/21408)，当然如果出于性能和安全性考虑仍要使用此模块，也不是不行，可通过 \@electron/remote 进行使用，但还是慎用！_

> The remote module is deprecated. Instead of remote, use ipcRenderer and ipcMain. If you still want to use remote despite the performance and security concerns, see \@electron/remote.

### 渲染进程之间通信？

目前官方并没有提供渲染进程之间互相通信的方式，只能通过主进程建立一个消息中转。比如渲染进程 A 与渲染进程 B 需要进行通信，那么渲染进程 A 先将消息发给主进程，主进程接收消息之后，再分发给渲染进程 B。

我们知道主进程有且只有一个，它工作任务很多，如渲染进程的创建、快捷键事件的定制、菜单栏的自定义等，此时我们再注入一大堆的消息通信逻辑，最终会使得我们的主进程变成一个大杂烩的进程。受[Sugar-Electron](https://github.com/SugarTurboS/Sugar-Electron)的启发，它内部封装了一个 [ipc 模块](https://github.com/SugarTurboS/Sugar-Electron/tree/master/core/ipc)，消息进程的逻辑在各自的渲染进程处理，感兴趣的小伙伴业余时间可前往官网进行了解。

### 通信原理

通过官方文档，我们可知 ipcMain 与 ipcRenderer 都是 [EventEmitter](http://nodejs.cn/api/events.html#events_class_eventemitter) 类的一个实例，而 EventEmitter 类是由 NodeJS 中的 events 模块导出。

EventEmitter 类是 NodeJS 事件的基础，实现了事件模型需要的接口，如 `addListerner`、`removeListerner`、`emit` 等工具方法。采用的是我们熟知的发布订阅模式。

以 ipcMain 为例，既然它是 EventEmitter 类的实例，我们不妨猜测，它的源码是不是这样呢？

```ts
const ipcMain = new EventEmitter();
```

下面以 `v11.3.0` 版本进行源码阅读，我们来看看 ipcMain 如何实现的（伪代码）

```ts
/**
 * 源码地址: https://github.com/electron/electron/blob/v11.3.0/lib/browser/ipc-main-impl.ts
 */
import { EventEmitter } from 'events';

export class IpcMainImpl extends EventEmitter {
  // ...
  handle = () => {};
  handleOnce = () => {};
}
```

```ts
/**
 * 源码地址: https://github.com/electron/electron/blob/v11.3.0/lib/browser/ipc-main-internal.ts
 */
import { IpcMainImpl } from './ipc-main-impl';

export const ipcMainInternal = new IpcMainImpl();
```

本质就是通过继承 EventEmitter，在其基础之上，扩展了部分的工具方法，如: handle、handleOnce 等，最后全局抛出一个单例的 ipcMainInternal。

## Electron 结构图

通过上述讲解，想必大家已经了解主进程与渲染进程的基础知识，明白进程间通信的方式及原理，下面再用一张图来回顾一下 Electron 的架构。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43bd9e4b9c1145a0aeeeeaf1bbc5dfae~tplv-k3u1fbpfcp-watermark.image)

我们可以看到，一个 Electron 就只会有一个主进程，多个渲染进程，进程之间我们通过 IPC 进行通信，并且可以看到，每个进程都可以调用 Native API ，意味着我们在主进程、渲染进程中可以调用部分原生模块的 API。同时主进程、渲染进程内置了 NodeJS 模块，所以我们可以全面使用 Node 特性。

## Electron 原生能力有哪些？

- 创建原生 GUI
  - 自定义应用菜单 Menu \([第 22 章有实践](https://juejin.cn/book/6950646725295996940/section/6962938070312157184)\)
  - dialog 对话框 \([第 22 章有实践](https://juejin.cn/book/6950646725295996940/section/6962938070312157184)\)
- 获取底层能力
  - 剪切板
  - 定制快捷键
  - 桌面级截屏
  - ...

上面只是暂列出 Electron 的部分原生能力，当然还有很多，这边暂时不做过多叙述。

## 总结

- Chromium + NodeJS + Native APIs = Electron
- Electron 兼容 Mac、Windows 和 Linux，可以构建出三个平台的应用程序
- 进程是对运行时程序的封装，它是系统进行资源调度和分配的基本单位
- 线程是进程的子任务，是 CPU 调度和分派的基本单位，是操作系统可识别的最小执行和调度单位
- 一个 Electron 应用有且只有一个主进程，主进程连接着操作系统和渲染进程的桥梁
- 可有多个渲染进程，渲染进程由主进程调用 `BrowserWindow` API 创建浏览器窗口，每一个窗口只需要关心自己内部的 Web 页面。
- 主进程和渲染进程可访问的模块大不同
- 主进程与渲染进程通信通过 ipcMain 和 ipcRenderer
- 官方未提供渲染进程之间的通信方式，只能通过主进程作为中间层
- remote 本质还是发送 ipc 同步消息，介于性能问题，官方不推荐使用 remote 作为通信方式
- ipcMain 和 ipcRenderer 均继承 EventEmitter 类，内部实现其他工具方法，最后全局导出单例 ipcMain 与 ipcRenderer

如果对本章节存在疑问，欢迎在评论区留言。
    