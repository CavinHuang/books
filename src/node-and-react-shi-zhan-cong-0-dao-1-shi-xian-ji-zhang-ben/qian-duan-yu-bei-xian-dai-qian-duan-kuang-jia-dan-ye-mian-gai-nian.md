
# 前端预备-现代前端框架单页面概念
---

## 前言

服务端的内容基本上已经结束，从本章节开始，带大家进入前端部分的实战环节。本项目前端部分使用 `React` 作为前端框架，所以先带大家理解什么是单页面，它是怎样实现页面组件之间的切换，路由的原理等知识点。

#### 知识点

- 传统页面 DOM 直出

- 单页面原理

- 前端路由实现

## 单页面

前端自从进入三大框架时代以来，传统的多页面开发已渐渐淡出人们的视线。为了更好的了解现在，我们先要去知道它的过去。

#### 传统页面

这里不纠结叫法，凡是整个项目都是 `DOM` 直出的页面，我们都称它为“传统页面”（SSR 属于首屏直出，这里我不认为是传统页面的范畴）。那么什么是 `DOM` 直出呢？简单说就是在浏览器输入网址后发起请求，返回来的 `HTML` 页面是最终呈现的效果，那就是 `DOM` 直出。并且每次点击页面跳转，都会重新请求 `HTML` 资源。耳听为虚，眼见为实。我们以这个地址为例，验证以下上述说法。

> <https://www.cnblogs.com/han-1034683568/p/14126727.html#4773138>

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90c234badd9b412399615c1622fb78e2~tplv-k3u1fbpfcp-zoom-1.image)

腚眼一看，就能明白上图在描述什么。没错，博客园就是一个传统页面搭建而成的网站，每次加载页面，都会返回 `HTML` 资源以及里面的 `CSS` 等静态资源，组合成一个新的页面。 还没明白的同学，我再教一个方法，就是在浏览器页面右键，点击“显示网页源代码”，打开后如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c14b94fc22de47be8ae7bf7b1476b24b~tplv-k3u1fbpfcp-zoom-1.image)

网页上能看到什么图片或文字，你能在上述图片中找到相应的 `HTML` 结构，那也属于传统页面，也就是 `DOM` 直出。

#### 单页面

时代在进步，科技在发展，面对日益增长的网页需求，网页开始走向模块化、组件化的道路。随之而来的是代码的难以维护、不可控、迭代艰难等现象。面临这种情况，催生出不少优秀的现代前端框架，首当其冲的便是 `React` 、 `Vue` 、 `Angular` 等著名单页面应用框架。而这些框架有一个共同的特点，便是“通过 `JS` 渲染页面”。 举个例子，以前我们直出 `DOM` ，而现在运用这些单页面框架之后， `HTML` 页面基本上只有一个 `DOM` 入口，大致如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ffef8918b4a4b9cb4401cc7a6dc4eb4~tplv-k3u1fbpfcp-zoom-1.image)

所有的页面组件，都是通过运行上图底部的 `app.js` 脚本，挂载到 `<div id="root"></div>` 这个节点下面。用一个极其简单的 `JS` 展示挂载这一个步骤：

```html
<body>
  <div id="root"></div>
  <script>
    const root = document.getElementById('root') // 获取根节点
    const divNode = document.createElement('div') // 创建 div 节点
    divNode.innerText = '你妈贵姓？' // 插入内容
    root.appendChild(divNode) // 插入根节点
  </script>
</body>
```

所有的节点都通过 `createElement` 方法创建，最终通过 `appendChild` 的形式插入到 `root` 根节点。

那么问题来了，我如果有十几个页面需要这样的操作咋整？

这时候「前端路由」应运而生，它的出现就是为了解决单页面网站多个页面组件切换。通过切换浏览器地址路径，来匹配相对应的页面组件。我们通过一张丑陋的图片来理解这个过程：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1ac50c7ba4cd4d85bbbdb3cd491b1e47~tplv-k3u1fbpfcp-zoom-1.image)

「前端路由」会根据浏览器地址栏 `pathname` 的变化，去匹配相应的页面组件。然后将其通过创建 `DOM` 节点的形式，塞入根节点

 。这就达到了无刷新页面切换的效果，从侧面也能说明正因为无刷新，所以 `React` 、 `Vue` 、 `Angular` 等现代框架在创建页面组件的时候，每个组件都有自己的「生命周期」。

#### 路由实现原理

「前端路由」插件比较火的俩框架对应的就是 `Vue-Router` 和 `React-Router` ,但是它们的逻辑，归根结底还是一样的，用殊途同归四个字，再合适不过。

通过分析「哈希模式」和「历史模式」的实现原理，让大家对前端路由的原理有一个更深刻的理解。

**哈希模式\(hash\)**

`a` 标签锚点大家应该不陌生，而浏览器地址上 `#` 后面的变化，是可以被监听的，浏览器为我们提供了原生监听事件 `hashchange`，它可以监听到如下的变化：

