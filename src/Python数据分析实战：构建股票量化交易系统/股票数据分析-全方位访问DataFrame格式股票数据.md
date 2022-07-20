
# 股票数据分析-全方位访问DataFrame格式股票数据
---

# 全方位访问DataFrame格式股票数据

## 前言

在量化交易系统开发中股票交易数据主要是以表格型的DataFrame数据结构存储，DataFrame数据结构的形式包括了行索引和列索引，以及行列索引对应下的元素。有了股票交易数据后，全方位、准确地从DataFrame格式数据中访问到我们所需要的数据是下一步对这些数据进行清洗、处理、建模等一系列的动作的前提条件。那么本小节重点讲解下全方位访问到DataFrame格式股票数据的方法。

## 行/列索引访问

首先我们通过`pandas-datareade`模块`data.DataReader()`方法获取到上证指数2018年1月1日至2月1日的交易数据，以作为我们本小节访问的例程数据，打印查看交易数据的前10行格式，如下所示：

```
# 获取上证指数交易数据 pandas-datareade模块data.DataReader()方法
df_stockload = web.DataReader("000001.SS", "yahoo", datetime.datetime(2018, 1, 1), datetime.datetime(2018, 2, 1))

df_stockload.head(10)  # 查看前几行
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

在pandas中`DataFrame.index`可以访问DataFrame全部的行索引，`DataFrame.columns`可以访问DataFrame全部的列索引，接下来我们用例程来分别展示下访问行/列索引的方法。

我们用`DataFrame.index`查看交易数据的行索引基本信息，需注意到的是`dtype`为'datetime64\[ns\]'，name为'Date'，如下所示：

```
print(df_stockload.index)  # 查看索引
"""
DatetimeIndex(['2018-01-02', '2018-01-03', '2018-01-04', '2018-01-05',
               '2018-01-08', '2018-01-09', '2018-01-10', '2018-01-11',
               '2018-01-12', '2018-01-15', '2018-01-16', '2018-01-17',
               '2018-01-18', '2018-01-19', '2018-01-22', '2018-01-23',
               '2018-01-24', '2018-01-25', '2018-01-26', '2018-01-29',
               '2018-01-30', '2018-01-31', '2018-02-01', '2018-02-02'],
              dtype='datetime64[ns]', name='Date', freq=None)
"""        
```

我们用`DataFrame.columns`查看交易数据的列索引基本信息，需注意到的是`dtype`为'object'，如下所示：

```
print(df_stockload.columns)  # 查看列名
"""
Index(['High', 'Low', 'Open', 'Close', 'Volume', 'Adj Close'], dtype='object')
"""
```

我们用`DataFrame.axes`查看交易数据行和列的轴标签基本信息`，DataFrame.axes`等价于`DataFrame.index`结`合DataFrame.columns`，如下所示：

```
print(df_stockload.axes)  # 查看行和列的轴标签 等价于df_stockload.index和df_stockload.columns
"""
Index(['2018-02-01', '2018-01-31', '2018-01-30', '2018-01-29', '2018-01-26',
       '2018-01-25', '2018-01-24', '2018-01-23', '2018-01-22', '2018-01-19',
       '2018-01-18', '2018-01-17', '2018-01-16', '2018-01-15', '2018-01-12',
       '2018-01-11', '2018-01-10', '2018-01-09', '2018-01-08', '2018-01-05',
       '2018-01-04', '2018-01-03', '2018-01-02'],
      dtype='object', name='date')
Index(['open', 'high', 'close', 'low', 'volume', 'price_change', 'p_change',
       'ma5', 'ma10', 'ma20', 'v_ma5', 'v_ma10', 'v_ma20'],
      dtype='object')
"""
```

## 行/列元素访问

一般而言，`DataFrame.values`可以访问DataFrame全部元素数值，以`numpy.ndarray`数据类型返回，例程如下所示：

```
print(df_stockload.values) # 访问全部元素数值
"""
[[  3349.05297852   3314.03100586   3314.03100586   3348.32592773

1. 3348.32592773]
   [  3379.91503906   3345.2890625    3347.74291992   3369.10791016
2. 3369.10791016]
   ......
   [  3495.09301758   3424.41894531   3478.66992188   3446.97998047
3. 3446.97998047]
   [  3463.1640625    3388.86010742   3419.22509766   3462.08105469
4. 3462.08105469]]
   """
