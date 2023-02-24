
# 前置基础-NumPy模拟随机漫步理论
---

# 前置基础：NumPy模拟随机漫步理论

## 前言

在量化交易系统中数据分析是必不可少的步骤之一，提起Python环境下与数据分析相关的最重要的库一定非`NumPy`和`Pandas`莫属。

`NumPy`（Numerical Python）是Python数值计算最重要的基础库，大多数提供科学计算的库都是用NumPy数组作为构建基础，比如Pandas就是基于Numpy数组构建的含有更高级数据结构和工具的数据分析库。

可见NumPy是Pandas的基础，在学习Pandas工具之前，理解NumPy的核心ndarray数组对象以及面向数组的矢量计算将有助于我们更加高效地使用Pandas的工具。

本小节设计一个能够涵盖`NumPy`关键知识点的例程，即以随机漫步方式生成股票数据为主线，带领同学们快速入门常用数据分析工具。

## 随机漫步的股价

关于股市波动的规律一直是一个极具挑战性的世界级难题。迄今为止已经出现过多个具有代表性的理论，比如有效市场假说\(EMH\)、随机漫步理论\(Random Walk Theory\)等等，这些理论至今仍然在经受着时间的检验。随机漫步理论认为股票价格的日常变动从根本上说是不可预知的，类似于”布朗运动”那样属于随机游走，没有任何规律可循。

不过爱德华·索普从统计学的角度研究发现，可以把股票的不可预知性变为可预知。就像一名喝醉了酒的醉汉，从一个路灯下开始漫无目的地行走，每一步即可能前进也可能后退也可能拐弯。由于醉汉的每一步都是完全随机的，因此他最终准确的位置无法被预测出，不过从统计学的角度来看，这名醉汉最终的位置的概率分布呈现正态分布，即随着出现的位置的范围不断变大，距离起始点越远的位置概率越小。如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/6/3/16b1dc2ecb09d4c5~tplv-t2oaga2asx-image.image)

同样，虽然无法预测股票价格会如何变化，但是可以从呈现的正态分布中据悉股票价格变化的概率分布，因此股价的波动性是可以量化的。正态随机漫步理论也为之后量化金融的发展奠定了基础。

**为同学们科普下正态分布的基础知识：**

正态分布\(Normal distribution\)是连续随机变量概率分布的一种，也称“常态分布”， 高斯分布\(Gaussian distribution\)。最早的正态分布概念其实是由德国的数学家和天文学家阿伯拉罕·德莫弗尔\(Abraham de Moivre\)于1733年首次提出的，但由于德国数学家Gauss率先将其应用于天文学家研究，故正态分布又叫高斯分布。

正态分布描述的是某件事出现不同结果的概率分布情况，它的概率密度曲线\(即正态曲线\)的形状是两头低，中间高，左右对称呈钟型，因此人们又经常称之为钟形曲线，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b555bafb09fd~tplv-t2oaga2asx-image.image) 该曲线和横轴之间的面积为1，表示概率总和为1，期望值`μ`决定了分布的位置，标准差`σ`决定了分布的幅度，当`μ=0，σ=1`时的正态分布是标准正态分布。

可以说正态分布在概率论、统计学的理论研究和实际应用中占有重要地位和影响力，在自然界、人类社会、心理学等领域的大量现象中都服从或者近似服从正态分布，比如人们能力的高低，身高、体重等身体的状态，学生成绩的好坏，人们的社会态度、行为表现等等。

此处我们选取正态随机漫步理论来生成股价以支撑我们的例程开展。Python内置的`random`模块和第三方库NumPy的`random`模块都提供了生成随机漫步序列的方法，接下来我们分别介绍下这两种方法的使用。

首先介绍Python内置`random`模块，使用时需要导入`random`模块，如下所示：

```
import random
```

`random`模块的`normalvariate(mu,sigma)`方法可以生成符合正态分布的随机数， 其中`mu`, `sigma`分别对应公式中的期望值`μ`, 标准差`σ`，当`mu=0`, `sigma=1`为标准正态分布，如下所示：

```
print("normalvariate: ",random.normalvariate(0,1))
#normalvariate:  2.1798947785444143
```

由于`random.normalvariate()`方法每次只能生成一个随机数，接下来使用循环的方式产生一组随机序列，如下所示：

```
walk = []
for _ in range(1000):
    walk.append(random.normalvariate(0,1))
```

然后使用`matplotlib.pyplot.hist()`方法将随机序列绘制成直方图，如下所示：

```
import matplotlib.pyplot as plt#导入模块
plt.hist(walk, bins=30)#bins直方图的柱数 
plt.show()    
```

从图中可知，直方图呈现两头低，中间高，左右对称的钟形，符合正态分布的标准，图片显示效果如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b57f8676c77b~tplv-t2oaga2asx-image.image)

Numpy中的`random`模块也提供了产生正态分布随机数的方法`numpy.random.normal()`，使用时同样需要导入`Numpy`模块，如下所示：

```
import numpy as np
```

`numpy.random.normal(loc=0.0, scale=1.0, size=None)`的参数中，`loc`、`scale`分别对应公式中的期望值`μ`，标准差`σ`，默认呈标准正态分布`(μ=0,σ=1)`，`size`指输出的值的数量，默认为`None`时只输出一个值。`numpy.random.normal()`可以直接返回以正态分布提取的随机数组，因此无需采用循环遍历，如下所示：

