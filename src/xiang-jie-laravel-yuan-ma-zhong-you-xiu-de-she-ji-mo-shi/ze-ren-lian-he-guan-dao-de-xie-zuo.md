
# 责任链和管道的协作
---

# 责任链和管道的协作

> 责任链模式：
> 
> 让多个对象都有就会处理请求，并且避免请求发送者和处理者之间的耦合。

### 责任与责任链

到政府部门办事，相信大家都有经历过。 就拿办理户口迁移为例，在户口迁移中，根据办理者的身份不同，能够审批的公安局级别也有所区别。

于是就会经常出现，办理前首先要到公安局里进行询问，再准备资料，之后再去拥有相应职权的分局或派出所办理。 有时候还会因为对政策、规定理解不到位，要来回多跑几次腿。

![政府责任链](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/1/160b261a3fef0650~tplv-t2oaga2asx-image.image)

当然，国家强调减少人民群众的负担，所以自然要改变这种境况。

要解决这种问题，首先就是要分析这种问题产生的原因。 简单来说，出现这种情况主要是由于普通群众对政府部门的规定不够了解，导致很多时候找错了部门，耽误了功夫。

既然找到了问题原因，我们就来想解决问题的办法。 办法其实也非常的简单，我们可以将整个政府串成一条流水线，再部署上传送带，将群众的诉求和材料递交到传送带上。 接着，诉求和材料逐一通过政府部门，每路过一个部门，部门就检查自己是否能够处理群众的关切。 如果可以，就拦截并处理掉。 如果不行，就继续让材料沿着流水线传递。

这个管理责任关系的流水线，我们就可以成为责任链。

我们很高兴的看到，目前已经有很多的省份、城市，开始推行这种做法了。

### 责任链模式浅析

在程序设计上，我们也能遇到不少这样的场景： 一个请求存在多个可以处理它的对象，我们又希望隐藏实际的处理者，避免请求与处理者之间的耦合。

![请求和处理器](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/1/160b262288ebd031~tplv-t2oaga2asx-image.image)

这种时候，责任链模式就能派上用场了。

责任链模式的核心思想，是不再统一的分析“由谁来处理请求”这个问题，而是将对象的处理者串成链，由它们自己去分析是否可以处理请求。

通过这样的设计，我们避免了请求需要了解所有处理者，以便选择处理者这样的大耦合场景。 同时，非集中式的结构，也能让处理器更容易扩展。 因为增加一个处理器，只需要将他放上责任链即可，不会影响请求对象和其他处理器对象。

![责任链模式 UML 图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/1/160b2625790c44d5~tplv-t2oaga2asx-image.image)

责任链模式的处理逻辑非常简单： 从第一个处理对象开始，责任链中的每个处理对象，要么亲自处理请求，要么就将其传递到下一个处理对象中。

每个责任链上的处理器，还需要拥有一致的处理请求和访问后一个处理器的方法。 统一的接口结构，使得责任链上的处理器之间相互独立，并且非常容易进行扩充。

由于除了实际处理对象之外的其他处理对象，包括请求对象本身，都不知道哪一个处理器会实际处理请求。 所以对于这种不明确性，我们也通常称对象有个隐式的处理器。

### 请求处理中间件

中间件 \( Middleware \) 是 Laravel 处理 Http 请求的核心模块之一。 通过中间件处理请求，其实就是典型的责任链处理过程。

Laravel 在收到请求时，会先将请求发送到已经定义的第一个中间件中，再由中间件逐一处理和传递，最后传递到控制器上。

![中间件处理流程图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/1/160b2629eb8c92c5~tplv-t2oaga2asx-image.image)

熟悉 Laravel 的朋友都知道，在 Laravel 中使用中间件非常的方便。 首先，我们只需要新建一个中间件类，并增加一个处理请求的方法：

```
/**
 * 处理请求
 */
public function handle($request, Closure $next)
{
    // 判断逻辑

    return $next($request);
}
```

从这个方法的定义上，我们就不难看出之前提到的责任链处理器需要包含的两个特性。 其一，就是处理请求的方法，也就是这个方法本身。 其二，就是访问下一个处理器的方法，这里不需要我们实现，而是直接通过 `$next` 传入了。

之后，我们只要把这个中间件类，通过配置等方式进行定义。 那么在收到请求时，Laravel 就会按照我们定义的中间件顺序，建立中间件链，并让请求通过中间件链，再到达控制器。

当然，中间件机制和其过滤请求的方式，与标准的责任链模式还是存在一定的区别。 例如，在中间件机制中，我们允许并经常在中间件的逻辑里对请求对象进行修改。 这种方式会让产生中间件执行前后顺序改变而结果不一致的问题。 也就是说，中间件之间产生了依赖和联系，这就增加了中间件之间的耦合。

不过，在实际的业务场景中，这种形式更符合我们常见的需求，所以我们并没有感觉到不适。 这也印证了，设计模式只是一种程序设计的指导思想，而非确定的结构，最佳的实践还是要根据真实的场景来设计。

### Laravel 的管道机制

在 Laravel 中，通过管道类 `Illuminate\Pipeline\Pipeline` 来辅助实现责任链模式。

请大家不要误解管道的作用，管道对象并不是用来管理请求如何通过中间件或者其他类似的责任链的， 管道对象只是帮助我们去制造一个责任链，最终，我们不过是把对象传递到管道所制造的责任链中而已。

```
namespace Illuminate\Pipeline;

class Pipeline implements PipelineContract
{
    /**
     * 生成责任链并调用
     */
    public function then(Closure $destination)
    {
        $pipeline = array_reduce(
            array_reverse($this->pipes), $this->carry(), $this->prepareDestination($destination)
        );

        return $pipeline($this->passable);
    }

    /**
     * 获得一个能够包裹责任链中每个处理器的闭包，以便责任链中对象的传递
     */
    protected function carry()
    {
        return function ($stack, $pipe) {
            return function ($passable) use ($stack, $pipe) {
                // 传入请求对象 $passable ，调用处理器
            };
        };
    }
}
```

### 小结

通过将对象沿责任链传递，并寻找其处理对象的方式，可以很轻松的解除请求和处理者的耦合。 这在一个请求有多个处理者，而我们需要根据条件选择不同处理者的时候特别见效。 由于对象并不知道自身实际的处理者，这就说明责任链模式能够很好的隐藏实际处理者。
    