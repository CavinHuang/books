
# 量化策略回测-如何利用聚宽平台回测交易策略【加推篇】
---

# 量化策略回测：如何利用聚宽平台回测交易策略

## 前言

我们经过了自己动手搭建量化回测框架这个过程之后，能够对回测有一定的认识。

接下来可以探索下那些现有的回测框架或者平台，试着找到适合自己风格的方式。

这里我们选一个比较普及的线上回测平台——聚宽，通过几个简单的例程来熟悉下这个平台的使用特点。

## 编程框架

首先文件中要导入jqdata和其他使用到的库。如下所示：

```
# 导入函数库
import jqdata
import pandas as pd
import numpy as np
import talib as tl
```

基本的框架可以概括为“初始化+周期循环”框架。

首先建立一个初始化函数initialize，在函数里面可以设置基准、滑点、手续费等初始化操作。

然后选择`run_daily/run_weekly/run_monthly`中的一种周期去循环执行策略。 比如官网上最简单的一个例程，如下所示：

```
# 导入聚宽函数库
import jqdata

# 初始化函数，设定要操作的股票、基准等等
def initialize(context):
    # 定义一个全局变量, 保存要操作的股票
    # 000001(股票:平安银行)
    g.security = '000001.XSHE'
    # 运行函数
    run_daily(market_open, time='every_bar')

# 每个单位时间(如果按天回测,则每天调用一次,如果按分钟,则每分钟调用一次)调用一次
def market_open(context):
    if g.security not in context.portfolio.positions:
        order(g.security, 1000)
    else:
        order(g.security, -800)
```

这个例程里先在初始化函数 initialize里指定操作'000001.XSHE'平安银行，然后就是每天调用market\_open函数，每次调用时候判断没有股票时就买入1000股,有股票时卖出800股……虽然是一个很没意义的策略，但是对理解如何在聚宽上写策略还是比较直观的。

大家在编写策略的时候是要使用聚宽上封装了的API函数的，可以查看官网的介绍。比如set\_benchmark设置基准、set\_order\_cost设置佣金/印花税、set\_slippage设置滑点、use\_real\_price设置动态复权\(真实价格\)模式、order按股数下单、get\_ticks获取tick数据等等，不得不说从这方面来看使用上还是蛮方便的。

## 单股票双均线择时策略

我们拿双均线策略这个入门的策略来回测一下，M5上穿M10时达到一定幅度时买入，M5下穿M10时卖出。

在初始化函数中设定操作的股票、基准、开启动态复权模式、设定每天调用的market\_open函数。

```
# 初始化函数，设定要操作的股票、基准等等
def initialize(context):
    # 定义一个全局变量, 保存要操作的股票
    # 000876(股票:新希望xin xi w)
    g.security = '000876.XSHE'
    # 设定沪深300作为基准
    set_benchmark('000300.XSHG')
    # 开启动态复权模式(真实价格)
    set_option('use_real_price', True)
    # 运行函数
    run_daily(market_open, time='every_bar')
```

接下来策略的逻辑实现都在market\_open函数中。

先得到M5和M10的均线数值，代码如下所示：

```
# 获取股票均线值
close_data_5 = attribute_history(security, 5, '1d', ['close'])
close_data_10 = attribute_history(security, 10, '1d', ['close'])
print(close_data_5,close_data_10)
# 取得过去五天的平均价格
MA5 = close_data_5['close'].mean()
MA10 = close_data_10['close'].mean()
```

attribute\_history函数得到的是最近N日的收盘价数据，以close\_data\_5为例，每天会返回如下数值（每天都会执行一次函数，返回N日的收盘价），然后求平均即为MA5。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/1726379d5b707541~tplv-t2oaga2asx-image.image)

剩下的就是买卖点的逻辑判断，比如出现金叉买入、出现死叉卖出之类的，如下所示：

```
# 取得当前的现金
cash = context.portfolio.available_cash
# 如果十天平均价格高出五天平均价1%, 则全仓买入
if MA5 > 1.01*MA10:
    # 用所有 cash 买入股票
    order_value(security, cash)
    # 记录这次买入
    log.info("Buying %s" % (security))
# 如果十天平均价格低于五天平均价, 则空仓卖出
elif MA5 < MA10 and context.portfolio.positions[security].closeable_amount > 0:
    # 卖出所有股票,使这只股票的最终持有量为0
    order_target(security, 0)
    # 记录这次卖出
    log.info("Selling %s" % (security))
```

最后record函数还可以选择绘制收盘价、均线的走势。

整体代码如下所示：

