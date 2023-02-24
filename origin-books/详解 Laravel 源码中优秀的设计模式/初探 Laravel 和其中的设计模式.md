
# 初探 Laravel 和其中的设计模式
---

# 初探 Laravel 和其中的设计模式

设计模式，是一套建立在长期对代码设计的实践基础上，能够在众多应用场景下反复套用的经验总结。 可以说，设计模式能够保证代码的健壮性，提高程序的可扩展性，是程序设计里的最佳模型和优秀解决方案。 设计模式比之于高楼大厦，就是其中的钢筋混泥土结构，是代码工程化的基石。

### 设计模式简述

设计模式一词，来源于 Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides 合著的《设计模式：可复用的面向对象的软件基础》（ Design Patterns: Elements of Reusable Object-Oriented Software ）一书。 在这本书中，首次提到了设计模式（ Design Patterns ）这个概念。 也正是如此，这本书被认为是设计模式的开创者，也是设计模式最本源的理论基础。

![《设计模式》的封面](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/10/1603e42b2b574f41~tplv-t2oaga2asx-image.image)

设计模式这一理念经过二十多年的积累、丰富，虽然曾有负面的声音，但不可否认的是，它仍然是当今程序设计领域不可或缺的指导思想之一。

正如《设计模式》一书中解释的：

> 在开发可利用软件时，一大问题在于其往往必须进行重构或者重组。 设计模式能帮助大家了解如何对设计进行重组，并降低日后需要面对的重构工作量。

当我们在进行程序设计时，设计模式能够指导我们进行决策，并且解释我们决策的理由。

学习设计模式，理解设计模式，并将设计模式用于指导我们的程序设计，能够帮助我们完成对结构梳理、程序规划以及代码实现中质的飞跃。

### 常见的设计模式

在《设计模式》一书中，向我们介绍了二十三种设计模式。 因为《设计模式》这本书属于开山之作，所以这些设计模式与二十三这个数字，都是设计模式领域常见的词汇。

在书中，作者们将这二十三种设计模式分成了三类，分别是创建型模式、结构型模式和行为型模式。

创建型模式包含了：

- 工厂方法模式（ Factory Method ）
- 抽象工厂模式（ Abstract Factory ）
- 单例模式（ Singleton ）
- 建造者模式（ Builder ）
- 原型模式（ Prototype ）

结构型模式包含了：

- 适配器模式（ Adapter ）
- 装饰器模式（ Decorator ）
- 代理模式（ Proxy ）
- 外观模式（ Facade ）
- 桥接模式（ Bridge ）
- 组合模式（ Composite ）
- 享元模式（ Flyweight ）

行为型模式包含了：

- 策略模式（ Strategy ）
- 模板方法模式（ Template Method ）
- 观察者模式（ Observer ）
- 迭代子模式（ Iterator ）
- 责任链模式（ Chain of Responsibility ）
- 命令模式（ Command ）
- 备忘录模式（ Memento ）
- 状态模式（ State ）
- 访问者模式（ Visitor ）
- 中介者模式（ Mediator ）
- 解释器模式（ Interpreter ）

书中通过一幅图，剖析了这二十三种设计模式的关系。

![设计模式关系图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/12/1604b289c357c18c~tplv-t2oaga2asx-image.image)

当然，《设计模式》一书毕竟篇幅有限，并且出版也已经数十年，许多设计模式，如依赖注入（ Dependency Injection ）等，其实并没有被收录在其中。 而出现在《设计模式》一书中的设计模式，也并非都是我们能够经常用到的设计模式。

在这本小册里，我们挑选了十个在 Laravel 中得以体现，并且也在我们的日常开发中能够经常派上用场的设计模式，通过理论与样例结合的方式，剖析设计模式背后的思想。

### 关于 Laravel

Laravel 是一款以 PHP 语言编写，追求为开发者提供编写简洁，富有表达能力代码的 Web 框架。

![Laravel Banner](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/12/1604b398fedf8270~tplv-t2oaga2asx-image.image)

Laravel 并不拘泥于传统的框架的霸业逻辑（框架中所有的功能都通过自身实现），而是站在了巨人的肩膀上，借助不同领域中成熟的模块，实现了优秀模块的聚合。 正是因为这个原因，Laravel 之中的各个功能模块，都汇聚着这些领域在 PHP 中最佳的实现。

当然，如果这些仍然不能说服你，那么下面这两张图应该很容易证明 Laravel 当之无愧为目前 PHP 领域的佼佼者。

在 GitHub 上 PHP 语言项目的 Star 数，Laravel 远超第二名，而且是倍数的超越。

![Github 热门项目](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/13/1605096a1bb7371a~tplv-t2oaga2asx-image.image)

Google 趋势中对主流 PHP 框架的分析，Laravel 的增长速度令其他框架望尘莫及。

![Laravel 搜索趋势图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/13/1605097253f2b288~tplv-t2oaga2asx-image.image)

### 为什么选择 Laravel

通过《设计模式：可复用的面向对象的软件基础》这一书名，很容易看得出设计模式专门针对的是面向对象的程序设计。 所以在所有的设计模式中，谈及的都是对象与对象之间的关系。 而面向过程等其他程序编程思想中，就很难发挥设计模式的用武之地了。

由于 PHP 有着特殊的历史背景，时至今日，在 PHP 语法中，仍然保持着对面向过程与面向对象的同时支持。 正是由于这个原因，许多老牌 PHP 框架也充斥着大量面向过程与面向对象混杂，逻辑难以梳理的代码。

Laravel 作为 PHP Web 框架领域的新宠，其相较于其他主流 PHP 框架来说年轻太多太多。 也是因为如此，Laravel 可以毫无顾忌的完全展开它的构想，完整的将面向对象的编程思想融入到框架的每个地方。

在此基础上，Laravel 对自身代码的质量也非常重视，任何一个模块都经过反复琢磨。 即使是非常细枝末节的部分，Laravel 都没有粗陋去实现。 所以，在 Laravel 中，我们能够发现很多设计模式的体现可以借鉴。

就是基于这些原因，这本小册里选择了 Laravel 的源码作为示例，展现设计模式在真实场景中的体现。 希望通过设计模式理论和 Laravel 代码中实际使用的结合，帮助大家更好的理解设计模式的精华。
    