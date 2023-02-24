
# 让观察者监听事件
---

# 让观察者监听事件

> 观察者模式：
> 
> 定义对象间的的一对多的依赖关系，当一个对象状态发生改变时，通知依赖于它的对象，并使这些对象的状态得到更新。

### 状态观察者

在我们以面向对象的思想，对系统进行设计时，会根据其内部不同的结构、功能等，将其拆解到不同的对象中。 用对象封装不同的功能，能够让程序更容易断开不同功能模块间的耦合，使我们更轻松的开发出结构清晰、逻辑清楚的程序。 不过，这种结构也带来了一定的负面影响。

我们知道，一些对象虽然职责和功能不同，但却需要保持一定的联系。 这就好像是汽车的方向盘和车轮的关系。 当我们转动方向盘时，车轮应该根据方向盘的状态进行改变。

![方向盘和车轮](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/28/16098d4b0e3edf6e~tplv-t2oaga2asx-image.image)

如果把这个场景转换到面向对象的编程中来，就是一个对象需要根据另外一个对象状态的改变，对自身进行更新。 说得在明确一些，就是让对象监控另外一个对象，一旦被监控对象的状态发生改变，就触发自身进行一些逻辑处理。 也许监控这个词略带贬义，用观察显得更为恰当，所以这种行为场景的设计，就可以称为观察者模式。

### 观察者的实现

虽然从名字上来理解，观察者模式就是让对象去观察另外一个对象的改变，但实际上，这种持续观察另外一个对象状态的设计，不但实时性较差，而且会枉费很多的资源。 所以通常来说，在实现观察者模式的过程中，我们会选择采用相反的信号传递逻辑。 即让对象主动将自己状态的更新通知到观察者，而不是让观察者进行持续的监听。

以刚才我们举的方向盘与轮子的例子，可以这样设计我们的代码：

```
class SteeringWheel
{
    /**
     * 方向盘旋转角度
     */
    protected $degree;

    /**
     * 轮子
     */
    protected $wheel;

    /**
     * 设置方向盘旋转角度
     */
    public function setDegree($degree)
    {
        $this->degree = $degree;

        // 通知轮子进行旋转
        $this->wheel->update();
    }
}
```

这也就是方向盘发生转动时，通知轮子自己的状态，并使轮子做相应的变动。

不过，这种实现存在一种弊端，就是可扩展性差。 举个例子来说，在方向盘回正时，转向灯能够自动关闭。 要实现这个功能，我们就需要增加转向灯对方向盘的监听。

为了改进这种现象，我们需要对观察者进行接口定义，并让被观察的对象面向接口进行通知。 这样的话，我们只需要维护一个观察者数组，就能随意增减观察者。 而由于进行了面向接口的编程，我们在新增或更新观察者时，不需要改动主体对象的任何代码。 这种设计形式，就使得在进行状态关联的过程中，任然保证了主体对象与观察者对象的耦合保持非常低的状态。

观察者模式的这种结构，体现到建模语言上就是：

![观察者模式 UML 图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/28/16098d4ef74f953f~tplv-t2oaga2asx-image.image)

在观察者模式中，主要包含四种角色：

- Subject : 主体对象抽象
- ConcreteSubject : 主体对象实体，即被观察的对象
- Observer : 观察者对象抽象
- ConcreteObserver : 具体观察者

### 无处不在的观察者

与迭代器模式一样，观察者模式也是我们能在程序设计中常用到的行为型设计模式之一。 其实在很多的场景，观察者模式都有着不同的体现。

我们常见的几种设计结构，都包含着观察者行为的体现：

- 发布 - 订阅 \( Publisher - Subscriber \)
- 模型 - 视图 \( Model - View \)
- 事件 - 监听 \( Event - Listener \)
- ...

下面我们主要以事件监听模型为例。

