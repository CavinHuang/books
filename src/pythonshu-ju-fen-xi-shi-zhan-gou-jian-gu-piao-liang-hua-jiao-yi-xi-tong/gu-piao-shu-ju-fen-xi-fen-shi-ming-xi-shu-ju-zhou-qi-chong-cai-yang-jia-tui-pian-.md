
# 股票数据分析-分时明细数据周期重采样【加推篇】
---

# 加推篇！分时明细数据周期重采样

## 前言

行情软件的各种周期和统计的数据都是通过明细数据跨周期转换而形成的，比如分钟K线、小时K线、当日成交量、成交额、外盘、内盘等各种指标。

本节我们就来介绍下如果通过周期重采样方式将分时明细数据转换为各种周期数据。

## resample\(\)实现周期重采样

Pandas中提供了resample\(\)方法对时间序列进行重采样，此处将获取到的tick数据合成一分钟数据。关键代码如下所示：

```
df_min_ohlc = df_tick.price.resample('1min', closed='left', label='left').ohlc()
"""
                      open   high    low  close
time                                           
2020-02-01 09:25:00  12.78  12.78  12.78  12.78
2020-02-01 09:26:00    NaN    NaN    NaN    NaN
2020-02-01 09:27:00    NaN    NaN    NaN    NaN
2020-02-01 09:28:00    NaN    NaN    NaN    NaN
2020-02-01 09:29:00    NaN    NaN    NaN    NaN
2020-02-01 09:30:00  12.76  12.76  12.61  12.66
2020-02-01 09:31:00  12.66  12.66  12.64  12.64
2020-02-01 09:32:00  12.64  12.64  12.59  12.59
2020-02-01 09:33:00  12.63  12.68  12.61  12.67
2020-02-01 09:34:00  12.68  12.70  12.68  12.69
"""
```

而后我们将df\_min\_ohlc数据进行清洗，主要为处理非交易时间段的NaN数据，并将所有列都为NaN的行删除，如下所示：

```
df_min_ohlc = df_min_ohlc.dropna(axis=0,how='all') # NAN值删除 所有值都为缺失值时才删除该行
print(df_min_ohlc.head())

最终得到的数据如下所示：
"""
                      open   high    low  close
time                                           
2020-02-01 09:25:00  12.78  12.78  12.78  12.78
2020-02-01 09:30:00  12.76  12.76  12.61  12.66
2020-02-01 09:31:00  12.66  12.66  12.64  12.64
2020-02-01 09:32:00  12.64  12.64  12.59  12.59
2020-02-01 09:33:00  12.63  12.68  12.61  12.67
"""

```

接下来就可以用小册子《股票数据可视化：自定义Matplotlib版股票行情界面》的代码绘制1min K线图，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/2/17003f06386fb274~tplv-t2oaga2asx-image.image)

完整代码如下所示：

