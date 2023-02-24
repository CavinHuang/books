
---
title: 用 npm script 打造超溜的前端工作流
---

## 简介
抛弃笨重的构建工具，拥抱轻巧而不失强大的 npm
 script，随小册赠送视频版教程。

## 说明
## 内容简介

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/20/15fd6b2d6147fc39~tplv-t2oaga2asx-image.image)

互联网大潮和前端社区的蓬勃发展让现代前端项目的复杂性比 5 年前翻了好多倍，前端工作流中也出现了越来越多工程化的环节，比如代码风格检查、自动化测试、自动化构建、自动化部署、服务监控、依赖管理等。

大多数前端工程师的工作流可能都离不开 gulp、grunt、webpack 这样的重量级**构建工具**，而是否能熟练运用这些工具将重复任务自动化也是工程师素质的重要体现，我本人也是这些自动化工具的忠实粉丝，因为它们确实能帮我解决问题。但几番折腾之后，你可能已经像我一样感受到明显的痛点：比如对插件依赖严重（开发者的自由度受限），插件和底层工具文档脱节，调试变的更复杂等。

相比而言，直接使用 npm 内置的 script 机制已经被无数开发者证明是更好的选择，它能减轻甚至消除上面的痛点：你可以直接使用海量的 npm 包来完成你的任务、不需要在插件文档和基础工具文档间来回切换，最重要的点，不使用 grunt 之类的构建工具能让你的技术栈相对更简单，而我在做技术选择是遵循的基本原则是简单化，简单才有可能容易让别人上手。

