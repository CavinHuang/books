
# 股票交易策略-海龟择时策略入门量化交易
---

# 股票交易策略：海龟择时策略入门量化交易

## 前言

股票交易需要做的有三件事：选股、择时和仓位管理。关于择时方面的交易策略，目前市面上有复杂的、也有简单的，种类繁多。其实股价的涨跌本质原因是多空双方之间的博弈，选择交易的时机也就是判断多空双方之间抗衡的局势。

作为一名股票交易者，制定策略的出发点应该更多的是为了拨开股价现象看到多空双方动能的本质，而不是一味追求复杂的策略机制。本小节选取量化经典作品《海龟交易法则》中的经典趋势型策略作为案例，介绍量化交易择时策略的买卖信号制定过程，并以可视化方法呈现信号的触发。

## N日突破择时策略

“我们要培养交易者，就像新加坡人养海龟一样。”著名的交易大师理查德·丹尼斯在新加坡时聚精会神观察着一个海龟农场，突然冲口说出了这样一句话，著名的“海龟交易试验”正是取名于此。

“海龟交易试验”的起因是理查德·丹尼斯想弄清伟大的交易员是天生造就的还是后天培养的。为此，他在1983年他招募了13个人，教授给他们期货交易的基本概念，以及他自己的交易方法和原则，学员们被称为“海龟”。在随后的4年中，海龟们取得了年均复利80\%的收益。

“海龟交易试验”也因此成为了金融史上著名的实验，在实验中的运用的《海龟交易法则》非常适合应用于量化分析，以至于在近几年的量化投资热浪中再一次成为热门模式。

《海龟交易法则》中介绍了一种趋势类的择时策略——N日突破策略。策略的核心思想为：当天收盘价超过N1天内最高价认为上升趋势成立，作为买入信号；当天收盘价低于N2天内最低价格认为下跌趋势成立，作为卖出信号。也就是说，N日趋势突破买入即为N日创新高买入，股价创出阶段性新高或历史新高后，一方面说明该股有资金在运作，相对比较强势，更容易顺势而上，另一方面创新高后近期买入的投资者都有获利，上档的套牢盘比较少，股价上冲的阻力也较小，更容易继续上涨。反之，N日趋势跌破时卖出的逻辑思维一样成立。

此处使用前面小节所介绍的股票交易数据接口来获取华胜天成2018-10-1至2019-4-1半年的交易数据，作为本小节的例程数据，如下所示：

```
df_stockload = web.DataReader("600410.SS", "yahoo", datetime.datetime(2018,10,1), datetime.datetime(2019,4,1))
print(df_stockload.describe())
"""
        High    Low   Open  Close   Volume  Adj Close
count  120.0  120.0  120.0  120.0  1.2e+02      120.0
mean     6.9    6.6    6.8    6.8  2.9e+07        6.8
std      1.1    1.0    1.1    1.1  2.9e+07        1.1
min      5.5    5.1    5.2    5.3  0.0e+00        5.3
25%      6.2    6.0    6.1    6.1  1.3e+07        6.1
50%      6.6    6.3    6.4    6.4  1.7e+07        6.4
75%      7.1    6.8    6.9    7.0  3.1e+07        7.0
max     10.7   10.0   10.4   10.7  1.5e+08       10.7
"""
```

接下来需要确定N日突破策略的参数N1、N2。关于参数N1、N2的选取，假定我们侧重于中线周期的交易，此处选择N1参数为15天，N2参数为5天，至于参数N1大于N2的原因是为了打造一个非均衡胜负收益的环境，因为我们从事量化交易的目标是要赢钱比亏钱要多。

计算该股N1日交易日的滚动最大值。此处使用`df.rolling().max()`这种方式，只需提供最高价和移动时间窗口大小即可，对使用者来说是非常方便快捷的，如下所示：

