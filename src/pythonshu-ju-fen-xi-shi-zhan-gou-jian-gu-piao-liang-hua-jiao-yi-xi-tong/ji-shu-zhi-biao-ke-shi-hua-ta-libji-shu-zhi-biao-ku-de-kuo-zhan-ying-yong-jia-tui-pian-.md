
# 技术指标可视化-TA-Lib技术指标库的扩展应用【加推篇】
---

# TA-Lib技术指标库的扩展应用

## 前言

在小册的中介绍了使用TA-Lib库实现MACD指标，当前TA-Lib库的使用文档多为英文版的官网内容，缺乏完整的中文介绍文档，本节我们对TA-Lib库的一些使用频繁比较典型的函数展开一些介绍。

## 安装介绍

TA-lib库的安装相比于 pandas，numpy这些第三方库要麻烦不少，主要原因是仅仅一条“pip install ta-lib”是不够的，因为TA-Lib是一个涉及到底层系统的库，比如提示了'ta\_libc.h'文件不存在，如下所示：

> talib/\_ta\_lib.c\(524\): fatal error C1083: Cannot open include file: 'ta\_libc.h': No such file or directory

官方文档：<https://mrjbq7.github.io/ta-lib/> 详细介绍了安装的方法，这里再强调下Windows下安装的注意事项：

- Windows32位和64位的安装有所不同，需要安装 Microsoft Visual C++……手动编译

- 官网下载ta-lib-0.4.0-msvc.zip  解压缩到到C盘的ta-lib目录下，终端（Anaconda Prompt、PyCharm Terminal、cmd）执行“pip install ta-lib”即可

- 假如ta-lib-0.4.0-msvc.zip下载不到，可以试试前往[https://www.lfd.uci.edu/\~gohlke/pythonlibs/]()根据自己系统和Python版本选择非官方的windows安装包（二进制程序）

## 概述功能组

在TA-Lib官方文档中提到了TA-Lib总共分为10个功能组，如下所示：

- Overlap Studies\(重叠研究\)。

- Momentum Indicators\(动量指标\)。动量指标是一种利用动力学原理，研究股价的趋势与反转现象的技术指标。动量指标建立在价格与供求关系的基础上，认为股价的涨跌幅随着时间的推移逐渐变小，股价变化的速度和能量慢慢减缓后，行情可能发生反转。

- Volume Indicators\(交易量指标\)。

- Cycle Indicators\(周期指标\)。

- Price Transform\(价格变换\)。主要用于计算开盘价、收盘价、最高价、最低价之间的均值。

- Volatility Indicators\(波动率指标\)。主要指的是真实波幅类指标。波动率指标可用于衡量价格的波动情况，辅助判断趋势改变的可能性，市场的交易氛围，也可以利用波动性指标来帮助止损止盈。 \*Pattern Recognition\(K线形态的识别\)。TA-lib不仅可以计算常见的技术指标，另外一个特色就是可以识别K线形态。在官网中称为Pattern Recognition Functions（形态识别功能），指的是K线形态。

- Statistic Functions\(统计函数\)。TA-Lib提供了常用的基础统计学函数，基于时间序列移动窗口进行计算。

- Math Transform\(数学变换\)。TA-Lib提供了三角函数（正余弦、正余切、双曲）、取整、对数、平方根等数学转换函数，均是基于时间序列的向量变换。

- Math Operators\(数学运算\)。TA-Lib提供向量（数组）的加减乘除、在某个周期内求和、最大最小值及其索引等计算函数。TA-Lib的向量计算功能类似于Pandas的moving window（移动窗口），得到的是一个新的序列（不是某个值）。

每个功能组包含的特定函数接口，可通过如下接口查看：

```
print(talib.get_functions())
print(talib.get_function_groups())
```

## 以Overlap Studies为例

Overlap Studies（重叠研究）组主要包括如下指标的计算：

- BBANDS：布林带（Bollinger Bands）

- DEMA：双移动平均线（Double Exponential Moving Average）

- EMA：指数平均线（Exponential Moving Average）

- HT\_TRENDLINE：希尔伯特瞬时变化（Hilbert Transform \- Instantaneous Trendline）

- KAMA：考夫曼自适应移动均线（Kaufman Adaptive Moving Average）

- MA：移动平均线（Moving average）

- MAMA：MESA 自适应移动均线（MESA Adaptive Moving Average）

- MAVP：变周期的移动均线（Moving average with variable period）

- MIDPOINT：阶段中点（MidPoint over period）

- MIDPRICE：阶段中点价格（Midpoint Price over period）

- SAR：抛物线指标（Parabolic SAR）

- SAREXT：抛物线扩展指标（Parabolic SAR – Extended）

- SMA：简单移动平均线（Simple Moving Average）

- T3：三重指数移动平均线（Triple Exponential Moving Average） \(T3\)

- TEMA：三重指数移动平均线（Triple Exponential Moving Average）

- TRIMA：三角移动均线（Triangular Moving Average）

- WMA：加权移动均线（Weighted Moving Average）

由于Ta-lib库封装的函数名称十分简洁，无须过多解释就能完全看懂函数的含义。这里着重介绍下通用的talib.MA\(\)函数：

```
talib.MA(close,timeperiod=30,matype=0)
```

比较特别的参数是matype：matype为指标类型，用数字代表均线计算方式，0=SMA, 1=EMA, 2=WMA, 3=DEMA, 4=TEMA, 5=TRIMA, 6=KAMA, 7=MAMA, 8=T3 \(Default=SMA\)。matype所指定类型的移动平均线也有单独的调用函数。

接下来还是“show your code”来的更直接了当：

```
type_period = [{'SMA':5},{'EMA':10},{'WMA':20},{'DEMA':30},{'TEMA':40},{'TRIMA':60},{'KAMA':120},{'MAMA':140},{'T3':160}]
df_Matype = pd.DataFrame(stock.Close)

for i in range(len(type_period)):
    df_Matype[list(type_period[i].keys())[0]] = talib.MA(df_Matype.Close,
                                                         timeperiod=list(type_period[i].values())[0],
                                                         matype=i)

df_Matype.loc['2017-01-03':,['SMA','EMA','WMA','TEMA','KAMA','MAMA']].plot(figsize=(16,8),
subplots = True,
layout=(3,2),#行列数
sharex = True,#共享x
sharey = False,#共享y
colormap = 'viridis',#每条线不同颜色
fontsize = 7)
plt.show()

```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/1/171cf458e56857cf~tplv-t2oaga2asx-image.image)

## 总结

TA-lib这个库很常用，各种大型的开源量化框架，都会内置这个库，所以我们可以尽量使用这个技术分析库，不仅包含了大部分主流的技术指标，不用再重复造轮子，而且计算速度快。
    