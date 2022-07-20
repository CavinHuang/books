
# 容器化部署方案-Docker 
---

在前面的文章中，我们介绍了什么是前端部署，以及手动部署和自动化部署的区别。然后介绍了如何使用持续集成和持续部署（CI/CD\)解决软件开发“最后一公里”问题，最后介绍和对比了几种 CI/CD 工具。那么本篇文章，给大家介绍下容器化部署方案以及容器化部署的重要实践：Docker。

## 什么是容器化

在软件开发中，有一个老大难问题就是环境一致性。因为我们的软件是需要在计算机环境中运行，所以不同的环境可能会对软件运行的结果产生影响。也就是我们经常说的或者听到的：“在我电脑上是好的呀”。那么如何才能保证环境因素带来的影响最小呢？

> Containerization is the packaging together of software code with all it’s necessary components like libraries, frameworks, and other dependencies so that they are isolated in their own "[container](https://www.redhat.com/en/topics/containers/whats-a-linux-container)." \--[RedHat 官网](https://www.redhat.com/en/topics/cloud-native-apps/what-is-containerization)

容器化部署就是将原先在部署服务器中执行的项目部署流程改为使用容器化的技术完成。容器化是一种新的部署思想和解决方案，是指把我们代码和我们需要的环境变量一起“打包”，放在一个隔离的空间内。因为容器是在一个隔离的空间内，所以可以不受环境或者其他因素的影响独立运行，可以做到环境隔绝。

容器化的思想其实已经存在很久了，但是直到 2013 年 [Docker](https://www.redhat.com/zh/topics/containers/what-is-docker) 的推出，容器化思想才在业内广泛使用。下面我们就介绍下容器化思想的实践：Docker。

## Docker

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c43b6f353f24931bbc2d5a6d9a77033~tplv-k3u1fbpfcp-zoom-1.image)

> Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的[镜像](https://baike.baidu.com/item/%E9%95%9C%E5%83%8F/1574)中，然后发布到任何流行的 [Linux](https://baike.baidu.com/item/Linux)或[Windows](https://baike.baidu.com/item/Windows/165458)操作系统的机器上，也可以实现[虚拟化](https://baike.baidu.com/item/%E8%99%9A%E6%8B%9F%E5%8C%96/547949)。容器是完全使用[沙箱](https://baike.baidu.com/item/%E6%B2%99%E7%AE%B1/393318)机制，相互之间不会有任何接口。—— 《百度百科》

刚刚我们介绍了容器化，那么 Docker 可以说是容器化的一个成功实践。Docker 将软件和其依赖一起打包在一个可移植的**镜像**中，在运行的时候会创建一个与外界隔离的**容器，** 我们将镜像存放在镜像**仓库**中。

就和 Docker 的 LOGO 一样，其思想就和集装箱的思想一样。我们在用轮船运货的时候，将不同的商品装在不同标准的集装箱中，各个集装箱之间就可以装不同的东西，互不影响。

Docker 中有三大重要概念：容器、镜像和仓库。**镜像是 Docker 运行容器的前提，仓库是存放镜像的场所**。

### 容器

我们将软件打包成标准化单元，以用于开发、交付和部署，然后将其存放在容器中。我们可以通俗的理解为，容器就是存放东西的地方，存放的是软件运行所需要的代码、运行时环境、系统工具、设置等所有内容。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31942594d5574343a38b32dccff8be2b~tplv-k3u1fbpfcp-zoom-1.image)

### 镜像

`Docker` 中的镜像是一个特殊的文件系统。提供容器运行时所需的代码、库、资源、配置文件和一些运行时的配置参数。镜像不包含任何的动态数据，为了能够使镜像最小化，通常会把配置参数，环境变量等信息在运行镜像时带入。比如服务启用时需要一份 DB 数据库链接信息，那我们在启用时会将这个信息通过 `run`命令带入到容器中，而不会写死在镜像之中。镜像内容在构建之后也不会改变。通过一个镜像可以创建多个容器实例。

镜像严格来说，它并非像我们熟知的 ISO 镜像包，而是由一组文件系统组成。在镜像构建时，会一层一层地进行构建，前一层是后一层的基础。每一层构建完成就不会再发生改变，后一层的任何改变只发生在自己这一层。重新构建镜像时，如果你想执行删除前一层文件的操作，那么前一层真实文件并不会被删除。该删除操作，只会用一个已删除文件的目录将其覆盖，真实的文件还存在镜像中。

在实际开发中，我们在构建镜像时应该如何减少文件层级从而减少镜像大小呢？ 首先我们在 `Dockerfile` 文件的时候，定义基础镜像的时候建议使用原生镜像，因为原生镜像没有其他多余的文件层级。其次在定义好基础镜像之后，建议把多个 RUN 指令写成一行而不是多行，因为每多一行 RUN 指令就会多产生一层文件。最后，我们应该合理的规划 `Dockerfile` 文件内容，避免非必要的指令。

### 镜像仓库

镜像仓库（`Registry`）是 `Docker` 集中存放镜像文件的地方，存储的镜像都以数据库（`Blob`）的方式存储在文件系统中。我们可以根据镜像仓库所处位置不同分为远端镜像仓库和本地镜像仓库。

一个 `Docker Registry` 中可以存放很多个镜像，当然在实际使用中我们会根据用途存放在不同的存储路径下。

### Docker 的使用

接下来，我们就来简单讲一下 `Docker` 的使用过程。

当我们完成代码开发工作之后，该如何使用 `Docker` 来完成部署服务呢？使用 `Docker` 部署大致分为下图的流程：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f9763c053d748ebb3eef38dde462fde~tplv-k3u1fbpfcp-zoom-1.image)

