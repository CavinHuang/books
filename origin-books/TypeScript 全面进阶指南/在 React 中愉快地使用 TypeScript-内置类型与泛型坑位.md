
# 在 React 中愉快地使用 TypeScript-内置类型与泛型坑位
---

这一节我们要介绍的是 React 项目中的 TypeScript 集成，React 和 TypeScript 能进行非常紧密而自然的协作，毕竟 tsx 文件本质上也是一个 ts 文件，因此可以直接享受到 TypeScript 的类型检查能力。也因此，在 React 中使用 TypeScript 并没有非常复杂的地方，我们主要关注三个方面：**组件声明**、**泛型坑位**与**内置类型定义**，对于 React + TypeScript 的工程规范，我们也会简要介绍。

组件声明指的是我们声明一个 React 组件的方式。如何结合 TypeScript 来进行组件属性、返回元素的有效性检查？这些组件声明方式都存在哪些特殊用法？需要注意的是，我们只会介绍函数式组件相关，而不会有 Class 组件出现。

泛型坑位即 React API 中预留出的泛型坑位，就像我们在前面学习的一样，这些泛型可以通过输入一个值来隐式推导，也可以直接显式声明来约束后续的值输入。而内置类型定义则主要是事件信息的类型定义以及内置工具类型两个部分，比如，在你的 onClick 函数中应当如何为参数声明类型？onChange 函数呢？

当然，我们会首先从项目搭建开始，但我们的关注点**并非代码的实际运行**，而只是结合 TypeScript 的 tsx 代码书写，因此你也可以直接阅读仓库中的代码，本节的内容主要在 components 与 types 两个文件夹中。

