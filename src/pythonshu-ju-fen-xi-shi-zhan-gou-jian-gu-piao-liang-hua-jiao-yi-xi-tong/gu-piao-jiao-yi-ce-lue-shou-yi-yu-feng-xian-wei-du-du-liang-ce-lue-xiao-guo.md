
# 股票交易策略-收益与风险维度度量策略效果
---

# 股票交易策略：收益与风险维度度量策略效果

## 前言

虽然掌握了N日突破择时策略的实现方法，但我们并不能立即将该策略应用于实盘交易之中，原因很简单，我们无法评价该策略的具体效果如何。对此，我们需要将策略基于一段历史股票数据进行模拟的买入和卖出，以验证交易策略的可行性，我们称这个环节为“回测阶段”。

在回测阶段，策略的收益和风险是度量策略效果非常关键的两个指标，本小节介绍策略收益和风险的度量方法，并且通过直观的图形分析来了解下N日突破择时策略的执行效果。

## 策略收益显示

关于策略的收益可分为绝对收益和相对收益，绝对收益指的是最终的资金收益情况，而相对收益指的是使用策略的收益与基准收益的对比情况。

我们延续上一小节N日突破择时策略所构建的买卖信号序列，在此基础上计算策略的收益情况。首先计算资金收益曲线，此处设置初始资金为10万元，一旦信号触发则全仓操作，即全仓买入股票后资金转为市值，全仓卖出股票后市值转为资金。

初始化以下四个变量，如下所示：

```
cash_hold = 100000 #初始资金
posit_num = 0 #持股数目
market_total = 0 #持股市值
skip_days = 0 #持股/持币状态
```

遍历`df_stockload.signal`序列，当符合买入/卖出操作时执行相应的代码，如下所示：

```
for kl_index, today in df_stockload.iterrows():
	#买入/卖出执行代码
```

当触发买入信号时，如果是持币状态则将资金转换为股票，当触发卖出信号时，如果是持股状态则将股票转换为资金，如下所示：

```
#买入/卖出执行代码
if today.signal == 1 and skip_days == 0:  # 买入
    start = df_stockload.index.get_loc(kl_index)
    skip_days = -1
    posit_num = int(cash_hold / today.Close) #资金转化为股票
    cash_hold = 0

elif today.signal == 0 and skip_days == -1:  # 卖出 避免未买先卖
    end = df_stockload.index.get_loc(kl_index) 
    skip_days = 0
    cash_hold = int(posit_num * today.Close) #股票转化为资金
    market_total = 0
```

总体收益为资金和股票市值两者的结合，如下所示：

```
if skip_days == -1: #持股
    market_total = int(posit_num * today.Close)
    df_stockload.loc[kl_index,'total'] = market_total
else: #空仓
    df_stockload.loc[kl_index,'total'] = cash_hold

print(df_stockload.total)    
"""
Date
2018-10-08    100000.0
2018-10-09    100000.0
2018-10-10    100000.0
2018-10-11    100000.0
2018-10-12    100000.0
                ...   
2019-03-27    138757.0
2019-03-28    132299.0
2019-03-29    136204.0
2019-04-01    141910.0
2019-04-02    140258.0
Name: total, Length: 120, dtype: float64
"""
```

Pandas整合了matplotlib的相关功能，因此基于DataFrame格式数据可直接使用`plot()`方法绘制曲线，如下所示：

```
df_stockload.total.plot(grid=True)
plt.show()
```

执行N日突破择时策略后，最终的资金收益情况如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/13/16a15801869cb528~tplv-t2oaga2asx-image.image)

从资金收益曲线可获悉到，在执行策略后资金有显著的增长。

接下来计算基准收益与使用策略后的收益，并进行对比。基准收益指的是第一天开始持有股票直到最后一天的收益情况，它为对数收益率，公式原型为：

