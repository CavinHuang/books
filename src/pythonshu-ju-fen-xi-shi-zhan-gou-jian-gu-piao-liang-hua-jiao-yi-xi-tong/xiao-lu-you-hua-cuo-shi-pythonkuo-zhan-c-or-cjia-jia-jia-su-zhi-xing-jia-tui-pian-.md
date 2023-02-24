
# 效率优化措施-Python扩展C or C++加速执行【加推篇】
---

# 效率优化措施：Python扩展C/C++加速执行

## 前言

当我们提到一门编程语言的效率时，通常包含了开发效率和运行效率这两层意思。Python作为一门高级语言，它功能强大，易于掌握，能够快速的开发软件，“life is short，we use python！”，想必这些优点是毋庸置疑的，但是作为一门解释性语言，执行速度的局限性导致在处理某些高频任务时存在不足。

由于Python本身由C语言实现的，开发性能要求较高的程序模块可以通过扩展运行效率更高的C语言来弥补自身的弱点。另外有些算法已经有开源的C库，那么也没必要用Python重写一份，只需要通过Python进行C库的调用即可。

接下来通过实例介绍如何在Python 程序中整合既有的C语言模块，从而充分发挥Python 语言和 C 语言各自的优势。

> 本文所涉及到的C程序的编译为Linux平台

## Python实现测试函数

使用Python编写一个递归函数和循环函数，应用Python的计时库timeit测试函数执行10000次所需要的时间分别为57ms和41ms。

实现代码如下：

```
from timeit import timeit  

def factorial(n):
    if n<2:return 1
return factorial(n-1)*n 
def rooporial(n):
    if n<2:return 1
    ans = 1
    for i in range(1,n+1):
        ans *=i
    return ans 

if __name__ == '__main__': 
print "factorial",factorial(20),timeit('factorial(20)','from __main__ import factorial',number=10000) #timeit(‘函数名’，‘运行环境’，number=运行次数)
print "rooporial",rooporial(20),timeit('rooporial(20)','from __main__ import rooporial',number=10000)
```

打印返回：

```
factorial 2432902008176640000 0.0578598976135
factorial 2432902008176640000 0.0410023010987
```

当然递归方法使程序的结构简洁，但由于它逐层深入调用的机制使得执行效率不如循环，以下的测试可以发现每一次递归是新一次的函数调用，会产生新的局部变量，增加了执行时间。但是即使使用For循环实现也需要41ms时间，

接下来我们尝试更快的实现方式。

测试代码如下：

```

def up_add_down(n):
    print("level %d: n location %p\n",n,id(n))
    if n<=4:up_add_down(n+1)
    print("level %d: n location %p\n",n,id(n))
    return 

```

打印返回：

```
('level %d: n location %p\n', 0, 144136380)
('level %d: n location %p\n', 1, 144136368)
('level %d: n location %p\n', 2, 144136356)
('level %d: n location %p\n', 3, 144136344)
('level %d: n location %p\n', 4, 144136332)
('level %d: n location %p\n', 5, 144136320)
('level %d: n location %p\n', 5, 144136320)
('level %d: n location %p\n', 4, 144136332)
('level %d: n location %p\n', 3, 144136344)
('level %d: n location %p\n', 2, 144136356)
('level %d: n location %p\n', 1, 144136368)
('level %d: n location %p\n', 0, 144136380)
```

## Python源生调用实现

Python在设计之初就考虑到通过足够抽象的机制让C和C++之类的编译型的语言导入到Python脚本代码中，在Python的官方网站上也找到了扩展和嵌入Python解释器对应的方法。

这里介绍下如何将C编写的函数扩展至Python解释器中。

将C编写的递归函数存为wrapper.c，作为Python的扩展库。同时需要对C函数增加一个型如`PyObject* Module_func()`的封装接口，该接口用于Python解释器的交互。将封装接口加入至型如`PyMethodDef ModuleMethods[]`的数组中，Python解释器能够从数组中导入并调用到封装接口。最后是实现对扩展库的初始化函数，调用`Py_InitModule()`函数，把扩展库和`ModuleMethods[]`数组的名字传递进去，以便于解释器能正确的调用库中的函数。

