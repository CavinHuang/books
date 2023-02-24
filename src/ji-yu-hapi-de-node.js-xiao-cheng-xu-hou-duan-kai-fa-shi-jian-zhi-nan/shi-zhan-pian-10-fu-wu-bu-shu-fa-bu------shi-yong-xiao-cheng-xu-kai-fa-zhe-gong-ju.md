
# 实战篇 10-服务部署发布 —— 使用小程序开发者工具
---

# 服务部署发布 —— 使用小程序开发者工具

微信小程序的官方开发者工具，为我们开发者友好地集成了一套开发环境和生产环境快速部署的解决方案，目前服务端支持 Node.js 和 PHP 两种语言。我们可以使用开发者工具同时进行服务端和小程序的开发与部署。

下图是官方对开发环境和生产环境的介绍：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657dda12a78f399~tplv-t2oaga2asx-image.image)

我们可以使用开发者工具对开发环境和生产环境一键部署、以及查看腾讯云的状态。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657dda43de6c5b4~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddaa1a70fe13~tplv-t2oaga2asx-image.image)

由于要使用开发者工具上传部署代码，有服务端代码和没服务端代码的小程序项目，代码的目录结构是不同的。官方给我们提供了 Node.js 和 PHP 的项目模版，可以在开发环境使用指引中下载 demo，也可以用开发者工具新建项目时，选择项目模版，现在我们先用开发者工具创建一个 Node.js 的模版（假如我们有多个小程序，创建时 AppID 必须填我们要开通腾讯云服务的那个小程序 AppID）。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddada372642b~tplv-t2oaga2asx-image.image)

下图是我们刚才创建的 Node.js 项目模版，client 文件夹是前端代码，server 文件夹是服务端代码，project.config.json 文件还是放在项目根目录。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddb1276a752e~tplv-t2oaga2asx-image.image)

project.config.json 文件中的 miniprogramRoot 字段是配置前端目录，qcloudRoot 字段是配置服务端目录。使用开发者工具上传服务端代码时，会把 qcloudRoot 配置的目录中的文件上传到腾讯云。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddb452a19fa8~tplv-t2oaga2asx-image.image)

使用腾讯云的好处就是可以更方便、快速、可靠地构建我们的小程序，接下来我们按照以下顺序学习使用腾讯云：

1.开通腾讯云

2.开发环境的部署

3.生产环境的部署

### 1\. 开通腾讯云

首先在微信公众平台登录我们的小程序，登录后，在左侧菜单栏点击设置 \-> 开发者工具 \-> 腾讯云 \-> 开通。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddb71730ac1c~tplv-t2oaga2asx-image.image)

点击开通之后，需要使用微信扫码授权，然后按照提示进行操作就行了，授权成功之后会跳转到腾讯云的网站。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddb8c9587dc1~tplv-t2oaga2asx-image.image)

如果我们已经有腾讯云的账号，可以点击「关联到已有账号」，把微信小程序公众号关联到已有的腾讯云账号。如果没有，那就点击「继续注册」，会自动注册腾讯云账号，注册完成之后会跳转到腾讯云-微信小程序的页面，并且会自动把我们的微信小程序公众号关联到刚才注册的腾讯云账号。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddc1bd66b1ca~tplv-t2oaga2asx-image.image)

到这一步，腾讯云就已经开通完成了。现在回到微信公众平台，在左侧菜单栏点击设置 \-> 开发者工具 \-> 腾讯云，会显示「已开通」，并且会有一个「后台管理」按钮，点击这个按钮会进入腾讯云后台管理页面。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddc3162c8e98~tplv-t2oaga2asx-image.image)

现在回到开发者工具，点击详情 \-> 腾讯云状态，显示「已授权腾讯云」，但是开发环境和生产环境显示未开通，开发环境需要上传代码之后才会显示已开通（上传代码之后，会自动部署和重启服务器），生产环境需要手动部署代码后才会显示已开通（手动部署代码后，会重启服务器）。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddc4d447ea1c~tplv-t2oaga2asx-image.image)

### 2\. 开发环境的部署

开通腾讯云服务之后，我们就可以在这个项目中开发自己的服务端了，可以使用这个 demo 模板进行开发，也可以自行开发，需要注意的是：server 中必须有一个 app.js，Node.js 会执行这个文件。然后在开发者工具中点击「腾讯云」，上传服务端代码，第一次使用腾讯云时，需要选择开发环境，有 Node.js 和 PHP 两个选项，我们选择 Node.js 开发环境。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddc7798fdf6f~tplv-t2oaga2asx-image.image)

点击「确定」后，再次点击「腾讯云」，会弹出一个菜单：

- 上传测试代码 \- 把服务端代码上传到开发环境

- 启动单不调试 \- 打开开发环境的调试工具

- 安装依赖 \- 安装开发环境的依赖

- 重启服务 \- 重启开发环境

- 停止服务 \- 停止开发环境

- 恢复开发环境 \- 恢复开发环境

- 上传正式代码 \- 把代码上传到生产环境

