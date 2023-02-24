
# 技术指标可视化-pyecharts实现Web版股票行情界面
---

# pyecharts实现Web版股票行情界面

## 前言

众所周知，Python中最常用的绘图工具是Matplotlib库，但随着Web技术的蓬勃发展，以网页形式在浏览器上显示图表已经逐渐成为一种主流的形式。

网页的实现是由HTML、CSS和Javascript三者相结合完成的，HTML负责网页的结构，CSS渲染网页元素的样式，而Javascript给网页增加了动态的行为，总体来看，网页版本的图表在显示效果上可以达到更加生动、炫酷的要求。

比如目前非常流行的`echarts`库，它是百度开源的基于Javascript的可视化库，用于生成商业级数据图表，可以流畅的运行在PC和移动设备上，兼容当前绝大部分浏览器（IE6/7/8/9/10/11，chrome，firefox，Safari等），用它所生成的图表可视化效果非常好。

但是使用echarts还是需要一定的前端知识，为了使它能够与Python对接，有团队推出了Python的网页版可视化库pyecharts，无需涉及任何前端的编程，仅仅利用几行Python代码就能轻松在Python中生成echarts风格的图表，通过浏览器即可打开查看，使用起来很简单，图表效果也非常美观大方。在此特意向同学们推荐这个工具，扩展大家的数据可视化实现方法。

本小节以制作Web版股票行情界面为场景，为同学们介绍下`pyecharts`库的使用，以契合大家对Web版图表显示的需求。

## Kline方法绘制K线图

pyecharts支持折线图、柱状图（条状图）、散点图、K线图、饼图、雷达图、和弦图、力导向布局图、地图、仪表盘、漏斗图、事件河流图等12类图表，需要使用那类图表则在使用前导入对应的类，此处导入Kline类绘制K线图，如下所示：

```
from pyecharts import Kline
```

pyecharts的使用比较简单，我们一步一步来实现K线图的绘制。首先是实例一个`Kline`类型图表对象，如下所示：

```
kline = Kline("K 线图示例")
```

接下来在图表对象上添加数据及配置项。`Kline.add(name, x_axis,y_axis, **kwargs)`方法中参数如下所示：

 -    name — 图例名称（str）
 -    x\_axis — x坐标轴数据（list）
 -    y\_axis — y坐标轴数据（\[list\]），数据格式为嵌套的列表，列表的元素为\[open, close, lowest, highest\]格式的数据项，每个数据项代表一个交易日的\[开盘值, 收盘值, 最低值, 最高值\]），比如：

```
v1 = [[2320.26, 2320.26, 2287.3, 2362.94], [2300, 2291.3, 2288.26, 2308.38],
      [2295.35, 2346.5, 2295.35, 2345.92], [2347.22, 2358.98, 2337.35, 2363.8],
      [2360.75, 2382.48, 2347.89, 2383.76], [2383.43, 2385.42, 2371.23, 2391.82],
      [2377.41, 2419.02, 2369.57, 2421.15], [2425.92, 2428.15, 2417.58, 2440.38],
      [2411, 2433.13, 2403.3, 2437.42], [2432.68, 2334.48, 2427.7, 2441.73],
      [2430.69, 2418.53, 2394.22, 2433.89], [2416.62, 2432.4, 2414.4, 2443.03],
      [2441.91, 2421.56, 2418.43, 2444.8], [2420.26, 2382.91, 2373.53, 2427.07],
      [2383.49, 2397.18, 2370.61, 2397.94], [2378.82, 2325.95, 2309.17, 2378.82],
      [2322.94, 2314.16, 2308.76, 2330.88], [2320.62, 2325.82, 2315.01, 2338.78],
      [2313.74, 2293.34, 2289.89, 2340.71], [2297.77, 2313.22, 2292.03, 2324.63],
      [2322.32, 2365.59, 2308.92, 2366.16], [2364.54, 2359.51, 2330.86, 2369.65],
      [2332.08, 2273.4, 2259.25, 2333.54], [2274.81, 2326.31, 2270.1, 2328.14],
      [2333.61, 2347.18, 2321.6, 2351.44], [2340.44, 2324.29, 2304.27, 2352.02],
      [2326.42, 2318.61, 2314.59, 2333.67], [2314.68, 2310.59, 2296.58, 2320.96],
      [2309.16, 2286.6, 2264.83, 2333.29], [2282.17, 2263.97, 2253.25, 2286.33],
      [2255.77, 2270.28, 2253.31, 2276.22]]
```

