
# 团队协作规范（一）-命名规范、UI 设计规范
---

前面的两篇文章介绍了分治思想在前端的实践，也就是模块化和组件化相关的内容。在各自开发好各自的模块和组件之后，就需要团队协作将模块和组件“组合”起来。在团队成员达到一定规模之后，每个人都有自己不同的开发规范，大到技术选型、架构设计，小到命名方式、空格缩进模式，每个开发者的习惯都有可能不同。在团队初期只有一两个人的情况下，团队规范的优点可能并不能体现。但是当团队发展到一定规模的时候，可能就会出现错综复杂的架构设计、五花八门的命名方式、各种各样的数据传递方式……

比如，你喜欢代码结尾加分号结尾，你们组的其他同学小 A 更喜欢不加分号；你的缩进是 4 个空格，小 A 设置的缩进是两个空格……然后突然，小 A 那边的需求暴增，忙不过来了，老大让你去支援小 A 一段时间，你满口答应老大，承诺“没问题，包在我身上”！然后你兴冲冲地打开了小 A 的项目，不幸的是，你看到的是满屏醒目的红色报错！ヽ\(。>д\<\)ｐ。

所谓无规矩不成方圆，好的团队规范可以促进团队合作、降低代码的维护成本，并且有利于code review。好的规范也是可以伴随着我们整个职业生涯的，对开发者自身的成长也是很帮助的。

在本篇和下一篇文章中，我会给你介绍团队规范中的以下几部分内容：

- 命名规范；
- UI 规范；
- 项目结构规范；
- workflow 规范；
- git commit 规范。

因为这部分的内容比较多，所以我分为两篇文章来给你介绍。本篇文章先给你介绍下命名规范、UI 设计规范。

## 命名规范

> 代码的注释不是越详细越好。实际上好的代码本身就是注释，我们要尽量规范和美化自己的代码来减少不必要的注释。若编程语言足够有表达力，就不需要注释，尽量通过代码来阐述。——《Clean Code》

良好的命名，可以增强代码的可读性、减少阅读代码的成本，是程序最好的注释。相反，没有规则甚至是和代码内容不匹配的命名，会大大增加我们阅读代码的成本，甚至会误导我们的思维，导致对代码的理解完全错误，后患无穷。

不知道你们有没有碰到过“坑队友”，反正我是碰到过使用 a、b、c、d……魔法命名变量的。就两个字：看不懂！这种代码就是一次性代码，后面接手的人完全维护不了（不要说别人，就算是本人，过个半个月再去开发，也很难想起来这变量的作用了吧）。

一个优秀的程序员肯定是要能书写可维护的代码，而不是处处有坑的一次性代码。最重要的一点就需要规范命名。

### 命名方法

我们先来介绍几个在编程时国际通用的、不区分国界、不区分语言的命名方法\~

- **小驼峰命名法（lowerCamelCase）** ：第一个单词以小写字母开始，第二个单词的首字母大写，例如：firstName、lastName。
- **大驼峰命名法（CamelCase）** ：每一个单词的首字母都采用大写字母，例如：FirstName、LastName。
- **匈牙利命名法（HN case）** ：基本原则为：变量名 = 属性 + 类型 + 对象描述。
- **下划线命名法（snake\_case）**：下划线命名法也叫蛇形法，全由小写字母和下划线组成，在两个单词之间用下滑线连接。例如：first\_name。
- **中划线命名法（kebab-case）**：中划线命名法也叫串式命名法，各个单词之间通过下划线“-”连接。例如：first-name。

命名方法是我们命名的基础，我们需要在不同的场景约定好使用哪一种命名方式，比如给文件资源命名通常使用中划线命名法（kebab-case）、JS 中的变量通常使用小驼峰方式（lowerCamelCase），TS 中的类型通常使用大驼峰方式（CamelCase）、CSS 属性名使用中划线命名法（kebab-case）等。

### 文件资源命名

对文件资源合适命名，可以让你自己合小组成员能够方便理解每一个文件的用途。通常文件资源命名常遵循以下原则。

- 文件名不得含有空格。
  - 正例：hello-world
  - 反例：hello world
- 文件名建议只使用小写字母，不使用大写字母。（为了醒目，某些说明文件的文件名，可以使用大写字母，比如 README、LICENSE。）
  - 正例：hello-world
  - 反例：HelloWorld
- 文件名包含多个单词时，单词之间建议使用半角的连词线 \( - \) 分隔。
  - 正例：hello-world
  - 反例：hello\_world
