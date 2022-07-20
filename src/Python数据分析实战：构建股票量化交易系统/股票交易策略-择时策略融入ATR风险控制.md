
# 股票交易策略-择时策略融入ATR风险控制
---

# 股票交易策略：择时策略融入ATR风险管理

## 前言

N日突破择时策略的核心思想为：当天收盘价超过N1天内最高价认为上升趋势成立，作为买入信号；当天收盘价低于N2天内最低价格认为下跌趋势成立，作为卖出信号。

我们发现该策略存在的问题是：当买入股票后，在上涨趋势时并不会出现卖点，而是当下跌趋势成立后才出现卖点，此时已经回撤了较大部分盈利；当策略判断错误而给出买入信号时，股价出现不断下跌的走势，如果直到策略给出卖点信号才卖出股票，此时已经亏损较多资金。

通常交易策略中会融入多个因子协同触发信号，本小节在N日突破择时策略的基础上引入风险管理因子。该因子采用止盈止损机制来管理可能出现的风险，ATR指标则作为止盈止损的基准值。

## ATR指标的实现

技术指标大体分为趋势型和震荡型两类。N日突破、均线突破属于趋势型指标，趋势型指标背后逻辑是假设之前价格上涨预示着之后一段时间内仍然会上涨。而震荡型指标侧重于波动幅度的分析，比如之前介绍的KDJ指标，本小节介绍的ATR指标也属于震荡型指标。

ATR（Average True Range）又称平均真实波动范围，由J.Welles Wilder所发明。ATR指标主要是用来衡量市场波动的强烈程度，用于反应市场变化率的指标。较低的ATR值表示市场交易气氛比较冷清（股价横盘整理，预示变盘），而较高的ATR则表示市场交易气氛比较旺盛（股价波幅加剧有主力资金进出），较高的ATR或较低的ATR可以被看作价格趋势的反转或下一个趋势的开始。

ATR指标的计算分为以下两步：

- 第一步为计算真实波幅TR。TR=MAX\[\(当日最高价-当日最低价\)、abs\(当日最高价-昨日收盘价\)、abs\(昨日收盘价-当日最低价\)\]，指的是今日振幅、今日最高价与昨日收盘价之间的波幅、昨日收盘价与今日最低价之间的波幅，取这三者之中的最大值。
- 第二步对真实波幅TR进行N日移动平均计算。ATR=MA\(TR,N\)，常用参数N为14日或21日。

使用TA-Lib库中的`ATR()`方法直接计算ATR波动幅度序列，使用时需要输入numpy.ndarray类型的最高价、最低价和收盘价序列，以及指定ATR移动平均参数N。使用股票交易数据接口获取华胜天成2018-10-1至2019-4-1半年的交易数据，并分别计算ATR14和ATR21指标序列，如下所示：

```
df_stockload = web.DataReader("600410.SS", "yahoo", datetime.datetime(2018,10,1), datetime.datetime(2019,4,1)) 
df_stockload['art14'] = talib.ATR(df_stockload.High.values,df_stockload.Low.values,df_stockload.Close.values,timeperiod=14)#计算ATR14
df_stockload['art21'] = talib.ATR(df_stockload.High.values,df_stockload.Low.values,df_stockload.Close.values,timeperiod=21)#计算ATR21
```

对计算得到的ATR14和ATR21指标序列，可直接使用`plot()`方法绘制曲线，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/14/16a1b60f13ff6b3a~tplv-t2oaga2asx-image.image)

## 止盈止损的实现

此处将ATR值作为止盈止损的基准值，止盈值设置为n\_win倍的ATR值，止损值设置为n\_loss倍的ATR值，n\_win和n\_loss分别为最大止盈系数和最大止损系数，此处设置最大止盈系数为2，最大止损系数为0.8，倾向于盈利值要大于亏损值。触发止盈止损条件为：

- 当n\_win\*ATR值 > \(今日收盘价格 - 买入价格\)，触发止盈信号，卖出股票
- 当n\_loss\*ATR值 > \(买入价格 - 今日收盘价格\)，触发止损信号，卖出股票

