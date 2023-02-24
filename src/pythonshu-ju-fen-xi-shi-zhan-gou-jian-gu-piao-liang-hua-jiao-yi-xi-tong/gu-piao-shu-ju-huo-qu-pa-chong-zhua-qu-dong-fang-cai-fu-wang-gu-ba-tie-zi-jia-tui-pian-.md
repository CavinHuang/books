
# 股票数据获取-爬虫抓取东方财富网股吧帖子【加推篇】
---

# 加推篇！爬虫抓取东方财富网股吧帖子

## 前言

量化交易策略的研究主要涵盖了微观和宏观这两个方面，微观方面更多地是从市场价格和成交持仓这些基础信息为研究对象，通过算法计算出技术指标，再从技术指标的变化上构建交易模型。宏观方面则是基于更多的市场资讯开发交易模型，比如从CPI、PPI、货币发行量这些宏观经济指标为研究对象构建交易模型；或者是利用数据挖掘技术从新闻事件中挖掘出可能造成市场异常波动的事件，从而获得交易的时机。

我们知道知名股票论坛有点金投资家园、股天下、东方财富网股吧、和讯股吧、创幻论坛、MACD股市等等，笔者用的比较多的是东方财富网股吧。在小册子中我们以爬取东方财富网行业板块当日的行情数据为案例，介绍了网络爬虫的原理和方法，本节我们再介绍下如何爬取东方财富网股吧帖子的内容。

## 解析股吧帖子URL

首先通过浏览器访问伟星新材的股吧，查看该网页的URL为：`http://guba.eastmoney.com/list,002372.html`，网页内容如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/14/17041be4042e86ce~tplv-t2oaga2asx-image.image)

当我们点击第2页、第3页后，查看下当前的URL分别为：`http://guba.eastmoney.com/list,002372_2.html`，`http://guba.eastmoney.com/list,002372_3.html`，因此得到了个股股吧URL的规律为`http://guba.eastmoney.com/list, 002372_%d.html`形式表示，其中的规律比较直白，\%d为论坛第几页，不过这个形式是按评论时间排列的网址，如果按发帖时间的排列网址是`http://guba.eastmoney.com/list,002372,f_%d.html`。

股吧的帖子由两部分组成，一部分为“财经评论”或“东方财富网”发布的公告或官方消息，另一部分为散户发布的讨论帖子，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/14/17041bf6034f178d~tplv-t2oaga2asx-image.image)

前者的帖子URL为`http://guba.eastmoney.com/news,cjpl,902659513.html`，后者的帖子URL为`http://guba.eastmoney.com/news,002372,902629178.html`，两者的URL都可在当前该股股吧HTML文件内容中搜寻到，如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/14/17041c06a1560e94~tplv-t2oaga2asx-image.image)

因此“财经评论”、“东方财富网”或者散户发布的帖子，主要的特征为/news，在实现上我们可以先爬取到股吧HTML内容，然后通过正则表达式来筛选得到帖子的URL。

关于读取网页HTML内容的关键代码我们已经在小册子《爬虫方式获取行业板块数据》一节中具体介绍过。需要注意的是Python2的urllib、urllib2和urlparse，已经在Python3中全部被整合到了urllib中，其中Python2的urllib和urllib2中的内容整合为urllib.request模块，urlparse整合为urllib.parse模块。 获取到HTML代码部分内容如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/14/17041c0e2464f862~tplv-t2oaga2asx-image.image)

正则表达式筛选帖子URL，采用了re.compile和re.findall，实现代码如下，

```
pattern = re.compile('/news\S+html',re.S)
news_comment_urls = re.findall(pattern, html_cont.decode('utf-8')) # 非空白字符N次

"""
['/news,cjpl,902659513.html', '/news,cjpl,902684967.html', 
'/news,cjpl,902602349.html', '/news,cjpl,902529812.html', 
'/news,cjpl,857016161.html', '/news,002372,902629178.html', 
'/news,002372,902557935.html', '/news,002372,902533930.html', 
'/news,002372,902519348.html', '/news,002372,902468635.html', 
'/news,002372,902466626.html', '/news,002372,902464127.html', 
 ......
'/news,002372,901168702.html', '/news,002372,901153848.html']
"""
```

其中正则表达式的\\S+表示匹配多次非空白字符，然后使用findall函数找到匹配的所有字符串，并把它们作为一个列表返回。

然后是使用urljoin方法把整个url拼接好用于爬取单个帖子的标题内容，关键代码如下所示：

```
for comment_url in news_comment_urls :
     whole_url = parse.urljoin(page_url, comment_url)
     post_urls.add(whole_url)
return post_urls
```

## 创建爬虫URL队列

接下来我们把所有需要爬取的股吧页以及每页中的帖子的URL以队列的方式进行管理。Python中存储序列的类型有list、tuple、dict和set，它们之间的区别和特点简单的说：tuple不能修改其中的元素；set是无序集合，会自动去除重复元素；list是有序的集合；dict是一组key和value的组合。此次我们选择list作为队列的存储类型。

