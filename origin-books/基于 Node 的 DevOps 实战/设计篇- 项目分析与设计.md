
# 设计篇- 项目分析与设计
---

## 前言

通过前 2 章的内容，此时应该已经顺利的搭建了开发环境，也熟悉了服务器、shell 脚本的一些基本知识。

通常开发项目之前，一般都会有 [Prd（项目需求文档）](https://baike.baidu.com/item/%E4%BA%A7%E5%93%81%E9%9C%80%E6%B1%82%E6%96%87%E6%A1%A3/22740526?fromtitle=PRD&fromid=11013752&fr=aladdin)，会详细介绍项目中的需求模块、功能设计等各种细节内容，避免开发中出现缺陷，后期迭代或拓展困难。

所以本章将会对整个项目进行需求分析与拆解，阅读本章你将会对工程化有进一步的了解，包括流程定制、Git Flew、权限设计、数据库建表等等。

## 项目分析

整个项目将分为 4 个学习模块，分别是：

- 服务端
- 客户端
- CI/CD
- 监控

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bd77dfbb3cc4c19ad2f4a786c864fe6~tplv-k3u1fbpfcp-watermark.image)

#### 大纲设计

1.  搭建一整套`开发-测试-构建-部署`的流程 --> **规范化流程**
2.  研发流程中加入**能效概念**（研发时间-测试时间-总体交付时间-bug 率及修复时间），作为项目提效的一个参考标准（影响因素太多，仅供参考） --> **流程闭环质量**
3.  合理的提测卡点，减少无效的提测，减轻测试负担 --> **简化交付成本**
4.  提供线上监控，分析每个版本使用率，报错率 --> **项目质量**
5.  提供快速回滚指定版本功能，确保新版本崩溃情况下能够**快速恢复**服务 --> **线上稳定性**

#### DevOps 设计

在小册大纲中，附图是一个较为完整的 DevOps 的项目架构设计，但作为一个实战的项目练习，个人独立完成所有的流程显然是比较困难。

下图是简单版本的流程架构，整个项目将依照下图的简版流程进行开发。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8d0ea6e31dc40bc884b3983ea8c8f04~tplv-k3u1fbpfcp-zoom-1.image)

#### 分析与拆解

根据流程图可以简单将 Node 模块分为 4 个部分

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0cdf5642584c4f479f37462dd4aee0f6~tplv-k3u1fbpfcp-watermark.image)

1.  用户模块
    - 项目注册用户
    - GitLab 授权第三方注册用户
2.  角色模块
    - 管理员
    - 测试
    - 开发
3.  项目管理
    - 项目（增删改查一套）
    - 打通 GitLab，通过 Open Api 关联项目并进行管理
    - 创建任务流，对整个项目进行追踪管理
    - CICD 项目构建部分
4.  线上监控（方案暂定）

后续将按照上述 4 个模块逐步开发，具体的细节部分会在每个模块开发中介绍。

> GitLab 除了是一款优秀的代码仓库管理平台之外，本身也具备当一个小型项目管理系统的潜质，包含的项目、团队、权限、用户、issue 等等功能都已经非常完善。后续的工程将会非常依赖 GitLab，对 GitLab 提供的开放功能进行深度拓展，定制出合适的工程化体系。

## 流程设计

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f932a13c9bc64fd18bc84e98ec61d6ac~tplv-k3u1fbpfcp-zoom-1.image)

如上图所示，将上述的发布流程更进一步的细化可以分为下面 4 类：

1.  单项目发布流程（一个需求只需要一个工程完成）
2.  生产环境出问题，快速回滚功能
3.  集成项目发布流程（一个需求可能会有多个工程参与开发、发布）
4.  Bug 修复发布流程（无需求，需要快速修复线上已知但不紧急 bug 的发布流程）

> 任务流的设计其实非常复杂，为了加快交付第一版，先将任务流固定为以上 4 类，可以减少开发量与难度，后期可以添加或者修改某个流程。

#### Git Flow 流程

