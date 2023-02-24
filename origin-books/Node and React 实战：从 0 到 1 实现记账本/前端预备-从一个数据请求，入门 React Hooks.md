
# 前端预备-从一个数据请求，入门 React Hooks
---

## 前言

`React` 早期的写法以 `Class` 类组件为主，附带一些纯用于展示的函数组件，但是函数组件是不能控制自身的状态的。

直到 16.8 版本出来之后，引入了全新的 `Hooks` 写法，这让之前的类写法就显得 比较累赘，函数组件的写法开始流行起来。函数组件引入了多种钩子函数如 `useEffect`、`useState`、`useRef`、`useCallback`、`useMemo`、`useReducer` 等等，通过这些钩子函数来管理函数组件的各自状态。

## 正文

本章节我会通过一个请求，带大家入门整个 `React Hook` 知识体系。首先我们需要创建一个空项目，由于本实验采用的是 `Vite 2.0` 作为脚手架工具，所以我们的 `Node` 版本必须要在 `12.0.0` 以上，目前我的版本是 `12.6.0`。

我们通过指令新建一个联手项目，如下所示：

```bash
# npm 6.x
npm init @vitejs/app hooks-demo --template react

# npm 7+, 需要额外的双横线：
npm init @vitejs/app hooks-demo -- --template react

# yarn
yarn create @vitejs/app hooks-demo --template react
```

根据你的需求，选择上述三个其中一个。新建之后项目目录如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a994cd755bb34164ba5abff2c88af997~tplv-k3u1fbpfcp-zoom-1.image)

```bash
npm install
npm run dev
```

如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b82ef228cba417bb1f6f910c2406abf~tplv-k3u1fbpfcp-zoom-1.image)

看到如上述所示代表项目已经启动成功了。

#### useState

接下来我们清空 `App.jsx`，添加如下代码：

```javascript
import React, { useState } from 'react'

function App() {
  const [data, setData] = useState([1, 2, 3, 4, 5])
  return (
    <div className="App">
      {
        data.map((item, index) => <div key={index}>{item}</div>)
      }
    </div>
  )
}

export default App
```

函数内声明变量，可以通过 `useState` 方法，它接受一个参数，可以为默认值，也可以为一个函数。上述我们先分析默认值的情况，默认给一个数组 `[1, 2, 3, 4, 5]`，`data` 参数便可以直接在 `JSX` 模板中使用。

#### useEffect

此时，我们通过 `useEffect` 副作用，请求一个接口数据，如下所示：

```javascript
import React, { useEffect, useState } from 'react'
// 模拟数据接口，3 秒钟返回数据。
const getList = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([6, 7, 8, 9, 10])
    }, 3000)
  })
}

function App() {
  const [data, setData] = useState([1, 2, 3, 4, 5])

  useEffect(() => {
    (async () => {
      const data = await getList()
      console.log('data', data)
      setData(data)
    })()
  })
  return (
    <div className="App">
      {
        data.map((item, index) => <span key={index}>{item}</span>)
      }
    </div>
  )
}

export default App
```

函数组件默认进来之后，会执行 `useEffect` 中的回调函数，但是当 `setData` 执行之后，`App` 组件再次刷新，刷新之后会再次执行 `useEffect` 的回调函数，这便会形成一个可怕的死循环，回调函数会一直被这样执行下去。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b3187ae7425542beb62f3b207e27acb0~tplv-k3u1fbpfcp-zoom-1.image)

所以这里引出 `useEffect` 的第二个参数。它是一个数组，数组内接收回调函数内使用到的状态参数，一旦在组件内改变了状态参数，则会触发副作用 `useEffect` 的回调函数执行。

所以我们如果传一个空数组 `[]`，则该副作用只会在组件渲染的时候，执行一次，如下所示：