print(type(df_stockload.values))  
"""
<class 'numpy.ndarray'>
"""
```

有时候我们不需要选取全部的元素，而只需要选取某一行、某一列、或是某几个元素，那怎么办呢？同学们大可放心，pandas提供了各种丰富的方法满足我们的要求。

假如我们要访问DataFrame的某列内容，可以通过类似字典标记的方式或属性的方式，指定列索引来访问DataFrame的某列内容，比如`DataFrame['Open']`或是`DataFrame.Open`方式访问'Open'列的元素，返回得到的'Open'列元素其实是Series数据结构，所以我们也可以把 DataFrame 看成是共享同一个 index 的 Series 数据结构的集合，如下所示：

```
print(df_stockload['Open']) #print(df_stockload.Open)
"""
Date
2018-01-02    3314.0
2018-01-03    3347.7
2018-01-04    3371.0
2018-01-05    3386.5
2018-01-08    3391.6
               ...  
2018-01-29    3563.6
2018-01-30    3511.5
2018-01-31    3470.5
2018-02-01    3478.7
2018-02-02    3419.2
Name: Open, Length: 24, dtype: float64
"""

print(type(df_stockload['Open'])) #查看列类型
"""
<class 'pandas.core.series.Series'>
"""
```

假如我们要访问某一行内容时，可以使用切片的方法，比如访问从索引0开始的第一行元素，我们使用`DataFrame[0:1]`方式，返回得到的元素是DataFrame数据结构，如下所示：

```
print(df_stockload[0:1])
"""
              High     Low    Open   Close  Volume  Adj Close
Date                                                         
2018-01-02  3349.1  3314.0  3314.0  3348.3  202300     3348.3
"""

