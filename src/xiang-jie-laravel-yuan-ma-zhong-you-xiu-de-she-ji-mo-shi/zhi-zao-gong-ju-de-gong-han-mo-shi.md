
# 制造工具的工厂模式
---

# 制造工具的工厂模式

工厂模式是所有设计模式中最常见，也最容易理解的一种设计模式。 使用最通俗的语言对工厂模式进行诠释就是：将创建对象的交给工厂。

### 工厂模式浅析

在编写面向对象的程序时，新建对象（ new Object ）是非常重要的部分。 那么在需要根据不同的参数、场景去选择新建不同对象的时候，特别是这些类拥有相同的抽象（接口）的时候，工厂模式就能很好的为你提供设计思路了。

细化来说，工厂模式又可以分为：简单工厂、工厂方法、抽象工厂。 它们的关系是由前向后，抽象层次逐渐增加。

如果你对建模理论有所了解，那么抽象建模的层次，与模型的通用性的关系应该非常清楚。 通常来说越抽象的模型，其适用面更加广泛，反之，越具体的模式，其适用面也就非常局限。 对于刚才提到的这三种工厂模式来说，也是一样的道理。

### 三种工厂模式的比较

对于简单工厂来说，它的抽象层次低，工厂类一般也不会包含复杂的对象生成逻辑，只能适用于生成关联归案系比较简单，扩展性要求较低的对象。

![简单工厂](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/14/160553df19fb9b8c~tplv-t2oaga2asx-image.image)

工厂方法相对于简单工厂来说，它的抽象层次就相对提高了。 工厂方法不但要求对工厂所生成的产品类进行抽象，还要求对工厂类进行抽象。

![工厂方法](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/14/160553e83b9c5372~tplv-t2oaga2asx-image.image)

当我们需要进一步进行建模，也就是对工厂生产的产品做分类时，抽象工厂就能派上用场了。 抽象工厂的定义里，增加了对产品类可以实现于不同抽象的定义，适合需要工厂对象具有创建不同品种产品类的场景。

![抽象工厂](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/15/1605891ae3b04b79~tplv-t2oaga2asx-image.image)

虽然我们知道，抽象层次越高，可适用的场景就会越多。 但是，从简单工厂、工厂方法、抽象工厂的对象关系图中，我们也可以看到，抽象层次越高，就意味着对象间的关系就越复杂。

说成白话就是，当我们使用抽象层次更高的用法时，就意味着我们需要实现更多的类和逻辑，才能让深层次的抽象落地。

那么，如果我们的对象逻辑本身很复杂，那么工厂实现在整体代码中的比重非常低。 反之，如果我们的对象逻辑本身很简单，那么工厂实现在整体代码中的比重非常高。 我们在选择使用何种设计模式时

例如，简单工厂的抽象层次低，所以在对其进行扩展（增加对象逻辑关系）时，需要增加或者重复书写的代码里就比较大，这对于经常增加新的对象类型来说会带来不少麻烦。 不过，也正是因为抽象层次低，我们在代码里就不需要实现过多针对抽象的代码，能够减少这部分的代码量和处理逻辑。

所以，具体选择何种哪种工厂去指导我们的设计，需要根据具体的业务场景，权衡去选择。

### Laravel 中对创建 Redis 连接的设计

在 Laravel 中，使用到工厂模式的地方非常多，这也体现了工厂模式的基础性和广泛的适用性 这里，我们选取 Laravel 的 Redis 模块中，对 Redis 连接创建部分的代码作为样例，展示在工厂模式在 Laravel 中的体现。

Laravel 的 Redis 模块中，支持两种 Redis 连接驱动方式：PHP Redis 扩展、Predis 工具包。 为了更能够更方便的管理和使用 Redis 连接驱动和它们对应的连接，Laravel 加入了 RedisManager 对象定义。

RedisManager 对象，既是 Redis 连接的管理者，也是 Redis 连接的创建工厂。

首先，我们来看看 Laravel 中，Reids 连接和其对应工厂的关系。

![工厂模式：Redis Connection](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/20/16071fec4bb86f47~tplv-t2oaga2asx-image.image)

通过之前我们对工厂模式的介绍，可以很容易的认出，这是一个典型的工厂方法结构的程序设计。

### 连接创建的工厂

所有创建连接的创建工厂，都继承于 `\Illuminate\Contracts\Redis\Factory` 这个接口。

```
namespace Illuminate\Contracts\Redis;

interface Factory
{
    /**
     * 获得 Redis 连接
     */
    public function connection($name = null);
}
```

在 Laravel 中，目前只有一个 Redis 连接创建工厂的实现类，也就是 `\Illuminate\Redis\RedisManager` 这个身兼连接管理器和创建工厂的类。

那么在 `RedisManager` 这个实现类中，Laravel 又是通过建立不同的连接器来创建不同的 Redis 连接对象的。

```
namespace Illuminate\Redis;

class RedisManager implements Factory
{
    /**
     * 获得 Redis 连接
     */
    public function connection($name = null)
    {
        $name = $name ?: 'default';

        // 如果连接存在，则取出连接（这是作为连接管理器的功能）
        if (isset($this->connections[$name])) {
            return $this->connections[$name];
        }

        // 如果连接不存在，就创建连接实例
        return $this->connections[$name] = $this->resolve($name);
    }

    /**
     * 创建 Redis 连接
     */
    public function resolve($name = null)
    {
        $name = $name ?: 'default';

        $options = $this->config['options'] ?? [];

        if (isset($this->config[$name])) {
            // 先取得连接器，再通过连接器创建连接
            return $this->connector()->connect($this->config[$name], $options);
        }

        if (isset($this->config['clusters'][$name])) {
            // 这是集群连接对象创建
            return $this->resolveCluster($name);
        }

        throw new InvalidArgumentException(
            "Redis connection [{$name}] not configured."
        );
    }

    /**
     * 获得 Redis 连接器
     */
    protected function connector()
    {
        // 这里是工厂的关键，不同的连接，通过不同的连接器创建，所以有了一个工厂抉择的过程
        switch ($this->driver) {
            case 'predis':
                return new Connectors\PredisConnector;
            case 'phpredis':
                return new Connectors\PhpRedisConnector;
        }
    }
}
```

### 小结

通过 Laravel 中 Redis 模块里对 Redis 连接和其创建工厂对象的展示，大家应该更容易理解工厂模式在实际设计中的逻辑。

由于篇幅有限，这里没有对 Redis 模块中与连接有关的代码做一个完整的呈现。 不过相信通过工厂模式的解读以及在 Redis 模块中主体实现的梳理，大家都可以通过 Laravel 源码完整的阅读 Laravel 设计的 Redis 连接创建工厂。

另外，在 Laravel 中还有很多工厂方法的体现，比如数据库中数据库连接的创建工厂，视图引擎中视图的创建工厂等等。 这些都是不错的工厂模式设计的典范，也能帮助大家很好的理解工厂模式的思想。
    