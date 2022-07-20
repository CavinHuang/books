
# Server 端编译实现
---

# Server 端编译实现

大部分的可视化搭建体系中，并没有涉及到编译这一块的内容，因为所有的数据都是存储在云端，当页面加载的时候再根据 id 来请求云端存储的数据，所以大致流程是这样的：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d9a9e423a8e4982afc937e6ed5aede0~tplv-k3u1fbpfcp-watermark.image)

这样看似没有任何问题，但是当数据全部存储在服务端时，势必会带来以下影响：

1.  用户体验问题，每次打开页面都会发起数据请求来获取页面配置数据，在这之前，页面必然是白屏状态。
2.  增加服务端压力，对于大促类型的活动，`QPS` 是必须要考虑的点，如果 `QPS` 过大则会影响服务端的负载。
3.  额外的数据维护成本。

那么如何来解决这样的问题，就是本章需要探讨的内容

## server 端编译

首先我们是可以知道模板的仓库信息，其次我们也知页面的配置的数据信息，那么是否有可能将模板动态的进行编译，在进行产出？答案是肯定的，接下来我们来介绍几种实现方式。

#### 方式一：动态实时构建编译

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7525519310ab4802803ad2483e9486f3~tplv-k3u1fbpfcp-watermark.image)

这种模式下，当后台提交渲染请求的时候，我们的 node 服务所做的工作主要是：

1.  拉取对应模板
2.  渲染数据
3.  编译

拉取也就是去指定模板仓库中通过 [download-git-repo](https://www.npmjs.com/package/download-git-repo) 插件进行拉取模板。编译其实也就是通过 [metalsmith](https://github.com/segmentio/metalsmith) 静态模板生成器把模板作为输入，数据作为填充，按照 [handlebars](https://handlebarsjs.com/) 的语法进行规则渲染。最后产出build构建好的目录。在这一步，我们之前所需的组件，会被渲染进 `package.json` 文件。我们来看一下核心代码：

```javascript
// 这里就像一个管道，以数据入口为生成源，通过renderTemplateFiles编译产出到目标目录
function build(data, temp_dest, source, dest, cb) {
  let metalsmith = Metalsmith(temp_dest)
    .use(renderTemplateFiles(data))
    .source(source)
    .destination(dest)
    .clean(false)

  return metalsmith.build((error, files) => {
    if (error) console.log(error);
    let f = Object.keys(files)
      .filter(o => fs.existsSync(path.join(dest, o)))
      .map(o => path.join(dest, o))
    cb(error, f)
  })
}


function renderTemplateFiles(data) {
  return function (files) {
    Object.keys(files).forEach((fileName) => {
      let file = files[fileName]
      // 渲染方法
      file.contents = Handlebars.compile(file.contents.toString())(data)
    })
  }
}
```

最后我们得到的是一个 `Vue` 或者 `React` 项目，此时还不能直接跑在浏览器端，这里就涉及到当前发布系统所支持的形式了。怎么说？如果你的公司发布系统需要在线编译，那么你可以把源文件直接上传到 git 仓库，触发仓库的 WebHook/CICD 让发布系统替你发掉这个项目即可。如果你们的发布系统是需要你编译后提交编译文件进行发布的，那么你可以通过 node 命令，进行本地构建，产出 HTML，CSS，JS，直接提交给发布系统即可。

这种实现方式可以参考我之前写的 [node server](https://github.com/roooses/rose-server)

这种方式最大的弊端就在于编译发布周期长，有的时候为了安全稳定，我们可能会设计多套环境发布，每个环境都需要走这样的流程，体验太差。其次，我们相当于间接篡改了用户模板的代码，可能会造成不可控的风险。那么有没有其他的方式呢？

## 方式二：动态非实时编译

前面提到的弊端主要是发布时间长，以及间接篡改了用户代码。我们先抛开这2个问题不谈，先来想想为什么我们要设计server 端的编译，前面已经回答了是因为我们需要把数据打入页面内，减少这个数据请求。再结合发布时间长是因为需要动态编译的问题，我们是否可以将数据动态注入编译后的静态文件？ 当然可以，因为 `nodejs` 本身就可以操作文件系统，好了，我们可以可以在模板中给个标志，来告诉 `server` 端将数据注入到哪里：

```html
<script data-inject>
  window.__coco_config__ = { components: [] };
</script>
```

对于全局组件来说，我们也可以提前将js 和 css 进行注入：

```html
<!-- remote-script-inject-start -->
<!-- remote-script-inject-end -->
```

所以 server 端的代码就可以简化成这样：

```javascript
// 注入数据
const res = fs.readFileSync(`${temp_dest}/dist/index.html`, 'utf-8');
let target = res.replace(
  /(?<=<script data-inject>).*?(?=<\/script>)/,
  `window.__coco_config__= ${JSON.stringify({
    ...data,
    components: data.userSelectComponents,
    pageData: data.config,
  })}`
);
// 修改title
target = target.replace(/(?<=<title>).*?(?=<\/title>)/, data.config.projectName);
// ...
// 远程组件注入
target = target.replace(
  /(?<=<!-- remote-script-inject-start -->).*?(?=<!-- remote-script-inject-end -->)/,
  cssStyle + jsScripts
);
// 文件写入，编译完成
fs.writeFileSync(`${temp_dest}/dist/index.html`, target);
```

这样我们将所有的编辑数据和全局组件数据全部注入到了 `window.__coco_config__` 属性上，这样模板就不用再远程请求 `server` 端数据，也不用再走 `server` 端实时编译了。

## 总结

本章我们主要介绍了 `server` 端如何实现对模板和数据的组装能力，下一章节，我们继续介绍，组装完成后，编辑器如何对页面进行发布动作。
    