- \*\*kwargs — 可以扩展各种参数，比如`is_datazoom_show`设置图表数据缩放，`mark_point和mark_line`分别在图表上标注点和线

此处按需求分别添加数据和各类配置项，其中 x坐标轴的数据为日期格式，y坐标轴的数据为以上所列的v1嵌套列表格式，并且设置为图标数据可缩放，在图表上以标注点和标注线形式标注出最大值，如下所示：

```
kline.add("日K", ["2018/9/{}".format(i + 1) for i in range(30)], v1, is_datazoom_show=True,\
        mark_line=["max"], mark_point=["max"])
```

接下来的两句代码可以将以上所配置的选项渲染成图表，并在当前路径下生成k.html文件，如下所示：

```
kline.show_config()
kline.render(r'k.html')
```

使用浏览器可以打开k.html文件进行浏览，显示效果如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/1/169d8f9de2b468a5~tplv-t2oaga2asx-image.image)

再进一步，我们将数据v1替换为上证指数交易数据进行显示。使用前面小节所介绍的股票交易数据接口来获取上证指数交易数据，并转换为Kline中所支持的数据格式，如下所示：

```
df_stockload = web.DataReader("000001.SS", "yahoo", datetime.datetime(2018, 1, 1), datetime.datetime(2019, 1, 1))
# 数据转换
ohlc = list(zip(df_stockload.Open,df_stockload.Close,df_stockload.Low,df_stockload.High))
dates = df_stockload.index.strftime('%Y-%m-%d')
```

将dates和ohlc数据分别作为kline的x坐标轴数据和y坐标轴数据。同时为了避免x 轴标签过于密集而导致重叠显示，可采用xaxis\_rotate配置使标签旋转。如下所示：

```
kline.add("日K", dates, ohlc, is_datazoom_show=True,\
        mark_line=["max"], mark_point=["max"], xaxis_rotate=30)
```

完整例程代码如下所示：

```
from pyecharts import Kline
import pandas_datareader.data as web
import datetime
df_stockload = web.DataReader("000001.SS", "yahoo", datetime.datetime(2018, 1, 1), datetime.datetime(2019, 1, 1))
kline = Kline("行情显示图")
# 数据转换
ohlc = list(zip(df_stockload.Open,df_stockload.Close,df_stockload.Low,df_stockload.High))
dates = df_stockload.index.strftime('%Y-%m-%d')

kline.add("日K", dates, ohlc, is_datazoom_show=True,\
        mark_line=["max"], mark_point=["max"], xaxis_rotate=30, yaxis_min=0.9*min(df_stockload["Low"]))

kline.show_config()
kline.render(r'k.html')
```

使用浏览器可以打开k.html文件进行浏览，显示效果如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/1/169d8facb0e3f843~tplv-t2oaga2asx-image.image)

## Line方法绘制移动平均线

移动平均线采用折线图绘制，折线图是将各个数据点以折线方式连接起来，用于展现数据的变化趋势，此处导入Line类绘制均线图，如下所示：

```
from pyecharts import Line
```

接下来是实例一个`Line`类型图表对象，如下所示：

```
line = Line("移动平均线图示例")
```

接下来在图表对象上添加数据及配置项。`Line.add(name, x_axis, y_axis, is_symbol_show=True, is_smooth=False, is_stack=False, is_step=False, is_fill=False, **kwargs)`方法中参数如下所示：