首先我们需要有 `Dockfile` 文件，然后通过 `Dockerfile` 文件构建一个镜像，构建完的镜像需要在实际的机器上面运行，之后才能对外提供服务。下面我们就来具体讲讲如何把我们的代码使用 `Docker` 进行容器化部署。

#### 准备代码文件

举例，下面是我们一段最基本的 `nodeJS` 的开发代码，通过 `nodeJS` 的 `http` 模块监听 `8110` 端口，`http` 请求返回 “Hello World”，文件命名为 `server.js`。

```js
const http = require("http");

http.createServer(function (request, response) {
  // 发送 HTTP 头部 
  // HTTP 状态值: 200 : OK
  // 内容类型: text/plain
  response.writeHead(200, {'Content-Type': 'text/plain'});

  // 发送响应数据 "Hello World"
  response.end('Hello World');
}).listen(8110);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8110/');
```

#### 创建 Dockerfile 文件

在 Docker 中使用 `Dockerfile` 文件来构建镜像，其中包含了一个容器中的所有内容。我们在 `server.js` 的同级目录下编辑一个名为 `nodejs_dockerfile` 的文件。文件的主要功能如下：

- 使用 `FROM` 指令选择一个基础镜像，
- 使用 `WORKDIR` 指令设置服务的工作目录：`/app`；
- 使用 `ADD` 指令把本地编辑好的 `server.js` 文件拷贝到 `/app` 目录下；
- 如果使用到额外的 `npm` 依赖，则需要使用 `RUN` 命令安装依赖，在本基础镜像中不需要，该行命令就注释掉了；
- 再使用 `EXPOSE` 指令告知容器运行时监听 `8110` 端口，
- 最后 `CMD` 命令定义容器启动时会执行的命令。

`nodejs_dockerfile` 文件的具体的代码如下：

```bash
# 选择基础镜像
FROM node:8.11-slim

# 设定服务工作路径
WORKDIR /app

# 从当前路径拷贝到容器中的 /app/ 目录下
ADD server.js /app/

# 运行 npm install
# RUN npm install

# 指定容器监听端口
EXPOSE 8110

# 在容器运行时执行
CMD ["node", "server.js"]
```

执行完上述步骤之后，当前目录下应该有 `nodejs_dockerfile` 和 `server.js` 两个文件：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb4e617b4337474c81dd3b85dc442b86~tplv-k3u1fbpfcp-zoom-1.image)

### 构建镜像

在准备好 `Dockerfile` 文件内容后，就可以开始构建镜像了。构建命令的语法为：

```bash
docker build -t [image_name:image_tag] -f [dockerfile_name] . 

// -f --file string   Name of the Dockerfile(Default is '$PATH/dockerfile')
// -t, --tag list     Name and optionally a tag in the 'name:tag' format
```

如果不想指定 `Dockerfile` 文件名，那 `dockerfile` 文件的名称就写成 `dockerfile` 即可。另外提醒一下，语法最后有一个点号 `.`，这个千万不能忽略。

