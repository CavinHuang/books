
# TypeScript 工程化-单元测试
---

# TypeScript 工程化：单元测试

单元测试是现代软件工程中必备的环节之一，通常一定规模的团队会有专门的测试人员，但是一些精悍的团队也会选择开发人员自行测试。

虽然 TypeScript 的类型检查和 ESLint 的代码检测已经让我们的代码足够强大，但是这仅仅停留在类型和语法层面，我们无法保证逻辑的正确性，这就需要单元测试来保证我们的逻辑的健壮性了。

## 单元测试工具的选择

在 JS/TS 的世界里有太多的单元测试框架可供选择了，我们逐一进行对比，来选出一个适合我们的框架。

### Mocha

![2019-10-20-00-03-16](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded068ecf8ed8a~tplv-t2oaga2asx-image.image)

Mocha 可能是当前被使用最多的单元测试工具，他最大的优点就是灵活，它只提供给开发者的只有一个基础测试结构。

然后其它功能性的功能如 assertions， spies，mocks，和像它们一样的其它功能需要引用添加其它库/插件来完成。

它的缺点也是他的优点，我们需要额外的引入众多辅助库和插件，这无形中增加了我们的学习成本和配置成本。

除此之外， Mocha 的另一大亮点是对异步的强大支持，Mocha 毕竟是从一开始为 Node.js 而生的单元测试框架，对浏览器的支持并不如其对服务器做的那么好。

如果你需要一个高度定制的测试框架，Mocha 是非常好的选择。

### Jasmine

![2019-10-20-00-00-19](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded068ece95f09~tplv-t2oaga2asx-image.image)

相比于 Mocha 需要进行额外配置，另一个比较老牌的测试框架 Jasmine 主打的则是开箱即用，它内置了一些断言库和 mocks 工具，并提供了全局变量非常方便我们的测试。

### Jest

Jest 是一个真正意义上开箱即用的测试框架，它集成了几乎单元测试中我们需要的所有功能，比如：断言、测试覆盖率统计、快照等等一系列功能。

比较友好地支持各种环境，目前前端三大框架都采用了 Jest 作为测试工具，它的优点如下：

- 性能 - 首先 Jest 基于并行测试多文件，所以在大项目中的运行速度相当快（我们在这一点上深有体会，你可以访问这里、这里、这里和这里了解更多）。
- UI - 清晰且操作简单
- Ready-To-Go - 有断言、spies、mocks，和 Sinon 能做的事差不多。和其他库的结合使用也很方便。
- Globals - 和 Jasmine 一样，默认创建全局环境。但这一个特性确实会降低代码灵活性和健壮性，但是非常方便测试者调用。
- 快照测试 - Jest 快照功能由 FB 开发和维护，它还可以平移到别的框架上作为插件使用。 更强大的模块级 mocking 功能 - Jest 允许开发者用非常简单的方法 mock 很重的库，达到提高测试效率的目的。比如可以模拟一个 promise 的 resolve，而不是真的进行网络请求。
- 代码覆盖检查 - 内置了一个基于 Istanbul 的代码覆盖工具，功能强大且性能高。
- 支持性 - Jest 在2016年末2017年初发布了大版本，各方面都有了很大提升。大部分主流 IDE 和工具都已支持
- 开发 - Jest 仅仅更新被修改的文件，所以在监控模式 \(watch mode\) 下它的运行速度非常快

Jest 正是基于 Jasmine 开发而来，如果你喜欢 Jasmine，那么为什么不用 Jest，他比 Jasmine 更加大而全，更加开箱即用。

### 我们的选择

其实在我们面前有两条路，一条是灵活配置但是学习成本陡峭的 Mocha，另一条是大而全开箱即用，却没那么灵活的 Jest，多数没有特殊要求的情况下我认为 Jest 会更适合我们，测试框架到底是一个工具，我们选择一个几乎不需要配置、开箱即用的框架是可以大大提高我们生产效率的选择。

## Jest 配置

### 安装 Jest

全局安装 Jest：

```
npm i jest -g
```

在项目中安装 Jest：

```
npm i -D jest @types/jest
```

### 初始化 Jest

我们在项目的根目录下初始化 jest：

```
jest --init
```

我们会被问到三个问题，我的选择如下：

- Choose the test environment that will be used for testing\? **node**
- Do you want Jest to add coverage reports\? **y**
- Automatically clear mock calls and instances between every test\? **y**

第一个问题需要我们选择测试执行环境，有浏览器和 Node 两个选项，我们这次在简单的 Node 环境下测试，所以选择了 node。

第二个问题问我们是否需要测试覆盖率报告，通常情况下这个报告很重要，使我们整体测试情况的写一个报告，我选择了“是”。

第三个问题问我们是否在测试结束后帮我们自动清除一些模拟的实例等等，我选择了“是”，避免这些东西影响我们的下次测试。

### 配置项

这个时候我们的根目录下已经生成了一个叫 `jest.config.js` 的配置文件，我们看到里面有非常多的配置项。

比如 `clearMocks: true` 就是我们刚才的问题中用于清除模拟残留的配置，`coverageDirectory: 'coverage'` 就是我们刚才选择的测试覆盖率报告的配置，`testEnvironment: 'node'` 是我们刚才选择的测试环境。

以上只是基础配置，我们如果想要在 TypeScript 中使用，需要进一步的配置。

我们需要在配置中加入以下选项：

```
{
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json',
    'jsx',
    'node',
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
}
```

