
# 脚手架篇 - CLI 工具
---

## 前言

本章将会介绍 CLI 的开发与一些相关的知识。

## CLI 工具分析

小团队里面的业务一般迭代比较快，能抽出来提供开发基建的时间与机会都比较少，为了避免后期的重复工作，在做基础建设之前，一定要做好规划，思考一下当前最欠缺的核心与未来可能需要用到的功能是什么？

> Coding 永远不是最难的，最难的是不知道能使用 code 去做些什么有价值的事情。

本系列先简单规划出 CLI 的四个大模块，后续如果有需求变动再说。

> 可以根据自己项目的实际情况去设计 CLI 工具，本系列仅提供一个技术架构参考。

### 构建

通常在小团队中，构建流程都是在一套或者多套模板里面准备多环境配置文件，再使用 Webpack Or Rollup 之类的构建工具，通过 Shell 脚本或者其他操作去使用模板中预设的配置来构建项目，最后再进行部署之类的。

这的确是一个简单、通用的 CI/CD 流程，但问题来了，只要最后一步的发布配置不在可控之内，任意团队的开发成员都可以对发布的配置项做修改。

即使构建成功，也有可能会有一些不可预见的问题，比如 Webpack 的 mode 选择的是 dev 模式、没有对构建代码压缩混淆、没有注入一些全局统一方法等等，此时对生产环境而言是**存在一定隐患的**。

所以需要将构建配置、过程从项目模板中抽离出来，**统一使用 CLI 来接管**构建流程，不再读取项目中的配置，而通过 CLI 使用统一配置（`每一类项目都可以自定义一套标准构建配置`）进行构建。

避免出现业务开发同学因为修改了错误配置而导致的生产问题。

### 质量

与构建是一样的场景，业务开发的时候为了方便，很多时候一些通用的自动化测试以及一些常规的格式校验都会被忽略。比如每个人开发的习惯不同也会导致使用的 ESLINT 校验规则不同，会对 ESLINT 的配置做一些额外的修改，这也是不可控的一个点。一个团队还是使用同一套代码校验规则最好。

所以也可以将自动化测试、校验从项目中剥离，使用 CLI 接管，从而保证整个团队的某一类项目代码格式的**统一**性。

### 模板

至于模板，基本上目前出现的博客中，只要是关于 CLI 的，就必然会有模板功能。

因为这个一个对团队来说，快速、便捷初始化一个项目或者拉取代码片段是非常重要的，也是作为 CLI 工具来说产出最高、收益最明显的功能模块，但本章就不做过多的介绍，放在后面模板的博文统一写。

### 工具合集

既然是工具合集，那么可以放一些通用的工具类在里面，比如

1.  图片压缩（png 压缩的更小的那种）、上传 CDN 等
2.  项目升级（比如通用配置更新了，CLI 提供一键升级模板的功能）
3.  项目部署、发布 npm 包等操作。
4.  等等其他一些重复性的操作，也都可以放在工具合集里面

## CLI 开发

前面介绍了 CLI 的几个模块功能设计，接下来可以正式进入开发对应的 CLI 工具的环节。

### 搭建基础架构

CLI 工具开发将使用 TS 作为开发语言，如果此时还没有接触过 TS 的同学，刚好可以借此项目来熟悉一下 TS 的开发模式。

```js
mkdir cli && cd cli // 创建仓库目录
npm init // 初始化 package.json
npm install -g typescript // 安装全局 TypeScript
tsc --init // 初始化 tsconfig.json
```

全局安装完 TypeScript 之后，初始化 tsconfig.json 之后再进行修改配置，添加编译的文件夹与输出目录。

```json
{
  "compilerOptions": {
    "target": "es5", /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', or 'ESNEXT'. */
    "module": "commonjs", /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    "outDir": "./lib", /* Redirect output structure to the directory. */
    "strict": true, /* Enable all strict type-checking options. */
    "esModuleInterop": true, /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    "skipLibCheck": true, /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true /* Disallow inconsistently-cased references to the same file. */
  },
  "include": [
    "./src",
  ]
}
```

上述是一份已经简化过的配置，但应对当前的开发已经足够了，后续有需要可以修改 TypeScript 的配置项。

#### 工具类