```
import matplotlib.pyplot as plt#导入模块
plt.hist(np.random.normal(loc=0.0, scale=1.0, size=1000), bins=30)#bins直方图的柱数
plt.show()
```

同样，直方图呈现钟形，符合正态分布的标准，图片显示效果如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b58d84ddbdc4~tplv-t2oaga2asx-image.image)

NumPy中主要以N维数组对象`ndarray`存储数据的，因此`np.random.normal()`返回值的类型为`'numpy.ndarray'`，如下所示：

```
print(type(np.random.normal(loc=0.0, scale=1.0, size=1000)))
#<class 'numpy.ndarray'>
```

`ndarray`作为NumPy的核心，它不仅具有矢量算术运算的能力，并且在处理多维的大规模数组时快速且节省空间。

我们先了解下效率方面的优势，通过对比`np.random.normal()`方法生成1000000个规模的随机数组和`random.normalvariate()`方法生成一个等价的Python列表，以此来了解下它们之间具体的性能差距。

此处使用Python的`timeit`计时模块测量两种方法的代码运行时间，使用时需要导入`timeit`模块，如下所示：

```
from timeit import timeit#导入timeit.timeit
```

将两种方法封装成函数，以函数形式分别测量两种方法代码的运行时间，可见NumPy的`random`模块效率优势非常明显，基本是Python内置模块`random`的100倍以上，如下所示：

```
def list_test():
    walk = []
    for _ in range(1000000):
        walk.append(random.normalvariate(0,1))
        
def ndarray_test():
    np.random.normal(loc=0.0, scale=1.0, size=1000000)
    
t1 = timeit('list_test()','from __main__ import list_test',number=1)
t2 = timeit('ndarray_test()','from __main__ import ndarray_test',number=1)

print("list：{}".format(t1))#list：0.918700389
print("ndarray：{}".format(t2))#ndarray：0.033848994999999826
```

接下来了解下矢量运算的能力，矢量的特性可以理解为并行化的运算，也就是说在对数组执行复杂计算时会作用到元素级别，这样仅仅用简洁的表达式就可以代替Python的for循环。我们先使用NumPy的`random.normalvariate()`生成一个平均收盘股价为10元（即期望为10），振幅为1元（即标准差为1），样本数量为1000的正态分布随机数组，如下所示：

```
stock_data = np.random.normal(loc=10.0, scale=1.0, size=1000)
print("stock_data：\n {}".format(stock_data))
"""
stock_data：
[10.78547256  9.76528172  9.22565839  9.88816694  9.98375121  8.82134049
 10.35872851  9.47037456 10.10779769  8.90763374  9.87537764 10.19336141
 10.23045668  9.56778185  .......  11.52876708  9.31758815  9.92082024]
"""
```

我们规整化所有浮点型随机数据的精度，以便于后续显示和运算。此处使用`np.around()`方法将所有数据保留2位小数，由于矢量运算的能力，此处仅需一行代码就可实现，如下所示：

```
stock_data = np.around(stock_data,2)#保留2位小数
print("stock_data：\n {}".format(stock_data))
"""
stock_data：
[11.97  9.34 12.14 11.28 11.7   8.65  8.81  8.63 11.93  9.48  8.93  9.83
 10.54  9.38 10.93  9.09 10.4   9.88 10.35 11.67  7.97 12.19 10.1  11.22
  9.85 10.91 10.38  9.16  9.46  ...... 10.02  9.27 11.2   9.4   9.83  8.99]
"""
```

再尝试下更为复杂的算数运算，比如计算股价的涨跌幅，涨跌幅的计算公式为：\(今日收盘价-昨日收盘价\)/昨日收盘价\*100\%。`np.roll()`为循环右移，此处将今日收盘价数组循环右移一位得到了昨日收盘价数组，那么昨日收盘价数组第一个值为无效值，对应计算得到的`pct_change`的第一个值需要设置为无效值`np.nan`，如下所示：

```
pct_change = np.around((stock_data - np.roll(stock_data,1))/np.roll(stock_data,1),2)
pct_change[0] = np.nan
print("pct_change：\n {}".format(pct_change))
"""
pct_change：
 [  nan  0.1  -0.07  0.16 -0.15 -0.01 -0.08  0.24 -0.04  0.01 -0.08  0.21
 -0.1  -0.16  0.14 -0.    0.04  0.04 -0.13  0.07 -0.07  0.11 -0.03 -0.22
  0.3   0.04 -0.12  0.32 -0.21  0.02 -0.15  0.25 -0.12  0.22 -0.18  0.2
 -0.05  0.    0.08 -0.03 -0.1  -0.14  0.18  0.16 -0.15 -0.04 -0.01  0.
  0.09 -0.05 -0.04  0.09 -0.02 ....... 0.38  0.08  0.07 -0.14 -0.07 -0.03]
"""
```

## 总结

本小节以随机漫步方式生成股票数据为场景，涵盖了`NumPy`的核心—`ndarray`数组对象高效的数据处理能力以及矢量化的特点，另外也涉及了经典的随机漫步理论的具体实现。

量化交易中数据分析是非常基础且重要的过程，本小节仅是以例程的方式帮助同学们快速了解数据分析工具，同学们需要结合官网的文档夯实基础，万丈高楼平地起，要打好根基才能走的更远。

最后，给大家留一道思考题：

我们介绍了`Python`内置`random`模块和`Numpy`中的`random`模块产生随机数的方法，这些随机数的产生是采用了什么原理呢？和物理上的随机数又有什么区别呢？

欢迎大家在留言区留言，我们一起讨论。
    