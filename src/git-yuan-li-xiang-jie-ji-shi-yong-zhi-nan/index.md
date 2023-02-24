
---
title: Git 原理详解及实用指南
---

## 简介
让你不仅用上、更用明白的 Git 实用指南

## 说明
## 作者介绍

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/30/1600aef397166626~tplv-t2oaga2asx-image.image)

我是扔物线，Android GDE（谷歌开发者专家），Android 高级技术分享网站 HenCoder 作者，Kotlin 上手教学项目码上开学创始人，前 Flipboard 工程师，开源贡献者，在 GitHub 上有 4.9k followers 和 7.8k stars ，个人的 Android 开源库 MaterialEditText 被全世界多个项目引用，其中包括在全球拥有 5 亿用户的新闻阅读软件 Flipboard 。曾两次在 Google Developer Group Beijing 线下分享会中担任 Android 部分的讲师。个人技术文章《给 Android 开发者的 RxJava 详解》发布后，在国内多个公司和团队内部被转发分享和作为团队技术会议的主要资料来源，以及逆向传播到了美国一些如 Google 、 Uber 等公司的部分华人团队。

现在我正全职在做一个我个人的免费的 Android 高级进阶分享计划 [HenCoder](http://hencoder.com)，旨在帮助国内的高级 Android 工程师（例如小团队的 Android Leader）突破技术瓶颈，继续高速提升。

## 小册简介

> 「Git 好难啊！」不会用 Git 和会用 Git 的人都这么说。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/30/1600ae3657c86995~tplv-t2oaga2asx-image.image)

随着这几年 GitHub 的流行，Git 已经是一个程序员逃不过的技术项，但很多人却纷纷倒在了学习它的路上。而且，出于工作原因而不得不用 Git 的人，有不少在工作中对 Git 也是能不用就不用，生怕哪个命令用错就把公司的代码库毁掉了🙈。而那些对 Git 掌握得比较好的少数人，就像团队中的神一样，在同事遇到 Git 相关的问题的时候用各种风骚操作来拯救队友于水火。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/23/15fe723fff89d544~tplv-t2oaga2asx-image.image)

学不会、学不好 Git 的人，其实多数并不是不愿意学。很多人都会尝试去网上找 Git 教程、去社区请教高手、在公司咨询同事，但转了一大圈下来，依然没有搞懂，甚至有可能越来越糊涂。

> \- 你刚才输入的这个 Git 指令是什么意思？  
> \- 意思是 XXX。  
> \- 可你上次跟我说它的意思是 YYY 啊？  
> \- 嗯对，不同的场景不同的用法，上次是 YYY。  
> \- ……好吧。另外你上次帮我解决这个问题用的是另一个指令 zzz 啊？  
> \- 嗯对，那个也能解决，但这次用这个指令更适合，因为 \@#￥\@\%\*\&。  
> \- ……  
> \- 懂了吗？不懂的话还可以问我，没事的。  
> \- ……

### Git 学习到底难在哪？

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/10/24/38882ef09a324d15d99b3610fe01809d~tplv-t2oaga2asx-image.image)

Git 的学习曲线很不友好：想上手很容易，只要学会 commit、push、pull 等几个指令，就能够初步地使用它；但如果想要更进一步，让自己能够在团队项目中和朋友或同事自由合作，却又很难。

那么 Git 到底难在哪呢？

其实关键在于一点：**概念**。

**Git 的概念，是由一套完整的思维逻辑所构成的。** 你不能从多个角度分步理解它，而是要把它作为一个整体一下子吃掉；而同时这个「整体」由于过于复杂，又实在有点难以一口吞。颇有点悖论的意味。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/23/15fe723fffaa7f2f~tplv-t2oaga2asx-image.image)

很多人在使用 Git 一段时间后，会觉得 Git 有点复杂和混乱：

> \- 为什么要 commit 后再 push 这么啰嗦，而不能直接提交到中央仓库？  
> \- reset 这个指令为什么这么神奇，好多看起来并不相似的操作却都要用到它？它到底是干嘛的？  
> \- revert 和 rebase 都可以撤销历史提交？它们的区别在哪？什么，你说 reset 也行？

类似的问题其实还有很多。这些问题看起来每个都很难，但只要你把 Git 的概念了解了，这些问题（以及那些许许多多我没有列出来的问题）就全都迎刃而解了。

**学懂了概念，就能学懂 Git，就这么简单**。可是市面上的很多 Git 教程都只停留在了 Git 的使用上，而对它的概念却总是一笔带过或干脆提都不提。这里的原因，我猜可能是因为它的概念太难讲清楚了，也可能是因为这些作者其实也对 Git 的许多概念并不够了解吧（这句是胡说八道，Git 教程的作者们请放下手中的枪）。

### 你为什么应该选择这本小册？

读了这本小册，你可以彻底理解 Git，从而彻底会用 Git。Git 的确很难，但别担心，读了这本小册你就从根本上掌握它了（虽然熟练使用还会需要一些时间来练习）。

我写技术文章，比较喜欢挑难的写：难学会的，难讲清的。我写过 RxJava 的详解，写过 Android 自定义 View 的原理，目前来看反馈都很不错。这些「学的人学不会，讲的人讲不明白」的东西，写起来很痛苦，但写完之后的成就感也挺大，我会去跟老婆吹牛：「这东西好多人都讲不明白，我给讲明白了，你看这些人看了以后留言多激动」（这话只敢在家说，出去说怕被打）。而且，写着写着，我也越来越明白怎么把复杂的技术讲简单、讲透彻。

