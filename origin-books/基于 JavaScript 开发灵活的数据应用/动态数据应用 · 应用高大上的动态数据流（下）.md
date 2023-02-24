
# 动态数据应用 · 应用高大上的动态数据流（下）
---

# 第 21 节 动态数据应用 · 应用高大上的动态数据流（下）

我们终于来到了本小册的最后一节，在本节中我们将从一个我们经常要使用到的应用场景出发，构建一个具有我们可以亲身感受并使用的数据应用。这个应用场景便是我们所使用的“记账本”，一个完全由数据组成的应用程序。

## 21.1 准备数据

我们在第 18 节中曾经提到过数据流除了从其他系统中直接获取到的动态数据流以外，还可以是终端使用者在使用过程中不断产生的行为事件数据。其中行为数据还可以分为两种，一种是终端用户有意或无意产生的基本行为实践（如点击、滚动等），另外一种是由应用方主动记录的关键性行为事件（如登陆、切换开关等），我们分别将它们归类为基础事件和关键事件。

这些行为事件数据在程序看来也同样是一种不断产生的实时数据流，我们可以使用前面曾经学过的知识对这些数据进行处理和应用。在上一节中我们为来自 Web 服务的动态数据流封装了一个数据源对象，同样的也可以为来自用户主动产生的数据集封装一个对象。但是跟上一节中简单的 ping 值数据不同，这一节中我们所使用的数据要复杂的多，所以在一切开始之前我们要先来确定一下我们所需要控制的数据模型都有哪些。

### 21.1.1 确定数据模型

为了照顾好各层次读者的学习体验，在确定记账本应用的需求时，我们需要遵守好一切从简单出发的原则。而在我们平时的记账需求中，最基本的数据模型自然便是账单 `bill` 了。账单最基本的数据属性是账单金额 `amount`，以及账单的类型 `type`（支出或收入）。

而除了账单外，既然我们已经使用了代码来实现一个电子记账本了，自然需要比一般的纸质账本要更智能一些。其中纸质账本没办法快速完成的需求便是自动化统计，如一定时间范围内的支出统计、各种支出分类各自的统计等等。

为了实现这些需求，我们还需要维护好每一个账单的创建时间以及对应的账单分类。为了能够更方便地统计各种分类的账单数据，我们还可以单独维护一个用于存储账单分类的数据集 `category`。

```
// 数据结构伪代码
Bill {
  type: 0 /* 支出 */ | 1 /* 收入 */
  amount: Number
  category: String
  created_at: Date
}

Category {
  type: 0 | 1
  name: String
}
```

