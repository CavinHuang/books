
# 股票交易策略-基于凯利公式的仓位管理
---

# 股票交易策略：基于凯利公式的仓位管理

## 前言

股票交易需要做的有三件事：选股、择时和仓位管理。仓位管理是指在每次交易时预计投入多少资金去建立股票仓位，是全仓？是半仓？还是空仓？实际上在《从概率角度谈市场中的博弈》小节中已经提及了仓位管理在交易中的重要性，通过合理的资金分配制度不仅可以抵御连续失利的打击，也可以获取相对稳定高效的盈利。

本小节基于凯利公式向大家诠释全仓并不是最优策略，根据输赢概率和盈利比率，来做仓位调整才是更好的选择。

## 什么是凯利公式

在赌博游戏中，如果每次都是满仓下注的话，从长期来看赌输一次就会输光全部本金，相反如果每次下注都非常微小的话，虽然不会输光本金，但是无法将收益最大化。那么在赌博游戏中该如何下注呢？每次下多少注？曾经爱德华·索普在研究21点策略时也存在相同的困扰，于是香农教授告诉他，使用凯利公式可以解决这类问题。

著名的凯利公式是由香农教授在新泽西贝尔实验室的同事——约翰·拉里·凯利（John Larry Kelly, Jr.）所提出的， 凯利在参考香农教授关于长途电话噪音的工作研究中提出了凯利公式，此处直接给出凯利公式，如下所示：