![r = ln ( C_{n}/C_{n-1} )](https://juejin.cn/equation?tex=r%20%3D%20ln%20(%20C_%7Bn%7D%2FC_%7Bn-1%7D%20))

（Cn为今日收盘价，Cn-1为昨日收盘价），即求以e为底\(Cn/Cn-1\)的对数，对应的指数公式原型为：

![C_{n}=C_{n-1} *e^r](https://juejin.cn/equation?tex=C_%7Bn%7D%3DC_%7Bn-1%7D%20*e%5Er)

对数收益率可由`np.log()`方法实现，此处使用`np.log()`方法先计算基准收益，如下所示：

```
#计算基准收益 
stock_df['benchmark_profit'] = np.log(stock_df.Close/stock_df.Close.shift(1))
"""
Date
2018-10-08        NaN
2018-10-09    0.0e+00
2018-10-10   -2.8e-03
2018-10-11   -1.1e-01
2018-10-12   -8.7e-02
               ...   
2019-03-27   -3.8e-02
2019-03-28   -4.8e-02
2019-03-29    2.9e-02
2019-04-01    4.1e-02
2019-04-02   -1.2e-02
Name: benchmark_profit, Length: 120, dtype: float64
"""
```

对于使用策略后收益的计算，我们可在基准收益基础上与`signal`序列矢量相乘。由于`signal`序列中1代表买入后持续持有股票，0代表卖出后持续空仓持币，与基准收益相乘可过滤掉`signal`序列为0时对应当天的收益，同时可保持`signal`序列为1对应当天的收益，如下所示：

```
#计算趋势突破策略收益
df_stockload['trend_profit'] = df_stockload.signal*df_stockload.benchmark_profit
print(df_stockload['trend_profit'])
"""
Date
2018-10-08        NaN
2018-10-09    0.0e+00
2018-10-10   -0.0e+00
2018-10-11   -0.0e+00
2018-10-12   -0.0e+00
               ...   
2019-03-27   -3.8e-02
2019-03-28   -4.8e-02
2019-03-29    2.9e-02
2019-04-01    4.1e-02
2019-04-02   -1.2e-02
Name: trend_profit, Length: 120, dtype: float64
"""
```

对数收益率可线性叠加，因此使用`cumsum()`方法将序列值累加形成基准收益曲线和策略收益曲线，然后使用DataFrame格式数据自带的`plot()`方法绘制这两条曲线，如下所示：

```
df_stockload[['benchmark_profit','trend_profit']].cumsum().plot(grid=True)
```

基准收益与执行N日突破择时策略收益对比情况，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/13/16a158159b54d0b5~tplv-t2oaga2asx-image.image)

从对比情况可获悉，执行策略后可以通过空仓方式避免下跌过程中带来的损失。

## 回撤的风险度量

我们看到了执行交易策略后的收益，但是股票交易是有风险的，如何去衡量这个风险呢？最大回撤率就是一种直观的将风险切实量化的指标，它描述了买入股票后，在策略出现最糟糕的情况下会损失多少钱，这也直接关系到了风险策略中止损因子的设定。

回撤的意思是指在某一段时期内股价从最高点开始回落到最低点的幅度。最大回撤率计算公式为：

max（1-当日收盘价/当日之前最高价）\*100％

举个例子，在股票最高价2元买入，近半年内，股价下跌到最低点1.6元，最大亏损0.4元，那么这近半年最大回撤率=1-1.6/2×100％，结果是20％。显而易见，回撤率越小越好，因为回撤与风险成正比，回撤越大，风险也就越高。

那么我们先介绍下如何实现股票收盘价最大回撤率的计算。

首先使用`expanding()` 计算收盘价的滚动最大值序列，也就是截止到任一交易日之前收盘价的最大值，如下所示：

```
# expanding()计算收盘价曲线当前的滚动最高值
stock_df['max_close'] = stock_df['Close'].expanding().max()
df_stockload['max_close'].plot(grid=True)
```

绘制收盘价曲线及收盘价滚动最大值曲线，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/13/16a1585d4521daa7~tplv-t2oaga2asx-image.image)

接着，将收盘价序列与滚动最大值序列矢量相除，计算收盘价对于最高值所占的百分比，如下所示：

```
# 计算收盘价曲线对于滚动最高值后所占的百分比
df_stockload['per_close'] = df_stockload['Close'] / df_stockload['max_close']
```

对该百分比从小到大排序，收盘价对于最高值所占的百分比越低，说明回撤的幅度越大，那么将1减去排序后的最小数值，即得到收盘价的最大回撤率。如下所示：

```
min_point_close = df_stockload.sort_values(by=['per_close']).iloc[[0], df_stockload.columns.get_loc('per_close')]
```

打印收盘价的最大回撤率，如下所示：

```
print("最大股价回撤%5.2f%%" % (1 - min_point_close.values))
#最大股价回撤 0.26%
```

寻找出最大回撤率所对应的最高价交易日和最大回撤交易日，并打印显示，如下所示：

```
max_point_close = df_stockload[df_stockload.index <= min_point_close.index[0]].sort_values \
    (by=['Close'], ascending=False).iloc[[0], df_stockload.columns.get_loc('Close')]
print("从%s开始至%s结束" % (max_point_close.index[0], min_point_close.index[0]))
#从2018-10-08 00:00:00开始至2018-10-16 00:00:00结束
```

接下来我们介绍下计算资金曲线最大回撤率的方法，该方法与计算收盘价曲线最大回撤率方法类同。

