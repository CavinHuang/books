
# 进阶篇 8-运行时揭秘 - RN 运行时 
---

# 运行时揭秘 - RN 运行时

> Expo is a set of tools, libraries and services which let you build native iOS and Android apps by writing JavaScript.

Taro RN 端的开发基于开源项目 [Expo](https://expo.io/)。Expo 是一组工具、库和服务，基于 React Native 可让你通过编写 JavaScript 来构建原生 iOS 和 Android 应用程序。

### 为什么选择 Expo？

从某种程度上而言，目前为止 RN 只是给拥有 Mac 电脑的开发者提供了跨平台开发的能力， 因为现在还不能使用 Windows 创建 iOS 的 RN 应用。还有一个比较普遍的问题是，有一些 iOS 程序员不会配置 Android 的编译环境，而一些 Android 程序员又搞不懂 XCode。而且，Taro 的使用者基本都是前端工程师，面对 iOS 和 Android 原生的库或者文件可能会不知所措。

我们希望 Taro 的使用者，即使完全没有 RN 开发经验，也能够 5分钟实现 Hello Wolrd 的编写，并且只需要专注于基于 Taro 实现功能，不用再去配置烦人的 iOS、Android 编译环境，还可以用 Windows 开发 iOS 版的 RN 应用。

本质上，Expo 相当于一个壳，你只需关注 JS 层面的开发即可。这点类似于 Electron 或者小程序。

![imgae](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/8/166515cbb3f3dbad~tplv-t2oaga2asx-image.image)

### 开发流程

当你运行 `taro build` 的 RN 端编译命令之后，Taro 命令开始编译工程。编译完成后，Taro 工程的代码将会被编译成到 `.rn_temp`目录下。

接下来，你可以直接在终端输入对应的字母，来进行对应的操作，如果你选择使用模拟器，模拟器及其安装的 Expo 客户端将自动启动（如果已成功安装），然后加载应用；如果你使用真机，你只需要使用 Expo 应用扫描二维码就可以打开你编写的 RN 应用了。并且只要应用在 Expo 中打开过一次，就会在 App 中保留一个入口。在这里，Expo 客户端相当于一个浏览器，可以访问到你开发的应用。

因此，开发流程其实主要分为两步：**项目编译**、**启动 Expo 服务**。下面我们详细讲解这两步。

> 详细的开发流程，可以查看 Taro 官方文档 [React Native 开发教程](https://nervjs.github.io/taro/docs/react-native.html)

### 项目编译

下面是一个最简单的 index 页面的转换：

![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/8/166515cc0e652c1a~tplv-t2oaga2asx-image.image)

我们可以看到，由于 Taro 工程的代码转 RN 工程代码，在 JS 编译范畴，本质上还是 `JSX \-> JSX`，所以并没有编译成小程序那么复杂。我们主要得考虑的是：

1.  `View` ,`Text` 等组件，怎样和小程序的用法及特性保持一致？
2.  样式由 `CSS -> StyleSheet` ，怎样实现？

这些问题我们将在接下来的部分会一一解答。

### 启动 Expo 服务

在编译完之后，如果你选择使用模拟器来进行开发调试，Taro 会调用 `@tarojs/rn-runner` 包启动 `packager`，`@tarojs/rn-runner` 基于 [create-react-native-app](https://github.com/react-community/create-react-native-app/tree/master/react-native-scripts) 进行了定制，主要是实现以下功能：

1.  启动 iOS / Android 模拟器及模拟器中安装的 Expo 客户端
2.  启动本地服务器，供模拟器中的 Expo 客户端访问，加载应用资源
3.  `Building JavaScript bundle`，也就是所谓的打包

有兴趣的可以直接看一下 `@tarojs/rn-runner` 包，代码量不多，结构还是挺清晰的。

这里可能有人会有疑问：在代码编译完成，生成工程目录 `.rn_temp`后，Expo 是怎样与入口文件 App.js 结合起来的呢？

答案就在 `bin/crna_entry.js` 里面，你可以在 `.rn_temp/package.json` 里面看到如下配置：

```
"main": "./bin/crna-entry.js",
```

也就是说，crna\_entry.js 是整个工程的入口文件。该文件的代码不多，只有短短几行，大家一看便知：

```
import Expo from 'expo';
import App from '../../../../App';
import React, { Component } from 'react';
import { View } from 'react-native';

if (process.env.NODE_ENV === 'development') {
  Expo.KeepAwake.activate();
}

Expo.registerRootComponent(App);
```

就这样，Expo 获取到了工程的入口，既可以开始愉快的 `Building JavaScript bundle` 了。

## 组件

Taro 以 [微信小程序组件库](https://developers.weixin.qq.com/miniprogram/dev/component/) 为标准，结合 JSX 语法规范，定制了一套自己的组件库规范。

幸运的是，在 React Native 端，也有自己的组件库，而且命名、功能和小程序的组件都极其类似。因此，我们只需要按照小程序的规范，基于 React Native 的组件库实现一套中间层组件库，实现功能，抹平其中的差异即可。

通过上面的代码可以看到，代码转换后，组件的引入变成：`import { View, Text } from "@tarojs/components-rn";`。感兴趣的可以查看一下 [taro-components-rn](https://github.com/NervJS/taro/tree/master/packages/taro-components-rn) 代码，还是比较易懂的。

但是尽管如此，由于小程序和 React Native 组件的差异，还是有一些特性无法完全实现，比如 View 组件的 `hover-start-time`，`hover-stay-time`。在组件的详细文档中列出了组件在不同端的支持程度，以及基本的使用示例。 部分未列出示例的，标明仅在小程序端支持的组件的用法可以直接参考[小程序组件文档](https://developers.weixin.qq.com/miniprogram/dev/component/)。

## 样式

React Native 的样式基于开源的跨平台布局引擎 [Yaga](https://github.com/facebook/yoga) ，样式基本上是实现了 CSS 的一个子集，但是属性名不完全一致，具体的内容及相关差异可以查看文档 [React Native Layout Props](https://facebook.github.io/react-native/docs/layout-props)。Taro 在 React Native 端样式文件的处理，主要可以分为以下几步：

![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/8/166515cbaf816829~tplv-t2oaga2asx-image.image)

上图的所有步骤中，最复杂的一步就是 `CSS to StyleSheet`，此外，我们还要将 JSX 语法中的 className 转换为 React Native 的 style ，因此，Taro React Native 样式支持的关键的步骤如下：

1.  `CSS to StyleSheet`：将 Scss/Less/CSS 文件转换为 React Native StyleSheet 的 JS 文件
2.  `className to style`：将 JSX 语法中的 className 转换为 React Native 的 style

### CSS to StyleSheet

我们首先使用于处理器将 `Scss/Less` 样式文件转换为 CSS， 这里我们借助于 [css-to-react-native-transform](https://github.com/kristerkari/css-to-react-native-transform) 实现。[css-to-react-native-transform](https://github.com/kristerkari/css-to-react-native-transform) 是 [css-to-react-native](https://github.com/styled-components/css-to-react-native) 的一个轻量级的封装，用于将 CSS 样式转换为 `React Native Stylesheet objects`。

下面的样式代码：

```
.myClass {
  font-size: 18px;
  line-height: 24px;
  color: red;
}

.other {
  padding: 1rem;
}
```

将被转换为：

```
{
  myClass: {
    fontSize: 18,
    lineHeight: 24,
    color: "red"
  },
  other: {
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16
  }
}
```

同时，为了保证样式开发的友好度，我们还实现了 StyleSheet 的错误校验，如果你写的样式 RN 不支持，会在编译时在终端报错。

### className to style

这一步的实现可不仅仅是单纯的将 JSX 里面的 className 直接替换为 style，还要将引入的 Scss/Less/CSS 替换 Stylesheet 的 JS 文件。此外，className 可不仅仅支持字符串的写法，还支持各种复杂的表达式（如三目运算符、classnames\( \) 等），这些情况统统都要考虑到。因此，我们专门实现了一个 Babel 插件来处理这一块的转换：[babel-plugin-transform-jsx-to-stylesheet](https://github.com/NervJS/taro/blob/master/packages/babel-plugin-transform-jsx-to-stylesheet)，有兴趣的可以看一下源码。

## 路由

路由是应用的核心之一，承担着重要的功能，同时对于用户体验至关重要。

在 React Native 端编译中，我们需要读取页面入口组件中 config 里面的 pages 配置（路由配置），然后在 React Native 端实现路由功能。由于路由功能的实现十分繁琐复杂，需要考虑的细节很多，甚至还涉及到不同端的交互差异，所以自己实现一套成熟的路由功能相当困难。因此，我们需要基于一个成熟稳定的 React Native 路由库来实现这一系列的功能。在经过层层技术选型后，我们最终还是选择了 [React Navigation](https://github.com/react-navigation/react-navigation) 。

### 为什么选择 React Navigation

> Learn once, navigate anywhere.

[React Navigation](https://github.com/react-navigation/react-navigation) 的诞生，源于 React Native 社区对基于 Javascript 可扩展且使用简单的导航解决方案的需求。

React Navigation 是 Facebook，Expo 和 React 社区的开发者们合作的结果：它取代并改进了 React Native 生态系统中的多个导航库，其中包括 Ex-Navigation，React Native 的 Navigator 和 NavigationExperimental 组件。

我们最终选择 React Navigation ，主要是基于以下考虑：

- 功能齐全：以上几点功能全部都能良好实现，并且比小程序现有的功能更加丰富，细节考虑更加全面，方便以后的拓展。
- 用法类似：和小程序一样，路由及相关功能基本都是通过配置实现，业务耦合度低，代码编译方面工作量少。
- 方案成熟：充分考虑到 Android 和 iOS 的差异，体验流畅，交互良好，文档全面。
- 社区强大：GitHub Star 1.3W+ ，强大的社区背书，快速的迭代。

### 路由配置转换

在 Taro 工程中，配置方式与规则和小程序中保持一致，只不过 pages 配置放到了 App.js 的 config 属性中。

```
{
  "pages":[
    "pages/index/index",
    "pages/logs/logs"
  ]
}
```

我们需要读取 config 配置的内容，然后转换成 React Navigation 的配置。如果是直接通过编译来转换的话，工作量太大，因此在编译阶段，主要是解析 pages 配置内容，获取每个页面的 URL 及对应的入口文件，然后传入 `@tarojs/taro-router-rn` 中的 `Taro.initRouter` 方法中处理。

pages 配置内容：

```
config = {
    pages: [
      'pages/index/index',
      'pages/hello/hello'
      ]
    }  
```

路由解析并转换后，主要结构如下：

```
import pagesHelloHello from './pages/hello/hello';
import pagesIndexIndex from './pages/index/index';

...
  render() {
    return <RootStack />;
  }
...

const RootStack = TaroRouter.initRouter([['pages/index/index', pagesIndexIndex], ['pages/hello/hello', pagesHelloHello], Taro, App.config);

```

那么 `Taro.initRouter` 方法里面做了什么呢？主要是调用 React Navigation 的 `createStackNavigator` 方法，然后返回对应的 RootStack。感兴趣的，可以查看 [createStackNavigator API 文档](https://reactnavigation.org/docs/en/stack-navigator.html)

```
function getRootStack ({pageList, Taro, navigationOptions}) {
  let RouteConfigs = {}
  pageList.forEach(v => {
    const pageKey = v[0]
    const Screen = v[1]
    RouteConfigs[pageKey] = getWrappedScreen(Screen, Taro, {enablePullDownRefresh: navigationOptions.enablePullDownRefresh})
  })
  return createStackNavigator(RouteConfigs, {
    navigationOptions: Object.assign({}, defaultNavigationOptions, navigationOptions)
  })
}
```

### Taro 路由方法的挂载

在 React Navigation 中，路由的方法与小程序基本一一对应：

- Taro.navigateTo\(OBJECT\) => this.props.navigation.push\(\)
- Taro.redirectTo\(OBJECT\) => this.props.navigation.replace\(\)
- Taro.switchTab\(OBJECT\) => this.props.navigation.navigate\(\)
- Taro.navigateBack\(OBJECT\) => this.props.navigation.goBack\(\)

只需要在参数方面做一些小小的转换，就可以实现和小程序一致的功能。不过，关键是怎样在合适的时机优雅的挂载到 Taro 上去。

这里主要是在 getRootStack 方法中，通过 `getWrappedScreen()` 方法实现。getWrappedScreen 是一个 React 高阶组件，将页面的入口作为参数传进去，该方法会进行一系列的包裹和处理，将路由方法挂载到 Taro 上，有兴趣的可以自行查看源码。

### NavigationBar

NavigationBar，也就是导航栏。在小程序中，导航栏既可以在 `app.json` 的 Window 字段中进行全局配置，也可以在每一个小程序页面中使用 .json 文件来表现进行配置。其中页面的配置只能设置 app.json 中部分 Window 配置项的内容，页面中配置项会覆盖 app.json 的 Window 中相同的配置项。

在 React Navigation 中，NavigationBar 的实现非常简单，只需在 [createStackNavigator](https://reactnavigation.org/docs/zh-Hans/stack-navigator.html) 方法中配置 navigationOptions 属性即可。

```
    navigationOptions: {
      "headerStyle": {
        "backgroundColor": "black"
      },
      "title": "WeChat",
      "headerTintColor": "white"
    }
```

这样看着是不是感觉和小程序的导航栏配置很类似？因此，只需要在编译过程中，提取 config 里面 NavigationBar 相关的配置，然后转换成 React Navigation 规范，最后传入 createStackNavigator 方法就行了。

核心代码如下，其中 defaultNavigationOptions 表示默认的头部样式。

```
// 页面默认头部样式
const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: 'grey'
  },
  headerTintColor: 'black'
}

....

  return createStackNavigator(RouteConfigs, {
    navigationOptions: Object.assign({}, defaultNavigationOptions, navigationOptions)
  })
```

当然，仅仅是考虑这些是远远不够的，你还需要考虑：app.json 里面配置全局的 NavigationBar ；页面入口里面的配置与全局配置优先级问题等。

### TabBar

TabBar 表示底部 Tab 栏的表现。如果小程序是一个多 Tab 应用（客户端窗口的底部或顶部有 Tab 栏可以切换页面），可以通过 TabBar 配置项指定 Tab 栏的表现，以及 Tab 切换时显示的对应页面。

React Navigation 提供了 [createBottomTabNavigator](https://reactnavigation.org/docs/zh-Hans/bottom-tab-navigator.html) 方法来实现 TabBar 功能，其中 BottomTabNavigatorConfig 配置极其丰富，可以进行各种拓展。

```
createBottomTabNavigator(RouteConfigs, BottomTabNavigatorConfig);
```

因此，只需要在编译过程中，提取 config 里面 TabBar 相关的配置，然后转换成 React Navigation 规范，最后传入 createBottomTabNavigator 方法就行了。

核心代码如下：

```
    return createBottomTabNavigator(RouteConfigs, {
      navigationOptions: ({navigation}) => ({
        tabBarIcon: ({focused, tintColor}) => {
          const {routeName} = navigation.state
          const iconConfig = tabBar.list.find(item => item.pagePath === routeName)
          return (
            <Image
              style={{width: 30, height: 30}}
              source={focused ? iconConfig.selectedIconPath : iconConfig.iconPath}
            />
          )
        },
        tabBarLabel: tabBar.list.find(item => item.pagePath === navigation.state.routeName).text,
        tabBarVisible: navigation.state.index === 0 // 第一级不显示 tabBar
      }),
      tabBarOptions: {
        backBehavior: 'none',
        activeTintColor: tabBar.selectedColor || '#3cc51f',
        inactiveTintColor: tabBar.color || '#7A7E83',
        activeBackgroundColor: tabBar.backgroundColor || '#ffffff',
        inactiveBackgroundColor: tabBar.backgroundColor || '#ffffff',
        style: {
          borderColor: tabBar.borderTopColor || '#c6c6c6'
        }
      }
    })
```

## 小结

通过上面的内容，相信大家都已经清楚的了解 Taro React Native 端运行时的原理及组件、样式、路由等核心部分的实现，有兴趣的同学，可以对照着文章捋一遍，相信会有更深刻的理解。
    