- `moduleFileExtensions`: 模块文件扩展名，当你去引入一个模块并没有指定拓展名的时候，它会依次尝试去添加这些扩展名去拟引入模块文件
- `transform`: 一种转换器配置, 由于 Jest 默认的转换器不支持 TypeScript，因此需要 ts-jest 工具把 `.ts` 和 `.tsx` 文件内容转换成 js，因为我们现在基本上也都是用 ts 去编写测试代码，所以要配置转换器
- `testMatch`： 设置识别哪些文件是测试文件（glob形式）

以上就是我们需要配置的配置项，当然还有一些配置项我们并没有涉及，由于篇幅所限，且其重要性也有限，感兴趣的可以移步官方的[配置 Jest](https://doc.ebichu.cc/jest/docs/zh-Hans/configuration.html)进一步学习。

## Jest 的使用

Jest 其实有很多强大的功能，我们并不是专门讲解 Jest 的书，因此只会讲解一下重点内容，更多的资料可以移步[Jest 官网](https://doc.ebichu.cc/jest/docs/zh-Hans/getting-started.html#content)。

### 匹配器的使用

我们在新建一个目录 `src/`，如何在此目录下新建一个文件 `add.ts`，开始进行编码如下：

```
export function add(item: number, ...rest: number[]) {
    return rest.reduce((a: number, b: number) => a + b, item)
}
```

我们实现一个非常简单的累加函数，然后开始进行测试。

我们先创建一个文件 `add.test.ts`,我们使用一个最简单的匹配器:

```
import { add } from './add'

test('two plus two is four', () => {
    expect(add(2,2)).toBe(4)
})
```

在此代码中，`expect(add(2,2))` 返回一个"期望"的对象，`.toBe(4)` 则是匹配器，我们期望这个函数运行的结果是 `4`，如果匹配失败，Jest运行时，它会跟踪所有失败的匹配器，以便它可以为你打印出很好的错误消息。

那么如果我们想测试相反的匹配那么可以：

```
test('two plus two is not six', () => {
    expect(add(2,2)).not.toBe(6)
})
```

我们运行一下 `npm run test`，如下：

![2019-10-20-03-21-47](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded068ecc66838~tplv-t2oaga2asx-image.image)

在编写代码的过程中你会发现 TypeScript 的提示会显示非常多的匹配器，这也是 TypeScript 的优势之一，我们通常根本记不住如此繁多的 API，但是优秀的代码提示会帮助我们快速使用，而不必去一个个查阅官方的文档。

![2019-10-20-03-23-20](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/21/16ded068ecd021da~tplv-t2oaga2asx-image.image)

我们匹配完了简单的数字，接下来可以匹配对象了。

我们新建一个文件 `src/person.ts`，如下;

```
export class Person {
    public name: string
    public age: number
    constructor(name: string, age: number) {
        this.age = age
        this.name = name
    }

    public say() {
        return 'hello'
    }
}
```

同样的我们新建一个测试文件 `person.test.ts`:

```
test('test person', () => {
    const person = new Person('xiaomuzhu', 11)

    expect(person).toBeInstanceOf(Person)
    expect(person).not.toEqual({
        name: 'cxk',
    })
})

```

`toBeInstanceOf` 用于匹配实例 `person` 是否是由 `Person` 构造的，`toEqual` 是比较两个对象是否相同。

### 异步测试

新建一个文件 `src/getTopics.ts`，我们就声明一个函数，用于读取 Cnode 论坛的首页主题帖：

```
import axios from 'axios'

const url = 'https://cnodejs.org/api/v1/topics'

export async function getTopics() {
    const res = await axios.get(url)
    return res
}

```

我们新建一个测试文件 `src/getTopics.test.ts`，若要编写 async 测试，只要在函数前面使用 async 关键字传递到 test :

```
import { getTopics } from "./getTopics";

test('should ', async () => {
    const { data } = await getTopics()

    expect(data).not.toBeUndefined()
    expect(data.success).toBeTruthy()
});

```

异步测试在 Node 服务端的测试场景中非常常用。

### 模拟函数

我们再新建一个文件 `src/myForEach.ts`，在这里我们创建一个遍历函数：

```
export function myForEach(items: number[], callback: (a: number) => void) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}
```

为了测试此函数，我们可以使用一个模拟函数，然后检查模拟函数的状态来确保回调函数如期调用。

在 `src/myForEach.test.ts` 中，我们可以用 `jest.fn()` 模拟函数，来测试调用情况：

```
import { myForEach } from './myForEach';

test('should call two', () => {
    const mockCallback = jest.fn();
    myForEach([0, 1], mockCallback);

    // 此模拟函数被调用了两次
    expect(mockCallback.mock.calls.length).toBe(2);

    // 第一次调用函数时的第一个参数是 0
    expect(mockCallback.mock.calls[0][0]).toBe(0);

    // 第二次调用函数时的第一个参数是 1
    expect(mockCallback.mock.calls[1][0]).toBe(1);
});
```

除此之外我们上面的测试中的模拟函数 `mockCallback` 还有一个 `mock` 属性，它它保存了此函数被调用的一系列信息，我们把它打印出来: `console.log(mockCallback.mock)`。

结果如下：

```
      {
        calls: [ [ 0 ], [ 1 ] ],
        instances: [ undefined, undefined ],
        invocationCallOrder: [ 1, 2 ],
        results: [
          { type: 'return', value: undefined },
          { type: 'return', value: undefined }
        ]
      }
```

## 小结

我们通过 Jest 的安装、配置、使用 学习了在 TypeScript 下进行简单单元测试的内容，严格的代码检测、静态类型检查配合上充分的单元测试，这是保证项目健壮性、可维护性的根本。

参考：

- [展望 2018 年 JavaScript Testing](https://zhuanlan.zhihu.com/p/32702421)
    