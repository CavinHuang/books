
# 股票交易策略-择时策略融入ATR动态仓位管理【加推篇】
---

# 加推篇！择时策略融入ATR动态仓位管理

## 前言

在《股票交易策略：择时策略融入ATR风险管理》节中我们在海龟交易法则的N日突破择时策略基础上引入风险管理因子——ATR指标。

ATR指标主要是用来衡量市场波动的强烈度，即为了显示市场变化率的指标，当市场波动剧烈那么ATR的值就会变大，当市场趋于平稳或波动较小那么ATR值就会变小。因此在资金管理中，根据ATR值实现动态仓位的计算，可以与当前市场的波动率相关联。

实际上，在海龟交易法则中，ATR指标是资金管理的核心，风险管理策略的判断某种程度上也是对于资金的保护。

本节我们多个角度来介绍下基于ATR指标的动态仓位管理的原理和实现方法。

## ATR资金管理的原理

真正的资金管理是在买入某个股票时，决定如何分批入场，又如何止损/止赢离场的策略。资金管理模块由以下四部分组成：

- 资金分配
- 头寸规模
- 止盈止损价位
- 加减仓规模

无论是资金分配、头寸规模、止盈止损价位还是加减仓规模，都是将ATR指标作为基准值。

接下来我们以合理分配资金为例，介绍下ATR在资金管理中的原理。

通常交易者都会同时持有多只股票，那么如何在多个股票之间分配资金呢？

比方手头有10万元资金，准备同时买股票A和股票B，如何分配资金呢？最简单的，也是大多数人选择的方法是均分法，也就是两者各买5万元。这种方法虽然简单，但却忽略了一个问题，也就是不同的股票股性并不相同，也就是说有的波动很大，有的波动很小。

如果这两类股票用同样的资金购买，那么股性活跃的股票带来的亏损和盈利都会超过股性相对不活跃的。倘若股性相对不活跃的股票涨得少，股性活跃的股票跌的多，那么总资金依旧会亏损。

因此可以利用ATR来分配资金解决这个问题，即让所有资金的固定百分比与某个股票1个ATR的波动对应。

1月1日股票A的收盘价为4.12元，14日ATR为0.15元，相当于收盘价的3.64\%；1月1日股票B的收盘价为30.85元，14日ATR为2.74元，相当于收盘价的8.88\%；显然后者股性比前者更活跃。

假设手头有10万元资金，我们就可以设定让上述两个股票1个ATR的波动等价于总资金1\%的波动，那么10万元的1\%为1000元。

股票A：1000÷0.15=6666，即我们应当买入6666股，按照当日4.12元收盘价计算，涉及资金2. 74万元；

与此同时，1000÷2.74=364，即我们应当买入364股股票B，按照当日30.85元收盘价计算，涉及资金1. 125万元。

通过资金分配的不同，我们大体可以使这两个股票的正常波动对投资组合的影响大致相等，不会过分受到股票B的影响。

## ATR头寸管理的实现

关于头寸管理的原理与资金分配大体相同。《海龟交易法则》建议第一笔仓位的一个ATR波动与总资金1\%波动相对应。即：买入股票数量 \* ATR = 资金 \* 1\% 假如1月1日股票A向上突破4.12元出现买入点，手上有10万元资金，那么10万资金的1\%波动就是1000元。截止1月1日，股票A的14日ATR为0.15元，1000元÷0.15元=6666股。也就是说，头寸规模应该是买入6666股，耗资2. 74万元。

首先创建账户类ST\_Account，该类中提供了当前账户的剩余资金、持仓股数、总资产、交易操作等接口，如下所示：

```
class ST_Account:

    def __init__(
            self,
            init_hold={},
            init_cash=1000000,
            commission_coeff=0,
            tax_coeff= 0):
        """
        :param [dict] init_hold         初始化时的股票资产
        :param [float] init_cash:         初始化资金
        :param [float] commission_coeff:  交易佣金 :默认 万2.5(float类型 0.00025) 此处例程设定为0
        :param [float] tax_coeff:         印花税   :默认 千1.5(float类型 0.001) 此处例程设定为0
        """
        self.hold = init_hold
        self.cash = init_cash

    def hold_available(self, code=None):
        """可用持仓"""
        if code in self.hold:
            return self.hold[code]

    def cash_available(self):
        """可用资金"""
        return self.cash

    def latest_assets(self, price):
        # return the lastest hold 总资产
        assets_val = 0
        for code_hold in self.hold.values():
            assets_val += code_hold * price
        assets_val += self.cash
        return assets_val

    def send_order(self, code=None, amount=None, price=None, order_type=None):
        if order_type == 'buy':
            self.cash = self.cash - amount * price
            self.hold[code] = amount
        else:
            self.cash = self.cash + amount * price
            self.hold[code] -= amount
            if self.hold[code] == 0:
                del self.hold[code]  # 删除该股票



```

