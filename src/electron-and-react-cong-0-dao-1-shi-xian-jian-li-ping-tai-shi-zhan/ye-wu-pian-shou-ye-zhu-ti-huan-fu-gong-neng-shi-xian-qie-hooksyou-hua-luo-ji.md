
# 业务篇-首页主题换肤功能实现且Hooks优化逻辑
---

## 前言

本章节将一步步带你开发主题换肤功能，如果你对本章节内容兴趣不大，可以快速阅读或跳过。

## 开发前的思考

为们先来看看效果图，当我们选择不同主题颜色时，整个应用主题跟着进行改变

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a4a25d2d572440d98989f18029a1f46~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd5c7672b50548acba2c8d6c59544de2~tplv-k3u1fbpfcp-watermark.image)

在开发之前，我们先来思考一个问题：**该换肤功能是否只局限于首页**？

很明显，并不是，举个场景，将来我进入到二级、三级页面，在该页面中也想实现主题换肤功能，那我需要先回到首页进行换肤吗？这明显是不合理的。

有小伙伴可以会想：我将相同的逻辑代码拷贝一份在目标页面，可以吗？答案是：可以的。但随之带来的问题就是：重复代码多，并且这不符合 React 的设计，**React 的最大的特性就是组件化**，组件化的目的就是为了能够进行复用，减少代码的冗余。

## MyTheme 组件

我们尝试将其抽离成公共组件，前往 `renderer/common/components` 下新增文件夹，命名为 MyTheme，我们创建 index.tsx 与 index.less

```ts
// renderer/common/components/MyTheme/index.tsx

import React from 'react';
import './index.less';

interface IProps {
  themeList: TSTheme.Item[];
  currentTheme: TSTheme.Item;
  onChangeTheme: (theme: TSTheme.Item) => void;
}

function MyTheme({ themeList = [], currentTheme, onChangeTheme }: IProps) {
  return (
    <div styleName="box">
      {themeList.length > 0 &&
        themeList.map((t: TSTheme.Item, index: number) => {
          return (
            <span
              key={index}
              style={{ backgroundColor: t.backgroundColor }}
              styleName={`${currentTheme.id === t.id ? 'active' : ''}`}
              onClick={() => {
                onChangeTheme && onChangeTheme(t);
              }}
            />
          );
        })}
    </div>
  );
}

export default MyTheme;
```

老规矩，TSTheme 会报红，我们去 `renderer/common/types` 中新增 theme.d.ts

```ts
// renderer/common/types/theme.d.ts

declare namespace TSTheme {
  export interface Item {
    /**
     * @description 唯一标识
     */
    id: string;
    /**
     * @description 字体填充颜色
     */
    fontColor: string;
    /**
     * @description 背景色
     */
    backgroundColor: string;
  }
}
```

回到上面代码，MyTheme 组件接收 3 个 Props 参数

- themeList：主题皮肤列表
- currentTheme：当前选中的皮肤
- onChangeTheme：切换皮肤回调方法

假设我们业务端要用到此组件，往往会写成以下形式：【**这是例子代码，不用在项目中写入**】

```ts
import MyTheme from './MyTheme';
import { useDispatch, useSelector } from 'react-redux';

// 这是例子代码，不要在项目中写入
function Demo() {
  const dispatch = useDispatch();
  // 👇 1. 从 Redux 中取数据
  const themeList = useSelector((state: any) => state.themeModel.themeList);
  const currentTheme = useSelector((state: any) => state.themeModel.currentTheme);

  // 👇 2. 修改 Redux 数据
  function changeTheme(theme: TSTheme.Item) {
    dispatch({
      type: 'themeModel/setStore',
      payload: {
        key: 'currentTheme',
        values: theme,
      },
    });
  }

  // 👇 3. 给组件传递数据
  return (
    <MyTheme
      themeList={themeList}
      currentTheme={currentTheme}
      onChangeTheme={changeTheme}
    />
  );
}
```

这并不是错误的使用方式，但我们需要想一想，这样写是否合理？

思考一下，这些 Props 的意义何在。对于 themeList，我们反问自己：它常变化吗？不会，在我看来，它更像是“配置”，类似于从配置表中获取主题列表。而我们每次都将一个不常变化的数据源引入，再传递给 MyTheme 组件，是否多此一举？

