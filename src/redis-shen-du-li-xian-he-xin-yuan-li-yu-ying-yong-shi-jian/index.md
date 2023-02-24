
---
title: Redis 深度历险：核心原理与应用实践
---

## 简介
大型互联网企业 Redis 实践总结，结合实际问题深入讲解 Redis 内部机制

## 说明
## 小册介绍

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/13/16491e285c2c074a~tplv-t2oaga2asx-image.image)

Redis 是互联网技术架构在存储系统中使用最为广泛的中间件，它也是中高级后端工程师技术面试中面试官最喜欢问的工程技能之一，特别是那些优秀的、竞争激烈的大型互联网公司（比如 Twitter、新浪微博、阿里云、腾讯云、淘宝、知乎等），通常要求面试者不仅仅掌握 Redis 基础使用，更要求深层理解 Redis 内部实现的细节原理。毫不夸张地说，能把 Redis 的知识点全部吃透，你的半只脚就已经踏进心仪大公司的技术研发部。

但在平时经历的很多面试中，老钱发现大多数同学只会拿 Redis 做数据缓存，使用最简单的 get/set 方法，除此之外几乎一片茫然。也有小部分同学知道 Redis 的分布式锁，但也不清楚其内部实现机制，甚至在使用上就不标准，导致生产环境中出现意想不到的问题。还有很多同学没认识到 Redis 是个单线程结构，也不理解 Redis 缘何单线程还可以支持高并发等等。这也是老钱撰写这本小册的初衷，通过梳理总结自己的实践经验，帮助更多后端开发者更快更深入的掌握 Redis 技能。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/13/16491d30cf7fb606~tplv-t2oaga2asx-image.image)

老钱所在的掌阅科技，为了支撑海量（亿级）的用户服务，使用了上千个 Redis 实例，包含大约 100 个 Redis 集群 \(Codis\) 以及很多独立的 Redis 节点，因此，在使用 Redis 作为缓存和持久存储中间件上积累了较为丰富的实战经验，这些都将毫无保留的分享到这本小册中。

Redis 涉及到的知识点是非常繁多的，本小册将主要讲解其中最常见的 Redis 核心原理和应用实践经验，让读者在阅读之后可以快速武装自己并落地到平时的 Redis 项目开发中。除此之外，还会深入一些底层的至关重要的计算机科学基础原理，以及技术应用的思考方式，这些基础的知识和技能将最终决定你的技术人生道路可以走多快走多远。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/30/164ea81aad0ad0d0~tplv-t2oaga2asx-image.image)

### 本小册内容结构

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/30/164e967bb4eda445~tplv-t2oaga2asx-image.image)

本小册在内容结构上分为 Redis 基础应用、原理、集群、拓展学习和源码分析 5 个版块：

- Redis 基础应用：占据篇幅最长，这也是对读者最有价值的内容，可以直接应用到实际工作中。
- 原理和集群版块：适合对技术有着极致追求的开发者，他们希望透过简单的技术表面看到精致的底层世界。
- 拓展学习版块：作为最核心内容之外的补充部分，主要用于进一步扩展技术视野或者夯实基础，便于进阶学习，作者会尽可能的在拓展篇持续扩充更多知识点。
- 源码分析版块：主要满足高阶用户深入探索 Redis 内部实现的强烈渴望，这类读者坚信读懂源码才是技术实力的真正体现。

### 图文并茂、动画演示

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/5/164698cd0d3eec33~tplv-t2oaga2asx-image.image)

小册所有的静态图片使用了多彩易用的在线绘图工具：[Processon](https://processon.com)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/3/1645f098a4f5420e~tplv-t2oaga2asx-image.image)

小册的动态图片使用了 Mac 系统自带的 Keynote 来制作 ppt 动画，再使用 Screenflow 进行录屏剪辑导出 gif 动画。

## 适宜人群

1.  有 Redis 基础，渴望深度掌握 Redis 技术原理而不仅限于只会使用的中高级后端开发者；
2.  渴望成功打入大型互联网企业研发部的中高级后端开发者；
3.  需要支撑公司 Redis 中间件运维工作的初中级运维工程师们；
4.  希望更好的设计 Redis 面试题目的后端技术面试官；
5.  对 Redis 中间件技术好奇的中高级前端技术朋友们；

## 作者介绍

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/23/164c54f7d4f3f49b~tplv-t2oaga2asx-image.image)