所以简单地总结：Git 难学，是因为它的概念难以整体理解。而这本小册，就是从概念的角度出发，帮你先从本质上了解 Git 的工作模型，在此基础上去了解它的具体用法，以此来达到四两拨千斤的学习效果。而且这样的学习具有更高的持久性，在看完这本小册之后，你以后也很难再忘掉 Git 的用法了。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/30/1600ae461cb45c9a~tplv-t2oaga2asx-image.image)

## 你会学到什么？

- Git 的基本用法
- Git 的高级用法
- Git 的概念和本质
- Git 中的常见问题的处理方式
- Git 中的高级需求的解决方案

> **例如：**「如何修改历史提交中的错误」「误删 branch 怎么办」「merge 和 rebase 的区别」「reset 的几种实用用法」这类东西又多又难记，但其实你根本不用去记它们。在你了解了 Git 的本质之后，不仅这些日经问题你能轻松解答，而且一些罕见的、复杂的问题，你也应付得来。

## 你应该已经具备什么？

- 基本的编程能力
- Linux / Unix 的 Terminal 或 Windows 的 CMD 控制台的基本使用经验

## 你需要准备什么？

- 一台用于读小册和做简单练习的可以联网的电脑

## 你需要做什么？

- 把这本小册认真读完
- 在读的过程中把所有练习做完

然后，你就可以在工作中自如地使用 Git 了。而且很快，你就能成为同事眼里的那个神奇的「救火队员」（如果你愿意的话）。

读完这本小册你会发现，Git 真的不难。

## 购买须知

1.  本小册为图文形式内容服务，共计 22 节，上线时间为 2017 年 11 月 30 日；
2.  掘金小册为虚拟内容服务，一经购买成功概不退款；
3.  购买掘金小册后可直接开始阅读全本小册；
4.  购买掘金小册用户可享受文章永久阅读权限；
5.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>；
6.  掘金小册版权归北京北比信息技术有限公司所有，任何媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者本网将依法追究责任

## 章节
- [什么是版本控制系统（VCS）](./shi-me-shi-ban-ben-kong-zhi-xi-tong-vcs-.md)
- [什么是分布式版本控制系统（DVCS\)](<./shi-me-shi-fen-bu-shi-ban-ben-kong-zhi-xi-tong-dvcs-.md>)
- [上手 1：新公司用 Git 管理代码，怎么快速上手？](<./shang-shou-1-xin-gong-si-yong-git-guan-li-dai-ma-zen-me-kuai-su-shang-shou-.md>)
- [上手 2：团队工作的基本工作模型](<./shang-shou-2-tuan-dui-gong-zuo-de-ji-ben-gong-zuo-mo-xing.md>)
- [进阶 1：HEAD、master 与 branch](<./jin-jie-1-head-master-yu-branch.md>)
- [进阶 2：push 的本质](<./jin-jie-2-push-de-ben-zhi.md>)
- [进阶 3：merge：合并 commits](<./jin-jie-3-merge-he-bing-commits.md>)
- [进阶 4：Feature Branching：最流行的工作流](<./jin-jie-4-feature-branching-zui-liu-xing-de-gong-zuo-liu.md>)
- [进阶 5：关于 add](<./jin-jie-5-guan-yu-add.md>)
- [进阶 6：看看我都改了什么](<./jin-jie-6-kan-kan-wo-du-gai-liao-shi-me.md>)
- [高级 1：不喜欢 merge 的分叉？用 rebase 吧](<./gao-ji-1-bu-xi-huan-merge-de-fen-cha-yong-rebase-ba.md>)
- [高级 2：刚刚提交的代码，发现写错了怎么办？](<./gao-ji-2-gang-gang-ti-jiao-de-dai-ma-fa-xian-xie-cuo-liao-zen-me-ban-.md>)
- [高级 3：写错的不是最新的提交，而是倒数第二个？](<./gao-ji-3-xie-cuo-de-bu-shi-zui-xin-de-ti-jiao-er-shi-dao-shu-di-er-ge-.md>)
- [高级 4：比错还错，想直接丢弃刚写的提交？](<./gao-ji-4-bi-cuo-huan-cuo-xiang-zhi-jie-diu-qi-gang-xie-de-ti-jiao-.md>)
- [高级 5：想丢弃的也不是最新的提交？](<./gao-ji-5-xiang-diu-qi-de-ye-bu-shi-zui-xin-de-ti-jiao-.md>)
- [高级 6：代码已经 push 上去了才发现写错？](<./gao-ji-6-dai-ma-yi-jing-push-shang-qu-liao-cai-fa-xian-xie-cuo-.md>)
- [高级 7：reset 的本质——不止可以撤销提交](<./gao-ji-7-reset-de-ben-zhi----bu-zhi-ke-yi-che-xiao-ti-jiao.md>)
- [高级 8：checkout 的本质](<./gao-ji-8-checkout-de-ben-zhi.md>)
- [高级 9：紧急情况：「立即给我打个包，现在马上！」](<./gao-ji-9-jin-ji-qing-kuang--li-ji-gei-wo-da-ge-bao-xian-zai-ma-shang-.md>)
- [高级 10：branch 删过了才想起来有用？](<./gao-ji-10-branch-shan-guo-liao-cai-xiang-qi-lai-you-yong-.md>)
- [额外说点：.gitignore——排除不想被管理的文件和目录](./e-wai-shuo-dian-.gitignore----pai-chu-bu-xiang-bei-guan-li-de-wen-jian-he-mu-lu.md)
- [总结](./zong-jie.md)

    