```javascript
useEffect(() => {
  (async () => {
    const data = await getList()
    console.log('data', data)
    setData(data)
  })()
}, [])
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f1c917ab81e41d19dbbf0ea5d31c4ed~tplv-k3u1fbpfcp-zoom-1.image)

执行一次之后，副作用不再被触发。

此时我们需要给请求一个 `query` 参数，如下所示：

```javascript
import React, { useEffect, useState } from 'react'

const getList = (query) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('query', query)
      resolve([6, 7, 8, 9, 10])
    }, 3000)
  })
}

function App() {
  const [data, setData] = useState([1, 2, 3, 4, 5])
  const [query, setQuery] = useState('')

  useEffect(() => {
    (async () => {
      const data = await getList(query)
      console.log('data', data)
      setData(data)
    })()
  }, [query])
  return (
    <div className="App">
      {
        data.map((item, index) => <span key={index}>{item}</span>)
      }
      <input onChange={(e) => setQuery(e.target.value)} type="text" placeholder='请输入搜索值' />
    </div>
  )
}

export default App
```

此时我们改变 `query` 的值，副作用函数便会被执行，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ef93bf033594ba0b2272f59a99e2447~tplv-k3u1fbpfcp-zoom-1.image)

所以，如果你的接口有查询参数，可以将参数设置在 `useEffect` 的第二个参数的数组值中，这样改变查询变量的时候，副作用便会再次触发执行，相应的函数也会重新带着最新的参数，获取接口数据。

#### 自定义 Hook

我们可以将上述的请求，抽离成一个自定义 `hook`，方便在多个地方调用，新建 `useApi.js` 如下所示：

```javascript
import React, { useEffect, useState } from 'react'
// 模拟请求
const getList = (query) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('query', query)
      resolve([6, 7, 8, 9, 10])
    }, 3000)
  })
}
// 自定义 hook
const useApi = () => {
  const [data, setData] = useState([1, 2, 3, 4, 5])
  const [query, setQuery] = useState('')

  useEffect(() => {
    (async () => {
      const data = await getList()
      console.log('data', data)
      setData(data)
    })()
  }, [query])

  return [{ data }, setQuery];
}

export default useApi
```

如上述所示，最终将 `data` 数据，和设置请求参数的方法抛出，在 `App.jsx` 中做如下改动：

```javascript
import React from 'react'
import useApi from './useApi'

function App() {
  const [{ data }, setQuery] = useApi()
  return (
    <div className="App">
      {
        data.map((item, index) => <span key={index}>{item}</span>)
      }
      <input onChange={(e) => setQuery(e.target.value)} type="text" placeholder='请输入搜索值' />
    </div>
  )
}

export default App
```

我们查看浏览器展示结果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae7372c75f23457eb8d114c2bb5d56a5~tplv-k3u1fbpfcp-zoom-1.image)

上述这类自定义 `Hook` 的使用，在开发中也非常常见，比如有一个请求公共数据的接口，在多个页面中被重复使用，你便可通过自定义 `Hook` 的形式，将请求逻辑提取出来公用，这也是之前 `Class` 类组件所不能做到的。

#### useMemo

我们修改 `App.jsx`，在内部新增一个子组件，子组件接收父组件传进来的一个对象，作为子组件的 `useEffect` 的第二个依赖参数。

```javascript
import React, { useEffect, useState } from 'react'

function Child({ data }) {
  useEffect(() => {
    console.log('查询条件：', data)
  }, [data])

  return <div>子组件</div>
}


function App() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [kw, setKw] = useState('')

  const data = {
    name,
    phone
  }

  return (
    <div className="App">
      <input onChange={(e) => setName(e.target.value)} type="text" placeholder='请输入姓名' />
      <input onChange={(e) => setPhone(e.target.value)} type="text" placeholder='请输入电话' />
      <input onChange={(e) => setKw(e.target.value)} type="text" placeholder='请输入关键词' />
      <Child data={data} />
    </div>
  )
}

