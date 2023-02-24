
# 前置基础-Matplotlib函数式绘图的方式
---

# 前置基础：Matplotlib函数式绘图的方式

## 前言

在量化交易系统中可视化分析是最为直观地查看数据和评估策略运行情况的方法。`matplotlib`是Python下专业用于绘图的第三方库，也是最为流行的绘图库。凭借matplotlib极其强大的绘图方法，我们可以绘制出美观而有说服力的图形，使得可视化分析愈发效果显著。

有的同学反映matplotlib并不容易掌握，最主要的原因是在绘制同样的图形时往往有多种实现的方式，在无形中容易让人产生混淆，增加了学习难度。

其实matplotlib的确有两种绘图风格。一种是延续自MatLab的函数式绘图，另一种是Python的对象式绘图。笔者认为学习matplotlib的瓶颈在于将函数式和对象式这两种绘图方式梳理清晰，之后同学们会发现其实学习matplotlib并没有想象的那么困难。本小节通过简单的例程快速入门matplotlib工具的函数式绘图方式。

## 函数式绘图例程

MATLAB是数据绘图领域中广泛使用的工具，调用函数命令就可以轻松绘制图形。matplotlib受MATLAB的启发而构建，因此也延续了MATLAB函数形式的绘图方式，设计了一套函数形式的绘图API，调用API即可绘制高质量的图形。接下来我们以一个基础的绘图例程来介绍函数式绘图的方法。

由于A股市场历年来呈现周期性的涨跌，此处我们不妨用正弦函数产生绘图的数据，来模拟跌宕起伏的市场走势。我们可以指定numpy中`linspace()`函数的开始值、终值和步长来创建一维等差数组，并将该数组作为numpy中`sin()`函数的x轴数据以生成对应的正弦值，如下所示：

```
import numpy as np
x = np.linspace(0.5, 7.5, 1000)
y = np.sin(x)
```

导入matplotlib库中的`pyplot`模块，该模块集合了类似MATLAB的绘图API，如下所示。`pandas.DataFrame.plot`、`pandas.Series.plot`、`seaborn`的画图功能也是基于pyplot模块构建而成的。

```
import matplotlib.pyplot as plt
```

matplotlib中`figure()`函数创建图表并设置大小，如下所示。`figsize`参数指定图像的长和宽（英寸）。

```
# 创建图形并设置大小
plt.figure(figsize=(12, 8))
```

matplotlib中`plot()`函数用于绘制线条图形，以展现数据的变化趋势。其中`linestyle`参数设定线条类型，`color`参数指定线条的颜色，`linewidth`参数设定线条的宽度，`label`参数设置线条的标签，如下所示：

```
# lw：line width，用于设置线条宽度
# '--g'：结合linestyle和color，线条使用虚线，颜色使用绿色
# label：设置线条的标签为'sin(x)'
plt.plot(x, y, '--g', lw=2, label='sin(x)')
```

matplotlib中`xlim(min,max)`函数和`ylim(min,max)`函数分别设置x坐标轴和y坐标轴的数值显示刻度范围，如下所示：

```
# 调整坐标轴刻度范围
plt.xlim(0, 10)
plt.ylim(-1.5, 1.5)
```

matplotlib中`xlabel()` 函数和 `ylabel()`函数添加X轴、Y轴的显示标签，如下所示：

```
# 设置轴标签
plt.xlabel('X axis')
plt.ylabel('Y axis')
```

matplotlib中`xticks(location,labels)`函数和`yticks(location,labels)`函数分别设定X轴和Y轴的坐标标签。`location`为浮点数或整数组成的列表，表示坐标轴上坐标的位置。`labels`是与`location`等长的字符串列表，表示坐标的显示标签。`rotation`参数可旋转调节坐标标签，当坐标密集时可避免标签重叠。如下所示：

```
# 设置坐标轴标签
plt.xticks(np.arange(0,10,2),['2015-07-02','2015-08-02','2015-09-02','2015-10-02','2015-11-02'],\
                                        rotation=45)
plt.yticks(np.arange(-1,1.5,1),[u'最小值',u'零值',u'最大值'])
```

matplotlib中`grid()`函数用于设置图形中的网格线。其中`linestyle`用于设置网格的线条类型，`color`用于设置网格的线条颜色。如下所示：

```
# 设置网格线
plt.grid(True, ls=':', color='r', alpha=0.5)
```

matplotlib中`title()`函数设置图形的标题，如下所示：

```
# 设置标题
plt.title(u"Functional Programming")
```

matplotlib中`legend()`函数增加图例显示，当多条曲线显示在同一张图中时，便于识别不同的曲线。使用`loc`参数可以控制图例的放置位置，`upper left`\(左上角\)、`upper center`\(中上\)、`upper right`\(右上角\)、`lower left`\(左下角\)、 `lower center`\(中下\)、 `lower right`\(右下\)。如下所示：

