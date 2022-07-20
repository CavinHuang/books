
# 自动交易方案-模拟股票客户端交易的原理【加推篇】
---

# 自动交易方案：模拟股票客户端交易的原理

## 前言

股票的自动化交易在2015年之后就被管制了，于是对于普通股民来说没有正规的渠道去完成量化交易的最后一个环节——执行交易。

当然，对于股票交易来说，更偏向于中低频的交易范畴，大多数股民大可不必对自动下单有如此强烈的需求。

不过仍然有不少股民希望能够实现自动下单功能，于是出现了不少曲线救国的方法——`模拟交易`。

## 概述原理

通常使用PC时，与PC交互的主要途径是看屏幕显示、听声音，点击鼠标和敲键盘等等。

在自动化办公的趋势下，繁琐的工作可以让程序自动完成，比如自动化测试等，这时会使用到不少的软件程序。

很多软件除了可以GUI方式操作外还可以用CLI接口操作，不过当一些软件未提供CLI接口时，我们应该怎么办呢？

答案是我们可以用程序控制桌面上的窗口、模拟点击鼠标或按下键盘等动作来释放自己。这类方案当前只适用在windows桌面软件。

所以目前市面上股票量化交易中所谓的外挂软件、easytrader库等等，它们即是基于这个原理，利用程序登陆证券账号客户端，模拟人为交易。

由于不同券商的客户端操作方法是不一样的，所以不同券商的模拟交易程序也都不一样。

## 实现方案

接下来主要介绍下如何通过Python去操作windows桌面软件。

pywin32是一个Python库，它为Python提供访问Windows API的扩展，提供了齐全的windows常量、接口、线程以及COM机制等等，安装后会自带一个pythonwin的IDE。

假如我们要打开一个软件，比如谷歌浏览器，可以这么做：

```
win32api.ShellExecute(1, 'open',
                      r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
                      '', '', 1)
```

假如我们要打开一个文件，比如打开一个word文件，可以这么做：

```
win32api.ShellExecute(1, 'open',
                      r'C:\Users\Jay\Desktop\Environment Guider.docx',
                      '', '', 1)
```

那么自动下单的第一步即是打开交易软件并且登陆上去。

相对简单的例子是登陆同花顺交易客户端，原因是同花顺客户端是可以用来登陆其他证券公司账户的，这样就不用再使用广发、方正等证券客户端了。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/13/172adfdcf8c36a48~tplv-t2oaga2asx-image.image)

从交易客户端可以看到需要填入验证码，说明一下的是，当有验证码要识别的时候，可以使用esseract库完成。

不过如果事先勾选了自动登录的话就不需要输入验证码了，打开后则自动完成登录。

登陆以后，再接下来的工作就是调用win32gui提供的处理窗体句柄的接口，配合上鼠标和键盘操作来模拟人操作界面上的一些菜单项。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/13/172ae011bbcd6c1d~tplv-t2oaga2asx-image.image)

此处举例几个比较常用的接口，比如：

 -    查找窗体的句柄。比如查找`Snipping Tool`和`New Text Document.txt`的句柄，如下所示：

```
para_hld = win32gui.FindWindow(None, "Snipping Tool")# 1836416

para_hld = win32gui.FindWindow(None, "New Text Document.txt - Notepad")# 591410
```

 -    查找句柄的类名和标题。比如通过Snipping Tool和New Text Document.txt的句柄查找对应的类名和标题，如下所示：

```
title = win32gui.GetWindowText(1836416)
classname = win32gui.GetClassName(1836416)
print "windows handler:{0}; title:{1}; classname:{2}".format(1836416, title, classname)

windows handler:1836416; title:Snipping Tool; classname:Microsoft-Windows-Tablet-SnipperToolbar
```

 -    模拟键盘输入。比如按下enter键后抬起的例程，如下所示：

```
win32api.keybd_event(13,0,0,0)     # enter
win32api.keybd_event(13,0,win32con.KEYEVENTF_KEYUP,0)  #释放按键
```

## 总结

本篇内容我们仅仅是以了解模拟交易原理，这个目的而展开相应介绍的，也是为了给想实现自动交易的朋友们指引一个可行的方向。

当然具体的下单、撤单、查询资金、查询持仓等方法大体相同，更多地是需要不断地去调试出模拟的方法。
    