
---
title: 基于 Go 语言构建企业级的 RESTful API 服务
---

## 简介
Go 服务器开发大型实战，带你一步步构建 API 开发中的各个功能点，最终完成一个企业级的 API 服务器

## 说明
## 教程介绍

现代软件架构已经逐渐从单体架构转向微服务架构，在微服务架构中服务间通信采用轻量级通信机制。对于轻量级通信的协议而言，通常基于 HTTP 和 RPC ，能让服务间的通信变的标准化并且无状态化。此外开发模式也越来越多的采用前后端分离的模式，在前后端分离的模式中，前后端通信一般是通过 HTTP 进行通信。

不管是微服务架构，还是前后端分离模式，都需要一个 HTTP API 服务器。而且在日后的开发生涯中可能需要构建很多个大大小小的 API 服务器，所以很多时候做 Go 语言后台开发其实就是做 API 开发。有很多种方法可以用来构建 API，很多企业构建 API 时，采用一种叫 REST 风格的方式来构建 API，它虽然调用性能不及 RPC，但维护性和扩展性更好，也更通用。由于本教程不讨论微服务之间的高频调用场景， 而 REST 在实际开发中，能够满足绝大部分的需求场景，基于它的其他优势，本教程采用 REST 风格来构建 API 服务器。此外，在媒体类型上选择了 JSON，因为它的内容更加紧凑，数据展现形式直观易懂，开发测试都非常方便。REST + JSON，这也是 Go API 开发中很常用的组合。

构建一个简单的 API 服务器很简单，但构建一个生产就绪的 API 服务还有很多工作要做。所谓的生产就绪，至少需要满足如下各方面：

1.  需要读取配置文件、记录日志
2.  需要连接数据库
3.  需要对数据库做增删改查等操作
4.  需要自定义业务错误码
5.  需要进行 API 身份验证
6.  需要给 API 增加 Swagger 文档
7.  API 服务器需要满足高稳定性，高性能的要求
8.  API 需要做高可用
9.  ....

可以看到要构建一个可以运行在生产环境中的 API 服务器有许多工作要做。本教程希望花尽可能短的时间，来教初学者了解和学习 Go API 开发的所有环节和功能点。构建中需要用到很多 Go 包，笔者也根据经验筛选出了一些非常优秀的 Go 包来使用，另外教程中很多地方也会附上笔者的开发经验和建议，希望对读者有一定的帮助。

## 你会学到什么

本教程是一个实战类的教程，旨在让初学者花尽可能短的时间，通过尽可能详细的步骤，历经 17 个 demo，最终一步步构建出一个生产级的 API 服务器。从开发准备到 API 设计，再到 API 实现、测试和部署，每一步都详细介绍了如何去构建。通过本教程的学习，你将学到如下知识点：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4d3763206804135a34417f8f79716b8~tplv-k3u1fbpfcp-watermark.image)

知识点很多，跟着教程一节一节进行学习，你将完整的学会如何用 Go 做 API 开发。

## 适宜人群

- 掌握一定 Go 语法基础，零 Go 服务器研发经验，想通过一个完整的实战，来系统学习 Go 服务器开发的同学
- 有意从事 Go 服务器开发，但尚未入门或入门尚浅的同学
- 有过 Go 服务器开发经验，但想了解某一部分构建方法的同学

## 你应该具备什么

- 基本的 Go 语言编程知识
- 基本的 Linux/Uinx 命令行知识

## 章节
- [本小册所实现的 API 功能](<./ben-xiao-ce-suo-shi-xian-de-api-gong-neng.md>)
- [RESTful API 介绍](<./restful-api-jie-shao.md>)
- [API 流程和代码结构](<./api-liu-cheng-he-dai-ma-jie-gou.md>)
- [Go API 开发环境配置](<./go-api-kai-fa-huan-jing-pei-zhi.md>)
- [基础 1：启动一个最简单的 RESTful API 服务器](<./ji-chu-1-qi-dong-yi-ge-zui-jian-dan-de-restful-api-fu-wu-qi.md>)
- [基础 2：配置文件读取](<./ji-chu-2-pei-zhi-wen-jian-du-qu.md>)
- [基础 3：记录和管理 API 日志](<./ji-chu-3-ji-lu-he-guan-li-api-ri-zhi.md>)
- [基础 4：安装 MySQL 并初始化表](<./ji-chu-4-an-zhuang-mysql-bing-chu-shi-hua-biao.md>)
- [基础 5：初始化 MySQL 数据库并建立连接](<./ji-chu-5-chu-shi-hua-mysql-shu-ju-ku-bing-jian-li-lian-jie.md>)
- [基础 6：自定义业务错误信息](<./ji-chu-6-zi-ding-yi-ye-wu-cuo-wu-xin-xi.md>)
- [基础 7：读取和返回 HTTP 请求](<./ji-chu-7-du-qu-he-fan-hui-http-qing-qiu.md>)
- [基础 8：用户业务逻辑处理](<./ji-chu-8-yong-hu-ye-wu-luo-ji-chu-li.md>)
- [基础 9：HTTP 调用添加自定义处理逻辑](<./ji-chu-9-http-diao-yong-tian-jia-zi-ding-yi-chu-li-luo-ji.md>)
- [基础 10：API 身份验证](<./ji-chu-10-api-shen-fen-yan-zheng.md>)
- [进阶 1：用 HTTPS 加密 API 请求](<./jin-jie-1-yong-https-jia-mi-api-qing-qiu.md>)
- [进阶 2：用 Makefile 管理 API 项目](<./jin-jie-2-yong-makefile-guan-li-api-xiang-mu.md>)
- [进阶 3：给 API 命令增加版本功能](<./jin-jie-3-gei-api-ming-ling-zeng-jia-ban-ben-gong-neng.md>)
- [进阶 4：给 API 增加启动脚本](<./jin-jie-4-gei-api-zeng-jia-qi-dong-jiao-ben.md>)
- [进阶 5：基于 Nginx 的 API 部署方案](<./jin-jie-5-ji-yu-nginx-de-api-bu-shu-fang-an.md>)
- [进阶 6：API 高可用方案](<./jin-jie-6-api-gao-ke-yong-fang-an.md>)
- [进阶 7：go test 测试你的代码](<./jin-jie-7-go-test-ce-shi-ni-de-dai-ma.md>)
- [进阶 8：API 性能分析](<./jin-jie-8-api-xing-neng-fen-xi.md>)
- [进阶 9：生成 Swagger 在线文档](<./jin-jie-9-sheng-cheng-swagger-zai-xian-wen-dang.md>)
- [进阶 10：API 性能测试和调优](<./jin-jie-10-api-xing-neng-ce-shi-he-diao-you.md>)
- [拓展 1：Go 开发技巧](<./tuo-zhan-1-go-kai-fa-ji-qiao.md>)
- [拓展 2：Go 规范指南](<./tuo-zhan-2-go-gui-fan-zhi-nan.md>)
- [总结](./zong-jie.md)

    