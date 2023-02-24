
# TypeScript 与 React 实战(组件篇下)
---

# TypeScript 与 React 实战\(组件篇下\)

上一节我们讲到用 class 一处编写能两处复用的方式虽然非常实用，但是我们不得不用一些 Hack 手段来避免后续的报错，有没有更优雅、更严谨的解决方案？

> 虽然 class 的写法需要一些 Hack 手段，但是笔者很多时候还是用了 class，因为确实很猛糙快。

> 本节会涉及一些超纲的工具类型运用，比如Pick、Omit，可以结合第25节阅读。

## 利用高级类型解决默认属性报错

我们现在需要先声明`defaultProps`的值:

```
const todoInputDefaultProps = {
    inputSetting: {
        maxlength: 20,
        placeholder: '请输入todo',
    }
}
```

接着定义组件的`props`类型

```
type Props = {
    handleSubmit: (value: string) => void
    children: React.ReactNode
} & Partial<typeof todoInputDefaultProps>
```

`Partial`的作用就是将类型的属性全部变成可选的,也就是下面这种情况：

```
{
    inputSetting?: {
        maxlength: number;
        placeholder: string;
    } | undefined;
}
```

那么现在我们使用Props是不是就没有问题了？

```
export class TodoInput extends React.Component<Props, State> {

    public static defaultProps = todoInputDefaultProps

...

    public render() {
        const { itemText } = this.state
        const { updateValue, handleSubmit } = this
        const { inputSetting } = this.props

        return (
            <form onSubmit={handleSubmit} >
                <input maxLength={inputSetting.maxlength} type='text' value={itemText} onChange={updateValue} />
                <button type='submit' >添加todo</button>
            </form>
        )
    }

...
}

```

我们看到依旧会报错：

![2019-07-05-11-56-45](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13b3680b13a~tplv-t2oaga2asx-image.image)

其实这个时候我们需要一个函数，将 `defaultProps` 中已经声明值的属性从『可选类型』转化为『非可选类型』。

我们先看这么一个函数:

```
const createPropsGetter = <DP extends object>(defaultProps: DP) => {
    return <P extends Partial<DP>>(props: P) => {
        type PropsExcludingDefaults = Omit<P, keyof DP>
        type RecomposedProps = DP & PropsExcludingDefaults

        return (props as any) as RecomposedProps
    }
}
```

这个函数接受一个 `defaultProps` 对象，`<DP extends object>` 这里是泛型约束，代表 `DP` 这个泛型是个对象，然后返回一个匿名函数。

再看这个匿名函数，此函数也有一个泛型 `P`,这个泛型 `P` 也被约束过,即 `<P extends Partial<DP>>`，意思就是这个泛型必须包含可选的 `DP` 类型（实际上这个泛型P就是组件传入的 Props 类型）。

接着我们看类型别名 `PropsExcludingDefaults`，看这个名字你也能猜出来，它的作用其实是剔除 `Props` 类型中关于 `defaultProps` 的部分，很多人可能不清楚 `Omit` 这个高级类型的用法，其实就是一个语法糖：

```
type Omit<P, keyof DP> = Pick<P, Exclude<keyof P, keyof DP>>
```

而类型别名 `RecomposedProps` 则是将默认属性的类型 `DP` 与剔除了默认属性的 `Props` 类型结合在一起。

其实这个函数只做了一件事，把可选的 `defaultProps` 的类型剔除后，加入必选的 `defaultProps` 的类型，从而形成一个新的 `Props` 类型，这个 `Props` 类型中的 `defaultProps` 相关属性就变成了必选的。

> 这个函数可能对于初学者理解上有一定难度，但是这些内容的确我们已经在高级类型那一个章节都见过了，这算是一次综合应用。

完整代码如下：

```
import * as React from 'react'

interface State {
    itemText: string
}

type Props = {
    handleSubmit: (value: string) => void
    children: React.ReactNode
} & Partial<typeof todoInputDefaultProps>

const todoInputDefaultProps = {
    inputSetting: {
        maxlength: 20,
        placeholder: '请输入todo',
    }
}

export const createPropsGetter = <DP extends object>(defaultProps: DP) => {
    return <P extends Partial<DP>>(props: P) => {
        type PropsExcludingDefaults = Omit<P, keyof DP>
        type RecomposedProps = DP & PropsExcludingDefaults

        return (props as any) as RecomposedProps
    }
}

const getProps = createPropsGetter(todoInputDefaultProps)

export class TodoInput extends React.Component<Props, State> {

    public static defaultProps = todoInputDefaultProps

    constructor(props: Props) {
        super(props)
        this.state = {
            itemText: ''
        }
    }

    public render() {
        const { itemText } = this.state
        const { updateValue, handleSubmit } = this
        const { inputSetting } = getProps(this.props)

        return (
            <form onSubmit={handleSubmit} >
                <input maxLength={inputSetting.maxlength} type='text' value={itemText} onChange={updateValue} />
                <button type='submit' >添加todo</button>
            </form>
        )
    }

    private updateValue(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ itemText: e.target.value })
    }

    private handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!this.state.itemText.trim()) {
            return
        }

        this.props.handleSubmit(this.state.itemText)
        this.setState({itemText: ''})
    }

}

```

## 高阶组件

关于在 TypeScript 如何使用 HOC 一直是一个难点，我们在这里就介绍一种比较常规的方法。

我们继续来看 `TodoInput` 这个组件，其中我们一直在用 `inputSetting` 来自定义 `input` 的属性，现在我们需要用一个 HOC 来包装 `TodoInput` ，其作用就是用高阶组件向 `TodoInput` 注入 props。

我们的高阶函数如下:

```
import * as hoistNonReactStatics from 'hoist-non-react-statics'
import * as React from 'react'

type InjectedProps = Partial<typeof hocProps>

const hocProps = {
    inputSetting: {
        maxlength: 30,
        placeholder: '请输入待办事项',
    }
}

export const withTodoInput = <P extends InjectedProps>(
  UnwrappedComponent: React.ComponentType<P>,
) => {
  type Props = Omit<P, keyof InjectedProps>

  class WithToggleable extends React.Component<Props> {

    public static readonly UnwrappedComponent = UnwrappedComponent

    public render() {

      return (
        <UnwrappedComponent
        inputSetting={hocProps}
        {...this.props as P}
        />
      );
    }
  }

  return hoistNonReactStatics(WithToggleable, UnwrappedComponent)
}
```

如果你搞懂了上一小节的内容，这里应该没有什么难度。

这里我们的 P 表示传递到 HOC 的组件的 props，`React.ComponentType<P>` 是 `React.FunctionComponent<P> | React.ClassComponent<P>` 的别名，表示传递到HOC的组件可以是类组件或者是函数组件。

其余的地方 `Omit` `as P` 等都是讲过的内容，读者可以自行理解，我们不再像上一小节那样一行行解释了。

只需要这样使用：

```
const HOC = withTodoInput<Props>(TodoInput)
```

## 小结

我们通过两个章节学习了 React 与组件相关的用法，虽然这两节信息量很大，但是如果你理解了，以后的学习就会很简单，因为这里的确用了一部分高级类型，高级类型的运用与理解算是 TypeScript 学习的第一道坎。
    