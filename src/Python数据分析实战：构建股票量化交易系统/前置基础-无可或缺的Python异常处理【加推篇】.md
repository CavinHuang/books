
# 前置基础-无可或缺的Python异常处理【加推篇】
---

# 前置基础：无可或缺的Python异常处理

## 前言

在Python编程中不可避免的会出现错误，在调试阶段出现语法之类的错误时，Pycharm会在Debug窗口提示错误，但是程序在运行时由于内部隐含的问题而引起错误，会导致程序终止执行。比如以下例程中，使用urllib库打开URL时由于网络问题而发生了错误：

```
import urllib.request req = urllib.request.urlopen('http://www.baidu.com') print(req.read())
Traceback (most recent call last):
……
TimeoutError: [WinError 10060] A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond
```

在Python中出现解释器无法正常处理的程序时会引发异常。本小节我们介绍下如何在Python文件中处理异常。

## 异常捕获语法

如果要避免程序在异常发生时结束运行，那么通常使用异常处理语句捕捉异常，再通过其他的逻辑代码让程序继续运行。异常处理语句为try/except，它的基本语法结构如下：

```
try:     < 语句 >  # 运行代码 except  [(Error1, Error2, ...)[as e]]:     < 语句 >  # 如果在try中引发了'Error1'异常 except  [(Error3, Error4, ...)[as e]]:     < 语句 >  # 如果在try中引发了'Error3'异常 except:     < 语句 >  # 如果在try中引发了其他异常

```

当Python解释器在执行 try 中的代码时出现异常，Python 解释器会依次判断该异常对象是否是 except 块后的异常类或其子类的实例，根据该异常的类型寻找能处理该异常对象的 except 块，如果找到合适的 except 块，则把该异常对象交给该 except 块处理。如果 Python 解释器找不到捕获异常的 except 块，则程序运行终止，Python 解释器也将退出。

从 try except 的基本语法格式可以看出，try 块仅有一个，但 except 代码块可以有多个，这是为了针对不同的异常类型提供不同的异常处理方式，比如以下例程中，分别定义了浮点计算错误FloatingPointError异常和输入/输出操作失败IOError异常：

```
try:     import urllib.request     req = urllib.request.urlopen('http://www.baidu.com')     print(req.read()) except FloatingPointError:     print("Capture FloatingPointError") except IOError:     print("Capture IOError") except Exception:     print("Capture Error")
except:
    print("Capture Error")

```

以上程序针对 FloatingPointError、IOError类型的异常，提供了专门的异常处理逻辑。该程序运行时的异常处理逻辑可能有如下几种情形：

- 如果在运行该程序时出现浮点计算错误，Python 将调用 FloatingPointError 对应的 except 块处理该异常。
- 如果在运行该程序时出现输入/输出操作失败，Python 将调用IOError对应的 except 块处理该异常。此处解释器会执行IOError的异常处理。
- 如果在程序运行时出现其他异常，Python 可以调用 Exception 对应的 except 块处理该异常。当然except后面也可以不指定任何异常类。

在语法中的\[\]内为可选内容，于是可以有以下几种形式：

 -    except 后不指定具体的异常名称，表示要捕获所有类型的异常。

```
try:     < 语句 >  # 运行代码 except:     < 语句 >  # 如果在try中引发了其他异常
```

 -    except 后指定具体的异常名称，表示捕获指定类型的异常。比如 Error1、Error2、Error3、Error4分别表示各自的 except 块可以处理异常的具体类型。

```
try:     <语句>    # 运行代码 except  Error1:     <语句>    # 如果在try中引发了'Error1'异常
try:     < 语句 >  # 运行代码 except (Error2,Error3):     < 语句 >  # 如果在try中引发了'Error2和Error3'异常 
```

  - \[as e\] 表示将异常类型赋值给变量 e，以便于在 except 块中调用异常类型。所有的异常对象都包含了如下几个常用属性和方法：

  args：该属性返回异常的错误编号和描述字符串。

  errno：该属性返回异常的错误编号。

  strerror：该属性返回异常的描述字符串。

  with\_traceback\(\)：通过该方法可处理异常的传播轨迹信息。

```
try:     import urllib.request     req = urllib.request.urlopen('http://www.baidu.com')     print(req.read()) except FloatingPointError:     print("Capture FloatingPointError") except IOError as e:     print("Capture IOError")     print(e.args) # 访问异常的错误编号和详细信息     print(e.errno) # 访问异常的错误编号     print(e.strerror) # 访问异常的详细信息 except:     print("Capture Error")
(TimeoutError(10060, 'A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond', None, 10060, None),)
None
None 
```

如果要查看更详细的异常信息，可以导入traceback模块，使用print\_exc\(\)打印异常信息。print\_exc\(\)还可以接受file参数直接写入到一个文件。比如：

```
traceback.print_exc(file=open('except.txt', 'w+')) # 写入到except.txt文件去
```

## 异常名称与描述

以下附上常用的异常捕获名称与其描述信息：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/3/171d8606a2e90e55~tplv-t2oaga2asx-image.image)

## 总结

毕竟谁也无法保证自己的程序是完美无瑕的，为了避免出现程序崩溃的尴尬，在编写Python代码时一定要养成未雨绸缪的好习惯。
    