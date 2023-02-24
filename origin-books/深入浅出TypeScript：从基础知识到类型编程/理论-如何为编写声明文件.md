
# 理论-如何为编写声明文件
---

# 理论:如何为编写声明文件

虽然 TypeScript 已经逐渐进入主流,但是市面上大部分库还是以 JavaScript 编写的，这个时候由于库没有像 TS 一样定义类型，因此需要一个声明文件来帮助库的使用者来获取库的类型提示，比如 JQuery 虽然是 js 编写的但是如果引入 `@types/jquery` 就可以获得以下效果:

![JQuery代码提示](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1571bdf71b4~tplv-t2oaga2asx-image.image)

## 使用第三方 d.ts

Github 上有一个库 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 它定义了市面上主流的JavaScript 库的 d.ts ,而且我们可以很方便地用 npm 引入这些 d.ts。

比如我们要安装 JQuery 的 d.ts:

```
npm install @types/jquery -save
```

在日常开发中我们建议直接使用 DefinitelyTyped 定义的 d.ts,但是依然有些情况下我们需要给自己的库编写 d.ts,或者没有第三方的 d.ts 提供,这个时候就需要什么自己编写 d.ts 文件了.

## 编写 d.ts 文件

关键字 `declare` 表示声明的意思,我们可以用它来做出各种声明:

- `declare var` 声明全局变量
- `declare function` 声明全局方法
- `declare class` 声明全局类
- `declare enum` 声明全局枚举类型
- `declare namespace` 声明（含有子属性的）全局对象
- `interface` 和 `type` 声明全局类型

### 声明变量

`declare var/let/const`,全局变量的声明可以说是最简单的了,虽然 `var/let/const` 都可以使用的,但是通常情况下全局变量是不允许改动的,大多数情况下还是以 `const` 为主:

```
// src/jQuery.d.ts

declare const jQuery: (selector: string) => any;
```

### 声明函数

`declare function` 用来声明全局函数:

```
// src/jQuery.d.ts

declare function jQuery(selector: string): any;
```

### 声明类

`declare class` 用于声明全局类

```
// src/Person.d.ts

declare class Person {
    name: string;
    constructor(name: string);
    say(): string;
}
```

### 声明枚举

`declare enum` 是于声明全局枚举类型

```
// src/Directions.d.ts

declare enum Directions {
    Up,
    Down,
    Left,
    Right
}
```

### 声明命名空间

`declare namespace`，命名空间虽然在日常开发中已经不常见了，但是在 d.ts 文件编写时还是很常见的，它用来表示全局变量是一个对象，包含很多子属性。

比如 `jQuery` 是全局对象，而其包含一个 `jQuery.ajax` 用于处理 ajax 请求，这个时候命名空间就派上用场了:

```
// src/jQuery.d.ts

declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
}
```

### 声明interface 和 type

除了全局变量之外，可能有一些类型我们也希望能暴露出来。

在类型声明文件中，我们可以直接使用 interface 或 type 来声明一个全局的接口或类型:

```
// src/jQuery.d.ts

interface AjaxSettings {
    method?: 'GET' | 'POST'
    data?: any;
}
declare namespace jQuery {
    function ajax(url: string, settings?: AjaxSettings): void;
}
```

### 声明合并

假如 jQuery 既是一个函数，可以直接被调用 `jQuery('#foo')`，又是一个对象，拥有子属性 `jQuery.ajax()`（事实确实如此），那么我们可以组合多个声明语句，它们会不冲突的合并起来:

```
// src/jQuery.d.ts

declare function jQuery(selector: string): any;
declare namespace jQuery {
    function ajax(url: string, settings?: any): void;
}
```

```
// src/index.ts

jQuery('#foo');
jQuery.ajax('/api/get_something');
```

### 自动生成声明文件

如果库的源码本身就是由 ts 写的，那么在使用 `tsc` 脚本将 ts 编译为 js 的时候，添加 `declaration` 选项，就可以同时也生成 `.d.ts` 声明文件了.

