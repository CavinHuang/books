
# 股票数据分析-如何计算主力资金的流入流出【加推篇】
---

# 加推篇！如何计算主力资金的流入流出

## 前言

目前很多行情软件提供了机构资金流入、散户资金流入等数据。本节我来给大家解释下这些数据是如何计算得到的。

## 计算流入流出资金

接下来我们通过分时明细数据粗略地估计下该股流入和流出的资金情况。 成交额的计算为价格\*成交量，不过get\_tick\_data\(\)接口返回的数据已经包含了成交额数据，确实方便了不少。我们把当天所有分时的成交额累计后得到整一天的成交额为9856.02万，代码如下所示：

```
# 当天的成交额
print(df_tick.amount.sum())
```

计算资金流入和流出可以使用Pandas的groupby方法。我们先大致了解下groupby的整个过程。groupby其实可以分为拆分、应用、合并三个过程。拆分指的是根据某个规则把数据集分组，应用指的是对每一组数据进行统计操作，比如取平均、求和或者是自定义函数，最后是合并过程，合并是把操作后的结果重新聚合起来，形成另一个DataFrame数据或者Series数据。

计算资金流入和流出的代码如下所示：

```
print(df_tick["amount"].groupby(df_tick["type"]).sum())
"""
type
中性盘     2110576
买盘     36741662
卖盘     59707926
Name: amount, dtype: int64
"""
```

对于主力资金的流入和流出的计算，主要是通过资金量的大小去筛选，因为成交一笔较大大成交量的单子是需要相应大小资金，往往认为这笔成交是由机构或者大户完成的，也就是所谓的主力。

比如东方财富网的定义如下：

- 超大单：大于等于50万股或者100万元的成交单;
- 大单：大于等于10万股或者20万元且小于50万股和100万元的成交单;
- 中单：大于等于2万股或者4万元且小于10万股和20万元的成交单;
- 小单：小于2万股和4万元的成交单;
- 流入：买入成交额;
- 流出：卖出成交额;
- 主力流入：超大单加大单买入成交额之和;
- 主力流出：超大单加大单卖出成交额之和;
- 净额：流入-流出;
- 净比：\(流入-流出\)/总成交额;

因此我们可以设置主力交易成交额阈值即可，当天所有大于该阈值的买盘的总成交额，即为主力资金流入，当天所有大于该阈值的卖盘的总成交额，即为主力资金流出。代码如下所示：

```
print(df_tick[df_tick["amount"]>threshold].amount.groupby(df_tick["type"]).sum())
"""
type
中性盘     1119753
买盘     14042952
卖盘     33459052
Name: amount, dtype: int64
"""
```

关于大单交易，此次再补充一点。get\_sina\_dd\(\)接口可获取大单交易数据，默认为大于等于400手，也可通过vol参数指定返回具体成交量的交易数据，如下所示：

```
# 获取大单交易数据,默认为大于等于400手,数据来源于新浪财经。
data=ts.get_sina_dd('600797',date = '2019-08-08')
print(data.head(10))
"""
     code  name      time  price  volume  preprice type
0  600797  浙大网新  15:00:00   8.01  253542      8.01   买盘
1  600797  浙大网新  14:56:18   8.01   45700      8.01   卖盘
2  600797  浙大网新  14:54:39   8.01  116400      8.01   买盘
3  600797  浙大网新  14:18:18   8.00   50000      8.00   买盘
4  600797  浙大网新  13:35:57   8.02   53100      8.01   卖盘
5  600797  浙大网新  13:33:57   8.03   42200      8.03   买盘
6  600797  浙大网新  13:25:18   8.01   64100      8.01   买盘
7  600797  浙大网新  13:25:15   8.01   41800      8.01   买盘
8  600797  浙大网新  13:22:57   8.04  135500      8.03   买盘
9  600797  浙大网新  13:22:00   8.01   44600      8.01   买盘
"""
```

同样的方法也可以统计得到散户的资金流入流出情况。然后把这些数据绘制成折线图后，能更清楚的了解资金流入和流出的变化趋势。如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/25/173836ae74d30193~tplv-t2oaga2asx-image.image)

这里要说明下，如果要更精确的统计流入流出的资金情况，可采用分时逐笔成交数据去计算。

确切地说即使使用“逐笔成交”数据也只能作为寻找主力行踪的一项参考指标，这是因为“逐笔成交”是以实际成交对手盘中买卖双方较小投注量为单位统计的结果。

另外，根据以往的经验来看，我们在成交明细里面识别大单以及超级大单时，可以留意具有规律性的单子，通常这些单子是用自动交易软件批量下单的，把一个大单转化大为各种小单，只有大资金才会去使用。看到这样的单子，可以作为判断有大资金进场的一个信号。

## 总结

本小节我们知道了行情软件上主力资金流入流出和散户资金流入流出的原理。

最后，给大家留一道思考题：

为什么说计算股票每天的资金流入流出数据，并从中筛选出主力进出动态不一定十分靠谱呢？

欢迎大家在留言区留言，我们一起讨论。
    