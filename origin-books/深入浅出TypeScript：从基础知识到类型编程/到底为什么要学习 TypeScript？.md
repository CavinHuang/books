
# 到底为什么要学习 TypeScript？
---

# 到底为什么要学习 TypeScript？

TypeScript 在推出之初就既受追捧又受质疑，在社区和各种论坛中总有一些这样的声音：

- 静态语言会丧失 JavaScript 的灵活性
- 静态类型不是银弹，大型项目依然可以用 JavaScript 编写
- TypeScript 必定赴 coffeescript 后尘，会被标准取代

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/18/16ddd250a01a489e~tplv-t2oaga2asx-image.image)

我们通过本节来重新认识一下 TypeScript，它跟你想象中的 TypeScript 可能不同。

## JavaScript 的超集

JavaScript 与 TypeScript 的关系就像下图所示：

![2019-10-18-02-34-40](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/18/16ddd2507f91d85d~tplv-t2oaga2asx-image.image)

在 TypeScript 可以使用一些尚在提案阶段的语法特性，可以有控制访问符，而最主要的区别就是 TypeScript 是一门静态语言。

这也是为什么 「TypeScript 必定赴 coffeescript 后尘，会被标准取代」 这个论断几乎不可能成立的原因之一，coffeescript 本质上是 JavaScript 的语法糖化，ES2015 参考了大量 coffeescript 的内容进行了标准化，因此 coffeescript 的优势也就不存在了，被淘汰在所难免。

给一门语言加语法糖是相对容易推进到标准的事情，而直接把一门语言从动态改为静态，还要兼容数以亿计的老旧网站，这个在可预见的时间内几乎不可能发生，TypeScript 与 coffeescript 虽然都是 「Compile to JavaScript Language」，但是 TypeScript 的静态性是它立于不败之地的基础。

## 静态类型

编程语言的静态类型定义在学术上理解起来比较复杂，简单来说，一门语言在编译时报错，那么是静态语言，如果在运行时报错，那么是动态语言。

这里还有纠正一个概念，TypeScript 是静态弱类型语言，这跟C语言是一样的，并不是所谓的强类型，因为要兼容 JavaScript， 所以 TypeScript 几乎不限制 JavaScript 中原有的隐式类型转换，它对类型的隐式转换是有容忍度的，而真正的静态强类型语言比如 Java、C# 是不会容忍隐式转换的。

那么为什么静态类型是 TypeScript 的杀手锏呢？

归根到底，任何能提升生产力的东西都会被加入工程化的浪潮中，更何况一门静态类型的语言对生产力的提升是质的。

我们先看看在 JavaScript 项目中最常见的十大错误。

![2019-10-18-03-05-05](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/18/16ddd25080469b29~tplv-t2oaga2asx-image.image)

我们是不是耳熟能详？这些低级错误占用了大量 debug 和 google 的时间，而如果你用 TypeScript 可以在编写阶段就规避了，自从我们用了 TypeScript 之后，低级报错基本就没犯过，大多数情况下是我们自身编写的程序逻辑错误。

很多项目，尤其是中大型项目，我们是需要团队多人协作的，那么如何保证协作呢？这个时候可能需要大量的文档和注释，显式类型就是最好的注释，而通过 TypeScript 提供的类型提示功能我们可以非常舒服地调用同伴的代码，由于 TypeScript 的存在我们可以节省大量沟通成本、代码阅读成本等等。

![2019-10-18-03-53-47](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/18/16ddd25080cddf9f~tplv-t2oaga2asx-image.image)

所以我对这句话「静态类型不是银弹，大型项目依然可以用 JavaScript 编写」持怀疑态度，静态类型固然不是银弹，但是它对多人协作的大型项目的友好程度是远超动态语言的，我们既然有了更好的工具为什么不用呢？

而实际上各大用动态语言的项目在这些年随着项目复杂度增加，开始逐渐进行静态化，有人会问「谷歌、Facebook 不都还在用 js、php、Python吗？」

其实不是的，这些大厂用的 php、Python、js 跟普通人用的不一样，比如 Facebook 的 js 背后有一个叫做 FlowType 的静态类型检查器，React 和 Vue 2.x 就是用的这个类型检查器，再比如 Facebook 的 Python，他背后也有一个叫做pyre-check 的静态类型检查器，实际上是虽然他们在用动态语言，但是大厂养活着一个庞大的团队来开发各种静态分析工具把动态语言变成静态的。

## 严谨不失灵活

很多人以为用了 TypeScript 之后就会丧失 JavaScript 的灵活性，其实并不是。

首先，我们得承认 JavaScript 的灵活性对于中大型项目弊远远大于利，其次，TypeScript 由于兼容 JavaScript 所以其灵活度可以媲美 JavaScript，比如你可以把任何想灵活的地方将类型定义为 any 即可，把 TypeScript 变为 AnyScript 就能保持它的灵活度，毕竟TypeScript 对类型的检查严格程度是可以通过 `tsconfig.json` 来配置的。

即使在开启 `strict` 状态下的 TypeScript 依然是很灵活的，因为为了兼容 JavaScript，TypeScript 采用了Structural Type System。

因此，TypeScript 并不是类型定义本身，而是类型定义的形状（Shape），我们看个例子：

```
class Foo {
  method(input: string): number { ... }
}

class Bar {
  method(input: string): number { ... }
}

const foo: Foo = new Foo(); // Okay.
const bar: Bar = new Foo(); // Okay.
```

以上代码是不会报错的，因为他们的「形状」是一样的，而类似的代码在 Java 或者 C# 中是会报错的。

这就是 TypeScript 类型系统设计之初就考虑到了 JavaScript 灵活性，专门选择了 Structural Type System（结构类型系统）。

## TypeScript 没有缺点吗？

我们说了这么多 TypeScript 相比 JavaScript 的优势，难道 TypeScript 是没有缺点的吗？

严格来讲，TypeScript 的缺点相比于它带来的生产力上的提升是可以忽略不计的，而一些缺点并不是 TypeScript 本身带来的。

比如，与实际框架结合会有很多坑，我们一开始学习在框架中运用 TypeScript 的时候会花大量的时间在踩坑上，因为我们需要额外学习框架定义的 d.ts,而单单是官方入门文档的知识又不足以让我们很舒服地编写代码，因此我们的册子准备了 「TypeScript + React」、「TypeScript + Vue」等实战环节，帮助大家把障碍扫平。

比如，配置学习成本高，目前的前端脚手架基本上是以 JavaScript 为主，虽然 TypeScript 已经非常火了，但是相比于 JavaScript 多年积累的生态还是稍显不如，因此很多时候我们需要自己定制脚手架，比如同样是用 ESLint 做语法检查，其配置方式跟JavaScript完全不同，需要额外学习成本，配置 TypeScript 的 tsconfig.json ，用 ts-plugin-import 进行按需引入等等，都是需要额外学习成本的，因此我们也会在后面部分对工程配置进行详解。

再比如，TypeScript 的类型系统其实比较复杂，又是额外的学习成本，比如下面的类型定义，只通过官方文档你是不知道在干什么的：

![2019-10-18-04-12-58](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/18/16ddd25081370d2d~tplv-t2oaga2asx-image.image)

这又需要我们学习额外的类型系统，我们在后面的章节同样会学习大量的高级类型和类型编程。

## 小结

本节我们了解了 TypeScript 的优势所在，总结下来有三点：

1.  规避大量低级错误，避免时间浪费，省时
2.  减少多人协作项目的成本，大型项目友好，省力
3.  良好代码提示，不用反复文件跳转或者翻文档，省心
    