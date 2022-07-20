
# 部署篇 - Kubernetes
---

## 前言

之前我们一直再部署静态应用，但是我们自己的 devops 服务自己还没有部署，只是在开发环境使用，那么接下来我们将对 node 项目进行构建部署，通过 Kubernetes 将构建好的 docker 包发布到生产环境，这里推荐使用一款比较简单的容器管理平台 **[Rancher](https://rancher.com/docs/rancher/v1.6/zh/)**。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f997789ea863458a839c4ce3ec97ac70~tplv-k3u1fbpfcp-watermark.image?)

## Rancher

### 为什么选择 Rancher

#### 基础设施编排

Rancher 可以使用任何公有云或者私有云的 Linux[主机](https://docs.rancher.cn/docs/rancher1/infrastructure/hosts/_index)资源。Linux 主机可以是虚拟机，也可以是物理机。Rancher 仅需要主机有 CPU，内存，本地磁盘和网络资源。从 Rancher 的角度来说，一台云厂商提供的云主机和一台自己的物理机是一样的。

Rancher 为运行容器化的应用实现了一层灵活的[基础设施服务](https://docs.rancher.cn/docs/rancher1/rancher-service/_index)。Rancher 的基础设施服务包括[网络](https://docs.rancher.cn/docs/rancher1/rancher-service/networking/_index)， [存储](https://docs.rancher.cn/docs/rancher1/rancher-service/storage-services/_index)， [负载均衡](https://docs.rancher.cn/docs/rancher1/rancher-service/load-balancer/_index)， [DNS](https://docs.rancher.cn/docs/rancher1/rancher-service/dns-service/_index)和安全模块。Rancher 的基础设施服务也是通过容器部署的，所以同样 Rancher 的基础设施服务可以运行在任何 Linux 主机上。

#### 容器编排与调度

很多用户都会选择使用容器编排调度框架来运行容器化应用。Rancher 包含了当前全部主流的编排调度引擎，例如[Docker Swarm](https://docs.rancher.cn/docs/rancher1/infrastructure/swarm/_index)， Kubernetes， 和[Mesos](https://docs.rancher.cn/docs/rancher1/infrastructure/mesos/_index)。同一个用户可以创建 Swarm 或者 Kubernetes 集群。并且可以使用原生的 Swarm 或者 Kubernetes 工具管理应用。

除了 Swarm，Kubernetes 和 Mesos 之外，Rancher 还支持自己的 Cattle 容器编排调度引擎。Cattle 被广泛用于编排 Rancher 自己的基础设施服务以及用于 Swarm 集群，Kubernetes 集群和 Mesos 集群的配置，管理与升级。

#### 应用商店

Rancher 的用户可以在[应用商店](https://docs.rancher.cn/docs/rancher1/configurations/catalog/_index)里一键部署由多个容器组成的应用。用户可以管理这个部署的应用，并且可以在这个应用有新的可用版本时进行自动化的升级。Rancher 提供了一个由 Rancher 社区维护的应用商店，其中包括了一系列的流行应用。Rancher 的用户也可以[创建自己的私有应用商店](https://docs.rancher.cn/docs/rancher1/configurations/catalog/private-catalog/_index)。

#### 企业级权限管理

Rancher 支持灵活的插件式的用户认证。支持 Active Directory，LDAP， Github 等 [认证方式](https://docs.rancher.cn/docs/rancher1/configurations/environments/access-control/_index)。 Rancher 支持在[环境](https://docs.rancher.cn/docs/rancher1/configurations/environments/_index)级别的基于角色的访问控制 \(RBAC\)，可以通过角色来配置某个用户或者用户组对开发环境或者生产环境的访问权限。

> 上述引用自 [Rancher Doc](https://docs.rancher.cn/docs/rancher1/_index)，简单来说，这是一个比较好用的容器管理平台。

### Rancher 安装

#### 启动

由于我们之前的虚拟机已经配置好了 docker 环境，所以 Rancher 的安转非常简单，只需要，输入完毕一行代码等待几分钟，即可看到 Rancher UI 界面。

```shell
sudo docker run -d --restart=unless-stopped -p 7070:8080 rancher/server:stable
# 由于测试仪用的虚拟机 8080 端口被占用了，所以改用 7070，端口号可以自由选择
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a3cefa141774353afe92a092ccebf85~tplv-k3u1fbpfcp-watermark.image?)

#### 添加主机

为了简单，我们可以添加运行着 Rancher Server 的主机为 Rancher 内的主机，这样虽然方便，但是生产中还是要多几台。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01dd1ba6fdb8463a8f0816c0689b3c15~tplv-k3u1fbpfcp-watermark.image?)

复制图内的脚本在虚拟机中运行，即可完成主机的添加，回到主机界面会出现如下的配置项。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bdf3b70c6614fcd891b5d15951c05bb~tplv-k3u1fbpfcp-watermark.image?)

#### 管理应用

回到应用的界面，如果大家是按照教程来的话，会出现如下的界面。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/019f28a71d474b4f8fed12dbd03d25e7~tplv-k3u1fbpfcp-watermark.image?)

如上图所示，我们在虚拟机运行的 sentry docker 也被扫描出来，可以被 Rancher 添加为应用。不过这里不做过多展示，兴趣的同学自己可以研究下，我们继续后面的发布服务。

## 发布应用

### Docker 私有仓库

因为要通过 Rancher 来发布服务，所以我们需要一个私有仓库，私有仓库的种类有很多，我们挑选最简单的 docker 自带的私有仓库作为测试使用，正式环境还是可以挑选其他的例如 **Nexus**，**Jfrog**，**Harbor**。

运行如下命令：

```shell
docker pull registry:2 
# 下载 docker 容器
```

```shell
docker run -d -v /opt/registry:/var/lib/registry -p 5000:5000 --name myregistry registry:2
# 启动容器依赖
```

浏览器输入 `http://192.168.160.88:5000/v2/` 链接，得到如下结果则代表正常。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15c41a3fcff441f8b1d92054d5dd2ae1~tplv-k3u1fbpfcp-watermark.image?)

### 构建 devops node 镜像

在 devops 项目根路径添加 Dockerfile 文件，输入如下代码：

```Dockerfile
FROM alpine

RUN apk update \
  && apk add nodejs \
  && apk add npm 

WORKDIR /usr/src/app

COPY . .

EXPOSE 7001
CMD [ "yarn", "startProd" ]
```

在运行构建命令 `docker build \-f ./Dockerfile \-t 192.168.160.88:5000/devops:0.0.1 .`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cacde882ace4d16b3e73598f873d571~tplv-k3u1fbpfcp-watermark.image?)

输入上传命令：`docker push 192.168.160.88:5000/devops:0.0.1`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4769c1880d8248edb0f25b5ace4bf2db~tplv-k3u1fbpfcp-watermark.image?)

上传完毕之后，浏览器打开 `http://192.168.160.88:5000/v2/_catalog`，正常上传完毕之后，可以看到如下界面：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd7e72166793411fa8906589ed00bb56~tplv-k3u1fbpfcp-watermark.image?)

### Rancher CLI

由于我们要做的是 devops 流程，所以 UI 界面的创建我们直接略过，有兴趣的同学可以自己尝试一下，小册采用 Rancher CLI 来创建服务。

#### 生成访问密钥（token）

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35b8ce08f16048b794ee1ed0361977fb~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cd9bcd8e40e4786b50a624be1340100~tplv-k3u1fbpfcp-watermark.image?)

**Access 跟 Secret 只显示一次，切记要保存好。**

#### 登录

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b768a7deae0148608ee1fa681d1f5a86~tplv-k3u1fbpfcp-watermark.image?)

右下角下载对应系统的 CLI。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e44ab4f99e784376a9ce309b9021e0c4~tplv-k3u1fbpfcp-watermark.image?)

复制 Rancher 的访问链接。

运行 `rancher config` 登录 Rancher

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5923d319c5944d27b6c2786dd9c83ea2~tplv-k3u1fbpfcp-watermark.image?)