export default App
```

当我们修改姓名和电话的时候，观察子组件是否监听到依赖的变化，执行 `useEffect` 内的回调函数。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97c533fa2d7a44f491734454089b3b84~tplv-k3u1fbpfcp-zoom-1.image)

此时，上述的结果是我们预期的，我们只监听了 `name` 和 `phone` 两个参数，但是我们修改关键词输入框，会得到下面的结果。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d40462facac94aea91209bb5cbc1cedc~tplv-k3u1fbpfcp-zoom-1.image)

子组件并没有监听 `kw` 的变化，但是结果却是子组件也被触发渲染了。原因其实是我们在父组件重新 `setKw` 之后，`data` 值和未作修改 `kw` 前的值已经不一样了。你可能会说，`data` 的值并没有变化，为什么说它已经不一样了呢？详细的分析我们放在后续部分，我们此时可以通过 `useMemo` 将 `data` 包装一下，告诉 `data` 它需要监听的值。

```javascript
import React, { useEffect, useState, useMemo } from 'react'

function Child({ data }) {
  useEffect(() => {
    console.log('查询条件：', data)
  }, [data])

  return <div>子组件</div>
}


function App() {

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [kw, setKw] = useState('')

  const data = useMemo(() => ({
    name,
    phone
  }), [name, phone])

  return (
    <div className="App">
      <input onChange={(e) => setName(e.target.value)} type="text" placeholder='请输入姓名' />
      <input onChange={(e) => setPhone(e.target.value)} type="text" placeholder='请输入电话' />
      <input onChange={(e) => setKw(e.target.value)} type="text" placeholder='请输入关键词' />
      <Child data={data} />
    </div>
  )
}

export default App
```

效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c6a5ab0f6784e8bb1d45a7d2b5eb883~tplv-k3u1fbpfcp-zoom-1.image)

这便是 `useMemo` 的作用，它相当于把父组件需要传递的参数做了一个标记，无论父组件其他状态更新任何值，都不会影响要传递给子组件的对象。

#### useCallback

同理，`useCallback` 也是和 `useMemo` 有类似的功能，比如我们传递一个函数给子组件，如下所示：

```javascript
import React, { useEffect, useState, useCallback } from 'react'

function Child({ callback }) {
  useEffect(() => {
    callback()
  }, [callback])

  return <div>子组件</div>
}


function App() {

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [kw, setKw] = useState('')

  const callback = () => {
    console.log('我是callback')
  }

  return (
    <div className="App">
      <input onChange={(e) => setName(e.target.value)} type="text" placeholder='请输入姓名' />
      <input onChange={(e) => setPhone(e.target.value)} type="text" placeholder='请输入电话' />
      <input onChange={(e) => setKw(e.target.value)} type="text" placeholder='请输入关键词' />
      <Child callback={callback} />
    </div>
  )
}

export default App
```

当我们修改任何状态值，都会触发子组件的回调函数执行，但是 `callback` 没有作任何变化。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5a9b334d4514959aa7cebe0006257a8~tplv-k3u1fbpfcp-zoom-1.image)

此时，我们给要传递的函数，包裹一层 `useCallback`，如下所示：

```javascript
const callback = useCallback(() => {
  console.log('我是callback')
}, [])
```

无论修改其他任何属性，都不会触发子组件的副作用：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1742b2a340c24cd4b439d17547265e48~tplv-k3u1fbpfcp-zoom-1.image)

> useCallback 的第二个参数同 `useEffect` 和 `useMemo` 的第二个参数，它是用于监听你需要监听的变量，如在数组内添加 `name`、`phone`、`kw` 等参数，当改变其中有个，都会触发子组件副作用的执行。

所以，`useMemo` 和 `useCallback`，都能为「重复渲染」这个问题，提供很好的帮助。

## 重新认识 useEffect

上述很多现象，都是因为你没有很好地去理解 `React Hooks` 函数组件写法的渲染机制。通过一个小例子，我们来重新认识 `useEffect`。

我们将上述 `App.jsx` 作如下修改：

```javascript
import React, { useEffect, useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  
  const handleClick = () => {
    setTimeout(() => {
      console.log('点击次数: ' + count);
    }, 3000);
  }

  return (
    <div className="App">
      <button onClick={() => setCount(count + 1)}>点击{count}次</button>
      <button onClick={handleClick}>展示点击次数</button>
    </div>
  )
}