![f = \frac{P_{win}*r_{w} - P_{loss}*r_{l}}{r_{w}*r_{l}}](https://juejin.cn/equation?tex=f%20%3D%20%5Cfrac%7BP_%7Bwin%7D*r_%7Bw%7D%20-%20P_%7Bloss%7D*r_%7Bl%7D%7D%7Br_%7Bw%7D*r_%7Bl%7D%7D)

其中，f为最优的下注比例，![P_{win}](https://juejin.cn/equation?tex=P_%7Bwin%7D)为赢的概率，![r_{w}](https://juejin.cn/equation?tex=r_%7Bw%7D)是赢时的净收益率，![P_{l}](https://juejin.cn/equation?tex=P_%7Bl%7D)为输的概率（即为1-![P_{win}](https://juejin.cn/equation?tex=P_%7Bwin%7D)），![r_{l}](https://juejin.cn/equation?tex=r_%7Bl%7D)是输时的净损失率（![r_{l}](https://juejin.cn/equation?tex=r_%7Bl%7D)\>0）。爱德华·索普利用凯利公式就能在21点游戏中每次下注的多少进行量化计算，胜算大的时候下注多，胜算小的时候下注少。

比如在抛硬币的赌局中输和赢的概率分别是50\%，即![P_{win}](https://juejin.cn/equation?tex=P_%7Bwin%7D)和![P_{l}](https://juejin.cn/equation?tex=P_%7Bl%7D)分别是50\%；赢的时候净收益率为1，即![r_{w}](https://juejin.cn/equation?tex=r_%7Bw%7D)\=1；输的时候净损失率为1，即![r_{l}](https://juejin.cn/equation?tex=r_%7Bl%7D)\=1。也就是每次下注1元钱，赢的时候能再赢1元，输的话这1元钱就损失了。根据凯利公式，我们可以得到每局最佳的下注比例为：

![f = \frac{0.5*1 - 0.5*1}1 = 0](https://juejin.cn/equation?tex=f%20%3D%20%5Cfrac%7B0.5*1%20-%200.5*1%7D1%20%3D%200)

很显然，对于这个赌局，每次下注的期望收益是![0.5*1 \- 0.5*1 = 0](https://juejin.cn/equation?tex=0.5*1%20-%200.5*1%20%3D%200)，在这样一个对参与者并不占优势的赌局中，使用凯利公式求得的f为0，告诉我们没有概率上优势赌局不值得参与下注。

假如输的时候净损失率为0.5，即![r_{l}](https://juejin.cn/equation?tex=r_%7Bl%7D)\=0.5，也就是说赢的时候能再赢1元，输的时候只输0.5元钱。根据凯利公式，我们可以得到每局最佳的下注比例为：

![f = \frac{0.5*1 - 0.5*0.5}{1*0.5} = 0.5](https://juejin.cn/equation?tex=f%20%3D%20%5Cfrac%7B0.5*1%20-%200.5*0.5%7D%7B1*0.5%7D%20%3D%200.5)

很显然，这个赌局的期望收益是0.25，对参与者来说存在极大的优势，于是使用凯利公式求得的f为0.5，我们每次把一半的钱拿去下注，长期来看可以得到最大的收益。

接下来我们模拟下抛硬币的赌局。在《从概率角度谈市场中的博弈》小节中，我们介绍到抛硬币属于伯努利分布。我们可以利用Numpy中的`numpy.random.binomial(n, p, size=None)`方法来产生伯努利分布的随机数。

关于该方法参数：n、 p分别对应公式中的n、p，指每轮试验的次数和概率；size指对一个二项分布进行几轮试验的次数，采用统计的方法可以逼近真实的概率值；方法的返回值表示n次中事件发生的次数。

假如我们抛掷1枚硬币，试验10次观察出现正面朝上的次数是多少，如下所示：

```
#抛掷1枚硬币，出现正面朝上的次数——试验10次
print(np.random.binomial(1, 0.5, 10))
#[0 1 0 0 0 0 0 0 0 1]
```

假如我们抛掷5枚硬币，试验10次观察出现正面朝上的次数是多少，如下所示：

```
#同时抛掷5枚硬币，出现正面朝上的次数——试验10次
print(np.random.binomial(5, 0.5, 10))
#[2 3 2 4 0 3 2 3 1 2]
```

然后我们抛掷5枚硬币，试验5000次观察出现正面朝上的次数所对应的概率分别是多少，如下所示：

```
#同时抛掷5枚硬币，则6次同时为正面发生的概率——采样size=5000次

print(sum(np.random.binomial(5, 0.5, size=5000)==6)/5000.)
#同时抛掷5枚硬币，则5次同时为正面发生的概率——采样size=5000次

print(sum(np.random.binomial(5, 0.5, size=5000)==5)/5000.)
#同时抛掷5枚硬币，则4次同时为反面发生的概率——采样size=5000次

print(sum(np.random.binomial(5, 0.5, size=5000)==4)/5000.)
#同时抛掷5枚硬币，则3次同时为反面发生的概率——采样size=5000次

print(sum(np.random.binomial(5, 0.5, size=5000)==3)/5000.)
#同时抛掷5枚硬币，则2次同时为反面发生的概率——采样size=5000次

print(sum(np.random.binomial(5, 0.5, size=5000)==2)/5000.)
#同时抛掷5枚硬币，则1次同时为反面发生的概率——采样size=5000次

print(sum(np.random.binomial(5, 0.5, size=5000)==1)/5000.)
#同时抛掷5枚硬币，则0次同时为反面发生的概率——采样size=5000次

print(sum(np.random.binomial(5, 0.5, size=5000)==0)/5000.)
"""
0.0
0.0318
0.1646
0.3216
0.317
0.1592
0.0318
"""
```

此处模拟抛硬币的赌局可修改《从概率角度谈市场中的博弈》一节中市场模型的代码，`throwcoins()`方法中传入概率参数`win_rate`、赌局次数`play_cnt`、仓位比例`position`，当硬币正面朝上时获利1倍的下注资金，而当硬币反面朝上时亏损一半的下注资金，`my_money`存储每次下注时的资金情况，如下所示：

```
#模拟抛掷硬币
def throwcoins(win_rate, play_cnt=50, position=1):
    my_money = np.zeros(play_cnt)
    my_money[0] = 100 #初始资金
    once_chip = my_money[0]*position #初始仓位
    binomial = np.random.binomial(1, win_rate, play_cnt) #伯努利分布
    for i in range(1, play_cnt):
        if binomial[i] == 1:#正面盈利一倍
            my_money[i] = my_money[i-1] + once_chip
        else:#反面亏损一半
            my_money[i] = my_money[i-1] - once_chip / 2
        once_chip = my_money[i-1] * position  # 投入仓位
        if my_money[i] <= 0:
            my_money[i] = 0
            break
    print("The Number of games are %s" % i)
    return my_money
```

我们邀请10人以全仓下注方式参于50次抛硬币赌局，并可视化绘制最终的资金曲线，代码如下所示：

```
#概率50% 全仓 邀请10人参加50次
trader = 10
_ = [plt.plot(np.arange(50), throwcoins(0.5, play_cnt=50, position=1),alpha=0.6) for _ in np.arange(0,trader)]

"""
The Number is 49 and the money is 200.0
The Number is 49 and the money is 0.1953125
The Number is 49 and the money is 12.5
The Number is 49 and the money is 0.0030517578125
The Number is 49 and the money is 51200.0
The Number is 49 and the money is 0.78125
The Number is 49 and the money is 50.0
The Number is 49 and the money is 0.78125
The Number is 49 and the money is 800.0
The Number is 49 and the money is 3.125
"""
```

从执行的结果可获悉到，在这个赌局中参与者的本金并不会全部输光，不过即使这个赌局对参与者来说占据了获利的优势，但是多数玩家最终的资金仍然趋向于0，可视化资金曲线如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/27/16a5f06352056d38~tplv-t2oaga2asx-image.image)

我们邀请10人以凯利公式给出的50\%仓位下注方式参于50次抛硬币赌局，并可视化绘制最终的资金曲线，代码如下所示：

```
#概率50% 50%仓 邀请10人参加50次
trader = 10
_ = [plt.plot(np.arange(50), throwcoins(0.5, play_cnt=50, position=0.5),alpha=0.6) for _ in np.arange(0,trader)]
"""
The Number is 49 and the money is 2533.6802014273394
The Number is 49 and the money is 79.17750629460436
The Number is 49 and the money is 633.4200503568348
The Number is 49 and the money is 9.897188286825545
The Number is 49 and the money is 40538.88322283743
The Number is 49 and the money is 158.3550125892087
The Number is 49 and the money is 1266.8401007136697
The Number is 49 and the money is 158.3550125892087
The Number is 49 and the money is 5067.360402854679
The Number is 49 and the money is 316.7100251784174
"""
```

从执行的结果可获悉到，在这个赌局中参与者的最终的资金相对于全仓下注时收益巨大，可视化资金曲线如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/27/16a5f06acf597c36~tplv-t2oaga2asx-image.image)

## 凯利公式的威力

在《从概率角度谈市场中的博弈》一节中我们给出了加入仓位管理因子的市场模型：初始资金是1000元；每次下注的仓位比例与概率相关联，并将概率乘以固定的1\%比例作为下注资金随机买9个股票；如果有一半以上的股票涨了的话，我们暂定赚一倍仓位投入的钱，否则一半以上的股票跌了，仓位投入的钱就全部亏损，也就是赔率1赔1。如下所示：

```
#创建简易的市场模型应用仓位管理
def positmanage(play_cnt=50, stock_num=9, commission=0.01):
    my_money = np.zeros(play_cnt)
    my_money[0] = 1000

    for i in range(1, play_cnt):
        win_rate = np.random.random(size=1)#生成[0,1)之间的浮点数
        binomial = np.random.binomial(stock_num, win_rate, 1)
        once_chip = my_money[0] * win_rate * 0.1

        if binomial > stock_num//2:
            my_money[i] = my_money[i-1] + once_chip
        else:
            my_money[i] = my_money[i-1] - once_chip
        my_money[i] -= commission
        if my_money[i] <= 0:
            print("lose game!!!")
            break
    print("The Number is %d and the money is %s" % (i, my_money[i]))
    return my_money
```

我们邀请10人以优化后的仓位管理策略下注参于50次抛硬币赌局，并可视化绘制最终的资金曲线，代码如下所示：

```
#仓位管理 手续费0.01 邀请10人参加50次
_ = [plt.plot(np.arange(50), positmanage(play_cnt=50, stock_num=9, commission=0.01),alpha=0.6) for _ in np.arange(0,trader)]
"""
The Number is 49 and the money is 2372.719556381477
The Number is 49 and the money is 2009.0951330909227
The Number is 49 and the money is 2299.2379586462635
The Number is 49 and the money is 2121.889442407819
The Number is 49 and the money is 2143.590664833944
The Number is 49 and the money is 1793.351530136209
The Number is 49 and the money is 2175.5894108812
The Number is 49 and the money is 1763.739695898018
The Number is 49 and the money is 2771.6411418461894
The Number is 49 and the money is 1558.6858278563188
"""
```

从执行的结果可获悉到，加入仓位管理策略后的资金收益效果不错，可视化资金曲线如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/27/16a5f077eb707c4b~tplv-t2oaga2asx-image.image)

接下来我们将凯利公式作为仓位管理策略融入到市场模型中，观察执行的效果如何。由于赌局的赔率为1赔1，即![r_{w}](https://juejin.cn/equation?tex=r_%7Bw%7D)\=![r_{l}](https://juejin.cn/equation?tex=r_%7Bl%7D)\=1。![P_{win}](https://juejin.cn/equation?tex=P_%7Bwin%7D)为win\_rate，![P_{loss}](https://juejin.cn/equation?tex=P_%7Bloss%7D)为1-win\_rate，凯利公式的实现代码如下所示：

```
once_chip = my_money[0] * (win_rate * 1 - (1 - win_rate))/1
```

我们邀请10人以凯利公式仓位管理下注参于50次抛硬币赌局，并可视化绘制最终的资金曲线，代码如下所示：

```
#仓位管理 手续费0.01 邀请10人参加50次
_ = [plt.plot(np.arange(50), positmanage(play_cnt=50, stock_num=9, commission=0.01),alpha=0.6)  for _ in np.arange(0,trader)]
"""
The Number is 49 and the money is 23463.70112762961
The Number is 49 and the money is 26191.212661818452
The Number is 49 and the money is 27994.06917292538
The Number is 49 and the money is 22447.09884815639
The Number is 49 and the money is 20881.123296678932
The Number is 49 and the money is 19876.340602724165
The Number is 49 and the money is 23521.098217624087
The Number is 49 and the money is 23284.103917960372
The Number is 49 and the money is 27442.132836923887
The Number is 49 and the money is 25183.026557126374
"""
```

从执行的结果可获悉到，加入凯利公式仓位管理策略后的资金收益比之前的方式又提升了不少，可视化资金曲线如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/27/16a5f083bedea445~tplv-t2oaga2asx-image.image)

## 总结

本小节介绍了凯利公式的实现方式，并且分别对比了全仓下注交易与凯利公式仓位管理方式之间的效果，以及普通的以概率优势下注与凯利公式仓位管理方式之间的效果，从中可知凯利公式在把控风险的前提下可以将收益最大化。

最后，给大家留一道思考题：

文中我们看到当赌局对交易者的胜算只有50\%时，凯利公式并不建议我们参与该赌局，那么凯利公式会让参与者满仓下注吗？

欢迎大家在留言区留言，我们一起讨论。
    