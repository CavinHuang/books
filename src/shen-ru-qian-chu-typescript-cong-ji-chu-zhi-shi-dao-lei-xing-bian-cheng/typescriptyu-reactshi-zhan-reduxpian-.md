
# TypeScript与React实战(Redux篇)
---

# TypeScript与React实战\(Redux篇\)

我们在真正的项目中不可能仅仅只用组件就可以完成开发工作，一定会涉及到状态管理工具，目前最主流的莫过于 redux，我们会结合 redux 继续开发我们的 todo 应用。

## 定义Models

很多时候前端没有定义 Model 的习惯，不过在前端越来越重的今天，尤其是 TypeScript 的存在使得 model 定义更加友好。

我们因为只是个 demo，所以数据模型很简单，用简单的接口即可定义:

```
// models/Todo.ts
export interface Todo {
  id: number
  name: string
  done: boolean
}
```

## Action相关

我们开始正式编写redux代码，首先需要定义 `constants`

```
// constants/todo.ts
export enum ActionTodoConstants {
    ADD_TODO = 'todo/add',
    TOGGLE_TODO = 'todo/toggle'
}
```

我们先实现一个 `addTodo` 函数:

```
// actions/todo.ts
let id = 0

const addTodo = (name: string) => ({
    payload: {
        todo: {
            done: false,
            id: id++,
            name,
          }
    },
    type: ActionTodoConstants.ADD_TODO,
})
```

由于在后面的 reducer 中我们需要函数返回的 Action 类型，所以我们得取得每个 action 函数的返回类型，其实这里有一个技巧，就是利用 TypeScript 强大的类型推导来反推出类型，我们可以先定义函数，再推导出类型。

```
type AddTodoAction = ReturnType<typeof addTodo>
```

![2019-07-05-18-07-51](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13cfda1c8da~tplv-t2oaga2asx-image.image)

接下来我们按照同样的方法实现 `toggleTodo` 即可

```
export type AddTodoAction = ReturnType<typeof addTodo>
export type ToggleTodoAction = ReturnType<typeof toggleTodo>

export type Action = AddTodoAction | ToggleTodoAction
```

## Reducer相关

Reducer 部分相对更简单一些，我们只需要给对应的参数或者初始 state 加上类型就好了。

```
// reducers/todo.ts

// 定义State的接口
export interface State {
    todos: Todo[]
}

export const initialState: State = {
    todos: []
}

// 把之前定义的Action给action参数声明
export function reducer(state: State = initialState, action: Action) {
    switch (action.type) {

      case ActionTodoConstants.ADD_TODO: {

        const todo = action.payload

        return {
          ...state,
          todos: [...state.todos, todo]
        }
      }

      case ActionTodoConstants.TOGGLE_TODO: {

        const { id } = action.payload
        return {
          ...state,
          todos: state.todos.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo)
        }
      }

      default:
        return state
    }
}
```

这样看貌似没问题，但是我们会发现错误。

![2019-07-05-19-17-05](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13cfdde82cd~tplv-t2oaga2asx-image.image)

我们看到 `action.payload` 其实是两个函数返回类型的联合类型，但是我们在 `TOGGLE_TODO` 的 `type` 下就不应该出现 `todo: {...}` 类型，为什么这里依然会出现呢？

其实正是因为我们错误运用了类型推导所致的，我们代码和逻辑都没有问题，问题就出现在我们没有理解好类型推导的机制。

类型推导生成的函数返回类型是这样的:

```
type AddTodoAction = {
    payload: {
        todo: {
            done: boolean;
            id: number;
            name: string;
        };
    };
    type: ActionTodoConstants;
}
```

而我们自定义的函数返回类型是这样的:

```
type AddTodoAction = {
    type: ActionTodoConstants.ADD_TODO;
    payload: {
        todo: Todo;
    };
}
```

其中最大的区别就是 `type` 属性的类型，类型推导只推导到了一个枚举类型 `ActionTodoConstants` ，而我们定义的类型是具体的 `ActionTodoConstants.ADD_TODO` ,因此当我们在reducer中使用的时候，我们的自定义类型可以精准地推导出类型，而利用类型推导的方法却不行。

这里不得不提一个 typescript 下面的一个高级类型，可辨识联合类型（Discriminated Unions），这个高级类型我们之前已经提到过，我们再简单回顾下：

```
interface Square {
    kind: "square";
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}

type Shape = Square | Rectangle;

function area(s: Shape) {
    switch (s.kind) {
        // 在此 case 中，变量 s 的类型为 Square
        case "square": return s.size * s.size;
        // 在此 case 中，变量 s 的类型为 Rectangle
        case "rectangle": return s.height * s.width;
    }
}

```

我们可以看到，这个联合类型可以通过 `case` 识别不同的 `s.kind` 从而推导出对应的类型，这个「可辨识联合」与普通的「联合类型」最大的不同之处就在于其必须有一个「单例类型」。

「单例类型」多数是指枚举成员类型和数字/字符串字面量类型，上面例子中的 `Rectangle` 接口中的 `kind: "rectangle"` 就是所谓的单例类型，你可能会好奇，这不是一个字符串吗？为什么是类型？其实在 TypeScript 中这种类型就叫做「字符串字面量类型」。

看个例子:

```
type a = 'add'

export const b: a = 'add' // ok
export const c: a = 'delete' // 报错
```

![2019-07-09-13-16-13](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13cfdef2f6c~tplv-t2oaga2asx-image.image)

我们想推导出正确的类型靠的就是这个单一的「字符串字面量类型」，因此上面提到的利用函数返回值类型推导的方式就不符合这个要求，因此造成后面的推导错误是意料之中的事情了。

因此我们需要修改之前的 action 代码

```
// actions/todo.ts
export interface AddTodoAction { type: ActionTodoConstants.ADD_TODO, payload: { todo: Todo } }
export interface ToggleTodoAction { type: ActionTodoConstants.TOGGLE_TODO, payload: { id: number } }
```

这个时候 reducer 中就可以精准推导:

![2019-07-07-09-14-46](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/11/16dbb13cfdf384d9~tplv-t2oaga2asx-image.image)

## 小结

我们在 Redux 相关的实战中运用了之前的各种类型，算是一个综合性质的实战，具体的代码可以阅读[github上的示例代码](https://github.com/xiaomuzhu/ts-start/tree/master/src/redux).

到目前为止我们在使用层面上没有太大的问题了，但是依然有一些高级的类型我们还没有接触，而想在 TypeScript 进阶是离不开「类型编程」这道坎的，到底什么是类型编程，我们应该如何设计类型工具，那我们进入下一个阶段的学习吧。
    