`docker build` 命令中一共做了以下几步，分别为：

1.  `load build`：加载目标文件；
2.  `load .dockerignore`：加载 `.dockerignore` 文件。`.dockerignore` 文件是定义在 `docker` 构建时不需要带入的内容，有点类似 `.gitignore`；
3.  `load metadata`：加载缓存元数据；
4.  执行 `dockerfile` ： `[1/3]`，`[2/3]`，`[3/3]` 表示前面 dockerfile 构建需要执行的内容；
5.  `load build context`：加载构建内容的上下文；
6.  `exporting to image`：输出镜像，包括 `sha256` 值。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb19cb5fde81406ea42f82320e22e42b~tplv-k3u1fbpfcp-zoom-1.image)

可以通过 `docker images` 命令查看到当前构建出来的镜像，如图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1b10863f4ef4cf79e00ea52589757c1~tplv-k3u1fbpfcp-zoom-1.image)

还可以使用 `docker history` 查看这个镜像的构建历史。在下图中 `WORKDIR` 以下的内容就是基础镜像本身的信息，每一个指令的时间，所占空间大小等等信息。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59a5c0ace8184dca8a7b1b59bcfc5b52~tplv-k3u1fbpfcp-zoom-1.image)

`WORKDIR` 以上部分则是本次构建新增信息，在上图 `COMMENT` 还可以看到 [buildkit](https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/syntax.md) ，这是 `18.09` 版本后 `Docker Build` 增强的功能，是由 `Docker` 公司开发的 `docker build` 工具。使用 `buildkit` 相较之前，新增了 `--secret` 命令，允许用户传递信息，不再需要 `root` 权限；可以兼容旧版本的 `dockerfile`，支持多阶段构建。

构建时可以通过指定配置是否启用 `buildkit`，1 表示启用，0 表示不启用

```
 DOCKER_BUILDKIT=1 docker build .
```

也可以在 `/etc/docker/daemon.json` 文件中修改设置

```
{ "features": { "buildkit": true } }
```

### 运行镜像

镜像构建好之后，我们使用 `run` 命令来运行镜像：

```
docker run --name {$docker_runtime_name} -p {$local_port:image_port} -d image_name:image_tag 

// --name : 容器运行时的名称，名称在当前机器上面是唯一的；
// -p : 本机的端口与容器端口的映射关系；
// -d : 容器在后台运行，并输出容器 ID；
// image_name:image_tag: 镜像tag，一般是完整的镜像 URL；
```

通过 `run` 命令启动时，把本地的 `8110` 端口映射到容器的 `8110` 端口。在容器成功启动之后，可以通过访问当前机器的 `IP` 地址，加 `8110` 端口就可以访问到现在拉起的服务。效果如图：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b46d80dbc41e4b9090d53bf70d6701b1~tplv-k3u1fbpfcp-zoom-1.image)

容器端口和本机端口不冲突，是两个 `namespace` 下的端口，但是本机的端口在机器上是唯一的， 如果运行多个容器时，请确保机器上的端口唯一。否则启动容器时会报错端口冲突。

通过本地 `curl` 命令，可以看到如下结果，正确返回了 `nodejs` 的代码设置。

