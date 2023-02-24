
# 股票数据获取-爬虫方式获取行业板块数据
---

# 爬虫方式获取行业板块数据

上一小节我们介绍了网络爬虫的原理和方法，本小节就以爬取东方财富网上行业板块当日的行情数据为场景来“激活”下网络爬虫这条数据来源。

## 东方财富网URL分析

掌握了获取HTML文件的方法后，理论上只需要在请求访问的API接口内传入目标URL即可。我们在Firefox浏览器的地址栏中输入网址http://quote.eastmoney.com/center/boardlist.html#industry\_board，打开东方财富网的行业板块网页，网页内容如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/8/169fc8b3a0db41e1~tplv-t2oaga2asx-image.image)

板块行情数据总共有4页，不过无论点击选取哪一页，地址栏内的网址始终无变化，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/8/169fc8b82fd5ade1~tplv-t2oaga2asx-image.image)

其实该网址返回的只是HTML文件中静态部分的内容，而数据的加载是采用了Ajax技术从服务器动态获取的，这种方式的好处是可以在不重新加载整幅网页的情况下更新部分数据，减轻网络负荷，加快页面加载速度。

我们以查看元素方式打开当前网页，点击选取第一页按钮的同时查看浏览器发起的网络请求数据，从中找到请求数据的网络地址，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/8/169fc8bc13749f3d~tplv-t2oaga2asx-image.image)

继续点击第二页、第三页按钮，从中可以发现网址结构组成中包括了多个参数，其中的参数p指定了访问页面的序号，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/8/169fc8bff509a73f~tplv-t2oaga2asx-image.image)

于是，我们可以通过修改\&p=后面的数字来访问不同页面对应的数据，考虑到可能会遇到像请求页面不存在之类的无法控制的错误，此处使用try...except...捕获异常情况，如下所示：

```
#访问行业板块数据
http = urllib3.PoolManager();
pages = 4
for p in range(1,pages+1):
    url = "http://nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?cb=jQuery1124012582582823807198_1554554782636&type=CT&token=4f1862fc3b5e77c150a2b985b12db0fd&sty=FPGBKI&js=({data:[(x)],recordsFiltered:(tot)})&cmd=C._BKHY&st=(ChangePercent)&sr=-1&p=%d"%p
    url += "&ps=20&_=1554554783027"
    try:
        resp_dat = http.request('GET', url)
        print(resp_dat.data.decode())
    except Exception as e:
        print(resp_dat.status)
        print(e)

#截取部分内容

jQuery1124012582582823807198_1554554782636({data:["1,BK0420,民航机场,4.89,722880510091,3.46,13|0|0|0,600115,1,东方航空,8.24,10.01,600004,1,白云机场,15.00,0.33,2,5197.44,242.40","1,BK0730,农药兽药,3.26,235251941025,4.79,20|1|6|0,002496,2,辉丰股份,3.36,10.16,002749,2,国光股份,24.98,-2.00,2,881.93,27.87","1,
......
BK0454,塑胶制品,1.07,316432353468,3.21,28|1|25|0,300061,2,康旗股份,9.97,10.04,000859,2,国风塑业,6.75,-3.02,2,8182.22,86.88","1,BK0485,旅游酒店,0.97,359159385337,2.29,25|2|10|0,000796,2,凯撒旅游,10.01,10.00,603099,1,长白山,12.06,-2.66,2,13489.94,129.60","1,BK0471,化纤行业,0.97,352420782551,2.87,17|2|5|1,601233,1,桐昆股份,17.15,6.85,002427,2,*ST尤夫,16.33,-5.00,2,11524.98,110.47","1,
......
BK0728,环保工程,0.63,326216322704,3.19,24|3|20|1,603588,1,高能环境,11.39,6.05,000068,2,华控赛格,6.05,-2.89,2,580.78,3.62"],recordsFiltered:61})
......
jQuery1124012582582823807198_1554554782636({data:["1,BK0734,珠宝首饰,0.04,91830365747,3.85,5|1|8|0,002740,2,爱迪尔,8.96,2.99,000587,2,金洲慈航,3.35,-1.47,2,572.00,0.22","1,

BK0440,工艺商品,-0.25,9419954908,2.12,1|0|2|0,603398,1,邦宝益智,14.83,1.23,300640,2,德艺文创,12.12,-1.46,2,29252.33,-72.07","1,BK0447,电子信息,-0.37,1044300223154,4.88,33|3|71|1,300250,2,初灵信息,19.10,10.02,300051,2,三五互联,8.13,-5.24,2,14709.00,-53.99","1,BK0737,软件服务,-0.40,1955401957807,5.05,50|3|110|0,002279,2,久其软件,10.30,10.04,300597,2,吉大通信,19.41,-10.01,2,760.63,-3.03","1,

BK0729,船舶制造,-1.06,249488792068,3.31,3|2|6|2,000880,2,潍柴重机,10.09,1.71,002552,2,宝鼎科技,8.69,-3.87,2,586.28,-6.30"],recordsFiltered:61})

```

## 解析并存储数据

对返回数据的结构分析后可知，行业板块数据以Json字符串形式存储，即在data:\[""\]的中括号内。比如“BK0734,珠宝首饰,0.04,91830365747,3.85,5|1|8|0,002740,2,爱迪尔,8.96,2.99,000587,2,金洲慈航,3.35,-1.47,2,572.00,0.22”。

