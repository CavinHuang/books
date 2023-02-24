
# 股票交易策略-蒙特卡洛算法最优化策略参数
---

# 股票交易策略：蒙特卡洛算法最优化策略参数

## 前言

在股票技术面分析过程中，交易者倾向于围绕各种技术指标的动态来制定交易策略，比如MACD、移动平均线指标等等。其实所有的技术指标都是依据股票收盘价、开盘价、最高价、最低价、成交量等原始的交易数据通过某种算法计算而来的。

大家是否注意到，在多数的股票行情软件中默认的均线参数普遍是5日、10日、20日、30日、60日、120日……而非6日、11日、21日之类，并且在各种介绍股票交易的“秘籍”中也清一色的参照这些默认的参数制定交易策略。但是这些默认值真的就是最优化的参数值了吗？本小节就让我们来认识下蒙特卡洛算法，以及如何使用该方法来寻找技术指标的最优化的参数。

## 枚举法的思想

在介绍蒙特卡洛法之前，我们先回顾下小学课程中接触到的枚举法。枚举法也称为列举法、穷举法，属于暴力策略的具体体现，它的基本思想顾名思义就是逐一列举所有可能的情况，并且一个不漏地进行检验，从中找出最佳答案。

接下来我们以前面小节所提到的单均线突破策略为例，演示下枚举法的应用。单均线突破策略指的是：当昨日收盘价高出过去N日平均价则今天开盘即买入股票；若昨日收盘价低于过去N日平均价，那么今天开盘卖出股票。因此N是我们需要选取的参数，此处以枚举法寻找出20至60日之间的最优均线参数N。

创建`QuantAverBreak`类实现单均线突破策略，该类包含`init()`和`run_factor_plot()`方法，如下所示：

```
class QuantAverBreak:

    def __init__(self):
    	pass
    
    def run_factor_plot(self):
        pass
```

在`init()`方法中初始化以下四个变量，此处设置初始资金为10万元，一旦信号触发则全仓买入股票，买入后资金转为市值，全仓卖出股票后市值转为资金，如下所示：

```
def __init__(self):
    self.skip_days = 0 #持股/持币状态
    self.cash_hold = 100000  # 初始资金
    self.posit_num = 0  # 持股数目
    self.market_total = 0  # 持股市值
```

在`run_factor_plot()`方法中实现单均线突破信号的判断，以及回测获得该策略的最终资金获利情况，如下所示：

```
def run_factor_plot(self, stock_df, N):

    stock_df['Ma_n'] = stock_df.Close.rolling(window=N).mean()  # 增加N移动平均线
    list_diff = np.sign(stock_df.Close - stock_df.Ma_n)
    stock_df['signal'] = np.sign(list_diff - list_diff.shift(1))

    for kl_index, today in stock_df.iterrows():
        # 买入/卖出执行代码
        if today.signal > 0 and self.skip_days == 0:  # 买入
            start = stock_df.index.get_loc(kl_index)
            self.skip_days = -1
            self.posit_num = int(self.cash_hold / today.Close)
            self.cash_hold = 0

        elif today.signal < 0 and self.skip_days == -1:  # 卖出 避免未买先卖
            end = stock_df.index.get_loc(kl_index)
            self.skip_days = 0
            self.cash_hold = int(self.posit_num * today.Close)
            self.market_total = 0

        if self.skip_days == -1:# 持股
            self.market_total = int(self.posit_num * today.Close)
            stock_df.loc[kl_index, 'total'] = self.market_total
        else:# 空仓
            stock_df.loc[kl_index, 'total'] = self.cash_hold

    return stock_df['total'][-1]
```

`run_factor_plot()`方法中大部分代码已在《收益与风险维度度量策略效果》一节中进行讲解，此处需要额外介绍下单均线突破信号的判断。

将收盘价值减去单均线值，并使用`np.sign()`取差值符号，当收盘价在Ma\_n上方时差值为正，收盘价在Ma\_n下方时差值为负，如下所示：