export default App
```

我们作下列几个动作：

1、点击增加按钮两次，将 `count` 增加到 2。

2、点击「展示点击次数」。

3、在 `console.log` 执行之前，也就是 3 秒内，再次点击新增按钮 2 次，将 `count` 增加到 4。

按照正常的思路，浏览器应该打印出 `点击次数: 4`，我们来查看浏览器的展示效果：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1975c7d4488e4c9a854606cb4dfa1009~tplv-k3u1fbpfcp-zoom-1.image)

点击「展示点击次数」按钮，3 秒后，我们看到的结果是 `点击次数: 2`，这与我们的预期有出入。

函数组件 `App`，在每一次渲染都会被调用，而每一次调用都会形成一个独立的上下文，可以理解成一个快照。每一次渲染形成的快照，都是互相独立的。

默认进来的时候，形成一个快照，此时 `count` 为 0；当我们点击新增按钮第一次，执行 `setCount`，函数组件被刷新一次，此时的快照中，`count` 为 1；再次点击按钮，再次生成快照，此时的 `count` 为 2，此时点击 「展示点击次数」按钮，在这份快照中，我们的 `count` 参数就是 2。所以我们后面无论怎么新增 `count`，最终输出的结果 `count` 就是 2。

我们用一份伪代码来解释，大致如下：

```javascript
// 默认初始化
function App() {
  const count = 0; // useState 返回默认值
  // ...
  function handleClick() {
    setTimeout(() => {
      console.log('点击次数: ' + count);
    }, 3000);
  }
  // ...
}

// 第一次点击
function App() {
  const count = 1; // useState 返回值
  // ...
  function handleClick() {
    setTimeout(() => {
      console.log('点击次数: ' + count);
    }, 3000);
  }
  // ...
}

// 第二次点击
function App() {
  const count = 2; // useState 返回值
  // ...
  function handleAlertClick() {
    setTimeout(() => {
      console.log('点击次数: ' + count);
    }, 3000);
  }
  // ...
}
```

上述代码中，第二次点击的快照中，`console.log('点击次数: ' + count);` 取的便是 `const count = 2`。

同理，我们可以直到，每次渲染函数组件时，`useEffect` 都是新的，都是不一样的。我们对上面的写法稍作改动。

```javascript
import React, { useEffect, useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    setTimeout(() => {
      console.log('点击次数: ' + count);
    }, 3000);
  })

  return (
    <div className="App">
      <button onClick={() => setCount(count + 1)}>点击{count}次</button>
    </div>
  )
}

export default App
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bef605a7a9c45f19f950be4e94a0c31~tplv-k3u1fbpfcp-zoom-1.image)

每一次点击，都会重新执行 `useEffect` 内的回调，并且 `count` 值也是当时的快照的一个常量值。

这和之前的类组件是不同的，我们改成类组件的实现形式如下：

```javascript
import React from 'react'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 0
    }
  }
  componentDidUpdate() {
    setTimeout(() => {
      console.log('点击次数: ' + this.state.count);
    }, 3000);
  }

  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>点击{this.state.count}次</button>
  }
}
```

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c175d79f67284e59ad4e9794e2ff2355~tplv-k3u1fbpfcp-zoom-1.image)

类组件，声明之后，会在内部生成一个实例 `instance`，所有的数据都会存在类的上下文中，所以 `this.state.count` 会一直指向最新的 `count` 值。

说到这里，大家应该对 `React Hooks` 的函数组件写法有了新的认识。

## 总结

行文至此，希望让同学们能好好地阅读和学习本章节的内容，以及课后对 `React Hooks` 的拓展。更好的理解它，有助于写出可维护、可拓展的代码，技术本身是服务于业务需求的，但是你不能很好的利用技术的特点，那业务也很难达到做满意的效果。
    