
# 后端预备-MySql 本地安装(Win + Mac)
---

## 前言

对于前端来说，一看到 `MySQL` 可能内心是抵触的，因为它属于后端领域的范畴，前端专注的是浏览器，服务端专注的是数据。但是作为一名有心成为全栈前端工程师的你来说，数据库的学习和使用是避不开的。你可能会问，为什么是 `MySQL`，而不是 `MongoDB`、`Oracle`、`SQL Server` 之类的数据库。

`MySQL` 的使用率相对较高，遇到问题网上的解决方案也很多，所以本教程使用它来作为数据库工具。

你可以这么理解数据库，它就是用于将数据持久化存储的一个容器，并且这个容器处在云端。而不是像浏览器的本地存储（localStorage）一样，数据只是针对于你当前所在的浏览器。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9165440ef0cd4d1896fa4a8011eeb57e~tplv-k3u1fbpfcp-zoom-1.image)

浏览器的存储是一对一的，而线上数据库的存储是一对多，或者是多对多（数据库可能会有多个）。

后端要做的事情，就是将数据库中的表与表之间，建立好一定的联系。根据产品需要的逻辑联系，将数据以 `API` 接口的形式抛出，供前端开发人员调用。

## 本地安装 MySQL

使用它之前，我们需要在本地安装 `MySQL`，很多前端小伙伴在这一步就没坚持下去，选择了放弃。如果这点困难都不能克服，程序员这个职业可能真的不适合你。

考虑到同学们的电脑系统的不同，这里我分 `Windows` 和 `Mac` 两个版本去介绍如何在本地安装数据库。

#### Windows

`Windows` 操作系统中，有两种安装 `MySQL` 的方法：

1、下载 `MSI` 文件，然后点击运行，利用 `Windows` 系统饿的安装程序方法，一步一步往下走。`MSI` 文件就是可视化界面安装文件。

2、下载 `ZIP` 压缩包，解压出来就能立即使用，可能下载的时候会慢一些，本教程我们使用该方式安装 `MySQL`。

**下载**

首先我们打开 [MySQL 官方下载地址](https://dev.mysql.com/downloads/mysql/)。网站会自动匹配适合你当前计算机的安装文件列表，这里我们选择如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1dab5931e824ff2815bc5b72b28b57e~tplv-k3u1fbpfcp-zoom-1.image)

点击「Download」之后，会让你注册登录账号，此时可以选择点击下面这段文字，跳过注册登录。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77d5a83c24554b299bc6cad6c3635bd2~tplv-k3u1fbpfcp-zoom-1.image)

**解压**

下载完成之后，解压到自己想要放置的目录下，比如我就将其解压到我的 `C:\mysql` 目录下，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97ddc907b5854ace9954c6b84a94cb82~tplv-k3u1fbpfcp-zoom-1.image)

> 注意：此时解压后的文件夹中没有 data 目录和 ini 文件。

此时在 `mysql-8.0.24-winx64` 文件夹内新建一个空的 `my.ini`。如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/45fbfeb1799743efbba108f4798cd434~tplv-k3u1fbpfcp-zoom-1.image)

**环境变量配置**

打开控制面板，点击「系统和安全」，进入「系统」点击高级系统设置，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55b58583af264cf290b42f69657fe5ee~tplv-k3u1fbpfcp-zoom-1.image)

点击右下角的「环境变量\(N\)」按钮，在系统变量里新建名为 「MYSQL\_HOME」，变量值就是你上一步解压后存放 `MySQL` 文件的安装路径。我的安装路径如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d10088b081e458eb0f51d5e7c7bf893~tplv-k3u1fbpfcp-zoom-1.image)

设置 `Path`，在 `Path` 里面新增 `bin` 目录。双击 `Path`，然后点击新建按钮，添加 `%MYSQL_HOME%\bin` 如下：

![](https:////s.yezgea02.com/1620633149252/2051620633140_.pic_hd.jpg)

此时你再观察全路径，`MYSQL_HOME` 已经被解析成具体的路径，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb960c3827ed4e449b69bf0db21d06b3~tplv-k3u1fbpfcp-zoom-1.image)

这一步的目的，是为了后续能使用 `cmd` 指令去安装 `MySQL`。

**安装**

首先，以管理员身份运行 `cmd`，`Windows 10` 下，直接右键「开始」，找到「命令提示符\(管理员\)\(A\)」，点击打开 `cmd`。

1、进入安装 `mysql` 的目录，进入 `bin`:

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7be74f5c595d4070b1d5620128866f01~tplv-k3u1fbpfcp-zoom-1.image)

2、运行安装指令：

```bash
mysqld --install
```

安装成功的话，控制台会提示如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9d3d686167842f6953a366a21346666~tplv-k3u1fbpfcp-zoom-1.image)

3、运行如下指令生成 `data` 目录：

