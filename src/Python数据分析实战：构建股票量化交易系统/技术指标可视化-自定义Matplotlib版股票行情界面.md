
# 技术指标可视化-自定义Matplotlib版股票行情界面
---

# 自定义Matplotlib版股票行情界面

## 前言

股票分析一般分为基本面分析和技术指标分析，对于中小股民来说，技术指标分析相比于基本面分析似乎更靠谱些。因为以中小股民的能力是很难解读政策层面实质性是利好还是利空，利好多大，利空多大，也无法了解上市公司内部运营的实质状况，发布的公告对股价的影响有多大。而股价的走势则涵盖了所有的盘面信息，当主力做多，表明有资金进场，此时一切指标都会走好，我们只需要跟着主力进场就行，当资金离场时一切指标都会走坏，我们也只需要跟着主力离场即可。

可见观察技术指标的变化十分重要。我们通常会使用行情软件来观察股票的技术指标，从而判断未来股价的变动方向。

在前面的小节中我们已经学习了Matplotlib库的基础使用方法，本小节就以实现股票行情界面为场景介绍K线、均线、成交量、MACD、KDJ这几个常用技术指标的原理及可视化方法。

## K线图可视化

技术指标本质上还是依据股票收盘价、开盘价、最高价、最低价、成交量等原始的交易数据，以特定的算法计算而生成的，因此获取到股票交易数据仍然是最基础的一步， 此处使用前面小节所介绍的股票交易数据接口来获取浙大网新2018-6-1至2019-1-1半年的股票交易数据，作为本小节的例程数据，如下所示：

```
df_stockload = web.DataReader("600797.SS", "yahoo", datetime.datetime(2018,1,1), datetime.datetime(2019,1,1))
print(df_stockload.info())
"""
<class 'pandas.core.frame.DataFrame'>
DatetimeIndex: 244 entries, 2018-01-02 to 2019-01-02
Data columns (total 6 columns):
High         244 non-null float64
Low          244 non-null float64
Open         244 non-null float64
Close        244 non-null float64
Volume       244 non-null float64
Adj Close    244 non-null float64
dtypes: float64(6)
memory usage: 13.3 KB
None
"""
```

K线记录着开盘价、最高价、最低价、收盘价这四个数据，早期`matplotlib.finance`的`Candlestick()`方法可直接绘制K线图，不过从matplotlib 2.2.0版本开始，`matplotlib.finance`已经从matplotlib中剥离，需要单独安装`mpl_finance`库。使用时需要导入`mpl_finance`库，如下所示：

```
import mpl_finance as mpf #替换 import matplotlib.finance as mpf
```

`mpl_finance`中常用的绘制K线方法的接口有`candlestick_ochl()`、`candlestick2_ochl()`，我们先介绍`candlestick_ochl()`的使用方法。

`candlestick2_ochl(ax, opens, closes, highs, lows, width=4, colorup='k', colordown='r', alpha=0.75)`方法的主要参数如下：ax 是绘制图形的 axis 对象；opens、closes、highs、 lows分别是开盘价、收盘价、最高价、最低价的序列值，顾名思义，ochl即是opens、closes、highs、lows数据排列顺序的缩写，同理ohlc表示数据排列顺序为opens、highs、lows、closes。

接下来我们使用matplotlib的对象式绘图方式来绘制K线图。首先调用`figure()`方法创建一个名称为fig的图表对象，其中`figsize`参数设置图像的长和宽（英寸），`dpi`参数设置图像的分辨率，`facecolor`参数设置绘图区域的背景颜色，如下所示：

```
fig = plt.figure(figsize=(8,6), dpi=100,facecolor="white")#创建fig对象
```

通过figure对象的`subplots_adjust()`方法可以调整边框距离，其中Left、bottom、right、top参数控制字图subplot距离figure左边、底部、右边、顶部的百分比，wspace和hspace参数分别控制控制subplot之间的水平和垂直间距，如下所示：

```
fig.subplots_adjust(left=0.09,bottom=0.20, right=0.94,top=0.90, wspace=0.2, hspace=0)
```

然后在figure对象中创建一个名为graph\_KAV的Axes对象，在该对象上绘制K线图，如下所示：