Git Flow 的核心是通过在项目的不同阶段对 branch 的不同操作包括但不限于 create、marge、rebase 等来实现一个完整的高效率的工作流程。在项目的质量把控、多人协作中有非常好的实践。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5b691c99f3746fc967b0835227790f9~tplv-k3u1fbpfcp-zoom-1.image)

- **Production 分支**

就是常用的 Master 分支，这个分支包含最近发布到生产环境的代码，最近发布的 Release， 这个分支只能从其他分支合并，不能在这个分支直接修改。

- **Develop 分支**

这个分支是的主开发分支，包含所有要发布到下一个 Release 的代码，这个主要合并于其他分支，比如 Feature 分支。

- **Feature 分支**

这个分支主要是用来开发一个新的功能，一旦开发完成，合并回 Develop 分支，并进入下一个 Release。

- **Release 分支**

当需要发布一个新 Release 的时候，基于 Develop 分支创建一个 Release 分支，完成 Release 后，合并到 Master 和 Develop 分支。

- **Hotfix 分支**

当在 Production 发现新的 Bug 时候，需要创建一个 Hotfix 分支, 完成修复后，合并回 Master 和 Develop 分支，所以 Hotfix 的改动会进入下一个 Release。

整体的分支管理流程如下图所示

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e48ee7b35b684ceeb41b0ee2bf875bfa~tplv-k3u1fbpfcp-zoom-1.image)

#### 项目自建流程

Git Flow 的优点非常明显，但在实际操作中，不能避免很多流程会有人工介入，有些环节不能完全约束与加入，所以 在 Git Flow 的基础上再创建项目的自建流程，将 branch 与自建流程关联，可以对项目中的开发节点、发布节点、测试以及监控等流程与功能进行追踪。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb27b54fe24c485ba062efabc82e0b3a~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/632d2d88b95941f981d35c5281cbf93a~tplv-k3u1fbpfcp-zoom-1.image)

如图每个工程都共享一个 Version 版本号，分支创建分为版本升级、特性更新、修订补丁三种模式，强制项目所有分支创建的命名规则都会升级，不会出现重复跟降级。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bd83af2a5be4bb48a0f0404ce8f8c0f~tplv-k3u1fbpfcp-zoom-1.image)

**上述流程的优点**：

1.  工程使用固定的版本锁死，版本对应需求流程，上线质量得到保障
2.  每个开发分支都只能部署到测试环境，必须合并到对应的版本分支之后才能上生产
3.  所有合并到 master 或者 relase 分支会被删除，防止一条分支处理过多业务，后期 review、回滚难度提升
4.  realse 版本分支上线之后，生成对应 tag
5.  hotfix 版本可以从对应的 tag 拉出，可以明确的知道 hotfix 具体修复的是哪个版本的问题

**上述流程的缺点**：

1.  固化版本流程导致创建命名规则固定，且版本号不能升级只能降级
2.  流程限制，降低开发灵活性

> 没有完美的解决方法，所有 devops 流程都要结合真实项目需求来设计，上述也仅是其中一种解决方案

## 用户、权限系统设计

#### 用户、权限方案

比较通用的用户信息表如下所示：

- 用户表（user）：`记录用户基本信息，不限于密码、用户名等`
- 权限表（permission）：`记录权限信息，例如增删改查各种权限`
- 角色表（role）：`记录角色信息，例如开发、测试、产品等各种角色`
- 用户 — 角色表（user\_role）：`记录用户与角色关系表，有一对多的关系`
- 角色 — 权限表（role\_permission）：`记录角色与权限的管理，有多对多的关系`

更加复杂的用户权限设计可以加入用户组的概念，用户组级别的权限管理。

如果全部都从头开发的话，估计直接劝退绝大部分的人了，整个项目的工程量会非常大，快速搭建一个可用的系统并不是一定要自己做完所有的事情，可以选择跟第三方系统对接。

#### 第三方用户授权

