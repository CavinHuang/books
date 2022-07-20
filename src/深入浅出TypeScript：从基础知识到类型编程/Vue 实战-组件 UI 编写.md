
# Vue 实战-组件 UI 编写
---

# Vue 实战：组件 UI 编写

我们本节开始正式编写组件，我们尽量在组件的编写过程中串联上我们的知识点，因此，有些时候我们的用法并不是最优解，而是为了要把一些重要的 API 用法带到实战项目中去。

注意，我们的[源代码](https://github.com/xiaomuzhu/vue-ts-todo)已经在 github 上，强烈建议结合源代码阅读。

我已经把对应的部分打上标签：

![2019-10-13-03-34-01](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc18798dfe0296~tplv-t2oaga2asx-image.image)

- Header 组件编写对应 Tag v1.0
- Create 页面编写对应 Tag v1.1
- 剩余逻辑编写对应 Tag v1.2

这个应用的整体逻辑效果演示如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc18798e637cf0~tplv-t2oaga2asx-image.image)

## Header 组件编写

我们在 `src/components/` 目录下新建 `Header.vue` 单文件，在这里我们编写一个 `Header` 组件。

> 非常建议你进入 github 的代码[仓库](https://github.com/xiaomuzhu/vue-ts-todo/blob/v1.0/src/components/Header.vue)结合本节学习

我们的 `Header` 组件其实是一个头部组件，会显示当前页面的标题和导航、操作按钮，效果如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc18798e932822~tplv-t2oaga2asx-image.image)

这里我们想展示两个知识点：

- 计算属性的使用
- 方法的使用

我们计划只用两个路由，一个 home 路由存放我们的各种 todo 列表，另一个 create 路由用于新建 todo 项目。

而这两个页面 Header 组件的 Icon 按钮不仅样式不同，位置不同，事件也不同，而页面标题也不一样，所以我们需要根据不同的路由来生成不同的 Header。

所以应该如何计算出不同的情况，这个时候用计算属性比较适合。

TypeScript 中的计算属性是用类的存取器来实现的，比如我们的方法为 `pageInfoComputed`，需要在其前面加上 `get`。

```
@Component({
  components: {
    [Icon.name]: Icon
  }
})
export default class Header extends Vue {

  private get pageInfoComputed() {
    const currentRouteName = this.$route.name;
    switch (currentRouteName) {
      case "home":
        return {
          icon: {
            name: "plus",
            arrow: "right"
          },
          title: "我的待办"
        };
      case "create":
        return {
          icon: {
            name: "arrow-left",
            arrow: "left"
          },
          title: "新建任务"
        };

      default:
        return "";
    }
  }
}
```

如何我们想要声明两个方法，分别对应两个不同的 Icon 对应的行为，一个是跳转到 create 路由，一个是路由后退。

在 TypeScript 我们直接使用类方法即可，你也可以加上访问修饰符：

```
...
  private leftHandle() {
    this.$router.back();
  }

  private rightHandle() {
    this.$router.push({ path: "/create" });
  }

...
```

随后我们在模板中使用：

```
  <header>
    <div>
      <van-icon
        v-if="pageInfoComputed.icon.arrow === 'left'"
        :name="pageInfoComputed.icon.name"
        size="1.5rem"
        @click="leftHandle"
      />
    </div>
    <h3>{{ pageInfoComputed.title }}</h3>
    <div>
      <van-icon
        v-if="pageInfoComputed.icon.arrow === 'right'"
        :name="pageInfoComputed.icon.name"
        size="1.5rem"
        @click="rightHandle"
      />
    </div>
  </header>
```

最后的效果就是上个 gif 的样子。

## 图标组件编写

我们希望给每一个 todo 任务都配上一个图标：

![2019-10-12-18-40-41](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc18798eb0e804~tplv-t2oaga2asx-image.image)

这个组件其实有两个主要部分组成的，分别是：

- 圆圈：包括外围的 border 和背景色
- icon：中间的图案

我们先编写圆圈部分。

