
# 实战篇 3-基于腾讯云的服务器环境搭建
---

# 实战篇 3：基于腾讯云的服务器环境搭建

有些游戏单机就可以取得不错的效果，玩家可以不断挑战自我，刷新排行榜，但有些游戏与其他玩家作战才会有更大的乐趣。我们必须架设服务器才能提供多人对战的能力。本节我们就来了解如何搭建我们自己的服务器环境。

对个人开发者来说，想要搭建自己的服务器，最合理的做法就是使用公有云。这种方式相对传统自购主机，机房托管的方式有巨大优势，是当下中小项目的不二选择。这里我们以腾讯云为例，演示搭建服务器环境的步骤。

## 1\. 申请云服务器

首先需要开通 “云服务器” 并申请 “域名” 。在注册[腾讯云](https://cloud.tencent.com/)账号后，进入[控制台](https://console.cloud.tencent.com/)，左上角 “[云产品](https://buy.cloud.tencent.com/cvm)” 处可以看到腾讯云提供的所有服务。

![腾讯云1.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af5767c061626~tplv-t2oaga2asx-image.image)

> 点击 “云计算与网络 \- 云服务器” 并完成服务器申请流程。此处选项仅做参考，读者请根据自身需求选择。

### 选择机型

![cvm1.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af5767c46810f~tplv-t2oaga2asx-image.image)

### 选择镜像

> 操作系统选择 ubuntu

![cvm2.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af5767c5e3f4d~tplv-t2oaga2asx-image.image)

### 选择带宽

> 按量计费模式的腾讯云云服务器无法辅助进行域名备案，建议至少按时长购买三个月完成域名备案。

![cvm3.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af5767c57905b~tplv-t2oaga2asx-image.image)

### 设置安全组与主机

![cvm7.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af5767c82d49f~tplv-t2oaga2asx-image.image)

我们需要注意以下几项：

1.  安全组选择 “新建安全组” 并使用选项 “放通全部端口”
2.  登录方式选择 “设置密码”

> 这些设置会降低服务器的安全性，但后续讲解会比较简单流畅，可以帮助我们集中注意力在本小册的主题上。 读者以后开发自己的游戏时，务必了解更多服务器安全相关知识，根据自身需求合理配置选项避免造成损失。

### 确认配置信息

确认配置信息并付款后，回到控制台即可看到新购买的主机。启动完毕之后，点击右侧 “登录” 按钮尝试登录。

![确认配置信息](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af5767cbe03b2~tplv-t2oaga2asx-image.image)

在弹出的新窗口内填写密码并确定，即可连接上服务器。然后我们还需要为服务器安装 node.js 环境，在终端中执行:

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

完成 node.js 安装，我们的服务器环境配置到此告一段落，执行 `exit` 命令断开连接。

## 2\. 注册域名

微信小游戏要求使用经过实名认证与备案的域名，且必须使用 https 协议。现在我们就以腾讯云为例讲解申请流程。

和 “云服务器” 一样，在腾讯云控制台左上角 “云产品” 处找到 “域名与网站 \- 域名注册“ ，点击注册域名。

![注册域名](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af5769ad48717~tplv-t2oaga2asx-image.image)

> 此处请注意勾选 “免费领取域名大礼包” 因为里面包含了 1 年的 ssl 证书，后续配置 https 需要用到。

![注册域名](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af576a0d8baea~tplv-t2oaga2asx-image.image)

最后一步需要填写域名所有者信息，填写完毕后提交订单即可完成购买。

![所有者信息](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af5772026e8aa~tplv-t2oaga2asx-image.image)

回到域名列表，我们看到当前域名是未实名未备案的。点击即可进行相应的操作，按要求提供相关资料，然后等待审查即可。等待审核期间，我们继续设置域名解析，点击右侧操作列下的 “解析” 链接。

![域名列表](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af577224c26d2~tplv-t2oaga2asx-image.image)

在 “域名解析” 选项卡下，点击 “新手快速添加” ，点击 “网站解析” 右侧的 “立即设置” 。

![域名解析](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af577253e6695~tplv-t2oaga2asx-image.image)

打开新网页窗口，进入云服务器列表，找到之前购买的服务器，并将公网 ip 填写到上一步中弹出的浮窗内，点击确定即可完成域名绑定。

![域名绑定](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af5772c544257~tplv-t2oaga2asx-image.image)

## 3\. 下载 ssl 证书

注册域名时，腾讯云还附赠了为期一年的 ssl 正式以供我们提供 https 支持。在控制台左上角 “云产品” 处，找到 ”域名与网站 \- ssl 证书管理“ 可以看到证书列表。

![ssl证书](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af577411106db~tplv-t2oaga2asx-image.image)

刚注册完需要一段时间才能完成颁发，颁发后点击右侧下载以备后用。

## 4\. 服务配置和部署

> Windows 读者可能需要对下文命令做一些修改，或者在购买的 ubuntu 云服务器环境下进行操作，连接方法见前文 “1. 购买云服务器” 的最后部分。

首先我们要拉取代码并安装依赖：

```
cd ~
git clone https://github.com/o2team/tictactoe-sample.git
cd tictactoe-sample/server
npm install
```

现在我们来看一下项目有哪些文件：

```
~/game/server/
├── xxxxxxxxxxxxxxx.key     域名 ssl 证书，在腾讯云控制台下载
├── xxxxxxxxxxxxxxx.crt     域名 私钥 文件，在腾讯云控制台下载
├── package.json
├── ecosystem.config.js     pm2 配置文件
├── db.js                   数据库
├── config.js               配置文件
├── index.js                入口文件
├── TicTacToe.js            井字大作战游戏逻辑
├── players.js              玩家相关逻辑
└── weapi.js                微信后台接口相关逻辑
```

首先，我们需要用前文下载的 ssl 证书文件替代项目中的两个假证书文件。若读者此时正使用云服务器，可以使用 scp 命令或 [FileZilla](https://filezilla-project.org/download.php?type=client) 等图形化 sftp 工具上传文件。

![FileZilla](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af57744114832~tplv-t2oaga2asx-image.image)

如图，输入 `sftp://` + `云服务器 ip` ，用户名 `ubuntu` 以及 `密码` 后，点击快速连接即可。左侧是本地目录，右侧是服务器，上传只需从左拖动到右侧即可。

解压下载的证书压缩包后，我们可以看到许多目录，复制 nginx 目录下后缀为 key 和 crt 的两个文件进行替换。完成替换后，打开 config.js 并修改 appid 和 secret 为小游戏的真实值。此时执行 `npm run dev` 或 `sudo npm start` 即可运行服务器。

```
# 以开发模式运行（ 8080 端口，不加载证书，需完成下文配置）
npm run dev
# 以正式模式运行（ 443 端口且加载证书，需完成下文配置）
sudo npm start
```

## 5\. 使用 PM2 运行对战服务器

刚才我们已经将对战服务成功运行起来了，但是如果我们现在断开连接，服务器就会关闭我们的对战服务进程。为了让它在我们断开链接后也能一直运行下去，我们需要使用 [PM2](https://pm2.io/runtime/) 进程管理器。它还提供了许多其他强大的功能，但目前我们只需要关心这一点。

```
# 先按下 ctrl + c 结束当前的进程

# 全局安装 pm2
npm install -g pm2
# 使用 pm2 启动对战服务器
sudo pm2 start
```

看到类似以下的输出，就说明对战服务已经成功运行起来了：

![PM2](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af5774bd1a5f3~tplv-t2oaga2asx-image.image)

现在我们就可以放心断开连接了，PM2 会保持我们的服务继续运行。

## 6\. 设置小游戏服务器域名

为了提高安全性，微信限制了小游戏只能访问预先设置好的域名。既然我们已经拥有了自己的域名，现在就回到小游戏管理页面，设置一下它们吧。（设置 => 开发设置 => 服务器域名）

![服务器域名](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/6/165af5777b1321e7~tplv-t2oaga2asx-image.image)

在日常开发中，我们通常都需要连接本地服务器或测试服务器。微信也考虑到了这一点，在微信开发者工具，以及预览小游戏时都提供了临时放开限制的方式。在实现小游戏端对战功能时我们会了解如何开启。

## 7\. 小结

这一节里，我们在腾讯云注册了服务器端需要的所有资源，包括主机、域名以及 ssl 证书。我们还了解了如何连接服务器执行命令，如何通过 sftp 上传文件到服务器，还简单的使用了 PM2 进程管理器。

一切顺利的话，现在我们的服务器部分应该已经万事俱备，可以继续小游戏对战逻辑的开发了。但在这之前我们还希望向读者解析一下服务器端代码的大体结构与重要的部分，让读者对整个项目有一个更为完整的理解。准备好了吗？让我们打开下一节继续探索吧！
    