接下来我们需要整改`GetStockDatApi()`接口，该接口原来以矢量化方式获得买卖点信号，现更改为遍历方式获得买卖点信号，如下所示：

```
#原处理方式
"""
#收盘价超过N1最高价 买入股票持有
buy_index = stockdata[stockdata.Close > stockdata.N1_High].index
stockdata.loc[buy_index,'signal'] = 1
#收盘价超过N2最低价 卖出股票持有
sell_index = stockdata[stockdata.Close < stockdata.N2_Low].index
stockdata.loc[sell_index,'signal'] = 0
"""
#现处理方式
for kl_index, today in stockdata.iterrows():
    if today.Close > today.N1_High:
        stockdata.loc[kl_index, 'signal'] = 1
    elif today.Close < today.N2_Low:
        stockdata.loc[kl_index, 'signal'] = 0
    else:
        pass
```

在此基础上融入ATR止盈止损的判断，当N日突破策略给出买入信号后，将买入价存储于变量`buy_price`之中，而后与每个交易日的收盘价对比，无论是到达止盈价格还是止损价格都会触发卖出信号，当卖出后将变量`buy_price`清零，如下所示：

```
buy_price = 0
for kl_index, today in stockdata.iterrows():
    if today.Close > today.N1_High:
        print('N_day_buy', kl_index, today.Close)
        buy_price = today.Close
        stockdata.loc[kl_index, 'signal'] = 1
    # 到达收盘价少于买入价后触发卖出
    elif (buy_price != 0) and (buy_price > today.Close) and ((buy_price - today.Close) > n_loss * today.atr14):
        print('stop_loss_n', kl_index, today.Close, buy_price)
        stockdata.loc[kl_index, 'signal'] = 0
        buy_price = 0
    # 到达收盘价多于买入价后触发卖出
    elif (buy_price != 0) and (buy_price < today.Close) and ((today.Close - buy_price) > n_win * today.atr14):
        print('stop_win_n', kl_index, today.Close, buy_price)
        stockdata.loc[kl_index, 'signal'] = 0
        buy_price = 0
    elif today.Close < today.N2_Low:
        print('N_day_sell', kl_index, today.Close, buy_price)
        stockdata.loc[kl_index, 'signal'] = 0
        buy_price = 0
    else:
        pass

```

整改后的`GetStockDatApi()`接口，可融合N日突破择时策略及ATR止盈止损策略，完整代码如下所示：

```
#股票数据获取及处理接口
def GetStockDatApi(stockName=None,stockTimeS=None,stockTimeE=None, N1=15, N2=5, n_loss=0.8, n_win=2):

    stockdata = web.DataReader(stockName, "yahoo", stockTimeS, stockTimeE)

    stockdata['N1_High'] = stockdata.High.rolling(window=N1).max()#计算最近N1个交易日最高价
    stockdata['N1_High'] = stockdata.N1_High.shift(1)
    expan_max = stockdata.Close.expanding().max()
    stockdata['N1_High'].fillna(value=expan_max,inplace=True)#目前出现过的最大值填充前N1个nan

    stockdata['N2_Low'] = stockdata.Low.rolling(window=N2).min()#计算最近N2个交易日最低价
    stockdata['N2_Low'] = stockdata.N2_Low.shift(1)
    expan_min = stockdata.Close.expanding().min()
    stockdata['N2_Low'].fillna(value=expan_min,inplace=True)#目前出现过的最小值填充前N2个nan

    stockdata['atr14'] = talib.ATR(stockdata.High.values, stockdata.Low.values, stockdata.Close.values, timeperiod=14)  # 计算ATR14
    buy_price = 0
    for kl_index, today in stockdata.iterrows():
        if today.Close > today.N1_High:
            print('N_day_buy', kl_index, today.Close)
            buy_price = today.Close
            stockdata.loc[kl_index, 'signal'] = 1
        #到达收盘价少于买入价后触发卖出
        elif (buy_price != 0) and (buy_price > today.Close) and ((buy_price - today.Close) > n_loss * today.atr14):
            print('stop_loss_n', kl_index, today.Close, buy_price)
            stockdata.loc[kl_index, 'signal'] = 0
            buy_price = 0
        #到达收盘价多于买入价后触发卖出
        elif (buy_price != 0) and (buy_price < today.Close) and ((today.Close - buy_price) > n_win * today.atr14):
            print('stop_win_n', kl_index, today.Close, buy_price)
            stockdata.loc[kl_index, 'signal'] = 0
            buy_price = 0
        elif today.Close < today.N2_Low:
            print('N_day_sell', kl_index, today.Close, buy_price)
            stockdata.loc[kl_index, 'signal'] = 0
            buy_price = 0
        else:
            pass

    stockdata['signal'].fillna(method = 'ffill',inplace = True)
    stockdata['signal'] = stockdata.signal.shift(1)
    stockdata['signal'].fillna(method = 'bfill',inplace = True)

    return stockdata
    
```

