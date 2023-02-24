
# Vue 实战-TypeScript 下的 Vuex
---

# Vue 实战：TypeScript 下的 Vuex

我们已经基本完成了 UI 层面的编写，接下来我们需要对逻辑层进行实现。

我们选择全局状态管理工具 vuex，但是在 TypeScript 中 vuex 往往要与 vuex-class 进行配合，它同样提供了多个装饰器供我们使用。

首先安装 vuex-class：

```
npm i -S vuex-class
```

本节对应源代码在[v1.2](https://github.com/xiaomuzhu/vue-ts-todo/tree/v1.2)

## 创建 todo 任务逻辑

我们可以 `src/store/state.ts` 中先定义 State 的类型和初始值。

```
export enum Mode {
  edit, // 处于编辑状态
  finish // 处于编辑完成状态
}

export interface ITodoItem {
  id: string; // todo任务的id
  name: string; // todo 任务名称
  isDone: boolean; // 任务是否完成
  iconName: string; // 任务的图标
  color: string; // 任务底色
  mode: Mode; // 编辑状态
}

export interface State {
  todoList: Array<ITodoItem>;
}

export const state: State = {
  todoList: []
};
```

然后我们在 `src/store/mutations.ts` 中编写创建 todo 的逻辑，其实很简单，我们接受一个 todo 对象，把它添加到 todoList 数组中即可。

```
export const mutations: MutationTree<State> = {
  // 创建 todo
  createTodoItem(state: State, todoItem: ITodoItem) {
    state.todoList.push(todoItem);
  },
};
```

那么如何在组件中使用 `mutations` 呢？

```
import { Component, Prop, Vue } from "vue-property-decorator";
import { Icon } from "vant";
import { Mutation, State } from "vuex-class";
import { ITodoItem, Mode } from "../store/state";
import { _ } from "../utils";
@Component({
  components: {
    [Icon.name]: Icon
  }
})
export default class Header extends Vue {
  @State private todoItem!: ITodoItem[];
  @Mutation private createTodoItem!: (todo: ITodoItem) => void;

  private createTodoItemHandle() {
    const newItem: ITodoItem = {
      id: _.uuid(),
      name: "新任务",
      isDone: false,
      mode: Mode.edit,
      iconName: "yingtao",
      color: "#FFCC22"
    };
    this.createTodoItem(newItem);
  }

}
```

我们看到 \@Mutation 就是 vuex-class 提供的装饰器，它可以帮助我们把相关的 mutations 作为类成员来使用。

## 自定义 todo 内容

我们可以先看一下动图的演示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc18881652b8ba~tplv-t2oaga2asx-image.image)

我们点击了 + 按钮之后创建了新的 todo 任务，然后进入了自定义 todo 任务的编辑页面，我们可以选择背景颜色和图标，也可以自定义任务名称。

这些逻辑我们统一在 mutations 中实现：

```
export const mutations: MutationTree<State> = {
    ...
  // 选择图标背景
  selectColor(state: State, payload: { id: string; color: string }) {
    const list = state.todoList;
    const todo = _.find(list, payload.id);

    if (todo) {
      todo.color = payload.color;
    }
  },
  // 选择图标
  selectIcon(state: State, payload: { id: string; icon: string }) {
    const list = state.todoList;
    const todo = _.find(list, payload.id);
    if (todo) {
      todo.iconName = payload.icon;
    }
  },

  // 编辑任务名称
  changeName(state: State, payload: { id: string; value: string }) {
    const list = state.todoList;
    const todo = _.find(list, payload.id);
    if (todo) {
      todo.name = payload.value;
    }
  }
};

```

后面我们借助 vuex-class 把它们作为类的成员使用，我们看 `src/views/Create.vue` 的部分：

```
export default class Create extends Vue {
  private iconSetting: string[] = config.iconSetting;
  private colorSetting: string[] = config.colorSetting;
  private id!: string;
  private index!: number;
  private currentItem!: ITodoItem;
  @Mutation
  private selectColor!: (payload: { id: string; color: string }) => void;
  @Mutation
  private selectIcon!: (payload: { id: string; icon: string }) => void;
  @Mutation
  private changeName!: (payload: { id: string; value: string }) => void;
  @Getter private getCurrentTodoList!: ITodoItem[];
  // 获取当前将要创建的todo的id
  private mounted() {
    console.log(this.getCurrentTodoList);
    const list = this.getCurrentTodoList;
    this.index = list.length - 1;
    const currentItem = list[this.index];
    this.id = currentItem.id;
  }
  // 计算当前icon名称
  private get iconComputed() {
    const currentItem = _.find(this.getCurrentTodoList, this.id);
    const { iconName } = currentItem!;
    return iconName;
  }
  // 计算当前背景颜色
  private get colorComputed() {
    const currentItem = _.find(this.getCurrentTodoList, this.id);
    const { color } = currentItem!;
    return color;
  }
  private changeColorHandle(color: string) {
    this.selectColor({ id: this.id, color });
  }
  private handleIconHandle(name: string) {
    this.selectIcon({ id: this.id, icon: name });
  }
  private get nameComputed() {
    const todo = _.find(this.getCurrentTodoList, this.id);
    return todo!.name;
  }
  private set nameComputed(name) {
    this.changeName({ id: this.id, value: name });
  }
}
```

你可能会好奇 \@Getter 是干什么的，这个其实就是将 Vuex 中的 Getter 添加到类成员的装饰器，我们在这里把 todoList 这个数组作引入进来，方便操作。

## 删除、完成 todo 任务

我们创建完任务之后回到首页，会发现多出了一个 todo 任务，这个时候我们需要两个逻辑：

- 任务完成逻辑
- 删除任务逻辑

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc188816b24d34~tplv-t2oaga2asx-image.image)

我们在 mutations 中编辑相关逻辑：

```
  deleteTodoItem(state: State, id: string) {
    const list: ITodoItem[] = state.todoList;
    state.todoList = list.filter(item => item.id !== id);
  }
  // 将此任务设置为完成
  doneTodoItem(state: State, id: string) {
    const list: ITodoItem[] = state.todoList;
    const todo = _.find(list, id);
    if (todo) {
      todo.isDone = true;
    }
  }
```

然后我们在 `src/views/Home.vue` 部分应用：

```
export default class Home extends Vue {
  @Mutation private deleteTodoItem!: (id: string) => void;
  @Mutation private doneTodoItem!: (id: string) => void;
  @Getter private getCurrentTodoList!: ITodoItem[];

  private get TodoListComputed() {
    const list = this.getCurrentTodoList.filter(
      item => item.mode !== Mode.edit
    );

    return list;
  }

  private delHandle(id: string) {
    this.deleteTodoItem(id);
  }

  private doneHandle(id: string) {
    this.doneTodoItem(id);
  }
}
```

## 小结

逻辑编写部分没有什么有太大难度的东西，强烈建议你把源代码拷贝下来，结合本节内容和注释进行学习，因为其中涉及了一些细节我们碍于篇幅没办法都涉及到。

这就是我们借助 TypeScript + Vue 完成的一个简单的 TODO 应用，其实如果你搞清楚了这个小应用，整个使用就不会有太大问题了。

但是值得注意的是，目前 vue2.6x 虽然对 TypeScript 的支持已经有了一定进步，但是整体的代码提示还是不到位，语法噪音依然非常大，vue 3.0 要到 2020年一季度发布，这个版本的 Vue 只是个过渡，在下个用 TypeScript 重写后的 Vue 3.0 发布后我们会继续进行实战。
    