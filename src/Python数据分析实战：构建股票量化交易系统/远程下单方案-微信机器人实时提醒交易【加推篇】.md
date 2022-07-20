
# 远程下单方案-微信机器人实时提醒交易【加推篇】
---

# 远程下单方案：微信机器人实时提醒交易

## 前言

我们用量化交易的目的就是让程序全自动地去跑策略，全自动的去执行交易，所以大家非常关心全自动下单的实现。

对个人交易者来说，如果是期货交易，程序化交易的限制没有股票那么严格，毕竟市场影响比股票小，像上期所CTP、中金所飞马、大商所飞创以及郑商所易盛，这些柜台系统都可以实现，像交易开拓者（TB）、文华财经以及金字塔等带有脚本功能的软件，也对接了某一柜台系统。

而股票的自动化交易在2015年之后就被管制了。像华宝证券的LTS，兴业证券CTP 股票交易系统，在监管政策出来之后，也都限制了。当然现在像米筐Ricequant，聚宽Joinquant，掘金Myquant，优矿Uqer 这些回测平台，也可以通过平台把信号生成与券商柜台自动交易连接起来，也有一些开源的量化框架用模拟登陆方式下单。

不过我倒是觉得全自动下单对个人交易者来说倒不是需求特别的强烈，因为股票交易的规则本身就限制你的交易频率，除非你的策略代码非常健壮，资金非常雄厚，用“一篮子股票”这种策略去规避风险，否则的话手动下单会更靠谱些，毕竟是真金白银，哪天程序跑飞了把你的股票都清仓了，真的就悲剧了。

当然了，手动下单可不等于盯盘哦， “人生苦短，我用Python”，我们可以用Python给手机发交易消息，然后手动下单或者用券商APP上的条件单下单，这样就可以去干别的事情了。。。。

## 解决方案

我们采用的技术方案是用Python玩微信的库—— wxpy。wxpy在itchat 的基础上，通过大量接口优化提升了模块的易用性，并进行丰富的功能扩展。

以下是[官网](https://github.com/youfou/wxpy)的介绍，关于一些常见的场景：

- 控制路由器、智能家居等具有开放接口的玩意儿

- 运行脚本时自动把日志发送到你的微信

- 加群主为好友，自动拉进群中

- 跨号或跨群转发消息

- 自动陪人聊天

- 逗人玩 ...

总而言之，可用来实现各种微信个人号的自动化操作 国内用户安装方式推荐从豆瓣 PYPI 镜像源下载安装：

```
pip install -U wxpy -i "https://pypi.doubanio.com/simple/"
```

上手非常简单，就这么几步，登陆微信、找到好友、发送消息：

```
# 初始化机器人，扫码登陆
bot = wxpy.Bot()
# 搜索名称含有 "元宵大师" 的男性杭州好友
my_friend = bot.friends().search('元宵大师', sex=wxpy.MALE, city="杭州")[0]
my_friend.send(signal_sell_a + "\n"+ signal_sell_b)
my_friend.send_image('myplot.png') # 发送图片
```

我是单独申请一个小号来运行机器人的，扫描登陆后就行。我们可以在量化策略框架中加入这部分代码接口，最好把课程中讲的买卖交易区间图也一同发到手机上，可以清楚看到当前交易的位置。

## 演示效果

接下来，我们在回测框架上加上去看看实现的效果，代码结构如下所示：

```
    def draw_trade(self):

        for kl_index, today in self.stockdat.iterrows():
            # 买入/卖出执行代码
            if today.signal == 1 and self.skip_days == 0:  # 买入
                # 添加买入处理代码
                
                # 发送交易信号给手机端   print() /my_friend.send()
                signal_buy_a = "{0} 账户A 买入股票：{1} 买入价格：{2} 买入股数：{3}".format(kl_index.strftime("%y-%m-%d"), self.stockcode.split(".")[0], today.Close,
                                                   self.account_a.pos_available(1, today.Close))
                signal_buy_b = "{0} 账户B 买入股票：{1} 买入价格：{2} 买入股数：{3}".format(kl_index.strftime("%y-%m-%d"), self.stockcode.split(".")[0], today.Close,
                                                   self.account_b.pos_available(0.01, today.atr14))

                print(signal_buy_a + "\n"+ signal_buy_b)
                my_friend.send(signal_buy_a + "\n"+ signal_buy_b)

                
            elif today.signal == 0 and self.skip_days == -1: # 卖出 避免未买先卖
                # 添加卖出处理代码

                signal_sell_a = "{0} 账户A 卖出股票：{1} 卖出价格：{2} 卖出股数：{3}".format(kl_index.strftime("%y-%m-%d"), self.stockcode.split(".")[0], today.Close,
                                                                   self.account_a.hold_available(code = self.stockcode))
                signal_sell_b = "{0} 账户B 卖出股票：{1} 卖出价格：{2} 卖出股数：{3}".format(kl_index.strftime("%y-%m-%d"), self.stockcode.split(".")[0], today.Close,
                                                                   self.account_b.hold_available(code = self.stockcode))
                print(signal_sell_a + "\n"+ signal_sell_b)
                my_friend.send(signal_sell_a + "\n"+ signal_sell_b)

```

以下是回测新希望股票的交易信号和买卖区间图：

```
17-02-10 账户A 买入股票：000876 买入价格：8.13 买入股数：12300
17-02-10 账户B 买入股票：000876 买入价格：8.13 买入股数：11800
17-03-10 账户A 卖出股票：000876 卖出价格：8.06 卖出股数：12300
17-03-10 账户B 卖出股票：000876 卖出价格：8.06 卖出股数：11800
17-03-24 账户A 买入股票：000876 买入价格：8.27 买入股数：11900
17-03-24 账户B 买入股票：000876 买入价格：8.27 买入股数：10300
17-03-29 账户A 卖出股票：000876 卖出价格：8.11 卖出股数：11900
……
19-10-18 账户B 卖出股票：000876 卖出价格：18.06 卖出股数：1300
19-10-22 账户A 买入股票：000876 买入价格：19.3 买入股数：4900
19-10-22 账户B 买入股票：000876 买入价格：19.3 买入股数：1400
19-11-01 账户A 卖出股票：000876 卖出价格：22.09 卖出股数：4900
19-11-01 账户B 卖出股票：000876 卖出价格：22.09 卖出股数：1400
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/19/171919f7ff71eb43~tplv-t2oaga2asx-image.image)

运行程序后的登陆信息，如下所示：

```
Getting uuid of QR code.
Downloading QR code.
Please scan the QR code to log in.
Please press confirm on your phone.
Loading the contact, this may take a little while.
TERM environment variable not set.
Login successfully as [][]元宵大师-1[][]
```

手机上收到的信息如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/19/17191a0777cf3c3a~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/19/17191a09060d0ad4~tplv-t2oaga2asx-image.image)

## 总结

虽然是半自动化的交易，但是同样的可控性会好一些，当然如果代码经过多轮测试之后，已经完全稳定了，我们可以用全自动的实现方案，大家关注后续的文章吧。
    