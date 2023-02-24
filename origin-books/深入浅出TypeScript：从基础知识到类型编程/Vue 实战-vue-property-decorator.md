
# Vue 实战-vue-property-decorator
---

# Vue 实战：vue-property-decorator

我们打开项目，发现最大的不同是额外引入了一个库 `vue-property-decorator`。

由于它的存在，我们可以使用基于类的注解装饰器进行开发，这个语法就有点像 Angular 了。

你可能听说过另外一个库 \-- `vue-class-component`，它是 Vue 官方推出的一个支持使用 class 方式来开发 vue 单文件组件的库。

而 `vue-property-decorator` 正是基于此而来，它在此基础上增加了装饰器相关的功能，因此它也同时拥有 `vue-class-component` 的功能。

## 主要功能

vue-class-component 功能如下：

- methods 可以直接声明为类的成员方法
- 计算属性可以被声明为类的属性访问器
- 初始化的 data 可以被声明为类属性
- data、render 以及所有的 Vue 生命周期钩子可以直接作为类的成员方法
- 所有其他属性，需要放在装饰器中

vue-property-decorator 主要提供了多个装饰器和一个函数:

- \@Prop
- \@PropSync
- \@Model
- \@Watch
- \@Provide
- \@Inject
- \@ProvideReactive
- \@InjectReactive
- \@Emit
- \@Ref
- \@Component \(由 vue-class-component 提供\)
- Mixins \(由 vue-class-component 提供\)

## vue-class-component 主要功能

### \@Component

Component装饰器它注明了此类为一个Vue组件，因此即使没有设置选项也不能省略。如果需要定义比如 name、components、filters、directives以及自定义属性，就可以在Component装饰器中定义。

JavaScript 中的代码如下：

```
import {componentA,componentB} from '@/components';

export default{
    components:{
        componentA,
        componentB,
    },
    directives: {
        focus: {
            // 指令的定义
            inserted: function (el) {
                el.focus()
            }
        }
    }
}

```

在 TypeScript中如下：

```
import {Component,Vue} from 'vue-property-decorator';
import {componentA,componentB} from '@/components';

 @Component({
    components:{
        componentA,
        componentB,
    },
    directives: {
        focus: {
            // 指令的定义
            inserted: function (el) {
                el.focus()
            }
        }
    }
})
export default class YourCompoent extends Vue{
   
}

```

### Computed、Data、Methods语法

这里取消了组件的data和methods属性，以往data返回对象中的属性、methods中的方法需要直接定义在Class中，当做类的属性和方法。

```
@Component
export default class HelloDecorator extends Vue {
    count: number = 123 // 类属性相当于以前的 data

    add(): number { // 类方法就是以前的方法
        this.count + 1
    }

    // 获取计算属性
    get total(): number {
      return this.count + 1
    }

    // 设置计算属性
    set total(param:number): void {
      this.count = param
    }
}

```

## vue-property-decorator 主要 API 解读

### \@Prop

这个装饰器是属性相关的装饰器, `@Prop(options: (PropOptions | Constructor[] | Constructor) = {})`。

在使用Prop装饰器定义属性时，如果我们打开了 tsconfig.js 配置文件中的 strictpropertyinitialize 选项，我们就需要通过附加一个 `!` 给定义的属性，还记得这个语法吗？显式复制断言。

我们看一下 JavaScript 版的一个 Vue 代码片段：

```
export default{
    props:{
        propA:String,
        propB:[String,Number],
        propC:{
            type:Array,
            default:()=>{
                return ['a','b']
            },
            required: true,
            validator:(value) => {
                return [
                    'a',
                    'b'
                 ].indexOf(value) !== -1
        }
    }
}
}
```

如果我们使用的是 TypeScript：

```

import {Component,Vue,Prop} from vue-property-decorator;

@Component
export default class YourComponent extends Vue {
    @Prop(String)
    propA:string;
    
    @Prop([String,Number])
    propB:string|number;
    
    @Prop({
     type: String, // type: [String , Number]
     default: 'default value', // 一般为String或Number
      //如果是对象或数组的话。默认值从一个工厂函数中返回
      // defatult: () => {
      //     return ['a','b']
      // }
     required: true,
     validator: (value) => {
        return [
          'InProcess',
          'Settled'
        ].indexOf(value) !== -1
     }
    })
    propC:string;
    
    
}
```

## \@Watch

这个装饰器其实就是 Vue 中的侦听器。

> `@Watch(path: string, options: WatchOptions = {})`