为了能够更方便地记录和使用这些数据，我们这里用笔者开发一个用于在 JavaScript 应用中更好地应用和管理数据的开源项目——[MinDB](https://github.com/iwillwen/mindb) 以及它的配套设施 [`min-model`](https://github.com/iwillwen/min-model)（用于创建数据模型）。我们可以先在 CodePen 中加入它们来简单尝试使用一下。

```
https://unpkg.com/min@0.2.2/dist/min.js
```

```
https://unpkg.com/min-model@0.2.8/dist/model.js
```

把这两个 JavaScript 文件添加到 CodePen 中，然后在 JavaScript 代码一栏中初始化 `min-model` 并建立一个 `Bill` 的模型。

```
Model.use(min)

const Bill = Model.extend('bill', {
  type: Number,
  amount: Number,
  category_key: String,
  created_at: Number
})

console.log(Bill)
```

通过这个 `Bill` 模型，我们便可以创建一个账单对象，并将其存储到 MinDB 所指定的存储介质内，默认为 `localStorage`。

```
const bill = new Bill({
  type: 0,
  amount: 100,
  category_key: '<hash_id>',
  created_at: Date.now()
})

console.log(bill)
//=>
// Bill {
//   key
//   type: 0,
//   amount: 100,
//   category_key: <hash_id>,
// }
```

当我们需要从 MinDB 中重新提取出所有的账单时，只需要调用 `Bill.dump()` 即可。

```
const bills = await Bill.dump()
console.log(bills）
//=> [ Bill {...} ]
```

除了账单本身以外，我们还需要创建账单类型的 `Category` 模型。

```
const Category = Model.extend('category', {
  type: Number,
  name: String
})

const diningCategory = new Category({
  type: 0,
  name: '餐饮'
})
```

得到了两个数据模型后，我们就可以为实际应用封装一些便于操作的函数，而更详细的使用方法请参考 `min-model` 的 [GitHub Repo](https://github.com/iwillwen/min-model)。

```
const vm = new Vue({
  data: {
    // 用于 MVVM 绑定的账单对象
    bill: {
      type: 0,
      amount: 0
    },

    // 选中的账单类型对象
    selectedCategory: null,

    // 数据集缓存
    bills: [],
    categories: []
  },
  
  async created() {
    await Promise.all([
      this.loadBills(),
      this.loadCategories()
    ])
  },

  methods: {
    // 创建账单
    async createBill() {
      if (!this.selectedCategory) {
        return
      }

      new Bill({
        type: this.bill.type,
        amount: this.amount.amount,
        category_key: this.selectedCategory.key
      })
    },

    // 加载账单
    async loadBills() {
      this.bills = await Bill.dump()
    },

    // 加载账单分类
    async loadCategories() {
      this.categories = await Category.dump()
    }
  }
})
```

### 21.1.2 确定统计口径

准备好数据的模型和控制以后，我们就可以对我们所需要的统计内容下定调了。首先我们目前所拥有的数据和其维度有：账单的类型（支出和收入）、账单的分类以及账单的创建时间。

对于记账本来说，首先第一个需要区分点便是通过账单的时间分开不同时间范围，而这个参考我们在第 6 节中便已经讲过如何使用时间序列处理方法对以时间作为主要维度的数据集进行处理和整合分析。而在第 18 和第 19 节中我们又学习了如何将处理和统计方法通过数据流的方式整合起来，完成更直观、快速的数据流。那么在这里我们便可以结合这些我们学习到的知识应用到我们这个数据应用上。

首先便是需要从时间维度上对账单数据进行归类，比如我们需要知道每一天都有哪些账单、这一天花了多少钱等等，这里我们可以使用到前面我们所创建的时间序列工具。

统计目标值：每日、每月的支出额

```
import createTimeSeries from '../utils/timeserie'
import { fromPairs } from 'lodash'

const vm = new Vue({
  // ...

  computed: {
    // 统计每月支出金额
    monthlyExpense() {
      const timeseries = createTimeSeries(this.typedBills()).groupByMonth()

      return fromPairs(
        timeseries.windows().map(month => {
          return [ month, timeseries.sumBy(month, 'amount') ]
        })
      )
    }
    //=> [[ '2019-01', 100 ], [ '2019-02', 100 ], ...]
  },

  methods: {
    typedBills(type = 0) {
      return this.bills.filter(bill => bill.type === type)
    },

    typedRangeData(type = 0) {
      return createTimeSeries(this.typedBills(type)).groupByMonth()
    },

    typedMonthlyBills(month, type = 0) {
      return this.typedRangeData(type).map[month] || []
    },

    typedDatesData(month, type = 0) {
      return createTimeSeries(this.typedMonthlyBills(month, type)).groupByDate()
    },

    typedDailyAmount(month, type = 0) {
      const datesData = this.typedDatesData(month, type)

      return fromPairs(
        datesData.windows()
          .map(date => [ date, datesData.sumBy(date, 'amount') ])
      )
    }
  }
})
```

除此以外还有如：每月收入金额，每种分类的消费金额等等，因为统计方法类似所以这里就不在重复了。

## 21.2 应用统计数据到可视化图表

在得到了统计数据以后，我们便可以将其结合 ECharts 将数据展示在页面上了，我们这里以每日消费金额作为展示的数据。

```
const vm = new Vue({

  computed: {
    // ...
  
    dates() {
      return Array(moment(this.selectedMonth, 'YYYY-MM').daysInMonth()).fill(1)
        .map((_, i) => `${this.selectedMonth}-${(i + 1).toString().padStart(2, '0')}`)
    },
  
    dailyExpenseChartOption() {

      const datesData = this.typedDatesData(this.selectedMonth, 0)

      return {
        dataset: {
          source: this.dates.map(date => ({
            date, expense: this.typedDailyAmount(this.selectedMonth, 0)[date] || 0
          }))
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '5%',
          bottom: '5%',
          left: '5%',
          right: '5%',
          containLabel: true
        },
        xAxis: { type: 'category' },
        yAxis: {
          min: 0,
          max: value => value.max
        },
        series: [
          {
            type: 'line',
            encode: {
              x: 'date',
              y: 'expense'
            }
          }
        ]
      }
    }
  }

})
```

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/22/169a3ae4659b126c~tplv-t2oaga2asx-image.image)

由于 Vue.js 所使用的底层机制为 MVVM，所以当上面 `data` 中的数据缓冲层中的数据发生改变时图表也会同时发生改变。

当这些都全部整合好以后，我们就可以将数据层、控制层、展示层连接起来，完成整个 DEMO 的开发。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/22/169a3ae5a710878e~tplv-t2oaga2asx-image.image)

我们可以通过我们已经做好的 DEMO 来体验这个没有后端支撑的记账本应用：<http://account-book.now.sh>，源代码：<https://github.com/iwillwen/account-book>。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/3/22/169a3ae6f5cc22f3~tplv-t2oaga2asx-image.image)

## 总结

我们终于结束了总共 21 节的学习，在这过程中我们学习到了以下内容：

1.  使用 JavaScript 对各种简单和复杂的数据结构
2.  使用 JavaScript 对不同的数据结构进行转换
3.  使用 ECharts 实现各种数据可视化图表
4.  结合数据流的概念完成更具灵活性的动态数据集和动态处理方法
5.  利用 Vue.js 作为控制层，结合动态数据集和动态处理方法开发灵活的数据应用
6.  结合 Vue.js、ECharts 和 MinDB 等工具开发完整的数据应用

希望完成了以上学习的同学们可以多次复习其中的知识，本节中所提供的 [DEMO](https://github.com/iwillwen/account-book) 也可以帮助你更好地理解我们所学习过的内容。作为本小册最后的习题，我们可以开放性地想想我们所学习到的内容可以应用在哪些场景中，你可以自行开发一个属于自己的 DEMO，甚至将其应用到你的实际工作中。

### 附录：经典应用场景

1.  游戏
2.  数据分析平台
3.  数据大屏展示
4.  App 中的数据展示页面（房价分析等）
5.  DevOps 监控中心
6.  ……
    