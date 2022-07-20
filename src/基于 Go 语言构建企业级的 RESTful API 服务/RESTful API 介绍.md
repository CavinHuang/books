
# RESTful API 介绍
---

# RESTful API 介绍

## 什么是 API

API（Application Programming Interface，应用程序编程接口）是一些预先定义的函数或者接口，目的是提供应用程序与开发人员基于某软件或硬件得以访问一组例程的能力，而又无须访问源码，或理解内部工作机制的细节。

要实现一个 API 服务器，首先要考虑两个方面：API 风格和媒体类型。Go 语言中常用的 API 风格是 RPC 和 REST，常用的媒体类型是 JSON、XML 和 Protobuf。在 Go API 开发中常用的组合是 gRPC+Protobuf 和 REST+JSON。

## REST 简介

REST 代表表现层状态转移（REpresentational State Transfer），由 Roy Fielding 在他的 [论文](https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm) 中提出。REST 是一种架构风格，指的是一组架构约束条件和原则。满足这些约束条件和原则的应用程序或设计就是 RESTful。REST 规范把所有内容都视为资源，网络上一切皆资源。REST 架构对资源的操作包括获取、创建、修改和删除，资源的操作正好对应 HTTP 协议提供的 GET、POST、PUT 和 DELETE 方法。HTTP 动词与 REST 风格 CRUD 对应关系：

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a095d726d67a45dbae63a7d1480d6a27~tplv-k3u1fbpfcp-zoom-1.image)

## RPC 简介

RPC 全称 Remote Procedure Call（远程过程调用），是一种进程间通信方式。它允许程序调用另一个地址空间（通常是共享网络的另一台机器上）的过程或函数，而不用程序员显式编码这个远程调用的细节。即程序员无论是调用本地的还是远程的，本质上编写的调用代码基本相同。

RPC 这个概念在 20 世纪 80 年代由 Bruce Jay Nelson 提出。在 Nelson 的论文 "Implementing Remote Procedure Calls" 中我们了解到 RPC 具有如下优点：

1.  简单：RPC 概念的语义十分清晰和简单，这样建立分布式计算就更容易
2.  高效：过程调用看起来十分简单而且高效
3.  通用：在单机计算中过程往往是不同算法部分间最重要的通信机制

简单地说，就是一般程序员对于本地的过程调用很熟悉，我们把 RPC 做成和本地调用完全类似，那么就更容易被接受，使用起来毫无障碍。

**RPC 结构：**

Nelson 的论文中指出实现 RPC 的程序包括 5 个部分：

1.  User
2.  User-stub
3.  RPCRuntime
4.  Server-stub
5.  Server

![](//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78d54556e16845b7b7ceaf376eec9ceb~tplv-k3u1fbpfcp-zoom-1.image)

这里 User 就是 client 端，当 User 想发起一个远程调用时，它实际是通过本地调用 User-stub。User-stub 负责将调用的接口、方法和参数通过约定的协议规范进行编码并通过本地的 RPCRuntime 实例传输到远端的实例。远端 RPCRuntime 实例收到请求后交给 Server-stub 进行解码后发起本地端调用，调用结果再返回给 User 端。

## REST vs RPC

在做 API 服务器开发时，很多人都会遇到这个问题 —— 选择 REST 还是 RPC。RPC 相比 REST 的优点主要有 3 点：

1.  RPC+Protobuf 采用的是 TCP 做传输协议，REST 直接使用 HTTP 做应用层协议，这种区别导致 REST 在调用性能上会比 RPC+Protobuf 低
2.  RPC 不像 REST 那样，每一个操作都要抽象成对资源的增删改查，在实际开发中，有很多操作很难抽象成资源，比如登录操作。所以在实际开发中并不能严格按照 REST 规范来写 API，RPC 就不存在这个问题
3.  RPC 屏蔽网络细节、易用，和本地调用类似

> 这里的易用指的是调用方式上的易用性。在做 RPC 开发时，开发过程很烦琐，需要先写一个 DSL 描述文件，然后用代码生成器生成各种语言代码，当描述文件有更改时，必须重新定义和编译，维护性差。

但是 REST 相较 RPC 也有很多优势：

1.  轻量级，简单易用，维护性和扩展性都比较好
2.  REST 相对更规范，更标准，更通用，无论哪种语言都支持 HTTP 协议，可以对接外部很多系统，只要满足 HTTP 调用即可，更适合对外，RPC 会有语言限制，不同语言的 RPC 调用起来很麻烦
3.  JSON 格式可读性更强，开发调试都很方便
4.  在开发过程中，如果严格按照 REST 规范来写 API，API 看起来更清晰，更容易被大家理解

其实业界普遍采用的做法是，内部系统之间调用用 RPC，对外用 REST，因为内部系统之间可能调用很频繁，需要 RPC 的高性能支撑。对外用 REST 更易理解，更通用些。当然以现有的服务器性能，如果两个系统间调用不是特别频繁，对性能要求不是非常高，以笔者的开发经验来看，REST 的性能完全可以满足。本小册不是讨论微服务，所以不存在微服务之间的高频调用场景，此外 REST 在实际开发中，能够满足绝大部分的需求场景，所以 RPC 的性能优势可以忽略，相反基于 REST 的其他优势，笔者更倾向于用 REST 来构建 API 服务器，本小册正是用 REST 风格来构建 API 的。

## 媒体类型选择

媒体类型是独立于平台的类型，设计用于分布式系统间的通信，媒体类型用于传递信息，一个正式的规范定义了这些信息应该如何表示。HTTP 的 REST 能够提供多种不同的响应形式，常见的是 XML 和 JSON。JSON 无论从形式上还是使用方法上都更简单。相比 XML，JSON 的内容更加紧凑，数据展现形式直观易懂，开发测试都非常方便，所以在媒体类型选择上，选择了 JSON 格式，这也是很多大公司所采用的格式。

## 小结

本小节介绍了软件架构中 API 的实现方式，并简单介绍了相应的技术，通过对比，得出本小册所采用的实现方式：API 风格采用 REST，媒体类型选择 JSON。通过本小节的学习，读者可以了解小册所构建 API 服务器核心技术的选型和原因。
    