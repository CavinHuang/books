
# 实战篇 2-小程序云的介绍与使用
---

# 小程序云的介绍与使用

## 什么是小程序云

先看[官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)的说法：

> 小程序云是微信团队联合腾讯云团队推出的一套小程序开发解决方案。小程序云为开发者提供完整的云端流程，弱化后端和运维概念，开发者无需购买和管理底层计算资源，包括服务器、数据库、静态存储，只需使用平台提供的简易 API 进行核心业务等开发，实现快速上线和迭代，把握业务发展的黄金时期。

其实翻译过来就是，**一个在小程序中使用的，不用购买服务器，不用运维的简易后端体系**，主要是为了突出**快和简便**。所以小程序云，就非常适合那些对数据本身弱依赖的，中小型的功能性小程序使用。

## 组成部分

小程序云主要有几大部分组成，分别是**云控制台**、**数据库**、**云函数**、**云存储**。以及分别在小程序端，和云端使用的 **js-sdk**、**admin-sdk**，下面逐一介绍一下。

### 云控制台

控制台是集成于微信开发者工具（IDE）的一个图形化界面管理终端。可以在最新版的微信开发者工具中点击 “云控制台”进入，如下图所示：

![image-20180813204217411](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165aa3854cbd6521~tplv-t2oaga2asx-image.image)

点击后会是这样的一个界面：

![console_main](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165aa3854c7847f5~tplv-t2oaga2asx-image.image)

可以见到，分别有**用户管理、数据库、文件管理、云函数、和统计分析**几个板块。这些板块都是字母意思，我就不做过多解释，主要都是为了用户能有一个 IDE，可以更清晰明了地处理小程序云的相关事项。

### 数据库

先看下官方的话

> 小程序云数据库是一种 NoSQL 云端数据库，数据以 JSON 格式存储，我们在底层支持弹性可扩展、自动容灾、监控管理。

而关系型数据库和文档型数据库的术语映射关系如下表：

| 关系型 | 文档型 |
| :-: | :-: |
| 数据库 database | 数据库 database |
| 表 table | 集合 collection |
| 行 row | 文档 document |
| 列 column | 字段 field |

个人感觉，用法类似于`mongodb`，主要是在 IDE 中使用 **JS-SDK**、**Admin SDK** 进行数据库的操作。

##### IDE 中数据操作是这样子的

![database_main](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165aa3854cacb1c8~tplv-t2oaga2asx-image.image)

在左上角可以先建一个集合，然后添加文档，向里面插入一些数据。对于每个集合，还可以设置权限，指定用户、创建者和管理者的读写权限。除此之外，还可以添加索引，以提高查询效率。

那具体在小程序中如何操作数据呢？在最新的微信者开发工具里面，可以使用 `wx.cloud.database()` 获取数据库实例：

```
// 首先先初始化小程序云
wx.cloud.init({
    env: 'taro-ebook-23bbcb', // 前往云控制台获取环境 ID
    traceUser: true // 是否要捕捉每个用户的访问记录。设置为 true，用户可在管理端看到用户访问记录
})

// 获取数据库实例
const db = wx.cloud.database()

// 获取指定集合
const shopCollection = db.collection('shop')

// 获取数据
shopCollection.get({
    success: res => {
      console.log(res.data)
    },
    fail: err => {
      console.log(err.errCode, err.errMsg)
    }
})

// 使用 Promise 语法,也可以使用async/await
db.collection('goods').get().then(res => {
  // 取数据，res.data 即是上述例子数据
  console.log(res.data)
}).catch(err => {
  console.log(err.errCode, err.errMsg)
})
```

除此之外，在服务端，也可以使用类似的 API 进行数据库操作。更多的 API 使用方法可以见[文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/capabilities.html#%E6%95%B0%E6%8D%AE%E5%BA%93)。

### 云函数

> 云函数即在云端（服务器端）运行的函数。在物理设计上，一个云函数可由多个文件组成，占用一定量的 CPU 内存等计算资源；各云函数完全独立；可分别部署在不同的地区。开发者无需购买、搭建服务器，只需编写函数代码并部署到云端即可在小程序端调用，同时云函数之间也可互相调用。

简单来说，就是将一个函数，也可以理解为一个入口放在 **Node.js 环境**（即服务端环境）下运行，各个小程序之间相互独立，可以在小程序中，或者在另一个云函数中运行。

其实就是将后端代码颗粒化了，以函数为单位，可以一个个地分别部署，而且不受服务器等的限制，显得十分简便快捷。

代码示例：

```
// 这个云函数将传入的 a 和 b 相加返回

exports.main = (event, context) => {
  console.log(event)
  console.log(context)

  return {
    event,
    sum: event.a + event.b
  }
}
```

云函数的传入参数有两个，一个是 `event` 对象，一个是 `context` 对象。

- `event`对象是函数调用时传入的参数，通过此 `event`对象，代码将与触发函数的事件（`event`）交互，外加后端自动注入的小程序用户的 OpenID 和小程序的 App ID
- `context` 对象包含了此处调用的调用信息和运行状态，可以用它来了解服务运行的情况

函数调用：

```
wx.cloud.callFunction({
  // 要调用的云函数名称
  name: 'add',
  // 传递给云函数的参数
  data: {
    x: 1,
    y: 2,
  },
  success: res => {
    // output: res.result === 3
  },
  fail: err => {
    // handle error
  },
  complete: () => {
    // ...
  }
})
```

`name`指的是函数的名称，`data`即上述所说的`event`入参。更具体的使用和部署可以参照文档，在这里就不多作解释了。

### 云存储

> 云存储提供高可用、高稳定、强安全的云端存储服务，支持任意数量和形式的非结构化数据存储，如视频和图片，并在控制台进行可视化管理。

可以理解为一个存放图片，存放视频等静态资源的地方，可以当做是一个 CDN。

![storage_main](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/5/165aa3854d8b938e~tplv-t2oaga2asx-image.image)

同样的，可以在控制台中对各种资源进行操作，包括上传、下载文件，权限设置等。上面的图片一目了然。

## 实战使用

这里只作一个使用流程的讲解，不会过于强调细节。

- 首先，你的小程序需要根据[官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)**开通小程序云**，下载最新的 [开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html)，然后就可以打开云控制台，在云控制台中获取到环境名称和环境 ID，用于小程序中，小程序云的初始化。
- 在数据库中建立相关的**数据集合（即数据表）**，插入一些数据，同时设置数据权限。
- 在小程序中，或者云函数中**进行数据库操作**，拿到所需的数据。

如此一来整个小程序的前后端流程便打通了，不用再通过拉接口什么的来获取数据，而是直接在小程序中获取数据，可以说是很大的简化了开发流程。

## 小结

小程序云用起来还是比较便捷的，省去了后台搭建或是后台接口调试的流程，对于一些中小型小程序或是一些独立开发者是非常友好的。下一篇，我们将讲述如何使用小程序云开发电商小程序。
    