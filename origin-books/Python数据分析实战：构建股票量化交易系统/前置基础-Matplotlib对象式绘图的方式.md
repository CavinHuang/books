
# 前置基础-Matplotlib对象式绘图的方式
---

# 前置基础：Matplotlib对象式绘图的方式

## 前言

在量化交易系统中可视化分析是最为直观地查看数据和评估策略运行情况的方法。`matplotlib`是Python下专业用于绘图的第三方库，也是最为流行的绘图库。凭借matplotlib极其强大的绘图方法，我们可以绘制出美观而有说服力的图形，使得可视化分析愈发效果显著。

上一小节我们通过简单的例程介绍了matplotlib工具的函数式绘图方式。其实matplotlib库是由一系列有组织有隶属关系的对象构成的，本质上还是以构建对象方式来绘制图像，为了让用户觉得方便，将构建对象的过程封装在函数中，从而形成了函数式编程方式。由于函数式绘图在原有的对象上增加了一层调用接口，不仅降低了效率，而且掩盖原有的隶属关系，无法体现对象体系中细节功能。

本小节通过简单的例程快速入门matplotlib工具的对象式绘图方式。

## 对象式绘图例程

接下来我们使用面向对象方式绘制上一小节例程的图表，从而了解对象式绘图的方法。

我们先了解下图像中对象隶属关系。在matplotlib中，整个图像为一个Figure对象，所有元素依附于Figure对象中。在Figure对象中可以包含一个或者多个Axes对象。每个Axes对象各自拥有坐标系统的绘图区域，包含各自的Title（标题）、Axis（坐标轴）、Label（坐标轴标注）、Tick（刻度线）、Tick Label（刻度注释）等对象元素。对象隶属关系如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/16989837e6cc54e7~tplv-t2oaga2asx-image.image)

对象式绘图与函数式绘图的最大的区别在于pyplot模块的`figure()`函数创建了名为fig的Figure对象，而后在Figure对象中创建一个Axes对象，Axes对象即为一个绘图区域。如下所示：

```
# pyplot模块中的figure()函数创建名为fig的Figure对象
fig = plt.figure(figsize=(12, 8))

# 在Figure对象中创建一个Axes对象，每个Axes对象即为一个绘图区域
ax = fig.add_subplot(111)
```

接下来在Axes对象中增加坐标轴标签label对象、tick对象、ticklabel对象和标题title对象，以及对坐标轴的取值范围xlim和ylim进行设定等等，其实与函数式绘图方式大体相同。如下所示：

```
# 设置轴标签
ax.set_xlabel('X axis',fontsize=15)
ax.set_ylabel('Y axis',fontsize=15)
```

对象式绘图中各个对象在图中的位置关系如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/16989840c8dfe897~tplv-t2oaga2asx-image.image) 对象式绘图完整例程代码如下图所示：

```
import matplotlib.pyplot as plt
import numpy as np

# 生成数据
x = np.linspace(0.5, 7.5, 1000)
y = np.sin(x)
#pyplot模块中的figure()函数创建名为fig的Figure对象
fig = plt.figure(figsize=(12, 8))
#在Figure对象中创建一个Axes对象，每个Axes对象即为一个绘图区域
ax = fig.add_subplot(111)
# sin(x)图
ax.plot(x, y, '--g', lw=2, label='sin(x)')

# 调整坐标轴范围
ax.set_xlim(0, 10)
ax.set_ylim(-1.5, 1.5)
# 设置坐标轴标签
ax.set_xticks(np.arange(0,10,2))
ax.set_yticks(np.arange(-1,1.5,1))
ax.set_xticklabels(['2015-07-02','2015-08-02','2015-09-02','2015-10-02','2015-11-02'],\
                             rotation=45,fontsize=15)
ax.set_yticklabels([u'最小值',u'零值',u'最大值'],fontsize=15)

# 设置轴标签
ax.set_xlabel('X axis',fontsize=15)
ax.set_ylabel('Y axis',fontsize=15)
# 设置网格线
ax.grid(True, ls=':', color='r', alpha=0.5)
# 设置标题
ax.set_title(u"Functional Programming",fontsize=25)
# 添加图例
ax.legend(loc='upper right',fontsize=15)

# 添加sin(x)的最高点注释
ax.annotate('max sell',
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
ax.annotate('min buy',
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

## 总结

本小节通过基础的绘图例程介绍了`matplotlib`函数式绘图和对象式绘图两种方法的使用，相信同学们经过对比后不再会混淆各种绘图接口和方法了。

最后，给大家留一道思考题：

就像文中讲到matplotlib本质上还是以构建对象方式来绘制图像的，只是为了让用户觉得方便，将构建对象的过程封装在函数中，从而形成了函数式编程方式，那么我们在使用matplotlib绘图时，需要如何选择合适的绘制方法呢？

欢迎大家在留言区留言，我们一起讨论。
    