此处为了侧重介绍资金管理，简化了账户中的一些细节，暂时不考虑佣金和印花税。 我们分别设立两个账户，以海龟交易法则中N日通道突破策略为例，对比下全仓买入和ATR头寸规模买入的资金收益。

```
self.account_a = ST_Account(dict(), 100000) # 账户A 持股数目和初始资金

self.account_b = ST_Account(dict(), 100000) # 账户B 持股数目和初始资金


```

买入部分代码更改如下所示：

```
self.account_a.send_order(code = "600410.SS",
                          amount = int(self.account_a.cash_available() / today.Close),
                          price = today.Close, order_type='buy')
self.account_b.send_order(code = "600410.SS",
                          amount = int(self.account_b.cash_available() * 0.01 / today.atr14),
                          price = today.Close, order_type='buy')
```

卖出部分代码更改如下所示：

```
self.account_a.send_order(code = "600410.SS",
                          amount= self.account_a.hold_available(code = "600410.SS"),
                          price = today.Close, order_type='sell')
self.account_b.send_order(code="600410.SS",
                          amount = self.account_b.hold_available(code = "600410.SS"),
                          price = today.Close, order_type='sell')
```

对比回测效果如下图所示，从收益曲线可以看出增加头寸管理之后曲线波动幅度趋缓：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/11/16f930e6a0ecb86c~tplv-t2oaga2asx-image.image)

完整代码如下所示：

```
class draw_graph:

    def __init__(self, draw_obj, stock_obj):

        self.fig = draw_obj
        self.stockdat = stock_obj
        # 创建子图表
        gs = gridspec.GridSpec(3, 1, left=0.05, bottom=0.1, right=0.96, top=0.96, wspace=None, hspace=0.05,
                               height_ratios=[4, 2, 2])
        self.gtrade = self.fig.add_subplot(gs[0, :])
        self.gtotal = self.fig.add_subplot(gs[1, :])
        self.gprofit = self.fig.add_subplot(gs[2, :])

        # 初始化变量
        self.skip_days = 0
        self.account_a = ST_Account(dict(), 100000) # 账户A 持股数目和初始资金

        self.account_b = ST_Account(dict(), 100000) # 账户B 持股数目和初始资金


    def draw_trade(self):
        self.stockdat['max_close'] = df_stockload['Close'].expanding().max()
        self.stockdat[['max_close', 'Close']].plot(grid=True, ax=self.gtrade)

        for kl_index, today in self.stockdat.iterrows():
            # 买入/卖出执行代码
            if today.signal == 1 and self.skip_days == 0:  # 买入
                start = self.stockdat.index.get_loc(kl_index)
                print("buy",kl_index)
                self.skip_days = -1

                self.account_a.send_order(code = "600410.SS",
                                          amount = int(self.account_a.cash_available() / today.Close),
                                          price = today.Close, order_type='buy')
                self.account_b.send_order(code = "600410.SS",
                                          amount = int(self.account_b.cash_available() * 0.01 / today.atr14),
                                          price = today.Close, order_type='buy')

                self.gtrade.annotate('买入', xy=(kl_index, self.stockdat.Close.asof(kl_index)),
                                     xytext=(kl_index, self.stockdat.Close.asof(kl_index) + 2),
                                     arrowprops=dict(facecolor='r', shrink=0.1), horizontalalignment='left',
                                     verticalalignment='top')

            elif today.signal == 0 and self.skip_days == -1:  # 卖出 避免未买先卖
                end = self.stockdat.index.get_loc(kl_index)
                print("sell", kl_index)
                self.skip_days = 0

                self.account_a.send_order(code = "600410.SS",
                                          amount= self.account_a.hold_available(code = "600410.SS"),
                                          price = today.Close, order_type='sell')
                self.account_b.send_order(code="600410.SS",
                                          amount = self.account_b.hold_available(code = "600410.SS"),
                                          price = today.Close, order_type='sell')

                if self.stockdat.Close[end] < self.stockdat.Close[start]:  # 赔钱显示绿色
                    self.gtrade.fill_between(self.stockdat.index[start:end], 0, self.stockdat.Close[start:end], color='green',
                                             alpha=0.38)
                else:  # 赚钱显示红色
                    self.gtrade.fill_between(self.stockdat.index[start:end], 0, self.stockdat.Close[start:end], color='red',
                                             alpha=0.38)
                self.gtrade.annotate('卖出', xy=(kl_index, self.stockdat.Close.asof(kl_index)),
                                     xytext=(kl_index + datetime.timedelta(days=5), self.stockdat.Close.asof(kl_index) + 2),
                                     arrowprops=dict(facecolor='g', shrink=0.1), horizontalalignment='left',
                                     verticalalignment='top')
            # 账户A 资产曲线
            # 账户B 资产曲线 
            self.stockdat.loc[kl_index, 'total_a'] = self.account_a.latest_assets(today.Close)
            self.stockdat.loc[kl_index, 'total_b'] = self.account_b.latest_assets(today.Close)

    def draw_total(self):

        # 计算资金曲线当前的滚动最高值
        self.stockdat[['total_a', 'total_b']].plot(grid=True, ax=self.gtotal)

    def draw_profit(self):
        # 计算基准收益/趋势突破策略收益
        self.stockdat['benchmark_profit'] = np.log(self.stockdat.Close / self.stockdat.Close.shift(1))
        self.stockdat['trend_profit'] = self.stockdat.signal * self.stockdat.benchmark_profit
        self.stockdat[['benchmark_profit', 'trend_profit']].cumsum().plot(grid=True, ax=self.gprofit)

    def draw_config(self):
        self.draw_trade()
        self.draw_total()
        self.draw_profit()
        # 图表显示参数配置
        for label in self.gtrade.xaxis.get_ticklabels():
            label.set_visible(False)
        for label in self.gtotal.xaxis.get_ticklabels():
            label.set_visible(False)
        for label in self.gprofit.xaxis.get_ticklabels():
            label.set_rotation(45)
            label.set_fontsize(10)  # 设置标签字体
        self.gtrade.set_xlabel("")
        self.gtrade.set_title(u'华胜天成 收益与风险度量')
        self.gtotal.set_xlabel("")
        
df_stockload = GetStockDatApi("600410.SS",datetime.datetime(2018, 1, 1), datetime.datetime(2019, 4, 1))#华胜天成

fig = plt.figure(figsize=(16, 8), dpi=100, facecolor="white") # 创建fig对象
app_graph_a = draw_graph(fig, df_stockload)
app_graph_a.draw_config()
plt.show()
```