创建target\_url\_manager类，该类包含以下几个方法：

- add\_page\_urls：解析股吧单页的HTML代码，获得该页的帖子URL

- add\_pages\_urls：构建队列，讲全部页的帖子URL建立为二维list格式

- has\_page\_url：判断队列是否为空

- get\_new\_url：每次推出一页的帖子URL

创建队列形式如下所示：

```
"""
[['http://guba.eastmoney.com/news,002372,899860502.html',
  'http://guba.eastmoney.com/news,002372,899832598.html',
   ......
  'http://guba.eastmoney.com/news,002372,899947046.html',
  'http://guba.eastmoney.com/news,002372,899897958.html'],
 ['http://guba.eastmoney.com/news,cjpl,903685653.html', 
  'http://guba.eastmoney.com/news,cjpl,903679057.html',
   ......
  'http://guba.eastmoney.com/news,002372,901739862.html',
  'http://guba.eastmoney.com/news,002372,901727241.html']]
['http://guba.eastmoney.com/news,cjpl,903685653.html', 
 'http://guba.eastmoney.com/news,cjpl,903679057.html',
  ......
 'http://guba.eastmoney.com/news,002372,901739862.html',
 'http://guba.eastmoney.com/news,002372,901727241.html']
"""
```

完整代码如下所示：

```
class target_url_manager(object):

    def __init__(self, st_url):

        self.target_urls = list() # 创建队列
        self.store_urls = list()
        self.general_url = st_url

    def add_page_urls(self,i):

        item_urls = list()
        html_cont = request.urlopen(self.general_url + 'f_%d.html'%i).read().decode('utf-8')
        pattern = re.compile('/news\S+html', re.S)
        news_comment_urls = re.findall(pattern, html_cont)  # 非空白字符N次
        for comment_url in news_comment_urls:
            whole_url = parse.urljoin(self.general_url, comment_url)
            item_urls.append(whole_url)
        return item_urls

    def add_pages_urls(self,n): # 网页数量
        for i in range(1,n+1):
            self.target_urls.append(self.add_page_urls(i)) # 增加列表成员
        self.target_urls.reverse()
        return
        
    def has_page_url(self):
        return len(self.target_urls)!=0
    
    def get_new_url(self):
        next_url = self.target_urls.pop() # 去除列表成员
        self.store_urls.append(next_url)
        print(next_url)
        return next_url

```

## 解析股吧帖子内容

单个帖子爬取的内容包括三部分，帖子发表时间、作者及帖子标题，如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/14/17041c3df742a4fe~tplv-t2oaga2asx-image.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/14/17041c40dd2fdcf5~tplv-t2oaga2asx-image.image)

我们可以通过正则表达式进行提取，其中在组合正则表达式时，需要考虑到HTML代码中是否有重复的匹配关键字。作者和帖子标题正则代码如下，mainbody、zwcontentmain这些关键字在文本中仅出现一次，匹配程度较高。由于网站HTML代码的改动，表达式需要经常调整。

关键代码如下所示：

```
com_cont = re.compile(r'<div id="mainbody">.*?zwconttbn.*?<a.*?<font>(.*?)</font>.*?<div.*?class="zwcontentmain.*?">.*?"zwconttbt">(.*?)</div>.*?social clearfix',re.DOTALL)
```

发布时间正则代码如下，分两步逐渐明晰的去提取时间，由于search是扫描字符串找到这个 RE 匹配的位置，因此增加group\(\)返回匹配字符串。

```
pub_elems = re.search('<div class="zwfbtime">.*?</div>',html_cont2).group()
#<div class="zwfbtime">发表于 2020-02-11 09:54:48 东方财富Android版</div>
pub_time = re.search('\d\d\d\d-\d\d-\d\d',pub_elems).group()
#2020-02-06
```

另外，论坛帖子与当前的股价走势有时间联系，太早的帖子对现在无参考作用，因此需要删选近期的帖子。我们可以对时间进行判断，只有一个月之内发布的帖子才进行爬取并存储。获取今天的日期使用datetime.now\(\).date\(\)，然后与爬取的帖子时间日期比较，timedelta可在日期上做天days时间计算，但需要将时间转换为时间形式。

实现部分关键代码如下所示：

```
time_start=datetime.now().date() # 获取日期信息
dt = datetime.strptime(pub_time,"%Y-%m-%d") # 字符串转时间格式
datetime.date(dt)+timedelta(days=30)
```

完成了单个帖子的内容爬取之后，我们采用迭代方法把全部帖子爬取一遍。我们通过两层迭代方法，第一层为页数，第二层为一页的股吧帖子数，将每个帖子的URL存储在列表中，通过迭代的方式一个个爬取帖子的内容。

实现部分关键代码如下：

