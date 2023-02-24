
# 前置基础-创建一个Python文件的细节【加推篇】
---

# 前置基础：创建一个Python文件的细节

## 前言

Python模块是一种以.py为后缀的文件，我们创建一个Python文件就是创建了一个模块。

我们可以在.py文件中编辑Python代码，比如变量、函数、类、逻辑等等，满足某种特定的功能。

比如我们新建一个`test_for_xxxx.py`的文件，此时我们已经创建了一个`test_for_xxxx`模块，模块的名称是该.py脚本文件的名称。

本小节我们罗列下在Python文件中需要重点注意的地方。

## 声明代码

在文件的头部编写以下声明代码：

```
#!/usr/bin/python 或者 #!/usr/bin/env python
#coding:utf-8
```

`#!/usr/bin/python`指定 【/usr/bin/python】目录下的Python解释器执行Python脚本。

`#!/usr/bin/env python`根据PATH环境变量中指定的第一个Python解释器，执行Python脚本。

`#coding:utf-8`声明该文件的编码格式为 utf-8 。输入该代码就可以使py文件支持中文显示。

## 程序入口

在文件中添加如下代码：

```
if __name__ == "__main__"
```

只要创建了一个模块，这个模块就有一个内置属性`__name__`。

因此`if __name__ == '__main__'`相当于Python模拟的程序入口，Python本身并没有这么规定，这只是一种编码习惯。

当.py文件被直接运行时`，if __name__ == '__main__'`下的代码块将被运行；当.py文件以模块形式被导入时，`if __name__ == '__main__'`下的代码块不被运行。

## 包的概念

包是在模块之上的概念，为了方便管理而将文件进行打包，本质是一个目录。比如当两个功能不同的模块文件取了相同的名称时，无法区分导入的模块是哪个模块，就可以分别构造一个包，将模块放在包文件夹下，通过包.模块名来引用模块。通常一个包文件由`__init__.py`和其他诸多.py文件构成。该`__init__.py`内容可以为空，也可以写入一些包执行时的初始化代码。

包目录下除了模块文件为，也可以包含子目录，假如子目录中也有 `__init__.py`，那么它就是这个包的子包了。常见的包结构：

```
package
├── __init__.py
├── module1.py
└── module2.py
```

有时候也会提到库的概念。Python库着重强调其功能性，可以视为具有相关功能模块、包的集合，也就是说具有某些功能的模块和包都可以称为库。比如Python内置了强大的标准库、还有像NumPy、Pandas这些强大科学计算功能的第三方库。

## import的用法

接下来介绍下import的使用方法。模块的导入可以使用以下方式：

```
import 模块名称 as 自定义名称 # 可以避免冲突情况的发生
import 模块名称1
import 模块名称1，模块名称2
```

比如`import test_for_xxxx`中import本质上是将`test_for_xxxx.py`里面的所有代码解释编译之后赋值给了一个当前模块的同名变量`test_for_xxxx`。当我们想要访问`test_for_xxxx.py`里面的name属性时，需要写`test_for_xxxx.name`，如果想要调用里面的`add()`函数时需要写`test_for_xxxx.add()`。

导入模块后，模块所在文件夹将自动生成一个对应的`__pycache__\test_for_xxxx.cpython-36.pyc`文件。

如果要导入模块内特定函数或者方法时，则可以使用`from…import…`，如下所示：

```
from 模块名称import 函数名称1, 函数名称2, 函数名称3 
from module_name import * # 导入所有方法, 不建议使用，以避免冲突情况的发生
```

`from…import…中import`的本质就是将`test_for_xxxx.py`里面的`name`属性和`add()`函数代码解释编译之后赋值给了一个叫做`name`和`add`的变量中，如果调用`add()`函数直接调用即可。

另外，导入模块和导入包直接的区别是导入包只是执行了包下面的`__init__.py`文件而已。

## 总结

其实以上罗列的点是可以作为我们创建一个Python文件的模版的，创建了标准的Python文件后，我们就可以开始编写我们的业务程序了。
    