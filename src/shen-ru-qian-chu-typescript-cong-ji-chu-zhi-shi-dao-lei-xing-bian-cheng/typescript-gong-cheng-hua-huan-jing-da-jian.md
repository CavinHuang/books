
# TypeScript 工程化-环境搭建
---

# 搭建 TypeScript 正式工作环境

俗话说得好「工欲善其事,必先利其器」,我们在上一节已经搭建好了基础的 TypeScript 环境,并写下了第一行 TypeScript 代码,但是这并不足以支持大家日常的开发,在本节我们将搭建一个在生产环境可用的 TypeScript 环境,以此帮助大家了解 TypeScript 的工具生态.

除此之外,我们还会推荐一些 TypeScript 快速启动的库帮助大家免去搭建环境的烦恼,那么既然都已经有了相关的快速启动库了,为什么我们还要从头搭建环境呢\?

原因在于所有的库都是搭建好的,定制性很差,我们如果真的想成为一名合格的 TypeScript 使用者必须要学会搭建环境,不然一方面我们没有任何搭建环境的能力,一旦有一些特殊要求,我们连拓展环境都做不到,另一方面,开发过程中很多错误或者警告其实不是代码本身有问题,而是环境出现了问题,如果我们不懂环境方面的问题,会浪费很多时间.

## 生产环境要素

在正式开始之前我们需要思考一下,一个正式的 TypeScript 开发环境至少需要哪些要素呢\?

- 文本编辑器/IDE: 编写代码是任何开发环境的要素之一,本文会以 VS Code 为例来讲解如何配置我们的文本编辑器
- 单元测试: 除非是一般的临时服务,一个长期代码是必须要经过单元测试的,本文会以非常热门的 Jest 作为单测工具
- 代码检查: 从 JSLint 开始,代码检查就进入了前端开发者的视野中,由于 TSLint 被 TypeScript 官方抛弃,我们会以 ESlint 作为代码检查工具

当然还有版本管理工具、持续集成工具、代码美化工具等等,但这些跟 TypeScript 相关性并不大,并非我们的重点.

## 配置文本编辑器

如果你对VS Code感兴趣的话,可以去[官网](https://code.visualstudio.com/)进行下载.

> 注意: 在下载 VS Code 之前请确保已经安装最新版的 Node

### 安装插件 TS Importer

[TS Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter)是一个非常实用的 VS Code 插件,它的作用在于可以帮助开发者自动引入模块.

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/10/16db3fc83dd56c02~tplv-t2oaga2asx-image.image)

这个插件在编写依赖关系相对复杂的项目时非常有用,节省了我们手动引入模块的时间,而且最大程度规避了犯错的可能.

如果你想定制引入的格式,比如不想使用分号,你可以: 设置->搜索 `tsimporter` ,进行编辑即可,你可以选择是否用分号,是否用双引号等等.

![2019-10-07-13-10-29](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/10/16db3fc83e6a4f03~tplv-t2oaga2asx-image.image)

### 安装插件 Move TS

在我们移动一个文件的时候会有一个问题,我们的文件位置发生变化,相对引入模块的路径也会发生变化,这个是如果引入的路径很多,那么要一个个去改吗\?

这就要借助[Move TS](https://marketplace.visualstudio.com/items?itemName=stringham.move-ts)这个插件.

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/10/16db3fe2438a08dd~tplv-t2oaga2asx-image.image)

它可以帮助开发者自动计算移动后的模块引入路径,是提升效率的利器.

### 安装插件 TypeScript Toolbox

顾名思义,这是 TypeScript 的一个工具箱,主要有两个作用: 自动引入模块和生成`getter/setter/Constructors`.

自动引入模块:

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/10/16db3fc83f5da706~tplv-t2oaga2asx-image.image)

生成getter/setter:

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/10/16db3fc83f8d797a~tplv-t2oaga2asx-image.image)

## 为 TypeScript 添加测试

Jest 是一款由 Facebook 开源的大而全的测试框架,它的特点是开箱即用,功能强大,目前三大框架全部采用 Jest 测试,它有如下优点:

- 强大的 TypeScript 支持
- 内置的断言库
- 快照测试
- 内置的覆盖率报告
- 内置的异步支持

我们先下载下列 npm 模块:

```
npm i jest @types/jest ts-jest -D
```

