
# 通过策略选择驱动
---

# 通过策略选择驱动

> 策略模式：
> 
> 将一系列程序处理过程逐一独立封装起来，使它们之间可以独立于使用者而相互替换。

### 策略与抉择

对于一些程序处理的过程，我们往往能够提供多套解决方案，对于每一种方案，我们都可以称之为一个策略。

在程序设计中，会经常出现需要我们根据实际的运行环境、业务类型、参数条件去选择不同处理过程、程序算法的场景。 换句话说，这就是我们选择策略的过程。

举一个现实的场景，对数据进行排序有多种算法，它们各有优劣，在不同的场景下成绩各不相同。

![排序算法](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/21/1607928130664dca~tplv-t2oaga2asx-image.image)

我们需要实现一个功能，就是根据需要排序的数据，选择合适的排序算法。 这就是一个非常典型的根据不同参数条件选择不同处理过程的场景。

如果我们用面向过程的思想去实现这种代码，其写法通常是这样的：

```
if (count($array) > 10000) {
    // 算法一
    // ...
} elseif (max($array) < 100) {
    // 算法二
    // ...
} elseif (end($array) > 500) {
    // 算法三
    // ...
} else {
    // ...
}
```

这种书写代码的方式，我们通常称为硬编码 \( Hard Coding \) 。

无需赘言，大家都知道这是一个反面的例子，它具有很明显的弊端：

- 如果把算法的内容增加上，这段程序将冗长而复杂，不利于实现和维护。
- 算法的实现与程序调用连成一体，在需要新增算法或改变现有算法时，将无比艰巨和困难。

这种面向过程的粗陋写法，在我们面向对象的程序设计中，当然是需要摒弃的。

### 策略模式浅析

为了解决需要根据不同的场景、条件选择和使用不同处理过程的问题，我们就需要引入策略模式这种设计思想了。

策略模式其实并不难理解，就是将不同的处理过程进行独立的封装，通过接口暴露它们的功能。 而这些过程的使用者，只需要根据暴露的接口进行编程，不再需要考虑策略的选择。

首先我们来认识一下策略模式中，必要主要的三种角色：

- `Context` : 环境类，负责根据不同的环境信息，选择不同的策略实现。
- `Strategy` : 策略抽象类，对不同策略处理过程中，关键调用的抽象。
- `ConcreteStrategy` : 策略实现类，策略处理过程的具体实现。

### Laravel 中的驱动

熟悉 Laravel 的朋友们都知道，Laravel 中许多的模块都包含驱动 \( Driver \) 这个概念。 通过驱动，让我们在使用 Laravel 的这些模块时，能够很快的切换模块的具体实现方式。

其实这种驱动选择的实现，就是策略模式的体现。

这里我们以 Laravel 的队列模块 \( Queue \) 为例。 在 Laravel 的队列模块中，目前支持了六种不同的驱动去处理队列任务：

- `SyncQueue` : 同步队列。
- `DatabaseQueue` : 数据库队列。
- `BeanstalkdQueue` : Beanstalk 队列。
- `SqsQueue` : Amazon SQS 队列。
- `RedisQueue` : Redis 队列。
- `NullQueue` : 空队列。

通过在队列模块中融入策略模式，我们就实现了使用队列和队列实现的解耦。 在我们向队列中推送任务时，不需要考虑队列具体使用了哪种处理逻辑和实现方式，只需要简单的调用推送方法即可。

而当我们需要选择驱动时，是需要通过修改 `./config/queue.php` 配置文件中相关的队列连接，就能实现队列实现的切换。

具体的配置方法这里我们就不展开了，大家可以参考 Laravel 中的配置示例： [./config/queue.php](https://github.com/laravel/laravel/blob/master/config/queue.php)

### 队列模块中的策略模式

如果我们将队列模式中的策略模式提取出来，可以根据其中的对象关系，得到一张体现策略模式的 UML 图：

![策略模式 UML 图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/21/1607927eba9073b6~tplv-t2oaga2asx-image.image)

在图中，`Illuminate\Queue\QueueManager` 其实就是策略模式中的环境类 \( Context \) ，它负责根据我们的配置，实例化不同的队列驱动并进行策略操作。 而 `Illuminate\Contracts\Queue\Queue` 则是策略抽象 \( Strategy \) ，在它其中包含了队列操作的定义，我们操作队列代码的编写，其实就是面向它的抽象定义进行的。 在 `Illuminate\Queue\RedisQueue` 等类中，就是策略的具体实现 \( ConcreteStrategy \) ，它们各自根据自己所要对接的队列实现方式 \( Redis, SQS, Database, etc. \) ，实现了队列操作的抽象定义。

当我们通过队列外观 \( `Illuminate\Support\Facades\Queue` \) 等方式调用到 `QueueManager` 时，它就会根据配置和其中绑定关系，创建队列驱动的实现类。 之后，它会将我们的调用，传递到队列驱动的实现类中，通过具体的实现来完成我们的操作。

通过利用 `__call` 这个魔术方法，`QueueManager` 可以非常容易的将调用传递到队列的实现对象中：

```
namespace Illuminate\Queue;

class QueueManager
{
    /**
     * 将队列的方法调用传递到默认的队列实现中
     */
    public function __call($method, $parameters)
    {
        return $this->connection()->$method(...$parameters);
    }
}
```

### 策略模式的使用场景

如果我们所要设计的系统中，存在所许多算法或行为不同，但又可以互相替换的处理过程，我们就可以使用策略模式来指导我们的程序设计。

特别是这些处理过程特别复杂时，策略模式能够很好的隔离使用者和处理过程本身。

需要注意，我们使用策略模式时，并不受限于所有策略的处理结果是一致还是不一致。 例如，通过不同的排序算法进行排序，其排序的结果是一致的，切换不同的排序算法我们可以使用策略模式。 而购物中的优惠计算，不同的优惠计算的结果也不一样，但我们依然可以使用策略模式来封装不同的优惠计算。

![不同结果的处理过程](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/21/160792b43215c6ab~tplv-t2oaga2asx-image.image)

当然，策略模式也有一定的缺陷。 如策略较多时，相关的策略类也会很多。 同时，使用者也必须知道策略的所有实现，这样才能对策略进行选择。

### 小结

策略模式通过对相互平行的多个处理过程的封装，实现了调用和实现的解耦，提供了面向接口编程的环境。 虽然整体思想并不复杂，但策略模式却完美的诠释了开闭原则、里氏替换原则等设计原则。
    