首先使用`expanding()` 计算资金序列的滚动最大值，也就是截止到当前交易日，资金序列的最大值，如下所示：

```
# expanding()计算资金曲线当前的滚动最高值
df_stockload['max_total'] = df_stockload['total'].expanding().max()
```

绘制资金曲线及资金滚动最大值曲线，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/13/16a1585829b754e3~tplv-t2oaga2asx-image.image)

接着将资金序列与资金序列滚动最大值矢量相除，即得到资金序列在滚动最大值之后剩余资金的百分比，对剩余资金百分比从小到大排序，那么排序后的第一行值即为回撤后资金剩余百分比的最小值，1-资金剩余百分比最小值即为资金曲线最大回撤率，打印资金最大回撤率、资金最高值/最大回撤值对应的交易日，如下所示：

```
# 计算资金曲线在滚动最高值之后所回撤的百分比
df_stockload['per_total'] = df_stockload['total'] / df_stockload['max_total']
min_point_total = df_stockload.sort_values(by=['per_total']).iloc[[0], df_stockload.columns.get_loc('per_total')]
max_point_total = df_stockload[df_stockload.index <= min_point_total.index[0]].sort_values \
    (by=['total'], ascending=False).iloc[[0], df_stockload.columns.get_loc('total')]
print("最大资金回撤%5.2f%%从%s开始至%s结束" % ((1 - min_point_total.values), \
                                   max_point_total.index[0], min_point_total.index[0]))
#最大资金回撤 0.17%从2019-03-25 00:00:00开始至2019-03-28 00:00:00结束
```

使用最大回撤率去度量风险有两大用途：

- 直接的用途是可以排除不适合自己的策略。假设一个策略的最大回撤是20％，那么使用这个策略之前就要掂量下自己能否经受得起20％浮亏的极端的情况。如果最大回撤一直控制在低水平，那么最明显的两个好处就是不会大幅丧失之前的盈利，以及可以较快地重新回到原来的最高点。
- 通过收益回撤比，选出最有优势的产品。如果收益率为30％，回撤率为5％，那么收益与回撤比：资金收益率/资金回撤率＝6, 比值越大往往说明此股票的赢利能力越强。

## 收益与风险图表集成

接下来我们创建三个子图分别绘制如下内容：

- 呈现盈亏状态的买卖区间及标注上买卖信号点
- 资金曲线及资金最大回撤点
- 基准收益曲线及使用策略后的收益曲线

创建一个名称为fig的图表对象，在fig对象中分别创建名为`graph_trade`、`graph_total`、`graph_profit`的Axes对象，并在对象上开始绘制图表，如下所示：

```
fig = plt.figure(figsize=(8, 6), dpi=100, facecolor="white")#创建fig对象
gs = gridspec.GridSpec(3, 1, left=0.05, bottom=0.15, right=0.96, top=0.96, wspace=None, hspace=0.2, height_ratios=[4.5,2,2])
graph_trade = fig.add_subplot(gs[0,:])
graph_total = fig.add_subplot(gs[1,:])
graph_profit = fig.add_subplot(gs[2,:])
```

接下来就把我们已经介绍过的资金曲线、基准收益曲线、最大回撤点等分立图表元素汇总在大图表上，整体代码实现如下所示：

