
# 股票数据分析-遍历DataFrame格式股票数据的方法
---

# 股票数据分析：遍历DataFrame格式股票数据的方法

## 前言

在对股票数据分析中不可避免的涉及到对dataframe格式数据的遍历查询和处理，最常用的遍历方法是用for循环执行，当然Numpy 的矢量化方法可以用简洁的表达式代替for循环完成对数据的遍历。除了这两种方法之外，其实还有其他遍历dataframe格式数据的方法。本节通过实现单均线突破策略为例程，介绍对dataframe格式数据遍历的几种方法，并且对比各种方法的执行效率。

## 例程数据准备

单均线突破的交易策略为：若昨日收盘价高出过去20日平均价则今天开盘即买入股票；若昨日收盘价低于过去20日平均价，那么今天开盘卖出股票。因此需要遍历查询每个交易日收盘价与过去20日平均价的差值，并且标记查询的结果以提供交易操作。

首先我们选取前面小节中所介绍的股票交易数据接口来获取上证指数交易数据。我们使用pandas-datareade模块data.DataReader\(\)方法获取上证指数2018年1月1日至2019月1日1日的交易数据，以作为本小节遍历dataframe格式的例程数据，打印查看交易数据的前10行格式，如下所示：

```
# 获取上证指数交易数据 pandas-datareade模块data.DataReader()方法
df_stockload = web.DataReader("000001.SS", "yahoo", datetime.datetime(2018, 1, 1), datetime.datetime(2019, 1, 1))

# python3.7打印
print(df_stockload.head(10))  # 查看前10行
"""
              High     Low    Open   Close  Volume  Adj Close
Date                                                         
2018-01-02  3349.1  3314.0  3314.0  3348.3  202300     3348.3
2018-01-03  3379.9  3345.3  3347.7  3369.1  213800     3369.1
2018-01-04  3392.8  3365.3  3371.0  3385.7  207000     3385.7
2018-01-05  3402.1  3380.2  3386.5  3391.8  213100     3391.8
2018-01-08  3412.7  3384.6  3391.6  3409.5  236200     3409.5
2018-01-09  3417.2  3403.6  3406.1  3413.9  191500     3413.9
2018-01-10  3430.2  3398.8  3414.1  3421.8  209100     3421.8
2018-01-11  3426.5  3405.6  3415.6  3425.3  173800     3425.3
2018-01-12  3435.4  3418.0  3423.9  3428.9  174100     3428.9
2018-01-15  3442.5  3402.3  3429.0  3410.5  232000     3410.5
"""
```

其次使用df.rolling\(\).mean\(\)方法计算得到M20移动平均线，该方法只需提供收盘价和移动平均时间窗口大小即可，如下所示：

```
df_stockload['Ma20'] = df_stockload.Close.rolling(window=20).mean()#增加M20移动平均线
print(df_stockload.head())  # 查看前5行
"""
              High     Low    Open   Close  Volume  Adj Close  Ma20
Date                                                               
2018-01-02  3349.1  3314.0  3314.0  3348.3  202300     3348.3   NaN
2018-01-03  3379.9  3345.3  3347.7  3369.1  213800     3369.1   NaN
2018-01-04  3392.8  3365.3  3371.0  3385.7  207000     3385.7   NaN
2018-01-05  3402.1  3380.2  3386.5  3391.8  213100     3391.8   NaN
2018-01-08  3412.7  3384.6  3391.6  3409.5  236200     3409.5   NaN

[5 rows x 7 columns]
"""
print(df_stockload.tail())  # 查看末5行
"""
              High     Low    Open   Close  Volume  Adj Close    Ma20
Date                                                                 
2018-12-25  2514.0  2462.8  2503.9  2504.8  136500     2504.8  2587.8
2018-12-26  2513.8  2492.1  2501.1  2498.3  108800     2498.3  2582.6
2018-12-27  2532.0  2483.1  2527.7  2483.1  135400     2483.1  2578.4
2018-12-28  2505.1  2478.3  2483.6  2493.9  119200     2493.9  2573.7
2019-01-02  2500.3  2456.4  2497.9  2465.3  109900     2465.3  2564.2

[5 rows x 7 columns]
"""
```