我们可以在命令行中添加 `--declaration`（简写 `-d`），或者在 `tsconfig.json` 中添加 `declaration` 选项.

这里以 `tsconfig.json` 为例:

```
{
    "compilerOptions": {
        "module": "commonjs",
        "outDir": "lib",
        "declaration": true,
    }
}
```

上例中我们添加了 outDir 选项，将 ts 文件的编译结果输出到 lib 目录下，然后添加了 declaration 选项，设置为 true，表示将会由 ts 文件自动生成 .d.ts 声明文件，也会输出到 lib 目录下.

## 发布声明文件

我们为一个开源库编写了声明文件后应该如何发布\?

目前有两个选择:

- 将什么文件向开源库提 PR,声明文件与源码放在一起,作为第一方声明
- 发布到 DefinitelyTyped,作为第三方声明文件

### 第一方声明

如果是手动写的声明文件，那么需要满足以下条件之一，才能被正确的识别：

- 给 `package.json` 中的 `types` 或 `typings` 字段指定一个类型声明文件地址
- 在项目根目录下，编写一个 `index.d.ts` 文件
- 针对入口文件（`package.json` 中的 `main` 字段指定的入口文件），编写一个同名不同后缀的 `.d.ts` 文件

第一种方式是给 `package.json` 中的 `types` 或 `typings` 字段指定一个类型声明文件地址。比如：

```
{
    "name": "foo",
    "version": "1.0.0",
    "main": "lib/index.js",
    "types": "foo.d.ts",
}
```

指定了 `types` 为 `foo.d.ts` 之后，导入此库的时候，就会去找 `foo.d.ts` 作为此库的类型声明文件了。

`typings` 与 `types` 一样，只是另一种写法。

如果没有指定 `types` 或 `typings`，那么就会在根目录下寻找 `index.d.ts` 文件，将它视为此库的类型声明文件。

如果没有找到 `index.d.ts` 文件，那么就会寻找入口文件（`package.json` 中的 `main` 字段指定的入口文件）是否存在对应同名不同后缀的 `.d.ts` 文件。

比如 `package.json` 是这样时：

```
{
    "name": "foo",
    "version": "1.0.0",
    "main": "lib/index.js",
    "types": "foo.d.ts",
}
```

就会先识别 `package.json` 中是否存在 `types` 或 `typings` 字段。发现不存在，那么就会寻找是否存在 `index.d.ts` 文件。如果还是不存在，那么就会寻找是否存在 `lib/index.d.ts` 文件。假如说连 `lib/index.d.ts` 都不存在的话，就会被认为是一个没有提供类型声明文件的库了。

有的库为了支持导入子模块，比如 `import bar from 'foo/lib/bar'`，就需要额外再编写一个类型声明文件 `lib/bar.d.ts` 或者 `lib/bar/index.d.ts`，这与自动生成声明文件类似，一个库中同时包含了多个类型声明文件。

### 将声明文件发布到DefinitelyTyped

如果我们是在给别人的仓库添加类型声明文件，但原作者不愿意合并 pull request，那么就需要将声明文件发布到 `@types` 下。

与普通的 npm 模块不同，`@types` 是统一由 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) 管理的。要将声明文件发布到 `@types` 下，就需要给 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) 创建一个 pull-request，其中包含了类型声明文件，测试代码，以及 `tsconfig.json` 等。

pull-request 需要符合它们的规范，并且通过测试，才能被合并，稍后就会被自动发布到 `@types` 下。

在 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) 中创建一个新的类型声明，需要用到一些工具，[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/) 的文档中已经有了[详细的介绍](https://github.com/DefinitelyTyped/DefinitelyTyped#create-a-new-package)，这里就不赘述了，以官方文档为准。

## 小结

本节我们学习了声明文件基本的编写技巧,接下来我们需要进行一次实战,为一个纯 JavaScript 编写的开源库编写 d.ts.
    