```
list_diff = np.sign(stock_df.Close - stock_df.Ma_n)
```

比如相减后得到的序列为\[+1，+1，+1，+1，+1，-1，-1，-1，-1，-1\]，使用shift\(\)函数右移1列后为\[NA，+1，+1，+1，+1，+1，-1，-1，-1，-1\]（缺少的值会填充NaN），将两个序列再次相减后得到\[NA，0，0，0，0，-2，0，0，0，0\]，再对相减后序列取符号，通过遍历符合值判断，当符号为负时为收盘价向下跌破Ma\_n，当符号为正时收盘价向上突破Ma\_n，如下所示：

```
list_signal = np.sign(list_diff-list_diff.shift(1))
```

遍历移动平均线参数20至60，将参数作为移动平均线的窗口值传入策略中，最终返回回测后的最佳收益及对应的均线参数N，如下所示：

```
stock = web.DataReader("600410.SS", "yahoo", datetime.datetime(2018, 1, 1), datetime.datetime(2019, 1, 1))

ma_list = []
profit_list = []
for ma in range(20, 60):
    examp_trade = QuantAverBreak()
    ma_list.append(ma)
    profit_list.append(examp_trade.run_factor_plot(stock, ma))

profit_max=max(profit_list)
print(profit_list.index(max(profit_list)))
ma_max=ma_list[profit_list.index(max(profit_list))]
```

剩下的工作就是可视化呈现通过枚举法寻找到的最佳均线参数，如下所示：

```
plt.bar(ma_list, profit_list)
plt.annotate('ma='+str(ma_max)+'\n'+str(profit_max),\
             xy=(ma_max,profit_max),xytext=(ma_max-5, profit_max-10),arrowprops=dict(facecolor='yellow',shrink=0.1),\
             horizontalalignment='left',verticalalignment='top')

# 设置坐标标签字体大小
plt.xlabel('均线参数')
plt.ylabel('资金收益')
# 设置坐标轴的取值范围
plt.xlim(min(ma_list)-1, max(ma_list)+1)
plt.ylim(min(profit_list)*0.99, max(profit_list)*1.01)
# 设置x坐标轴刻度
plt.xticks(np.arange(min(ma_list), max(ma_list)+1, 1))
# 设置图例字体大小
plt.legend(['profit_list'], loc='best')
plt.title("均线最优参数")
plt.show()
```

由下图的可视化结果中可知，资金收益最高时为108641元，所对应的移动平均线的最优参数是27日，我们可将资金收益最高的参数作为最优化的参数。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/21/16a3fd2da85b4e75~tplv-t2oaga2asx-image.image)

## 蒙特卡洛的思想

蒙特卡洛（Monte Carlo）法确切地说是一类随机模拟算法的统称，提出者是大名鼎鼎的计算机之父冯·诺伊曼，因为在赌博中体现了许多随机模拟的算法，所以他借用驰名世界的赌城—摩纳哥的蒙特卡洛来命名这种方法。

枚举法把所有可能的情况一个不漏地进行检验，得到的结果肯定是正确的，但是为了换取答案的全面性却牺牲了很多无用的时间，只能适用于解决对效率要求不高，样本规模小的问题。比如仅仅需要寻找出在M20至M60之间的最优均线参数。

蒙特卡洛法可视为枚举法的一种变异，它的特点是在随机采样上计算得到近似结果，随着采样的增多，得到的结果是正确结果的概率逐渐加大，但在遍历全部样本之前，无法知道目前得到的结果是不是真正的结果。不同于枚举法的应用，蒙特卡洛法为了提高搜索的效率却牺牲了答案的全面性，因此它得到的结果并不一定是最优的，但是在大规模样品的场合下可以更快地找到近似最优结果。比如计算函数f\(x\)从a到b的定积分值，更合理的是用蒙特卡罗法在有限采样内，给出一个近似的最优解。接下来就通过该实验了解下蒙特卡洛法的应用。