> 本节代码见：[React TypeScript](https://github.com/linbudu599/TypeScript-Tiny-Book/tree/main/packages/18-react-ts)

## 项目初始化

这里我们使用 Vite 来进行项目搭建，在终端输入以下代码：

```bash
npx create-vite
```

输入项目名，选择 `react-ts` 模板即可。最终的项目结构是这样的：

```bash
├── index.html
├── package.json
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── favicon.svg
│   ├── index.css
│   ├── logo.svg
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

当然，你也可以使用 Create-React-App、Parcel 等工具进行项目搭建，对于 Create-React-App 运行：

```bash
npm i create-react-app -g
create-react-app your-project --template=typescript
```

对于基于 Parcel 的搭建，参考我的这个 demo：[Parcel-Tsx-Template](https://github.com/LinbuduLab/Parcel-Tsx-Template)。

> 本质上，Vite、Create-React-App、Parcel 代表了三种不同思路的 Bundler，分别是基于浏览器 ESM 支持的 Bundleless 、大而全的 Webpack 以及零配置的 Parcel ，我们会在扩展阅读一节了解更多。

## 项目配置

先不急着开始，我们先观察基于 Vite 创建的初始项目里都包含了哪些配置。

首先是依赖，可以看到在 devDependencies 中包含了 `@types/react` 与 `@types/react-dom` 。对于 `@types` 包的作用我们在前面一节已经了解过，TypeScript 会自动加载 `node_modules/@types` 下的类型定义来在全局使用。而除了这一点，当我们从 react 中导出一个类型：

```typescript
import { FC } from "react";
import type { FC } from "react";
```

实际上这个类型也来自于 `@types/react` 。接着是项目内的 `vite-env.d.ts` 声明文件，我们会发现它只有短短的一行：

```typescript
/// <reference types="vite/client" />
```

三斜线指令的作用我们在前面一节了解过，现在我们就看看 `vite/client` 中都包含了什么：

```typescript
/// <reference lib="dom" />
/// <reference path="./types/importMeta.d.ts" />

// CSS modules
type CSSModuleClasses = { readonly [key: string]: string }

declare module '*.module.css' {
  const classes: CSSModuleClasses
  export default classes
}
declare module '*.module.scss' {
  const classes: CSSModuleClasses
  export default classes
}
// ...

// CSS
declare module '*.css' {
  const css: string
  export default css
}
declare module '*.scss' {
  const css: string
  export default css
}
// ...


// Built-in asset types
// see `src/constants.ts`

// images
declare module '*.jpg' {
  const src: string
  export default src
}
// ...

// fonts
declare module '*.woff' {
  const src: string
  export default src
}

// ...
```

你会发现，其实这里面包含的就是对于非实际代码文件导入的类型定义，包括了 CSS Modules、图片、视频等类型，通过这里的类型封装，在你导入这些文件时就也能获得基本的类型保障。

三斜线指令并不是导入类型的唯一方式，我们前面也提到了，可以使用 import 的方式来导入类型：

```typescript
// vite-env.d.ts
import * as ViteClientEnv from 'vite/client';
// 或使用 import type
import type * as ViteClientEnv from 'vite/client';
```

类型定义包与类型声明其实就是这个脚手架所进行的额外工作，也是在日常开发中我们会重度依赖的部分。而除了这两者以外还有 tsconfig.json 相关配置，我们会在后面有专门的一节进行分析。

接下来，我们就开始学习如何在 React 中优雅地使用 TypeScript 。

## 组件声明

首先我们来想想，在 React 中如何声明一个（函数）组件。最简单的方式肯定是直接声明一个函数：

```ts
const Container = () => {
  return <p>林不渡！</p>;
};
```

对于组件的 props 类型，我们可以就像在函数中标注参数类型一样：

```typescript
export interface IContainerProps {
  visible: boolean;
  controller: () => void;
}

const Container = (props: IContainerProps) => {
  return <p>林不渡！</p>;
};
```

属性默认值（defaultProps）也可以通过参数默认值的形式非常自然地进行声明：

```typescript
const Container = ({
  visible = false,
  controller = () => {},
}: IContainerProps) => {
  return <p>林不渡！</p>;
};
```

这么做看起来很朴素，但 TypeScript 仍然能把返回值类型推导出来，以上函数的类型可以被正确地推导为 `() => JSX.Element`。

但这样只能说明它是一个函数，并不能从类型层面上标明它是一个 React 组件，也无法约束它必须返回一个合法的组件。我们可以加上显式的类型标注来确保它返回一个有效组件：

```typescript
const Container = (): JSX.Element => {
  return <p>林不渡！</p>;
};
```

> JSX 是一个命名空间，来自于 `@types/react`。

除了这种方式， React 中还提供了 FC 这一类型来支持更精确的类型声明：

```ts
import React from 'react';

export interface IContainerProps {
  visible: boolean;
  controller: () => void;
}

const Container: React.FC<IContainerProps> = ({
  visible = false,
  controller = () => {},
}: IContainerProps) => {
  return <p>林不渡！</p>;
};
```

FC 是 FunctionComponent 的缩写，而 FunctionComponent 同样被作为一个类型导出，其使用方式是一致的，接受的唯一泛型参数即为这个组件的属性类型。

> 其实还存在 StatelessComponent 、SFC 这两个同样指函数组件，使用方式也和 FC 一致的类型，但已经不推荐使用。

我们来看 FC 的声明是什么样的：

```typescript
interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}
```

可以看到，代表着属性类型的泛型参数 P 实际上就是直接传给了类型别名 PropsWithChildren ，而它其实就是为 Props 新增了一个 children 属性：

```typescript
type PropsWithChildren<P> = P & { children?: ReactNode | undefined };
```

也就是说我们连这个组件的 children 都约束了：

```ts
const App = () => {
  return (
    <Container visible controller={() => {}}>
      <p>TypeScript + React!</p>
    </Container>
  );
};
```

但如果我们并不想这个组件接受 children，正如上面这个组件并没有消费 `props.children` ，此时应该怎么做？这就要说到，为什么在更严格的场景下其实不推荐使用 FC 了，请参考扩展阅读部分。

### 组件泛型

使用简单函数和使用 FC 的重要差异之一就在于，使用 FC 时你无法再使用组件泛型。组件泛型即指，为你的组件属性再次添加一个泛型，比如这样：

```ts
import { PropsWithChildren } from 'react';

interface ICellProps<TData> {
  // 
  field: keyof TData;
}

const Cell = <T extends Record<string, any>>(
  props: PropsWithChildren<ICellProps<T>>
) => {
  return <p></p>;
};

interface IDataStruct {
  name: string;
  age: number;
}