- 有复数结构式，要使用复数。
  - 正例：services
  - 反例：service

例外的是，在 linux 系统文件中推荐的文件名命名一般是使用下划线的形式。同时在 linux 系统中，是区分文件的大小写的，在 Window、OS中是不区分大小写的。（**但是推荐区分大小写的方式，** 因为你不知道你的代码未来将在哪里运行，比如很常见的例子，平时开发使用的是 Mac OS 不区分大小写，但是在远端 CI\\CD 的时候使用的是 linux，经常会因为大小写的问题导致构建失败。）保持良好的习惯才能减少麻烦\~\~

### 布尔值

**命名方式**：小驼峰方式。

**命名规则**：前缀为判断性动词。

| 动词 | 含义 | 值 |
| --- | --- | --- |
| has | 判断是否含有某个值 | true：含有此值； false：不含有此值 |
| is | 判断是否为某个值 | true：为某个值； false：不为某个值 |

使用判断性动词作为前缀会让代码更好理解，通过名称就判断出该变量为布尔值。

### 函数

**命名方式**：小驼峰方式（构造函数使用大驼峰命名法）。

**命名规则**：前缀为动词。

| 动词 | 含义 |
| --- | --- |
| can | 判断是否可执行某个动作 |
| on | 监听事件的回调 |
| handle | 处理事件 |
| get | 获取某个值 |
| set | 设置某个值 |

还有一些比如 complete、calculate、compute 这些就不一一介绍了，使用动词作为函数的前缀主要是让函数名称变得更加有描述性，容易理解。

### 常量

**命名方法**：全部大写。

**命名规范**：使用大写字母和下划线来组合命名，下划线用以分割单词。

例如：USER\_NAME、PHONE\_NUMBER。

### 类的成员

- 公共属性和方法：同变量命名方式。
- 私有属性和方法：前缀为下划线`(_)`后面跟公共属性和方法一样的命名方式。

例如：

```
function Student(name) {
    var _name = name; // 私有成员

    // 公共方法
    this.getName = function () {
        return _name;
    }

    // 公共方式
    this.setName = function (value) {
        _name = value;
    }
}
var st = new Student('tom');
st.setName('jerry');
console.log(st.getName()); // => jerry：输出_name私有变量的值
```

在起名称的时候，应该本着描述性以及唯一性这两大特性来命名，才能保证资源之间不冲突，并且每一个都便于记忆。命名规则要望文知义，简单明了。

### 踩坑纸杯

命名方法只能让我们从形式上进行格式的统一，方便我们搜索代码。怎么才能起一个好名字，需要长期的观察和实践，下面我整理了一些命名时的小 tips。

1.  尽量不要缩写、简写的单词。（除了 template => tmp、message => msg、image => img、component => comp、property => prop 这些单词已经被公认的缩写。\)

    - 正例：FirstName
    - 反例：FN。

2.  缩写的规则采用国际惯用方法：

    - 元音字母剔除法，首字母除外；
    - 使用单词的头一个或几个字母。

3.  可读性强的命名优先于简短的命名。

4.  命名长度最好在 20 个字符以内，避免多长带来的阅读不便。

5.  命名要有具体的含义，避免使用一些泛指和无具体含义的词。

    - 正例：student;
    - 反例：something

6.  不要使用拼音，更不要使用中文。

    - 正例：discount
    - 反例：dazhe

7.  正则表达式用 exp 结尾。

最后，我再给你推荐一个变量命名神器：[变量命名神器](https://unbug.github.io/codelf/)：CodeIf ，该根据是从Github、Bitbucket、Google代码、Codeplex、Sourceforge、Fedora、GitLab中搜索项目，查找实际使用变量名称，然后给你推荐返回结果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1717643769eb4e71a941e6f70433dae4~tplv-k3u1fbpfcp-zoom-1.image)

并且还提供了 VS Code 插件，可以在写代码的时候直接右键选择 “CodeIf” 就可以跳转到网页搜索。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5bc49d05dbfe46e181ff689873e43d1d~tplv-k3u1fbpfcp-zoom-1.image)

## UI 设计规范

了解完命名规范，我们来看一下另一个在开发中很有用的规范：UI 设计规范。

我们平时经常要和交互、视觉同学打交道，我们需要按照给出的 UI 稿进行开发，最后还需要经过交互和视觉同学的验收。那么我们如何更高效和愉快地进行合作呢？下面我们就一起来了解下。

### 为什么需要设计规范？

