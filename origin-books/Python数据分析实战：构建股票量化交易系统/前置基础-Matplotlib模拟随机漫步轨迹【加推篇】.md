
# 前置基础-Matplotlib模拟随机漫步轨迹【加推篇】
---

# 前置基础：Matplotlib模拟随机漫步轨迹

## 前言

在《前置基础：NumPy模拟随机漫步理论》小节我们用到了以下这副插图：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/5/16b26ca0c891f0e8~tplv-t2oaga2asx-image.image)

早在1900年，巴黎一位博士生路易斯·巴舍利耶（1887—1946）跟踪当时巴黎股市起伏，期望用数学工具来描述股价变动过程。在他的论文《投机理论》中指出，股票价格的日常变动从根本上说是不可预知的，类似于”布朗运动”那样属于随机游走，没有任何规律可循。就好比一个人购买一只股票后立即将其卖掉，那么他输赢的概率是相等的。

数学的奇妙之处就在于，我们可以把股票的不可预知性变为可预知。最经典的例子即是模拟醉汉的随机漫步：假设一名醉汉喝醉了酒，从一个路灯下开始漫无目的地行走。每一步即可能前进也可能后退也可能拐弯。那么经过一定时间之后，这名醉汉的位置在哪里呢？

这里我们结合小册中Numpy、Matplotlib库的使用，用Python的方式来介绍下如何绘制随机漫步轨迹，以及如何从统计学的角度去预测随机漫步的股价。

## 生成随机漫步数组

我们使用`numpy.random.randint(low, high=None, size=None, dtype=’l’)`函数产生随机数。

 -    返回随机整数，范围区间为\[low,high），包含low，不包含high
 -    参数：low为最小值，high为最大值，size为数组维度大小，dtype为数据类型，默认的数据类型是np.int
 -    high没有填写时，默认生成随机数的范围是\[0，low\]

```py
print("np.random.randint：\n {}".format(np.random.randint(1,size=5)))# 返回[0,1)之间的整数，所以只有0
"""
np.random.randint：
 [0 0 0 0 0]
"""
print("np.random.randint：\n {}".format(np.random.randint(1,5)))# 返回1个[1,5)时间的随机整数
"""
np.random.randint：
 2
"""
print("np.random.randint：\n {}".format(np.random.randint(-5,5,size=(2,2))))
"""
np.random.randint：
 [[-5 -3]
 [ 2 -3]]
"""
```

## 可视化随机漫步轨迹

为了便于理解，我们将醉汉的移动简化为一维的移动，规定他只能在一条直线上随机前进或者后退。计算得到醉汉随机游走轨迹的代码如下所示：

```py
draws = np.random.randint(0, 2, size=nsteps)
steps = np.where(draws > 0, 1, -1)
walk = steps.cumsum()
```

我们用matplotlib.pyplot.plot\(\)函数绘制出醉汉从0轴开始随机游走2000步的模拟轨迹图形，如下所示：

![图片描述](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/5/16b26cb1613ed36b~tplv-t2oaga2asx-image.image)

由于醉汉的每一步都是完全随机的，因此他最终准确位置是不可能被算出来的，就像每天的股票价格变动一样是不可预知的。但是，从统计学的角度来看，这名醉汉最终的位置的概率分布却是可以计算出来的。接下来，我们用1000次随机漫步来看下结果，我们把随机漫步轨迹的计算封装为函数random\_walk\(\)，如下所示：

```py
_ = [plt.plot(np.arange(2000), random_walk(nsteps=2000), c='b', alpha=0.05) for _ in np.arange(0,1000)]
```

模拟醉汉从0轴开始1000次随机游走2000步的模拟轨迹图形，如下所示： ![图片描述](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/5/16b26cb1612d8149~tplv-t2oaga2asx-image.image)

完整代码如下所示：

```py
def random_walk(nsteps = 1000):

    draws = np.random.randint(0, 2, size=nsteps)
    print(f'random walk direction is {draws}') # random walk direction is [1 0 1 ... 0 1 0]
    steps = np.where(draws > 0, 1, -1) #将0转换为-1
    walk = steps.cumsum() #累加方式记录轨迹
    return walk

#多样本随机漫步轨迹-plot
def simplot_random_walk():
    _ = [plt.plot(np.arange(2000), random_walk(nsteps=2000), c='b', alpha=0.05) for _ in np.arange(0,1000)]
    plt.xlabel('游走步数')
    plt.ylabel('分布轨迹')
    plt.title(u"模拟随机漫步")
    plt.show()
```

图中我们直观地观察出随机游走的发展情况，每一条淡淡的蓝线就是一次模拟，横轴为行走的步数，纵轴表示离开起始点的位置。蓝色越深，就表示醉汉在对应行走了对应的步数之后，出现在此位置的概率越大，可见随着醉汉可能出现的位置的范围不断变大，但是距离起始点越远的位置概率越小。

## 总结

真实的概率分布用数学公式来精确计算，这就是量化交易的精髓所在。量化交易的鼻祖级大神爱德华·索普就是利用这种随机游走模型的思想，推算出认股权证在合约兑现的那一天相对应的股票的价格的概率分布，从而计算出当前认股权证的价格是过高还是过低，然后再利用凯利公式，进行买卖。
    