- name — 图例名称（str）
- x\_axis — x坐标轴数据（list）
- y\_axis — y坐标轴数据（list）
- is\_symbol\_show — 是否显示标记图形（bool），默认为 True
- is\_smooth — 是否平滑曲线显示（bool），默认为 False
- is\_stack — 数据堆叠（bool），同个类目轴上配置相同的stack值可以堆叠放置，默认为 False
- is\_step — 是否是阶梯线图（bool/str），可以设置为 True 显示成阶梯线图，默认为 False；也支持设置成'start', 'middle', 'end'分别配置在当前点，当前点与下个点的中间下个点拐弯
- is\_fill — 是否填充曲线所绘制面积（bool），默认为 False

Line的数据支持list格式，因此在计算得到M20、M30、M60移动平均线后需要转换为list，如下所示：

```
df_stockload = web.DataReader("000001.SS", "yahoo", datetime.datetime(2018, 1, 1), datetime.date.today())
df_stockload['Ma20'] = df_stockload.Close.rolling(window=20).mean()  
df_stockload['Ma30'] = df_stockload.Close.rolling(window=30).mean()  
df_stockload['Ma60'] = df_stockload.Close.rolling(window=60).mean()  

dates = df_stockload.index.strftime('%Y-%m-%d')

indic_name_list = ['Ma20','Ma30','Ma60']
for indic_ma in indic_name_list:
      line.add(indic_ma, dates, df_stockload[indic_ma].tolist(),is_smooth=True)
```

完整例程代码如下所示：

```
from pyecharts import Line
import pandas_datareader.data as web
import datetime
# example1 Line
line = Line("移动平均线图示例")

df_stockload = web.DataReader("000001.SS", "yahoo", datetime.datetime(2018, 1, 1), datetime.date.today())
df_stockload['Ma20'] = df_stockload.Close.rolling(window=20).mean()  # pd.rolling_mean(df_stockload.Close,window=20)
df_stockload['Ma30'] = df_stockload.Close.rolling(window=30).mean()  # pd.rolling_mean(df_stockload.Close,window=30)
df_stockload['Ma60'] = df_stockload.Close.rolling(window=60).mean()  # pd.rolling_mean(df_stockload.Close,window=60)

dates = df_stockload.index.strftime('%Y-%m-%d')

indic_name_list = ['Ma20','Ma30','Ma60']
for indic_ma in indic_name_list:
      line.add(indic_ma, dates, df_stockload[indic_ma].tolist(),is_smooth=True,yaxis_min=0.9*min(df_stockload["Low"]))#is_smooth 平滑曲线显示

line.show_config()
line.render(r'average.html')
```

使用浏览器可以打开average.html文件进行浏览，显示效果如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/1/169d8fc137f24192~tplv-t2oaga2asx-image.image)

## Bar方法绘制成交量

成交量采用柱状图绘制，通过柱形的高度来表现成交量数据的大小，此处导入Bar类绘制柱状成交量图，如下所示：

```
from pyecharts import Bar
```

接下来是实例一个`Bar`类型图表对象，如下所示：

```
bar = Bar('柱状图表渲染', '成交量显示')
```

接下来在图表对象上添加数据及配置项。`Bar.add(name, x_axis, y_axis,is_stack=False, bar_category_gap='20%', **kwargs)`方法中参数如下所示：

- name — 图例名称（str）
- x\_axis — x坐标轴数据（list）
- y\_axis — y坐标轴数据（list）
- is\_stack — 数据堆叠（bool），当设置为 True时可形成堆积柱形图，优点是可以形象的展示一个大分类包含的每个小分类的数据，以及小分类的占比情况，显示单个项目与整体之间的关系
- bar\_category\_gap — 堆叠柱状之间的距离（int/str），当设置为 0 时柱状是紧挨着（直方图类型），默认为 '20\%'

由于成交量在股价上涨时显示为红色，在股价下跌时显示为绿色，我们将成交量数据分为上涨成交量列表和下跌成交量列表，上涨成交量列表中将下跌的成交量值设置为0，同理下跌成交量列表中将上涨成交量值设置为0，然后将两者以堆叠柱状方式呈现，如下所示：