wrapper.c实现代码如下：

```
#include <Python.h>

unsigned long long factorial(int n)
{
    if(n<2)return 1;
    return factorial(n-1)*n;
}

PyObject* wrap_fact(PyObject* self,PyObject* args)
{
    int n;
    unsigned long long  result;
    
    if(!PyArg_ParseTuple(args,"i:fact",&n))return NULL;//i 整形
    result = factorial(n);
    return Py_BuildValue("L",result);//L longlong型
}

static PyMethodDef wrapperMethods[] = 
{
    {"fact",wrap_fact,METH_VARARGS,"Caculate N!"},//METH_NOARGS无需参数/METH_VARARGS需要参数；
    {NULL,NULL},
};
int initwrapper()
{
    PyObject* m;
    m = Py_InitModule("wrapper",wrapperMethods);//参数：扩展库名称/库所包含的方法
    return 0;
}
```

以下为总体流程的概述：

- 安装python-dev包含Python.h头文件。安装命令：sudo apt-get python-dev

- 在linux环境下wrapper.c编译成动态链接库wrapper.so

- 编译命令：gcc wrapper.c \-fPIC \-shared \-o wrapper.so \-I/usr/include/python2.7

- Python文件中import wrapper导入动态链接库，在import语句导入库时会执行初始化函数

- Python文件中`wrapper.fact()`方式对C函数调用时，封装函`数wrap_fact()`先会被调用，封装函数接收到一个Python整形对象，PyArg\_ParseTuple将Python整形对象转为C整形参数，然后调用C的`factorial()`函数并将C整数参数传入，经过运算后得到一个C长整形的返回值`，Py_BuildValue`把C长整形返回值转为Python的长整形对象作为最终整个函数调用的结果。

  - timeit测试函数wrapper.fact\(20\)执行10000次所的时间只需要5.9ms。

```
factorial_rc 2432902008176640000 0.00598216056824
```

## Python Ctypes模块调用实现

Python内建ctypes库使用了各个平台动态加载动态链接库的方法，并在Python源生代码基础上通过类型映射方式将Python与二进制动态链接库相关联，实现Python与C语言的混合编程，可以很方便地调用C语言动态链接库中的函数。（ctypes源码路径：/Modules/\_ctypes/\_ctypes.c、/Modules/\_ctypes/callproc.c）

将C编写的递归函数存为a.c，不需要对C函数经过Python接口封装

```
#include <stdio.h>   
#include <stdlib.h>   
unsigned long long factorial(int n)
{
    if(n<2)return 1;
    return factorial(n-1)*n;
}
```

（2）在linux环境下a.c编译成动态链接库a.so 编译命令：gcc a.c \-fPIC \-shared \-o a.so Python文件中调用动态链接库a.so，在Windows平台下，最终调用的是Windows API中LoadLibrary函数和GetProcAddress函数，在Linux和Mac OS X平台下，最终调用的是Posix标准中的dlopen和dlsym函数。ctypes库内部完成PyObject\* 和C types之间的类型映射，使用时只需设置调用参数和返回值的转换类型即可。

```
from ctypes import cdll
from ctypes import * 
libb = cdll.LoadLibrary('./a.so') 
def factorial_c(n):
    return libb.factorial(n)

if __name__ == '__main__':
libb.factorial.restype=c_ulonglong#返回类型
	libb.factorial.argtype=c_int#传入类型
print "factorial_c",factorial_c(20),timeit('factorial_c(20)','from __main__ import factorial_c',number=10000)
```

timeit测试函数libb.factorial\(20\)执行10000次所的时间需要8.5ms。 factorial\_c 2432902008176640000 0.00857210159302

## 总结

factorial、factorial\_c、factorial\_rc分别为Python脚本、ctypes 库和Python源生代码扩展方式来实现函数的执行时间。通过执行时间对比可以发现调用C函数来扩展Python功能可以大大提高执行速度，而Python自带的ctypes库由于在源生代码上进行封装，执行时间会高于源生代码扩展方式，但ctypes库使用方便，特别适合应用在第三方封装代码，提供动态链接库和调用文档的场合。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/3/171d876895639f01~tplv-t2oaga2asx-image.image)
    