其次，我们的数据存放于 redux 与 file 文件中，放 redux 是为了数据实时响应，当我们切换 currentTheme 主题时，**数据驱动视图更新**。同步到 file 文件是为了防止页面刷新后，redux 数据重置使得选中的主题皮肤失效。**当然最为关键的莫过于在初次进入应用时，会从 file 中载入最后一次修改的主题**。

所以你认为这些 Props 是否设计得合理？其次还会有什么问题：将来在其他业务组件中使用 MyTheme 组件，我们得拷贝一段相同的逻辑代码（获取 Redux 数据，点击修改 Redux 数据）。

为此，我们来优化一下～

## themeModel 状态数据

进入 `renderer/store` 文件夹下，新增 themeModel.ts 文件

```ts
// renderer/store/themeModel.ts

export interface TStore {
  /**
   * @description 主题列表
   */
  themeList: TSTheme.Item[];
  /**
   * @description 当前选中的主题
   */
  currentTheme: TSTheme.Item;
}

const themeModel: TSRcReduxModel.Props<TStore> = {
  namespace: 'themeModel',
  openSeamlessImmutable: true,
  state: {
    themeList: [],
    currentTheme: {
      id: '',
      fontColor: '',
      backgroundColor: '',
    },
  },
};

export default themeModel;
```

修改 `store/index.ts`，将其引入并加入到 redux 中（其他代码略过）

```ts
// 👇 引入
import themeModel from './themeModel';
// 👇 添加
const reduxModel = new RcReduxModel([..., themeModel]);
```

至此我们已将主题换肤相关的数据状态建立起来，接下来我们通过 Hooks 来实现优化

## useThemeActionHooks

回头看，上述代码中，哪些逻辑需要进行复用？

 1.     引入 `useDispatch`、`useSelector`，目的是为了通过此 API 获取 redux 值，并且发起 dispatch 修改 redux 状态

```ts
import { useDispatch, useSelector } from 'react-redux';
```

 2.     获取 redux 主题皮肤相关数据，每个业务组件用 MyTheme 组件时都需要这么写

```ts
const themeList = useSelector((state: any) => state.themeModel.themeList);
const currentTheme = useSelector((state: any) => state.themeModel.currentTheme);
```

 3.     修改主题皮肤的方法实现，通过 dispatch 进行修改当前选中的主题皮肤

```ts
const dispatch = useDispatch();
function changeTheme(theme: TSTheme.Item) {
  dispatch({
    type: 'themeModel/setStore',
    payload: {
      key: 'currentTheme',
      values: theme,
    },
  });
}
```

我们主逻辑就这些，但假设多个业务使用 `MyTheme` 组件时，就需要写一坨相同的逻辑。为此通过 Hooks 进行抽离，从而达到复用。

自定义 Hooks 抽离状态逻辑，前往 `renderer/hooks` 文件夹下新增 `useThemeActionHooks.ts`

```ts
// renderer/hooks/useThemeActionHooks.ts
import { useDispatch, useSelector } from 'react-redux';

/**
 * @description 获取当前主题与修改组件方法
 */
function useGetCurrentTheme() {
  const changeTheme = useChangeCurrentTheme();
  const currentTheme = useSelector((state: any) => state.themeModel.currentTheme);
  return [currentTheme, changeTheme];
}

/**
 * @description 更新当前选中的主题
 * @param {TSTheme.Item} theme 目标主题
 */
function useChangeCurrentTheme() {
  const dispatch = useDispatch();
  return (theme: TSTheme.Item) => {
    dispatch({
      type: 'themeModel/setStore',
      payload: {
        key: 'currentTheme',
        values: theme,
      },
    });
  };
}

export default {
  useGetCurrentTheme,
};
```

如上所示，我们定义了一个 hook，返回的是一对值：当前状态和一个更新它的函数。当前状态是从 redux 中获取的`实时数据`，同时我们支持了更新它的函数，已通过 dispatch action 进行数据更新。

## 初始化读取配置获取主题皮肤列表

上面我们通过 `useThemeActionHooks` 能轻松实现获取当前主题并修改主题，但我们在初始化时，需要从配置文件中读取主题皮肤列表，从而进行展示，并且需要得到上一轮最后保存的主题。