由于Ma20移动平均线是由20日的收盘价计算平均值得到的，因此只有在第20个交易日时才能得到第一个Ma20移动平均线数值，我们需要处理下前19个交易日中Ma20列的NaN值。可以使用DataFrame.dropna\(\)方法删除NaN值。其中参数axis=0表示删除包含缺失值行，axis=1表示删除包含缺失值列；参数how=any表示只要有一个缺失值就删除该行或列，how=all表示只有当所有值都为缺失值时才删除该行或列。此处选择只要有一个缺失值就删除包含缺失值所在的行，如下所示：

```
df_stockload.dropna(axis=0,how='any',inplace=True)#NAN值删除
print(df_stockload.head())  # 查看前5行
"""
              High     Low    Open   Close  Volume  Adj Close    Ma20
Date                                                                 
2018-01-29  3587.0  3510.3  3563.6  3523.0  236000     3523.0  3454.3
2018-01-30  3523.1  3484.7  3511.5  3488.0  186400     3488.0  3461.3
2018-01-31  3495.5  3454.7  3470.5  3480.8  207300     3480.8  3466.8
2018-02-01  3495.1  3424.4  3478.7  3447.0  260500     3447.0  3469.9
2018-02-02  3463.2  3388.9  3419.2  3462.1  208100     3462.1  3473.4

[5 rows x 7 columns]
"""
```

至此，我们完成了实现单均线突破策略的前期数据准备工作，接下来我们分别介绍下遍历dataframe格式数据的几种方法。

## for..in循环方式

首先我们使用for..in循环方式实现单均线突破策略。for..in循环遍历的方式是Python中最常用的方式，其中的原理我们在《前置基础：玩转Python遍历工具for..in》中已经介绍。

我们遍历全部交易日的收盘价数值和Ma20数值，将收盘价数值减去Ma20数值，并使用np.sign\(\)取差值符号，当收盘价在Ma20上方时差值为正，收盘价在Ma20上下方时差值为负，由负转正对应为买点，由正转负对应为卖点。如下所示：

```
def forin_looping(df):
    df['signal'] = 0 #df = df.assign(signal = 0)  #可采用assign新增一列
    for i in np.arange(0,df.shape[0]):
        df.iloc[i,df.columns.get_loc('signal')] = np.sign(df.iloc[i]['Close'] - df.iloc[i]['Ma20'])
    return df
print(forin_looping(df_stockload)[0:5])
"""
              High     Low    Open   Close  Volume  Adj Close    Ma20  signal
Date                                                                         
2018-01-29  3587.0  3510.3  3563.6  3523.0  236000     3523.0  3454.3     1.0
2018-01-30  3523.1  3484.7  3511.5  3488.0  186400     3488.0  3461.3     1.0
2018-01-31  3495.5  3454.7  3470.5  3480.8  207300     3480.8  3466.8     1.0
2018-02-01  3495.1  3424.4  3478.7  3447.0  260500     3447.0  3469.9    -1.0
2018-02-02  3463.2  3388.9  3419.2  3462.1  208100     3462.1  3473.4    -1.0
"""
```

## iterrows\(\)生成器方式

另一种Python中常用的遍历方式为iterrows\(\)生成器方式。所谓生成器其实是一种特殊的迭代器，内部支持了迭代器协议。Python中提供生成器函数和生成器表达式两种方式实现生成器，每次请求返回一个结果，不需要一次性构建一个结果列表，节省了内存空间。在Python 2中可使用xrange返回一个迭代器，用来一次一个值地遍历一个范围，这种方式会比range更省内存。在Python 3中xrange已经改名为range。

我们先了解下生成器函数方式实现生成器。这种方式编写为常规的def语句，使用yield语句一次返回一个结果，在每个结果之间挂起和继续它们的状态，例程代码如下所示：

```
# 生成器函数方式实现生成器
def gensquares(N):
	for i in range(N):
		yield i**2 
        
print(gensquares(5))
#打印结果：
<generator object gensquares at 0x11a35cf48>

for i in gensquares(5):
	print(i) 
# 打印结果：
0
1
4
9
16
```

生成器表达式方式实现生成器就是类似列表解析，按需产生结果的一个对象，例程代码如下所示：

