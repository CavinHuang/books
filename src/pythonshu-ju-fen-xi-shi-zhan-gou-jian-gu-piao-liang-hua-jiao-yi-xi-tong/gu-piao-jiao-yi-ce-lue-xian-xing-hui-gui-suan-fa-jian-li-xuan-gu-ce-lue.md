
# 股票交易策略-线性回归算法建立选股策略
---

# 股票交易策略：线性回归算法建立选股策略

## 前言

股票交易需要做的有三件事：选股、择时和仓位管理。选出一只好股票是成功交易的第一步，不过从A股市场几千只股票中选出一只潜力股本身即是非常困难的事情，特别对于大部分中小股民来说，对行业的发展趋势、公司的财务报表等信息的解读能力薄弱，从基本面去选股更加难上加难。

本小节从技术分析层面给大家介绍一种选股的思路，即通过线性回归算法拟合出股价的走势角度，再进一步比较角度值筛选出涨势更好的股票。

## 线性回归的实现

在介绍线性回归之前，我们先介绍下何为“回归现象”。“回归”一词是由英国著名统计学家Francils Galton所提出，他在研究祖先与后代身高之间的关系时发现，身材较高的父母，他们的孩子也较高，但这些孩子的平均身高并没有他们父母的平均身高要高；身材较矮的父母，他们的孩子也较矮，但这些孩子的平均身高却比他们父母的平均身高要高。Galton把这种后代的身高向中间值靠近的趋势称为“回归现象”。

所谓线性回归，归纳地说就是把一组样本点近似的用一条直线来表示，使这些点能够整体分布在一条直线附近，这条直线称为回归直线。计算得到回归直线也就得到了自变量xi与因变量yi两组变量之间的对应关系（i=1,2,3,...,n），从而可以从已知样本点的变化趋势去推测未知样本点的变化。

如何计算回归直线呢？假设这条回归直线方程为y=bx+a，将样本的数据点\(xi,yi\)与直线上横坐标xi的点之间的距离来刻画点\(xi,yi\)到直线的远近，即：