```
df_stockload = web.DataReader("000001.SS", "yahoo", datetime.datetime(2018, 1, 1), datetime.datetime(2019, 1, 1))
# 数据转换
dates = df_stockload.index.strftime('%Y-%m-%d')

volume_rise=[df_stockload.Volume[x] if df_stockload.Close[x] > df_stockload.Open[x] else "0" for x in range(0, len(df_stockload.index))]
volume_drop=[df_stockload.Volume[x] if df_stockload.Close[x] <= df_stockload.Open[x] else "0" for x in range(0, len(df_stockload.index))]
```

将`dates`作为bar的x坐标轴数据，`volume_rise`和`volume_drop`分别作为堆叠柱状的y坐标轴数据，通过 `label_color`来设置柱状的颜色，如下所示：

```
bar.add("rvolume", dates, volume_rise, is_stack=True, label_color=["#218868"], is_datazoom_show=True)
bar.add("dvolume", dates, volume_drop, is_stack=True, label_color=["#FA8072"], is_datazoom_show=True)
```

完整例程代码如下所示：

```
from pyecharts import Bar
import pandas_datareader.data as web
import datetime

# example1 Bar
bar = Bar('柱状图表渲染', '成交量显示')

df_stockload = web.DataReader("000001.SS", "yahoo", datetime.datetime(2018, 1, 1), datetime.datetime(2019, 1, 1))
# 数据转换
dates = df_stockload.index.strftime('%Y-%m-%d')

volume_rise=[df_stockload.Volume[x] if df_stockload.Close[x] > df_stockload.Open[x] else "0" for x in range(0, len(df_stockload.index))]
volume_drop=[df_stockload.Volume[x] if df_stockload.Close[x] <= df_stockload.Open[x] else "0" for x in range(0, len(df_stockload.index))]

bar.add("rvolume", dates, volume_rise, is_stack=True, label_color=["#218868"], is_datazoom_show=True)
bar.add("dvolume", dates, volume_drop, is_stack=True, label_color=["#FA8072"], is_datazoom_show=True)

bar.show_config()
bar.render(r'volume.html')#渲染图表，指定生成volume.html文件
```

使用浏览器可以打开volume.html文件进行浏览，显示效果如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/1/169d8fdbabe2c0c5~tplv-t2oaga2asx-image.image)

## EffectScatter方法绘制买卖点

当出现买卖信号的时候可以利用带有动画特效的散点图进行指示，此处导入`EffectScatter`类绘制散点图，如下所示：

```
from pyecharts import EffectScatter
```

接下来是实例一个EffectScatter类型图表对象，如下所示：

```
es = EffectScatter("动态散点图示例")
```

接下来在图表对象上添加数据及配置项。`EffectScatter.add(name, x_axis, y_axis, symbol_size=10, **kwargs)`方法中参数如下所示：

- name — 图例名称（str）
- x\_axis — x坐标轴数据（list）
- y\_axis — y坐标轴数据（list）
- symbol\_size — 标记图形大小（int），默认为 10

此处\*\*kwargs扩展的参数中，可使用`effect_scale`和`effect_period`可设置动画显示效果，`symbol`实现动态散点图的各种图形，如下所示：

```
#带有涟漪特效动画的散点图
es.add("buy signal", [10],[10],symbol_size=20,effect_scale=3.5,effect_period=3,symbol="pin")
es.add("buy signal", [30],[30],symbol_size=30,effect_scale=5.5,effect_period=5,symbol="roundRect")
es.add("sell signal", [20],[20],symbol_size=12,effect_scale=4.5,effect_period=4,symbol="rect")
es.add("sell signal", [50],[50],symbol_size=16,effect_scale=5.5,effect_period=3,symbol="arrow")
```

完整例程代码如下所示：

```
from pyecharts import EffectScatter
# example1 EffectScatter
es = EffectScatter("动态散点图示例")
#带有涟漪特效动画的散点图
es.add("buy signal", [10],[10],symbol_size=20,effect_scale=3.5,effect_period=3,symbol="pin")
es.add("buy signal", [30],[30],symbol_size=30,effect_scale=5.5,effect_period=5,symbol="roundRect")
es.add("sell signal", [20],[20],symbol_size=12,effect_scale=4.5,effect_period=4,symbol="rect")
es.add("sell signal", [50],[50],symbol_size=16,effect_scale=5.5,effect_period=3,symbol="arrow")

es.show_config()
es.render(r'signal.html')
```