1.  [钉钉企业用户](https://developers.dingtalk.com/document/app/server-api-overview)
2.  [企业微信用户](https://work.weixin.qq.com/api/doc/90000/90135/90664)
3.  GitLab 用户关（后面会具体介绍）
4.  现在有内部系统提供用户与权限接口（对接企业自身内部系统）

以上可以互相搭配使用，比如内部用户系统接了钉钉或者企业微信的用户模块，然后通过邮箱关联一个 GitLab 账号，还是比较常见的做法。

其实 GitLab 本身对于项目级别有了非常细致的权限管理，作为实战项目，可以简化用户系统，直接使用 GitLab 的用户、权限体系作为源数据。具体的流程可以参考下面的时序图

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39bb17e72c7c40499396e4516d24a901~tplv-k3u1fbpfcp-watermark.image)

#### GitLab 权限

通过 GitLab Api 获取项目信息的同时也能拿到该用户在对应项目中的 `permissions`，可以依赖 GitLab 自身对项目、团队做的权限做一个项目权限映射，极大的节约项目的开发时间与成本。

| GitLab 权限 | GitLab 权限描述 | access\_level | 映射项目角色 | 对应项目角色描述 |
| --- | --- | --- | --- | --- |
| No access | 啥都不能干 | 0 | 无任何权限 | **啥都不能干** |
| Guest | 创建issue、发表评论，不能读写版本库 | 10 | 项目经理 | 可以查看项目进度 |
| Reporter | 克隆代码，不能提交 | 20 | 测试 | 项目测试、提交 bug |
| Developer | 克隆代码、开发、提交、push 等 | 30 | 开发 | 项目开发，发布测试、预发环境 |
| Maintainer | 创建项目、添加tag、保护分支、添加项目成员、编辑项目等 | 40 | 管理者 | 项目管理，发布生产环境 |
| Owner \(Only valid to set for groups\) | 设置项目访问权限、删除项目、迁移项目、管理组成员等 | 50 | 最高权限管理者 | **啥都能干** |

## 数据库设计

#### 设计用户表

正常来说，第三方用户设计会有 3 张:

| 表名 | 描述 |
| --- | --- |
| user | 系统用户表 |
| social\_account | 第三方用户表 |
| user\_social\_account | 系统与第三方用户关联表 |

但根据上面的用户权限设计方案，GitLab 将作为底层数据来源，所以项目的 user 表可以直接跟 GitLab 的 social\_account 表合并成为一章，包括用户 id 都可以直接使用 GitLab 的信息，保存一些常规不变的数据，可能会改变的数据可以直接从 GitLab 获取然后合并返回给业务即可。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cf96be3c3d442c98722bf5f52fd420a~tplv-k3u1fbpfcp-watermark.image)

> 这只是为了项目开发的速度而做的变通，实际情况中要根据自己的业务来设计用户表，自建用户的话，可以赋予更多自由度定制与功能拓展。

#### 设计业务表

根据上述的需求分析，先将最复杂的 project 与 branch 表结构设计出来，方便后期使用。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9ea151d8b0d47df8f4998fb88fff520~tplv-k3u1fbpfcp-zoom-1.image)

将 GitLab Project 与 Branch 字段与需要的数据落库到本地，再根据项目需求新增字段，大概的表结构如上图所示

结合上述项目流程设计，说明一下表结构关系：

1.  工程表 project 会管理多个分支 branch，可以查询当前工程下所有分支的状态（是否被提测，是否存在流程中）
2.  创建一个流程（等同于需求）关联多个 branch 开发
3.  流程创建完之后必走完所有步骤直至完结（**开发-测试-预发-生产**）
4.  当 branch 被一个流程关联之后，既被所**锁定**，不会再次被加入到其他流程（**需求锁定隔离，保证开发过程不会有干扰**）
5.  在流程的提测步骤中，可以针对不同 branch 进行多次提测（复杂需求通过**分批提测**，完成预期目标）
6.  当流程中所有 branch 的状态都已测试通过之后，该流程状态才进入下一个阶段，否则一直停留在测试阶段

> 这里先简单介绍比较复杂的表结构，后续在开发过程中，会逐步介绍其他的表结构与设计。

## 本章小结

本章是针对于整个项目的需求分析与设计，为了减少成本与时间，整个工程将依赖 GitLab 去开发。

从下一章节开始，将正式进入 Node 项目的开发。

如果你有什么疑问，欢迎在评论区提出，或者加群沟通。 👏
    