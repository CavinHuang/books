
# 查询语句建造器
---

# 查询语句建造器

> 建造者模式：
> 
> 将一个复杂对象的构建与实体表示分离，使得同样的构建过程可以创建不同的实体表示。

### 建造者模式浅析

对象是对真实世界事物的抽象，那在面向对象的编程中，我们遇到像真实世界中存在的一些复杂事物一样，遇到比较复杂的对象。 这就如同是汽车，如果我们对它进行建模并设计对象，我们就会发现，汽车是由方向盘、发动机、车轮等等成百上千的部件所组成。

![车与人的关系](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/17/16063bc1be57afa5~tplv-t2oaga2asx-image.image)

对于普通用户来说，我们仅仅是使用汽车这个对象，对于它是如何有这些部件组装而来的其实并不关心。 但要获得汽车对象，又必须了解所有部件的组合装配方式，这就让使用者必须去了解一个自己并不关心的流程，也就是违反最少知识原则（见附录 1 设计模式的七大原则）的典型例子。 在这种场景下，如果汽车的任何一个组件结构发生了改变，那即使汽车的功能没有任何的变化，使用者都需要去改变自己的代码，以适配这个改动。 这就是在这种场景下，会发生严重耦合的机理。

在这种时候，我们通常趋向于将对象的对象的组装过程进行分拆，也就是让专业的师傅负责汽车的组装，而我们只负责驾驶汽车。 这种将对象的构建与对象成品进行分离的思想，就是建造者模式。 而独立出来，专门负责对象构建的对象，就是建造者对象。

### 建造者模式的结构

在建造者模式中，通常设计有四种角色：

- Builder : 建造者抽象表示。
- ConcreteBuilder : 实现 Builder 接口，负责对象的构造和各部件的装配。
- Director : 建造者创建对象的指挥者。
- Product : 被构造的复杂对象。

![建造者模式 UML 图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/17/16063bc7e00761d5~tplv-t2oaga2asx-image.image)

当我们需要使用一个复杂对象时，只需要通过 Director 对 Builder 进行配置，使 Builder 准备好 Product 的所有部件。 之后，我们就可以直接从 Builder 中取出完整的 Product 对象了。

### SQL 的组成

说到 SQL ，大家肯定不会感到陌生。 SQL 是用于管理和操作关系型数据库管理系统（ RDBMS ）的领域特定语言（ DSL ）。

![SQL 的组成](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/17/16063bd1d6a4ca27~tplv-t2oaga2asx-image.image)

如果从语法上分析，我们可以将 SQL 归纳为几种语法元素：

- 表达式 \( Expression \) : 产生标量值，或是指定数据表中行列记录。
- 谓词 \( Predicate \) : 通过得到 SQL 三值逻辑（ 3VL : true, false, unknown ）或布尔真值来限制语句和查询的效果，改变程序流程走向。
- 查询 \( Query \) : 基于特定条件检索数据。
- 子句 \( Clause \) : 语句的组成部分。
- 语句 \( Statement \) : 可以持久地影响结构和数据，也可以控制数据库事务、程序流程、连接、会话或分析。
- 空白符 \( Whitespace \) : 优化 SQL 显示效果，便于阅读。

虽然 SQL 的语法元素仅仅只有几种，语法词也仅仅不到百个，但通过排列组合，能够衍生出无穷无尽的变化。

![SQL 的组合](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/17/16063bcd8b76d874~tplv-t2oaga2asx-image.image)

就拿我们最常用的 WHERE 条件子句来说，通过加入不同的条件，我们就能通过 SQL 语句让数据库得到不同的结果。

如果我们把 SQL 语句看成是一个对象，那么操作、列选择、查询条件、连表、排序等等，都是组成 SQL 的部件。 由于这些部件本身就有无限的可变性，所有组成的 SQL 也会各不相同，所以这个 SQL 对象，就是我们前面谈到的典型的复杂对象。

### Laravel 中的查询构造器

查询构造器 \( Query Builder \) 是 Laravel 数据库模块中非常重要，同时也是我们最常用的功能之一。 一言以蔽之，查询构造器最大的能力和优势，就是将复杂的 SQL 编写过程简化成了简单的方法调用。