假设![f(x)=x^{2}](https://juejin.cn/equation?tex=f(x)%3Dx%5E%7B2%7D)，求函数f\(x\)从a到b的定积分即为求![\int_{a}^{b}x^{2} dx](https://juejin.cn/equation?tex=%5Cint_%7Ba%7D%5E%7Bb%7Dx%5E%7B2%7D%20dx)，此处将a和b设为1和2。可以用一个矩型包围在函数的积分区间上，定积分值其实就是求曲线下方的面积，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/21/16a3fd375cb08790~tplv-t2oaga2asx-image.image)

该图采用matplotlib库绘制，所对应的代码如下所示：

```
def draw_fx_square():
    plt.figure()
    x_array = np.linspace(0, 3, 50)  # 等差数
    plt.plot(x_array, np.square(x_array), lw=2, label='$y=x^2$')

    plt.plot([1, 1], [0, np.square(2)], color="r")
    plt.plot([2, 2], [0, np.square(2)], color="r")
    plt.plot([1, 2], [np.square(2), np.square(2)], color="r")
    plt.plot([1, 2], [0, 0], color="r")

    plt.xlabel("x axis")
    plt.ylabel("y axis")
    plt.legend(loc='best')
    plt.show()
```

随机地向这个矩形框里面投点，统计落在函数f\(x\)下方的点数量占所有点数量的比例为P，那么就可以据此估算出函数f\(x\)从a到b的定积分为矩形面积×P，实验步骤如下：

- 设原点为（1，0），矩形的长为1，宽为4，面积为4
- 随即取点（X，Y），使得1 \<=X\<=2并且0 \<=Y\<=4，即点在矩形内
- 通过公式 X\*X>Y判断点是否在f\(x\)下方
- 设所有点的个数为N，落在f\(x\)内的点的个数为M，则P=M/N

当该实验的次数为100次时，计算结果为2.4，代码如下所示：

```
def cal_integral_mc(n = 100):

    x_min, x_max = 1.0, 2.0
    y_min, y_max = 0.0, 4.0
    Area = 4
    m = 0

    for i in range(0, n+1):
        x = random.uniform(x_min, x_max)
        y = random.uniform(y_min, y_max)
        # x*x > y 表示该点位于曲线的下面。
        if x*x > y:
            m += 1
    #所求的积分值即为曲线下方的面积
    return Area * m / float(n)
```

实验次数为100次时所绘制点的分布，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/21/16a3fd43788d2715~tplv-t2oaga2asx-image.image)

当该实验的次数为100000次时，计算结果为2.319。该实验也称为基于蒙特卡洛的投点法，由此得出的值并不是一个精确值，而是一个近似值，当投点的数量越来越大时，这个近似值也越接近真实值。

## 蒙特卡洛参数最优化

枚举法只能适应于上述小规模遍历20至60日均线之间的参数，而对于稍复杂一些的策略模型，比如《经典择时策略融入风险管理》一节中同时涉及到N日突破策略参数`N1`、`N2`，以及风险管理的最大止盈系数`n_win`、最大止损系数`n_loss`，取N1参数样本范围为\[10,30\]，N2参数为\[5,15\]， n\_loss参数为\[0.5,1.5\]，n\_win参数为\[1.5,2.5\]，那么需要遍历的参数组合的样品空间会变得非常大。

另一方面用历史数据作量化策略的回测检验是把过去的经验作为一种参考指南，通过对过去的解读发掘出蕴藏盈利机会的重复性模式，我们并不需要一成不变的固定参数值，而是持续不断的更新接近于最优的策略参数值。因此蒙特卡洛法成为了参数最优化的首选方案。

我们分别从N1、N2、n\_win、n\_loss参数的样本空间中随机采样，而后将采样的组合参数代入策略中进行回测分析，程序框架如下所示：

