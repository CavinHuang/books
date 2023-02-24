
# 远程下单方案-SMTP邮件实时提醒交易【加推篇】
---

# 远程下单方案：SMTP邮件实时提醒交易

## 前言

我们用量化交易的目的就是让程序全自动地去跑策略，这样就可以解放电脑屏幕前的你。当产生交易信号的时候或者出现异常的时候，得需要通知到相关人员才行，也就是说要实现一种远程提醒的功能，解决方案有用微信、短信、邮件之类的方式。

前面我们介绍了微信方式，不过有些同学反馈说出现了微信网页版无法登陆之类的问题，这里我们再介绍下邮箱这种相对有效的方式来远程提醒。

## Python使用SMTP

发送邮件和核心是SMTP（Simple Mail Transfer Protocol）协议，它是一组用于由源地址到目的地址的邮件传输规则。

Python真的是什么都能做，它对SMTP进行了简单的封装，只需用到两个模块，就可以轻松实现发送纯文本邮件、HTML邮件以及带附件的邮件。

哪两个模块呢？Python内置的email模块负责构建邮件，另一个smtplib模块负责发送邮件。

常规的流程，先把涉及到的模块全部导入进来，如下所示：

```
from email import encoders
from email.header import Header
from email.mime.text import MIMEText
from email.utils import parseaddr, formataddr
import smtplib
```

首先用MIMEText\(\)构造一个最简单的纯文本邮件，其中第一个参数是邮件正文，第二个参数是内容的类型，比如'plain'表示纯文本邮件，'html'表示HTML邮件。

创建的邮件对象中，要添加From、To和Subject这些属性，否则就不是一封完整的邮件，比如会出现邮件没有主题，发件人的名称为匿名，明明收到了邮件却提示不在收件人中这些情况。

典型的例程如下所示：

```
# 发送纯文本格式的邮件
msg = MIMEText('order attention','plain','utf-8')
# 发送邮箱地址
msg['From'] = ='发件人邮箱账号'
# 收件箱地址
msg['To'] ='收件人邮箱账号'
# 主题 
msg['Subject'] = "主题"
```

再来说说负责发送邮件的smtplib模块，这个模块主要是用smtplib.SMTP\(\)类去连接SMTP服务器，然后发送邮件。

例程中我们会用到几个常用的方法，比如set\_debuglevel\(1\)打印和SMTP服务器交互的所有信息。login\(\)登录SMTP服务器，sendmail\(\)方法发邮件。

典型例程如下所示：

```
server = smtplib.SMTP(smtp_server, 25)
server.set_debuglevel(1)
server.login(from_addr, password)
server.sendmail(from_addr, [to_addr], msg.as_string())
server.quit()
```

这里的password是个比较容易混淆的地方。不是邮箱登陆的密码，而是授权码。

## 授权码设置

第三方客户端登录QQ邮箱时是需要授权码的，包括其他邮箱也都一样，比如126、163邮箱等等。授权码可以认为是一个专用密码，适用于登录以下服务：POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务。

如何设置呢？以QQ邮箱为例，我们在QQ邮件的帮助中心找到了方法。

在个人邮箱页面进入\[设置\] \-> \[帐户\] 页面找到入口，然后把POP3/IMAP/SMTP这几个服务开启。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/25/1724ada6d53d67ac~tplv-t2oaga2asx-image.image)

开启的时候有验证密保环节，需要发送短信，接着就获取到授权码，在第三方客户端的密码栏里面输入这16位授权码进行验证即可。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/25/1724adac7e37e957~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/25/1724adb1473326ac~tplv-t2oaga2asx-image.image)

这样一来邮件就发送成功了，我已经得到下单提醒了！！！手机邮箱也一样可以收到哦！

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/25/1724adb6743c305e~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/25/1724adb9ee54ad49~tplv-t2oaga2asx-image.image)

## 总结

经过我的多轮测试，从策略的信号产生到收到邮件，延迟时间基本在1s左右，由于我们设置了滑点，对于股票这类低频交易场合来说，时效性已经绰绰有余了。
    