用户在使用我们开发出来的系统的时候，首先看到的就是我们的 UI 页面，如果设计师没有一定的规范，那么用户看到的页面五颜六色、间距有大有小（当然，可能这些凌乱也是一种设计风格），对于非展示性的产品显然用户不会留下一个好的印象。

**第一，培养用户心智，减少用户的学习成本。**

交互视觉规范我觉得最重要的意义是**培养用户心智，减少用户的学习成本**。页面中的每一个元素都有自己的“意义”，形成统一之后，就会减少用户大脑的思考，随之带来的是培养用户习惯，让用户的潜意识能够直接判断出设计者想要传达的设计思想，节省用户的脑力。

比如，当你进行一个删除操作之后，如果出现的 Toast 背景是绿色的，那么就算不看文字描述，你的第一反应是不是你刚刚的动作有了成功的反馈？如果 Toast 的背景是红色的，那么自然会认为刚刚的操作出现了问题。可能是因为受到红灯停、绿灯行的影响，所以我们大部分人的认知当中，绿色是一个成功的反馈色、红色是一个错误的反馈色、黄色是警告的反馈色。所以我们在我们的 UI 规范中，就需要借助于这些公知，培养用户心智、降低用户的理解成本。

再比如，我们都知道，一个网页上，文字的颜色会有很多种各种各样的灰色。那么 UI 是如何借助于这些各种各样的灰色传达出页面的信息呢？我们要和设计同学约定好不同颜色的“语义”，比如颜色越重那么代表文字的重要性更高。相反，颜色越浅，代表文字的重要性越低。那么我们可以将文字颜色分为以下几种，来应对不同场景下的文字颜色。

- Primary Text `#303133`
- Regular Text `#606266`
- Secondary Text `#909399`
- Placeholder `#C0C4CC`

`Primary Text` 代表重要色，一般用在文章或者页面的标题最显眼的位置，和比较少的文字、大字号搭配使用突出页面的重点、传达总述性信息。`Regular Text` 代表常见色，一般用在文章或者页面的具体内容，和大段的文字、中等字号（一般是 14px\)一起搭配使用。`Secondary Text` 代表次要色，一般用在描述性文字，去掉该文字也不影响页面整体要表达的内容，所以颜色会较浅，和少部分文字、小字号搭配使用。Placeholder 相信大家都比较熟悉了，一般用于 input、textarea 等占位文字的颜色，用作输入提示的占位作用。

通过上面几个例子，可以看出，我们做到了 UI 规范的统一之后，用户就能够方便、正确、高效地去理解我们的产品。

**第二，提高可维护性。**

统一 UI 设计规范还有一个重要原因是提高项目的可维护性，如果有一天，公司换老板了，老板觉得现有的主题色、logo 太丑了，要将红色的主题色改成蓝色；原有的间距太宽了，导致页面展示的内容太少了，要改成紧凑型，所有的间距都要缩小一点。

如果之前没有一套 UI 规范的话，这些颜色、间距会零散的出现在代码的各个地方，可想而知，你就需要将所有有主图色、logo、间距的页面找出来，一一去修改，可能有些祖传页面你都从来没有修改过 ⊙﹏⊙|||，你哭晕在厕所。但是！如果是按照统一的 UI 规范来开发的，前端可以将所有这些颜色、字体、间距抽象为变量，需要更改的时候，只需要改其数值就可以了。这工作量和效率差的不是一点半点吧\~\~

**第三，提高开发效率。**

有的同学可能会说：“这些和我有什么关系，我只是一个小小的前端开发呀！我不关心设计稿是怎么设计出来的，我也不关心用户感觉我们产品不专业不规范乱七八糟，我只负责按照设计稿上的样式进行开发就可以了”。

那么，我告诉你，统一 UI 规范，前端的开发同学也是受益者。试想一下，如果设计稿上的边框有 4px、6px、8px、12px 等不同的尺寸，前端同学凭肉眼比较难区分（当然，设计同学的像素眼是可以找出来你开发尺寸的不对的 \(╯︵╰\)），那么在开发的时候，频繁在设计稿上去寻找这些尺寸和颜色等信息，会浪费我们大量的开发时间，并且这些相对而言都是一些重复的劳动，对提升我们的专业技能基本上可以说毫无帮助（只能加深我们近视的程度）。

所以，有了统一的 UI 规范之后，我们就可以和设计同学约定，我们按照 UI 规范来开发，设计同学按照 UI 规范来设计，不需要重复做图、标记。对前端开发者而言，可以定义一个符合 UI 设计规范的 CSS 样式库，在需要的时候直接引用定义好的语义化的变量名，就不需要在开发过程中一次又一次的写 CSS 参数值了。这样不仅提高设计的效率而且提高了开发的效率。

