
# 前端实战-新增账单弹窗封装
---

## 前言

回顾一下上一章节学习的内容。无限滚动列表、弹窗组件的内部控制显隐、工具方法以及常量的提取。若是你开发项目时，在潜意识里，有对这些内容进行封装的思想，那么你已经有模块化、组件化的开发理念了。在大量的工程中得出的实践，将会根深蒂固在你的开发理念里。

之前，我们是对一个小组件，如时间筛选、类型筛选等小组件进行封装。本章节，我们对一个添加模块进行封装，好处就是你在任何地方，都能使用这个添加组件，对账单进行增加操作。

我们先来看看本章节要绘制的页面和逻辑：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/349d2f897ff84498a7016596b2e11882~tplv-k3u1fbpfcp-zoom-1.image)

如上图所示，本章节要实现的需求逻辑，基本上已经绘制在图中。所有的努力，都是为了凑出这几个参数：

- 账单类型

- 账单金额

- 账单日期

- 账单种类

- 备注

然后将这些数据，提交给服务端进行处理，然后存储到数据库，完事。

## 正文

上述需求整理清楚之后，我们开始本章节的制作环节。

#### 弹窗组件实现

先实现点击新增按钮，调出弹窗的功能。首先，在 `Home/index.jsx` 文件中添加 「新增按钮」，如下所示：

```javascript
import CustomIcon from '@/components/CustomIcon'
... 
const Home = () => {
  ... 
  const addToggle = () => {
    // do something
  }
  ...
  return <div className={s.home}>
    ... 
    <div className={s.add} onClick={addToggle}><CustomIcon type='tianjia' /></div>
  </div>
}
```

> 文末已为同学们提供下本章节 demo 代码，样式部分不再详细说明。

样式中，注意我给 `border` 设置的是 `1PX`，大写的单位，因为这样写的话，`postcss-pxtorem` 插件就不会将其转化为 `rem` 单位。

重启项目之后，刷新浏览器，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acf8cf59aeed4061b36a5b7359fb42b9~tplv-k3u1fbpfcp-zoom-1.image)

根据之前实现的弹窗组件，我们再实现一套类似的，在弹窗内控制弹窗组件的显示隐藏，在 `components` 下新建 `PopupAddBill` 文件夹，再新建 `index.jsx` 和 `style.module.less`，代码如下：

```javascript
// PopupAddBill/index.jsx
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup  } from 'zarm';

const PopupAddBill = forwardRef((props, ref) => {
  const [show, setShow] = useState(false) // 内部控制弹窗显示隐藏。
  // 通过 forwardRef 拿到外部传入的 ref，并添加属性，使得父组件可以通过 ref 控制子组件。
  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      }
    }
  };

  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div style={{ height: 200, background: '#fff' }}>弹窗</div>
  </Popup>
})

export default PopupAddBill
```

写完弹窗组件，当然就得去 `Home/index.jsx` 中调用：

```javascript
// Home/index.jsx
import PopupAddBill from '@/components/PopupAddBill'

const Home = () => {
  ...
  const addRef = useRef(); // 添加账单 ref
  ... 
  // 添加账单弹窗
  const addToggle = () => {
    addRef.current && addRef.current.show()
  }

  return <div className={s.home}>
    ...
    <PopupAddBill ref={addRef} />
  </div>
}
```

重启浏览器，效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7025a89978114333bdf7cbdb20139482~tplv-k3u1fbpfcp-zoom-1.image)

此时我们的“地基”已经打好了，接下来我们要在这个基础上给新增账单弹窗“添砖加瓦”。

#### 账单类型和账单时间

我们先实现弹窗头部左侧的「支出」和「收入」账单类型切换功能，添加代码如下：

```javascript
// components/PopupAddBill/index.jsx
...
import cx from 'classnames';
import { Popup, Icon  } from 'zarm';

import s from './style.module.less';

const PopupAddBill = forwardRef((props, ref) => {
  ...
  const [payType, setPayType] = useState('expense'); // 支出或收入类型
  ...
  // 切换收入还是支出
  const changeType = (type) => {
    setPayType(type);
  };

  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div className={s.addWrap}>
      {/* 右上角关闭弹窗 */}
      <header className={s.header}>
        <span className={s.close} onClick={() => setShow(false)}><Icon type="wrong" /></span>
      </header>
       {/* 「收入」和「支出」类型切换 */}
      <div className={s.filter}>
        <div className={s.type}>
          <span onClick={() => changeType('expense')} className={cx({ [s.expense]: true, [s.active]: payType == 'expense' })}>支出</span>
          <span onClick={() => changeType('income')} className={cx({ [s.income]: true, [s.active]: payType == 'income' })}>收入</span>
        </div>
      </div>
    </div>
  </Popup>
})

export default PopupAddBill
```

为了减少代码的重复，上述代码只展示了需要添加的部分，尽量不让大家混淆视听。

