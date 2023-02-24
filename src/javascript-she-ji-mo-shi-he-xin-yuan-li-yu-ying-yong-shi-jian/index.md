
---
title: JavaScript 设计模式核⼼原理与应⽤实践
---

## 简介
通俗易懂的编程“套路“学。带你深入看似高深实则接地气的设计模式原理，在实际场景中内化设计模式的”道“与”术“。学会驾驭代码，而非被其奴役。

## 说明
## 作者介绍

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa2fc1c6d3fa43428b49616ba723c447~tplv-k3u1fbpfcp-zoom-1.image)

修言，《前端性能优化原理与实践》小册作者。一线电商集团前端工程师。历任创业团队高级工程师、滴滴出行前端工程师。

始终战斗在前端工程化、性能优化的第一线，拥有丰富的研发经验、面试经验和性能死磕经验。

## 小册介绍

烹饪有菜谱，游戏有攻略，每个领域都存在一些能够让我们又好又快地达成目标的“套路”。**在程序世界，编程的“套路”就是设计模式**。

设计模式是“拿来主义”在软件领域的贯彻实践。和很多人的主观臆断相反，设计模式不是一堆空空如也、晦涩鸡肋的理论，它是一套现成的工具 —— 就好像你想要做饭的时候，会拿起厨具直接烹饪，而不会自己去铸一口锅、磨一把菜刀一样。

随着前端应用复杂度的日新月异，如今的前端应用已经妥妥地成为了软件思想的一种载体，而前端工程师，也被要求在掌握多重专业技能之余，具备最基本的软件理论知识。同时，工程师对设计模式的掌握程度，一定程度上反映着他**用健壮的代码去解决具体的问题的能力**。因此，设计模式如今已经成为**前端面试中无法回避、同时具有较高候选人区分度的一个核心考点**。

基于面试、工作的双重需要，相信很多同学不止一次地向设计模式发起过挑战、并草草收场——觉得设计模式难学，是一件非常正常的事情。设计模式的“难”，在于其令人望而生畏的**抽象性**和知识点的**分散性**。这带来了本册要着重解决的问题——**帮助大家摆脱枯燥乏味的技术恐惧感**，最大程度上降低前端设计模式的学习成本。

本小册经过近一年时间的打磨，在编写过程中力求内容的可读性、趣味性和时效性。

小册中的每一个设计模式，都有它自己的一个“故事”，有它自己的场景。经过我们近20个小节的学习，相信大家会有一个非常惊喜的发现：其实设计模式并不高大上，**它是一个非常接地气、非常实际、非常好理解的东西**——因为它本身就是一帮非常苦逼的程序员在自己的职业生涯里实打实地踩坑踩出来的。本书的重点不在于对固有理论的反复阐述，而是**把读者放到一个正确的场景里、去体会每一个设计模式的好**。甚至贯穿设计模式始终的设计原则理论，也会被我们化解到具体的、易于理解的场景片段里去。本小册具体的知识结构用思维导图展示如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6f1940010b04e6c8f367471cbc9cf88~tplv-k3u1fbpfcp-zoom-1.image)

“橘生淮南则为橘,橘生淮北则为枳”——一些在服务端应用场景下看似合理、好用又酷炫的操作，生搬硬套到前端的场景里可能就会弄巧成拙。**本小册的目的并不是做传统设计模式书籍的“译本”，而是面向前端工程师，讲有利于前端的技术**。因此在正式的实战章节里，我们权衡每种模式对前端的价值，对 23 种设计模式做了取舍，保留下来的这些设计模式，具备这两个共性：

- 前端能用，而且好用；
- 面试会考，而且常考。

此外，设计模式中有几个特别重要、特别好使、特别受面试官关注的的，我们在讲解的过程中会有针对性地穿插一些高频面试真题（注意面试题不一定会单开小节，有的面试题就穿插于原理讲解之中\~）。具体是哪几个，可能要等大家读到了那一节才知道了哈哈（所以不要随便跳读：））。

## 你会学到什么？