print(type(df_stockload[0:1])) #查看行类型
"""
<class 'pandas.core.frame.DataFrame'>
"""
```

## 元素级的访问

假如我们要访问DataFrame中某几个元素时，可以使用Pandas提供的访问DataFrame元素级的方法，分别是`DataFrame.loc`、`DataFrame.iloc`和`DataFrame.ix`，这三个方法的使用比较容易混淆，我们具体来讲解下它们的使用方法。

`loc`是通过标签方式选取数据，`iloc`是通过位置方式选取数据，`ix`则是结合loc和iloc的特点，采用混合标签和位置的方式访问元素。

`loc`的选取规则：通过行和列标签组合的方式来选择数据，以逗号来区分行和列的指定，前半部分参数为指定行标签，后半部分参数指定为列标签，冒号指定了行或者列选取的范围。比如`DataFrame.loc['2018-01-02']`访问到'2018-01-02'这一行，所有列的元素。`DataFrame.loc['2018-01-02',['High','Low']]`选取了'2018-01-02'行对应的'High','Low'这两列的元素内容，如下所示：

```
print(df_stockload.loc['2018-01-02'])
"""
High           3349.1
Low            3314.0
Open           3314.0
Close          3348.3
Volume       202300.0
Adj Close      3348.3
Name: 2018-01-02 00:00:00, dtype: float64
"""
print(df_stockload.loc['2018-01-02',['High','Low']])
"""
High    3349.1
Low     3314.0
Name: 2018-01-02 00:00:00, dtype: float64
"""
```

`iloc`的选取规则：通过行和列位置组合的方式来选择数据，比如`DataFrame.iloc[0:2]`选取了前两行，所有列对应的元素。`DataFrame.iloc[0:2,0:1]`选取了前两行，第一列对应的元素。更方便的是我们除了指定某个范围方式选取外，也可以自由选取行和列的位置所对应的数据元素，比如`DataFrame.iloc[[0,2],[0,1]]`访问到了第0行和第2行，第一列和第二列对应的元素。

```
print(df_stockload.iloc[0:2,0:1])
"""
              High
Date              
2018-01-02  3349.1
2018-01-03  3379.9
"""
print(df_stockload.iloc[0:2])
"""
              High     Low    Open   Close  Volume  Adj Close
Date                                                         
2018-01-02  3349.1  3314.0  3314.0  3348.3  202300     3348.3
2018-01-03  3379.9  3345.3  3347.7  3369.1  213800     3369.1
"""
print(df_stockload.iloc[[0,2],[0,1]])
"""
              High     Low
Date                      
2018-01-02  3349.1  3314.0
2018-01-04  3392.8  3365.3
"""
```

其实`ix`是更灵活的访问dataframe元素的方法，不过ix方法已经被Panads弃用了，使用时解释器会提示IX Indexer is Deprecated警告，我们只能使用loc和iloc完成数据选取。

[\[官网声明内容\]:](http://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html)

> Warning:Starting in 0.20.0, the .ix indexer is deprecated, in favor of the more strict .iloc and .loc indexers.（警告：从0.20.0版本开始，ix索引选取被弃用了，用更严格的 .iloc和.loc代替）
> 
> .ix offers a lot of magic on the inference of what the user wants to do. To wit, .ix can decide to index positionally OR via labels depending on the data type of the index. This has caused quite a bit of user confusion over the years.
> 
> The recommended methods of indexing are:
> 
> - .loc if you want to label index.
> - .iloc if you want to positionally index.
> 
> 由于ix可以行索引和列索引分别由标签和位置混合方式来访问元素，会引起了使用者得困惑，所以建议使用loc或iloc更严格的方式选取元素。当行索引和列索引并不统一为标签或者位置时，则需要将其中一个进行转换，才可以使用loc或iloc方法。

如果从“High”列索引中获取第0个和第2个元素，以往使用ix的方法如下所示：

```
print(df_stockload.ix[[0, 2], 'High'])
"""
Date
2018-01-02    3349.1
2018-01-04    3392.8
Name: High, dtype: float64
"""
```

当使用`loc`前，需要将位置形式的行索引转换为标签形式的行索引后，再使用`loc`方法，如`DataFrame.index[[0, 2]]`将位置'0, 2'转换为标签'2018-01-02', '2018-01-04'，如下所示：

```
print(df_stockload.loc[df_stockload.index[[0, 2]], 'High'])
"""
Date
2018-01-02    3349.1
2018-01-04    3392.8
Name: High, dtype: float64
"""
print(df_stockload.index[[0, 2]])
"""
DatetimeIndex(['2018-01-02', '2018-01-04'], dtype='datetime64[ns]', name='Date', freq=None)
"""
```

当使用`iloc`前，需要将标签形式的列索引转换为位置形式的列索引，再使用`iloc`方法，如下所示：

```
print(df_stockload.iloc[[0, 2], df_stockload.columns.get_loc('High')])
"""
Date
2018-01-02    3349.1
2018-01-04    3392.8
Name: High, dtype: float64
"""
```

当以多个标签形式的列索引获取元素，如以“High”和“Open”列索引获取第0个和第2个元素，需要将多个标签形式的列索引转换为位置形式的列索引，再使用iloc方法，`DataFrame.columns.get_indexer(['High', 'Open'])`转换后为'\[0 2\]'，如下所示：

```
print(df_stockload.iloc[[0, 2], df_stockload.columns.get_indexer(['High', 'Open'])])
"""
              High    Open
Date                      
2018-01-02  3349.1  3314.0
2018-01-04  3392.8  3371.0
"""
```

当知道行索引为'2018-01-02', '2018-01-04'，如何获取到该行数据中'High'和 'Open'列下的元素呢？直接将\['2018-01-02', '2018-01-04'\]作为行标签索引传入loc方法，选取元素时会提示错误，引起不兼容的主要原因是此处DataFrame格式数据行索引的dtype为'datetime64\[ns\]'，传入的\['2018-01-02', '2018-01-04'\]行标签索引dtype为'object'，解决方法是使用pandas的`to_datetime`方法，将'object'类型的日期内容解析成 'datetime' 对象，这样可兼容dtype为'datetime64\[ns\]'的行索引，如下所示：

```
df_stockload.loc[['2018-01-02', '2018-01-04'], ['High','Open']]
"""
KeyError: "None of [Index(['2018-01-02', '2018-01-04'], dtype='object', name='Date')] are in the [index]"
"""
print(df_stockload.loc[[pd.to_datetime('2018-01-02'), pd.to_datetime('2018-01-04')], ['High','Open']])
"""
              High    Open
Date                      
2018-01-02  3349.1  3314.0
2018-01-04  3392.8  3371.0
"""
```

## 总结

本小节以实际的股票数据为例，讲解了访问DataFrame格式数据的几种方法，如`DataFrame.index`、`DataFrame.columns`、`DataFrame.values`、`DataFrame.loc`、`DataFrame.iloc`、`DataFrame.ix`等，这些方法在后续的量化交易开发中会频繁使用到，同学们务必要认真掌握，另外随着Panads弃用了ix方法，同学们特别要重点关注标签形式的行\\列索引与位置形式的行\\列索引之间的转换，可以帮助我们更灵活的访问DataFrame元素。

最后，给大家留一道思考题：

如何使用条件判断方式选取元素呢？比如行的选取条件是'High'列中数值大于平均值所对应的行，列的选取为全部列的元素。

欢迎大家在留言区留言，我们一起讨论。
    