```
# 添加图例
plt.legend(loc='upper right')
```

matplotlib中`annotate()`函数可在图形中添加指向性注释文本，我们不妨在最低点\(π\*3/2, \-1\)位置用一个红色箭头指向一个买信号，在最高点\(π/2, 1\)位置用一个绿色箭头指向一个卖信号，以此来熟练这个函数的使用。在使用`annotate()`函数时，要考虑两个坐标点，分别为`xy(x, y)`指示点坐标，即注释箭头指向的点坐标，以及`xytext(x, y)` 插入注释文本的点坐标。另外`arrowprops`参数是以字典格式设置箭头属性\(arrow properties\) 。如下所示：

```
# 添加sin(x)的最高点注释
plt.annotate('max sell',
             xy = (np.pi/2, 1),#箭头指向点的坐标
             xytext = (np.pi/2, 1.3),#注释文本左端的坐标
             weight = 'regular',#注释文本的字体粗细风格，bold是粗体，regular是正常粗细
             color = 'g',#注释文本的颜色
             fontsize = 15,#注释文本的字体大小
             arrowprops = {
                 'arrowstyle': '->',#箭头类型
                 'connectionstyle': 'arc3',#连接类型
                 'color': 'g'#箭头颜色
             })

# 添加sin(x)的最低点注释
plt.annotate('min buy',
             xy = (np.pi*3/2, -1),
             xytext = (np.pi*3/2, -1.3),
             weight = 'regular',
             color = 'r',
             fontsize = 15,
             arrowprops = {
                 'arrowstyle': '->',
                 'connectionstyle': 'arc3',
                 'color': 'r'
             })
```

matplotlib中`show()`函数显示图形，在通常的运行情况下，`show()`函数会阻塞程序的运行，直到关闭绘图窗口为止。如下所示：

```
# 显示图形
plt.show()
```

函数式绘图显示效果如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/10/169673425b6dc429~tplv-t2oaga2asx-image.image)

函数式绘图完整例程代码如下图所示：

```
import matplotlib.pyplot as plt
import numpy as np

# 生成数据
x = np.linspace(0.5, 7.5, 1000)
y = np.sin(x)

#函数式绘图
# 创建图形并设置大小
plt.figure(figsize=(12, 8))

# sin(x)图
plt.plot(x, y, '--g', lw=2, label='sin(x)')

# 调整坐标轴范围
plt.xlim(0, 10)
plt.ylim(-1.5, 1.5)
# 设置坐标轴标签
plt.xticks(np.arange(0,10,2),['2015-07-02','2015-08-02','2015-09-02','2015-10-02','2015-11-02'],\
                             rotation=45,fontsize=15)
plt.yticks(np.arange(-1,1.5,1),[u'最小值',u'零值',u'最大值'],fontsize=15)

# 设置轴标签
plt.xlabel('X axis',fontsize=15)
plt.ylabel('Y axis',fontsize=15)
# 设置网格线
plt.grid(True, ls=':', color='r', alpha=0.5)
# 设置标题
plt.title(u"Functional Programming",fontsize=25)
# 添加图例
plt.legend(loc='upper right',fontsize=15)

# 添加sin(x)的最高点注释
plt.annotate('max sell',
             xy = (np.pi/2, 1),#箭头指向点的坐标
             xytext = (np.pi/2, 1.3),#注释文本左端的坐标
             weight = 'regular',#注释文本的字体粗细风格，bold是粗体，regular是正常粗细
             color = 'g',#注释文本的颜色
             fontsize = 15,#注释文本的字体大小
             arrowprops = {
                 'arrowstyle': '->',#箭头类型
                 'connectionstyle': 'arc3',#连接类型
                 'color': 'g'#箭头颜色
             })

# 添加sin(x)的最低点注释
plt.annotate('min buy',
             xy = (np.pi*3/2, -1),
             xytext = (np.pi*3/2, -1.3),
             weight = 'regular',
             color = 'r',
             fontsize = 15,
             arrowprops = {
                 'arrowstyle': '->',
                 'connectionstyle': 'arc3',
                 'color': 'r'
             })
# 显示图形
plt.show()
```

## 常见问题解决

关于使用Matplotlib库时所涉及到的最常见的“中文显示乱码问题”和“tight\_layout\(\)出错问题”可参考该篇[专栏]()！！！

## 总结

本小节通过基础的绘图例程介绍了`matplotlib`函数式绘图方法的使用。最后，给大家留一道思考题：

在Python中一切都是对象，那么函数式编程方式是如何做到不用面向对象的思维来绘图呢？

欢迎大家在留言区留言，我们一起讨论。
    