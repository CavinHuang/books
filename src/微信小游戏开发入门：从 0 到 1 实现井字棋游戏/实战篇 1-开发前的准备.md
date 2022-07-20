
# 实战篇 1-开发前的准备
---

# 实战篇 1：开发前的准备

在实战篇里，我们将要实现一款名为“井字大作战”的井字棋小游戏。游戏玩法相信大家都非常熟悉：两个玩家分别用 X 和 O 作为自己的棋子，轮流在 3x3 的棋盘上下棋；当其中一方在横、竖、斜任意一个方向上有三个棋子连成一线时，此玩家就能获得胜利；如果棋盘上9个格子都下满棋子，而且双方的棋子都没有连成一线则为平局。

![游戏截图](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfcd80df0b70~tplv-t2oaga2asx-image.image)

目前该小游戏已经完成上线，大家可以通过扫描下面的二维码进行线上体验：

![小游戏码](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfcd80ea64c9~tplv-t2oaga2asx-image.image)

借着这样一个简单的项目，我们会带着读者一起从注册、开发到上架，走过一次完整的小游戏开发过程。在联网对战部分，我们还会接触一些服务器相关的主题，以供不满足于单机游戏的读者进一步了解多人游戏的实现。

小游戏能区别于其他游戏形式的地方，在于它基于微信的独特生态。这让它具备了极强的社交性，我们也会讲到如何整合、利用小游戏生态，充分发挥小游戏的潜力。

现在，让我们一起开始做些准备工作吧！

## 1\. 注册小游戏

是不是有点小激动，我们就要注册自己的第一个小游戏了，前往[小程序注册页面](https://mp.weixin.qq.com/)。

> 微信的各个平台比如小程序、公众平台、开放平台、企业号和个人号的邮箱基本都是互斥的，同一邮箱只能注册一个平台，所以微信开发者们的个人邮箱很容易就会用完。为了避免这种尴尬，我们其实可以使用[腾讯云企业邮箱](https://cloud.tencent.com/product/exmail)这类服务。免费套餐也至少有几十个邮箱可以分配，满足个人开发者需求绰绰有余。

![注册小程序](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfcd80f6e2ed~tplv-t2oaga2asx-image.image)

选择主体类型，这里我们选择个人，然后填写相应信息，进行微信认证，完成注册。个人主体无法开启虚拟支付，有此意向的开发者请选择其他主体类型。

> 一个身份证只允许注册五个小程序，而且目前为止无法注销，各位读者自行留意。

![选择主体类型](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfcd810e1285~tplv-t2oaga2asx-image.image)

完成注册后，页面跳转到小程序后台首页，引导我们继续补充信息和下载开发工具。

> 这里的”普通小程序开发者工具“与”小游戏开发者工具“其实是一样的（版本可能不同，可能是因为网站没有同步更新），随便点一个下载就好了。

![补充信息](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfcd810e4db3~tplv-t2oaga2asx-image.image)

补充信息并下载开发工具后，点击下图的“开发设置”链接获取 AppID 与 AppSecret 。需要进行重置才能获得 AppSecret ，请务必妥善保管，此后若丢失则必须再次重置重新生成，会对运营中的服务造成很大麻烦。

![AppID与AppSecret](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfcd80fb583a~tplv-t2oaga2asx-image.image)

到这里，我们的小游戏已经注册完成。在游戏开发之前，我们先下载最新的[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。

## 2\. 游戏引擎选择

本次的井字大作战小游戏将使用 [Phaser](http://phaser.io/) 作为游戏引擎进行开发。Phaser 是一款国外的 2D 的 HTML5 游戏开发框架，在 Github 上一直保持着相当高的 star 数，它提供了丰富的游戏开发功能支持，开发者可以快速的开发自己的 HTML5 游戏。

![Phaser 功能特性](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfcda2fff926~tplv-t2oaga2asx-image.image)

Phaser 最新的版本是 Phaser 3, Phaser 2 已经转由社区维护（[Phaser CE 版](https://github.com/photonstorm/phaser-ce)）。相对于 Phaser 3，Phaser CE 版有更为丰富的文档例子和社区资料，更容易上手入门。此次将选择 Phaser CE v2.11.0 版进行开发，[代码包](https://github.com/photonstorm/phaser-ce/archive/v2.11.0.zip)可在 Github 上获取。

## 3\. 游戏引擎适配

前边的章节有提到微信小游戏中并没有 BOM 和 DOM 的 api, 如果游戏引擎中依赖了这些 api ，就必须进行适配。Cocos、白鹭和 Laya 官方已经做了这些工作，但 Phaser 是国外的开源产品，要在微信小游戏中使用我们还需要自行适配。好在微信官方提供了一个基本的 Adapter ，我们可以在它的基础上进行改造。

> 我们的 Adapter 只对用到的功能做了不完整适配，所以和官方的区别非常小。

实际上，我们只需增加数个属性以保证 Phaser 能够在本文以及大部分情况下的正常使用：

```
// 只需改动 src/WindowProperties.js 一个文件

import {noop} from './util'

// src/WindowProperties.js 中原本的代码

// 为 PhaserJs 增加所需的属性以保证正常运行
export const clientTop = 0
export const clientLeft = 0
export const scrollTop = 0
export const scrollLeft = 0
export const scrollTo = noop
```

读者可以在 Github 上获取我们针对 Phaser 适配好的 [weapp-adapter.js](https://github.com/o2team/tictactoe-sample/blob/master/mgame/js/libs/weapp-adapter.js) 文件。若您要使用其他引擎，却苦于没有现成适配的，不妨也尝试一下自行适配。若有精力还可以回馈社区，就再好不过了。

## 4\. 下载示例代码

> Github 仓库地址：<https://github.com/o2team/tictactoe-sample>

本小册附带了服务器、小游戏两个项目的配套代码，存放在 Github 上，读者请预先下载到本地以备后用

下载 zip 压缩包：<https://github.com/o2team/tictactoe-sample/archive/master.zip>

或使用 `git clone` 命令：

```
git clone https://github.com/o2team/tictactoe-sample.git
```

### 配置服务器项目

server 是好友约战功能配套的服务器项目，实战篇3、4中对它进行了讲解。读者需要跟随指引申请腾讯云服务器、域名，进行实名认证、备案，并部署该项目，以实现好友约战功能。

server 需要配置的内容在 `server/config.js` 中，在 `实战篇3` 中我们会指引注册并配置该文件。此外，在域名备案的时候，我们还需要保证访问域名时能够打开一个网站，这个网站的内容读者可以在 `index.js` 中修改。

### 配置小游戏项目

读者会在后面的章节中循序渐进创建出这个小游戏项目（细节会有少量差异），因此并没有配置该项目并运行的必要，而应作为参考答案使用。若希望能够提前体验成品，可以扫描本节开头的小程序码。如果读者确实希望尝试运行本项目，请先阅读`实战篇3`将服务器部署好以后，再修改 `mgame/config.js` 中的配置项与 `mgame/project.config.json` 中的 `appid` ，然后用微信开发者工具添加该项目。

好了，下一步我们正式进入游戏的编码工作。
    