
# 定制篇-自定义 Electron 原生应用菜单
---

## 前言

本章节主要实现自定义原生应用菜单，如果你对本章节内容兴趣不大，可以快速阅读或跳过。

## 默认行为

我们在打开应用程序时，通常在左上角看到一些菜单项，以 `VSCode` 为例，下面是它的菜单项

![f6d564fd-d04e-4383-ae03-05ae70d64b65.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/354ddeefdfd54b3bb6cffe6474962d93~tplv-k3u1fbpfcp-watermark.image)

再看看我们的简历平台，也存在一系列的菜单项

![a077a533-264e-4af1-9014-6d2151c45788.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a2f5853ecb34e5ebd25293dd3e7ec11~tplv-k3u1fbpfcp-watermark.image)

可能有小伙伴就会问了，我都没写过这玩意，这哪来的呢？实际上，如果应用没有设置菜单的话，系统会生成一个默认菜单。 默认生成的菜单中包含了一些初始选项，例如  `文件`,`编辑`, `视图`,`窗口`,`帮助`。你可以参考这个 [electron-default-menu](https://github.com/carter-thaxton/electron-default-menu/blob/master/index.js)

默认菜单项肯定是难以满足我们的需求，**我们总会有一些奇奇怪怪的想法**，接下来，让我们自定义菜单行为，实现定制化的功能。

## 通过例子看实现

小伙伴们可以先去官方文档查看一下[Menu](https://www.electronjs.org/docs/api/menu)、[MenuItem](https://www.electronjs.org/docs/api/menu-item)相关的信息。接下来通过一个简单的例子，帮助大家了解一下 Elector 中的菜单栏～

我们在 `app/main` 文件夹下，新增`customMenu.ts`文件，顾名思义，这是我们自定义的菜单

```ts
// app/main/customMenu.ts

import { dialog, MenuItemConstructorOptions, MenuItem } from 'electron';

const customMenu: (MenuItemConstructorOptions | MenuItem)[] = [
  {
    label: '我是简历平台自定义菜单栏',
    role: 'help',
    submenu: [
      {
        label: '关于',
        click: function () {
          dialog.showMessageBox({
            type: 'question',
            title: '提问环节',
            message: '谁最帅 ?',
            detail: '彭于晏广州分晏，不接受反驳',
          });
        },
      },
    ],
  },
  {
    label: '自定义的编辑菜单栏',
    submenu: [
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
    ],
  },
];

export default customMenu;
```

接着在主进程中引入 `customMenu` 文件

```ts
// app/main/electron.ts
import { app, Menu } from 'electron';
import customMenu from './customMenu';

app.on('ready', () => {
  // ...
  const menu = Menu.buildFromTemplate(customMenu);
  Menu.setApplicationMenu(menu);
});
```

重新运行一下 `npm run start:main`，然后看看左上角的菜单栏是否发生了改变。

![a7203f97-5bb0-4da3-b869-86f7e273e5ca.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8472ecc4f36b47399f39de197e5998d9~tplv-k3u1fbpfcp-watermark.image)

与我们预期一致，让我们看看自定义菜单栏是如何实现的。

首先，我们的 Menu 菜单栏是在**主进程**中执行，Menu 提供了一个静态方法 `buildFromTemplate`，通过该方法，我们可以构建菜单栏。该方法的入参是一个 `MenuItemConstructorOptions` 类型的数组，用于构建 `MenuItem`。

每一条 `MenuItem` 的属性有很多，这边就不一一列举，感兴趣的小伙伴[可点击这里](https://www.electronjs.org/docs/api/menu-item#new-menuitemoptions)进行详细查看。

以上面例子的代码进行讲解，我们主要看几个属性：

- label 标签名
- submenu 子菜单
- role 菜单项的角色，[点击这里看具体值](https://www.electronjs.org/docs/api/menu-item#menuitemrole)
- accelerator 快捷键事件
- click 点击事件

下面以其中一个菜单项进行讲解，关键在注释！！！

```ts
const customMenu: (MenuItemConstructorOptions | MenuItem)[] = [
  {
    // 1. 一级菜单栏标签名称
    label: '我是简历平台自定义菜单栏',
    role: 'help',
    // 2. 该菜单栏下存在子菜单
    submenu: [
      {
        // 2.1 二级菜单栏标签名称
        label: '关于',
        // 2.2 该菜单的点击事件
        click: function () {
          dialog.showMessageBox({
            type: 'question',
            title: '提问环节',
            message: '谁最帅 ?',
            detail: '彭于晏广州分晏，不接受反驳',
          });
        },
        // 2.3 快捷键事件（我这边并为为此菜单注册快捷键事件）
        // accelerator: '',
      },
    ],
  },
];
```

了解菜单栏的组成属性之后，编写自定义菜单不再是难事！

## 快捷键事件

也许有小伙伴发懵了，怎么讲菜单栏，一下子就跳到快捷键了？其实上面对于菜单栏的相关基础内容已经讲解完毕，不过既然说到了快捷键事件，那就顺道过一下相关内容吧～

Electron 可通过 [globalShortcut](https://www.electronjs.org/docs/latest/api/global-shortcut/) 模块进行快捷键事件的自定义。比如常用的复制功能，不会真有人傻乎乎的选中一段文本，再鼠标右键，找到复制选项，进行文本复制吧？`Ctrl + C` 不香吗？

当然了，系统默认给我们注册了一些快捷键事件，不过默认的快捷键事件肯定是难以满足我们的需求，**我们总会有一些奇奇怪怪的想法**，下面给个小例子，看看如何自定义快捷键事件

```ts
import { app, globalShortcut } from 'electron';

app.whenReady().then(() => {
  // 注册一个快捷键
  const customCut = globalShortcut.register('CommandOrControl+T', () => {
    console.log('牛逼Plus');
  });

  if (!customCut) {
    console.log('凉了，注册失败');
  }

  // 检测该快捷键是否被注册
  console.log(globalShortcut.isRegistered('CommandOrControl+T'));
});

app.on('will-quit', () => {
  // 注销快捷键事件
  globalShortcut.unregister('CommandOrControl+T');
});
```

> 这里的 `CommandOrControl` 是因为在 Window 和 Mac 上存在一些差异。

重新跑一下 `npm run start:main`，此时我们在主应用窗口中，摁下 `command+T`\(mac\) 或者 `control+T`\(window\)，然后在主进程窗口中，看看终端是否会输出 `牛逼Plus` 呢？

> 留个作业，我想通过快捷键的方式显示应用设置窗口，代码该如何写呢？动动你的小奶袋瓜

## 自定义简历菜单栏

虽然上面我们实现了简单的自定义菜单栏，但实际上，这会把默认的菜单项给舍弃，以上面的 demo 为示例，你会发现，在应用中无法复制，无法粘贴，这是为什么呢？原因在于我们的菜单栏没有了这些默认菜单事件。我们肯定不会干这么愚蠢的事。

官方提到，如果应用没有设置菜单的话，系统会生成一个默认菜单。 默认生成的菜单中包含了一些初始选项，我们先把这些初始选项拷贝出来，你可以参考这个 [electron-default-menu](https://github.com/carter-thaxton/electron-default-menu/blob/master/index.js)

修改 `app/main/customMenu.ts` 文件

```ts
import _ from 'lodash';
import { MyBrowserWindow } from './electron';
import {
  MenuItemConstructorOptions,
  shell,
  app,
  MenuItem,
  BrowserWindow,
} from 'electron';

const customMenu: (MenuItemConstructorOptions | MenuItem)[] = [
  {
    label: '平台',
    role: 'help',
    submenu: [
      {
        label: '源码',
        click: function () {
          shell.openExternal('https://github.com/PDKSophia/visResumeMook');
        },
      },
      {
        label: '小册',
        click: function () {
          shell.openExternal('https://juejin.cn/book/6950646725295996940');
        },
      },
    ],
  },
  {
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo',
      },
      {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut',
      },
      {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy',
      },
      {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste',
      },
      {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectAll',
      },
    ],
  },
  {
    label: '视图',
    submenu: [
      {
        label: '刷新当前页面',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.reload();
          }
        },
      },
      {
        label: '切换全屏幕',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Ctrl+Command+F';
          } else {
            return 'F11';
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        },
      },
      {
        label: '切换开发者工具',
        role: 'toggleDevTools',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I';
          } else {
            return 'Ctrl+Shift+I';
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.openDevTools();
          }
        },
      },
    ],
  },
  {
    label: '窗口',
    role: 'window',
    submenu: [
      {
        label: '最小化',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
      {
        type: 'separator',
      },
    ],
  },
  {
    label: '设置',
    submenu: [
      {
        label: '修改简历数据储存路径',
        click: () => {
          console.log('111');
        },
      },
    ],
  },
];

if (process.platform === 'darwin') {
  const { name } = app;
  customMenu.unshift({
    label: name,
    submenu: [
      {
        label: '关于 ' + name,
        role: 'about',
      },
      {
        type: 'separator',
      },
      {
        label: '服务',
        role: 'services',
        submenu: [],
      },
      {
        type: 'separator',
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide',
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        role: 'hideOthers',
      },
      {
        label: 'Show All',
        role: 'unhide',
      },
      {
        type: 'separator',
      },
      {
        label: '退出',
        accelerator: 'Command+Q',
        click: function () {
          app.quit();
        },
      },
    ],
  });
}

export default customMenu;
```

此时我们重新运行 `npm run start:main`，可以发现，左上角的菜单栏展示与我们的预期一致。我们点击 `平台介绍`菜单下的小册，会发现跳转到了小册介绍页；链接的调整固然无误，但接下来的问题是，如何在点击`设置`时，显示我们的应用设置窗口。

细心的小伙伴应该发现，在[第 17 章](https://juejin.cn/book/6950646725295996940/section/6962940676258398222)时，我们是新增了一个应用窗口，这就使得我们每次启动应用，该应用设置窗口就会创建并显示。

我们所期望的是：初始化创建应用设置窗口，但不显示（窗口隐藏），在点击菜单`设置`时，再显示应用设置窗口，点击关闭则将窗口隐藏。接下来让我们一步步实现（伪代码，看注释！！！）

 -    初始化创建应用设置窗口，对该窗口隐藏

```ts
export interface MyBrowserWindow extends BrowserWindow {
  uid?: string;
}

function createWindow() {
  // 创建应用设置窗口
  const settingWindow: MyBrowserWindow = new BrowserWindow({
    width: 720,
    height: 240,
    show: false, // 设置为 false，使得窗口创建时不展示
    resizable: false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
    },
  });
  settingWindow.uid = 'settingWindow'; // 添加自己唯一的窗口属性
}
```

- 在点击菜单`设置`时，显示应用设置窗口

修改 `customMenu.ts` 文件，在回调函数中，得到所有窗口实例，通过 `uid` 得到具体窗口，进行展示

```ts
import _ from 'lodash';
import { MyBrowserWindow } from './electron';
import { MenuItemConstructorOptions, shell, MenuItem, BrowserWindow } from 'electron';

// 伪代码
{
  label: '设置',
  submenu: [
    {
      label: '修改简历数据储存路径',
      click: () => {
        const wins: MyBrowserWindow[] = BrowserWindow.getAllWindows();
        const currentWindow = _.find(wins, (w) => w.uid === 'settingWindow');
         if (currentWindow) {
          currentWindow.show(); // 显示窗口
         }
      },
    },
  ],
}
```

- 点击关闭，将应用设置窗口隐藏

由于我们点击窗口的 `x` 号进行关闭，会将该窗口销毁，而实际上，我们期望的是将该窗口进行隐藏，所有需要重写一下 `close` 事件

```ts
// 自定义settingWindow的关闭事件
settingWindow.on('close', async (e) => {
  settingWindow.hide(); // 隐藏窗口
  e.preventDefault();
  e.returnValue = false;
});
```

小伙伴们一定要记住，修改了主进程的代码，需要重新执行 `npm run start:main`，这时候就能看到最终的菜单栏效果了。

代码可访问：[完成自定义菜单栏 commit](https://github.com/PDKSophia/visResumeMook/commit/a6b4ffeb19b422f6e437e5839c153833ea71f78c)

## 坑

也许小伙伴们觉得好像没啥毛病，但实际上，我们通过快捷键 `command+Q` 或者手动退出，就会发现，好像程序没有关掉？为什么呢？我猜测，当我们点击退出时，实际上会对所有的窗口都实现退出效果，但由于我们对 `settingWindow` 的退出重写，导致我们主应用窗口退出了，而应用设置窗口还残留着，并且我们将其隐藏掉，导致应用无法完全退出的尴尬局面。那该如何处理呢？

只能通过迂回的方式实现。`BrowserWindow` 有个配置，可以隐藏掉原生的菜单栏，我们禁掉原生菜单栏，手动实现。然后通过 IPC 的方式实现窗口的显示、隐藏。

我们先前往 `renderer/windowPages/setting`，修改一下 index.tsx 的逻辑代码，给它手动实现一个菜单栏，下面是伪代码，部分代码省略

```ts
// renderer/windowPages/setting/index.tsx

function Setting() {
  const onHideWindow = () => {
    ipcRenderer.send('Electron:SettingWindow-hide-event');
  };
  const onMinWindow = () => {
    ipcRenderer.send('Electron:SettingWindow-min-event');
  };
  return (
    <div styleName="container">
      <div styleName="menu">
        <div styleName="hide" onClick={onHideWindow}>x</div>
        <div styleName="min" onClick={onMinWindow}>-</div>
      </div>
    </div>
  );
}

export default Setting;
```

接下来需要在主进程添加 IPC 通信的事件处理，顺道把拦截的 `onclose` 代码段删除，同时为应用设置窗口添加 `frame` 属性

```ts
// app/main/electron.ts

function createWindow() {
  const settingWindow: MyBrowserWindow = new BrowserWindow({
    width: 720,
    height: 240,
    resizable: false,
    // 👇 第一步. 添加该属性
    show: false,
    frame: false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
    },
  });
  settingWindow.uid = 'settingWindow';

  // 👇 第二步.删除掉自定义的关闭事件
  // settingWindow.on('close', async (e) => {
  //   settingWindow.hide();
  //   e.preventDefault();
  //   e.returnValue = false;
  // });

  // 👇 第三步. 新增IPC事件监听
  ipcMain.on('Electron:SettingWindow-hide-event', () => {
    // https://www.electronjs.org/docs/api/browser-window#winisvisible
    if (settingWindow.isVisible()) {
      settingWindow.hide();
    }
  });
  ipcMain.on('Electron:SettingWindow-min-event', () => {
    // https://www.electronjs.org/docs/api/browser-window#winisminimized
    if (settingWindow.isVisible()) {
      settingWindow.minimize();
    }
  });
}
```

不要忘记了在自定义的菜单栏中，也需要对应做一下修改，前往 `app/main/customMenu.ts`

```ts
// app/main/customMenu.ts
{
    label: '设置',
    submenu: [
      {
        label: '修改简历数据储存路径',
        click: () => {
          const wins: MyBrowserWindow[] = BrowserWindow.getAllWindows();
          const currentWindow = _.find(wins, (w) => w.uid === 'settingWindow');
          if (currentWindow) {
            if (!currentWindow.isVisible()) {
              currentWindow.show();
            }
            if (currentWindow.isMinimized()) {
              currentWindow.restore();
            }
          }
        },
      },
    ],
  }
```

代码可访问：[实现无边框窗口，自定义菜单栏功能 commit](https://github.com/PDKSophia/visResumeMook/commit/47aff606c68665debda761ee942a2573bd803315)

## 最后

本章节主要实现自定义原生应用菜单，这是一个特别重要的模块，通过文档的介绍，简单例子的展示，快捷键事件的额外讲解，最后通过真实的场景，带领大家实现自定义原生菜单。

从一开始的实现，到自定义 `onclose` 事件会带来的问题，再到实现无边框菜单的窗口，最后通过 IPC 通信的方式，实现窗口的隐藏、最小化等功能。希望本章节后，小伙伴们能基于此菜单栏，去实现更多复杂而又有趣的定制化菜单。
    