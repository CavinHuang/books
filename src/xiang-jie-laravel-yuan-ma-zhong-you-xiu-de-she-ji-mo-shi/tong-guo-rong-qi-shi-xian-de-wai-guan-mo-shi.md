
# 通过容器实现的外观模式
---

# 通过容器实现的外观模式

> 外观模式：
> 
> 为子系统提供统一的接口，使得对子系统的访问和使用变得更加轻松。

### 子系统与外观

程序设计的过程，离不开对系统拆解的。 将系统分解成子模块或子系统，有利于分清不同模块的职责和任务，划清模块与模块之间的界限。 通过对系统的拆解和规划，有利于降低系统整体的复杂程度。

![组件化](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/4/160c10bd2e921ad4~tplv-t2oaga2asx-image.image)

在这些的实现过程中，整个系统的运行，其实是基于子模块或子系统的协作。

在子系统的协作中，就会遇到这样的问题： 子系统仍然是相对复杂的，外部对子系统的调用，也会千丝万缕，产生非常大的耦合。

![混乱的子系统访问](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/4/160c10c10d10b251~tplv-t2oaga2asx-image.image)

这样的耦合显然就违背了我们拆解系统的初衷，也让系统拆分失去了意义。

事实上，子系统虽然复杂，我们所需要与其进行的交互其实是有限的。 若把子系统比作一个函数，即使其中的算法多么复杂，我们不过是传入参数和得到结果而已。

由于我们使用子系统的方法其实是有限且较少的，我们完全可以将子系统包裹起来，让它只暴露几个关键的接口，以供使用。 这就好像是空调的遥控器，虽然我们只是按下了温度调整的按钮，但实际上空调内部，产生了非常多的调整和改变。

子系统中的运转流程外界并不需要知道，我们只需要通过包含指定接口的对象来访问子系统即可。

![改善子系统访问](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/4/160c10c429e97bc8~tplv-t2oaga2asx-image.image)

这就是我们说的外观模式，而装载子系统接口的对象，我们通常就成为外观对象。

### Laravel 的外观对象

模块化是 Laravel 整体结构的特点之一，这也是使得 Laravel 非常容易扩展的原因。 在 Laravel 中，就已经内置了缓存、数据库、文件系统、队列等等的模块。

由于每个模块的功能各异，其内部的组成和复杂程度也各不相同。 所以，为了提供每个模块最便捷的使用方法，Laravel 就引入了外观模式的实现。

在 Laravel 中，所有的外观对象都继承于 `Illuminate\Support\Facades\Facade` 这个抽象类。 这里我们拿缓存模块 \( Cache \) 与其外观对象为例：

![Laravel 中的外观对象](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/4/160c10c8d08b8d78~tplv-t2oaga2asx-image.image)

在 Laravel 对几个主要模块的外观实现中，有两个显著的特点：

- 外观对象中都包含了依赖注入容器，通过容器获取模块。
- 模块都存在一个管理器对象，外观对象使用此对象与系统进行交互。

### 容器与外观对象

在 Laravel 对外观对象的实现中，最关键的部分就是外观对象中的容器了。

在外观对象的基类中，我们可以找到为外观绑定容器的方法。

```
namespace Illuminate\Support\Facades;

abstract class Facade
{
    /**
     * 已绑定的容器
     */
    protected static $app;

    /**
     * 绑定容器实例
     */
    public static function setFacadeApplication($app)
    {
        static::$app = $app;
    }
}
```

我们知道，模块或者子系统相对来说都是比较复杂的，这种复杂主要就体现在模块中不同对象的关系上。 而对象的关系很大程度上，就体现在了对象的依赖上。

Laravel 本身就以依赖注入容器为核心，所以只需要引入依赖注入容器，便可以很好的解决对象依赖的问题。 所以在处理外观调用模块的问题上，就采用。

通过将容器引入外观对象中，可以让本身在外观对象中实现的子系统关系梳理转移到容器依赖解析上。 这就使得 Laravel 中的外观对象实现变得非常的简洁。

就以缓存外观为例，其中的代码只有简单的十几行：

```
namespace Illuminate\Support\Facades;

class Cache extends Facade
{
    /**
     * 获得模块在容器中的名称
     */
    protected static function getFacadeAccessor()
    {
        return 'cache';
    }
}
```

### 小结

外观对象是为子系统提供一个集中和简单的与外界沟通的渠道。 通过外观对象，可以用更清晰、简洁的方式访问子系统。 当然，需要注意的是，我们不应该通过实现或者继承一个外观类，为子系统添加新的功能。 这是典型错误的做法，其违背了外观模式的初衷。
    