```ts
import { resolve } from 'path'
import chalk from 'chalk'

// 项目本地路径
export const getDirPath = (relPath: string = '') => {
  return resolve(__dirname, relPath)
}

// 获取运行路径
export const getCwdPath = (relPath: string = '') => {
  return resolve(process.cwd(), relPath)
}

// 计时日志
export const loggerTiming = (str: string = '', start: boolean = true) => {
  if (start) {
    console.time('Timing')
    console.log(`****** ${str} START ******`)
  } else {
    console.log(`****** ${str} END ******`)
    console.timeEnd('Timing')
  }
}

// 成功日志
export const loggerSuccess = (str: string = '') => {
  console.log(chalk.greenBright(str))
}

// 报错日志
export const loggerError = (str: string = '') => {
  console.log(chalk.redBright(str))
}
```

为了后期发开方便，先准备一些工具类函数，上述需要注意的两个函数 `getDirPath` 与 `getCwdPath`，分别是获取 **CLI 本地的路径**与获取**运行环境的路径**，后期在使用 CLI 的时候会频繁使用到。

### ESLINT

因为是从 0 开发 CLI 工具，可以先从简单的功能入手，例如开发一个 Eslint 校验模块。

```js
npm install eslint --save-dev // 安装 eslint 依赖
npx eslint --init // 初始化 eslint 配置
```

直接使用 `eslint \--init` 可以快速定制出适合自己项目的 ESlint 配置文件 `.eslintrc.json`

```json
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        "standard"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```

如果项目中已经有定义好的 ESlint，可以直接使用自己的配置文件，或者根据项目需求对初始化的配置进行增改。

#### 创建 ESlint 工具类

第一步，对照文档 [ESlint Node.js API](https://eslint.org/docs/developer-guide/nodejs-api)，使用提供的 Node Api 直接调用 ESlint。

将前面生成的 .eslintrc.json 的配置项按需加入，同时使用 `useEslintrc:false` 禁止使用项目本身的 .eslintrc 配置，仅使用 CLI 提供的规则去校验项目代码。

```js
import { ESLint } from 'eslint'
import { getCwdPath, loggerTiming, loggerSuccess, loggerError, getDirPath } from '../util'

// 1. Create an instance.
const eslint = new ESLint({
  fix: true,
  extensions: [".js", ".ts"],
  useEslintrc: false,
  overrideConfig: {
    "env": {
      "browser": true,
      "es2021": true
    },
    "parser": require.resolve("@typescript-eslint/parser"),
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      },
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "plugins": [
      "react",
      "@typescript-eslint",
    ],
  },
  resolvePluginsRelativeTo: getDirPath('node_modules')
});


export const getEslint = async (path: string = 'src') => {

  try {
    loggerTiming('Eslint 校验');
    // 2. Lint files.
    const results = await eslint.lintFiles([`${getCwdPath()}/${path}`]);

    // 3. Modify the files with the fixed code.
    await ESLint.outputFixes(results);

    // 4. Format the results.
    const formatter = await eslint.loadFormatter("stylish");

    const resultText = formatter.format(results);

    // 5. Output it.
    if (resultText) {
      loggerError('请检查===》')
      console.log(resultText);
    }
    else {
      loggerSuccess('完美！');
    }
  } catch (error) {
    process.exitCode = 1;
    loggerError(error);
  } finally {
    loggerTiming('Eslint 校验', false);
  }
}
```

#### 创建测试项目

```
npm install -g create-react-app // 全局安装 create-react-app
create-react-app test-cli // 创建测试 react 项目
```

测试项目使用的是 create-react-app，当然你也可以选择其他框架或者已有项目都行，这里只是作为一个 demo，并且后期也还会再用到这个项目做测试。

#### 测试 CLI

新建 `src/bin/index.ts`, demo 中使用 `commander` 来开发命令行工具。

```ts
#!/usr/bin/env node // 这个必须添加，指定 node 运行环境
import { Command } from 'commander';
const program = new Command();

import { getEslint } from '../eslint'

program
  .version('0.1.0')
  .description('start eslint and fix code')
  .command('eslint')
  .action((value) => {
    getEslint()
  })

program.parse(process.argv);
```

修改 pageage.json，指定 bin 的运行 js（每个命令所对应的可执行文件的位置）

```json
 "bin": {
    "fe-cli": "/lib/bin/index.js"
  },
```

先运行 `tsc` 将 TS 代码编译成 js，再使用 npm link 挂载到全局，即可正常使用。

> commander 的具体用法就不详细介绍了，基本上市面大部分的 CLI 工具都使用 commander 作为命令行工具开发，也都有这方面的介绍。

命令行进入刚刚的测试项目，直接输入命令 `fe-cli eslint`，就可以正常使用 Eslint 插件，输出结果如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0750d38ecb84f5bb26da3662b7b4ae9~tplv-k3u1fbpfcp-watermark.image)