```bash
mysqld --initialize-insecure --user=mysql
```

4、启动 `mysql` 服务：

```bash
net start mysql
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cc0fb5c438f14718884bb1bf7f7d91db~tplv-k3u1fbpfcp-zoom-1.image)

此时，不用怀疑，你已经成功在你的本地启动了 `MySQL` 服务。

5、（关键步骤）

如果后续用 `egg-mysql` 插件连接数据库的时候会报下面这样的错误：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d4141da8bffe455c9d0d6dc272166436~tplv-k3u1fbpfcp-zoom-1.image)

这是因为 8.0 之前的 `mysql` 版本，加密规则是 `mysql_native_password`，而在 8.0 之后，加密规则变为 `caching_sha2_password`。此时你如果用的是 8.0 以前的版本，那么通过 `egg` 启动项目连接数据库是没问题的，我们这里使用的是 8.0 以后的版本，所以就会出现上述错误。

**解决办法：**

以管理员身份运行 `cmd`，上文已经提到过。通过 `mysql \-u root \-p` 回车进入 `mysql` 如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b399bc6352ee4db695ed48f37a3315bc~tplv-k3u1fbpfcp-zoom-1.image)

我已经设置过密码了，所以上图我是用密码登录的，你若是没有设置，可以直接敲回车登录。

输入下面指令：

```bash
use mysql;
```

```bash
alter user 'root'@'localhost' identified with mysql_native_password by '你的密码';
```

```bash
flush privileges;
```

上述指令的作用是，还原 `MySQL` 的加密规则，还原之后，你再 `egg` 项目中连接 `MySQL` 的时候，就不会报错了。

并且上述指令中的 **「你的密码」**，如果你设置的话，那就会生效，成为以后你登录数据库的密码。

> 注意，指令一定要按照上述输入，包括最后的分号，不然会指令错误。

#### Mac

接下来，我们来安装 `Mac` 环境下的 `MySQL`。同样的，我们打开[下载地址](https://dev.mysql.com/downloads/mysql/)。我们选择下载 `dmg` 文件，如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f95b266390d4fb1851a4eae55608ff3~tplv-k3u1fbpfcp-zoom-1.image)

> 注意，如果安装完之后，出现一些小问题，如无法载入的情况，建议点击 「Archives」选择稍微低一些的版本，如 8.0.20 等。

这里我选择的就是 8.0.20 的版本，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d06d63be602248079641f724c37779d6~tplv-k3u1fbpfcp-zoom-1.image)

下载完成之后，点击安装，按照步骤往下走，直到需要密码的适合，一定要记住自己设置的初始密码。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d39ca1d7110142a195509a53e3562ff9~tplv-k3u1fbpfcp-zoom-1.image)

后续链接数据库，需要这里设置的密码。

点击 「Finish」之后，我们点开「系统偏好」启动服务：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/51a475367ad3413c9af285bb686bb14b~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f3335f0ca814b19b0e6303b51bf9aee~tplv-k3u1fbpfcp-zoom-1.image)

此时我们在命令行输入 `mysql \-u root \-p` 命令，会提示「commod not found」，我们还需要将 `mysql` 加入系统环境变量。

1、进入 `/usr/local/mysql/bin`，查看此目录下是否有 `mysql`，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a22ec1a816f4174851d9cb97b2e0839~tplv-k3u1fbpfcp-zoom-1.image)

2、我们在命令行执行指令：

```bash
vim ~/.bash_profile
```

打开之后，点击键盘 「i」键，进入编辑模式，在 `.bash_profile` 中添加 `mysql/bin` 的目录，结束后点击键盘 「esc」退出编辑，输入 「:wq」回车保存。

如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ae7412f25a4494abf8e294a744a30b5~tplv-k3u1fbpfcp-zoom-1.image)

最后在命令行输入：

```bash
source ~/.bash_profile
```

使其配置生效。

再次输入指令尝试登录数据库，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1b563726de846d7af037f5d8f019bb0~tplv-k3u1fbpfcp-zoom-1.image)

上述的密码是安装数据库时，你自己设置好的初始化密码，进入数据库说明已经成功链接上数据库。此时你可以用各种指令去操作该数据库，也可以通过可视化工具，如 `DBevaer` 操作数据库。

此时我们要开启服务，就用如下指令：

```bash
mysql.server start
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c32953d369749a1acdd1c0917624464~tplv-k3u1fbpfcp-zoom-1.image)

## 总结

可以顺利阅读完本章节，并且本地安装好 `MySQL`，说明你还是学习能力是在线的，我一再强调，过程中遇到问题，可以根据错误提示去搜索引擎查找相关的答案，这个能力是一名普通程序员必备的能力。既然 `MySQL` 已经启动了，下一章节为大家带来，数据库可视化操作工具 `DBevaer`，以及 `Egg` 链接本地数据库，做一些简单的数据库 `CRUD` 工作。
    