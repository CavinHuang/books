
# 开篇- 小程序的 Node.js 全栈之路
---

# 开篇：小程序的 Node.js 全栈之路

**17 个月  
100 多万款小程序  
150 多万名小程序开发者  
5000 多家第三方平台**

小程序生态下持续飙升的行业数据，令人热血沸腾。原本受制于 HTML5 的用户体验欠佳，用户们不得不消耗上月的时间，去完成一套 Android/iOS 单平台的原生应用。如今借助小程序 JavaScript 的动态语言灵活性与跨平台性，可以数日之内，便完成一款跨平台的接近原生体验的轻应用。

“天下武功，唯快不破。”小程序的产品化开发之迅捷，无疑是更受瞬息万变的商业市场欢迎的。也正是这样的快，使新零售新经济的产业升级产生了动力，愿意在这样的快节奏下去快速迭代产品，迎合市场需求。

面对大量产业升级新需求的涌现，小程序只是高效地解决了产品前端的问题，而用于支撑小程序的后端服务，又如何高效灵活地响应配合呢？

后端老大哥 Java 固然是一个最为稳重的选择，但为了得到「稳」 的效果，我们不得不付出「重」 的代价。那么是否还有其他特性鲜明的后端技术可以一战？虽然 PHP、Go、Python 等技术，在各自的领域里，也都有成熟的商业实践案例。但要想要达到极致的项目敏捷，最大化地降低前后端系统之间的实现与沟通成本，最大化地共享技术资源，基于 JavaScript 语言共性的全栈开发（full stack）是一种不错的选择，于是 Node.js 便应声而出。

## 小程序与 Node.js 后端服务

- 天然的前后端分离

具有独立性特点的小程序客户端，与 iOS/Android 原生客户端应用很相似，比如本身不支持 Cookie，自身无状态化。而在 HTML5 纯 Web 前端应用领域，若不对 SEO 与首屏渲染有太多苛刻需求，业内亦有大量的 Web 前后端分离的项目实践。使用一套后端 API 接口服务，同时支撑起小程序、原生客户端、Web 三个系统的业务数据，显然是一个让人兴奋的高性价比解决方案。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/9/165bb1b11fdb540b~tplv-t2oaga2asx-image.image)

- 一致化的 JavaScript 语言

早在小程序出现之前，前端圈便有一个酷炫的 Web 全栈开发的技能标签，前端 Web 页面开发使用 JavaScript，后端 server 使用 Node.js，一套 JavaScript 语言搞定一切。而今，面向小程序的全栈开发，小程序前端基础语法亦基于 JavaScript，那么 Node.js 自然也便成了天然契合的首选。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/9/165bb213232a666d~tplv-t2oaga2asx-image.image)

- 微服务的轻与重，快与慢

在前后端分离的大架构背景下，API 接口层的技术选型，无论是使用 Java、Node.js、PHP、Python、Go 等中的哪一种，对于前端而言，技术语言与框架选型都是后置与被隐藏的，最终暴露的都是一致化的 RESTful API 接口与标准化的 JSON 数据流。

不同的 API 服务端语言有不同的开发能效、不同的生态与稳定性，服务本身可以被前端无感地自由替换。而 Node.js 的全栈一致性与开发敏捷性，相信能够在项目的早期、中期，帮助一个小而美的轻盈小程序团队，更快速地完成产品迭代，创造更多的市场响应机会。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/9/9/165bb29306111c3f~tplv-t2oaga2asx-image.image)

## API 接口服务化的设计哲学

所谓万物皆有套路，API 接口服务层的基础服务，在不考虑重量级分布式架构的前提下，离不开下面罗列的核心技术点：

- 调试工具与技巧
- 后端基础打底框架
- 脱离版本库的环境参数配置
- 一致化的 HTTP response 返回
- 入参校验
- API Swagger文档化
- 数据库 ORM
- 基于 JWT 的用户身份验证
- 数据缓存
- 日志系统
- 单元测试

这些核心技术点可以被套路地组合在一起，仿佛一份全家桶的套餐表，作为开发人员，想用什么样的语言、什么样的插件，按需填坑便好。最终发现，与使用的语言并无多大关系，掌握了一种，我们也便得到了一切。

下面，笔者罗列了一些不同后端语言背景之下的技术关键词，以备日后不时之需，本小册的重点还是放在 Node.js 的技术栈与 hapi 应用开发框架。

| 类目 | Node.js | PHP | Go | Java |
| --- | --- | --- | --- | --- |
| 调试工具与技巧 | inspector+Chrome / VS Code | echo, dd, Xdebug | Log, Delve | intellij IDEA |
| 后端基础应用框架 | hapi | Laravel | gin | Spring Cloud\\Spring Boot |
| 一致化的 HTTP Response 返回 | boom | symfony/http-foundation | gin/Response Writer | ResponseBody + fastjson |
| 入参校验 | Joi | symfony/validator | gin/validator | JSR 303\\ Hibernate Validator |
| API Swagger文档化 | hapi-swagger | zircote/swagger-php | go-swagger | springfox-swagger-ui |
| 数据库 ORM | sequelize | Eloquent | gorm | JPA\\Hibernate |
| 基于 JWT 的用户身份验证 | hapi-auth-jwt2 | Laravel/passport | go-oauth2/oauth2 | spring-security-oauth2 |
| 数据缓存 | catbox | Illuminate\\Cache | go-cache | spring-boot-starter-cache |
| 日志系统 | good | monolog | sirupsen/logrus | slf4j\\ logback |
| 单元测试 | Lab \& code | oh-unit | Go test | junit |

## 如何阅读本小册

### 善用 What-How-Why 思维

What-How-Why 黄金圈法则是一套思维方法理论，是希望透过问题/现象（What），掌握方法/方案/措施 （How），领悟背后的原因/目的 （Why）。

在小册的实战篇中，整体的内容构成思路是 「What-How-Why-How」。先向同学们提出 What，即要解决一个怎样的业务问题。而后是 How，进行简要引导，指出解决问题的关键技术路线。接下来 Why，带你分析如此为之的原因。最后 How，实践方案展开，通过具体代码片段，完成对 What 的实现。

### 格局思维，由点及面

项目工程的系统化设计，是一个持续布局的过程。需要对未来的新功能需求的扩展进行布局，对项目工程化的多人协作进行布局。拥有格局化的思维，可以从容应对持续不断的新需求的挑战，亦可以通过扩充研发团队资源线性提升产能。小册的实战篇中，典型功能需求的持续新增与对应程序代码的有序实现，是一种项目工程格局化思维的体现。而每一章节的原子级技术案例看似简单，都是由点及面，支撑起未来庞大业务的基础技能。适合举一反三的扩展思考。

### 目标有形，代码无形

现实项目过程中，产品需求的目标是有形的。但通往产品实现的途中，程序的代码是无形的。选用什么样的技术架构？使用怎样的具体程序语言与模块组织？或许千人千面。小册在每一节的实战案例的文末，会附带有阶段性章节源码的配套链接，有形的代码仅供参考，而真正对同学们有价值的是将内容化为己用，利用自己对程序语言的理解来实现目标。

## 小结

关键词：全栈，API 接口设计，What-How-Why

本小节为开篇，我们为小程序的后端服务设定了一个 Node.js 的全栈化基调。在架构层面明确后端以 API 的形式作为服务时，我们对基础开发 API 所应掌握的技能清单做了一套类比与举例，希望以此使读者融会贯通，举一反三。同时希望小册的每一个读者同学，都能在阅读的过程中，站在一个更高的视角与思考，从小册中吸收获取到对自己当下最有用的知识点。
    