
# 量化策略回测-基于BackTrader建立双均线策略【加推篇】
---

# 量化策略回测： 基于BackTrader建立双均线策略

## 前言

backtrader属于功能相对完善的本地版Python量化回测框架。

既然业界好评如云，我们作为量化交易者理应集所有好用的工具于一身。本文就让我们来体验一下这个框架。

安装backtrader模块： `pip install backtrader`

导入backtrader模块：`import backtrader as bt`

## 总体概览

backtrader的使用方法在官方文档上介绍的挺详细的。大体分为两步：

创建一个策略，创建一个策略类，这个类要继承自backtrader.Strategy，然后就可以自定义里面的方法。

- 策略类中有一个类属性params，用于定义一些在策略中可调参数值
- backtrader.indicators内置了许多指标的计算方法，比如移动平均线、MACD、RSI等等，使用时只需要实例化策略中会使用到的技术指标即可
- next函数中编写交易策略，也就是进入市场和退出市场的逻辑

创建一个策略决策引擎（原文是Cerebro，这里我用决策这个词）

- 把定义的策略注入到决策引擎之中
- 把行情数据注入到决策引擎之中
- 可视化方式反馈回测结果

以上是框架中核心的部分，当然了，其他还有很多可扩展的功能。

## Data Feed

backtrader的数据加载非常灵活，提供了多种形式的数据接口，可以是CSV文件格式的数据，也可以是DataFrame格式数据。

此处我们使用DataFrame格式数据，如下所示：

```
"""
             High    Low   Open  Close     Volume  OpenInterest
trade_date                                                     
2017-01-03   8.12   8.07   8.07   8.12  179801.01             0
2017-01-04   8.16   8.09   8.13   8.15  166242.35             0
2017-01-05   8.23   8.13   8.15   8.17  222902.53             0
2017-01-06   8.19   8.12   8.18   8.13  128549.96             0
2017-01-09   8.15   8.08   8.13   8.13  136700.04             0
"""
```

## Strategies

构建策略的类是继承backtrader.Strategy，然后根据自己的需要重写其中的方法即可。比如\_\_init\_\_、log、notify\_order、notify\_trade、next等等。

关于策略中的指标，backtrader内置了很多类型，直接调用即可。比如移动平均线：

```
self.sma = bt.indicators.SimpleMovingAverage(
              self.datas[0], period=self.params.maperiod)
```

由于内置了talib模块，也可以这么调用：

```
# 内置了talib模块
self.sma = bt.talib.SMA(self.data,
	     timeperiod=self.params.maperiod)
```

next方法中，我们实现一个简单的双均线策略作为交易的逻辑。比如买入条件是MA5上穿MA10；卖出条件是MA10下穿MA5。

关键代码如下所示：

```
class dua_ma_strategy(bt.Strategy):
    # 全局设定交易策略的参数
    params=(
            ('ma_short',5),
            ('ma_long', 10),
           )
    def __init__(self):

        # 指定价格序列
        self.dataclose=self.datas[0].close
        # 初始化交易指令、买卖价格和手续费
        self.order = None
        self.buyprice = None
        self.buycomm = None

        # 添加移动均线指标
        # 5日移动平均线
        self.sma5 = bt.indicators.SimpleMovingAverage(
            self.datas[0], period=self.params.ma_short)
        # 10日移动平均线
        self.sma10 = bt.indicators.SimpleMovingAverage(
            self.datas[0], period=self.params.ma_long)

    def next(self):
        # 记录收盘价
        self.log('Close, %.2f' % self.dataclose[0])

        if self.order: # 是否有指令等待执行
            return
        # 是否持仓
        if not self.position: # 没有持仓
            # 执行买入条件判断：MA5上扬突破MA10，买入
            if self.sma5[0] > self.sma10[0]:
                self.order = self.buy() # 执行买入
        else:
            # 执行卖出条件判断：MA5下穿跌破MA10，卖出
            if self.sma5[0] < self.sma10[0]:
                # 执行卖出
                self.order = self.sell()
```

## Cerebro

关于策略回测，把数据和策略添加到Cerebro中之外，还有设置一些参数。比如broker的设置，像初始资金、交易佣金。也可以用addsizer设定每次交易买入的股数。

关键代码如下所示：

```
cerebro = bt.Cerebro() 
cerebro.adddata(data) # 将数据传入回测系统
cerebro.addstrategy(dua_ma_strategy) # 将交易策略加载到回测系统中
cerebro.broker.setcash(10000) # 设置初始资本为10,000
cerebro.addsizer(bt.sizers.FixedSize, stake=500) # 设定每次交易买入的股数
cerebro.broker.setcommission(commission=0.002) # 设置交易手续费为 0.2%

cerebro.run() #运行回测系统
portvalue = cerebro.broker.getvalue() # 获取回测结束后的总资金
# 打印结果
print(f'总资金: {round(portvalue,2)}')
cerebro.plot(style='candlestick')
```

回测结束后返回得到执行交易策略时积累的总资金。此处我们回测的是新希望 2017年1月1日到2020年1月1日期间的策略执行效果，最终资金从10000变成了15941.95。

由于backtrader内置了Matplotlib，因此我们也可以可视化回测的效果，如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/11/1720301be90896e3~tplv-t2oaga2asx-image.image)

## 总结

以下我们简单介绍了backtrader框架的各个组成部分，并以双均线策略展示了backtrader的编程方法和运行效果。

总的来说，对于刚进阶的朋友来说是足够使用了，那么无法满足高阶玩家的需求怎么办呢？可以继承框架自己扩展，是不是想尝试了！！！
    