```
graph_KAV = fig.add_subplot(1, 1, 1)  # 创建子图

mpf.candlestick2_ochl(graph_KAV, df_stockload.Open, df_stockload.Close, df_stockload.High, df_stockload.Low, width=0.5,colorup='r', colordown='g')  # 绘制K线走势
```

另一种绘制K线方法`candlestick_ochl(ax, quotes, width=0.2, colorup='r', colordown='g', alpha=1.0)`的主要参数如下：ax 是绘制图形的 axis 对象；quotes是所有的股票数据序列，其中每一行都是按照开盘价、收盘价、最高价、最低价的顺序排列。使用`candlestick_ochl()`方法时需要额外用`zip`方法生成指定要求的股票数据列表，如下所示：

```
ohlc = list(zip(np.arange(0,len(df_stockload.index)),df_stockload.Open,df_stockload.Close,df_stockload.High,df_stockload.Low))#使用zip方法生成数据列表 

mpf.candlestick_ochl(graph_KAV, ohlc, width=0.2, colorup='r', colordown='g', alpha=1.0)#绘制K线走势
```

剩下的工作就是对图表显示效果的设置，此处提供`candlestick2_ochl()`方法绘制K线图的完整例程代码，该部分代码合并在移动平均线可视化介绍中。

## 移动平均线可视化

移动平均线是技术分析中使用十分普遍的一项指标，“平均”是指单位周期内的平均收盘价格，“移动”是指将新的交易日收盘价纳入计算周期的同时，剔除最早的交易日收盘价。

移动平均线体现了在该段周期内持股人的平均持股成本。在股价上涨时移动平均线会随着股价保持上行，反应了该周期内持股人的平均持股成本上升了，反之亦然。一般来说，在上涨过程中由于主力筹码较多可视是为主力的成本线，在上涨末期时由于主力把筹码派发给了散户，可视为散户的成本线。

在股票行情软件上移动平均线是叠加在K线图上显示的，那么此处就在绘制完成的K线图上增加M20、M30、M60三种移动平均线的显示。

Panads中早期提供了`pd.rolling_mean()`接口，现在更改为`df.rolling().mean()`这种方式，使用方法仍然只需提供收盘价和移动平均时间窗口大小即可，对使用者来说是非常方便快捷的，如下所示：

```
#绘制移动平均线图 
df_stockload['Ma20'] = df_stockload.Close.rolling(window=20).mean()#pd.rolling_mean(df_stockload.Close,window=20)
df_stockload['Ma30'] = df_stockload.Close.rolling(window=30).mean()#pd.rolling_mean(df_stockload.Close,window=30)
df_stockload['Ma60'] = df_stockload.Close.rolling(window=60).mean()#pd.rolling_mean(df_stockload.Close,window=60)
```

在graph\_KAV子图上调用`plot()`方法绘制移动平均线，`plot()`原理上是将一系列的点连接起来形成一条线，因此x轴和y轴的数据需要以序列方式对应起来，如下所示：

```
graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma20'],'black', label='M20',lw=1.0)
graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma30'],'green',label='M30', lw=1.0)
graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma60'],'blue',label='M60', lw=1.0)
```

以下为graph\_KAV子图上绘制K线和移动平均线的完整例程代码，如下所示：