通过对本小册的学习，你至少能达到**三个目的**：

1.  充分理解前端设计模式的核心思想和基本理念，在具体的场景中掌握抽象的设计原则；
2.  会写代码，会写好代码；
3.  会面试，能言之有物。

## 适宜人群

- 具备 JavaScript 语言基础即可

## 购买须知

1.  本小册为图文形式内容服务，共计 18 节；
2.  文章已全部更新完毕；
3.  购买用户可享有小册永久的阅读权限；
4.  购买用户可进入小册微信群，与作者互动；
5.  掘金小册为虚拟内容服务，一经购买成功概不退款；
6.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
7.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>

## 章节
- [开篇：前端工程师的成长论](./kai-pian-qian-duan-gong-cheng-shi-de-cheng-chang-lun.md)
- [设计模式的“道”与“术”](./she-ji-mo-shi-de-dao-yu-shu-.md)
- [创建型：工厂模式·简单工厂——区分“变与不变”](./chuang-jian-xing-gong-han-mo-shi-jian-dan-gong-han----qu-fen-bian-yu-bu-bian-.md)
- [创建型：工厂模式·抽象工厂——理解“开放封闭”](./chuang-jian-xing-gong-han-mo-shi-chou-xiang-gong-han----li-jie-kai-fang-feng-bi-.md)
- [创建型：单例模式——Vuex的数据管理哲学](./chuang-jian-xing-dan-li-mo-shi----vuexde-shu-ju-guan-li-zhe-xue.md)
- [创建型：单例模式——面试真题手把手教学](./chuang-jian-xing-dan-li-mo-shi----mian-shi-zhen-ti-shou-ba-shou-jiao-xue.md)
- [创建型：原型模式——谈Prototype无小事](./chuang-jian-xing-yuan-xing-mo-shi----tan-prototypewu-xiao-shi.md)
- [结构型：装饰器模式——对象装上它，就像开了挂](./jie-gou-xing-zhuang-shi-qi-mo-shi----dui-xiang-zhuang-shang-ta-jiu-xiang-kai-liao-gua.md)
- [结构型：装饰器模式——深入装饰器原理与优秀案例](./jie-gou-xing-zhuang-shi-qi-mo-shi----shen-ru-zhuang-shi-qi-yuan-li-yu-you-xiu-an-li.md)
- [结构型：适配器模式——兼容代码就是一把梭](./jie-gou-xing-gua-pei-qi-mo-shi----jian-rong-dai-ma-jiu-shi-yi-ba-suo.md)
- [结构型：代理模式——一家小型婚介所的发家致富之路](./jie-gou-xing-dai-li-mo-shi----yi-jia-xiao-xing-hun-jie-suo-de-fa-jia-zhi-fu-zhi-lu.md)
- [结构型：代理模式——应用实践范例解析](./jie-gou-xing-dai-li-mo-shi----ying-yong-shi-jian-fan-li-jie-xi.md)
- [行为型：策略模式——重构小能手，拆分“胖逻辑”](./xing-wei-xing-ce-lue-mo-shi----chong-gou-xiao-neng-shou-chai-fen-pang-luo-ji-.md)
- [行为型：状态模式——自助咖啡机背后的力量](./xing-wei-xing-zhuang-tai-mo-shi----zi-zhu-ka-pei-ji-bei-hou-de-li-liang.md)
- [行为型：观察者模式——鬼故事：产品经理拉了一个钉钉群](./xing-wei-xing-guan-cha-zhe-mo-shi----gui-gu-shi-chan-pin-jing-li-la-liao-yi-ge-ding-ding-qun.md)
- [行为型：观察者模式——面试真题手把手教学](./xing-wei-xing-guan-cha-zhe-mo-shi----mian-shi-zhen-ti-shou-ba-shou-jiao-xue.md)
- [行为型：迭代器模式——真·遍历专家](./xing-wei-xing-die-dai-qi-mo-shi----zhen-bian-li-zhuan-jia.md)
- [前方的路](./qian-fang-de-lu.md)

    