> 建议移步本组件[仓库地址](https://github.com/xiaomuzhu/vue-ts-todo/blob/v1.1/src/components/Circle.vue)

我们在 `src/components/` 目录下新建 `Circle.vue` 单文件，在这里我们编写一个 `Circle` 组件。

由于我们之后还有一个需求，就是可以随时切换背景颜色，所以我们需要一个方法来根据外部属性的变化来更改自己的背景颜色。

我们这里用了 \@Watch 侦听器装饰器，其实这里用其他方法也可以，但是我们为了尽量把之前的 API 都利用上，在这里是教学目的。

```
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class Circles extends Vue {
  @Prop() private radius!: string;
  @Prop() private activeColor!: string;
  private styleObj = {
    background: this.activeColor || "#ffe78d",
    width: this.radius || "3rem",
    height: this.radius || "3rem"
  };

  // 监听背景颜色变化
  @Watch("activeColor")
  private changeColor(val: string, old: string) {
    this.styleObj.background = val;
  }
}
```

在模板里我们留了一个插槽，这个插槽就是留给之后的 Icon 使用的：

```
  <div class="circle" :style="styleObj">
    <slot name="icon"></slot>
  </div>
```

我们接着编写 Icon 部分。

图标我们可以去[阿里巴巴矢量图标库](https://www.iconfont.cn/)寻找。

我已经把搜集好的图标打包放在了`src/assets/iconfont.js`中，可以移步[仓库](https://github.com/xiaomuzhu/vue-ts-todo/blob/v1.1/src/assets/iconfont.js)。

然后将这些组件在 `src/main.ts` 下引入:

```
...
import "@/assets/iconfont.js";
...
```

但是这些图标要想使用依然需要我们额外编写一些代码，我们也可以用现成的库来方便我们的使用。

首先下载帮助我们使用图标的库：

```
npm i -S vue-icon-font-pro
```

由于此库没有相关的 `d.ts` 文件，我们可以在 `src/shims-vue.d.ts` 中声明：

```
declare module "vue-icon-font-pro";
```

如何在 `src/main.ts` 下引入此库，然后注册：

```
import VueIconFont from "vue-icon-font-pro";
...

Vue.use(VueIconFont);
```

这样我们就可以使用图标了，究竟应该如何结合两部分？我们往下看。

## 编写 Create 页面

我们 Create 页面的实现效果是这样的：

![2019-10-12-19-09-10](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/13/16dc18798ef1be8c~tplv-t2oaga2asx-image.image)

我们可以自由地选择下面的背景颜色和图标来组成一个 todo 图标，然后还可以给这个 todo 起一个任务名称。

此页面相关代码请移步[Create.vue](https://github.com/xiaomuzhu/vue-ts-todo/blob/v1.1/src/views/Create.vue)。

这么多的图标和颜色我们分别把它放在了两个数组里，我们新建 `src/config.ts`，然后将数组放在[其中](https://github.com/xiaomuzhu/vue-ts-todo/blob/v1.1/src/config.ts)。

再回到 `src/views/Create.vue` 下面，我们的页面分为四部分：

 -    todo图标：这个图标会随着我们选择下方的背景颜色和图标而变化
 -    任务名称：这是个输入栏，用于创建任务名称
 -    图标集合
 -    颜色集合

```
import { Component, Vue } from "vue-property-decorator";
import { SwipeCell, Cell, CellGroup, Field } from "vant";
import Circles from "../components/Circle.vue";
import { config } from "../config";

@Component({
  components: {
    [SwipeCell.name]: SwipeCell,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    Circles
  }
})
export default class Create extends Vue {
  private iconSetting: string[] = config.iconSetting;
  private colorSetting: string[] = config.colorSetting;
}
```

结合模板：

```
  <div class="iconSetting">
    <!-- 当前图表 -->
    <section class="icon">
      <Circles class="cir" radius="3.5rem">
        <icon name="kite" slot="icon" />
      </Circles>
    </section>
    <!-- 任务名称 -->
    <section>
      <van-cell-group>
        <van-field input-align="center" placeholder="请输入任务名" />
      </van-cell-group>
    </section>
    <!-- 备选图标 -->
    <section class="alternative">
      <div
        class="alternativeIcon"
        v-for="(item, index) in iconSetting"
        :key="index"
      >
        <icon :name="item" />
      </div>
    </section>
    <!-- 图标背景 -->
    <section class="colorSetting">
      <div
        class="background"
        v-for="(item, index) in colorSetting"
        :key="index"
      >
        <div v-bind:style="{ backgroundColor: item }"></div>
      </div>
    </section>
  </div>
```

目前我们的效果已经跟图中的相差无几了，就是有一点，它没有逻辑，只有UI，我们先暂且放一放逻辑这部分，下一章节我们会具体实现。

## 小结

我们已经基本实现了这个 todo 应用的 UI 部分，也基本上把 \@Component、\@Watch、\@Prop 等装饰器语法串联了一遍，接下来我们需要编写逻辑部分，这就需要用到 Vuex 了。
    