使用浏览器可以打开signal.html文件进行浏览，显示效果如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/1/169d8fefd314dcd6~tplv-t2oaga2asx-image.image)

## 技术指标在图表上的集成

股票行情界面中包括了K线、均线、成交量等技术指标，通常K线、均线、买卖点为一个图表，成交量为一个图表，那么我们势必要将以上分立显示的指标按要求结合在同一个html页面中直观显示。

pyecharts提供了`Overlap`和`Grid`两个类实现自定义图表的绘制。`Overlap`类自定义结合`Line/Bar/Kline/EffectScatter` 图表，将不同类型图表画在一张图上，利用第一个图表为基础，往后的数据都将会画在第一个图表上。`Grid`类自定义结合`Line/Bar/Kline/EffectScatter`图表，将不同类型图表画在多张图上。

此处我们的要求是使用`Overlap`类先将`Line`、`Kline`、`EffectScatter`图形绘制在一个图表上，图形共用同一个x和y坐标轴。再将`Overlap`类结合后的图表与`Bar`共同放入`Grid`类中形成两个图表。此处需要新增导入`Overlap`类、`Grid`类绘制自定义图表，如下所示：

```
from pyecharts import Grid,Overlap,Line,Bar,EffectScatter,Kline
```

Overlap使用时是利用第一个图表为基础，往后的数据都将画在第一个图表上。首先实例化Overlap类，然后使用`Overlap.add()`方法将之前绘制的kline、line、es数据加入至图表中。关于`Overlap.add(chart, xaxis_index=0, yaxis_index=0, is_add_xaxis=False, is_add_yaxis=False)`方法中参数介绍，如下所示：

- chart — chart instance图表示例
- xaxis\_index — x 坐标轴索引int，默认为 0
- yaxis\_index — y 坐标轴索引int，默认为 0
- is\_add\_xaxis — 是否新增一个 x 坐标轴bool，默认为 False
- is\_add\_yaxis — 是否新增一个 y 坐标轴bool，默认为 False

此处使用默认的参数设置来添加kline、line、es数据至图表中，如下所示：

```
overlap = Overlap()
overlap.add(kline)
overlap.add(line)
overlap.add(es)
```

Grid类使用时是将不同类型图表画在多张图上。首先实例化Grid类，然后使用`Grid.add()`方法分别添加overlap和bar图表。关于`Grid.add(chart, grid_width=None, grid_height=None,grid_top=None, grid_bottom=None, grid_left=None, grid_right=None)`方法中参数介绍，如下所示：

- chart —chart instance图表实例
- grid\_width — str/int grid 组件的宽度，默认自适应。
- grid\_height — str/int grid 组件的高度，默认自适应。
- grid\_top — str/int grid 组件离容器顶部的距离，默认为 None, 有'top', 'center', 'middle'可选，也可以为百分数或者整数
- grid\_bottom — str/int grid 组件离容器底部的距离，默认为 None, 有'top', 'center', 'middle'可选，也可以为百分数或者整数
- grid\_left — str/int grid 组件离容器左侧的距离，默认为 None, 有'left', 'center', 'right'可选，也可以为百分数或者整数
- grid\_right — str/int grid 组件离容器右侧的距离，默认为 None, 有'left', 'center', 'right'可选，也可以为百分数或者整数

通过`grid.add`方法中grid\_top、grid\_bottom、grid\_left、grid\_right参数设置图表距离容器的位置，比如两个上下类型的图表分别设置grid\_bottom和grid\_top，两个左右类型的图表分别设置grid\_left、grid\_right，四个上下左右类型的图表可分别设置grid\_top、grid\_bottom 、grid\_left、grid\_right。此处图表之间的位置关系设置为bar距离容器顶部70\%，overlap距离底部30\%，即overlap在上，bar在下，两个图表距离容器右边为15\%，如下所示：

```
grid = Grid()
grid.add(bar, grid_top="70%",grid_right="15%")
grid.add(overlap, grid_bottom="30%",grid_right="15%")
```

