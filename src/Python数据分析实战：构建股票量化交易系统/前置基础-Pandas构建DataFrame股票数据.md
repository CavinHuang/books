
# 前置基础-Pandas构建DataFrame股票数据
---

# 前置基础：Pandas构建DataFrame股票数据

## 前言

在量化交易系统中数据分析是必不可少的步骤之一，提起Python环境下与数据分析相关的最重要的库一定非`NumPy`和`Pandas`莫属。

`Pandas`则是Python环境下最有名、最专业的数据分析库，虽然NumPy提供了通用的数据处理的计算基础，但在处理表格数据时大多数使用者仍然将Pandas作为统计和分析工作的主要工具。Pandas使得Python中的处理数据变得非常方便、快速和简单。

可见Pandas是NumPy的升级，同时Pandas是围绕着 `Series`和 `DataFrame`两个核心数据结构展开的，但在量化交易系统开发中DataFrame数据结构的使用相对于Series更广泛。

本小节设计一个能够涵盖`Pandas`关键知识点的例程，即以随机漫步方式生成DataFrame格式股票数据为主线，带领同学们快速入门常用数据分析工具。

## DataFrame数据生成

以随机漫步方式获得了收盘股价及对应交易日的涨幅后，我们将这些基础数据生成为DataFrame格式的股票数据，以此快速了解下DataFrame格式的特点。

`DataFrame`是一个表格型的数据结构，既有行索引 index也有列索引columns，创建DataFrame的基本方法为`df = pd.DataFrame(data, index=index,columns=columns)`，其中data参数的数据类型可以支持由列表、一维`ndarray`或`Series`组成的字典、字典组成的字典、二维`ndarray`等。如下图所示，基本上可以把DataFrame看成是Excel的表格形态：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b5e9a2f55a67~tplv-t2oaga2asx-image.image)

接下来我们根据创建DataFrame的基本要求将`data`、`index`、`columns`这三个参数准备就绪。关于列索引`columns`，我们将收盘价定义为“close”，涨跌幅定义为“price range”。行索引index在此处表示为交易日期，Pandas提供了强大的处理日期数据的功能，我们使用`pandas.date_range()`生成`DatetimeIndex`格式的日期序列，其中参数包括：起始时间start、结束时间end、时期数量periods、日期间隔频率freq='M'月、'D'天、'W'、周、'Y'年等等，此处生成从2010-01-01开始的1000个日期的时间序列，如下所示：

```
import pandas as pd
#生成日时间序列
dd=pd.date_range('2010-01-01',freq='D',periods=1000)
print(f'生成日时间序列：\n{dd}')
"""
生成日时间序列：
DatetimeIndex(['2010-01-01', '2010-01-02', '2010-01-03', '2010-01-04',
               '2010-01-05', '2010-01-06', '2010-01-07', '2010-01-08',
               '2010-01-09', '2010-01-10',
               ...
               '2012-09-17', '2012-09-18', '2012-09-19', '2012-09-20',
               '2012-09-21', '2012-09-22', '2012-09-23', '2012-09-24',
               '2012-09-25', '2012-09-26'],
              dtype='datetime64[ns]', length=1000, freq='D')"""
"""
```

关于data参数的类型，我们通过`np.random.normal()`返回的数据类型为`'numpy.ndarray'`，属于data参数支持的数据类型，于是我们将`data`、 `index`和`columns`三个参数传入创建DataFrame的方法中，就可以生成DataFrame格式的股票交易数据。此处以`ndarray`组成的字典形式创建DataFrame，字典每个键所对应的`ndarray`数组分别成为DataFrame的一列，共享同一个 index ，例程如下所示：

```
df_stock = pd.DataFrame({'close': stock_data, 'price range': pct_change}, index=dd)
print(f'股价交易数据：\n {df_stock.head()}')#打印前5行数据
"""
股价交易数据：
             close  price range
2010-01-01  10.59          NaN
2010-01-02   8.52        -0.20
2010-01-03   9.03         0.06
2010-01-04  10.33         0.14
2010-01-05  10.10        -0.02
"""
```

当我们得到了`DataFrame`格式的股票交易数据之后，就可以利用Pandas强大数据分析功能处理我们的数据，在后续的小节中会陆续介绍其中的各种方法。此处我们先通过Pandas封装的matplotlib绘图功能，绘制其中50个交易日收盘价曲线，用可视化的方式了解下随机漫步的股价走势，如下所示：

```
import matplotlib.pyplot as plt
#绘制收盘价
df_stock.close[100:150].plot(c='b')
plt.legend(['Close'],loc='best')
plt.show()
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b5fee8bd847c~tplv-t2oaga2asx-image.image)

## 总结

本小节以上一小节介绍的随机漫步方式生成`DataFrame`格式股票数据为场景，涵盖了`Pandas`的核心—`DataFrame`数据结构的生成。

量化交易中数据分析是非常基础且重要的过程，本小节仅是以例程的方式帮助同学们快速了解数据分析工具，同学们需要结合官网的文档夯实基础，万丈高楼平地起，要打好根基才能走的更远。

最后，给大家留一道思考题：

我们介绍了`Pandas`的`DataFrame`数据结构的特点，那么 `Series`和 `DataFrame`两个核心数据结构的区别和联系是什么呢？

欢迎大家在留言区留言，我们一起讨论。
    