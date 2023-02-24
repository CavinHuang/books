
# 前置基础-开发环境及基础工具说明
---

# 前置基础：开发环境及基础工具说明

## 前言

俗话说：工欲善其事，必先利其器，在正式开始Python量化交易学习之前，我们一定要做好开发环境的准备工作，安装Python和第三方Python库就是其中关键的一步。本小节主要介绍本小册例程所依赖的开发环境和基础工具，以及在安装和使用过程中的一些注意事项。

## Python环境安装

任何一种编程语言都需要另一种语言来解释它，比如C语言是用汇编语言来解释的，对于Python语言来说，也需要有一种语言去解释它。通常我们在官网下载的Python软件就起到解释Python语言的作用，我们称它为Python解释器。Python解释器根据实现方式不同分为CPython、IPython、Jython等，官网下载的是CPython，它是用C语言开发的，也是目前用的最广泛的解释器。在使用Python语言编写代码之前必须安装Python解释器，否则即使写了无比优雅的Python代码也是无法正常运行的。

早期安装Python环境首先要在[Python官网](https://www.python.org/)下载某个版本的安装包进行安装，然后安装pip包管理工具，再通过pip命令安装所需的第三方库。这种方式在Python版本和第三方库的管理上着实令人头疼，我们常常碰到以下这些情况，比如：

- Python版本又升级了，如何让多个Python版本并存和切换呢？

- 又要安装新的库了，怎么又提示必须先安装一堆不明所以的依赖库？

为了解决这些问题，诞生了不少Python的发行版，Anaconda就是其中的一款。现在如果要安装Python环境，尤其是针对大数据和人工智能的应用，我想大家会不约而同地推荐使用Anaconda平台。

**为什么推荐Anaconda呢？**

Anaconda是专用于科学计算的Python发行版，发行版内预装好了conda、Python、众多packages和科学计算工具，具有跨平台、环境管理、包管理的特点：

- 关于跨平台。Anaconda其实是一个虚拟环境，在一定程度上避免了不同操作系统之间的差异所产生的问题， 它支持Linux、 MacOS、 Windows系统，通过它安装的Python及第三方库在以上操作系统上对于同样的代码都能稳定运行。

- 关于环境管理。Anaconda支持多版本的Python并存，不仅支持Python2和Python3这样的大版本，还支持Python3.6.4和Python3.6.5这样的小版本，并且在不同的环境下拥有独立的Python版本，独立的包管理，仅需简单的操作就可以切换版本。

- 关于包管理。在安装第三方Python库时，Anaconda会解决依赖库的安装，即使对于TA-Lib这种出了名的难安装的库，Anaconda也不在话下。TA-Lib 的安装其实分为两部分，底层的为技术分析库，上层的Python库是对技术分析库的封装，即“Python wrapper for TA-Lib”，因此在安装TA-Lib时提示“Cannot open include file: 'xxxx.h': No such file or directory”之类的信息，多半是底层技术分析库安装出错，而Anaconda同时会解决底层系统级的依赖。

因此用Anaconda在本地机器上部署Python开发环境又快速又省心！这就是强力推荐的原因！

**这里提到的conda又是什么呢？**

conda可以理解为一个工具，也是一个可执行命令，其核心功能是包管理与环境管理。包管理与pip的使用类似，环境管理则允许用户方便地安装不同版本的Python并可以快速切换。conda的设计理念将几乎所有的工具、第三方包都当做package对待，甚至包括Python和conda自身，因此，conda打破了包管理与环境管理的约束，可以很方便地解决多版本Python并存、切换以及各种第三方包安装问题。

此处以Mac系统为例介绍下Anaconda的安装。首先到[Anaconda官网](https://www.anaconda.com/download/#macos)下载macOS版Anaconda软件，当前的版本有Python3.7版本和Python2.7版本，小册使用的为3.7版本，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b17e88c15cbf~tplv-t2oaga2asx-image.image)

下载完成后双击安装文件，一步一步按提示安装完成即可，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1aefbf3430a~tplv-t2oaga2asx-image.image)

安装完成后在终端输入“conda”命令，如果无法被系统识别，那么需要检查环境变量是否设置正确。可以使用命令“sudo vi \~/.bash\_profile”检查环境变量。如果未设置环境变量，那么手动添加PATH内容：export PATH="xxx/anaconda3/bin:\$PATH"，其中xxx替换成anaconda的安装路径。添加完成后使用命令“source \~/.bash\_profile”刷新环境变量。

## 第三方库安装

安装第三方库时可以使用conda命令也可以使用pip命令，以Mac系统为例，打开Anaconda Navigator，点击Environments—>base—> open terminal选项，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1bc6d6cefba~tplv-t2oaga2asx-image.image)