const App = () => {
  return (
    <>
      <Cell<IDataStruct> field='name'></Cell>
      <Cell<IDataStruct> field='age'></Cell>
    </>
  );
};
```

在 Cell 组件中，其 field 属性在接口结构中约束为 `keyof TData`，如在 App 中使用时我们基于 IDataStruct 进行约束，此时 Cell 组件的 field 属性就**只能传入 name 与 age 两个值**。也就是说，我们可以为这个组件显式声明泛型参数，来获得填充属性时的类型提示与检查。

但很明显，使用 FC 我们并不能做到这一点。

> 以上示例代码来自于 [Geist-UI](https://geist-ui.dev/zh-cn/components/table#typescript-%E7%A4%BA%E4%BE%8B)，一个我认为最符合自己审美的 UI 组件库。

关于更多简单函数声明与 FC 的差异，我们会在扩展阅读中了解。另外，Class Component 不在本节要介绍的范围中。

现在我们进入下一个部分，看看 React 中都有哪些泛型坑位？

## 泛型坑位

常见的泛型坑位主要还是来自于日常使用最多的 Hooks，我们一个个来看。

### useState

首先是 useState，可以由输入值隐式推导或者显式传入泛型：

```ts
const Container = () => {
  // 推导为 string 类型
  const [state1, setState1] = useState('linbudu');
  // 此时类型为 string | undefined
  const [state2, setState2] = useState<string>();
};
```

需要注意的是在显式传入泛型时，如果像上面的例子一样没有提供初始值，那么 state2 的类型实际上会是 `string | undefined`，这是因为在 useState 声明中对是否提供初始值的两种情况做了区分重载：

```typescript
// 提供了默认值
function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];

// 没有提供默认值
function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
```

另外一个常见的场景是对于在初始阶段是一个空对象的状态，你可能会使用断言来这么做：

```typescript
const [data, setData] = useState<IData>({} as IData);
```

这么做的坏处在于，后续的调用方中会认为这是一个完整实现了 IData 结构的对象，可能会出现遗漏的未赋值属性，此时你也可以使用 Partial 类型标记它为可选：

```typescript
const [data, setData] = useState<Partial<IData>>({});
```

如果你需要消费 useState 返回值的类型，可以搭配 ReturnType：

```typescript
// 相当于 useState(0) 的返回值类型
type State = ReturnType<typeof useState<number>>;
```

### useCallback 与 useMemo

然后是 useCallback 与 useMemo，它们的泛型参数分别表示包裹的函数和计算产物，使用方式类似，也分为**隐式推导**与**显式提供**两种：

```typescript
const Container = () => {
  // 泛型推导为 (input: number) => boolean
  const handler1 = useCallback((input: number) => {
    return input > 599;
  }, []);

  // 显式提供为 (input: number, compare: boolean) => boolean
  const handler2 = useCallback<(input: number, compare: boolean) => boolean>(
    (input: number) => {
      return input > 599;
    },
    []
  );
  
  // 推导为 string
  const result1 = useMemo(() => {
    return 'some-expensive-process';
  }, []);

  // 显式提供
  const result2 = useMemo<{ name?: string }>(() => {
    return {};
  }, []);
};
```

通常情况下，我们不会主动为 useCallback 提供泛型参数，因为其传入的函数往往已经确定。而为 useMemo 提供泛型参数则要常见一些，因为我们可能希望通过这种方式来约束 useMemo 最后的返回值。

### useReducer

useReducer 可以被视为更复杂一些的 useState，它们关注的都是数据的变化。不同的是 useReducer 中只能由 reducer 按照特定的 action 来修改数据，但 useState 则可以随意修改。useReducer 有三个泛型坑位，分别为 reducer 函数的类型签名、数据的结构以及初始值的计算函数，我们直接看实际使用即可：

```typescript
import { useReducer } from 'react';

const initialState = { count: 0 };

type Actions =
  | {
      type: 'inc';
      payload: {
        count: number;
        max?: number;
      };
    }
  | {
      type: 'dec';
      payload: {
        count: number;
        min?: number;
      };
    };

function reducer(state: typeof initialState, action: Actions) {
  switch (action.type) {
    case 'inc':
      return {
        count: action.payload.max
          ? Math.min(state.count + action.payload.count, action.payload.max)
          : state.count + action.payload.count,
      };
    case 'dec':
      return {
        count: action.payload.min
          ? Math.max(state.count + action.payload.count, action.payload.min)
          : state.count - action.payload.count,
      };
    default:
      throw new Error('Unexpected Action Received.');
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <>
      Count: {state.count}
      <button
        onClick={() =>
          dispatch({ type: 'dec', payload: { count: 599, min: 0 } })
        }
      >
        -(min: 0)
      </button>
      <button
        onClick={() =>
          dispatch({
            type: 'inc',
            payload: {
              count: 599,
              max: 599,
            },
          })
        }
      >
        +(max: 599)
      </button>
    </>
  );
}
```

在上面的例子中，useReducer 的泛型参数分别被填充为 reducer 函数的类型签名，以及其初始状态：

```typescript
type Reducer<S, A> = (prevState: S, action: A) => S;
type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;

function useReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>];
```

分析一下这里的填充：R 被填充为了一整个函数类型，而 `ReducerState<R>` 实际上就是提取了 reducer 中代表 state 的参数，即状态的类型，在这里即是 `{ count: number }` 这么一个结构。

需要注意的是，在 reducer 中其实也应用了我们此前提到过的**可辨识联合类型概念**，这里的 `action.type` 即为可辨识属性，通过 type 判断，我们就能在每一个 case 语句中获得联合类型对应分支的类型。

### useRef 与 useImperativeHandle

useRef 的常见使用场景主要包括两种，存储一个 DOM 元素引用和持久化保存一个值。这两者情况对应的类型其实也是不同的：

```typescript
const Container = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<number>(599);

  const operateRef = () => {
    domRef.current?.getBoundingClientRect();
    valueRef.current += 1;
  };

  return (
    <div ref={domRef}>
      <p>林不渡</p>
    </div>
  );
};

```

对于 domRef，此时其类型（current）会被推断为 `RefObject<HTMLDivElement>`，而 valueRef 的值类型则为 `MutableRefObject<number>`，这是完全符合预期的。因为我们并不会去修改挂载了 DOM 引用的 ref，而确实会修改值引用的 ref ，所以后者会是 Mutable 的。

然而实际上，这一差异并不是通过判断是否被应用在了 DOM 引用来实现的（也不需要做到如此智能），从 useRef 的类型定义可以看出，对于初始值为 null 的 useRef，其类型均会被推导为 RefObject：

```typescript
function useRef<T>(initialValue: T): MutableRefObject<T>;
function useRef<T>(initialValue: T | null): RefObject<T>;
function useRef<T = undefined>(): MutableRefObject<T | undefined>;
```

> HTMLDivElement 这一类型来自于 TypeScript 内置，在使用 ref 来引用 DOM 元素时，你应当使用尽可能精确的元素类型，如 HTMLInputElement、HTMLIFrameElement 等，而不是 HTMLElement 这样宽泛的定义，因为这些精确元素定义的内部封装了更加具体的类型定义，包括 HTML 属性、事件入参等。

对于 useImperativeHandle ，可能很多同学并不熟悉，可以参考 [useRef 三兄弟](https://juejin.cn/post/6888616874171432973) 这篇文章来了解具体使用。简单地说，这个 hook 接受一个 ref 、一个函数、一个依赖数组。这个函数的返回值会被挂载到 ref 上，常见的使用方式是用于实现**父组件调用子组件方法**：子组件将自己的方法挂载到 ref 后，父组件就可以通过 ref 来调用此方法。

我们来看具体的例子而后依次讲解：

```typescript
import {
  useRef,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react';

interface IRefPayload {
  controller: () => void;
}

const Parent = () => {
  const childRef = useRef<IRefPayload>(null);

  const invokeController = () => {
    childRef.current?.controller();
  };

  return (
    <>
      <Child ref={childRef} />
      <button onClick={invokeController}>invoke controller!</button>
    </>
  );
};

interface IChildPropStruct {}

interface IExtendedRefPayload extends IRefPayload {
  disposer: () => void;
}

const Child = forwardRef<IRefPayload, IChildPropStruct>((props, ref) => {
  const internalController = () => {
    console.log('Internal Controller!');
  };

  useImperativeHandle<IRefPayload, IExtendedRefPayload>(
    ref,
    () => {
      return {
        controller: internalController,
        disposer: () => {},
      };
    },
    []
  );

  return <p></p>;
});
```

- IRefPayload 描述了我们将会在 ref 上挂载的对象结构。
- 在函数组件中，接受 ref 的函数组件（子组件）需要被 forwardRef 包裹才能正确接收到 ref 对象，其接受两个泛型参数，分别为 ref 的类型与此组件的属性类型。
- useImperativeHandle 中传入了 ref 以及一个返回两个方法的函数，它具有两个泛型参数，分别从传入的 ref 以及函数的返回值类型中进行类型推导。在这里我们显式传入了与推导不一致的第二个泛型参数，以此提供了额外的返回值类型检查。

useImperativeHandle 并非常用的 hook，但在某些场景下也确实有奇效。

除了以上介绍的这些 hooks 以外，还有 useContext、useEffect 等常用的 hooks，但它们或是过于简单或是不存在泛型坑位。这里我们就不做介绍，如果你有兴趣，直接阅读其类型源码即可。

## 内置类型定义

除了上面介绍的泛型坑位以外，在 React 中想要用好 TypeScript 的另一个关键因素就是使用 `@types/react` 提供的类型定义，最常见的就是事件类型，比如输入框值变化时的 ChangeEvent 和鼠标事件通用的 MouseEvent：

```typescript
import { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';

const Container = () => {
  const [v, setV] = useState('linbudu');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {};

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {};

  return (
    <>
      <input value={v} onChange={handleChange} />
      <button onClick={handleClick}>Click me!</button>
    </>
  );
};
```

需要注意的是，ChangeEvent 和 MouseEvent 上还具有一个泛型坑位，用于指定发生此事件的元素类型，我们可以在这里进一步传入 **HTMLButtonElement** 这样更精确的元素类型获得更严格的类型检查。

除了使用 ChangeEvent 作为参数类型，React 还提供了整个函数的类型签名，如 ChangeEventHandler：

```typescript
const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {};
```

由于上下文类型的存在，此时就无需再为 e 声明类型了，它会自动被推导为 `ChangeEvent<HTMLInputElement>` 。

类似的事件定义还有非常多，如 FormEvent、TouchEvent、DragEvent 等，但无需对所有定义都了解，在实际用到时再去导入即可。需要注意的是，由于 InputEvent [并非在所有浏览器都得到了支持](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent)，因此并不存在对应的类型定义，你可以使用 KeyboardEvent 来代替。

除了这些事件类型以外，还有一个常见的类型是在你声明组件属性中的样式时会用到的，那就是 CSSProperties ，它描述了所有的 CSS 属性及对应的属性值类型，你也可以直接用它来检查 CSS 样式时的值：

```typescript
import type { CSSProperties } from 'react';

export interface IContainerProps {
  style: CSSProperties;
}

const css: CSSProperties = {
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
};

const Container = ({ style }: IContainerProps) => {
  return <p style={style}>林不渡！</p>;
};
```

### 其他内置类型

还有一部分内置类型并不是日常开发中常用的，而是仅在组件库开发等场景时才会使用到，这里我们也做简单地介绍。

#### ComponentProps

当你基于原生 HTML 元素去封装组件时，通常会需要将这个原生元素的所有 HTML 属性都保留下来作为组件的属性，此时你肯定不能一个个声明所有属性，那么就可以使用 ComponentProps 来提取出一个元素上所有的属性：

```typescript
import type { ComponentProps } from 'react';

interface IButtonProps extends ComponentProps<'button'> {
  size?: 'small' | 'large';
  link?: boolean;
}
const Button = (props: IButtonProps) => {
  return <button {...props} >{props.children}</button>;
};
```

除了对原生 DOM 元素使用以外，这一用法在使用组件库时也有奇效，比如组件库只导出了这个组件而没有导出这个组件的属性类型定义，而我们又需要基于这个组件进行定制封装，此时就可以使用 ComponentProps 去提取它的属性类型：

```typescript
import { Button } from "ui-lib";
import type { ComponentProps } from 'react';

interface IButtonProps extends ComponentProps<Button> {
  display: boolean;
}
const EnhancedButton = (props: IButtonProps) => {
  return <Button {...props} >{props.children}</Button>;
};
```

> 由于 React 中 ref 的存在，有些时候我们会希望区分组件使用 ref 和没使用 ref 的情况，此时可以使用内置类型 ComponentPropsWithRef 或 ComponentPropsWithoutRef ，其使用方式与 ComponentProps 一致。

ComponentProps 也可以用来提取一个 React 组件的属性类型，其内部实现对 HTML 元素和 React 组件这两种情况也做了区分：

```typescript
type ComponentProps<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
> =
  // React 组件
  T extends JSXElementConstructor<infer P>
    ? P
    : // HTML 元素
    T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : {};
```

#### ReactElement 与 ReactNode

在前面的例子中你可能注意到了 ReactElement 与 ReactNode 这两个类型：

```typescript
type PropsWithChildren<P> = P & { children?: ReactNode | undefined };

interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
}
```

ReactElement 是 createElement、cloneElement 等 factory 方法的返回值类型，它本质上指的是一个有效的 JSX 元素，即 `JSX.Element`。而 ReactNode 可以认为包含了 ReactElement ，它还包含 null、undefined 以及 ReactFragment 等一些特殊的部分，其类型定义如下：

```typescript
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
```

## 其他工程实践

介绍了上面的项目配置与组件声明、泛型坑位相关内容以后，我们其实已经基本了解了 React 项目中使用 TypeScript 的注意事项。然而，还有一些概念涉及到项目的规范部分，我们在这里统一进行讲解。

需要注意的是，这些项目规范具有强烈的个人偏好风格，它们并不是必须严格遵守的规则，只是我个人在项目开发中习惯使用的一套规范，你可以按照自己的喜好来调整这些规范。

### 项目中的类型声明文件

在实际应用中使用 TypeScript 进行开发时，我们往往需要大量的类型代码，而如何存放这些类型代码，其实就需要预先有一个明确的规范。目前我使用的方式是，在项目中使用一个专门的文件夹存放类型代码，其中又按照这些类型的作用进行了划分，其分布大致是这样的：

```text
PROJECT
├── src
│   ├── types
│   │   ├── shared.ts
│   │   ├── [biz].ts
│   │   ├── request.ts
│   │   ├── tool.ts
│   ├── typings.d.ts
└── tsconfig.json
```

我们来依次讲解下这些类型声明文件的作用：

- `shared.ts`，被其他类型定义所使用的类型，如简单的联合类型封装、简单的结构工具类型等。

- `[biz].ts`，与业务逻辑对应的类型定义，比如 `user.ts` `module.ts` 等，推荐的方式是在中大型项目中尽可能按照业务模型来进行细粒度的拆分。

- `request.ts`，请求相关的类型定义，推荐的方式是定义响应结构体，然后使用 biz 中的业务逻辑类型定义进行填充：

  ```typescript
  import type { Status } from "./shared";

  export interface IRequestStruct<TData = never> {
    status: Status;
    code: number;
    data: TData;
  }

  export interface IPaginationRequestStruct<TData = never> {
    status: Status;
    curPage: number;
    totalCount: number;
    hasNextPage: boolean;
    data: TData[];
  }
  ```

  实际使用时：

  ```typescript
  import type { IPaginationRequestStruct } from "@/types/request";
  import type { IUserProfile } from "@/types/user";

  export function fetchUserList: Promise<IPaginationRequestStruct<IUserProfile>> {}
  ```

  通过这种方式，你的类型代定义之间就能够建立起清晰的、和业务逻辑一致的引用关系。

- `tool.ts`，工具类型定义，一般是推荐把比较通用的工具类型抽离到专门的工具类型库中，这里只存放使用场景特殊的部分。

- `typings.d.ts`，全局的类型声明，包括非代码文件的导入、无类型 npm 包的类型声明、全局变量的类型定义等等，你也可以进一步拆分为 `env.d.ts` `runtime.d.ts` `module.d.ts` 等数个各司其职的声明文件。

在实际场景中，这一规范的粒度并不一定能够满足你的需要，但你仍然可以按照这一思路进行类型定义的梳理和妥善放置。另外，我们并不需要将所有的类型定义都专门放到这个文件夹里，比如仅被组件自身消费的类型就应该使用就近原则，直接和组件代码一起即可。

### 组件与组件类型

在 React 父子组件中一个常见的场景是，父组件导入各个子组件，传递属性时会进行额外的数据处理，其结果的类型被这多个子组件共享，而这个类型又仅被父子组件消费，不应当放在全局的类型定义中。此时我推荐的方式是，将这个类型定义在父组件中，子组件使用仅类型导入去导入这个类型，由于值空间与类型空间是隔离的，因此我们并不需要担心循环引用：

```typescript
// Parent.tsx

import { ChildA } from "./ChildA";
import { ChildB } from "./ChildB";
import { ChildC } from "./ChildC";

//  被多个子组件消费的类型
export interface ISpecialDataStruct {}

const Parent = () => {
  const data: ISpecialDataStruct = {};

  return (
    <>
    <ChildA inputA={data} />
    <ChildB inputB={data} />
    <ChildC inputC={data} />
    </>
  )
}

// ChildA.tsx
import type { ISpecialDataStruct } from "./parent";

interface IAProp {
  inputA: ISpecialDataStruct;
}

export const ChildA: FC<IAProp> = (props) => {
  // ...
}
```

## 总结与预告

在这一节中，我们了解了 React 与 TypeScript 结合使用的方式，包括了项目的基础配置、组件声明方式及其优劣、Hooks 中的泛型坑位以及内置类型等等。这些概念其实本质上还是来自于 TypeScript 提供的能力，因此在你学习完毕小册前半部分的类型工具与类型编程概念后，这些对你来说已经不是特别复杂的知识，你需要的依旧只是在实践中去熟悉这些工具。因此，本着“渐进式学习”的理念，不妨再次找出你的 React 项目开始改造，看看是否有什么地方可以写得更优雅健壮一些。

## 扩展阅读

### FC 并不是完美的

在前面组件声明部分我们已经了解了使用函数声明组件，以及使用 FC 声明组件的两种形式，也明确了主要差异：

- 函数声明组件需要额外的返回值类型标注（`JSX.Element`）才能校验组件合法，并且可以再使用组件泛型来进一步确保类型安全。
- FC 可以简化函数的声明，但是无法使用组件泛型。

在这一部分，我们再来了解下这两者更多的差异，以及为什么说 FC 并不是完美的 （举例来说，在 Create-React-App 的最新模板代码里，已经不再使用 FC 了）。

我们再来看一看 FC 的类型定义：

```typescript
type PropsWithChildren<P> = P & { children?: ReactNode | undefined };

interface FunctionComponent<P = {}> {
  (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
}
```

你会发现 FC 的属性中是默认包含了 children 这一属性的（对应到 Vue 中则是插槽 slot 的概念），但并不是所有时候我们的组件都会包含一个 children：

```typescript
const App = () => {
  return (
    <>
      <ContainerWithoutChildren />
      <ContainerWithChildren>linbudu</ContainerWithChildren>
    </>
  );
};
```

如果你为 ContainerWithoutChildren 也传入了 children，虽然不会报错，但这个 children 实际上并不会渲染出来。

如果想让代码尽可能精准，实际上我们应该区分这两种情况，即组件是否会接受 children 并消费。而在 FC 中并没有进行区分，因此 React 中又提供了 VFC，即 VoidFunctionComponent ，它和 FC 的区别就在于属性中不包含 children：

```typescript
type VFC<P = {}> = VoidFunctionComponent<P>;

interface VoidFunctionComponent<P = {}> {
  (props: P, context?: any): ReactElement<any, any> | null;
  propTypes?: WeakValidationMap<P> | undefined;
  contextTypes?: ValidationMap<any> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;
}
```

> 在 `@types/react` 18 版本后， FC 内部不再隐式包含 children 属性，因此 VFC 也就不再推荐使用。

在组件库中还有一个常见场景，即我们使用组件同时作为命名空间，如 `Table.Column`，`Form.Item` 这样，如果使用 FC，你需要使用交叉类型补充上这些命名空间内的子组件：

```typescript
import * as React from 'react';

const Table: React.FC<{}> & {
  Column: React.FC<IColumnProps>;
} = () => {
  return <></>;
};

interface IColumnProps {}

const Column: React.FC<IColumnProps> = () => {
  return <></>;
};

Table.Column = Column;
```

但对于简单函数来说就不需要如此：

```typescript
const Table = (): JSX.Element => {
  return <></>;
};

interface IColumnProps {}

const Column = (props: IColumnProps): JSX.Element => {
  return <></>;
};

Table.Column = Column;
```

在这种情况下我们并不需要通过额外的类型标注，因为我们就只是简单地把一个组件挂到这个组件的属性上。

总的来说，FC 并不是在所有场景都能完美胜任的，当然除了上面提到的缺点以外，FC 也是有着一定优点的，如它还提供了 defaultProps、displayName 等一系列合法的 React 属性声明。而我的意见则是不使用 FC，直接使用简单函数和返回值标注的方式，这样一来你的函数组件就能够完全享受到作为一个函数的额外能力，包括但不限于泛型等等。
    