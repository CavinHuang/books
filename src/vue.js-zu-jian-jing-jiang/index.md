
---
title: Vue.js 组件精讲
---

## 简介
iView 作者 3 年的 Vue.js 组件开源积累，Vue.js 组件知识深入剖析

## 说明
## 小册介绍

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5ebd5b1aac24e49b82797f1fbf02147~tplv-k3u1fbpfcp-zoom-1.image)

Vue.js 无疑是前端最热门的框架之一，而 Vue.js 最精髓的，正是它的组件。写一个 Vue 工程，也就是在写一个个的组件。换言之，学好了 Vue.js 的组件，也就能很好地驾驭 Vue.js 框架和千变万化的复杂业务场景。

如今，关于 Vue.js 的教程已经非常丰富，大部分开发者阅读文档后，都可以很快上手 Vue.js 的开发，而写好每一个组件，成了当前众多开发者的一个难题。

Vue.js 的组件和组件化在使用中有非常多的技巧和最佳实践，本小册则针对 Vue.js 最核心的部分—组件，来深入讲解，带着完整示例来解决一个个与组件相关的疑难点和知识点。

同时，作为 Vue.js 知名组件库 iView 的作者，深入开发超过 50 个极其复杂的通用组件，包含了 Vue.js 组件的各个场景，对 Vue.js 的组件开发，有着独树一帜的见解和经验。

## 作者介绍

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c1043fcdcca4c58832fbc0ea29474a2~tplv-k3u1fbpfcp-zoom-1.image)

Aresn，基于 Vue.js 的开源 UI 组件库 — iView 的作者（GitHub 超过 20000 星）。前大数据公司 TalkingData 前端架构师。畅销书籍《Vue.js实战》的作者（Vue.js 作者尤雨溪作序，销量超 4 万册）。在掘金发表众多关于 Vue.js 的技术文章，获得点赞 7000+，阅读 24 万+。更多介绍可以阅读文章 [《2016我的心路历程：从 Vue 到 Webpack 到 iView》](https://juejin.cn/post/6844903461306236942)。

## 你会学到什么？

- 了解 Vue.js 组件开发的精华
- Vue.js 组件知识全覆盖
- 掌握多种 Vue.js 组件开发的模式
- 独立组件不依赖 Vuex 和 Bus 情况下，各种跨级通信手段（provide / inject、broadcast / dispatch、findComponents 系列）
- 7 个完整的 Vue.js 组件示例
- 如何做好一个开源项目
- Vue.js 容易忽略的 API 详解
- Vue.js 面试、常见问题答疑

## 适宜人群

- 了解 JavaScript 语言
- Vue.js 初、中、高级开发者

## 购买须知

1.  本小册为图文形式内容服务，共计 20 节；
2.  文章已全部更新完毕；
3.  购买用户可享有小册永久的阅读权限；
4.  购买用户可进入小册微信群，与作者互动；
5.  掘金小册为虚拟内容服务，一经购买成功概不退款；
6.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
7.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [开篇：Vue.js 的精髓——组件](<./kai-pian-vue.js-de-jing-sui----zu-jian.md>)
- [基础：Vue.js 组件的三个 API：prop、event、slot](<./ji-chu-vue.js-zu-jian-de-san-ge-api-prop-event-slot.md>)
- [组件的通信 1：provide / inject](<./zu-jian-de-tong-xin-1-provide-or-inject.md>)
- [组件的通信 2：派发与广播——自行实现 dispatch 和 broadcast 方法](<./zu-jian-de-tong-xin-2-pai-fa-yu-guang-bo----zi-xing-shi-xian-dispatch-he-broadcast-fang-fa.md>)
- [实战 1：具有数据校验功能的表单组件——Form](<./shi-zhan-1-ju-you-shu-ju-xiao-yan-gong-neng-de-biao-dan-zu-jian----form.md>)
- [组件的通信 3：找到任意组件实例——findComponents 系列方法](<./zu-jian-de-tong-xin-3-zhao-dao-ren-yi-zu-jian-shi-li----findcomponents-xi-lie-fang-fa.md>)
- [实战 2：组合多选框组件——CheckboxGroup \& Checkbox](<./shi-zhan-2-zu-he-duo-xuan-kuang-zu-jian----checkboxgroup-and-checkbox.md>)
- [Vue 的构造器——extend 与手动挂载——\$mount](<./vue-de-gou-zao-qi--extend-yu-shou-dong-gua-zai--mount.md>)
- [实战 3：动态渲染 .vue 文件的组件—— Display](<./shi-zhan-3-dong-tai-xuan-ran-.vue-wen-jian-de-zu-jian-----display.md>)
- [实战 4：全局提示组件——\$Alert](<./shi-zhan-4-quan-ju-ti-shi-zu-jian----alert.md>)
- [更灵活的组件：Render 函数与 Functional Render](<./geng-ling-huo-de-zu-jian-render-han-shu-yu-functional-render.md>)
- [实战 5：可用 Render 自定义列的表格组件——Table](<./shi-zhan-5-ke-yong-render-zi-ding-yi-lie-de-biao-ge-zu-jian----table.md>)
- [实战 6：可用 slot-scope 自定义列的表格组件——Table](<./shi-zhan-6-ke-yong-slot-scope-zi-ding-yi-lie-de-biao-ge-zu-jian----table.md>)
- [递归组件与动态组件](./di-gui-zu-jian-yu-dong-tai-zu-jian.md)
- [实战 7：树形控件——Tree](<./shi-zhan-7-shu-xing-kong-jian----tree.md>)
- [拓展：Vue.js 容易忽略的 API 详解](<./tuo-zhan-vue.js-rong-yi-hu-lue-de-api-xiang-jie.md>)
- [拓展：Vue.js 面试、常见问题答疑](<./tuo-zhan-vue.js-mian-shi-chang-jian-wen-ti-da-yi.md>)
- [拓展：如何做好一个开源项目（上篇）](./tuo-zhan-ru-he-zuo-hao-yi-ge-kai-yuan-xiang-mu-shang-pian-.md)
- [拓展：如何做好一个开源项目（下篇）](./tuo-zhan-ru-he-zuo-hao-yi-ge-kai-yuan-xiang-mu-xia-pian-.md)
- [写在最后](./xie-zai-zui-hou.md)

    