打开终端后，在命令行窗口中使用conda命令或pip的命令，建议优先使用conda命令安装“conda install package\_name”，package\_name 为需要安装库的名称，如下图所示安装numpy库：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1c1c898d332~tplv-t2oaga2asx-image.image)

安装完成后可以使用“conda list”查看当前环境下已安装的库，也可以使用“conda search package\_name” 查找库的信息，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1c74b85bc72~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1cb0256d0df~tplv-t2oaga2asx-image.image)

本小册涉及到的第三方库包括：numpy、pandas、pandas-datareader 、tushare 、tblib 、pyecharts、matplotlib 、mpl-finance ……

版本如下：

- TA-Lib version：0.4.17
- mpl-finance version：0.10.0
- numpy version：1.15.1
- pandas version：0.23.4
- pandas-datareader version：0.7.0
- pyecharts version：0.5.11
- pyecharts-javascripthon version：0.0.6
- pyecharts-jupyter-installer version：0.0.3
- pyecharts-snapshot version：0.1.10
- matplotlib version：2.2.3
- tushare version：1.2.35

## 开发工具安装

安装完Python和第三方库后，我们需要安装Python的编程调试工具，以提高开发效率。此处推荐大家安装PyCharm，[PyCharm官网](http://www.jetbrains.com/pycharm/)可下载软件。 PyCharm软件分为社区版Community和专业版Community，专业版功能丰富，社区版是精简的专业版，部分功能不支持，如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1d9e51ac585~tplv-t2oaga2asx-image.image)

社区版是免费的，专业版是收费的，本小册的例程使用社区版即可。下载完成后，双击安装文件，按提示步骤安装完成。安装完成后，需要在PyCharm中配置anaconda环境，使Python项目文件与anaconda环境下的Python解释器及各种第三方库相关联。以MacOS为例，打开PyCharm，选择其界面右下角的configure，点击右边的黑色倒三角形，然后选择preferences选项，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1e10e1602f5~tplv-t2oaga2asx-image.image)

在打开preferences选项后，接下来选择页面左边的project interpreter，选择“Add...” ，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1ebf6f1546a~tplv-t2oaga2asx-image.image)

打开后的页面后，在页面左侧选择 “System Interpreter”,接着选择右边的“...”，在路径目录下找到“anaconda\*”（此处使用的是anaconda3）文件夹，点击“OK”选项，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1f0c8d94774~tplv-t2oaga2asx-image.image)

添加anaconda后，可以看到Python3.7版本对应的第三方库信息，再点击“OK”选项等待配置更新完成后即可。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1f5c71d420c~tplv-t2oaga2asx-image.image)

接下来创建新的Python工程，点击Create New Project，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1fa41e5bfec~tplv-t2oaga2asx-image.image)

在“New Project”页面，第一个红框中需填写一个新建Python项目的路径地址，用于存放和该Python项目相关的程序、数据等内容，便于管理。第二个红色框为我们要用到的Python解释器，我们在PyCharm中已经配置anaconda集成环境，此处选择anaconda环境下的Python3.7版本解释器，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/17/1698b1ff2ff0ed3f~tplv-t2oaga2asx-image.image)

至此我们已经安装好了Python开发环境和所涉及的基础工具了。

## 总结

本小节以小册的开发环境为例，主要介绍了Python发行版Anaconda的优点和安装方法，以及围绕Anaconda相关的第三方库的安装、调试工具PyCharm的安装和配置，高效的开发工具可以帮助我们事半功倍地展开学习。

最后，给大家留一道思考题：

Anaconda其实是利用了虚拟机技术实现了跨平台的特点，比如我们在Windows上通过Anaconda安装了TuShare库，相关的代码在本地稳定运行，之后在Linux服务器上通过Anaconda安装了TuShare库，那么这份代码同样也可以稳定运行，对于macOS也一样。那么大家对虚拟机技术的原理是怎么理解的？它是怎么做到跨平台特性的呢？

欢迎大家在留言区留言，我们一起讨论。
    