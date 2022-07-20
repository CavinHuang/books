
# 远程下单方案-钉钉机器人实时提醒交易【加推篇】
---

# 远程下单方案：钉钉机器人实时提醒交易

## 前言

目前钉钉这款办公软件很火，无论是公司还是学校都用它来开会、打卡、项目交流……，既然大家的手机上都安装了钉钉软件，那么我们也可以利用钉钉来实时提醒我们行情动态、策略买卖点之类。

## 创建钉钉机器人

其实整个交互的原理很简单，类似微信和邮箱的方式，即是钉钉PC端向手机端发送消息。利用Python接口来调用PC端的消息发送。所以我们要在PC和手机上分别安装钉钉软件。

接下来在手机端要创建一个分类的群，如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/25/1738372420964c06~tplv-t2oaga2asx-image.image)

创建完成后会同步到PC端，如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/25/17383730fa782539~tplv-t2oaga2asx-image.image)

在创建的钉钉群中点击-右上角第一个按钮“群设置”，进入“智能群助手”中并添加一个群机器人。如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/25/17383738b6fc8d5e~tplv-t2oaga2asx-image.image)

群机器人中选择自定义方式添加群机器人，如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/25/1738373ee2875e21~tplv-t2oaga2asx-image.image)

配置机器人的各个参数，注意自定义关键词是与发送相匹配的关键词，如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/25/17383744368d2c63~tplv-t2oaga2asx-image.image)

添加完成后，可以在群里看到机器人了，如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/25/173837495810f514~tplv-t2oaga2asx-image.image)

## 机器人发送消息

发送消息需要获取群的webhook地址，如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/25/1738374dd3a6ef0e~tplv-t2oaga2asx-image.image)

剩下的工作即是通过Python接口向webhook地址发送post请求消息，如下所示：

```
baseUrl = "" #"your hook address"
# please set charset= utf-8
HEADERS = {"Content-Type": "application/json ;charset=utf-8 "}

stringBody = {"msgtype": "text",
              "text": {"content": '{0} {1}'.format(message, "\n触发提醒")},
              "at": {
              "atMobiles": ["135xxxxxxxx"],
              "isAtAll": True  # @所有人 时为true，上面的atMobiles就失效了
                    }
              }
MessageBody = json.dumps(stringBody)

try:
    result = requests.post(url=baseUrl, data=MessageBody, headers=HEADERS)
    print(result.text)
except Exception as e:
    print("消息发送失败", e)

```

接口的返回结果应该是：\{"errmsg":"ok","errcode":0\}，这时我们就可以看到群里出现了messageBody并且\@了所有人了。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/7/25/173837572cfaf454~tplv-t2oaga2asx-image.image)

## 总结

以上仅仅是钉钉机器人的最小应用，大家可以根据自己的需求加以扩展。

至此我们分别介绍了微信机器人、SMTP邮箱以及钉钉这三种远程提醒的方式，无论是提醒行情动态、系统运行状态、策略触发交易信号、交易成交报告等等，这三种方式都是非常有用的，我们可以根据自己的喜好去使用。
    