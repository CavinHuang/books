
# TypeScript 与 React 实战(组件篇上)
---

# TypeScript 与 React 实战\(组件篇上\)

我们虽然已经通过前几节了解了 TypeScript 相关的基础知识，但是这不足以保证我们在实际项目中可以灵活运用，比如现在绝大部分前端开发者的项目都是依赖于框架的，因此我们需要几节来讲一下React与TypeScript应该如何结合运用。

如果你仅仅了解了一下 TypeScript 的基础知识就上手框架会碰到非常多的坑（比如笔者自己），如果你是 React 开发者一定要看过本节之后再进行实践。

## 快速启动 TypeScript 版 react

使用 TypeScript 编写 react 代码，除了需要 `typescript` 这个库之外，还至少需要额外的两个库:

```
yarn add -D @types/{react,react-dom}
```

可能有人好奇`@types`开头的这种库是什么？

由于非常多的 JavaScript 库并没有提供自己关于 TypeScript 的声明文件，导致 TypeScript 的使用者无法享受这种库带来的类型，因此社区中就出现了一个项目 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)，他定义了目前市面上绝大多数的 JavaScript 库的声明，当人们下载 JavaScript 库相关的 `@types` 声明时，就可以享受此库相关的类型定义了。

当然，为了方便我们选择直接用 TypeScript 官方提供的 react 启动模板。

```
create-react-app react-ts-app --scripts-version=react-scripts-ts
```

## 无状态组件

我们初始化好了上述模板之后就需要进行正式编写代码了。

无状态组件是一种非常常见的 react 组件，主要用于展示 UI，初始的模板中就有一个 logo 图，我们就可以把它封装成一个 `Logo` 组件。

在 JavaScript 中我们往往是这样封装组件的：

```
import * as React from 'react'

export const Logo = props => {
    const { logo, className, alt } = props

    return (
        <img src={logo} className={className} alt={alt} />
    )
}
```

但是在TypeScript中会报错:

![2019-07-02-11-35-57](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1393d2e9036~tplv-t2oaga2asx-image.image)

原因就是我们没有定义 `props` 的类型,我们用 `interface` 定义一下 props 的类型，那么是不是这样就行了：

```
import * as React from 'react'

interface IProps {
    logo?: string
    className?: string
    alt?: string
}

export const Logo = (props: IProps) => {
    const { logo, className, alt } = props

    return (
        <img src={logo} className={className} alt={alt} />
    )
}
```

这样做在这个例子中看似没问题，但是当我们要用到 `children` 的时候是不是又要去定于 `children` 类型？

比如这样:

```
interface IProps {
    logo?: string
    className?: string
    alt?: string
    children?: ReactNode
}
```

其实有一种更规范更简单的办法，`type SFC<P>` 其中已经定义了 `children` 类型。

我们只需要这样使用:

```
export const Logo: React.SFC<IProps> = props => {
    const { logo, className, alt } = props

    return (
        <img src={logo} className={className} alt={alt} />
    )
}
```

我们现在就可以替换 `App.tsx` 中的 `logo` 组件，可以看到相关的props都会有代码提示：

![2019-07-02-11-46-59](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1393d464f07~tplv-t2oaga2asx-image.image)

如果我们这个组件是业务中的通用组件的话，甚至可以加上注释:

```
interface IProps {
    /**
     * logo的地址
     */
    logo?: string
    className?: string
    alt?: string
}
```

这样在其他同事调用此组件的时候，除了代码提示外甚至会有注释的说明:

![2019-07-02-11-50-33](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1393d53eeaf~tplv-t2oaga2asx-image.image)

## 有状态组件

现在我们开始编写一个Todo应用:

![2019-07-02-12-30-32](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1393d7f04ed~tplv-t2oaga2asx-image.image)

首先需要编写一个 `todoInput` 组件:

![2019-07-02-12-52-55](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1393d9ec4fc~tplv-t2oaga2asx-image.image)

如果我们按照 JavaScript 的写法，只要写一个开头就会碰到一堆报错

![2019-07-04-15-03-54](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1393daf4a41~tplv-t2oaga2asx-image.image)

有状态组件除了 props 之外还需要 state ，对于 class 写法的组件要泛型的支持，即 `Component<P, S>` ，因此需要传入传入 state 和 props 的类型，这样我们就可以正常使用 props 和 state 了。

```
import * as React from 'react'

interface Props {
    handleSubmit: (value: string) => void
}

interface State {
    itemText: string
}

export class TodoInput extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            itemText: ''
        }
    }
}

```

细心的人会问，这个时候需不需要给 `Props` 和 `State` 加上 `Readonly`，因为我们的数据都是不可变的，这样会不会更严谨？

