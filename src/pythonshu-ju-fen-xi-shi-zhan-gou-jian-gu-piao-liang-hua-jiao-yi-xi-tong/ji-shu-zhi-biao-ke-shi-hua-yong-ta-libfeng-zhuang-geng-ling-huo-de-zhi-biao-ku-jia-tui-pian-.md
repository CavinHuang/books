
# 技术指标可视化-用TA-Lib封装更灵活的指标库【加推篇】
---

# 用TA-Lib封装更灵活的指标库

## 前言

TA-Lib库的强大我们已经有目共睹了，对此可以基于TA-Lib库建立起基础的指标库。

TA-Lib库的函数分为10个功能组，如Overlap Studies\(重叠研究\)、Momentum Indicators\(动量指标\)、Volume Indicators\(交易量指标\)、Cycle Indicators\(周期指标\)、Price Transform\(价格变换\)、Volatility Indicators\(波动率指标\)、Pattern Recognition\(模式识别\)、Statistic Functions\(统计函数\)、Math Transform\(数学变换\)、Math Operators\(数学运算\)，我们有代表性地选取几个指标接口去实现。

比如动量指标中包括如下指标：

- ADX - Average Directional Movement Index
- ADXR - Average Directional Movement Index Rating
- CMO - Chande Momentum Oscillator
- MACD - Moving Average Convergence/Divergence
- STOCH - Stochastic
- ……

## 封装过程

首先创建一个py文件“IndicatorsLib.py”，文件中创建`QtYx_Talib_Indictors`类（名称自己随便取），用于集合所有TA-Lib实现的技术指标。

实现代码如下所示：

```
class QtYx_Talib_Indictors():

    # Momentum Indicator Functions
    @staticmethod
    def ADX_DF(DataFrame, N=14):
        # ADX - Average Directional Movement Index
        res = talib.ADX(DataFrame.high.values, DataFrame.low.values, DataFrame.close.values, N)
        return pd.DataFrame({'ADX': res}, index=DataFrame.index)

    @staticmethod
    def ADXR_DF(DataFrame, N=14):
        # ADXR - Average Directional Movement Index Rating
        res = talib.ADXR(DataFrame.high.values, DataFrame.low.values, DataFrame.close.values, N)
        return pd.DataFrame({'ADXR': res}, index=DataFrame.index)

    @staticmethod
    def CMO(Series, timeperiod=14):
        # CMO - Chande Momentum Oscillator
        res = talib.CMO(Series.values, timeperiod)
        return pd.Series(res, index=Series.index)

    @staticmethod
    def MACD_SER(Series, fastperiod=12, fastmatype=0, slowperiod=26, slowmatype=0, signalperiod=9, signalmatype=0):
        # MACD - Moving Average Convergence/Divergence
        macd_dif, macd_dea, macd_bar = talib.MACD(
            Series.values, fastperiod, slowperiod, signalperiod)
        return pd.Series(macd_dif, index=Series.index), pd.Series(macd_dea, index=Series.index), pd.Series(macd_bar, index=Series.index)

    @staticmethod
    def STOCH_DF(DataFrame, fastkperiod=9, slowkperiod=3, slowkmatype=0, slowdperiod=3, slowdmatype=0):
        # STOCH - Stochastic
        K, D = talib.STOCH(DataFrame.high.values, DataFrame.low.values, DataFrame.close.values, \
                           fastkperiod, slowkperiod, slowkmatype, slowdperiod, slowdmatype)
        J = 3 * K - 2 * D
        return pd.Series(K, index=DataFrame.index), pd.Series(D, index=DataFrame.index), pd.Series(J, index=DataFrame.index)


```

这里要注意的是全部接口都用\@staticmethod静态方法修饰，这样一来可以当成函数去使用这些接口。

另外有些指标只需要提供收盘价序列即可，有些则包括最高价、最低价等其他数据，对于前者我们以Series格式输入基础行情数据，后者则以DataFrame格式输入行情行情数据。

把各个指标集合之后，我们用字典格式重新封装指标，即字典的键为指标名称，字典的值为函数，如下所示：

```
indictors_dict = {"MA":QtYx_Base_Indictors.MA_DF,
                  "ADX":QtYx_Talib_Indictors.ADX_DF,
                  "BBANDS":QtYx_Talib_Indictors.BBANDS_SER,
                  "ADX":QtYx_Talib_Indictors.ADX_DF,
                  "AD":QtYx_Talib_Indictors.AD_DF,
                  "ADOSC":QtYx_Talib_Indictors.ADOSC_DF,
                  "MACD": QtYx_Talib_Indictors.MACD_SER,
                  "STOCH": QtYx_Talib_Indictors.STOCH_DF
                  }
```

接下来我们计算下BBANDS和MA这两个指标，BBANDS指标返回的是三个独立的series序列，而MA返回的则是DataFrame数据，如下所示：

```
print(indictors_dict["BBANDS"](df_stockDat.close, timeperiod=5, nbdevup=2, nbdevdn=2, matype=0))
"""
trade_date
2018-01-02          NaN
2018-01-03          NaN
2018-01-04          NaN
2018-01-05          NaN
2018-01-08    13.780169
2018-01-09    13.467012
2018-01-10    13.566040
2018-01-11    13.627829
2018-01-12    13.752504
2018-01-15    14.273103
2018-01-16    14.482287
2018-01-17    14.642702
2018-01-18    14.923935
2018-01-19    14.971701
"""
print(indictors_dict["MA"](df_stockDat, 120, 60, 20))
"""
               MA120       MA60     MA20
trade_date                              
2018-01-02       NaN        NaN      NaN
2018-01-29       NaN        NaN  13.8955
2018-01-30       NaN        NaN  13.8930
2018-01-31       NaN        NaN  13.9290
2018-02-01       NaN        NaN  13.9680
2018-02-02       NaN        NaN  14.0055
2018-02-05       NaN        NaN  14.0850
...              ...        ...      ...
2018-11-22  9.886917  10.454833  10.7490
2018-11-23  9.888917  10.470833  10.7060
2018-11-26  9.890250  10.476000  10.6855
"""
```

集合了基础指标之后，我们可以改进代码里的绘制技术指标的函数，把之前MA、MACD、KDJ的实现方法更新为调取TA-Lib的指标库的方式，如下所示：

```
 # 处理MACD
    stockDat['macd_dif'],stockDat['macd_dea'], stockDat['macd_bar'] = indictors_dict['MACD'](stockPro.close)

    # 处理KDJ
    stockDat['K'], stockDat['D'], stockDat['J'] = indictors_dict['STOCH'](stockPro)

```

## 总结

虽然TA-Lib库的函数名称已经十分简洁了，但是和同花顺、通达信、文华财经等的公式语言相比还是有待提高，这里提供了一种封装的方法，可以提高调用的便利性。其实结合TA-Lib库和Numpy库封装成公式语言也是可行的，这样会更简洁。
    