```
while self.target_page.has_page_url():
     new_urls = self.target_page.get_new_url() # 获取每个帖子的URL地址队列
     for url in new_urls:
		……
```

当我们爬取时发现某个帖子不存在，出现爬取信息异常时，可使用try...except...进行异常处理。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/14/17041c52884536cc~tplv-t2oaga2asx-image.image)

最终爬取到的帖子内容如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/14/17041c5a8725e2a8~tplv-t2oaga2asx-image.image)

完整代码如下所示：

```
class html_cont_analy(object):

    def download(self,url):
        html_cont1 = request.urlopen(url).read().decode('utf-8')
        com_cont = re.compile(r'<div id="mainbody">.*?zwconttbn.*?<a.*?<font>(.*?)</font>.*?<div.*?class="zwcontentmain.*?">.*?"zwconttbt">(.*?)</div>.*?social clearfix',re.DOTALL)

        try:
            #cont=com_cont.search(html_cont1).group()
            conts = re.findall(com_cont, html_cont1)
            for item in conts:
                if (item[0]!=u"财经评论") and (item[0]!=u"东方财富网"):
                    return u"散户ID-"+item[0] + item[1] + "\n"
                else:
                    return u"官方-"+item[0] + item[1] + "\n"
        except Exception as e:
            print("NO HTML")
            return "NO HTML"
       
    def find_time(self,url):
        html_cont2 = request.urlopen(url).read().decode('utf-8')
        pub_elems = re.search('<div class="zwfbtime">.*?</div>',html_cont2).group()
        try:
            pub_time = re.search('\d\d\d\d-\d\d-\d\d',pub_elems).group()
            dt = datetime.strptime(pub_time,"%Y-%m-%d") # 字符串转时间格式
            return datetime.date(dt)
        except Exception as e:
            print("NO HTML")
            return datetime.now().date()+timedelta(days=1)

class crawer_task(object):
    def __init__(self):
        self.target_page = target_url_manager('http://guba.eastmoney.com/list,002372,')
        self.downloader = html_cont_analy()
        self.outputer = output_txt()

    def apply_run(self, sumpage):
        file_txt = self.outputer.open_txt()
        error_time = 0
        true_time = 0
        time_start=datetime.now().date() # 获取日期信息
        self.target_page.add_pages_urls(sumpage) # 获取论坛网页URL地址队列

        while self.target_page.has_page_url():
             new_urls = self.target_page.get_new_url() # 获取每个帖子的URL地址队列
             for url in new_urls:
                if time_start <= (self.downloader.find_time(url)+timedelta(days=30)):
                   self.outputer.out_txt(file_txt, self.downloader.download(url))
                   true_time = true_time + 1
                else:
                   error_time = error_time + 1
                   if error_time >= 10: break
        print('%s has a sum of %d comments'%(time_start ,true_time))
        self.outputer.close_txt(file_txt)
        return
        
if __name__=='__main__':
    sumpage=3
    obj_crawer=crawer_task()
    obj_crawer.apply_run(sumpage)        
```

## 帖子内容存储为txt

我们可以将爬取信息写到txt文件中，打开方式的代码实现如下所示，a+为在文本尾部追加写入，而不是覆盖写入，codecs.open这个方法可以指定编码打开文件，而使用Python内置的open打开文件只能写入str类型。

```
f=codecs.open(name,'a+','utf-8')
```

此处我们创建一个output\_txt类，该类中我们会分别实现打开文件、写文件和关闭文件这几个方法。代码如下所示：

```
class output_txt(object):

    def open_txt(self):
        name = "stock_cont.txt"
        try:
            f = codecs.open(name, 'a+', 'utf-8')
        except Exception as e:
            print("NO TXT")
        return f

    def out_txt(self, f_handle, conts):
        try:
            print("cont",conts)
            f_handle.write(conts)
        except Exception as e:
            print("NO FILE")

    def close_txt(self, f_handle):
        f_handle.close()
```

接下来就可以一边爬取帖子内容，一边把内容写入到txt文件中。实现关键代码如下所示：

```
file_txt = self.outputer.open_txt()
while self.target_page.has_page_url():
     new_urls = self.target_page.get_new_url() # 获取每个帖子的URL地址队列
     for url in new_urls:
        if time_start <= (self.downloader.find_time(url)+timedelta(days=30)):
           self.outputer.out_txt(file_txt, self.downloader.download(url))
           true_time = true_time + 1
        else:
           error_time = error_time + 1
self.outputer.close_txt(file_txt)
```

写入txt文件的效果如下所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/14/17041c649418f06e~tplv-t2oaga2asx-image.image)

## 总结

本小节我们通过爬虫方式得到股吧帖子中的各种内容，那么这些内容对于我们来说有什么意义吗？我们发现总有些人一直在唱空，制造恐慌的情绪，不过我们可以通过分类分析下这些空头评论和股价的涨跌有没有什么关联，是不是有写ID是专门来唱空的呢？感兴趣的朋友们可以试试！
    