```
curl http://localhost:8110 -#
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88031f4d770442fb9549b9e101ca666e~tplv-k3u1fbpfcp-zoom-1.image)

# 容器化技术和虚拟机技术对比

在容器化之前，我们使用虚拟机技术进行部署，虚拟机技术也是带环境安装的一种解决方案。在部署时，我们可以通过虚拟机还原开发环境，降低环境对软件运行结果的影响。虚拟机有其优点也有其局限性。

虚拟机（VM）是一种创建于物理硬件系统（位于外部或内部）、充当虚拟计算机系统的虚拟环境，它模拟出了自己的整套硬件，包括 CPU、内存、网络接口和存储器。通过名为[虚拟机监控程序](https://www.redhat.com/zh/topics/virtualization/what-is-a-hypervisor)的软件，用户可以将机器的资源与硬件分开并进行适当置备，以供虚拟机使用。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb4a231abd0a46469cb8a0b144c73bef~tplv-k3u1fbpfcp-zoom-1.image)

从上图可以看出，左侧是虚拟机通过 Hyper Vistor 虚拟了一个操作系统，然后在这个虚拟操作系统中部署应用服务。右侧是 Docker 的结构，并没有虚拟化操作系统，而是直接使用宿主机的内核，通过 Docker Engine 来管理所有的应用程序。

容器和虚拟机在技术上有相似性，他们共同的特点就是环境隔离。但是因为其底层的区别导致两者在性能和运行密度、内存代价上有很大的区别。虚拟化更“重”，容器化更“轻”。两者的对比如下：

| 特性 | 容器化 | 虚拟机 |
| --- | --- | --- |
| 启动速度 | 秒级 | 分钟级 |
| 性能 | 接近原生 | 较弱 |
| 内存代价 | 很小 | 较多 |
| 硬盘使用 | 一般为MB | 一般为GB |
| 运行密度 | 单机支持上千个容器 | 一般几十个 |
| 隔离性 | 安全隔离 | 安全隔离 |
| 迁移性 | 优秀 | 一般 |

# 容器化部署的优点

- **资源利用率更高**：容器化不需要进行硬件的虚拟化，其通过 namespace 和 cgroup 技术实现空间隔离，合理划分系统资源；
- **启动时间更短**：可以达到秒级甚至毫秒级启动，节约时间成本；
- **环境一致性：** 环境变量更可控，在容器化中应用的运行环境是一致的；
- **CI/CD 更轻松**：通过 Dockerfile 一次构建镜像，快速部署到任意环境；
- **运维成本更低：** 在环境迁移，系统维护，容量扩展等场景下操作成本更低；
- **资源隔离更安全**：任意一个容器在任意一个节点上都是隔离的。

# 容器化部署的缺点

当我们不停的吹嘘容器化的好处之后，也必须正视容器化的不足。因为容器化的本质，即不虚拟内核系统，而是直接使用宿主机的内核，所以容器无法进行内核测试。

假设，某一天的测试任务是要测试 AMD 下的服务情况，但是公司的服务器只有 x86 ，这种场景下是无法满足测试需求的。

在实际使用中，我们更多的是将容器技术和虚拟化技术相结合，取长补短，共同进步。

# 容器化部署实践经验分享

在生产环境中，很多事情并没有想象的那么完美，所有的技术都在不断地更新和迭代，随着时间的积累，可能之前的小问题，慢慢的随着时间的发展会逐步暴露出来，变成了大问题。下面就给大家分享一下在日常工作中总结出的经验。

## 镜像大小问题

任何项目启动时，基础镜像可能只有几十 MB，在不断开发迭代过程中，可能因为历史原因，也可能因为其他原因，导致镜像文件层级越来多，最终镜像的大小可能达到 几个G。由此带来如下问题：

- **镜像仓库问题**：需要定期清理历史镜像版本，或者扩容镜像仓库存储空间；
- **服务部署问题**：服务启动拉取镜像时，需要更多时间，且占用服务器存储资源；
- **镜像传递问题**：需要更多时间传递镜像和存储空间来存储镜像。

## 资源问题

- **CPU 及内存等系统资源问题**：在容器创建时可以通过配置来限制容器的资源使用。在实际开发中，如果运维同学缺乏对机器资源的管理，可能会导致服务器资源调用过度，性能无法满足容器所需，而导致容器无法正常启动，又或是其他报错。
- **网络资源问题**：在网络中，我们通过不同的端口映射后端服务，如果 Docker 启动时定义了 host 模式并且启用了端口，那就有可能出现端口冲突的情况，这个就需要运维同学协助统一管理调度服务器上的端口资源。
- **容器化改造问题**：容器化部署虽好，但不是所有服务都适合容器化，容器化改造和上云改造是一样的，要对实际业务场景具体分析。比如 Oracle 数据库，SQLServer 数据库等，我们在实际中并不会容器化部署，因为它们需要更高的 I/O，更高的资源，完全不是一个轻量化的容器能够承担的。

# 总结

在本篇文章，给大家介绍了容器化部署方案以及其重要实践 —— Docker。Docker 中有三个重要的概念：容器、镜像、仓库，**镜像是 Docker 运行容器的前提，仓库是存放镜像的场所**。然后有带大家一起进行了实践。然后对比了容器技术和虚拟机技术并总结了容器化部署的优点和缺点，最后给大家分享了一些实战经验。希望对大家在平时开发过程有帮助\~
    