其实是不用的，因为React的声明文件已经自动帮我们包装过上述类型了，已经标记为 `readonly`。

如下：

![2019-07-04-15-08-06](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1395f63a38a~tplv-t2oaga2asx-image.image)

接下来我们需要添加组件方法，大多数情况下这个方法是本组件的私有方法，这个时候需要加入访问控制符 `private`。

```
    private updateValue(value: string) {
        this.setState({ itemText: value })
    }
```

接下来也是大家经常会碰到的一个不太好处理的类型，如果我们想取某个组件的 `ref`，那么应该如何操作？

比如我们需要在组件更新完毕之后，使得 `input` 组件 `focus`。

首先，我们需要用`React.createRef`创建一个ref，然后在对应的组件上引入即可。

```
private inputRef = React.createRef<HTMLInputElement>()
...

<input
    ref={this.inputRef}
    className="edit"
    value={this.state.itemText}
/>
```

需要注意的是，在 `createRef` 这里需要一个泛型，这个泛型就是需要 `ref` 组件的类型，因为这个是 input 组件，所以类型是 `HTMLInputElement`，当然如果是 `div` 组件的话那么这个类型就是 `HTMLDivElement`。

## 受控组件

再接着讲 `TodoInput` 组件，其实此组件也是一个受控组件，当我们改变 `input` 的 `value` 的时候需要调用 `this.setState` 来不断更新状态，这个时候就会用到『事件』类型。

由于 React 内部的事件其实都是合成事件，也就是说都是经过 React 处理过的，所以并不原生事件，因此通常情况下我们这个时候需要定义 React 中的事件类型。

对于 `input` 组件 `onChange` 中的事件，我们一般是这样声明的:

```
private updateValue(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ itemText: e.target.value })
}
```

当我们需要提交表单的时候，需要这样定义事件类型:

```
    private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!this.state.itemText.trim()) {
            return
        }

        this.props.handleSubmit(this.state.itemText)
        this.setState({itemText: ''})
    }
```

那么这么多类型的定义，我们怎么记得住呢？遇到其它没见过的事件，难道要去各种搜索才能定义类型吗？其实这里有一个小技巧,当我们在组件中输入事件对应的名称时，会有相关的定义提示，我们只要用这个提示中的类型就可以了。

![2019-07-04-18-55-13](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb139655b4419~tplv-t2oaga2asx-image.image)

## 默认属性

React 中有时候会运用很多默认属性，尤其是在我们编写通用组件的时候，之前我们介绍过一个关于默认属性的小技巧，就是利用 class 来同时声明类型和创建初始值。

再回到我们这个项目中，假设我们需要通过 props 来给 `input` 组件传递属性，而且需要初始值，我们这个时候完全可以通过 class 来进行代码简化。

```
// props.type.ts

interface InputSetting {
    placeholder?: string
    maxlength?: number
}

export class TodoInputProps {
    public handleSubmit: (value: string) => void
    public inputSetting?: InputSetting = {
        maxlength: 20,
        placeholder: '请输入todo',
    }
}
```

再回到 `TodoInput` 组件中，我们直接用 class 作为类型传入组件，同时实例化类，作为默认属性。

![2019-07-04-19-45-53](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13966297992~tplv-t2oaga2asx-image.image)

用 class 作为 props 类型以及生产默认属性实例有以下好处：

- 代码量少：一次编写，既可以作为类型也可以实例化作为值使用
- 避免错误：分开编写一旦有一方造成书写错误不易察觉

这种方法虽然不错，但是之后我们会发现问题了，虽然我们已经声明了默认属性，但是在使用的时候，依然显示 `inputSetting` 可能未定义。

![2019-07-04-19-46-39](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13966f57ae1~tplv-t2oaga2asx-image.image)

在这种情况下有一种最快速的解决办法，就是加`!`,它的作用就是告诉编译器这里不是undefined，从而避免报错。

![2019-07-04-19-51-17](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13968984b2c~tplv-t2oaga2asx-image.image)

如果你觉得这个方法过于粗暴，那么可以选择三目运算符做一个简单的判断:

![2019-07-04-19-53-27](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb1396bc01bff~tplv-t2oaga2asx-image.image)

如果你还觉得这个方法有点繁琐，因为如果这种情况过多，我们需要额外写非常多的条件判断，而更重要的是，我们明明已经声明了值，就不应该再做条件判断了，应该有一种方法让编译器自己推导出这里的类型不是undefined，这就涉及到一些高级类型了，我们下节再讲。

## 小结

本节我们总结了最常见的几种组件在 TypeScript 下的编写方式，有了本节的知识储备，你可以比较轻松得编写一些常见的 TypeScript 组件了，但是这还不够，一些较复杂的组件依然需要一些高级类型的帮助，我们下一节会详细讲解。
    