```
df_stockload['N1_High'] = df_stockload.High.rolling(window=N1).max()#计算最近N1个交易日最高价
print(df_stockload.info())
"""
<class 'pandas.core.frame.DataFrame'>
DatetimeIndex: 120 entries, 2018-10-08 to 2019-04-02
Data columns (total 7 columns):
High         120 non-null float64
Low          120 non-null float64
Open         120 non-null float64
Close        120 non-null float64
Volume       120 non-null int64
Adj Close    120 non-null float64
N1_High      99 non-null float64
dtypes: float64(6), int64(1)
memory usage: 7.5 KB
None
"""
print(df_stockload.head())
"""
            High  Low  Open   ...       Volume  Adj Close  N1_High
Date                          ...                                 
2018-10-08   7.3  7.1   7.2   ...      8108183        7.1      NaN
2018-10-09   7.2  7.1   7.1   ...      4170580        7.1      NaN
2018-10-10   7.1  7.0   7.1   ...      4653619        7.1      NaN
2018-10-11   6.8  6.3   6.8   ...     16612288        6.3      NaN
2018-10-12   6.3  5.7   6.3   ...     26829150        5.8      NaN
"""
```

由于从第N1天开始滚动计算该周期内最大值，因此前N1个数值都为`NaN`，此处从收盘价序列第一个数据开始依次寻找当前为止的最大值来填充前N1个`NaN`，如下所示：

```
expan_max = df_stockload.Close.expanding().max()
print(expan_max)
"""
Date
2018-10-08     7.1
2018-10-09     7.1
2018-10-10     7.1
2018-10-11     7.1
2018-10-12     7.1
              ... 
2019-03-27    10.7
2019-03-28    10.7
2019-03-29    10.7
2019-04-01    10.7
2019-04-02    10.7
Name: Close, Length: 120, dtype: float64
"""
df_stockload['N1_High'].fillna(value=expan_max,inplace=True)#目前出现过的最大值填充前N1个nan
print(df_stockload.head())
"""
            High  Low  Open   ...       Volume  Adj Close  N1_High
Date                          ...                                 
2018-10-08   7.3  7.1   7.2   ...      8108183        7.1      7.1
2018-10-09   7.2  7.1   7.1   ...      4170580        7.1      7.1
2018-10-10   7.1  7.0   7.1   ...      4653619        7.1      7.1
2018-10-11   6.8  6.3   6.8   ...     16612288        6.3      7.1
2018-10-12   6.3  5.7   6.3   ...     26829150        5.8      7.1

[5 rows x 7 columns]
"""
```

同理，计算该股N2日交易日的滚动最小值类似，如下所示：

```
df_stockload['N2_Low'] = df_stockload.Low.rolling(window=N2).min()#计算最近N2个交易日最低价
print(df_stockload.head())
"""
            High  Low  Open   ...    Adj Close  N1_High  N2_Low
Date                          ...                              
2018-10-08   7.3  7.1   7.2   ...          7.1      7.1     NaN
2018-10-09   7.2  7.1   7.1   ...          7.1      7.1     NaN
2018-10-10   7.1  7.0   7.1   ...          7.1      7.1     NaN
2018-10-11   6.8  6.3   6.8   ...          6.3      7.1     NaN
2018-10-12   6.3  5.7   6.3   ...          5.8      7.1     NaN

[5 rows x 8 columns]
"""
expan_min = df_stockload.Close.expanding().min()
df_stockload['N2_Low'].fillna(value=expan_min,inplace=True)#目前出现过的最小值填充前N2个nan
print(df_stockload.head())
"""
            High  Low  Open   ...    Adj Close  N1_High  N2_Low
Date                          ...                              
2018-10-08   7.3  7.1   7.2   ...          7.1      7.1     7.1
2018-10-09   7.2  7.1   7.1   ...          7.1      7.1     7.1
2018-10-10   7.1  7.0   7.1   ...          7.1      7.1     7.1
2018-10-11   6.8  6.3   6.8   ...          6.3      7.1     6.3
2018-10-12   6.3  5.7   6.3   ...          5.8      7.1     5.8

[5 rows x 8 columns]
"""
```