我们在应用文件夹中新增 `appConfig` 配置文件，新增主题配置文件 `theme.config.json`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/46a19d279a40425c9f163eafeb470e3f~tplv-k3u1fbpfcp-watermark.image)

```json
{
  "name": "主题配置表",
  "currentTheme": { "id": "dark", "fontColor": "#ffffff", "backgroundColor": "#27292c" },
  "themeList": [
    { "id": "dark", "fontColor": "#ffffff", "backgroundColor": "#27292c" },
    { "id": "blue", "fontColor": "#ffffff", "backgroundColor": "#35495e" },
    { "id": "green", "fontColor": "#ffffff", "backgroundColor": "#416f5b" },
    { "id": "purple", "fontColor": "#ffffff", "backgroundColor": "#54546c" },
    { "id": "princess", "fontColor": "#ffffff", "backgroundColor": "#945454" }
  ]
}
```

接下来通过 fs 文件系统读取该配置表的内容，存入 Redux 中。前往 `useThemeActionHooks.ts` 文件，我们追加几个 Hooks 方法

 -    useSelectTheme：对比上一轮的选中的主题皮肤，选中当前最新的主题
 -    useInitThemeConfig：应用进入时，初始化读取主题配置文件
 -    useReadAppConfigThemeFile：**读取** appConfig 下的主题配置表文件内容
 -    useUpdateAppConfigThemeFile：**更新** appConfig 下的主题配置表文件内容

```ts
// renderer/hooks/useThemeActionHooks.ts

/**
 * @description 初始化读取主题配置文件
 */
function useInitThemeConfig() {
  const selectTheme = useSelectTheme();
  const readAppConfigThemeFile = useReadAppConfigThemeFile();
  
  return () => {
    readAppConfigThemeFile().then((value: { [key: string]: any }) => {
      selectTheme(value);
    });
  };
}
```

```ts
/**
 * @description 对比上一轮的选中的主题皮肤
 */
function useSelectTheme() {
  const dispatch = useDispatch();
  return (themeConfigValues: any) => {
    const prevTheme: string = themeConfigValues?.currentTheme || '';
    const initTheme = { id: 'dark', fontColor: '#ffffff', backgroundColor: '#27292c' };

    let nextTheme: TSTheme.Item;
    if (themeConfigValues?.themeList.length > 0) {
      if (prevTheme) nextTheme = _.find(themeConfigValues?.themeList, { id: prevTheme }) || initTheme;
      else nextTheme = themeConfigValues?.themeList[0];
    } else {
      nextTheme = initTheme;
    }
    dispatch({
      type: 'themeModel/setStoreList',
      payload: [
        {
          key: 'currentTheme',
          values: nextTheme,
        },
        {
          key: 'themeList',
          values: themeConfigValues?.themeList,
        },
      ],
    });
  };
}
```

```ts
/**
 * @description 读取配置文件的内容
 */
function useReadAppConfigThemeFile() {
  return () => {
    return new Promise((resolve: (values: { [key: string]: any }) => void, reject: (value: Error) => void) => {
      getAppPath().then((appPath: string) => {
        const jsonPath = path.join(appPath, 'appConfig/theme.config.json');
        fileAction
          .hasFile(jsonPath)
          .then(async () => {
            const themeConfigValues = await fileAction.read(jsonPath, 'utf-8');
            resolve(JSON.parse(themeConfigValues));
          })
          .catch(() => {
            reject(new Error('appConfig does not exist !'));
          });
      });
    });
  };
}
```

```ts
/**
 * @description 更新配置表中的用户设置信息
 * @param {string} updateKey 键
 * @param {any} updateValues 值
 * @param {function} callback 回调函数
 */
function useUpdateAppConfigThemeFile() {
  const readAppConfigThemeFile = useReadAppConfigThemeFile();
  return (updateKey: string, updateValues: any, callback?: () => void) => {
    getAppPath().then((appPath: string) => {
      const jsonPath = path.join(appPath, 'appConfig/theme.config.json');
      readAppConfigThemeFile().then((values: { [key: string]: any }) => {
        if (values && !!Object.keys(values).length) {
          const nextConfigContent = {
            ...values,
            [`${updateKey}`]: updateValues,
          };
          fileAction.canWrite(jsonPath).then(() => {
            fileAction.write(jsonPath, nextConfigContent, 'utf-8').then(() => {
              callback && callback();
            });
          });
        }
      });
    });
  };
}
```