事件监听模型的核心，是事件总线 \( Event Bus \) 。 事件总线的工作，就是收集系统各处发生的事件，再将其推送到监听这些事件的事件观察者。由于担任着事件分发的工作，所以事件总线也被称为事件分发器 \( Event Dispatcher \) 。

通过在系统中融入这样的结构，可以从整体上消除事件所发生模块与事件处理模块的关联。

![消息总线](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/28/16098d5247a33533~tplv-t2oaga2asx-image.image)

在事件监听模型中，被观察的主体对象是事件分发器 \( Event Dispatcher \) ，而观察者对象就是事件的监听器 \( Event Listener \) 。

在事件分发器中，存放着事件的集合，这个集合的内容事件监听器所观察的对象状态。 当新的事件被推入到事件分发器中时，分发器中的事件集合就发生了改变，而同时，事件分发器也会把事件通知给所有关联到分发器的事件监听器上。

### Laravel 的事件模块

事件模块是 Laravel 中非常重要的模块之一，从它被列入 Laravel 应用的基础服务就能看出其地位。

```
namespace Illuminate\Foundation;

class Application extends Container
{
    /**
     * 注册基础服务
     */
    protected function registerBaseServiceProviders()
    {
        // 三大基础服务之一：事件服务
        $this->register(new EventServiceProvider($this));

        // 三大基础服务之一：日志服务
        $this->register(new LogServiceProvider($this));

        // 三大基础服务之一：路由服务
        $this->register(new RoutingServiceProvider($this));
    }
}
```

事件机制可以很好的帮助我们在 PHP 中完成面向切面的编程，这对于控制反转后我们能够非常方便的切入到框架所控制的处理流程中，在一些关键性位置增加我们的处理代码。

![事件监听流程 UML 图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/12/28/16098d560ab5db31~tplv-t2oaga2asx-image.image)

在事件模块中，`Illuminate\Events\Dispatcher` 是 `Illuminate\Contracts\Events\Dispatcher` 的实现，其担任的就是事件的调度和分发作用。

事件模块帮助 Laravel 在框架的处理流程中，实现状态改变通知与观察者对象的解耦与分离。

在提供事件处理的同时，也就意味着我们能在事件发生的过程中，得到运行我们指定程序的能力。 这样设计让框架提供了更多的可扩展性，也让我们能够更方便的对框架执行过程进行跟踪。

### 事件分发

在 Laravel 中，事件分发过程的核心代码如下：

```
namespace Illuminate\Events;

class Dispatcher implements DispatcherContract
{
    /**
     * 事件监听器集合
     */
    protected $listeners = [];

    /**
     * 注册事件监听
     */
    public function listen($events, $listener)
    {
        foreach ((array) $events as $event) {
            if (Str::contains($event, '*')) {
                $this->setupWildcardListen($event, $listener);
            } else {
                $this->listeners[$event][] = $this->makeListener($listener);
            }
        }
    }

    /**
     * 分发事件
     */
    public function dispatch($event, $payload = [], $halt = false)
    {
        // 解析事件信息
        list($event, $payload) = $this->parseEventAndPayload(
            $event, $payload
        );

        if ($this->shouldBroadcast($payload)) {
            $this->broadcastEvent($payload[0]);
        }

        $responses = [];

        // 逐一通知监听器
        foreach ($this->getListeners($event) as $listener) {
            $response = $listener($event, $payload);

            // 如果中断参数为真，则监听器存在返回结果时，就直接返回结果
            if ($halt && ! is_null($response)) {
                return $response;
            }

            if ($response === false) {
                break;
            }

            // 收集每个监听器的结果
            $responses[] = $response;
        }

        return $halt ? null : $responses;
    }
}
```

### 小结

在对象间需要进行状态关联时，引入观察者能够很好地降低关联对象之间的耦合。 同时，观察者模式让对象状态的关联关系倾向于观察者，其实也就是状态的依赖者。 这完全符合依赖倒置原则，能够给下层开发提供更稳定的基础结构。
    