#### 美化输出

可以看出这个时候，提示并没有那么显眼，可以使用 `chalk` 插件来美化一下输出。

先将测试工程故意改错一个地方，再运行命令 `fe-cli eslint`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd553aa1940c4e5caf0718289fd45133~tplv-k3u1fbpfcp-watermark.image)

至此，已经完成了一个简单的 CLI 工具，对于 ESlint 的模块，可以根据自己的想法与规划定制更多的功能。

### 构建模块

#### 配置通用 Webpack

通常开发业务的时候，用的是 webpack 作为构建工具，那么 demo 也将使用 webpack 进行封装。

先命令行进入测试项目中执行命令 `npm run eject`，暴露 webpack 配置项。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44edec529d81462489b63a31800ea6b4~tplv-k3u1fbpfcp-watermark.image)

从上图暴露出来的配置项可以看出，CRA 的 webpack 配置还是非常复杂的，毕竟是通用型的脚手架，针对各种优化配置都做了兼容，但目前 CRA 使用的还是 webpack 4 来构建。作为一个新的开发项目，CLI 可以不背技术债务，直接选择 webpack 5 来构建项目。

> 一般来说，构建工具替换不会影响业务代码，如果业务代码被构建工具绑架，建议还是需要去优化一下代码了。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

interface IWebpack {
  mode?: "development" | "production" | "none";
  entry: any
  output: any
  template: string
}

export default ({
  mode,
  entry,
  output,
  template
}: IWebpack) => {
  return {
    mode,
    entry,
    target: 'web',
    output,
    resolveLoader: {
      modules: ['node_modules', require.resolve('../../node_modules')]
    },
    resolve: {
      modules: ['node_modules', require.resolve('../../node_modules')],
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/, //使用loader的目标文件。这里是.js
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-env'),
              [
                require.resolve("@babel/preset-react"),
                {
                  "runtime": "automatic"
                }
              ]
            ],
          },
        },
        exclude: [
          [require.resolve('../../node_modules')], // 由于node_modules都是编译过的文件，这里我们不让babel去处理其下面的js文件
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      ident: "postcss"
                    },
                  ],
                ],
              },
            }
          }
        ],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template,
        filename: 'index.html',
      }),
    ],
  }
}
```

上述是一份简化版本的 webpack 5 配置，再添加对应的 commander 命令。

```js
program
  .version('0.1.0')
  .description('start eslint and fix code')
  .command('webpack')
  .action((value) => {
    buildWebpack()
  })
```

现在可以命令行进入测试工程执行 `fe-cli webpack` 即可得到下述构建产物

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97ffea55911d4cfa8f364937ec84a35e~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbba5486d381410e9639dcd67870702a~tplv-k3u1fbpfcp-watermark.image)

下图是使用 CRA 构建出来的产物，跟上图的构建产物对一下，能明显看出使用简化版本的 webpack 5 配置还有很多可优化的地方，那么感兴趣的同学可以再自行优化一下，作为 demo 已经完成初步的技术预研，达到了预期目标。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f3439050b0324f1089d17d816fe152bf~tplv-k3u1fbpfcp-watermark.image)

此时，如果熟悉构建这块的同学应该会想到，除了 webpack 的配置项外，构建中**绝大部分的依赖都是来自测试工程**里面的，那么如何确定 React 版本或者其他的依赖统一呢？

常规操作还是通过模板来锁定版本，但是业务同学依然可以自行调整版本依赖导致不一致，并不能保证依赖一致性。

既然整个构建都由 CLI 接管，只需要考虑将全部的依赖转移到 CLI 所在的项目依赖即可。

#### 解决依赖

Webpack 配置项新增下述两项，指定依赖跟 loader 的加载路径，不从项目所在 node\_modules 读取，而是读取 CLI 所在的 node\_modules。

```js
resolveLoader: {
  modules: ['node_modules', getDirPath('../../node_modules')]
}, // 修改 loader 依赖路径
resolve: {
  modules: ['node_modules', getDirPath('../../node_modules')]
}, // 修改正常模块依赖路径
```

> 这两个配置都是可以传入数组与别名定义，传入数组之后可以默认先从lujj

同时将 babel 的 presets 模块路径修改为绝对路径，指向 CLI 的 node\_modules（presets 会默认从启动路劲读取依赖）。

```js
{
    test: /\.(js|jsx)$/,
    use: {
      loader: require.resolve('babel-loader'),
      options: {
        configFile: false, // 禁止读取 babel 配置文件
        babelrc: false, // 禁止读取 babel 配置文件
        presets: [
          require.resolve('@babel/preset-env'),
          [
            require.resolve("@babel/preset-react"),
            {
              "runtime": "automatic"
            }
          ]
        ],
      },
    },
    exclude: [
      [getDirPath('../../node_modules')]
    ]
}
```

完成依赖修改之后，一起测试一下效果，先将测试工程的依赖 `node_modules` 全部删除

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db902fcc913b417fa5c030a6dd76d129~tplv-k3u1fbpfcp-watermark.image)

再执行 `fe-cli webpack`，使用 CLI 依赖来构建此项目。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ec8eb0fa8754bf9912a1cb1baa2fd14~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/418d20d0dd7a44189e45ad1b34534722~tplv-k3u1fbpfcp-watermark.image)

可以看出，已经可以在项目不安装任何依赖的情况，使用 CLI 也可以正常构建项目了。

那么目前所有项目的依赖、构建已经全部由 CLI 接管，可以统一管理依赖与构建流程，如果需要升级依赖的话可以使用 CLI 统一进行升级，同时业务开发同学也无法对版本依赖进行改动。

> 这个解决方案要根据自身的实际需求来实施，所有的依赖都来源于 CLI 工具的话，版本升级影响会非常大也会非常被动，要做好兼容措施。比如哪些依赖可以取自项目，哪些依赖需要强制通用，做好取舍。

#### 构建通用 Rollup

一般的 Web 项目可以使用 Webpack 来构建，Rollup 一般都构建的是工具类，但跟 Webpack 一样，都可以使用 CLI 来接管，这样可以统一开发规范。

新建 `build/rollup/rollup.config.ts`

```ts
import babelConfig from "./babel.config";
import postcss from 'rollup-plugin-postcss'
import { terser } from "rollup-plugin-terser";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const filesize = require('rollup-plugin-filesize')
const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel')
const css = require('rollup-plugin-css-only')
const image = require('@rollup/plugin-image')