```
#绘制K线图+移动平均线
import numpy as np
import matplotlib.pyplot as plt
import pandas_datareader.data as web
import datetime
import mpl_finance as mpf #替换 import matplotlib.finance as mpf

plt.rcParams['font.sans-serif']=['SimHei'] #用来正常显示中文标签
plt.rcParams['axes.unicode_minus']=False #用来正常显示负号

df_stockload = web.DataReader("600797.SS", "yahoo", datetime.datetime(2018,6,1), datetime.datetime(2019,1,1))
print(df_stockload.info())

fig = plt.figure(figsize=(8,6), dpi=100,facecolor="white")#创建fig对象
fig.subplots_adjust(left=0.09,bottom=0.20, right=0.94,top=0.90, wspace=0.2, hspace=0)
graph_KAV = fig.add_subplot(1, 1, 1)  # 创建子图

#绘制K线图
mpf.candlestick2_ochl(graph_KAV, df_stockload.Open, df_stockload.Close, df_stockload.High, df_stockload.Low, width=0.5,
                      colorup='r', colordown='g')  # 绘制K线走势

#绘制移动平均线图
df_stockload['Ma20'] = df_stockload.Close.rolling(window=20).mean()#pd.rolling_mean(df_stockload.Close,window=20)
df_stockload['Ma30'] = df_stockload.Close.rolling(window=30).mean()#pd.rolling_mean(df_stockload.Close,window=30)
df_stockload['Ma60'] = df_stockload.Close.rolling(window=60).mean()#pd.rolling_mean(df_stockload.Close,window=60)

graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma20'],'black', label='M20',lw=1.0)
graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma30'],'green',label='M30', lw=1.0)
graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma60'],'blue',label='M60', lw=1.0)

graph_KAV.legend(loc='best')
graph_KAV.set_title(u"600797 浙大网新-日K线")
graph_KAV.set_xlabel("日期")
graph_KAV.set_ylabel(u"价格")
graph_KAV.set_xlim(0, len(df_stockload.index))  # 设置一下x轴的范围
graph_KAV.set_xticks(range(0, len(df_stockload.index), 15))  # X轴刻度设定 每15天标一个日期
graph_KAV.set_xticklabels([df_stockload.index.strftime('%Y-%m-%d')[index] for index in graph_KAV.get_xticks()])  # 标签设置为日期

# X-轴每个ticker标签都向右倾斜45度
for label in graph_KAV.xaxis.get_ticklabels():
    label.set_rotation(45)
    label.set_fontsize(10)  # 设置标签字体
plt.show()

```

K线图结合移动平均线的显示效果如下所示，需要说明的是Ma20、Ma30、Ma60分别在第20个、30个、60个交易日时才能计算得到第一个周期内的收盘价平均值，所以有一段移动平均线为无效值。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/1/169d8f2122b2a7e2~tplv-t2oaga2asx-image.image)

## 成交量可视化

成交量指的是当天交易日内股票交易成功的数量，以手为单位（1手等于100股）。在技术分析时通常会将价格和成交量相结合来判断主力的动向，比如在主力拉高股价出货时，往往当日的股价会出现“过山车”的走势，同时成交量会出现近期的“天量”。

由于K线和成交量是两种类别的技术指标，我们不仅要将它们分别在两个子图上进行显示，而且需要协调两个子图的位置和比例。此处导入matplotlib的`gridspec`模块创建子图，`GridSpec`可自定义子图的位置和调整子图行和列的相对高度和宽度，如下所示：

```
import matplotlib.gridspec as gridspec
```

此处使用`GridSpec()`方法创建2行1列排布的子图，K线子图和成交量子图的宽度相同，通过设置`height_ratios`参数将K线子图和成交量子图高度比例设置为3.5:1，由于成交量与日K线的子图之间存在空隙，可将`hspace`参数设置为0去除子图之间存在空隙，如下所示：

```
gs = gridspec.GridSpec(2, 1, left=0.06, bottom=0.15, right=0.96, top=0.96, wspace=None, hspace=0, height_ratios=[3.5,1])
graph_KAV = fig.add_subplot(gs[0,:])
graph_VOL = fig.add_subplot(gs[1,:])
```

由于我们获取到的股票原始交易数据中已经包含了成交量信息，因此通过`plt.bar()`方法就可以直接绘制出成交量柱状图。此处我们在graph\_VOL子图上绘制成交量，条件判断当收盘价高于开盘价时显示红色，反之则显示绿色，如下所示：

```
graph_VOL.bar(np.arange(0, len(df_stockload.index)), df_stockload.Volume,color=['g' if df_stockload.Open[x] > df_stockload.Close[x] else 'r' for x in range(0,len(df_stockload.index))])
```

接下来需要对两幅子图的`title`、`xticklabels`等图表的显示参数进行相应的调整，完整例程代码，如下所示：