甚至在一些对 UI 要求不高的项目，比如 toB 的项目，很多公司可以不需要设计，前端直接使用内部沉淀的或者开源的三方组件库将页面“拼凑”而成。

### UI 设计规范范围

前面说了那么多 UI 设计规范的必要性和优点之后，那么 UI 设计规范应该包括哪些内容呢？

UI 设计规范应该是由 UI 同学主导。通常情况下，UI 同学在设计页面的时候都会有一些自己的原则。我们只需要将设计同学的设计原则转换为代码形式即可，当然，我们也要提出可行性的建议。

根据我个人的开发经验并且参考一些开源组件库的设计规范，我个人觉得 **UI 设计规范应该包含基础设计元素规范和组件规范**这两者。

#### （1）基础设计元素规范

**基础设计元素为抽象出来的最底层的设计元素**，包括标准色、尺寸、文字、边距、间距、圆角、动画等。基础设计元素是页面展示的基础，决定了我们项目页面的基调。因为其在最底层，所以理论上应该是在前端开始开发项目前就已经确定好内容。基础设计元素规范的质量直接影响了后续前端开发的效率。

下图列举了基础设计规范的具体内容，主要包括标准色、文字、圆角、边距、间距和动画： ![设计元素规范](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/72d5fc5f91a64381ac775c6f8a50c4ec~tplv-k3u1fbpfcp-zoom-1.image)

#### （2）组件规范

组件规范是在基础设计元素之上的，由多个基础设计元素组合构成。我们就拿要设计一个 `Button` 组件为例，看一下组件规范需要考虑哪些因素。

首先，我们的 `Button` 组件需要按照功能分为不同的类型，比如**默认按钮**、用于超链接的**链接按钮**、只有图标的**图标按钮**、用于深色背景的**幽灵按钮**。这需要用到底层基础设计元素的功能色和文字颜色还有圆角。不同场景下还需要有不同的操作状态：**危险、成功、警告、禁用**... 这也用到了功能色。同时还要有不同的尺寸规格：**大、中、小、迷你**，这就用到尺寸元素。颜色、尺寸、文字、圆角这些基础元素互相组合，形成了我们的组件规范。

如下图按钮 `Button` 组件所示，`Button` 组件的不同状态是由不同的基础设计元素组合而成。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/675315ac72d9496baeabf6cf19cf7115~tplv-k3u1fbpfcp-zoom-1.image)

而我们的组件规范，应该包括整个项目中需要用到的基础组件，比如按钮、输入框、模态框、选择框等等不一一列举了。然后需要制定出各个场景的使用规则和对应的样式，基础设计元素规范为组件规范提供底层规范支持。

如果是要开发自己团队内部的组件规范，那么可以“按需开发”，也就是说我们开始可以只设计和开发一些现在用到的组件和场景，随着项目的迭代，再慢慢补充组件或者扩展组件功能。如果是做开源项目，那么就必须要将所有可能用到的场景和扩展在开发前设计好。

### 规范落地

现在我们知道了 UI 规范的范围之后，那么作为前端工程师的我们应该如何去将规范落地呢。

规范落地的前提是你应该先要有一套和交互师、设计师沟通好的一套设计规范。前面也说过，UI 设计规范最好是交互、设计同学主导指定，前端将其“翻译”为代码形式。通常我们需要在团队刚组件的时候前将规范制定好，如果你的团队还没有一套 UI 规范，那么制定规范最好的时间就是现在。

在制定 UI 规范的过程中，前端同学也是要评估下规范的合理性和开发的可行性，比如颜色是否过多、相互组合起来是否会有冲突等。同时，最好和设计师一起对每一个元素进行语义化命名，这样，在日后的合作中，优先按照语义使用对应的元素。

在有了和设计同学确定好的设计规范之后，我们就可以将其落地为具体的代码。在我们的项目中，建议有一个全局的 CSS 样式文件，供其他项目文件引用，我们就将实现的具体代码放在这个全局共用文件中，例如我们可以这样定义功能色：

```
/* color */
$color-primary: #004099          // 品牌色
$color-success: #00B376          // 成功色
$color-warning: #FF9500          // 警告色
$color-error: #F23524            // 错误色
$color-black: #000000            // 黑色
$color-white: #FFFFFF            // 白色

/* 填充色 */
$fill-base: #FFFFFF              // 基础组件填充色
$fill-body: #F2F4F7              // body 填充色
```

