
# 小册食用指南
---

# 小册子食用指南

TypeScript 虽然是为了 JavaScript 而生的静态语言，但是它其实是 JavaScript 的超集，整个类型系统和非常多的新特性都是 JavaScript 不具备的，因此本册子内容相对比较多，建议您阅读小册食用指南来帮助您快速搞清楚册子的脉络。

## 为什么要学习 TypeScript

- 为大型系统而生：TypeScript 是静态类型化的 JavaScript 超集，在大型工程中有无可比拟的优势，是开发大型系统的必备良药，VSCode、Vue 3.0、Angular都是由TS开发
- 招聘市场需求陡增：从2018年开始 TypeScript 就成为GitHub前10的语言，已经有大量的大厂团队采用 TypeScript 开发，很多招聘要求上有了 TypeScript 的身影，或者必备或者加分项
- Vue3.0发布在即：统治前端的三大框架Angular、React、Vue，Angular本身就是TS最早的支持者，React 对 TS 支持友好，非常多的团队开始 TS 化，Vue3.0一旦发布，依赖前端框架的业务开发基本上就离不开 TS 了

> 虽然 Angular 和 Vue 都声称支持 js 开发，但是由于本身用 TS 编写，后续的生态也基于 TS，基本上很少人再用 js 编写相关代码

## TS开发者的四个层级

在我心中 TypeScript 的开发者是分四个层级的：

1.  业务使用者： 这个层级的开发者可以在业务代码中熟练利用 TypeScript 编码，但是无法进行类型编程，也无法写出一些底层库，仅仅停留在使用阶段
2.  类型编程者： 这个层级的开发者可以对类型进行编程，可以开发出一些实用的工具类型，对于难以定义的类型也能驾轻就熟
3.  TS定制者： 这个层级的开发者对 TypeScript 的类型系统比较熟悉，对 TypeScript 的语言设计也有一定的认知，可以开发 `TypeScript Transformer Plugin`来定制化开发 TypeScript
4.  TS设计者： 这个层面的开发者可以参与到 TypeScript 这门语言的设计中去，基本上能达到PL领域的从业人员的水准

笔者现在刚刚能抓住第三个层面的门把手...

## 内容划分

本册子的内容分为四个模块：

- 入门准备
  - 小册子食用指南
  - 为什么要学习 TypeScript
  - 开始使用 TypeScript
- 基础内容
  - TypeScript 的原始类型
  - TypeScript 中其他常见类型
  - 深入理解枚举类型
  - 接口（interface）
  - 类（Class）
  - 函数（Function）
  - 泛型（generic）的妙用
  - 类型断言与类型守卫
  - 类型兼容性
  - 高级类型之交叉类型、联合类型、类型别名
  - 可辨识联合类型
  - 装饰器
  - 高级装饰器
  - Reflect Metadata
  - 基础内容的知识点补充
- 基础内容实战
  - TypeScript 与 React 实战（组件篇上）
  - TypeScript 与 React 实战（组件篇下）
  - TypeScript 与 React 实战（Redux篇）
  - Vue 实战：搭建环境
  - Vue 实战：vue-property-decorator
  - Vue 实战：组件 UI 编写
  - Vue 实战：TypeScript 下的 Vuex
  - TypeScript 企业级服务端开发之理论篇
  - TypeScript 企业级服务端开发之实战篇
- 进阶内容
  - 高级类型之索引类型、映射类型
  - 高级类型之条件类型
  - 高级类型之强大的 infer 关键字
  - 常用工具类型解读
  - TypeScript 几个实用技巧
  - 解一道 LeetCode 中国招聘面试题
  - 模块与命名空间
  - 理论：如何为编写声明文件
  - 实战：编写 JavaScript 库编写声明文件
- 定制TS
  - TypeScript 的编译原理
  - 编写 TypeScript Transformer Plugin
- 工程化
  - 工程化之 tsconfig.json 配置
  - 工程化之代码检测
  - 工程化之单元测试
  - 工程化之环境搭建
- 最后
  - 常见问题答疑
  - TypeScript 的学习之路与君共勉

## 一些术语

为了节省篇幅，笔者会把一些名称或者术语简写，比如：

- TypeScript 简写为 TS
- JavaScript 简写为 JS或者js
- Visual Studio Code 简写为 VS Code

望大家悉知。
    