```
#绘制K线图+移动平均线+成交量
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec#分割子图
import pandas_datareader.data as web
import datetime
import mpl_finance as mpf #替换 import matplotlib.finance as mpf

plt.rcParams['font.sans-serif']=['SimHei'] #用来正常显示中文标签
plt.rcParams['axes.unicode_minus']=False #用来正常显示负号

df_stockload = web.DataReader("600797.SS", "yahoo", datetime.datetime(2018,6,1), datetime.datetime(2019,1,1))
print(df_stockload.info())

fig = plt.figure(figsize=(8,6), dpi=100,facecolor="white")#创建fig对象

gs = gridspec.GridSpec(2, 1, left=0.06, bottom=0.15, right=0.96, top=0.96, wspace=None, hspace=0, height_ratios=[3.5,1])
graph_KAV = fig.add_subplot(gs[0,:])
graph_VOL = fig.add_subplot(gs[1,:])

#绘制K线图
mpf.candlestick2_ochl(graph_KAV, df_stockload.Open, df_stockload.Close, df_stockload.High, df_stockload.Low, width=0.5,colorup='r', colordown='g')  # 绘制K线走势

#绘制移动平均线图
df_stockload['Ma20'] = df_stockload.Close.rolling(window=20).mean()#pd.rolling_mean(df_stockload.Close,window=20)
df_stockload['Ma30'] = df_stockload.Close.rolling(window=30).mean()#pd.rolling_mean(df_stockload.Close,window=30)
df_stockload['Ma60'] = df_stockload.Close.rolling(window=60).mean()#pd.rolling_mean(df_stockload.Close,window=60)

graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma20'],'black', label='M20',lw=1.0)
graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma30'],'green',label='M30', lw=1.0)
graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma60'],'blue',label='M60', lw=1.0)

graph_KAV.legend(loc='best')
graph_KAV.set_title(u"600797 浙大网新-日K线")
graph_KAV.set_ylabel(u"价格")
graph_KAV.set_xlim(0, len(df_stockload.index))  # 设置一下x轴的范围
graph_KAV.set_xticks(range(0, len(df_stockload.index), 15))  # X轴刻度设定 每15天标一个日期

#绘制成交量图
graph_VOL.bar(np.arange(0, len(df_stockload.index)), df_stockload.Volume,color=['g' if df_stockload.Open[x] > df_stockload.Close[x] else 'r' for x in range(0,len(df_stockload.index))])
graph_VOL.set_ylabel(u"成交量")
graph_VOL.set_xlabel("日期")
graph_VOL.set_xlim(0,len(df_stockload.index)) #设置一下x轴的范围
graph_VOL.set_xticks(range(0,len(df_stockload.index),15))#X轴刻度设定 每15天标一个日期
graph_VOL.set_xticklabels([df_stockload.index.strftime('%Y-%m-%d')[index] for index in graph_VOL.get_xticks()])#标签设置为日期

#X-轴每个ticker标签都向右倾斜45度
for label in graph_KAV.xaxis.get_ticklabels():
   label.set_visible(False)#隐藏标注 避免重叠

for label in graph_VOL.xaxis.get_ticklabels():
   label.set_rotation(45)
   label.set_fontsize(10)#设置标签字体

plt.show()
```

将K线图、移动平均线、成交量三个技术指标相结合成为股票行情显示界面，显示效果如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/1/169d8f38cc738a71~tplv-t2oaga2asx-image.image)

## MACD可视化

MACD称为异同移动平均线，属于趋势类指标，由快速线DIF、慢速线DEA组成。在股票行情显示界面中，DIF和DEA是以零轴为中心轴，上下交叉移动的两条线，红绿柱状图BAR为辅助显示的指标。MACD计算方法如下所示：

DIF（差离值） = EMA（12日收盘价移动平均线）- EMA（26日收盘价移动平均线）

DEA（差离平均值） = DIF的9日移动平均线

BAR（柱状值） = 2 ×（DIF-DEA）

MACD本质上以短期移动平均线与长期移动平均线之间的聚合与分离状况（±DIF值）来对行情趋势判断，DEA则是对DIF值进行N日移动平滑用于辅助观察变化。理论上，在持续加速的涨势中，短期EMA线在长期EMA线之上，其间的正离差值\(+DIF\)会越来越大，DIF距离DEA也会变大，BAR柱状线也会扩展；反之，在加速跌势中负离差值\(-DIF\)会越来越小。当行情即将反转时，DIF与DEA距离会逐渐减小，也就是指标出现背离的情形，对应于股价可体现为第二轮上涨/下跌虽然超越了第一轮股价的高点/低点，但第二轮运行的动能比第一轮降低了，预示着趋势已经是强弩之末的态势了。