我们定义 `expense` 为支出，`income` 为收入，代码中通过 `payType` 变量，来控制「收入」和「支出」按钮的切换。上述代码视图效果如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd1f72d07dff4f69af0848e8d2f0696f~tplv-k3u1fbpfcp-zoom-1.image)

接下来在类型边上添加时间筛选弹窗，此时你将体会到之前提取时间筛选组件是多么的明智。我们继续添加代码：

```javascript
import React, { forwardRef, useEffect, useRef, useState } from 'react';
...
import dayjs from 'dayjs';
import PopupDate from '../PopupDate'
...

const PopupAddBill = forwardRef((props, ref) => {
  ...
  const dateRef = useRef();
  const [date, setDate] = useState(new Date()); // 日期
  ...
  // 日期选择回调
  const selectDate = (val) => {
    setDate(val);
  }

  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div className={s.addWrap}>
       {/* 「收入」和「支出」类型切换 */}
      <div className={s.filter}>
        ...
        <div
          className={s.time}
          onClick={() => dateRef.current && dateRef.current.show()}
        >{dayjs(date).format('MM-DD')} <Icon className={s.arrow} type="arrow-bottom" /></div>
      </div>
      <PopupDate ref={dateRef} onSelect={selectDate} />
    </div>
  </Popup>
})

export default PopupAddBill
```

我们引入了公共组件 `PopupDate`，传入 `ref` 控制弹窗的显示隐藏，传入 `onSelect` 获取日期组件选择后回调的值，并通过 `setDate` 重制 `date`，触发视图的更新，我们来看浏览器展示效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee3fa326b74f41ddb0d211e886ca5ccb~tplv-k3u1fbpfcp-zoom-1.image)

我们通过上述代码，已经创造出了两个值，分别是「账单类型」和「账单日期」，还差「账单金额」 「账单种类」、「备注」。

#### 账单金额

本章开头大家也应该看到了，金额输入框是模拟的，也就是说当下面模拟数字键盘点击的时候，我们将返回的数据渲染到进入输入框的位置，下面我们先将金额输入框搭建出来，添加代码如下：

```javascript
<div className={s.money}>
  <span className={s.sufix}>¥</span>
  <span className={cx(s.amount, s.animation)}>10</span>
</div>
```

> 文末已为同学们提供下本章节 demo 代码，样式部分不再详细说明。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15dc48f98c4f42eb9310619510603506~tplv-k3u1fbpfcp-zoom-1.image)

我们将金额动态化，引入 `Zarm` 为我们提供的模拟数字键盘组件 `Keyboard`，代码如下：

```javascript
...
// 监听输入框改变值
  const handleMoney = (value) => {
    value = String(value)
    // 点击是删除按钮时
    if (value == 'delete') {
      let _amount = amount.slice(0, amount.length - 1)
      setAmount(_amount)
      return
    }

    // 点击确认按钮时
    if (value == 'ok') {
      // 这里后续将处理添加账单逻辑
      return
    }

    // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
    if (value == '.' && amount.includes('.')) return
    // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
    if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
    // amount += value
    setAmount(amount + value)
  }
...

<div className={s.money}>
  <span className={s.sufix}>¥</span>
  <span className={cx(s.amount, s.animation)}>{amount}</span>
</div>
<Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
```

重启项目，浏览器展示如下图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fc90561f73d4b2c921864ebefc2cd2c~tplv-k3u1fbpfcp-zoom-1.image)

> 这里一个小提示，我在制作项目的过程中，发现一个 Zarm 2.9.0 版本的 bug，Keyboard 组件在点击删除按钮的时候，onKeyClick 方法会反复被执行，于是我降级为 2.8.2 版本，并且去他们的官网提了 issue。

此时「账单金额」也被安排上了。

#### 账单种类

账单种类的作用是表示该笔账单的大致用途，我们通过接口从数据库回去账单种类列表，以横向滚动的形式，展示在金额的下面，接下来我们看具体的代码实现：

```javascript
... 
import CustomIcon from '../CustomIcon';
import { get, typeMap } from '@/utils';

...
const [currentType, setCurrentType] = useState({}); // 当前选中账单类型
const [expense, setExpense] = useState([]); // 支出类型数组
const [income, setIncome] = useState([]); // 收入类型数组

useEffect(async () => {
  const { data: { list } } = await get('/api/type/list');
  const _expense = list.filter(i => i.type == 1); // 支出类型
  const _income = list.filter(i => i.type == 2); // 收入类型
  setExpense(_expense);
  setIncome(_income);
  setCurrentType(_expense[0]); // 新建账单，类型默认是支出类型数组的第一项
}, [])


...
<div className={s.typeWarp}>
  <div className={s.typeBody}>
    {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
    {
      (payType == 'expense' ? expense : income).map(item => <div onClick={() => setCurrentType(item)} key={item.id} className={s.typeItem}>
        {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
        <span className={cx({[s.iconfontWrap]: true, [s.expense]: payType == 'expense', [s.income]: payType == 'income', [s.active]: currentType.id == item.id})}>                
          <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
        </span>
        <span>{item.name}</span>
      </div>)
    }
  </div>
</div>
```