```
# 生成器表达式方式实现生成器
print(x**2 for x in range(5))
# 打印结果：
<generator object <genexpr> at 0xb3d31fa4>

print(list(x**2 for x in range(5)))
# 打印结果：
[0, 1, 4, 9, 16]
```

通过iterrows\(\)遍历方式计算股票每个交易日收盘价与Ma20差值，此处iterrows是对dataframe格式数据行进行迭代的一个生成器，它返回每行的索引及包含行本身的对象，代码如下所示：

```
#iterrows()遍历方式
def iterrows_loopiter(df):
    df['signal'] = 0 #df = df.assign(signal = 0)  #可采用assign新增一列
    for index,row in df.iterrows():
        df.loc[index, 'signal'] = np.sign(row['Close']-row['Ma20'])
    return df
print(iterrows_loopiter(df_stockload)[0:5])

"""
              High     Low    Open   Close  Volume  Adj Close    Ma20  signal
Date                                                                         
2018-01-29  3587.0  3510.3  3563.6  3523.0  236000     3523.0  3454.3     1.0
2018-01-30  3523.1  3484.7  3511.5  3488.0  186400     3488.0  3461.3     1.0
2018-01-31  3495.5  3454.7  3470.5  3480.8  207300     3480.8  3466.8     1.0
2018-02-01  3495.1  3424.4  3478.7  3447.0  260500     3447.0  3469.9    -1.0
2018-02-02  3463.2  3388.9  3419.2  3462.1  208100     3462.1  3473.4    -1.0
"""
```

## apply\(\)循环方式

apply\(\)方法可将函数应用于dataframe特定行或列。函数由lambda方式在代码中内嵌实现，lambda 为匿名函数，可以省去定义函数的过程，让代码更加精简。lambda函数的末尾包含axis参数，用来告知Pandas将函数运用于行（axis = 1）或者列（axis = 0）。apply\(\)方法循环方式实现的代码如下所示：

```
df_stockload['signal'] = df_stockload.apply(lambda row: (np.sign(row['Close']-row['Ma20'])), axis = 1)
print(df_stockload.head())
"""
              High     Low    Open   Close  Volume  Adj Close    Ma20  signal
Date                                                                         
2018-01-29  3587.0  3510.3  3563.6  3523.0  236000     3523.0  3454.3     1.0
2018-01-30  3523.1  3484.7  3511.5  3488.0  186400     3488.0  3461.3     1.0
2018-01-31  3495.5  3454.7  3470.5  3480.8  207300     3480.8  3466.8     1.0
2018-02-01  3495.1  3424.4  3478.7  3447.0  260500     3447.0  3469.9    -1.0
2018-02-02  3463.2  3388.9  3419.2  3462.1  208100     3462.1  3473.4    -1.0
"""
```

## 矢量化遍历方式

此处我们主要处理一维数组之间的计算，那么矢量化方式可使用Pandas series 的矢量化方式和Numpy arrays的矢量化方式两种。先来看下Pandas series 的矢量化方式。Pandas的DataFrame、series基础单元数据结构基于链表，因此可将函数在整个链表上进行矢量化操作，而不用按顺序执行每个值。Pandas包括了非常丰富的矢量化函数库，我们可把整个series（列）作为参数传递，对整个链表进行计算。Pandas series 的矢量化方式实现代码如下：

```
#Pandas series 的矢量化方式
df_stockload['signal'] = np.sign(df_stockload['Close']-df_stockload['Ma20'])
print(df_stockload.head())
"""
              High     Low    Open   Close  Volume  Adj Close    Ma20  signal
Date                                                                         
2018-01-29  3587.0  3510.3  3563.6  3523.0  236000     3523.0  3454.3     1.0
2018-01-30  3523.1  3484.7  3511.5  3488.0  186400     3488.0  3461.3     1.0
2018-01-31  3495.5  3454.7  3470.5  3480.8  207300     3480.8  3466.8     1.0
2018-02-01  3495.1  3424.4  3478.7  3447.0  260500     3447.0  3469.9    -1.0
2018-02-02  3463.2  3388.9  3419.2  3462.1  208100     3462.1  3473.4    -1.0
"""
```