此处我们推荐`TA-Lib`库来实现MACD指标。`TA-Lib`是一套被业界广泛应用的开源技术分析库，在国外很常用，各种大型的开源量化框架都会内置这个库。它的好处是可以让使用者专注于策略的设计，而不用重复造轮子一样花时间实现技术指标。使用时需要导入`TA-Lib`库，如下所示：

```
import talib
```

TA-Lib中`MACD`方法可以根据输入的收盘价直接计算得到DIF、DEA、BAR三组数据，只需要1行代码就轻松搞定。Ta-lib参数输入为array in、array out，因此收盘价为numpy.ndarray类型的序列，返回值也为一个序列，如下所示：

```
macd_dif, macd_dea, macd_bar = talib.MACD(df_stockload['Close'].values, fastperiod=12, slowperiod=26, signalperiod=9)
```

此处仍然通过gridspec模块新增一个显示MACD指标的子图graph\_MACD，如此一来，总共有三个子图分别显示K线与移动平均线的结合、成交量、MACD，如下所示：

```
gs = gridspec.GridSpec(3, 1, left=0.05, bottom=0.15, right=0.96, top=0.96, wspace=None, hspace=0, height_ratios=[3.5,1,1])
graph_KAV = fig.add_subplot(gs[0,:])
graph_VOL = fig.add_subplot(gs[1,:])
graph_MACD = fig.add_subplot(gs[2,:])
```

接下来我们在graph\_MACD子图上使用`plot()`方法对DIF、DEA指标进行绘制，如下所示：

```
graph_MACD.plot(np.arange(0, len(df_stockload.index)), macd_dif, 'red', label='macd dif')  # dif    
graph_MACD.plot(np.arange(0, len(df_stockload.index)), macd_dea, 'blue', label='macd dea')  # dea 
```

对于柱状图BAR的绘制，可先使用`numpy.where()`方法分别实现红柱和绿柱，当macd\_bar>0时，保持数值，否则为0，得到红柱数组，同理当macd\_bar\<0时，得到绿柱数组。然后使用bar\(\)方法绘制柱状图，如下所示：

```
# 绘制BAR>0 柱状图
bar_red = np.where(macd_bar > 0, 2 * macd_bar, 0)
# 绘制BAR<0 柱状图
bar_green = np.where(macd_bar < 0, 2 * macd_bar, 0)
graph_MACD.bar(np.arange(0, len(df_stockload.index)), bar_red, facecolor='red')
graph_MACD.bar(np.arange(0, len(df_stockload.index)), bar_green, facecolor='green')
```

关于graph\_MACD子图绘制MACD指标的完整例程代码，合并在KDJ可视化介绍中。

## KDJ可视化

KDJ是最为常用的震荡类指标。在介绍KDJ指标之前，先介绍下拉里·威廉斯（Larry Williams）提出的威廉指标（Williams \%R，简称W\%R）。威廉指标的计算首先选定一个特定的时间跨度（比如14日），然后找出这一特定区间的最高价和最低价，构成一个价格变化区间，而后分析这一时间跨度最后一个时间点的收盘价与期间最高价和最低价的相对位置，以此来衡量市场的超买或超卖现象。

KDJ指标的最早雏形是由芝加哥期货交易商George Lane提出的KD指标，该指标又被称为随机震荡指标（Stochastic Oscillator Indicator）。从最基础的交易思想上看，KD指标的分析思想与威廉指标类似，均使用特定时间跨度中的最后收盘价与该时间跨度内的最高价和最低价的相对位置来推测市场的超买和超卖情况。与威廉指标不同的是，随机震荡指标在收盘价与最高价和最低价的相对位置的比值上，又融合了移动平均的思想，用更多的信息来捕捉市场的超买、超卖现象。KDJ指标则是在随机震荡指标K线和D线的基础上增加了一条J线，进一步提高了随机震荡指标对市场买卖信号捕捉的准确度。

关于KDJ指标的计算，第一步计算未成熟随机值RSV（Raw Stochastic Value），计算公式如下所示：

RSV =（第n天的收盘价-最近n天内的最低价）÷（最近n天内的最高价-最近n天内的最低价）\*100\%

其中，n为时间跨度，RSV取值范围在0\~100之间，取值越大说明收盘价在价格区间中的相对位置越高，市场可能出现超买的现象，反之亦然。

计算得到RSV值后，K值由前一日的K值和当期RSV值经过一定权重调整后相加得到，计算公式如下：