```
// 普通 SQL 写法
// select `users`.*, `contacts`.`phone`, `orders`.`price` from `users`
// inner join `contacts` on `users`.`id` = `contacts`.`user_id`
// inner join `orders` on `users`.`id` = `orders`.`user_id`

// 使用查询构造器的写法
$sql = DB::query()
    ->table('users')
    ->join('contacts', 'users.id', '=', 'contacts.user_id')
    ->join('orders', 'users.id', '=', 'orders.user_id')
    ->select('users.*', 'contacts.phone', 'orders.price')
    ->toSql();
```

如果我们将 SQL 本身作为对象，而查询构造器作为 SQL 的建造者，那么很容易就能看出，Laravel 中对查询构造器的设计，正是符合了构造器模式的设计思想。

通过查询构造器，我们可以把精力聚焦到组装 SQL 的每一个部件中去，而不再需要全局考量 SQL 的每个地方。 就如这里我们看到的，在我们链式调用查询构造器的不同方法时，其实我们就在对不同的 SQL 部件的内容进行定义。 比如我们在调用 table 方法时，我们关注的就是 SQL 的表选择部分。

正是因为 SQL 本身逻辑结构复杂，而查询构造器能够大幅简化我们直接书写 SQL 时繁琐的语法、依赖等处理的时间。 所以在 Laravel 中，查询构造器被大量的使用就不足为奇了。

### 查询构造器和建造者模式

查询构造器是 Laravel 中建造者模式的最佳诠释，不过在我们的分析中，大家会发现，之前我们介绍建造者模式时，讲到了建造者模式中四种关键角色。 而在 Laravel 数据库模块的查询构造器中，只有孤零零的 `\Illuminate\Database\Query\Builder` 这一个类去体现。 这是为什么呢？

对于我们说到的四种角色中的产品 \( Product \) 对象，在查询构造相关流程中的体现，就是最终的 SQL 语句。 虽然在程序里 SQL 语句不是以对象而是以字符串存在，但归结起来说，它具有了完全可以对象化的能力，只是我们没有专门建立 SQL 语句类而已。

而四种角色中的建造者抽象 \( Builder \) ，由于建造者模式的建造者实现，通常情况下都是只适配于一种对象的构建的。 所以对建造者进行建模抽象，在这种场景下其实存在的意义并不是特别大，所以这里直接合并了抽象和实现，减少我们的开发维护成本。

而在构建 SQL 的过程中，我们一般习惯于直接指定 SQL 中各个部件的内容，也就让协调者 \( Director \) 的作用变得非常低。 所以在查询构造器的使用部分，我们就见不到它的身影了。

### Laravel 中构造协调者的体现

虽然在我们使用查询构造器时，没有能够直接出现协调者 \( Director \) 角色的体现，但在其他部分，我们还是能看到它的身影。

比如在我们通过模型操作数据增减时，这个方法就根据我们的传入的列名和增减值等数据，分别通过查询构造器设置了 SQL 的表选择、查询条件、更新内容等组成部件的内容。

```
/**
 * 增减数据值
 */
protected function incrementOrDecrement($column, $amount, $extra, $method)
{
    $query = $this->newQuery();

    if (! $this->exists) {
        return $query->{$method}($column, $amount, $extra);
    }

    $this->incrementOrDecrementAttributeValue($column, $amount, $extra, $method);

    return $query->where(
        $this->getKeyName(), $this->getKey()
    )->{$method}($column, $amount, $extra);
}
```

虽然并不是完全符合协调者角色的特征，但我们任然可以将其看作是协调者的体现。

### 小结

建造者模式的核心思想是将对象的构造代码与表示代码进行除了拆分，通过这种拆分，消除创建与使用对象之间的耦合。 这就可以使得在改变一个对象，特别是复杂对象内部组成的过程中，消除或减少对使用者的影响。 同时，通过对象构造过程的独立，我们能够对所有构造过程进行控制，达到对生成对象更加精细化定义的目的。
    