对于Numpy arrays的矢量化方式，由于本例的矢量化运算中只使用了series的数值，无需使用索引等信息，因此可将series转换为array类型，节省操作过程中的很多开销。我们可使用values 方法将链表从Pandas series转换为NumPy arrays，把NumPy array作为参数传递，对整个链表进行计算。Numpy arrays的矢量化方式实现代码如下：

```
#Numpy arrays的矢量化方式
df_stockload['signal'] = np.sign(df_stockload['Close'].values-df_stockload['Ma20'].values)
print(df_stockload.head())
"""
              High     Low    Open   Close  Volume  Adj Close    Ma20  signal
Date                                                                         
2018-01-29  3587.0  3510.3  3563.6  3523.0  236000     3523.0  3454.3     1.0
2018-01-30  3523.1  3484.7  3511.5  3488.0  186400     3488.0  3461.3     1.0
2018-01-31  3495.5  3454.7  3470.5  3480.8  207300     3480.8  3466.8     1.0
2018-02-01  3495.1  3424.4  3478.7  3447.0  260500     3447.0  3469.9    -1.0
2018-02-02  3463.2  3388.9  3419.2  3462.1  208100     3462.1  3473.4    -1.0
"""
```

## 执行效率对比

使用timeit方法对以上几种遍历方式进行执行时间测试，测试代码如下所示：

```
#使用timeit方法对比方法参考例程如下，需要import timeit模块：
from timeit import timeit
def test1():
    forin_looping(df_stockload)
def test2():
    iterrows_loopiter(df_stockload)
def test3():
    df_stockload['signal'] = df_stockload.apply(lambda row: (np.sign(row['Close'] - row['Ma20'])), axis=1)
def test4():
    df_stockload['signal'] = np.sign(df_stockload['Close']-df_stockload['Ma20'])
def test5():
    df_stockload['signal'] = np.sign(df_stockload['Close'].values - df_stockload['Ma20'].values)

#for..in循环迭代方式
t1 = timeit('test1()', 'from __main__ import test1', number=100)
#iterrows()遍历方式
t2 = timeit('test2()', 'from __main__ import test2', number=100)
#apply()方法循环方式
t3 = timeit('test3()', 'from __main__ import test3', number=100)
#Pandas series 的矢量化方式
t4 = timeit('test4()', 'from __main__ import test4', number=100)
#Numpy arrays的矢量化方式：
t5 = timeit('test5()', 'from __main__ import test5', number=100)

print(t1,t2,t3,t4,t5)
#14.943237108999998 8.827773373 0.5511996379999999 0.02215727200000117 0.012933490000001768
```

由于测试环境千差万别，此处测试结果仅供同学们对于几种遍历方式横向对比参考，测试结果如下所示：

```
loop: 14.943235208999998
iterrows: 8.826773373
apply: 0.5511994379999999
pandas series: 0.02216327200000117 
numpy array: 0.012934390000001768
```

可以看出循环执行的速度是最慢的，iterrows\(\)针对Pandas的dataframe进行了优化，相比直接循环有显著提升。apply\(\)方法也是在行之间进行循环，但由于利用了类似Cython的迭代器的一系列全局优化，其效率要比iterrows高很多。NumPy arrays的矢量化运行速度最快，其次是Pandas series矢量化。由于矢量化是同时作用于整个序列的，可以节省更多的时间，相比使用标量操作更好，NumPy使用预编译的C代码在底层进行优化，同时也避免了Pandas series操作过程中的很多开销，例如索引、数据类型等等，因此，NumPy arrays的操作要比Pandas series快得多。

## 总结

本节介绍了遍历dataframe数据的几种方法，并且对这些方法的执行效率进行了直观的比较。我们看到循环执行的速度是最慢的，而矢量化方法的效率却出奇的高，这也是为什么NumPy库广泛应用在数据处理中的重要原因，我相信同学们在本小节的学习后对遍历数据时的执行效率有一定的认识，能够选择更合适的遍历方法去处理数据。

最后，给大家留一道思考题：

我们对几种遍历方式经过横向对比发现了它们执行速度的快慢顺序，由于矢量化是同时作用于整个序列的，可以节省更多的时间，相比使用标量操作当然效率更高，那么NumPy arrays的操作为什么会比Pandas series快得多呢？

欢迎大家在留言区留言，我们一起讨论。
    