由于我们使用了 lodash 的 find 方法，所以记得安装一下 lodash

```bash
npm install --save-dev lodash
npm install --save-dev @types/lodash
```

为此，我们通过 Hooks ，将复杂的工作交给它去完成。

接下来看看我们的 MyTheme 组件将会变成什么样子

## 改造后的 MyTheme 组件

我们前往修改 MyTheme 组件下的代码，更改为：

```ts
import React from 'react';
import './index.less';
import { useSelector } from 'react-redux';
// 👇 引入该 hooks
import useThemeActionHooks from '@src/hooks/useThemeActionHooks';

function MyTheme() {
  const themeList = useSelector((state: any) => state.themeModel.themeList);
  // 👇 通过这个 Hooks 得到的是一对值：当前状态和一个更新它的函数
  const [currentTheme, setCurrentTheme] = useThemeActionHooks.useGetCurrentTheme();

  return (
    <div styleName="box">
      {themeList &&
        themeList.length > 0 &&
        [...themeList].map((t: TSTheme.Item, index: number) => {
          return (
            <span
              key={index}
              style={{ backgroundColor: t.backgroundColor }}
              styleName={`${currentTheme.id === t.id ? 'active' : ''}`}
              onClick={() => {
                setCurrentTheme && setCurrentTheme(t, true);
              }}
            />
          );
        })}
    </div>
  );
}

export default MyTheme;
```

那么在业务组件该如何使用此组件呢？前往应用首页，引入此组件使用

```ts
// renderer/container/root/index.tsx

// 👇  引入此组件
import MyTheme from '@common/components/MyTheme';
// 👇 引入此Hook
import useThemeActionHooks from '@src/hooks/useThemeActionHooks';


function Root() {
  const [currentTheme] = useThemeActionHooks.useGetCurrentTheme();

  return (
    <div styleName="root" style={{ backgroundColor: currentTheme?.backgroundColor }}>
      <div styleName="container">
        {/* 👇 直接使用即可 */}
        <div styleName="theme">
          <MyTheme />
        </div>
      </div>
    </div>
  );
}
export default Root;
```

当然我们也需要在应用刚启动时，就读取配置进行赋值，并且需要读到应用上次退出时，最后的主题皮肤。所以我们前往路由组件 router.tsx 的 didMount 生命周期中执行初始化的相关工作。

```ts
// renderer/router.tsx

import useThemeActionHooks from './hooks/useThemeActionHooks';

function Router() {
  const initThemeConfig = useThemeActionHooks.useInitThemeConfig();
  
  // 👇 进行初始化工作
  useEffect(() => {
    // ...
    initThemeConfig();
  }, []);

  // 后面代码忽略
}
export default Router;
```

刷新一下页面，就可以看到换肤效果了。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa8402699abe4563ac1c618d14222ceb~tplv-k3u1fbpfcp-watermark.image)

接下来，我们只需要给换肤的组件引入 `useThemeActionHooks`，然后动态绑定一下 style 即可。

## 总结

本章节主要通过动态绑定 style 方式进行简单的换肤功能，一开始通过抽离组件，再到组件 Props 属性的思考，结合其他业务模块之后可能也会用到此组件，在使用上会出现较多重复工作，进而采用 Hooks 进行优化。

本章节最为重要的在于 useThemeActionHooks 的封装，小伙伴们一定要结合[线上代码](https://github.com/PDKSophia/visResumeMook/tree/chapter-16)进行配套学习。

**如果您在边阅读边实践时，发现代码报错或者 TS 报错，那么小伙伴们可以根据报错信息，去线上看看相应的代码。**

> 可能有小伙伴认为这不算主题换肤。其实这算最简单的换肤方式，如 AntDesign 的换肤效果，主要原理是通过 less-loader 实现的，阿宽之前也在项目组的UI库中实现过换肤效果，具体可看此文章：[【KT】sugard自定义主题皮肤实践踩坑总结](https://juejin.cn/post/6912061407961808903)

本章节的代码量相对较大，如果对本章节存在疑问，欢迎在评论区留言。
    