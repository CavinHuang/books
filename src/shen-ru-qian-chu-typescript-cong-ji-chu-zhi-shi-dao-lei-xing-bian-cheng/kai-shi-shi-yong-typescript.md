
# 开始使用 TypeScript
---

# 开始使用 TypeScript

在开始使用 TypeScript 前你最好有以下准备：

- Node.js > 8.0，最好是最新的稳定版（目前是V10.16.3 ）
- 一个包管理工具 npm 或者 yarn
- 一个文本编辑器或者 IDE \(笔者的是 vscode\)

> 相关的 shell 命令仅适用于 \*nix 系统，windows 系统不适用

## 安装 TypeScript

TypeScript 的安装很简单，你可以通过npm直接在全局安装 TypeScript。

```
> npm install -g typescript
```

## 创建环境

随后我们要创建一个目录：

```
mkdir ts-study && cd ts-study
```

接着创建 src 目录：

```
mkdir src && touch src/index.ts
```

接着我们用npm将目录初始化：

```
npm init
```

此时我们要使用 TypeScript 的话通常也需要初始化：

```
tsc --init
```

这个时候你会发现目录下多了一个`tsconfig.json`文件.

这是 TypeScript 的配置文件，里面已经包含官方初始化的一些配置以及注释，我们现在进行自定义的配置：

```
{
  "compilerOptions": {
    "target": "es5",                            // 指定 ECMAScript 目标版本: 'ES5'
    "module": "commonjs",                       // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "moduleResolution": "node",                 // 选择模块解析策略
    "experimentalDecorators": true,             // 启用实验性的ES装饰器
    "allowSyntheticDefaultImports": true,       // 允许从没有设置默认导出的模块中默认导入。
    "sourceMap": true,                          // 把 ts 文件编译成 js 文件的时候，同时生成对应的 map 文件
    "strict": true,                             // 启用所有严格类型检查选项
    "noImplicitAny": true,                      // 在表达式和声明上有隐含的 any类型时报错
    "alwaysStrict": true,                       // 以严格模式检查模块，并在每个文件里加入 'use strict'
    "declaration": true,                        // 生成相应的.d.ts文件
    "removeComments": true,                     // 删除编译后的所有的注释
    "noImplicitReturns": true,                  // 不是函数的所有返回路径都有返回值时报错
    "importHelpers": true,                      // 从 tslib 导入辅助工具函数
    "lib": ["es6", "dom"],                      // 指定要包含在编译中的库文件
    "typeRoots": ["node_modules/@types"],
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": [                                  // 需要编译的ts文件一个*表示文件匹配**表示忽略文件的深度问题
    "./src/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
  ]
}
```

然后在package.json中加入我们的script命令：

```
{
  "name": "ts-study",
  "version": "1.0.0",
  "description": "",
  "main": "src/index.ts",
  "scripts": {
    "build": "tsc", // 编译
    "build:w": "tsc -w" // 监听文件，有变动即编译
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "typescript ": "^3.6.4"
  }
}
```

## 编写第一个 TypeScript 程序

在`src/index.ts`中输入以下代码:

```
function greeter(person) {
    return "Hello, " + person
}

const user = "Jane User"
```

这个时候你会看到一个警告,这个警告在官方默认配置中是不会出现的,正是由于我们开启了 `noImplicitAny` 选项,对于隐式含有 `any` 类型的参数或者变量进行警告⚠️.

![2019-06-25-00-57-51](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/9/16daeeff39fac105~tplv-t2oaga2asx-image.image)

之所以一开始就开启严格模式，是因为一旦你开始放任`any`类型的泛滥，就会把 TypeScript 变成 AnyScript ，会很难改掉这个恶习，所以从一开始就要用规范的 TypeScript 编码习惯。

我们进行修改如下：

```
function greeter(person: string) {
    return "Hello, " + person
}

```

此时我们可以看到，`greeter`函数自动加上了返回值类型，这是 TypeScript 自带的_类型推导_。

![2019-06-25-01-08-12](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/9/16daeeff3a16d8fa~tplv-t2oaga2asx-image.image)

## 小结

我们总结一下初始化 TypeScript 工作环境的简易步骤：

1.  安装 TypeScript
2.  用 `tsc --init` 初始化配置
3.  编辑 `tsconfig.json` 配置 TypeScript 选项

这一节我们学习了如何搭建 TypeScript 的初始环境，当然这只是一个 TypeScript 环境搭建的第一步，我们建议在后面的章节里您结合内容进行编码练习，练习环境就在当前我们搭建的环境里。

我将本节的代码做了一定拓展（加了测试和eslint等等）后，发布到了[github](https://github.com/xiaomuzhu/ts-start)上，你可以自行下载。
    