JavaScript 版 vue 中写法：

```
export default {
  watch: {
    child: [
      {
        handler: 'onChildChanged',
        immediate: false,
        deep: false
      }
    ],
    person: [
      {
        handler: 'onPersonChanged1',
        immediate: true,
        deep: true
      },
      {
        handler: 'onPersonChanged2',
        immediate: false,
        deep: false
      }
    ]
  },
  methods: {
    onChildChanged(val, oldVal) {},
    onPersonChanged1(val, oldVal) {},
    onPersonChanged2(val, oldVal) {}
  }
}
```

在 TypeScript 中：

```
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class YourComponent extends Vue {
  @Watch('child')
  onChildChanged(val: string, oldVal: string) {}

  @Watch('person', { immediate: true, deep: true })
  onPersonChanged1(val: Person, oldVal: Person) {}

  @Watch('person')
  onPersonChanged2(val: Person, oldVal: Person) {}
}
```

使用了装饰器后明显代码简洁了不少。

## \@Emit

关于 Vue 中的事件的监听与触发,Vue 提供了两个函数 `$emit` 和 `$on`。那么在 `vue-property-decorator` 中如何使用呢\?

这就需要用到 `vue-property-decorator` 提供的 \@Emit 装饰器。

在 JavaScript 中如下：

```
    import Vue from 'vue';
    export default {
        mounted(){
            this.$on('emit-todo', function(n) {
                console.log(n)
            })
            this.emitTodo('world');
        },
        methods: {
            emitTodo(n){
                console.log('hello');
                this.$emit('emit-todo', n);
            }
        }
    }
```

在 TypeScript 中如下：

```
   import {Vue, Component, Emit} from 'vue-property-decorator';
    @Component({})
    export default class Some extends Vue{
        mounted(){
            this.$on('emit-todo', function(n) {
                console.log(n)
            })
            this.emitTodo('world');
        }
            @Emit()
        emitTodo(n: string){
            console.log('hello');
        }
    }
```

在 `@Emit` 装饰器的函数会在运行之后触发等同于其函数名\(驼峰式会转为横杠式写法\)的事件, 并将其函数传递给 `$emit`. 如果我们想触发特定的事件呢,比如在 emitTodo 下触发 reset事件:

```
 import {Vue, Component, Emit} from 'vue-property-decorator';
    @Component({})
    export default class "组件名" extends Vue{
        @Emit('reset')
        emitTodo(n: string){
        }
    }
```

我们只需要给装饰器 \@Emit 传递一个事件名参数 reset,这样函数 emitTodo 运行之后就会触发 reset 事件.

在 Vue 中我们是使用 `$emit` 触发事件,使用 `vue-property-decorator` 时,可以借助 \@Emit 装饰器来实现。

\@Emit 修饰的函数所接受的参数会在运行之后触发事件的时候传递过去。

\@Emit触发事件有两种写法:

- `@Emit()` 不传参数,那么它触发的事件名就是它所修饰的函数名
- `@Emit(name: string)` 里面传递一个字符串,该字符串为要触发的事件名

## \@Model

Vue 组件提供 `model: {prop?: string, event?: string}` 让我们可以定制 prop 和 event。

默认情况下，一个组件上的 v-model 会把 value 用作 prop且把 input用作 event，但是一些输入类型比如单选框和复选框按钮可能想使用 value prop来达到不同的目的，使用model选项可以回避这些情况产生的冲突。

比如：

```
Vue.component('my-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    // this allows using the `value` prop for a different purpose
    value: String,
    // use `checked` as the prop which take the place of `value`
    checked: {
      type: Number,
      default: 0
    }
  },
  // ...
})
```

在模板中使用：

```
<my-checkbox v-model="foo" value="some value"></my-checkbox>
```

此模板相当于：

```
<my-checkbox
  :checked="foo"
  @change="val => { foo = val }"
  value="some value">
</my-checkbox>
```

使用 vue-property-decorator 提供的 \@Model 改造上面的例子:

```
import { Vue, Component, Model} from 'vue-property-decorator';
@Component
export class myCheck extends Vue{
   @Model ('change', {type: Boolean})  checked!: boolean;
}
```

`@Model()` 接收两个参数, 第一个是 event 值, 第二个是prop 的类型说明。

## 小结

我们通过本节学习了 TypeScript 版的 Vue Class 化的语法，要多处用到装饰器和 Class，这跟 Vue 原本的语法想去很远，但是其本质是一样的，我们可以进入实战来快速熟悉这些语法。
    