## ATR动态仓位调整

当我们以一个ATR波动与总资金1\%波动相对应的策略买入了6666股。假如买完之后股票长期盘整，既无大涨也无大跌，此时ATR会进一步下跌，比如由0.15元下降至0.12元时，投资者便可重新计算仓位。依旧按照1\%资金=1ATR波动计算，则可持有8333股，此前已经买入6666股，则投资者还可加仓1667股。

实现代码如下所示：

```
if((posit_num_wave - self.account_b.hold_available(code = "600410.SS")) >= self.adjust_hold): # 波动后加仓

    print("adjust buy", kl_index)
    self.account_b.send_order(code="600410.SS",
                              amount=int(posit_num_wave - self.account_b.hold_available(code = "600410.SS")),
                              price=today.Close, order_type='buy')
elif (self.account_b.hold_available(code = "600410.SS") - posit_num_wave) > self.adjust_hold:
    print("adjust sell", kl_index)
    self.account_b.send_order(code="600410.SS",
                              amount=int(self.account_b.hold_available(code="600410.SS")- posit_num_wave),
                              price=today.Close, order_type='sell')
```

完整代码如下所示：

```
class draw_add_postion(draw_graph):

    def __init__(self, draw_obj, stock_obj):
        draw_graph.__init__(self, draw_obj, stock_obj)
        self.stand_cash = 100000
        self.adjust_hold = 500

    def draw_trade(self):
        self.stockdat['max_close'] = df_stockload['Close'].expanding().max()
        self.stockdat[['max_close', 'Close']].plot(grid=True, ax=self.gtrade)

        for kl_index, today in self.stockdat.iterrows():
            # 买入/卖出执行代码
            if today.signal == 1 and self.skip_days == 0:  # 买入
                start = self.stockdat.index.get_loc(kl_index)
                print("buy",kl_index)
                self.skip_days = -1

                self.account_a.send_order(code = "600410.SS",
                                          amount = int(self.account_a.cash_available() / today.Close),
                                          price = today.Close, order_type='buy')
                self.account_b.send_order(code = "600410.SS",
                                          amount = int(self.account_b.cash_available() * 0.01 / today.atr14),
                                          price = today.Close, order_type='buy')

                self.gtrade.annotate('买入', xy=(kl_index, self.stockdat.Close.asof(kl_index)),
                                     xytext=(kl_index, self.stockdat.Close.asof(kl_index) + 2),
                                     arrowprops=dict(facecolor='r', shrink=0.1), horizontalalignment='left',
                                     verticalalignment='top')

            elif today.signal == 0 and self.skip_days == -1:  # 卖出 避免未买先卖
                end = self.stockdat.index.get_loc(kl_index)
                print("sell", kl_index)
                self.skip_days = 0

                self.account_a.send_order(code = "600410.SS",
                                          amount= self.account_a.hold_available(code = "600410.SS"),
                                          price = today.Close, order_type='sell')
                self.account_b.send_order(code="600410.SS",
                                          amount = self.account_b.hold_available(code = "600410.SS"),
                                          price = today.Close, order_type='sell')

                if self.stockdat.Close[end] < self.stockdat.Close[start]:  # 赔钱显示绿色
                    self.gtrade.fill_between(self.stockdat.index[start:end], 0, self.stockdat.Close[start:end], color='green',
                                             alpha=0.38)
                else:  # 赚钱显示红色
                    self.gtrade.fill_between(self.stockdat.index[start:end], 0, self.stockdat.Close[start:end], color='red',
                                             alpha=0.38)
                self.gtrade.annotate('卖出', xy=(kl_index, self.stockdat.Close.asof(kl_index)),
                                     xytext=(kl_index + datetime.timedelta(days=5), self.stockdat.Close.asof(kl_index) + 2),
                                     arrowprops=dict(facecolor='g', shrink=0.1), horizontalalignment='left',
                                     verticalalignment='top')

            if self.skip_days == -1:
                posit_num_wave = int(self.account_b.latest_assets(today.Close) * 0.01 / today.atr14) # 动态计算持仓的股票数量

                if((posit_num_wave - self.account_b.hold_available(code = "600410.SS")) >= self.adjust_hold): # 波动后加仓

                    print("adjust buy", kl_index)
                    self.account_b.send_order(code="600410.SS",
                                              amount=int(posit_num_wave - self.account_b.hold_available(code = "600410.SS")),
                                              price=today.Close, order_type='buy')
                elif (self.account_b.hold_available(code = "600410.SS") - posit_num_wave) > self.adjust_hold:
                    print("adjust sell", kl_index)
                    self.account_b.send_order(code="600410.SS",
                                              amount=int(self.account_b.hold_available(code="600410.SS")- posit_num_wave),
                                              price=today.Close, order_type='sell')

            # 账户A 资产曲线
            # 账户B 资产曲线
            self.stockdat.loc[kl_index, 'total_a'] = self.account_a.latest_assets(today.Close)
            self.stockdat.loc[kl_index, 'total_b'] = self.account_b.latest_assets(today.Close)

df_stockload = GetStockDatApi("600410.SS",datetime.datetime(2018, 1, 1), datetime.datetime(2019, 4, 1))#华胜天成

fig = plt.figure(figsize=(16, 8), dpi=100, facecolor="white") # 创建fig对象
app_graph_b = draw_add_postion(fig, df_stockload)
app_graph_b.draw_config()
plt.show()
```