```
def cal_ndayavg_mc(n = 500):

    n1_min, n1_max = 10, 30
    n2_min, n2_max = 5, 15
    win_min, win_max = 1.5, 2.5
    loss_min, loss_max = 0.5, 1.5

    ma_list = []

    for i in range(0, n+1):
        n1 = int(random.uniform(n1_min, n1_max))
        n2 = int(random.uniform(n2_min, n2_max))
        win = round(random.uniform(win_min, win_max),1)
        loss = round(random.uniform(loss_min, loss_max),1)
        ma_list.append([n1,n2,win,loss])
    	#此处添加策略代码
    return ma_list
print(cal_ndayavg_mc())
"""
[[22, 13, 1.9, 1.1], [27, 9, 1.8, 1.0], [29, 6, 1.7, 0.6], [13, 9, 2.1, 0.7], [15, 9, 2.4, 0.9], [22, 7, 2.0, 1.4], ....... [26, 12, 2.1, 1.0], [10, 8, 1.8, 0.9]]
"""
```

创建`QuantNdayBreak`类实现带有风险管理的N日突破策略，该类包含`init()`和`run_factor_plot()`方法，其中`init()`部分上文已经有相关介绍，如下所示：

```
class QuantNdayBreak:

    def __init__(self):
        # 初始化变量
        self.skip_days = 0 #持股/持币状态
        self.cash_hold = 100000  # 初始资金
        self.posit_num = 0  # 持股数目
        self.market_total = 0  # 持股市值

    def run_factor_plot(self, stock_df, N):
        pass
```

在`run_factor_plot()`方法中实现N日突破以及止盈止损信号的判断，以及回测获得该策略的最终资金获利情况。`run_factor_plot()`方法中具体实现代码与前面的小节中所介绍的相近，此处在代码结构上略微调整即可，如下所示：

```
def run_factor_plot(self, stock_obj, N1=15, N2=5, n_loss=0.8, n_win=2):

	self.stockdata = stock_obj
    self.stockdata['N1_High'] = self.stockdata.High.rolling(window=N1).max()  # 计算最近N1个交易日最高价
    self.stockdata['N1_High'] = self.stockdata.N1_High.shift(1)
    expan_max = self.stockdata.Close.expanding().max()
    self.stockdata['N1_High'].fillna(value=expan_max, inplace=True)  # 目前出现过的最大值填充前N1个nan

    self.stockdata['N2_Low'] = self.stockdata.Low.rolling(window=N2).min()  # 计算最近N2个交易日最低价
    self.stockdata['N2_Low'] = self.stockdata.N2_Low.shift(1)
    expan_min = self.stockdata.Close.expanding().min()
    self.stockdata['N2_Low'].fillna(value=expan_min, inplace=True)  # 目前出现过的最小值填充前N2个nan

    self.stockdata['atr14'] = talib.ATR(self.stockdata.High.values, self.stockdata.Low.values, self.stockdata.Close.values,
                                   timeperiod=14)  # 计算ATR14
    buy_price = 0
    for kl_index, today in self.stockdata.iterrows():
        if today.Close > today.N1_High:
            buy_price = today.Close
            self.stockdata.loc[kl_index, 'signal'] = 1
        # 到达收盘价少于买入价后触发卖出
        elif (buy_price != 0) and (buy_price > today.Close) and ((buy_price - today.Close) > n_loss * today.atr14):
            self.stockdata.loc[kl_index, 'signal'] = 0
            buy_price = 0
        # 到达收盘价多于买入价后触发卖出
        elif (buy_price != 0) and (buy_price < today.Close) and ((today.Close - buy_price) > n_win * today.atr14):
            self.stockdata.loc[kl_index, 'signal'] = 0
            buy_price = 0
        elif today.Close < today.N2_Low:
            self.stockdata.loc[kl_index, 'signal'] = 0
            buy_price = 0
        else:
            pass

    self.stockdata['signal'].fillna(method='ffill', inplace=True)
    self.stockdata['signal'] = self.stockdata.signal.shift(1)
    self.stockdata['signal'].fillna(method='bfill', inplace=True)

    for kl_index, today in self.stockdata.iterrows():
        # 买入/卖出执行代码
        if today.signal == 1 and self.skip_days == 0:  # 买入
            self.skip_days = -1
            self.posit_num = int(self.cash_hold / today.Close)  # 资金转化为股票
            self.cash_hold = 0
        elif today.signal == 0 and self.skip_days == -1:  # 卖出 避免未买先卖
            self.skip_days = 0
            self.cash_hold = int(self.posit_num * today.Close)  # 股票转化为资金
            self.market_total = 0
        if self.skip_days == -1:  # 持股
            self.market_total = int(self.posit_num * today.Close)
            self.stockdata.loc[kl_index, 'total'] = self.market_total
        else:  # 空仓
            self.stockdata.loc[kl_index, 'total'] = self.cash_hold
    return self.stockdata['total'][-1]
```