根据突破定义构建买卖信号。当天的收盘价超过N1天内最高价时给出买入股票信号，当天的收盘价跌破N2天内最低价时给出卖出股票信号。

接下来寻找符合买入条件的时间序列`buy_index`，以及符合买出条件的时间序列`sell_index`，我们已经介绍了Dataframe矢量化处理数据的方式，此处仅需简单的几行代码就可以实现，如下所示：

```
""" 收盘价超过N1最高价 买入股票持有"""
buy_index = stock_df[stock_df.Close > stock_df.N1_High.shift(1)].index
print(buy_index)
"""
DatetimeIndex(['2018-11-13', '2018-11-15', '2018-11-16', '2019-02-25',
               '2019-03-05', '2019-03-06', '2019-03-07', '2019-03-08',
               '2019-03-25'],
              dtype='datetime64[ns]', name='Date', freq=None)
"""
""" 收盘价超过N2最低价 卖出股票持有"""
sell_index = stock_df[stock_df.Close < stock_df.N2_Low.shift(1)].index
print(sell_index)
"""
DatetimeIndex(['2018-10-10', '2018-10-11', '2018-10-12', '2018-10-15',
               '2018-10-16', '2018-12-18', '2018-12-25', '2019-01-02',
               '2019-01-29', '2019-01-31'],
              dtype='datetime64[ns]', name='Date', freq=None)
"""
```

需要说明的是`shift(1)`的作用是在index不变的情况下对序列的值向右移动一个单位，这么做的目的是获取昨天为止的最高价格，表示当日收盘价突破昨日为止最高价格时买入股票。寻找到符合买入/卖出条件的时间序列后，以该时间序列构建`signal`序列，将买入当天的`signal`值设置为1，代表买入，同理将`signal`设置为0，代表卖出。如下所示：

```
stock_df.loc[buy_index,'signal'] = 1 
stock_df.loc[sell_index,'signal'] = 0
print(df_stockload.signal)
"""
Date
2018-10-08    NaN
2018-10-09    NaN
2018-10-10    0.0
2018-10-11    0.0
2018-10-12    0.0
             ... 
2019-03-27    NaN
2019-03-28    NaN
2019-03-29    NaN
2019-04-01    NaN
2019-04-02    NaN
Name: signal, Length: 120, dtype: float64
"""
```

上述新添加的新列`signal`代表信号触发的买卖信号，本小节未涉及仓位管理的方法，此处设定为一旦买入信号触发则全仓买入，一旦卖出信号触发则全仓卖出。在第一个信号触发后，由于是全仓买入或全仓卖出，即使后续仍有信号发出也不执行，也就是说连续的信号只有第一个有实际的操作意义。

我们看到`signal`序列含有`NaN`值，此处使用`fillna()`方法将所有`NaN`值与前面元素值保持一致，这样符合一旦状态被设置为1（买入持有），只有遇到0（卖出空仓）时`signal`状态才会改变，如下所示：

```
df_stockload['signal'].fillna(method = 'ffill',inplace = True)
print(df_stockload.signal)
"""
Date
2018-10-08    NaN
2018-10-09    NaN
2018-10-10    0.0
2018-10-11    0.0
2018-10-12    0.0
             ... 
2019-03-27    1.0
2019-03-28    1.0
2019-03-29    1.0
2019-04-01    1.0
2019-04-02    1.0
Name: signal, Length: 120, dtype: float64
"""
```

由于收盘价格是在收盘后才确定，那么第二天才能执行给出的买卖操作，此处将`signal`序列使用`shift(1)`方法右移更接近真实情况，如下所示：

```
df_stockload['signal'] = df_stockload.signal.shift(1)
print(df_stockload.signal)
"""
Date
2018-10-08    NaN
2018-10-09    NaN
2018-10-10    NaN
2018-10-11    0.0
2018-10-12    0.0
             ... 
2019-03-27    1.0
2019-03-28    1.0
2019-03-29    1.0
2019-04-01    1.0
2019-04-02    1.0
Name: signal, Length: 120, dtype: float64
"""
```