## ATR动态止损价位

在交易系统中止损技术是风险控制的一种手段，同时也是交易系统中最后的防线。除非是巴菲特这样的绝对价值投资者，否则投资者在买入的同时设定止损是极其重要的事情。

不同的交易者，往往会使用不同的止损方法，比如选股大师欧奈尔便推荐投资者使用8\%作为止损线，一旦亏损超过此数目，便割肉离场。利用固定比例作为止损，固然简单易算，但问题还是在于前面讲到的股性区别。若股票A这样波动较小的品种和股票B这样波动较大的品种都选择8\%作为止损线，显然不太合理。这时候，ATR就有用武之地了。

利用ATR设定止损其实很简单，大体就是选择一个基准价位，然后乘以一个系数得到调整后的ATR作为止损价位。具体可以参照《股票交易策略：择时策略融入ATR风险管理》中关于ATR止赢止损的机制的实现。

此处更多是想强调止损机制的重要性。一旦股价跌破止损价位，就必须100\%的执行卖出操作，如果不卖，一旦有效跌破，由于之后并不会产生更好的卖出信号，导致的后果就是深度套牢，即使出现这种结果的概率很低，作为一套成熟的交易系统，也是不可接受的。所以，止损价位设定后，实战中一旦触及，就应该坚决执行，从长远考虑为下一次交易留下足够的弹药。

总结

本小节我们从头寸管理和动态加减仓这两个角度介绍了基于ATR指标的动态资金管理的原理和实现方法。同学们可以再结合《股票交易策略：择时策略融入ATR风险管理》中关于ATR止赢止损的机制，将头寸管理、动态加减仓、止赢止损系统地结合为一个完整的资金管理模块。
    