完整例程代码如下所示：

```
#Overlap+Grid方法绘制交易行情界面
import pandas_datareader.data as web
import datetime
from pyecharts import Grid,Overlap,Line,Bar,EffectScatter,Kline
# example1 senior quotations
df_stockload = web.DataReader("000001.SS", "yahoo", datetime.datetime(2018, 1, 1), datetime.date.today())
df_stockload['Ma20'] = df_stockload.Close.rolling(window=20).mean()  
df_stockload['Ma30'] = df_stockload.Close.rolling(window=30).mean()  
df_stockload['Ma60'] = df_stockload.Close.rolling(window=60).mean()  

# python3.7打印
print(df_stockload.tail())  # 查看前几行
print(df_stockload.columns)  # 查看列名
print(df_stockload.index)  # 查看索引
print(df_stockload.describe())  # 查看各列数据描述性统计

kline = Kline("行情显示图",title_pos="40%")
ohlc = list(zip(df_stockload.Open,df_stockload.Close,df_stockload.Low,df_stockload.High))
dates = df_stockload.index.strftime('%Y-%m-%d')
print(type(dates))
print(type(df_stockload.index))

#is_datazoom_show=True 图表数据缩放  指定 markLine 位于开盘或者收盘上
kline.add("日K", dates, ohlc, is_datazoom_show=True,is_xaxis_show=False, \
        legend_pos="85%",legend_orient="vertical",legend_top="45%",mark_line=["max"], mark_point=["max"])
line = Line()
indic_name_list = ['Ma20','Ma30','Ma60']
for indic_ma in indic_name_list:
      line.add(indic_ma, dates, df_stockload[indic_ma].tolist(),is_smooth=True)

bar = Bar()

volume_rise=[df_stockload.Volume[x] if df_stockload.Close[x] > df_stockload.Open[x] else "0" for x in range(0, len(df_stockload.index))]
volume_drop=[df_stockload.Volume[x] if df_stockload.Close[x] <= df_stockload.Open[x] else "0" for x in range(0, len(df_stockload.index))]
#is_yaxis_show=True 显示y坐标轴
#datazoom_xaxis_index=[0, 1] 设置dataZoom控制索引为 0,1两个x 轴
bar.add("rvolume", dates, volume_rise, is_stack=True)
bar.add("dvolume", dates, volume_drop, is_stack=True,legend_pos="85%",legend_orient="vertical",legend_top="30%", \
        is_datazoom_show=True,tooltip_tragger="axis", is_legend_show=True, is_yaxis_show=True, datazoom_xaxis_index=[0, 1])

# buy and sell
v1 = dates[50]
v2 = df_stockload['Low'].iloc[50]
es = EffectScatter("buy")
es.add("buy", [v1], [v2])
v1 = dates[88]
v2 = df_stockload['High'].iloc[88]
es.add( "sell", [v1], [v2], symbol="pin",)

overlap = Overlap()
overlap.add(kline)
overlap.add(line)
overlap.add(es)
grid = Grid()
grid.add(bar, grid_top="70%",grid_right="15%")
grid.add(overlap, grid_bottom="30%",grid_right="15%")
grid.show_config()
grid.render(r'total.html')
```

使用浏览器可以打开total.html文件进行浏览，显示效果如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/1/169d90147257edcc~tplv-t2oaga2asx-image.image)

## 总结

本小节抛砖引玉地介绍了pyecharts库的使用，从独立的Line、Kline、EffectScatter、Bar图表绘制，到使用Overlap、Grid方式将图表自定义结合，最终制作出Web版股票行情界面。可以看到使用pyecharts库绘制的图表，不仅使用简单，而且效果非常炫酷，感兴趣的同学甚至可以将pyecharts与web框架进行整合。当然，涉及到更多更基础的使用方法，大家也可以结合[官网](http://pyecharts.org/)的介绍来学习。

最后，给大家留一道思考题：

既然pyecharts库绘制的是网页版的图表，那么如何与web框架进行整合呢？另外，Python下的web框架又有哪些呢？

欢迎大家在留言区留言，我们一起讨论。
    