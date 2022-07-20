
# 插件篇 - Vscode
---

## 前言

这一章也是比较独立的，它是研发工具链的衍生，没有它并不会对工具链有影响但有它能够大幅度提高用户开发体验。

大部分的开发者是想打造一站式、沉浸式的研发体验，那么在前端开发中，使用到最多比较热门的软件开发工具有 Vscode，那么 Vscode 的插件开发也就顺理成章了。

它跟 CLI 的区别是，基于自定义的 webView 能够提供给研发一个可视化的操作界面，同时可以与开发过程绑定，最后插件开发比较简便，Vscode 天然支持 TypeScript，对前端开发者非常友好，所以在你的 CLI 工具完成之后，就可以着手准备插件开发，进一步提高用户体验了。

## 开发属于自己的插件

#### 初始化模板

```
npm install -g yo generator-code
```

初始化完毕之后直接按 F5 进入调试开发模式

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9930774135c4a9b84a929dc16ef2623~tplv-k3u1fbpfcp-watermark.image?)

初始化完毕的代码目录结构如下所示：

```
├── .vscode
│   ├── launch.json     // 插件加载和调试的配置
│   └── tasks.json      // 配置 TypeScript 编译任务
├── .gitignore         
├── README.md           // 插件文档
├── src
│   └── extension.ts    // 插件源代码
├── package.json        // 插件配置清单
├── tsconfig.json       // TypeScript 配置
```

#### 集成 WebView

由于我们已经有一个 CLI 工具，而且提供非常多的功能，对 Vscode 插件来说，我们只是为了将功能作为可视化而已，所以不需要重头开始开发，直接使用 CLI 作为底层库来开发业务功能即可（这里就利用到了我们之前 CLI 暴露的方法，之前的设计没有直接使用 commander 调用方法，而是封装统一出口之后在提供给 commander 使用，就是为了应对这些问题）。

 1.     `package.json` 激活事件 + 注册命令，这里选择任意事件激活，毕竟我们集成的事件比较多。

```js
  "activationEvents": [
    "*"
  ],
  "contributes": {
    "commands": [
      {
        "category": "FECLI",
        "command": "FECLI.showCommands",
        "title": "显示所有操作"
      },
    ],
    "menus": {
      "explorer/context": [
          {
            "category": "FECLI",
            "command": "FECLI.overview",
            "title": "DEVOPS 首页"
          },
      ]
    }
  },
```

2.  注册命令

修改 `extension.ts`

```
import * as vscode from 'vscode';
import { initialize as initCommands } from "./commands";
import { showOverviewPageOnActivation } from "./pages/overview";
import { initCommit } from "./commit";
import { initStatusBar } from './components/statusBar';

export function activate(context: vscode.ExtensionContext) {
	initCommands(context); // 注册命令
	showOverviewPageOnActivation(context); // 注册 webview
	initStatusBar(context); // 初始化状态栏
}
```

 3.     注册页面