- 前往管理中心 \- 打开小程序腾讯云的管理后台

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddcb3d228c88~tplv-t2oaga2asx-image.image)

接下来，点击「上传测试代码」，把代码上传到开发环境，第一次上传代码时，在弹框中选择「模块上传」，勾选其所有选项，并且勾选「部署后自动安装依赖」，之后再上传代码时勾选「智能上传」，如果恢复了开发环境，恢复后第一次上传代码还是选择模块上传，因为恢复开发环境会删除我们的代码。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddcd99e0a984~tplv-t2oaga2asx-image.image)

点击「确定」后会开始上传代码，上传成功后会部署环境，部署成功后安装依赖，安装成功后重启服务器。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddd0d5f35957~tplv-t2oaga2asx-image.image)

重启服务器成功后，腾讯云的开发环境就开通成功啦，我们可以到腾讯云管理后台看一下，如果不是重新打开管理后台页面，需要刷新一下，开发环境开通成功后，腾讯云会自动给开发环境分配一个二级域名、自动部署免费的 SSL 证书，并且提供免费的数据库。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddd3cc148502~tplv-t2oaga2asx-image.image)

然后我们再回到开发者工具，点击「详情」查看腾讯云状态，现在显示「已开通开发环境」，云服务状体是「运行中」，开发环境 request 域名就是我们开发环境的地址，如下图：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddd6a927a99e~tplv-t2oaga2asx-image.image)

现在我们的开发环境已经部署好了。接下来我们就可以使用 request 域名访问开发环境了，如图：请求成功。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657ddd9b819cd09~tplv-t2oaga2asx-image.image)

开发者工具中还给我们提供了一个调试服务端代码的工具-单步调试，点击腾讯云 \-> 启动单步调试打开调试工具，调试工具中有控制台，并且支持断点调试

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657dddf4d2b9d0b~tplv-t2oaga2asx-image.image)

开发环境中免费提供了 MySQL 数据库，小程序的腾讯云管理后台可以打开 phpMyAdmin 数据库管理工具。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657dde512b6dcf4~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657dde7316694ab~tplv-t2oaga2asx-image.image)

注意： _如果 7 天内没有上传代码的操作，开发环境将会被暂停，重新上传代码，环境将自动恢复。_

### 3\. 生产环境的部署

开通生产环境的步骤和开发环境不一样，在上传生产环境代码之前需要到小程序腾讯云管理后台开通生产环境，生产环境需要注册一个域名和购买云服务器，如果遇上腾讯云活动动推广，开通生产环境可以免费使用 3 个月云服务器，通常需要自行购买云服务器。目前云服务器有两个版本可以选，入门版和基础版，入门版的价格很便宜，49 元/月，注册域名和购买服务器可以按照提示点选操作，这里不做赘述。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657de2d4432f03f~tplv-t2oaga2asx-image.image)

开通生产环境后，按照步骤注册域名和购买云服务器完成后，会自动生产一个二级域名、自动部署 SSL 证书、免费提供 MySQL 数据库，在小程序腾讯云管理后台可以查看，数据库初始化的密码会发送短信到我们的手机上，数据库的管理跟开发环境一样，在管理后台还有一个「环境操作」的板块，安装生产环境的依赖、恢复生产环境、查看代码上传记录、生产环境代码的部署都在这里操作。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657de3070447ab8~tplv-t2oaga2asx-image.image)

然后需要先安装生产环境的依赖，点击环境操作板块的「安装依赖」，自动安装。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657de333f3b3bf4~tplv-t2oaga2asx-image.image)

依赖安装成功后，我们就可以用开发者工具上传代码到生产环境了，点击腾讯云 \-> 上传正式代码，会弹出一个框，需要填写版本号和备注，点击确定开始上传 （仅仅是把代码上传到生产环境，不会部署代码）。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657de3614d174dc~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657de3949171584~tplv-t2oaga2asx-image.image)

上传成功之后，我们需要到小程序腾讯云管理后台手动部署代码，部署之前我们先看一下代码上传记录，点击环境操作板块的「代码上传记录」查看上传记录，第一条记录就是我们最新上传的，而服务器运行的代码是上一次上传的代码。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657de3c47b2424d~tplv-t2oaga2asx-image.image)

现在我们点击「代码部署」按钮部署代码，每次部署代码都会部署最新上传的代码。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657de3eb93e7d15~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657de40ea9f64da~tplv-t2oaga2asx-image.image)

代码部署成功之后，我们回到开发者工具查看腾讯云状态，现在显示「已开通生产环境」，云服务状态是「运行中」，生产环境 request 域名就是服务器的地址，现在使用这个域名就可以访问生产环境了。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/8/28/1657de42fc6f6487~tplv-t2oaga2asx-image.image)

注意： _生产环境是无法调试的，所以代码在开发环境测试完成后，再部署到生产环境。_

## 小结

关键词：腾讯云，小程序开发者工具，phpMyAdmin

本小节围绕微信的开发者生态，讲解了基于微信小程序开发者工具的接口服务发布流程，极大化地降低了小程序开发者们对于 Linux 服务器运维管理的技能要求，自助完成开发、测试到生产的发布流程。
    