以上虽然使用`fillna()`方法将所有NaN值与上一个元素值保持一致，对于signal序列最前面几个值为NaN值时并不起作用，此时需要再一次使用`fillna()`方法，选择用0值填充序列最前面几个NaN值，如下所示：

```
df_stockload['signal'].fillna(value=0, inplace=True)
print(df_stockload.signal)
"""
Date
2018-10-08    0.0
2018-10-09    0.0
2018-10-10    0.0
2018-10-11    0.0
2018-10-12    0.0
             ... 
2019-03-27    1.0
2019-03-28    1.0
2019-03-29    1.0
2019-04-01    1.0
2019-04-02    1.0
Name: signal, Length: 120, dtype: float64
"""
```

## 买卖信号区间可视化

以N日突破择时策略得到了买卖信号后，我们接下来将这些信号以可视化方式呈现。可视化的内容包括：将买卖持有区间以盈亏状态填充颜色；将买卖信号标注在股票走势图中。

将买卖持有区间以盈亏状态填充颜色。使用`matplotlib.pyplot`模块的`fill_between()`方法可填充同一个坐标轴下的两个曲线函数之间的区域，此处即收盘价曲线和x坐标轴之间的区域，参数`alpha`为底色的透明度设置。当买入时的收盘价格高于卖出时为绿色，表示亏钱，反之为红色，如下所示：

```
if df_stockload.Close[end] < df_stockload.Close[start]:  # 赔钱显示绿色
    plt.fill_between(df_stockload.index[start:end], 0, df_stockload.Close[start:end], color='green', alpha=0.38)
else:  # 赚钱显示红色
    plt.fill_between(df_stockload.index[start:end], 0, df_stockload.Close[start:end], color='red', alpha=0.38)
```

将买卖信号标注在股票走势图中。使用matplotlib.pyplot模块的`annotate()`方法可在图表上添加注释，参数`xy(x, y)`为被注释点的坐标，参数`xytext(x, y)`为插入文本的坐标，参数`arrowprops`是以字典形式设置箭头的属性，参数`verticalalignment`表示字体垂直对齐方式，`horizontalalignment`参数表示字体水平对齐方式，其他还有多个参数可根据显示要求设置，如下所示：

```
plt.annotate('买入',xy=(kl_index,df_stockload.Close.asof(kl_index)),xytext=(kl_index, df_stockload.Close.asof(kl_index)+2),arrowprops=dict(facecolor='r',shrink=0.1),horizontalalignment='left',verticalalignment='top')

plt.annotate('卖出',xy=(kl_index,df_stockload.Close.asof(kl_index)),xytext=(kl_index, df_stockload.Close.asof(kl_index)+2),arrowprops=dict(facecolor='g',shrink=0.1),horizontalalignment='left',verticalalignment='top')
```

我们将股票交易数据的获取和处理部分的代码封装为函数形式，将股票代码、股票数据起始时间、N1、N2作为参数传入该函数，如下所示：

```
#股票数据获取及处理接口
def GetStockDatApi(stockName=None,stockTimeS=None,stockTimeE=None, N1=15,N2=5):

    stockdata = web.DataReader(stockName, "yahoo", stockTimeS, stockTimeE)

    stockdata['N1_High'] = stockdata.High.rolling(window=N1).max()#计算最近N1个交易日最高价
    expan_max = stockdata.Close.expanding().max()
    stockdata['N1_High'].fillna(value=expan_max,inplace=True)#目前出现过的最大值填充前N1个nan

    stockdata['N2_Low'] = stockdata.Low.rolling(window=N2).min()#计算最近N2个交易日最低价
    expan_min = stockdata.Close.expanding().min()
    stockdata['N2_Low'].fillna(value=expan_min,inplace=True)#目前出现过的最小值填充前N2个nan

    #收盘价超过N1最高价 买入股票持有
    buy_index = stockdata[stockdata.Close > stockdata.N1_High.shift(1)].index
    stockdata.loc[buy_index,'signal'] = 1
    #收盘价超过N2最低价 卖出股票持有
    sell_index = stockdata[stockdata.Close < stockdata.N2_Low.shift(1)].index
    stockdata.loc[sell_index,'signal'] = 0
    stockdata['signal'].fillna(method = 'ffill',inplace = True)
    stockdata['signal'] = stockdata.signal.shift(1)
    stockdata['signal'].fillna(method = 'bfill',inplace = True)

    return stockdata
```