提取的数据与网页显示的内容对应关系如下所示：

- 板块名称——珠宝首饰
- 涨跌幅——0.04
- 总市值——91830365747
- 换手率——3.85
- 上涨家数——5
- 下跌家数——8
- 领涨股票——爱迪尔
- 涨跌幅——2.99

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/8/169fc8e1f075ffb3~tplv-t2oaga2asx-image.image)

接下来先使用正则表达式对该字符串进行匹配筛选，使用时需要先导入re模块，如下所示：

```
import re
```

正则表达式中的re.compile方法用于定义查找的规则，此处匹配查找的规则为'BK\(.\*\?\)"'，表示匹配查找BK和“之间所有的内容， `re.findall`方法找寻出所有匹配的内容，如下所示:

```
#访问行业板块数据
http = urllib3.PoolManager();

pages = 4
conts = []
for p in range(1,pages+1):
    url = "http://nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?cb=jQuery1124012582582823807198_1554554782636&type=CT&token=4f1862fc3b5e77c150a2b985b12db0fd&sty=FPGBKI&js=({data:[(x)],recordsFiltered:(tot)})&cmd=C._BKHY&st=(ChangePercent)&sr=-1&p=%d"%p
    url += "&ps=20&_=1554554783027"
    try:
        resp_dat = http.request('GET', url)
        pattern = re.compile(r'BK(.*?)"')
        bk_list = re.findall(pattern,resp_dat.data.decode())
        for bk in bk_list:
            conts.append(bk)
        print(resp_dat.data.decode())
    except Exception as e:
        print(resp_dat.status)
        print(e)

print(conts)
#截取部分内容

['0420,民航机场,4.89,722880510091,3.46,13|0|0|0,600115,1,东方航空,8.24,10.01,600004,1,白云机场,15.00,0.33,2,5197.44,242.40', '0730,农药兽药,3.26,235251941025,4.79,20|1|6|0,002496,2,辉丰股份,3.36,10.16,002749,2,国光股份,24.98,-2.00,2,881.93,27.87', 
...... 
'0740,文教休闲,-1.07,320516157046,3.39,4|1|28|0,002103,2,广博股份,6.23,4.88,002105,2,信隆健康,5.59,-5.57,2,641.75,-6.94']

```

获取到列表形式的行业板块数据后，接下来将数据格式转换为DataFrame格式。首先指定列索引和数据形状创建DataFrame格式数据，如下所示：

```
df = pd.DataFrame(np.zeros((len(conts), 7)), columns=[u'板块名称', u'BK涨跌幅', u'总市值', u'换手率', u'涨跌家数', u'领涨股票', u'SK涨跌幅'])
```

然后将行业板块数据以逗号进行分割，分割后将对应的数据对号入座至DataFrame格式的对象内，如下所示：

```
for num, bk_dat in enumerate(conts) :
    bk_dat = bk_dat.split(',')
    df.loc[df.index[num], u'板块名称'] = bk_dat[1]
    df.loc[df.index[num], u'BK涨跌幅'] = bk_dat[2]
    df.loc[df.index[num], u'总市值'] = bk_dat[3]
    df.loc[df.index[num], u'换手率'] = bk_dat[4]
    df.loc[df.index[num], u'涨跌家数'] = bk_dat[5]
    df.loc[df.index[num], u'领涨股票'] = bk_dat[8]
    df.loc[df.index[num], u'SK涨跌幅'] = bk_dat[10]
```

转换为DataFrame对象后，很大好处是数据的处理可以直接使用Panads所支持的方法，比如使用`to_csv()`方法将数据存储为csv文件，该方法括号中第一个参数为存储路径，columns和index分别指定写入列索引和行索引内容，编码格式为'gb2312'，如果格式不对应的话存储的中文会为乱码，如下所示：

```
df.to_csv("table-bk.csv", columns=df.columns, index=True, encoding='gb2312')
#截取部分内容
"""
    板块名称  BK涨跌幅             总市值   换手率   涨跌家数    领涨股票  SK涨跌幅
0   民航机场   4.89        722880510091  3.46     13|0|0|0   东方航空  10.01
1   农药兽药   3.26        235251941025  4.79     20|1|6|0   辉丰股份  10.16
2   化肥行业   2.78        216040449454  4.00     16|3|4|0   鲁西化工  10.01
3   酿酒行业   2.49       2318076863369  2.45     31|1|6|1   燕京啤酒  10.04
4   化工行业   1.91       1653571306980  4.08    127|5|60|3   金禾实业  10.02
5     银行    1.75       10698284323170  0.43    30|0|2|0   常熟银行   4.62
......
"""
```

在当前的路径下另存了csv文件，打开文件可以看到行业板块数据已经存储到文件中，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/8/169fc9049d7fe91e~tplv-t2oaga2asx-image.image)

## 总结

本节主要介绍了如何爬取东方财富网行业板块数据的方法，其中所涉及到的关于Pandas的使用方法，同学们可以回顾下之前的知识点。此处所设计的教学例程，目的是为了让同学们能够对爬虫的流程有所了解，以扩展数据获取的途径，感兴趣的同学可以更深入地学习一些爬虫的技能。
    