钱文品（老钱），互联网分布式高并发技术十年老兵，目前任掌阅服务端技术专家。熟练使用 Java、Python、Golang 等多种计算机语言，开发过游戏，制作过网站，写过消息推送系统和 MySQL 中间件，实现过开源的 ORM 框架、Web 框架、RPC 框架等。有以下分享经历：

- 掘金专栏 [「老錢」](https://juejin.cn/user/3104676535872733) 原创作者
- 知乎专栏 [「码洞」](https://zhuanlan.zhihu.com/codehole) 资深洞主
- 微信公众号[「码洞」](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/30/164e9cc748864650~tplv-t2oaga2asx-image.image)原创作者
- 掘金小册作者：[「深入理解 RPC : 基于 Python 自建分布式高并发 RPC 服务」](https://juejin.cn/book/6844733722936377351)
- Github 地址: <https://github.com/pyloque>

## 名人推荐

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/30/164ea7e71f70fe94~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/7/30/164ea7eb6b203029~tplv-t2oaga2asx-image.image)

## 购买须知

1.  本小册为图文形式内容服务，共计 43 节，上线时间为 2018 年 7 月 31 日；
2.  购买用户可享有小册永久的阅读权限；
3.  购买用户可进入小册微信群，与作者和学员互动；
4.  掘金小册为虚拟内容服务，一经购买成功概不退款；
5.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布 / 发表，违者将依法追究责任；
6.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io> ；

## 章节
- [开篇：授人以鱼不若授人以渔 —— Redis 可以用来做什么？](<./kai-pian-shou-ren-yi-yu-bu-ruo-shou-ren-yi-yu------redis-ke-yi-yong-lai-zuo-shi-me-.md>)
- [基础：万丈高楼平地起 —— Redis 基础数据结构](<./ji-chu-wan-zhang-gao-lou-ping-di-qi------redis-ji-chu-shu-ju-jie-gou.md>)
- [应用 1：千帆竞发 —— 分布式锁](<./ying-yong-1-qian-fan-jing-fa------fen-bu-shi-suo.md>)
- [应用 2：缓兵之计 —— 延时队列](<./ying-yong-2-huan-bing-zhi-ji------yan-shi-dui-lie.md>)
- [应用 3：节衣缩食 —— 位图](<./ying-yong-3-jie-yi-suo-shi------wei-tu.md>)
- [应用 4：四两拨千斤 —— HyperLogLog](<./ying-yong-4-si-liang-bo-qian-jin------hyperloglog.md>)
- [应用 5：层峦叠嶂 —— 布隆过滤器](<./ying-yong-5-ceng-luan-die-zhang------bu-long-guo-lu-qi.md>)
- [应用 6：断尾求生 —— 简单限流](<./ying-yong-6-duan-wei-qiu-sheng------jian-dan-xian-liu.md>)
- [应用 7：一毛不拔 —— 漏斗限流](<./ying-yong-7-yi-mao-bu-ba------lou-dou-xian-liu.md>)
- [应用 8：近水楼台 —— GeoHash](<./ying-yong-8-jin-shui-lou-tai------geohash.md>)
- [应用 9：大海捞针 —— Scan](<./ying-yong-9-da-hai-lao-zhen------scan.md>)
- [原理 1：鞭辟入里 —— 线程 IO 模型](<./yuan-li-1-bian-pi-ru-li------xian-cheng-io-mo-xing.md>)
- [原理 2：交头接耳 —— 通信协议](<./yuan-li-2-jiao-tou-jie-er------tong-xin-xie-yi.md>)
- [原理 3：未雨绸缪 —— 持久化](<./yuan-li-3-wei-yu-chou-mou------chi-jiu-hua.md>)
- [原理 4：雷厉风行 —— 管道](<./yuan-li-4-lei-li-feng-xing------guan-dao.md>)
- [原理 5：同舟共济 —— 事务](<./yuan-li-5-tong-zhou-gong-ji------shi-wu.md>)
- [原理 6：小道消息 —— PubSub](<./yuan-li-6-xiao-dao-xiao-xi------pubsub.md>)
- [原理 7：开源节流 —— 小对象压缩](<./yuan-li-7-kai-yuan-jie-liu------xiao-dui-xiang-ya-suo.md>)
- [原理 8：有备无患 —— 主从同步](<./yuan-li-8-you-bei-wu-huan------zhu-cong-tong-bu.md>)
- [集群 1：李代桃僵 —— Sentinel](<./ji-qun-1-li-dai-tao-jiang------sentinel.md>)
- [集群 2：分而治之 —— Codis](<./ji-qun-2-fen-er-zhi-zhi------codis.md>)
- [集群 3：众志成城 —— Cluster](<./ji-qun-3-zhong-zhi-cheng-cheng------cluster.md>)
- [拓展 1：耳听八方 —— Stream](<./tuo-zhan-1-er-ting-ba-fang------stream.md>)
- [拓展 2：无所不知 —— Info 指令](<./tuo-zhan-2-wu-suo-bu-zhi------info-zhi-ling.md>)
- [拓展 3：拾遗补漏 —— 再谈分布式锁](<./tuo-zhan-3-shi-yi-bu-lou------zai-tan-fen-bu-shi-suo.md>)
- [拓展 4：朝生暮死 —— 过期策略](<./tuo-zhan-4-zhao-sheng-mu-si------guo-qi-ce-lue.md>)
- [拓展 5：优胜劣汰 —— LRU](<./tuo-zhan-5-you-sheng-lie-tai------lru.md>)
- [拓展 6：平波缓进 —— 懒惰删除](<./tuo-zhan-6-ping-bo-huan-jin------lan-duo-shan-chu.md>)
- [拓展 7：妙手仁心 —— 优雅地使用 Jedis](<./tuo-zhan-7-miao-shou-ren-xin------you-ya-di-shi-yong-jedis.md>)
- [拓展 8：居安思危 —— 保护 Redis](<./tuo-zhan-8-ju-an-si-wei------bao-hu-redis.md>)
- [拓展 9：隔墙有耳 —— Redis 安全通信](<./tuo-zhan-9-ge-qiang-you-er------redis-an-quan-tong-xin.md>)
- [拓展 10：法力无边 —— Redis Lua 脚本执行原理](<./tuo-zhan-10-fa-li-wu-bian------redis-lua-jiao-ben-zhi-xing-yuan-li.md>)
- [拓展 11：短小精悍 —— 命令行工具的妙用](<./tuo-zhan-11-duan-xiao-jing-han------ming-ling-xing-gong-ju-de-miao-yong.md>)
- [源码 1：丝分缕析 —— 探索「字符串」内部](<./yuan-ma-1-si-fen-lu-xi------tan-suo-zi-fu-chuan-nei-bu.md>)
- [源码 2：循序渐进 —— 探索「字典」内部](<./yuan-ma-2-xun-xu-jian-jin------tan-suo-zi-dian-nei-bu.md>)
- [源码 3：挨肩迭背 —— 探索「压缩列表」内部](<./yuan-ma-3-ai-jian-die-bei------tan-suo-ya-suo-lie-biao-nei-bu.md>)
- [源码 4：风驰电掣 —— 探索「快速列表」内部](<./yuan-ma-4-feng-chi-dian-che------tan-suo-kuai-su-lie-biao-nei-bu.md>)
- [源码 5：凌波微步 —— 探索「跳跃列表」内部](<./yuan-ma-5-ling-bo-wei-bu------tan-suo-tiao-yue-lie-biao-nei-bu.md>)
- [源码 6：破旧立新 —— 探索「紧凑列表」内部](<./yuan-ma-6-po-jiu-li-xin------tan-suo-jin-cou-lie-biao-nei-bu.md>)
- [源码 7：金枝玉叶 —— 探索「基数树」内部](<./yuan-ma-7-jin-zhi-yu-ye------tan-suo-ji-shu-shu-nei-bu.md>)
- [源码 8：精益求精 —— LFU vs LRU](<./yuan-ma-8-jing-yi-qiu-jing------lfu-vs-lru.md>)
- [源码 9：如履薄冰 —— 懒惰删除的巨大牺牲](<./yuan-ma-9-ru-lu-bo-bing------lan-duo-shan-chu-de-ju-da-xi-sheng.md>)
- [源码 10：跋山涉水 —— 深入字典遍历](<./yuan-ma-10-ba-shan-she-shui------shen-ru-zi-dian-bian-li.md>)
- [源码 11：见缝插针 —— 探索 HyperLogLog 内部](<./yuan-ma-11-jian-feng-cha-zhen------tan-suo-hyperloglog-nei-bu.md>)
- [尾声：百尺竿头 —— 继续深造指南](<./wei-sheng-bai-chi-gan-tou------ji-xu-shen-zao-zhi-nan.md>)

    