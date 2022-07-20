
# 综合篇 - 整体流程打通
---

## 前言

![系统架构设计.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cf8fc93fc6141e1b02d0230c7c63c17~tplv-k3u1fbpfcp-watermark.image?)

是时候再祭出这张图了，由于时间有限（**虚拟机也崩了。。不会熟悉的人还是上云服务器吧**），这一章的内容更多的是提供解决方案与思路，大家可以根据自己的项目情况，来融入整体流程中即可。

前面的 Devops 主要集成了 Gitlab 与 Jenkins，发布我们使用的 Nginx（发布静态项目）与 Rancher（发布 node 服务）。代码静态扫描使用了 Sonar，埋点与性能监控使用的是 Sentry。其中 Rancher 、Sentry、Sonar 都是独立的模块，并没有接入 Devops，本章将会结合之前的设计，将这些内容纳入到 Devops 体系中去。

## 接入的设计

在前面三章介绍的，不知道大家有没有留意，每个模块都与我们的 Devops 流程设计中存在 2 个相通的地方：

1.  项目（无论何种方式都是基于 Gitlab 的项目构建出来）
2.  版本（无论是基于 Branch 还是自定义的版本都有 Version 的概念）

而在我们的 Devops 中，采用的自建 Version 与 Branch 绑定的关系，所以我们在对接各个模块的时候，可以通过对应的项目与版本进行关联，使用每个模块提供的 Web API 将需要的数据或者对应的操作集成到 Devops 工程中。

![未命名文件.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a36c2712bfbd4fa78fb649ce1f11385c~tplv-k3u1fbpfcp-watermark.image?)

接下来，我们将以 Senrty 为例子，介绍集成的方案。

## Sentry 集成

#### Sentry Api

下图是 Sentry 对应的 [Web Api](https://docs.sentry.io/api/auth/) 接口文档，可以挑选一些需要集成到我们项目中的接口配合即可。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ace53ed458bd47c7b3ebc40a1e2414af~tplv-k3u1fbpfcp-watermark.image?)

首先，基于 Gitlab，我们可以获取到对应的 Group 的信息，那么每个 Group 可以映射到对应的 Senrty 的 Teams。

所以在 Devops 中，当用户进来之后，所属的 Group 映射到 Sentry 就是对应的 Teams 信息，比较简单的操作是 Group 与 Teams name 保持一一对应，这样就不需要新建关联表。

1.  创建项目的时候，通过对应的 [API](https://docs.sentry.io/api/teams/) 创建对应的 Project

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c2dae2a14034c18bc50965225a558ec~tplv-k3u1fbpfcp-watermark.image?)

2.  再项目创建完毕之后，通过 Sentry 提供的 [Project 的 Api](https://docs.sentry.io/api/projects/)，创建对应的 DSN。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e495da35408048c89ab6dda32db74b95~tplv-k3u1fbpfcp-watermark.image?)

3.  项目发布到预发环境的时候，创建对应的 [Release](https://docs.sentry.io/api/releases/)，并通过构建流程上传对应的 sourcemap。

4.  如果想集成更多的话，可以使用 [Events \& Issues](https://docs.sentry.io/api/events/) 将 issues 一起集成到 Devops 对应的项目中。

#### Sentry Webhooks

由于 Sentry 自带的通知方式是邮件，然而很多团队使用邮件作为通知方式已经很落伍了，不够及时，所以我们需要通过自定义消息通知来做，这个我们之前已经在 Devops 中对接过了钉钉与企微的消息推送，所以我们只需要启动对应的接口来对接就行了。

1.  添加 webhook

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c8ef33f8b5e4e02b970372d18a75264~tplv-k3u1fbpfcp-watermark.image?)

2.  对应的项目添加后端接口

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3230390633cf4f668205c005c7ef7800~tplv-k3u1fbpfcp-watermark.image?)

3.  添加对应报警规则

![1633855228(1).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/545d939fc6e841e3930e8a3d4a96e21e~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcdc7a259bc944da8a31952a3611b339~tplv-k3u1fbpfcp-watermark.image?)

4.  配置完对应的环境之后，后续线上预警之后，会收到对应的消息通知

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b53f61a11c394c8093062da6f62c6cab~tplv-k3u1fbpfcp-watermark.image?)

## 本章小结

本章主要的宗旨是使用每个模块的 Web Api 提供的功能集成到 Devops 中，集成的优势在于聚合，**将所有工程化流程上的模块都聚合在同一个平台，使用一套统一的流程来管理每个模块，减少多项目使用带来的心智成本**。

其他模块的接入可以参考 Sentry 的接入模式，能不创建关联表就不需要创建，这样比较省时间，如果追求个更高的定制化的话，那么关联表则是必不可少的，各位同学可以根据自己的项目需求来决定接入的模式。

如果你有什么疑问，欢迎在评论区提出，或者加群沟通。 👏
    