接下来遍历`signal`序列，当符合买入/卖出操作时，使用`matplotlib.pyplot`模块绘制买入/卖出信号及盈亏状态。为了避免在未买入股票前提下误执行卖出股票操作，此处`skip_days`变量指示持股/持币的状态。完整代码如下所示：

```
import pandas_datareader.data as web
import pandas as pd
import numpy as np
import datetime
import matplotlib.pyplot as plt

# N日突破买卖信号区间显示
skip_days = 0

df_stockload = GetStockDatApi("600410.SS",datetime.datetime(2018, 10, 1), datetime.datetime(2019, 4, 1))

print(df_stockload)
df_stockload.Close.plot()

for kl_index, today in df_stockload.iterrows():
    if today.signal == 1 and skip_days == 0:  # 买入
        skip_days = -1
        start = df_stockload.index.get_loc(kl_index)
        plt.annotate('买入',xy=(kl_index,df_stockload.Close.asof(kl_index)),xytext=(kl_index, df_stockload.Close.asof(kl_index)+2),arrowprops=dict(facecolor='r',shrink=0.1),horizontalalignment='left',verticalalignment='top')
        print("buy:",kl_index)
    elif today.signal == 0 and skip_days == -1:  # 卖出
        skip_days = 0
        end = df_stockload.index.get_loc(kl_index)
        if df_stockload.Close[end] < df_stockload.Close[start]:  # 赔钱显示绿色
            plt.fill_between(df_stockload.index[start:end], 0, df_stockload.Close[start:end], color='green', alpha=0.38)
        else:  # 赚钱显示红色
            plt.fill_between(df_stockload.index[start:end], 0, df_stockload.Close[start:end], color='red', alpha=0.38)
        plt.annotate('卖出',xy=(kl_index,df_stockload.Close.asof(kl_index)),xytext=(kl_index+datetime.timedelta(days=5), df_stockload.Close.asof(kl_index)+2),arrowprops=dict(facecolor='g',shrink=0.1),horizontalalignment='left',verticalalignment='top')
        print("sell:",kl_index)
plt.legend(loc='best')
plt.title(u"华胜天成 N日突破择时")
plt.show()

"""
#买/卖时间
buy: 2018-11-07 00:00:00
sell: 2018-11-26 00:00:00
buy: 2019-01-17 00:00:00
sell: 2019-01-22 00:00:00
buy: 2019-02-19 00:00:00
"""
```

买卖信号区间的可视化效果如下图所示，从图中可获悉一次交易为盈利状态，第二次交易为亏损，第三次执行了买入操作，目前仍为持股状态。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/11/16a0a32aea2a4d23~tplv-t2oaga2asx-image.image)

## 总结

本小节介绍了N日突破择时策略的实现，需要说明的是该策略中并未考虑风险因素、设定止损机制、仓位分配机制，并且也忽略了手续费，仅作为入门研究参考，旨在使同学们对择时策略有所理解和认识。从买卖信号区间的可视化效果上看，仅仅依靠择时策略展开量化交易是远远不够的，后续内容中我们会一步一步地完善量化交易策略的机制。

最后，给大家留一道思考题：

每种交易策略有它的优点和缺陷，有它所适合发挥的应用场景，大家认为N日突破择时策略有哪些优缺点呢？它更适合在那类行情中使用呢？

欢迎大家在留言区留言，我们一起讨论。
    