K值 = 2/3 \* 前一日K值 + 1/3 当日RSV值

D值由前一日的D值和当期K值经过一定权重调整后相加得到，计算公式如下：

D值 = 2/3 \* 前一日D值 + 1/3 当日K值

J值是KD的辅助指标，进一步反映了K指标和D指标的乘离程度，计算公式如下：

J值 = 3 \* K值 \- 2 \* D值

我们使用TA-Lib中`STOCH`（Stochastic Oscillator Slow）方法计算得到K、D值，再由K、D值计算得到J值。

STOCH\(\)方法与以上介绍的KDJ指标计算公式略有不同，但计算思想是一致的，它总共有FASTK，FASTD，SLOWK，SLOWD4种随机震荡线，计算过程如下：

FASTK（Kperiod）= （第n天的收盘价-最近n天内的最低价）÷（最近n天内的最高价-最近n天内的最低价）\*100\%

FASTD（FastDperiod）= MA Smoothed FASTK over FastDperiod

SLOWK（SlowKperiod）= MA smoothed FASTK over SlowKperiod

SLOWD（SlowDperiod）= MA smoothed SLOWK over SlowDperiod

`STOCH()`方法返回SLOWK和SLOWD，使用时需要确定公式中的参数，此处fastk\_period=9，slowk\_period=3，slowd\_period=3，如下所示：

```
df_stockload['K'], df_stockload['D'] = talib.STOCH(df_stockload.High.values, df_stockload.Low.values, df_stockload.Close.values,\
                                       fastk_period=9, slowk_period=3, slowk_matype=0, slowd_period=3, slowd_matype=0)

df_stockload['J'] = 3 * df_stockload['K'] - 2 * df_stockload['D']
```

此处仍然通过gridspec模块新增一个显示KDJ指标的子图graph\_KDJ，如此一来，总共有四个子图分别显示K线与移动平均线的结合、成交量、MACD、KDJ，如下所示：

```
gs = gridspec.GridSpec(4, 1, left=0.08, bottom=0.15, right=0.99, top=0.96, wspace=None, hspace=0, height_ratios=[3.5,1,1,1])
graph_KAV = fig.add_subplot(gs[0,:])
graph_VOL = fig.add_subplot(gs[1,:])
graph_MACD = fig.add_subplot(gs[2,:])
graph_KDJ = fig.add_subplot(gs[3,:])
```

接下来我们在graph\_KDJ子图上使用plot\(\)方法对K、D、J指标进行绘制，如下所示：

```
graph_KDJ.plot(np.arange(0, len(df_stockload.index)), df_stockload['K'], 'blue', label='K')  # K
graph_KDJ.plot(np.arange(0, len(df_stockload.index)), df_stockload['D'], 'g--', label='D')  # D
graph_KDJ.plot(np.arange(0, len(df_stockload.index)), df_stockload['J'], 'r-', label='J')  # J
```

关于多子图显示K线图、移动平均线、成交量、MACD、KDJ技术指标的完整例程代码，如下所示：

