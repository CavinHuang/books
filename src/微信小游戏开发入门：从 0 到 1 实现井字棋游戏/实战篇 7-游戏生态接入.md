
# 实战篇 7-游戏生态接入
---

# 实战篇 7：游戏生态接入

小游戏平台不仅只有游戏本身，微信还围绕小游戏平台，为玩家和开发者提供了更多的相关服务。这一节我们了解一下“游戏圈”、“好友排行”、“图文广告（流量主）”和“视频广告”这几个功能。

## 1\. 接入游戏圈

游戏圈是微信为小游戏提供游戏交流、用户互动、反馈收集等社区能力的服务。开发者接入后可以轻松获得这些能力，无需额外的工作量。

接入游戏圈仅需要在游戏入口处调用 [wx.createGameClubButton\(\)](https://developers.weixin.qq.com/minigame/dev/document/open-api/game-club/wx.createGameClubButton.html) 方法，显示游戏圈按钮即可，其他工作小游戏平台已经全部做好了。

为配合游戏 UI 风格，游戏圈按钮有多种样式可供选择，详见文档：

![游戏圈](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d2d11fe55cd0f~tplv-t2oaga2asx-image.image)

```
// 创建并显示游戏圈按钮
let button = wx.createGameClubButton({
    icon: 'green',
    style: {
        left: 10,
        top: 76,
        width: 40,
        height: 40
    }
})

// 隐藏
button.hide()
// 显示
button.show()
// 销毁
button.destroy()
```

> 小游戏文档中的必填属性有误，请在开发工具中自行尝试，以实际效果为准

### 游戏圈界面

![游戏圈管理员配置](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/13/165d2d1bb7cf6a6e~tplv-t2oaga2asx-image.image)

### 管理员配置

开发者可以在后台指定客服人员维护游戏圈，设置路径：小程序后台 => 设置 => 游戏设置

![游戏圈管理员配置](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfedfa2b93b9~tplv-t2oaga2asx-image.image)

![游戏圈管理员配置](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfedfa5eb7f9~tplv-t2oaga2asx-image.image)

> 游戏圈管理员具有操作帖子置顶、沉底、屏蔽等权限，管理和维护健康的游戏圈内容与社区环境。

## 2\. 接入游戏中心的好友排行

若开发者希望自己的小游戏可以在搜索、小游戏中心等微信场景下，展现同玩好友的排行榜，可以配置使用小游戏的[排行榜](https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/ranklist.html)。

> 这里的排行榜仅影响微信场景，游戏内排行榜仍需开发者实现。

![排行榜范例](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfedfa7ff1d2~tplv-t2oaga2asx-image.image)

### 上报数据

> 在没有任何托管数据的时候，排行榜配置不会出现在小程序管理后台页面中。开发者可以先发版本，在有了上报数据后再来配置，中间不需要改动代码。

前台和后台各有一个可以用于上报数据的接口：

| 接端 | 适用场景 |
| :-- | :-- |
| [wx.setUserCloudStorage\(\)](https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.setUserCloudStorage.html) | 单机游戏如“跳一跳”，不存在公平问题，可由客户端计算得分并上传 |
| [setUserStorage](https://developers.weixin.qq.com/minigame/dev/document/open-api/data/setUserStorage.html) | 多人游戏如“坦克大战”，为了处理逃跑等情况，应由服务器计算得分并上传 |

（使用场景仅代表一般情况，开发者请酌情选择）

`wx.setUserCloudStorage()` 前端上报范例：

```

// 构造符合微信游戏中心排行榜要求的数据结构
// https://developers.weixin.qq.com/minigame/dev/document/open-api/data/KVData.html
let value = JSON.stringify({
  wxgame: {
    score: 30,                              // 用于游戏中心排行榜的成绩
    update_time: Math.floor(Date.now() / 1000),  // 以秒为单位的时间戳
  },
  win: 16,     // 成绩的其他组成部分
  total: 30,
})

// 调用接口上报数据
wx.setUserCouldStorage({
  KVDataList: [{
    key: 'score',
    value,
  }],
  success: () => {},
  fail: () => {},
  complete: () => {},
})
```

`setUserStorage` 后端上报范例请参考源码 weapi.js 中的 `sendScore()` 与 `setUserStorage()`

### 排行榜配置

小游戏后台 => 设置 => 游戏设置 => 排行榜配置

完成上一步的数据上报功能，并成功发版、上报真实数据后。在后台的游戏设置页面将会出现排行榜配置。

完成配置后等待审核通过即可。

## 3\. 接入图文广告（流量主）

使用“流量主”服务首先需要满足以下条件：

- 累计独立访客（UV）不低于1000
- 有严重违规记录的小程序不予申请

#### 创建广告位

![创建广告位](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfedfa806f70~tplv-t2oaga2asx-image.image)

#### 广告位管理

![创建广告位](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/12/165ccfee1f8cda71~tplv-t2oaga2asx-image.image)

满足条件并成功开通后，只需在代码中调用 `wx.createBannerAd()` 显示广告条即可，调用范例：

```
function createBannerAd () {
  let { screenWidth, screenHeight, version } = wx.getSystemInfoSync()
  // 要求 sdk 版本 2.0.4 或以上
  if (!wx.createBannerAd || compareVersion(version, '2.0.4') === -1) {
    return
  }
  
  let bannerAd = wx.createBannerAd({
    adUnitId: 'adunit-xxxxxxxxxxxxxxx',
    style: {
        left: 0,
        top: 0,
        width: screenWidth
    }
  })
  bannerAd.onResize(res => {
    bannerAd.style.top = screenHeight - res.height
  })
  return bannerAd
}
```

> 开发者工具暂不支持调试该 api ，请直接在真机上调试

## 4\. 接入视频广告

激励视频广告组件用法与流量主广告相似，可以参考上方代码，相应 API 为 `wx.createRewardedVideoAd()` 。视频广告目前已经开放，只要开通“流量主”服务就会同时获得视频广告能力。

## 5\. 小结

微信围绕小游戏平台提供的完善生态也是小游戏的重要组成部分，“游戏圈”、“好友排行”等服务为玩家提供了更好的体验，而“图文广告”、“视频广告”等服务为开发者提供了方便的流量变现渠道。小游戏作为一个新兴的平台，微信一直在不断的完善其生态，每一次变动都可能产生新的机会，开发者们需要密切关心，积极思考如何合理利用以最大化自身收益。
    