import { getCwdPath } from "../../util";

export const inputOptions = {
  input: getCwdPath('./src/index.js'),
  plugins: [
    babel(babelConfig),
    postcss(),
    json(),
    terser(),
    filesize(),
    resolve(),
    commonjs(),
    css({
      output: 'bundle.css',
    }),
    image()
  ],
}

export const outputOptions = {
  format: 'cjs',
  dir: getCwdPath('./cjs'),
}
```

新建 `build/rollup/babel.config.ts`

```ts
export default {
  configFile: false, // 禁止读取 babel 配置文件
  babelrc: false, // 禁止读取 babel 配置文件
  presets: [
    require.resolve('@babel/preset-env'),
    require.resolve("@babel/preset-react")
  ],
}
```

新建 `build/rollup/index.ts`

```ts
const rollup = require('rollup');
import { inputOptions, outputOptions } from "./rollup.config";
import { loggerTiming } from '../../util'


export const buildRollup = async () => {

  loggerTiming('ROLLUP BUILD');
  const bundle = await rollup.rollup(inputOptions);

  await bundle.write(outputOptions);

  loggerTiming('ROLLUP BUILD', false);

}
```

上述已经简单的将 rollup 的配置封装完毕，再将命令行工具添加 rollup 打包配置即可。构建产物如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd38307b73164622ad4fb4ec61849721~tplv-k3u1fbpfcp-watermark.image)

> 至此已经将常见的构建配置全部封装进 CLI，同学们可以根据自己的实际项目情况，对 Webpack、Rollup、Eslint 的配置项进行

### 结构优化

在上述步骤，已经将 Eslint 的校验抽出来了，那么可以不需要再在 Webpack 或 Rollup 的构建流程中添加 Eslint 插件进行校验，所以我们可以将构建的步骤全部重新优化一遍，使得结构、维护更加方便。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a04a078f7c64ab1b4a10270e6d06093~tplv-k3u1fbpfcp-watermark.image)

如上图所示，可以将所有的步骤全部封装一层，bin/index.ts 里面直接使用，将用户输入命令、参数解析层与实际处理任务逻辑层分开，第一，结构更加清晰便于维护；第二，提供对应的方法可以让别的插件调用。

完成项目代码请点击：[顺手给个 star 吧，持续更新啊](https://github.com/boty-design/fe-cli)

## 本章小结

本章主要内容是打造一款通用的 CLI 工具，后期会借助此 CLI 工具接管项目的整体发布流程与配置。

将项目发布流程与配置纳入整体的 DevOps 体系中。

如果你有什么疑问，欢迎在评论区提出，或者加群沟通。 👏
    