- 点击 `a` 标签，改变了浏览器地址。

- 浏览器的前进后退行为。

- 通过 `window.location` 方法，改变浏览器地址。

接下来我们利用这些特点，去实现一个 hash 模式的简易路由： [在线运行](https://codepen.io/nick930826/pen/BaLGprx)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hash 模式</title>
</head>
  <body>
    <div>
      <ul>
        <li><a href="#/page1">page1</a></li>
        <li><a href="#/page2">page2</a></li>
      </ul>
      <!--渲染对应组件的地方-->
      <div id="route-view"></div>
    </div>
  <script type="text/javascript">
    // 第一次加载的时候，不会执行 hashchange 监听事件，默认执行一次
    // DOMContentLoaded 为浏览器 DOM 加载完成时触发
    window.addEventListener('DOMContentLoaded', Load)
    window.addEventListener('hashchange', HashChange)
    // 展示页面组件的节点
    var routeView = null
    function Load() {
      routeView = document.getElementById('route-view')
      HashChange()
    }
    function HashChange() {
      // 每次触发 hashchange 事件，通过 location.hash 拿到当前浏览器地址的 hash 值
      // 根据不同的路径展示不同的内容
      switch(location.hash) {
      case '#/page1':
        routeView.innerHTML = 'page1'
        return
      case '#/page2':
        routeView.innerHTML = 'page2'
        return
      default:
        routeView.innerHTML = 'page1'
        return
      }
    }
  </script>
  </body>
</html>
```

> 当然，这是很简单的实现，真正的 hash 模式，还要考虑到很多复杂的情况，大家有兴趣就去看看源码。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c63aefb5291845bda877ec0a1d1a7fee~tplv-k3u1fbpfcp-zoom-1.image)

**历史模式\(history\)**

`history` 模式会比 `hash` 模式稍麻烦一些，因为 `history` 模式依赖的是原生事件 `popstate`，下面是来自 MDN 的解释：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e778ae17bb64effb55b03edad66f8df~tplv-k3u1fbpfcp-zoom-1.image)

> 小知识：pushState 和 replaceState 都是 HTML5 的新 API，他们的作用很强大，可以做到改变浏览器地址却不刷新页面。这是实现改变地址栏却不刷新页面的重要方法。

包括 `a` 标签的点击事件也是不会被 `popstate` 监听。我们需要想个办法解决这个问题，才能实现 `history` 模式。

解决思路：我们可以通过遍历页面上的所有 `a` 标签，阻止 `a` 标签的默认事件的同时，加上点击事件的回调函数，在回调函数内获取 `a` 标签的 `href` 属性值，再通过 `pushState` 去改变浏览器的 `location.pathname` 属性值。然后手动执行 `popstate` 事件的回调函数，去匹配相应的路由。逻辑上可能有些饶，我们用代码来解释一下：[在线地址](https://codepen.io/nick930826/pen/BaLGprx)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>History 模式</title>
</head>
<body>
  <div>
    <ul>
      <li><a href="/page1">page1</a></li>
      <li><a href="/page2">page2</a></li>
    </ul>
    <div id="route-view"></div>
  </div>
  <script type="text/javascript">
    window.addEventListener('DOMContentLoaded', Load)
    window.addEventListener('popstate', PopChange)
    var routeView = null
    function Load() {
      routeView = document.getElementById('route-view')
      // 默认执行一次 popstate 的回调函数，匹配一次页面组件
      PopChange()
      // 获取所有带 href 属性的 a 标签节点
      var aList = document.querySelectorAll('a[href]')
      // 遍历 a 标签节点数组，阻止默认事件，添加点击事件回调函数
      aList.forEach(aNode => aNode.addEventListener('click', function(e) {
        e.preventDefault() //阻止a标签的默认事件
        var href = aNode.getAttribute('href')
        //  手动修改浏览器的地址栏
        history.pushState(null, '', href)
        // 通过 history.pushState 手动修改地址栏，
        // popstate 是监听不到地址栏的变化，所以此处需要手动执行回调函数 PopChange
        PopChange()
      }))
    }
    function PopChange() {
      console.log('location', location)
      switch(location.pathname) {
      case '/page1':
        routeView.innerHTML = 'page1'
        return
      case '/page2':
        routeView.innerHTML = 'page2'
        return
      default:
        routeView.innerHTML = 'page1'
        return
      }
    }
  </script>
</body>
</html>
```

> 这里注意，不能在浏览器直接打开静态文件，需要通过 web 服务，启动端口去浏览网址。默认打开的协议是 file 协议，它是不会被 `popstate` 监听的。

## 总结

认真阅读完上述内容，基本上对前端单页面的实现原理有了一个大概的雏形，更深入的学习还是需要再对框架的源码进行分析。
    