```
#绘制K线图+移动平均线+成交量+MACD+KDJ
import datetime
import talib
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec#分割子图
import mpl_finance as mpf #替换 import matplotlib.finance as mpf
import pandas_datareader.data as web

plt.rcParams['font.sans-serif']=['SimHei'] #用来正常显示中文标签
plt.rcParams['axes.unicode_minus']=False #用来正常显示负号

df_stockload = web.DataReader("600797.SS", "yahoo", datetime.datetime(2018,6,1), datetime.datetime(2019,1,1))
print(df_stockload.info())

fig = plt.figure(figsize=(8,6), dpi=100,facecolor="white")#创建fig对象

gs = gridspec.GridSpec(4, 1, left=0.08, bottom=0.15, right=0.99, top=0.96, wspace=None, hspace=0, height_ratios=[3.5,1,1,1])
graph_KAV = fig.add_subplot(gs[0,:])
graph_VOL = fig.add_subplot(gs[1,:])
graph_MACD = fig.add_subplot(gs[2,:])
graph_KDJ = fig.add_subplot(gs[3,:])

#绘制K线图
mpf.candlestick2_ochl(graph_KAV, df_stockload.Open, df_stockload.Close, df_stockload.High, df_stockload.Low, width=0.5,
                      colorup='r', colordown='g')  # 绘制K线走势

#绘制移动平均线图
df_stockload['Ma20'] = df_stockload.Close.rolling(window=20).mean()#pd.rolling_mean(df_stockload.Close,window=20)
df_stockload['Ma30'] = df_stockload.Close.rolling(window=30).mean()#pd.rolling_mean(df_stockload.Close,window=30)
df_stockload['Ma60'] = df_stockload.Close.rolling(window=60).mean()#pd.rolling_mean(df_stockload.Close,window=60)

graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma20'],'black', label='M20',lw=1.0)
graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma30'],'green',label='M30', lw=1.0)
graph_KAV.plot(np.arange(0, len(df_stockload.index)), df_stockload['Ma60'],'blue',label='M60', lw=1.0)

graph_KAV.legend(loc='best')
graph_KAV.set_title(u"600797 浙大网新-日K线")
graph_KAV.set_ylabel(u"价格")
graph_KAV.set_xlim(0, len(df_stockload.index))  # 设置一下x轴的范围

#绘制成交量图
graph_VOL.bar(np.arange(0, len(df_stockload.index)), df_stockload.Volume,color=['g' if df_stockload.Open[x] > df_stockload.Close[x] else 'r' for x in range(0,len(df_stockload.index))])
graph_VOL.set_ylabel(u"成交量")
graph_VOL.set_xlim(0,len(df_stockload.index)) #设置一下x轴的范围
graph_VOL.set_xticks(range(0,len(df_stockload.index),15))#X轴刻度设定 每15天标一个日期

#绘制MACD
macd_dif, macd_dea, macd_bar = talib.MACD(df_stockload['Close'].values, fastperiod=12, slowperiod=26, signalperiod=9)
graph_MACD.plot(np.arange(0, len(df_stockload.index)), macd_dif, 'red', label='macd dif')  # dif
graph_MACD.plot(np.arange(0, len(df_stockload.index)), macd_dea, 'blue', label='macd dea')  # dea

bar_red = np.where(macd_bar > 0, 2 * macd_bar, 0)# 绘制BAR>0 柱状图
bar_green = np.where(macd_bar < 0, 2 * macd_bar, 0)# 绘制BAR<0 柱状图
graph_MACD.bar(np.arange(0, len(df_stockload.index)), bar_red, facecolor='red')
graph_MACD.bar(np.arange(0, len(df_stockload.index)), bar_green, facecolor='green')

graph_MACD.legend(loc='best',shadow=True, fontsize ='10')
graph_MACD.set_ylabel(u"MACD")
graph_MACD.set_xlim(0,len(df_stockload.index)) #设置一下x轴的范围
graph_MACD.set_xticks(range(0,len(df_stockload.index),15))#X轴刻度设定 每15天标一个日期

#绘制KDJ
df_stockload['K'], df_stockload['D'] = talib.STOCH(df_stockload.High.values, df_stockload.Low.values, df_stockload.Close.values,\
                                       fastk_period=9, slowk_period=3, slowk_matype=0, slowd_period=3, slowd_matype=0)

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

for label in graph_VOL.xaxis.get_ticklabels():
    label.set_visible(False)

for label in graph_MACD.xaxis.get_ticklabels():
    label.set_visible(False)

for label in graph_KDJ.xaxis.get_ticklabels():
    label.set_rotation(45)
    label.set_fontsize(10)  # 设置标签字体
plt.show()
```

将技术指标相结合即成为股票行情显示界面，显示效果如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/1/169d8f682bf987fc~tplv-t2oaga2asx-image.image)

## 总结

本小节介绍了在绘制股票行情显示界面的过程中，介绍了常用技术指标的实现方法，我们使用较为“朴素、直接”的编写代码方式为了让同学们直观了解实现一个技术指标的全过程。

本小节推荐的TA-Lib库中涵盖了大多数技术指标的实现方法，总共大约200多个技术指标，除了可以计算常见的技术指标外，另外一个特色就是可以识别K线形态。同学们可以在 <http://tadoc.org/>这个网站继续深入地去了解TA-Lib库，感受它的强大和便捷。

最后，给大家留一道思考题：

任何指标都不会是完美的，那么趋势指标和震荡指标的存在的缺陷分别是什么呢？我们又该如何去弥补它们的缺陷？

欢迎大家在留言区留言，我们一起讨论。
    