运行 `rancher ps`，出现如下界面即代表登录成功了。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df43e649db5d46a5b60e762b4195fbb4~tplv-k3u1fbpfcp-watermark.image?)

#### 发布应用

新建的 `docker-compose.yml` 文件：

```yaml
version: '2'
services:
 devops: 
  labels:
    io.rancher.container.pull_image: always
  tty: true
  image: 192.168.160.88:5000/devops:0.0.9
  ports:
   - "1001:1001"
```

新建的 `rancher-compose.yml` 文件：

```yaml
version: "2"
services:
  devops:
    scale: 2
```

输入下述脚本：

```
rancher --url http://192.168.160.88:7070 --access-key 6DEBFBAEB12668A9468B --secret-key sFdJHVuWwCLQTdcwQ7YNhh9w9YphXmPYwnHyMRko --env esign-dev up -d --force-upgrade -s devops -f ./docker-compose.yml --rancher-file ./rancher-compose.yml
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62fbeee4608649fb8277f7e32e7a2856~tplv-k3u1fbpfcp-watermark.image?)

如上图，我们已经使用 Rancher CLI 发布了应用。

此时再打开 Rancher UI 可以看到，我们已经发布了一个服务并部署在两台机器上了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07fbbb1245e54ff198c33fa106d9cf01~tplv-k3u1fbpfcp-watermark.image?)

接着再使用 postman 测试接口数据是否正常

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f297f5051e6e4323a85ccb199226e877~tplv-k3u1fbpfcp-watermark.image?)

> 启动多容器的时候，记得添加两台主机。

## 本章小结

在本章，我们学习使用 Rancher 来发布 node 服务，通过使用 Rancher CLI 可以将部署流程引入我们 devops 中，同时 Rancher 也提供了 web api，可以方便我们更好的集成。

Rancher 的功能非常多，其中还有负载均衡、DNS、存储等更多的模块，一章节是远远不够的，不过 Rancher 的中文文档非常全面，感兴趣的同学可以深入了解下。

由于 Kubernetes 发展出乎意料的好，Rancher 2.x 底层完全基于 k8s 调度引擎，通过 Rancher 的封装，用户可以在不熟悉 Kubernetes 概念的情况下轻松的通过 Rancher 来部署容器到k8s集群当中。本文的列子是 Rancher 1.6 版本，使用的是默认 cattle 容器编排，大体的内容与操作都是差不多的，同学们可以直接选择 2.x 入手。

> 当然如果资金够充裕，可以使用云服务，更简单一点。

如果你有什么疑问，欢迎在评论区提出，或者加群沟通。 👏
    