```
    series_data = {'Open': df_min_ohlc.open, 'Close': df_min_ohlc.close, 'High': df_min_ohlc.high,
                   'Low': df_min_ohlc.low}
    df_stockload = pd.DataFrame(series_data)

    fig = plt.figure(figsize=(12, 6), dpi=100, facecolor="white")  # 创建fig对象

    gs = gridspec.GridSpec(3, 1, left=0.08, bottom=0.15, right=0.99, top=0.96, wspace=None, hspace=0,
                           height_ratios=[3.5, 1, 1])
    graph_KAV = fig.add_subplot(gs[0, :])
    graph_MACD = fig.add_subplot(gs[1, :])
    graph_KDJ = fig.add_subplot(gs[2, :])

    # 绘制K线图
    mpf.candlestick2_ochl(graph_KAV, df_stockload.Open, df_stockload.Close, df_stockload.High, df_stockload.Low,
                          width=0.5,
                          colorup='r', colordown='g')  # 绘制K线走势

    # 绘制移动平均线图
    df_stockload['Ma20'] = df_stockload.Close.rolling(window=20).mean()  # pd.rolling_mean(df_stockload.Close,window=20)
    df_stockload['Ma30'] = df_stockload.Close.rolling(window=30).mean()  # pd.rolling_mean(df_stockload.Close,window=30)
    df_stockload['Ma60'] = df_stockload.Close.rolling(window=60).mean()  # pd.rolling_mean(df_stockload.Close,window=60)

    graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma20'], 'black', label='M20', lw=1.0)
    graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma30'], 'green', label='M30', lw=1.0)
    graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma60'], 'blue', label='M60', lw=1.0)

    graph_KAV.legend(loc='best')
    graph_KAV.set_title(u"002372 伟星新材-分钟K线")
    graph_KAV.set_ylabel(u"价格")
    graph_KAV.set_xlim(0, len(df_stockload.index))  # 设置一下x轴的范围

    # 绘制MACD
    macd_dif, macd_dea, macd_bar = talib.MACD(df_stockload['Close'].values, fastperiod=12, slowperiod=26,
                                              signalperiod=9)
    graph_MACD.plot(np.arange(0, len(df_stockload.index)), macd_dif, 'red', label='macd dif')  # dif
    graph_MACD.plot(np.arange(0, len(df_stockload.index)), macd_dea, 'blue', label='macd dea')  # dea

    bar_red = np.where(macd_bar > 0, 2 * macd_bar, 0)  # 绘制BAR>0 柱状图
    bar_green = np.where(macd_bar < 0, 2 * macd_bar, 0)  # 绘制BAR<0 柱状图
    graph_MACD.bar(np.arange(0, len(df_stockload.index)), bar_red, facecolor='red')
    graph_MACD.bar(np.arange(0, len(df_stockload.index)), bar_green, facecolor='green')

    graph_MACD.legend(loc='best', shadow=True, fontsize='10')
    graph_MACD.set_ylabel(u"MACD")
    graph_MACD.set_xlim(0, len(df_stockload.index))  # 设置一下x轴的范围
    graph_MACD.set_xticks(range(0, len(df_stockload.index), 15))  # X轴刻度设定 每15天标一个日期

    # 绘制KDJ
    df_stockload['K'], df_stockload['D'] = talib.STOCH(df_stockload.High.values, df_stockload.Low.values,
                                                       df_stockload.Close.values, \
                                                       fastk_period=9, slowk_period=3, slowk_matype=0, slowd_period=3,
                                                       slowd_matype=0)

    df_stockload['J'] = 3 * df_stockload['K'] - 2 * df_stockload['D']

    graph_KDJ.plot(np.arange(0, len(df_stockload.index)), df_stockload['K'], 'blue', label='K')  # K
    graph_KDJ.plot(np.arange(0, len(df_stockload.index)), df_stockload['D'], 'g--', label='D')  # D
    graph_KDJ.plot(np.arange(0, len(df_stockload.index)), df_stockload['J'], 'r-', label='J')  # J
    graph_KDJ.legend(loc='best', shadow=True, fontsize='10')

    graph_KDJ.set_ylabel(u"KDJ")
    graph_KDJ.set_xlabel("日期")
    graph_KDJ.set_xlim(0, len(df_stockload.index))  # 设置一下x轴的范围
    graph_KDJ.set_xticks(range(0, len(df_stockload.index), 15))  # X轴刻度设定 每15天标一个日期
    graph_KDJ.set_xticklabels(
        [df_stockload.index.strftime('%Y-%m-%d')[index] for index in graph_KDJ.get_xticks()])  # 标签设置为日期

    # X-轴每个ticker标签都向右倾斜45度
    for label in graph_KAV.xaxis.get_ticklabels():
        label.set_visible(False)

    for label in graph_MACD.xaxis.get_ticklabels():
        label.set_visible(False)

    for label in graph_KDJ.xaxis.get_ticklabels():
        label.set_rotation(45)
        label.set_fontsize(10)  # 设置标签字体

    plt.show()

```

## 总结

本小节我们将分时明细数据转换为各个不同周期下的数据，这有助于我们更灵活地去提取和挖掘我们所需的行情信息。
    