这里可以参考 ant-design 的落地所有样式变量：[ant-design 全局 CSS 变量](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)；

在我们开发组件的时候，仍然用刚刚的 `Button` 组件举例，我们首先会拿到用户传入的 `props` 参数，然后根据 `props` 的不同给 `Button` 增加不同的 CSS 类名，通过不同的 CSS 类名或者组合使用来实现不同的使用场景的 UI 样式。

```
import classnames from 'classnames';
import React from 'react';
import TouchFeedback from 'rmc-feedback';
import { ButtonProps } from './PropsType';

const Button = (props: ButtonProps) => {
  const {
    children,
    className,
    prefixCls = 'cherry-button',
    type = 'primary',
    size = 'md',
    inline = false,
    disabled = false,
    icon,
    loading = false,
    activeStyle = {},
    style = {},
    activeClassName,
    onClick,
    ...restProps
  } = props;

  const iconType: any = loading ? 'loading' : icon;
  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-primary`]: type === 'primary',
    [`${prefixCls}-ghost`]: type === 'ghost',
    [`${prefixCls}-danger`]: type === 'danger',
    [`${prefixCls}-mini`]: size === 'mini',
    [`${prefixCls}-small`]: size === 'small',
    [`${prefixCls}-medium`]: size === 'medium',
    [`${prefixCls}-large`]: size === 'large',
    [`${prefixCls}-inline`]: inline,
    [`${prefixCls}-disabled`]: disabled,
    [`${prefixCls}-loading`]: loading,
    [`${prefixCls}-icon`]: !!iconType,
  });

  return (
    <TouchFeedback activeClassName={
      activeClassName || (activeStyle ? `${prefixCls}-active` : '')}
      disabled={disabled}
      activeStyle={activeStyle}>
      <div
        style={style}
        className={wrapCls}
        onClick ={ disabled ? undefined : onClick}
        {
          ...restProps
        }
      >
        {children}
      </div>
    </TouchFeedback>
  )
}

export default Button
```

然后，在我们在样式文件中，首先需要将基础设计元素规范的全局 CSS 文件引入。然后就是将组件中的 CSS 类名在样式文件中定义。代码如下

```
@import 'styles/themes/default.less';
@import 'styles/themes/mixins/hairline.less';
@import 'styles/themes/button-var.less';

@buttonPrefixCls: cherry-button;

.@{buttonPrefixCls} {
  display: block;
  outline: 0 none;
  -webkit-appearance: none;
  box-sizing: content-box;
  padding: 0 @height-medium;
  text-align: center;
  height: @button-height-medium;
  line-height: @button-height-medium;

  // font
  font-size: @font-size-medium;

  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: nowrap;

  // default
  color: @color-text-active;
  background-color: @fill-base;
  border-radius: @radius-circle;

  border: 1px solid @border-color-gray;

  &&-active {
    background-color: fade(@fill-base, 60%);
  }

  &&-disabled {
    color: @color-text-inverse;
    background: @fill-disabled;
    .hairline('all', @fill-disabled, @radius-circle);
  }

  &-primary {
    color: @color-text-inverse;
    background-color: @color-primary;
    .hairline('all', @color-primary, @radius-circle);

    &.@{buttonPrefixCls}-active {
      background-color: @color-primary-tap;
      .hairline('all',  @color-primary-tap, @radius-circle);
    }
  }
  ......
  ......

  &-inline {
    display: inline-block;
    &.@{buttonPrefixCls}-icon {
      display: inline-flex;
    }
  }

  &-mini {
    font-size: @font-size-mini;
    height: @button-height-mini;
    line-height: @button-height-mini;
    padding: 0 @h-spacing-xs;
    font-weight: normal;
  }
	......
	......

  > .@{buttonPrefixCls}-icon {
    margin-right: 0.5em;
  }
}
```

可以看到，基本上我们属性值都是使用基础设计元素中的。这样开发 CSS，第一是使 CSS 更具有语义化，第二则是更便于维护。

## 总结

本文我们主要介绍了命名规范和 UI 设计规范。良好的命名以及良好的命名习惯，会让我们在开发前去思考这个名称所表达的概念、行为是否符合其内容。对于命名有良好的思维习惯也可以反作用于我们，纠正我们的一些错误设计和代码实现。统一 UI 规范对于用户而言可以培养用户心智、减少用户学习成本，同时，也可以提升品牌形象，对于开发而言，可以提高开发效率和可维护性。

在下一篇文章中，我会继续介绍协作规范相关的内容。
    