注意，在 `h5` 界面实现横向滚动，和在网页端相比，多了如下属性：

```css
* {
  touch-action: pan-x;
}
```

> CSS属性 touch-action 用于设置触摸屏用户如何操纵元素的区域\(例如，浏览器内置的缩放功能\)。

如果不设置它，只是通过 `overflow-x: auto`，无法实现 `h5` 端的横向滚动的，并且你要在一个 `div` 容器内设置全局 `*` 为 `touch-action: pan-x;`，如果后续遇到类似的问题，大家可以参考我上述做法，这是经过实践验证过的方法。

我们来看看浏览器的展示效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9047dbf8d2d44f09ab66fce10dc1ee89~tplv-k3u1fbpfcp-zoom-1.image)

#### 备注弹窗

备注虽然不起眼，但是别小看它，它可以在账单类型不足以概括账单时，加以一定的文字描述。

我们直接将其放置于「账单种类」的下面，代码如下：

```javascript
...
import {  Input  } from 'zarm';

...
const [remark, setRemark] = useState(''); // 备注
const [showRemark, setShowRemark] = useState(false); // 备注输入框展示控制

... 
<div className={s.remark}>
  {
    showRemark ? <Input
      autoHeight
      showLength
      maxLength={50}
      type="text"
      rows={3}
      value={remark}
      placeholder="请输入备注信息"
      onChange={(val) => setRemark(val)}
      onBlur={() => setShowRemark(false)}
    /> : <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>
  }
</div>
```

**CSS 样式部分**

```css
.remark {
  padding: 0 24px;
  padding-bottom: 12px;
  color: #4b67e2;
  :global {
    .za-input--textarea {
      border: 1px solid #e9e9e9;
      padding:  10px;
    }
  }
}
```

`:global` 的使用之前已经有描述过，这里再提醒大家一句，目前项目使用的是 `css module` 的形式，所以样式名都会被打上 `hash` 值，我们需要修改没有打 `hash` 值的 `zarm` 内部样式，需要通过 `:global` 方法。

浏览器展示效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/28bec13e3c9444cb8a4fd3779290193f~tplv-k3u1fbpfcp-zoom-1.image)

#### 调用上传账单接口

此时我们集齐了五大参数：

- 账单类型：payType

- 账单金额：amount

- 账单日期：date

- 账单种类：currentType

- 备注：remark

我们给 `Keyboard` 的「确定」按钮回调添加方法：

```javascript
import { Toast } from 'zarm';
import { post } from '@/utils';
// 监听输入框改变值
const handleMoney = (value) => {
  value = String(value)
  // 点击是删除按钮时
  if (value == 'delete') {
    let _amount = amount.slice(0, amount.length - 1)
    setAmount(_amount)
    return
  }
  // 点击确认按钮时
  if (value == 'ok') {
    addBill()
    return
  }
  // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
  if (value == '.' && amount.includes('.')) return
  // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
  if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
  // amount += value
  setAmount(amount + value)
}

// 添加账单
const addBill = async () => {
  if (!amount) {
    Toast.show('请输入具体金额')
    return
  }
  const params = {
    amount: Number(amount).toFixed(2), // 账单金额小数点后保留两位
    type_id: currentType.id, // 账单种类id
    type_name: currentType.name, // 账单种类名称
    date: dayjs(date).unix() * 1000, // 日期传时间戳
    pay_type: payType == 'expense' ? 1 : 2, // 账单类型传 1 或 2
    remark: remark || '' // 备注
  }
  const result = await post('/api/bill/add', params);
  // 重制数据
  setAmount('');
  setPayType('expense');
  setCurrentType(expense[0]);
  setDate(new Date());
  setRemark('');
  Toast.show('添加成功');
  setShow(false);
  if (props.onReload) props.onReload();
}
```

`onReload` 方法为首页账单列表传进来的函数，当添加完账单的时候，执行 `onReload` 重新获取首页列表数据。

```javascript
<PopupAddBill ref={addRef} onReload={refreshData} />
```

浏览器展示如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c3fd021a8f8497d8b14ff0c81a53367~tplv-k3u1fbpfcp-zoom-1.image)

如果如上图所示，恭喜你，你已经成功完成了添加账单的 工作，此时再回头甚至之前写的代码，马上改正一些变量及一些方法的命名，规范化一下代码。

千万别在后面再去完善，因为很大程度上，到后面你会懒得翻前面写的代码，除非实在是逻辑问题导致的 bug。

## 总结

本章节的内容也是非常丰富，我们的所有的努力，就是为了集齐「添加账单」所需要的五大参数。这是很多需求的一个索引，试问前端在调用接口的过程中，不都是做各种努力为了凑齐那几个参数呢？过程很重要，只要流程做得完善，结果自然水到渠成。

#### 本章节源码

[点击下载](https://s.yezgea02.com/1624372989325/react-vite-h5.zip)
    