```
import pandas_datareader.data as web
import pandas as pd
import numpy as np
import datetime
import matplotlib.pyplot as plt

import matplotlib.gridspec as gridspec  # 分割子图
#初始化变量
skip_days = 0
cash_hold = 100000 #初始资金
posit_num = 0 #持股数目
market_total = 0 #持股市值

#创建图表
fig = plt.figure(figsize=(10, 8), dpi=100, facecolor="white")#创建fig对象
gs = gridspec.GridSpec(3, 1, left=0.05, bottom=0.1, right=0.96, top=0.96, wspace=None, hspace=0.05, height_ratios=[4,2,2])
graph_trade = fig.add_subplot(gs[0,:])
graph_total = fig.add_subplot(gs[1,:])
graph_profit = fig.add_subplot(gs[2,:])

#获取股票交易数据
df_stockload = GetStockDatApi("600410.SS",datetime.datetime(2018, 10, 1), datetime.datetime(2019, 4, 1))

for kl_index, today in df_stockload.iterrows():
    # 买入/卖出执行代码
    if today.signal == 1 and skip_days == 0:  # 买入
        start = df_stockload.index.get_loc(kl_index)
        skip_days = -1
        posit_num = int(cash_hold / today.Close) #资金转化为股票
        cash_hold = 0
        graph_trade.annotate('买入',xy=(kl_index,df_stockload.Close.asof(kl_index)),xytext=(kl_index, df_stockload.Close.asof(kl_index)+2),arrowprops=dict(facecolor='r',shrink=0.1),horizontalalignment='left',verticalalignment='top')

    elif today.signal == 0 and skip_days == -1:  # 卖出 避免未买先卖
        end = df_stockload.index.get_loc(kl_index)
        skip_days = 0
        cash_hold = int(posit_num * today.Close) #股票转化为资金
        market_total = 0

        if df_stockload.Close[end] < df_stockload.Close[start]:  # 赔钱显示绿色
            graph_trade.fill_between(df_stockload.index[start:end], 0, df_stockload.Close[start:end], color='green', alpha=0.38)
        else:  # 赚钱显示红色
            graph_trade.fill_between(df_stockload.index[start:end], 0, df_stockload.Close[start:end], color='red', alpha=0.38)
        graph_trade.annotate('卖出',xy=(kl_index,df_stockload.Close.asof(kl_index)),xytext=(kl_index+datetime.timedelta(days=5), df_stockload.Close.asof(kl_index)+2),arrowprops=dict(facecolor='g',shrink=0.1),horizontalalignment='left',verticalalignment='top')

    if skip_days == -1: #持股
        market_total = int(posit_num * today.Close)
        df_stockload.loc[kl_index,'total'] = market_total
    else: #空仓
        df_stockload.loc[kl_index,'total'] = cash_hold

#计算基准收益/趋势突破策略收益
df_stockload['benchmark_profit'] = np.log(df_stockload.Close/df_stockload.Close.shift(1))
df_stockload['trend_profit'] = df_stockload.signal*df_stockload.benchmark_profit
df_stockload[['benchmark_profit','trend_profit']].cumsum().plot(grid=True,ax=graph_profit)

#计算收盘价曲线当前的滚动最高值
df_stockload['max_close'] = df_stockload['Close'].expanding().max()
df_stockload[['max_close','Close']].plot(grid=True,ax=graph_trade)

#计算资金曲线当前的滚动最高值
df_stockload['max_total'] = df_stockload['total'].expanding().max()
df_stockload[['max_total','total']].plot(grid=True,ax=graph_total)

#计算资金曲线在滚动最高值之后所回撤的百分比
df_stockload['per_total'] = df_stockload['total'] / df_stockload['max_total']
min_point_total = df_stockload.sort_values(by=['per_total']).iloc[[0], df_stockload.columns.get_loc('per_total')]
max_point_total = df_stockload[df_stockload.index <= min_point_total.index[0]].sort_values \
    (by=['total'], ascending=False).iloc[[0], df_stockload.columns.get_loc('total')]

#标注滚动最大点及最大回撤点
graph_total.annotate('滚动最大点',
                     xy=(max_point_total.index[0], df_stockload.total.asof(max_point_total.index[0])),
                     xytext=(max_point_total.index[0], df_stockload.total.asof(max_point_total.index[0]) + 4),
                     arrowprops=dict(facecolor='yellow', shrink=0.1), horizontalalignment='left',
                     verticalalignment='top')
graph_total.annotate('最大回撤点',
                     xy=(min_point_total.index[0], df_stockload.total.asof(min_point_total.index[0])),
                     xytext=(min_point_total.index[0], df_stockload.total.asof(min_point_total.index[0]) + 4),
                     arrowprops=dict(facecolor='yellow', shrink=0.1), horizontalalignment='left',
                     verticalalignment='top')

#图表显示参数配置
for label in graph_trade.xaxis.get_ticklabels():
    label.set_visible(False)
for label in graph_total.xaxis.get_ticklabels():
    label.set_visible(False)
for label in graph_profit.xaxis.get_ticklabels():
    label.set_rotation(45)
    label.set_fontsize(10)  # 设置标签字体
graph_trade.set_xlabel("")
graph_trade.set_title(u'华胜天成 收益与风险度量')
graph_total.set_xlabel("")

plt.show()
```

最终的收益与风险度量的可视化效果，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/13/16a1584ef0b90039~tplv-t2oaga2asx-image.image)

## 总结

基于可视化的收益与风险度量可以更好地帮助我们分析策略的回测执行情况。比如观察N日突破策略的回测效果，在买卖区间子图中红色即为盈利操作，绿色为亏损操作，可以看到今年获利交易的次数较多。从收益曲线可以看出应用该策略执行交易的效果良好，最大回撤曲线可以看出资金的亏损幅度，整体应用策略的收益大于基准收益。

最后，给大家留一道思考题：

回测阶段反映的是策略基于历史交易数据模拟买卖的效果，那么回测能够代表实际执行效果吗？我们又该如何去理解回测阶段的意义呢？

欢迎大家在留言区留言，我们一起讨论。
    