```
import * as vscode from "vscode";
import api from '../../service';
import * as path from "path";

import { instrumentOperation, sendInfo } from "vscode-extension-telemetry-wrapper";
import { loadTextFromFile } from "../../utils";

let overviewView: vscode.WebviewPanel | undefined;
const KEY_SETTING_WORKBENCH_STARTUPEDITOR = "workbench.startupEditor";
const KEY_STORAGE_OVERVIEW = 'key_storage_overview';


const toggleOverviewVisibilityOperation = instrumentOperation("toggleOverviewVisibility", (operationId: string, context: vscode.ExtensionContext, visibility: boolean) => {
  vscode.workspace.getConfiguration().update(KEY_SETTING_WORKBENCH_STARTUPEDITOR, visibility ? 'welcomePage' : 'newUntitledFile',vscode.ConfigurationTarget.Workspace);
  context.globalState.update(KEY_SETTING_WORKBENCH_STARTUPEDITOR,visibility)
});

// 创建一个启动页
export async function overviewCmdHandler(context: vscode.ExtensionContext, operationId: string, showInBackground: boolean = false) {
  if (overviewView) {
    overviewView.reveal();
    return;
  }

  overviewView = vscode.window.createWebviewPanel(
    "feclioverview",
    "Hello KRATOS",
    {
      viewColumn: vscode.ViewColumn.One,
      preserveFocus: showInBackground
    },
    {
      enableScripts: true,
      enableCommandUris: true,
      retainContextWhenHidden: true
    }
  );

  await initializeOverviewView(context, overviewView, onDidDisposeWebviewPanel);
}

// webvew 销毁
function onDidDisposeWebviewPanel() {
  overviewView = undefined;
}

async function initializeOverviewView(context: vscode.ExtensionContext, webviewPanel: vscode.WebviewPanel, onDisposeCallback: () => void) {
  webviewPanel.iconPath = vscode.Uri.file(path.join(context.extensionPath, "logo.lowres.png"));
  const resourceUri = context.asAbsolutePath("./out/assets/overview/index.html");
  const webview = webviewPanel.webview;
  webview.html = await loadTextFromFile(resourceUri);
  context.subscriptions.push(webviewPanel.onDidDispose(onDisposeCallback));
  webview.postMessage({
    command: "setOverviewVisibility",
    visibility: isNeedShowPage(context)
  });
  context.subscriptions.push(webview.onDidReceiveMessage(async (e) => {
    switch(e.command) {
      case "setOverviewVisibility":
        toggleOverviewVisibilityOperation(context, e.visibility);
        break;
      case "installExtension":
        await vscode.commands.executeCommand("feclihelper.installExtension", e.extName, e.displayName);
        break;
    }
  }));

  const localData = context.globalState.get(KEY_STORAGE_OVERVIEW);
  if (localData) {
    webview.postMessage({
      command: "onOverviewConfigReceived",
      overviewConfig: localData
    });
  }
  api.getOverviewConfig().then(data => {
    context.globalState.update(KEY_STORAGE_OVERVIEW, data);
    if (!localData) {
      webview.postMessage({
        command: "onOverviewConfigReceived",
        overviewConfig: data
      });
    }
  });
}

function isNeedShowPage(context) {
  return context.globalState.get(KEY_SETTING_WORKBENCH_STARTUPEDITOR)
}

export async function showOverviewPageOnActivation(context: vscode.ExtensionContext) {
  if(isNeedShowPage(context)) {
    vscode.commands.executeCommand('feclioverview');
  }
}
```

4.  添加静态资源

添加静态资源的代码如下

```
const resourceUri = context.asAbsolutePath("./out/assets/createProject/index.html");
  const webview = webviewPanel.webview;
  webview.html = await loadTextFromFile(resourceUri);
```

而 index.html，各位可以各显神通，它就是一个 html 文件，喜欢 vue 的用 vue，喜欢 react 用 react，不需要拘束。可以根据自己的喜好或者规则来开发对应的界面。

5.  消息传递

消息传递可以看下步骤 3 代码中的\[事件接收\]，本质他还是一个 WebView，所以可以通过 postMessage 来进行消息互通。

如上一个简单的 WebView 的 Vscode 插件完成，语法上跟 Chrome 插件也是类似，如果有感兴趣的同学，其实也可以基于这个来写一个 Chrome 插件，不过跟本地数据的交互就没有那么丰富了，所以功能一般都是减配版。

## 本章小结

在本章，我们学习了简单的 Vscode 插件的开发，基础的内容省略了一下，想了解或者开发更多功能的同学可以去查看一下[官网文档](https://code.visualstudio.com/docs)，毕竟 Vscode 在这里系列里面只是 CLI 工具的衍生，不会有其他的高级功能。

上述的只展示了简单的 demo，毕竟文档写的比我详细多。

> 另外由于电脑崩了，所有的数据都没有了，示例只有之前的项目，如果需要源码的同学，可以加群问我一下，可以发一份脱敏的项目代码参考。

如果你有什么疑问，欢迎在评论区提出，或者加群沟通。 👏
    