我们稍微解释一下:

- jest: Jest 单元测试框架
- \@types/jest: Jest 是由 JavaScript 编写的\(目前已经宣布之后会采用 TypeScript 开发\),`@types/jest` 是为 jest 添加类型声明的 npm 包
- ts-jest: 本身是一个 TypeScript 预处理器,它可以帮助我们可以用 TypeScript 编写 jest 相关测试代码

随后我们在项目的根目录创建文件`jest.config.js`:

```
module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
}
```

- roots: 让我们指定测试的根目录,通常情况下我们建议设置为 `src/`
- transform: 这里我们使用 `ts-jest` 来测试 `tsx/ts` 文件

接着我们在 `package.json` 下修改如下:

```
  "scripts": {
    ...
    "test": "jest",
    "test:c": "jest --coverage",
    "test:w": "jest --watchAll --coverage"
  },
```

- jest: 是运行测试,jest 会寻找在 `src/` 目录下所有符合要求的文件进行测试
- jest --watchAll: 是以监控模式监控所有符合要求的文件

我们开始写一段简单的代码进行测试 `src/foo.ts`:

```
export const sum = (a: number) => (b: number) => a + b;
```

然后新建一个 `__test__` 目录存放测试文件,在 `foo.test.ts` 下:

```
import { sum } from '../foo';

test('basic', () => {
  expect(sum(1)(2)).toBe(3);
});
```

然后运行 `npm run test`:

![2019-10-07-14-17-43](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/10/16db3fc83fbe3c8d~tplv-t2oaga2asx-image.image)

## 代码检查

TSLint 长期以前是 TypeScript 主要的代码检测工具,但是由于一些性能问题 TypeScript 官方支持了 ESLint,随后 TSLint 作者宣布放弃 TSLint:

![2019-10-07-15-40-31](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/10/16db3fc8780a1553~tplv-t2oaga2asx-image.image)

因此 ESLint 现在已经是事实上 TypeScript 的 Linter ,我们先下载以下模块:

```
npm i eslint eslint-plugin-react @typescript-eslint/parser @typescript-eslint/eslint-plugin -D
```

以上各个模块说明如下: 

- eslint: 代码检查工具
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules): 使得eslint支持react框架
- \@typescript-eslint/parser: 让 eslint 可以解析 TypeScript
- [\@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules): 使得 eslint 支持 TypeScript 相关规则

在项目的根目录下创建 `.eslintrc.js`:

```
module.exports = {
    parser: '@typescript-eslint/parser',
    settings: {
        react: {
            version: 'detect'
        }
    },
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
    }
}
```

在 `package.json` 添加如下:

```
  "scripts": {
    ...
    "lint": "eslint \"src/**\"",
    "lint:f": "eslint \"src/**\" --fix "
  },
```

- `npm run lint`: 检测`src/`项目的代码
- `npm run lint:f`: 检测`src/`项目的代码并自动修复

## 代码调试

用 VS Code 调试代码是很简单的事情,首先我们点击调式按钮:

![2019-10-07-17-03-57](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/10/16db3fc889e031f5~tplv-t2oaga2asx-image.image)

然后选择 node 环境:

![2019-10-07-17-05-22](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/10/16db3fc8aa902709~tplv-t2oaga2asx-image.image)

配置调试环境:

```
{
    "name": "node",
    "type": "node",
    "request": "launch",
    "program": "${workspaceRoot}/dist/foo.js", //注意,这个路径必须是需要调试的文件`src/foo.ts`的编译后的路径即`/dist/foo.js`
    "args": [],
    "cwd": "${workspaceRoot}",
    "protocol": "inspector"
}
```

我们就可以进行调试了:

![2019-10-07-17-01-23](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/10/16db3fc8b4a4fdeb~tplv-t2oaga2asx-image.image)

## 小结

我们现在已经搭建了一个可用的 TypeScript 开发环境,当然我们可以进一步完善它,但是这些内容与 TypeScript 本身的关系不大,如果你感兴趣的话,我们已经把完整的代码发布在了[github](https://github.com/xiaomuzhu/ts-start)上,你可以直接下载使用.

如果你想编写一个成熟的TypeScript库，那么可以使用以下两个 starter 之一：

- [typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter)
- [typescript-starter](https://github.com/bitjson/typescript-starter)
    