![|y_{i}-(bx_{i}+a)|(i=1,2,3,...,n)](https://juejin.cn/equation?tex=%7Cy_%7Bi%7D-(bx_%7Bi%7D%2Ba)%7C(i%3D1%2C2%2C3%2C...%2Cn))

由于绝对值计算不方便，实际应用中使用公式为：

![Q=(y1-bx1-a)^{2}+(y2-bx2-a)^{2}+(y3-bx3+a)^{2}...(yn-bxn+a)^{2}](https://juejin.cn/equation?tex=Q%3D(y1-bx1-a)%5E%7B2%7D%2B(y2-bx2-a)%5E%7B2%7D%2B(y3-bx3%2Ba)%5E%7B2%7D...(yn-bxn%2Ba)%5E%7B2%7D)

通过最小二乘法\(method of least square\)计算直线斜率b和截距a值使得Q最小，即样本数据的点到回归直线的距离的平方和最小，这样就得到了回归直线方程式。

将“回归现象”应用于股票交易的理论依据可描述为：价格将围绕价值上下波动，即股价上涨/下跌只是暂时的，价格会回复到一个相对正常的水平。接下来我们用线性回归的方法将浙大网新的收盘价用一条直线来表示。

此处使用前面小节所介绍的股票交易数据接口来获取浙大网新2019-10-1至2019-4-1半年的交易数据，作为本小节的例程数据，如下所示：

```
df_stockload = web.DataReader("600797.SS", "yahoo", datetime.datetime(2018,10,1), datetime.datetime(2019,4,1))
print(df_stockload.info())
"""
<class 'pandas.core.frame.DataFrame'>
DatetimeIndex: 120 entries, 2018-10-08 to 2019-04-02
Data columns (total 6 columns):
High         120 non-null float64
Low          120 non-null float64
Open         120 non-null float64
Close        120 non-null float64
Volume       120 non-null int64
Adj Close    120 non-null float64
dtypes: float64(5), int64(1)
memory usage: 6.6 KB
None
"""
```

关于线性回归的实现，此处推荐使用`Statsmodels`库。Statsmodels是Python中一个强大的统计分析包，包含了回归分析、时间序列分析、假设检验等等的功能。使用时需要导入Statsmodels库，如下所示：

```
import statsmodels.api as sm
```

statsmodels提供的`OLS()`方法用于实现多项式拟合计算，OLS（ordinary least squares）即为普通最小二乘法的缩写，此处回归模型是最基本的一元模型：

![Y=β0X0+β1X1](https://juejin.cn/equation?tex=Y%3D%CE%B20X0%2B%CE%B21X1)

OLS\(\)方法确切地说是`statsmodels.regression.linear_model`中的一个方法，因此可从`statsmodels`中导入`regression`模块，如下所示：

```
from statsmodels import regression
```

此处`OLS()`方法使用`endog`、`exog`这两个输入参数，`endog`为回归中的响应变量（也称因变量y），`exog`为回归中的回归变量（也称自变量x），两者的数据类型都为array。需要注意的是`OLS()`未假设回归模型有常数项，需要通过`sm.add_constant()`在自变量x的左侧加上一列常量1。

```
x = sm.add_constant(x)  # 添加常数列1
```

`statsmodels.regression.linear_model.OLS`输出结果是一个类，并没有进行任何运算，需要在`OLS` 的模型之上调用拟合函数`fit()`执行得到β0、β1，即回归直线的截距和斜率，如下所示：

```
model = regression.linear_model.OLS(y_arr, x).fit()  # 使用OLS做拟合
rad = model.params[1]  # y = kx + b :params[1] = k
intercept = model.params[0]  ##y = kx + b :params[0] = b
```

接下来使用matplotlib库绘制收盘价曲线和回归直线，完整代码如下所示：

```
import pandas_datareader.data as web
import pandas as pd
import numpy as np
import datetime
import statsmodels.api as sm
from statsmodels import regression
import matplotlib.pyplot as plt

plt.rcParams['font.sans-serif'] = ['SimHei']  # 用来正常显示中文标签
plt.rcParams['axes.unicode_minus'] = False  # 用来正常显示负号

df_stockload = web.DataReader("600797.SS", "yahoo", datetime.datetime(2018,10,1), datetime.datetime(2019,4,1))
df_stockload.fillna(method='bfill', inplace=True)  # 后一个数据填充NAN1
print(df_stockload.info())

y_arr = df_stockload.Close.values
x_arr = np.arange(0, len(y_arr))
x_b_arr = sm.add_constant(x_arr)  # 添加常数列1
model = regression.linear_model.OLS(y_arr, x_b_arr).fit()  # 使用OLS做拟合
rad = model.params[1]  # y = kx + b :params[1] = k
intercept = model.params[0]  # y = kx + b :params[0] = b
reg_y_fit = x_arr * rad + intercept
#matplotlib 绘制
plt.plot(x_arr, y_arr)
plt.plot(x_arr, reg_y_fit, 'r')
plt.title(u"浙大网新" + " y = "+ str(rad)+" * x +" + str(intercept))
plt.legend(['close', 'linear'], loc='best')

plt.show()
```

收盘价曲线和回归直线显示效果，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/8/169fd40af44bc5fa~tplv-t2oaga2asx-image.image)

## 计算走势角度

将股票的收盘价以线性回归方式拟合为回归直线后，可以进一步得到回归直线的角度值，该角度值反应了股票当前的涨跌幅度，预示着未来的趋势。接下来遍历A股市场所有股票的收盘价格，并且拟合计算得到回归直线的角度。

使用`Tushare pro`版本的`stock_basic()`接口获取上市的所有股票基础信息数据，包括股票代码、名称、上市日期、退市日期等，此处可从中得到上市的所有股票的代码，如下所示：

```
import tushare as ts
token='......'
#初始化pro接口
pro = ts.pro_api(token)
#查询当前所有正常上市交易的股票列表
data = pro.stock_basic(exchange='', list_status='L', fields='ts_code,symbol,name,area,industry,list_date')
print(data.head())
"""
     ts_code  symbol  name area industry list_date
0  000001.SZ  000001  平安银行   深圳       银行  19910403
1  000002.SZ  000002   万科A   深圳     全国地产  19910129
2  000004.SZ  000004  国农科技   深圳     生物制药  19910114
3  000005.SZ  000005  世纪星源   深圳     环境保护  19901210
4  000006.SZ  000006  深振业A   深圳     区域地产  19920427
"""
```

将股票代码`ts_code`列转换为list格式数据，后续以所存储的股票代码去下载股票交易数据，如下所示：

```
print(list(data.ts_code)[:20])#只打印20个股票代码
“”“
['000001.SZ', '000002.SZ', '000004.SZ', '000005.SZ', '000006.SZ', '000007.SZ', '000008.SZ', '000009.SZ', '000010.SZ', '000011.SZ', '000012.SZ', '000014.SZ', '000016.SZ', '000017.SZ', '000018.SZ', '000019.SZ', '000020.SZ', '000021.SZ', '000023.SZ', '000025.SZ']
”“”
```

Tushare pro版本的`daily()`接口可获取股票行情数据，此处使用该接口遍历A股市场所有股票的收盘价格，输入参数包括股票代码`ts_code`、开始日期`start_date`、结束日期`end_date`。由于`daily()`接口返回的DataFrame格式数据的行索引为序号，而不是交易日期，并且数据按日期的排列顺序是从20190401到20181001，与线性回归的数据排列顺序不符，因此我们需要调整下返回的数据格式，如下所示：

```
code_data = pro.daily(ts_code=code, start_date=start, end_date=end)
code_data.fillna(method='bfill', inplace=True) # 后一个数据填充NAN1
code_data.index = pd.to_datetime(code_data.trade_date)
code_data.sort_index(inplace=True)
code_data.drop(axis=1, columns='trade_date',inplace=True)
```

结合线性回归的实现方法，将遍历获取的A股市场所有股票的收盘价格拟合为弧度值后，再使用`np.rad2deg()`方法转换为角度值，从角度值的大小侧面去评估股价的走势。完整代码如下所示：

```
def stocks_data_to_deg(stocklist,start,end):
    deg_data={}
    for code in stocklist:
        code_data = pro.daily(ts_code=code, start_date=start, end_date=end)
        code_data.fillna(method='bfill', inplace=True) # 后一个数据填充NAN1
        code_data.index = pd.to_datetime(code_data.trade_date)
        code_data.sort_index(inplace=True)
        code_data.drop(axis=1, columns='trade_date',inplace=True)
        print(code_data.head())
        print(code_data.info())
        try:
            y_arr = code_data.close.values
            x_arr = np.arange(0, len(y_arr))
            x_b_arr = sm.add_constant(x_arr)  # 添加常数列1
            model = regression.linear_model.OLS(y_arr, x_b_arr).fit()  # 使用OLS做拟合
            rad = model.params[1]  # y = kx + b :params[1] = k
            deg_data[code] = np.rad2deg(rad)  # 弧度转换为角度
        except:
            pass
    return deg_data

all_data = stocks_data_to_deg(list(data.ts_code),'20181001','20190401')
print(all_data)
#截取部分数据
"""
{'000001.SZ': 1.0748324272579852, '000002.SZ': 3.39547471012723, '000004.SZ': 1.5199149426182201, '000005.SZ': 0.48470466772102005, '000006.SZ': 0.6827509040282749, '000007.SZ': -0.2520083986815976, '000008.SZ': 0.2210732091541942, '000009.SZ': 1.0666473158989738, '000010.SZ': -0.5253119599667251, '000011.SZ': 0.8463307217664522, '000012.SZ': 0.6486313122116967, '000014.SZ': 1.163285490089819, '000016.SZ': 0.7006226825688889, '000017.SZ': 0.4274007275784671, '000018.SZ': 0.3153512046323943, '000019.SZ': 0.17441713367513342, '000020.SZ': 0.9886561800484499, '000021.SZ': 1.6740796902283464, '000023.SZ': 2.61835428690094, '000025.SZ': 2.5748214089900228}
"""
print(all_data['000002.SZ'])
#3.39547471012723
```

## 总结

本小节介绍了使用线性回归对走势的角度进行量化，然后以此辅助选股的一种策略。这类方法比较适合长期趋势的研判，比如在牛市阶段，质地好的股票总是上升的角度更陡，熊市阶段下降的角度更缓，而质地差的股票正好相反。

最后，给大家留一道思考题：

由于线性回归作用于股票的整个时间段，比如前后两段完全相反的周期会彼此作用，最终影响拟合的角度值，因此选择合适的时间段非常重要，那么大家有什么好的方法来避免这个缺陷呢？

欢迎大家在留言区留言，我们一起讨论。
    