可能有同学会反问，**`Talk is cheap, show me the data`**，下面这张图（出自[这里](https://medium.freecodecamp.org/why-i-left-gulp-and-grunt-for-npm-scripts-3d6853dd22b8)）是最好的证明：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/21/15fdbd336a82c58d~tplv-t2oaga2asx-image.image)

**`更精确的数据是：截止 2017年11月，grunt 插件 6309 个，gulp 插件 3367 个，webpack 插件数量 2174 个，而 npm 包多达 594438 个，并且还在飞速增长`**。

那 npm script 为什么没有没有在构建工具中成为主流呢？可能大多数人觉得使用 npm script 需要很强的命令行功底、或者它不够强大、或者它不能跨平台。可以很负责任的说，社区发展到现在，上面的担心都是多余的。

**这也是这本小册的切入点，我在这本小册中会用 `step-by-step 的方式`讲解如何使用 npm script 打造轻量级但完整的前端工作流。即使你是命令行小白，也能轻松跟上，小册会以实际前端项目为底板逐步介绍更高阶的话题。学完这本小册，你将熟知使用 npm script 打造前端工作流要用的各种小工具和技巧。**

小册的内容划分为 4 篇：

- 入门篇：创建和运行 npm script，熟悉和理解基本套路，分 3 小节；
- 进阶篇：原来 npm script 还可以这样用？分 3 小节；
- 高阶篇：如何管理复杂的 npm script？分 3 小节；
- 实战篇：如何用 npm script 来辅助前端工作流？分 5 小节；

此外，**为了方便读者上手实践，我还为每个小节录制的视频教程**，想了解我短视频教程风格和质量的同学可以看我[专栏](https://juejin.cn/user/4072246758354680)的历史文章：[styled-components](https://juejin.cn/post/6844903510161489928)、[async/await](https://juejin.cn/post/6844903509125677069)。

说句题外话，我的 zsh 命令行历史中 npm 已经是仅次于 git 调用次数的命令了。

## 适合什么群体？

- 拥抱 `无情的推动自动化` 开发理念的工程师，不限前端；
- 感受到 grunt、gulp 之类工具的笨重和不便，想要更轻量级的解决方案；
- 想玩转 npm script，不断打磨自己硬技能，提高日常工作效率的同学；

## 你会学到什么？

- 理解使用 npm script 的关键知识要点；
- 掌握 25 个 npm script 实战技巧，章节虽少，但是每个章节都是浓缩的；
- 收获使用 npm script 和各种小工具搞定各种前端工程自动化需求；
- 得到我长期积累和迭代出来的 npm script 集合，直接运用到项目中；

## 你要准备什么？

- [Node.js](http://nodejs.org) 运行环境，最好是 v8.x 以上版本，建议使用 [nvm](https://github.com/creationix/nvm) 来安装，Windows 下的用户可以使用 [nvm-windows](https://github.com/coreybutler/nvm-windows)；
- 可以用来输入和执行命令的终端程序，比如 Mac 下的 [iTerm](http://www.iterm2.com/index)，或者 Windows 下的 cmd；
- 1 小时的闲暇时间，读完这本小册，并能自己上手实践，因为纸上得来终觉浅；

## 视频目录如何？

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/1/2/160b46e75b644bf5~tplv-t2oaga2asx-image.image)

## 关于作者

王仕军，爱折腾、爱分享的前端老司机，6 年以上前端开发经验，4 年大型互联网公司工作经验；[掘金专栏作者](https://juejin.cn/user/4072246758354680)；熟知（是的，到现在我还不敢说精通） `Javascript`、`Node.js`，对开发效率和软件质量有极致追求。目标是 **`Be a Power User of Everything`**。

## 读者福利

- 免费加入读者交流群，和群友讨论和交流读书心得和疑惑问题；
- 免费获得小册视频版教程，网盘下载地址已经附在小册末尾；

## 购买须知

1.  本小册为图文形式内容服务，共计 15 节，上线时间为 2017 年 11 月 22 日；
2.  购买用户可享有小册永久的阅读权限；
3.  购买用户可进入小册微信群，与作者互动；
4.  掘金小册为虚拟内容服务，一经购买成功概不退款；
5.  掘金小册版权归北京北比信息技术有限公司所有，任何机构、媒体、网站或个人未经本网协议授权不得转载、链接、转贴或以其他方式复制发布/发表，违者将依法追究责任；
6.  在掘金小册阅读过程中，如有任何问题，请邮件联系 <xiaoce@xitu.io>。

## 更新日志

1.  2017-11-20 完成小册简介、为什么选 npm script、hello npm script 3 部分内容；
2.  2017-11-24 修订小册第 1.1 节（**试读部分**），**大量新增内容**，如给新老项目配置 eslint 的方法；
3.  2017-11-25 增加小册更新进度表，增加小册更新日志部分；
4.  2017-11-25 完成小册第 1.2 节：运行多个 npm script 的各种姿势；
5.  2017-11-27 完成小册第 1.3 节：给 npm script 传递参数、添加注释以及控制输出；
6.  2017-11-29 完成小册第 2.1 节：使用 pre、post 钩子把自动化任务串起来；
7.  2017-12-01 完成小册第 2.2 节：使用自定义变量改进测试覆盖率归档过程；
8.  2017-12-03 完成小册第 2.3 节：实现 npm 命令自动补全；
9.  2017-12-05 完成小册第 3.1 节：实现 npm script 的跨平台兼容；
10.  2017-12-07 完成小册第 3.2 节：用 scripty 隔离 npm script 的复杂性；
11.  2017-12-10 完成小册第 3.3 节：用 Node.js 脚本替代复杂的 npm script；
12.  2017-12-12 完成小册第 4.1 节：在文件变化时执行 npm script；
13.  2017-12-14 完成小册第 4.2 节：结合 livereload 实现自动刷新；
14.  2017-12-14 完成小册第 4.3 节：在 git hooks 中执行 npm script；
15.  2017-12-18 完成小吃第 4.4 节：用 npm script 实现构建流水线；
16.  2017-12-18 完成小册第 4.5 节：用 npm script 进行服务运维，至此小册文字版完稿；
17.  2018-01-02 完成小册视频版录制。

## 章节
- [为什么选择 npm script](<./wei-shi-me-xuan-ze-npm-script.md>)
- [入门篇 01：创建并运行 npm script 命令](<./ru-men-pian-01-chuang-jian-bing-yun-xing-npm-script-ming-ling.md>)
- [入门篇 02：运行多个 npm script 的各种姿势](<./ru-men-pian-02-yun-xing-duo-ge-npm-script-de-ge-zhong-zi-shi.md>)
- [入门篇 03：给 npm script 传递参数和添加注释](<./ru-men-pian-03-gei-npm-script-chuan-di-can-shu-he-tian-jia-zhu-shi.md>)
- [进阶篇 01：使用 npm script 的钩子](<./jin-jie-pian-01-shi-yong-npm-script-de-gou-zi.md>)
- [进阶篇 02：在 npm script 中使用环境变量](<./jin-jie-pian-02-zai-npm-script-zhong-shi-yong-huan-jing-bian-liang.md>)
- [进阶篇 03：实现 npm script 命令自动补全](<./jin-jie-pian-03-shi-xian-npm-script-ming-ling-zi-dong-bu-quan.md>)
- [高阶篇 01：实现 npm script 跨平台兼容](<./gao-jie-pian-01-shi-xian-npm-script-kua-ping-tai-jian-rong.md>)
- [高阶篇 02：把庞大的 npm script 拆到单独文件中](<./gao-jie-pian-02-ba-pang-da-de-npm-script-chai-dao-dan-du-wen-jian-zhong.md>)
- [高阶篇 03：用 node.js 脚本替代复杂的 npm script](<./gao-jie-pian-03-yong-node.js-jiao-ben-ti-dai-fu-za-de-npm-script.md>)
- [实战篇 01：监听文件变化并自动运行 npm script](<./shi-zhan-pian-01-jian-ting-wen-jian-bian-hua-bing-zi-dong-yun-xing-npm-script.md>)
- [实战篇 02：结合 live-reload 实现自动刷新](<./shi-zhan-pian-02-jie-he-live-reload-shi-xian-zi-dong-shua-xin.md>)
- [实战篇 03：在 git hooks 中运行 npm script](<./shi-zhan-pian-03-zai-git-hooks-zhong-yun-xing-npm-script.md>)
- [实战篇 04：用 npm script 实现构建流水线](<./shi-zhan-pian-04-yong-npm-script-shi-xian-gou-jian-liu-shui-xian.md>)
- [实战篇 05：用 npm script 实现服务自动化运维](<./shi-zhan-pian-05-yong-npm-script-shi-xian-fu-wu-zi-dong-hua-yun-wei.md>)

    