对比融入ATR止盈止损策略前后的执行效果，此处获取华胜天成2018-1-1至2019-4-1的交易数据，以提供更多的回测数据。

未采用ATR止盈止损策略的买卖信号明细如下所示：

- buy 2018-03-02 00:00:00 —— sell 2018-03-15 00:00:00

- buy 2018-04-25 00:00:00 —— sell 2018-05-04 00:00:00

- buy 2018-11-07 00:00:00 —— sell 2018-11-26 00:00:0

- buy 2019-01-17 00:00:00 —— sell 2019-01-22 00:00:00

- buy 2019-02-19 00:00:00

可知总共有5笔交易，最后一次买入虽然有波动，但始终未触及N日突破策略的卖出阈值。对应的买卖区间及可视化效果，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/14/16a1b6305c42e85f~tplv-t2oaga2asx-image.image)

采用ATR止盈止损策略的买卖信号明细如下所示：

- buy 2018-03-02 00:00:00 —— sell 2018-03-15 00:00:00

- buy 2018-04-25 00:00:00 —— sell 2018-04-27 00:00:00（stop\_loss\_n 2018-04-26 00:00:00 12.59000015258789 13.1899995803833）

- buy 2018-11-07 00:00:00 —— sell 2018-11-23 00:00:00（stop\_loss\_n 2018-11-22 00:00:00 6.650000095367432 6.900000095367432）

- buy 2019-01-17 00:00:00 —— sell 2019-01-18 00:00:00（stop\_loss\_n 2019-01-17 00:00:00 6.409999847412109 6.769999980926514）

- buy 2019-02-19 00:00:00 —— sell 2019-03-01 00:00:00（stop\_loss\_n 2019-02-28 00:00:00 7.010000228881836 7.269999980926514）

- buy 2019-03-06 00:00:00 —— sell 2019-03-15 00:00:00（stop\_loss\_n 2019-03-14 00:00:00 8.119999885559082 8.729999542236328）

- buy 2019-03-26 00:00:00 —— sell 2019-03-27 00:00:00（stop\_loss\_n 2019-03-26 00:00:00 9.600000381469727 10.670000076293945）

可知总共触发了6笔止损交易，止损阈值参数设置过低所带来的问题即是在波动较剧烈的行情中容易被洗出局。对应的买卖区间及可视化效果，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/14/16a1b63fa2366d8d~tplv-t2oaga2asx-image.image)

## 总结

本小节将ATR止盈止损策略作为风险管理因子与N日突破择时策略相融合，将多个策略作为因子作用在一起判断走势，可以从不同的维度保证交易的可靠性，从而避免策略的不确定性所带来的交易上的风险。

最后，给大家留一道思考题：

在股票交易中止损是非常重要的风险管理措施，那么大家平时买入股票时都有设置止损点吗？设置止损点的标准又是什么呢？

欢迎大家在留言区留言，我们一起讨论。
    