将`run_factor_plot()`方法与蒙特卡洛采样部分程序框架`cal_ndayavg_mc()`相结合，最终`ma_list`和`profit_list`列表分别存储相对应的参数和资金收益，如下所示：

```
def cal_ndayavg_mc(n = 200):

    n1_min, n1_max = 10, 30
    n2_min, n2_max = 5, 15
    win_min, win_max = 1.5, 2.5
    loss_min, loss_max = 0.5, 1.5

    ma_list = []
    profit_list = []

    df_stockload = web.DataReader("600410.SS", "yahoo", datetime.datetime(2018, 1, 1),
                                  datetime.datetime(2019, 1, 1))  # 华胜天成
    for i in range(0, n+1):
        n1 = int(random.uniform(n1_min, n1_max))
        n2 = int(random.uniform(n2_min, n2_max))
        win = round(random.uniform(win_min, win_max),1)
        loss = round(random.uniform(loss_min, loss_max),1)

        ma_list.append([n1, n2, win, loss])
        examp_trade = QuantNdayBreak()
        profit_list.append(examp_trade.run_factor_plot(df_stockload, n1, n2, loss, win))

    profit_max = max(profit_list)#maximize the profit
    ma_max = ma_list[profit_list.index(max(profit_list))]#correspond parametes
    print("maximize the profit is %s and correspond parametes are %s "%(profit_max, ma_max))
    #maximize the profit is 132576.0 and correspond parametes are [16, 10, 2.3, 1.1] 
```

我们设定随机采样200次，使用matplotlib库可视化回测的效果，从中可知资金收益最佳的参数为\[16, 10, 2.3, 1.1\]，对应的资金为132576，可视化效果图如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/21/16a3fd6c274d3f27~tplv-t2oaga2asx-image.image)

可视化部分的代码与上文枚举法中介绍的大体相同，需要注意的是此处的参数为列表格式，因此x轴的坐标需要转换为索引，可视化最佳均线参数的代码，如下所示：

```
plt.bar(np.arange(0,len(ma_list), 1), profit_list)
plt.annotate(str(ma_max)+'\n'+str(profit_max),\
             xy=(ma_list.index(ma_max),profit_max),xytext=(ma_list.index(ma_max)-10, profit_max-10),arrowprops=dict(facecolor='yellow',shrink=0.1),\
             horizontalalignment='left',verticalalignment='top')

# 设置坐标标签字体大小
plt.xlabel('均线参数')
plt.ylabel('资金收益')
# 设置坐标轴的取值范围
plt.ylim(min(profit_list)*0.99, max(profit_list)*1.01)
# 设置图例字体大小
plt.legend(['profit_list'], loc='best')
plt.title("均线最优参数")
plt.show()
```

## 总结

本小节对比介绍了枚举法和蒙特卡洛法各自的特点以及在参数最优化中的应用。将蒙特卡洛法应用于量化交易策略的参数最优化过程中，能够在参数样本空间巨大的情况下择优选出策略参数，可以在回测阶段帮助我们更好地了解不同参数对策略效果的影响。

最后，给大家留一道思考题：

量化交易的本质是管理胜算的概率，而蒙特卡洛法的随机过程同样是以概率的形式求取近似的解，那么蒙特卡洛基于的概率理论是什么呢？

欢迎大家在留言区留言，我们一起讨论。
    