```
# 导入聚宽函数库
import jqdata

# 初始化函数，设定要操作的股票、基准等等
def initialize(context):
    # 定义一个全局变量, 保存要操作的股票
    # 000876(股票:新希望xin xi w)
    g.security = '000876.XSHE'
    # 设定沪深300作为基准
    set_benchmark('000300.XSHG')
    # 开启动态复权模式(真实价格)
    set_option('use_real_price', True)
    # 运行函数
    run_daily(market_open, time='every_bar')

# 每个单位时间(如果按天回测,则每天调用一次,如果按分钟,则每分钟调用一次)调用一次
def market_open(context):
    security = g.security
    # 获取股票均线值
    close_data_5 = attribute_history(security, 5, '1d', ['close'])
    close_data_10 = attribute_history(security, 10, '1d', ['close'])
    # 获取股票的收盘价
    close_data = attribute_history(security, 1, '1d', ['close'])
    
    # 取得过去五天的平均价格
    MA5 = close_data_5['close'].mean()
    MA10 = close_data_10['close'].mean()

    # 取得当前的现金
    cash = context.portfolio.available_cash
    # 取得上一时间点价格
    current_price = close_data['close'][-1]
    # 如果十天平均价格高出五天平均价1%, 则全仓买入
    if MA5 > 1.01*MA10:
        # 用所有 cash 买入股票
        order_value(security, cash)
        # 记录这次买入
        log.info("Buying %s" % (security))
    # 如果十天平均价格低于五天平均价, 则空仓卖出
    elif MA5 < MA10 and context.portfolio.positions[security].closeable_amount > 0:
        # 卖出所有股票,使这只股票的最终持有量为0
        order_target(security, 0)
        # 记录这次卖出
        log.info("Selling %s" % (security))
    # 画出上一时间点价格
    record(stock_price=current_price)
record(ma5_price=MA5, ma10_price=MA10)
```

回测界面如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172637afe61d2401~tplv-t2oaga2asx-image.image)

## 多股票双均线择时策略

很多时候我们买股票都是买多只股票的，那么如何回测多只股票情况下的双均线择时策略呢？

比如当某只股票M5上穿M10时达到一定幅度时买入100股，M5下穿M10时则卖出。 其实主要更改在于建立一个股票池，如下所示：

```
# 设置我们要操作的股票池
g.stocks = ['000001.XSHE','000002.XSHE','000004.XSHE','000005.XSHE']
```

然后在每次调用交易执行中不断去循环判断这几个股票是否达到交易条件。

以下附上全部源码：

```
# 导入聚宽函数库
import jqdata
# 初始化函数，设定要操作的股票、基准等等
def initialize(context):
    # 设置我们要操作的股票池
    g.stocks = ['000001.XSHE','000002.XSHE','000004.XSHE','000005.XSHE']
    # 设定沪深300作为基准
    set_benchmark('000300.XSHG')
    # 开启动态复权模式(真实价格)
    set_option('use_real_price', True)
# 每个单位时间(如果按天回测,则每天调用一次,如果按分钟,则每分钟调用一次)调用一次
def handle_data(context, data):   
    # 循环每只股票
    for security in g.stocks:
        # 得到股票之前5/10天的平均价
        MA5 = data[security].vwap(5)
        MA10 = data[security].vwap(10)        
        # 得到上一时间点股票收盘价
        close_data = data[security].close
        # 取得当前的现金
        cash = context.portfolio.available_cash

        # 如果十天平均价格高出五天平均价1%, 则全仓买入
        if MA5 > 1.01*MA10:
            # 下入买入单
            order(security,100)
            # 记录这次买入
            log.info("Buying %s" % (security))
        # 如果十天平均价格低于五天平均价, 则空仓卖出
        elif MA5 < MA10 and context.portfolio.positions[security].closeable_amount > 0:
            # 下入卖出单
            order(security,-100)
            # 记录这次卖出
log.info("Selling %s" % (security))
record(pos=(context.portfolio.positions_value / context.portfolio.total_value * 100))
```

回测界面如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172637beba2061ef~tplv-t2oaga2asx-image.image)

## 总结

聚宽平台给量化交易者提供了一个很不错的平台，使用过程中，我的感觉是关于内置的API函数还是比较灵活的，特别是与数据相关的接口。前提是要非常熟悉这些接口的特点和使用方法。

不过回测过程中速度确实有点慢，编写和调试代码的环境和我本地相比是有点不太灵活。

总体来说瑕不掩瑜吧，大家使用后有什么想法吗？可以在留言区谈谈。
    