
# 使用代理快速接入第三方库
---

# 使用代理快速接入第三方库

> 代理模式：
> 
> 为对象提供一层代理来控制对这个对象的访问。

### 代理模式浅析

对象与对象之间进行交互，最常见的方式就是方法调用。 而在有些程序设计的场景中，由于一些限制或是出于优化等方面的考虑，我们并不希望调用者直接引用到被调用者。 在这种时候，我们可以通过增加一个对象，代理调用者和被调用者之间的调用，这就是代理模式。

通过承担代理任务的对象，可以在调用发起对象和目标对象之间，隐藏不希望被调用者看到的内容，也可以添加额外的内容。

代理模式的结构非常简单，也相对来说非常容易理解。

![代理模式 UML 图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/30/160a6da1880881e1~tplv-t2oaga2asx-image.image)

代理模式中通常包含三个角色：

- Subject : 代理方法抽象
- RealSubject : 被调用的实际对象
- Proxy : 调用代理对象

在代理模式中，代理对象往往与被代理对象实现于相同的抽象，这样便于我们针对接口进行编程。 但也并不总是这样，因为在使用代理模式去实现程序逻辑的过程中，是目的是各不相同的。

### 代理模式的常见用途

由于代理模式是一种结构型模式，其并不定义代理具体做些什么，也就是说，代理模式能适应的场景非常丰富。

这里列举几个常见的代理模式的实际使用场景：

- 在跨越系统或者一些物理限制进行调用时，我们可以通过代理对象来隐藏调用的具体实现过程，是程序的适应性更强。 比如在我们常见的远程过程调用 \( RPC \) 实现中，都能看见代理模式的身影。 这种代理模式通常称为远程代理 \( Remote Proxy \) 。
- 某些时候，对象的一些方法我们不希望暴露给外部使用者。 这种情况下，我们可以使用代理模式，只在代理对象上开放我们允许使用的方法，这就达到了对方法访问权限进行控制的作用。 这种代理模式通常称为保护代理 \( Protection Proxy \) 。
- 调用对象的前提是被调用的对象已经创建并存在，但如果需要调用的对象是个非常创建时开销非常大的对象，那就意味着我们为调用准备好对象时，即使对象没有马上被调用，这些系统的开销已经被消耗。 为了比较这种浪费，我们可以通过代理对象来管理目标对象的创建。 只有在真正开始调用时，才去创建这个对象。 这种代理模式通常称为虚代理 \( Virtual Proxy \) 。

这里只举了三种比较常见的代理模式的使用，但事实上，基于代理模式所能设计的实际用途非常的多，篇幅有限，就不逐一列举了。

### 动态代理

除了通过使用场景来区分代理模式之外，我们还能以实现方式来去分代理模式。 动态代理就是一种代理模式的实现形式。

![代理对象关系](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/30/160a6d84a85eb6e4~tplv-t2oaga2asx-image.image)

根据我们之前提到的标准的代理模式角色间的关系进行设计，被代理的对象和代理对象都需要实现调用方法，这种方式虽然规范了调用的关系，但是也存在一定的不灵活性。

例如，在我们需要增加可调用的方法时，不但需要修改被代理对象，也需要修改代理对象，才能让调用结构完整。 特别是在我们需要代理对象在代理前后执行一些操作时，就意味着我们的操作代码需要被重复书写多次。

动态代理可以解决这种问题。

动态代理其实是将调用汇总到一处，在根据相应的处理逻辑，分发到目标对象上。

在 PHP 中，动态代理是非常容易实现的，因为 PHP 本身，就带有可以直接实现动态代理的魔术调用方法：`__call` 。 `__call` 可以直接收集对代理对象的调用，包括调用的方法和参数。 通过在 `__call` 实现代理调用的逻辑，就可以实现动态调用代理了。

例如在 `Illuminate\Database\Query\Builder` 中，通过动态代理，以非常简略的代码就实现了对方法的代理调用：

```
namespace Illuminate\Database\Query;

class Builder
{
    /**
    * 魔术调用方法
    */
    public function __call($method, $parameters)
    {
        if (static::hasMacro($method)) {
            return $this->macroCall($method, $parameters);
        }

        if (Str::startsWith($method, 'where')) {
            return $this->dynamicWhere($method, $parameters);
        }

        $className = static::class;

        throw new BadMethodCallException("Call to undefined method {$className}::{$method}()");
    }
}
```

常规的代理模式中，目标对象必须先存在，这样才能让代理对象了解其的特征属性和被代理的方法。 同时，一个目标对象必须对应一个代理对象的逻辑，会造成系统中对象数量的剧增。 而动态代理，就能很好的解决这些问题。

### 代理 Redis 驱动

在 Laravel 的 Redis 模块中，有着代理模式的典型体现。

我们以 Redis 模块接入并调用 Predis 为例。 Predis 的命令都封装在对 `Predis\Client` 的调用上，使用 Predis 操作 Redis 时，我们可以直接调用 `Predis\Client` 中对应的命令。

为了快速接入 Predis 而又同时让框架与 Predis 减少耦合，避免所 Predis 更新迭代而影响框架本身。 Laravel 在 Redis 的连接对象中，引入了代理模式，并且是动态代理的模式，让操作方法通过代理的形式对接到 Predis 中。

![Redis 驱动 UML 图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/30/160a6da5deaadfca~tplv-t2oaga2asx-image.image)

在使用代理模式处理 Redis 驱动模块接入的过程中，我们还能够通过代理，来丰富被调用对象的功能。

比如在 Redis 模块中，通过调用代理对象的基础类 \( `Illuminate\Redis\Connections\Connection` \) ，为我们调用 Redis 时额外增加功能并发控制和流量控制的功能。

```
namespace Illuminate\Redis\Connections;

abstract class Connection
{
    /**
     * 获得并发控制构造器
     */
    public function funnel($name)
    {
        return new ConcurrencyLimiterBuilder($this, $name);
    }

    /**
     * 获得流量控制构造器
     */
    public function throttle($name)
    {
        return new DurationLimiterBuilder($this, $name);
    }
}
```

### 小结

代理模式是在调用者和被调用者间增加了一层处理，虽然其可能增加系统的额外负担，但通过它，我们能减少在调用者和被调用者间增加逻辑时的耦合。
    