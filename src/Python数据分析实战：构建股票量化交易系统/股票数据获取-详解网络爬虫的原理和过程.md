
# 股票数据获取-详解网络爬虫的原理和过程
---

# 详解网络爬虫的原理和过程

## 前言

我们可以使用pandas、Tushare这些Python第三方库提供的API接口轻松获取到股票交易数据，但是毕竟这些库所提供的数据是相对比较普遍的数据，比如开盘价、收盘价、涨幅、成交量等等。当我们所要获取的数据已经超越了它们所能提供的范围时，我们只能用网络爬虫这条途径来获取所需的数据。

因此在介绍完常用的股票交易数据获取接口后，非常有必要介绍下网络爬虫的原理和方法，以备不时之需。

## 初识网络爬虫

在了解网络爬虫的概念之前，我们先介绍下平时使用浏览器访问网站的整个过程，这有助于我们更好地理解网络爬虫的工作方式。当我们在浏览器地址栏中输入<http://image.baidu.com/>这个网址后，打开网页会看到百度网站提供的内容，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/8/169fc86e7caa74ea~tplv-t2oaga2asx-image.image)

整个过程简单来说就是浏览器从服务器中获取到网站信息，经过渲染后将效果呈现给我们。总体可以将这个过程概括为以下几步：

- 第一步：浏览器向DNS服务器发起DNS请求，DNS服务器解析域名后返回域名对应的网站服务器IP地址
- 第二步：浏览器获取IP地址后向网络服务器发送一个HTTP请求
- 第三步：网络服务器解析浏览器的请求后从数据库获取资源，将生成的HTML文件封装至HTTP 响应包中，返回至浏览器解析
- 第四步：浏览器解析HTTP 响应后，下载HTML文件，继而根据文件内包含的外部引用文件、图片或者多媒体文件等逐步下载，最终将获取到的全部文件渲染成完整的网站页面

因此，我们看到的网页实质上是由渲染后的HTML页面构成的，当我们鼠标右击浏览器，选中查看元素可以看到当前网页的HTML代码，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/8/169fc874a764f054~tplv-t2oaga2asx-image.image)

网络爬虫的工作方式与浏览器访问网站在原理上相似。我们把互联网比作一张大网，爬虫在这张大网上爬行，它在爬取一个网页时，如果遇到所需的资源就可以抓取下来，如果在这个网中它发现了通往另外一个网的一条通道，也就是指向另一个网页的超链接，那么它就可以爬到另一张网上来获取数据。这样，整个连在一起的大网对爬虫来说是触手可及，它将所爬取到的HTML文件内容经过分析和过滤，最终提取所需的图片、文字等资源。

## 获取HTML文件的方法

Python下提供网络请求的方式有`urllib`、`urllib2`和`urllib3`，我们能够借此来获取HTML文件。梳理下这几个方式的来龙去脉，Python中最早内置的网络请求模块是urllib，然后在Python2.x中开始自带了urllib2模块，在Python3.x中将urllib和urllib2整合为了urllib，urllib2就成为了urllib.request，urllib3并非Python内置模块，而是Python的第三方库，它是需要额外安装的。

它们主要的区别在于urllib侧重于url基本的请求构造，urllib2侧重于HTTP协议请求的处理，而urllib3提供了Python标准库里所没有的重要特性，比如线程安全、连接池管理等等，可以看到从urllib的推出，到urllib2，再到urllib3，其实也是对网络访问方式不断优化升级的过程。

我们分别在Python2.7和Python3.7中观察urllib、urllib2、urllib3三者属性的概况，如下所示：

```
#以下为Python2.7下urllib、urllib2、urllib3的属性、方法列表
import urllib3
import urllib2
import urllib

print(dir(urllib))
"""
['ContentTooShortError', 'FancyURLopener', 'MAXFTPCACHE', 'URLopener', '__all__', '__builtins__', '__doc__', '__file__', '__name__', '__package__', '_
_version__', '_asciire', '_ftperrors', '_have_ssl', '_hexdig', '_hextochr', '_hostprog', '_is_unicode', '_localhost', '_noheaders', '_nportprog', '_pa
sswdprog', '_portprog', '_queryprog', '_safe_map', '_safe_quoters', '_tagprog', '_thishost', '_typeprog', '_urlopener', '_userprog', '_valueprog', 'ad
dbase', 'addclosehook', 'addinfo', 'addinfourl', 'always_safe', 'base64', 'basejoin', 'c', 'ftpcache', 'ftperrors', 'ftpwrapper', 'getproxies', 'getpr
oxies_environment', 'getproxies_registry', 'i', 'localhost', 'noheaders', 'os', 'pathname2url', 'proxy_bypass', 'proxy_bypass_environment', 'proxy_byp
ass_registry', 'quote', 'quote_plus', 're', 'reporthook', 'socket', 'splitattr', 'splithost', 'splitnport', 'splitpasswd', 'splitport', 'splitquery',
'splittag', 'splittype', 'splituser', 'splitvalue', 'ssl', 'string', 'sys', 'test1', 'thishost', 'time', 'toBytes', 'unquote', 'unquote_plus', 'unwrap
', 'url2pathname', 'urlcleanup', 'urlencode', 'urlopen', 'urlretrieve']
"""
print(dir(urllib2))
"""
['AbstractBasicAuthHandler', 'AbstractDigestAuthHandler', 'AbstractHTTPHandler', 'BaseHandler', 'CacheFTPHandler', 'FTPHandler', 'FileHandler', 'HTTPB asicAuthHandler', 'HTTPCookieProcessor', 'HTTPDefaultErrorHandler', 'HTTPDigestAuthHandler', 'HTTPError', 'HTTPErrorProcessor', 'HTTPHandler', 'HTTPPa sswordMgr', 'HTTPPasswordMgrWithDefaultRealm', 'HTTPRedirectHandler', 'HTTPSHandler', 'OpenerDirector', 'ProxyBasicAuthHandler', 'ProxyDigestAuthHandl er', 'ProxyHandler', 'Request', 'StringIO', 'URLError', 'UnknownHandler', '__builtins__', '__doc__', '__file__', '__name__', '__package__', '__version __', '_cut_port_re', '_opener', '_parse_proxy', '_safe_gethostbyname', 'addinfourl', 'base64', 'bisect', 'build_opener', 'ftpwrapper', 'getproxies', ' hashlib', 'httplib', 'install_opener', 'localhost', 'mimetools', 'os', 'parse_http_list', 'parse_keqv_list', 'posixpath', 'proxy_bypass', 'quote', 'ra ndom', 'randombytes', 're', 'request_host', 'socket', 'splitattr', 'splithost', 'splitpasswd', 'splitport', 'splittag', 'splittype', 'splituser', 'spl itvalue', 'sys', 'time', 'toBytes', 'unquote', 'unwrap', 'url2pathname', 'urlopen', 'urlparse', 'warnings']
"""
print(dir(urllib3))
"""
['HTTPConnectionPool', 'HTTPResponse', 'HTTPSConnectionPool', 'PoolManager', 'ProxyManager', 'Retry', 'Timeout', '__all__', '__author__', '__builtins_
_', '__doc__', '__file__', '__license__', '__name__', '__package__', '__path__', '__version__', '_collections', 'absolute_import', 'add_stderr_logger'
, 'connection', 'connection_from_url', 'connectionpool', 'disable_warnings', 'encode_multipart_formdata', 'exceptions', 'fields', 'filepost', 'get_hos
t', 'logging', 'make_headers', 'packages', 'poolmanager', 'proxy_from_url', 'request', 'response', 'util', 'warnings']
"""

#以下为Python3.7下urllib、urllib2、urllib3的属性、方法列表
import urllib3
import urllib

print(dir(urllib))
"""
['__builtins__', '__cached__', '__doc__', '__file__', '__loader__', '__name__', '__package__', '__path__', '__spec__', 'error', 'parse', 'request', 'response']
"""
print(dir(urllib.request))
"""
['AbstractBasicAuthHandler', 'AbstractDigestAuthHandler', 'AbstractHTTPHandler', 'BaseHandler', 'CacheFTPHandler', 'ContentTooShortError', 'DataHandler', 'FTPHandler', 'FancyURLopener', 'FileHandler', 'HTTPBasicAuthHandler', 'HTTPCookieProcessor', 'HTTPDefaultErrorHandler', 'HTTPDigestAuthHandler', 'HTTPError', 'HTTPErrorProcessor', 'HTTPHandler', 'HTTPPasswordMgr', 'HTTPPasswordMgrWithDefaultRealm', 'HTTPPasswordMgrWithPriorAuth', 'HTTPRedirectHandler', 'HTTPSHandler', 'MAXFTPCACHE', 'OpenerDirector', 'ProxyBasicAuthHandler', 'ProxyDigestAuthHandler', 'ProxyHandler', 'Request', 'URLError', 'URLopener', 'UnknownHandler', '__all__', '__builtins__', '__cached__', '__doc__', '__file__', '__loader__', '__name__', '__package__', '__spec__', '__version__', '_cut_port_re', '_ftperrors', '_get_proxies', '_get_proxy_settings', '_have_ssl', '_localhost', '_noheaders', '_opener', '_parse_proxy', '_proxy_bypass_macosx_sysconf', '_randombytes', '_safe_gethostbyname', '_thishost', '_url_tempfiles', 'addclosehook', 'addinfourl', 'base64', 'bisect', 'build_opener', 'contextlib', 'email', 'ftpcache', 'ftperrors', 'ftpwrapper', 'getproxies', 'getproxies_environment', 'getproxies_macosx_sysconf', 'hashlib', 'http', 'install_opener', 'io', 'localhost', 'noheaders', 'os', 'parse_http_list', 'parse_keqv_list', 'pathname2url', 'posixpath', 'proxy_bypass', 'proxy_bypass_environment', 'proxy_bypass_macosx_sysconf', 'quote', 're', 'request_host', 'socket', 'splitattr', 'splithost', 'splitpasswd', 'splitport', 'splitquery', 'splittag', 'splittype', 'splituser', 'splitvalue', 'ssl', 'string', 'sys', 'tempfile', 'thishost', 'time', 'to_bytes', 'unquote', 'unquote_to_bytes', 'unwrap', 'url2pathname', 'urlcleanup', 'urljoin', 'urlopen', 'urlparse', 'urlretrieve', 'urlsplit', 'urlunparse', 'warnings']
"""

print(dir(urllib3))
"""
['HTTPConnectionPool', 'HTTPResponse', 'HTTPSConnectionPool', 'PoolManager', 'ProxyManager', 'Retry', 'Timeout', '__all__', '__author__', '__builtins__', '__cached__', '__doc__', '__file__', '__license__', '__loader__', '__name__', '__package__', '__path__', '__spec__', '__version__', '_collections', 'absolute_import', 'add_stderr_logger', 'connection', 'connection_from_url', 'connectionpool', 'disable_warnings', 'encode_multipart_formdata', 'exceptions', 'fields', 'filepost', 'get_host', 'logging', 'make_headers', 'packages', 'poolmanager', 'proxy_from_url', 'request', 'response', 'util', 'warnings']
"""
```

我们先了解下Python3.x中的`urllib.request`模块，而后以对比的方式介绍下`urllib3`。`request`模块主要负责构造和发起网络请求，使用时只需导入模块即可，如下所示：

```
from urllib import request
```

request模块中使用`urlopen()`方法来发起请求，在`urlopen()`方法中需要以字符串格式传入目标网站的url地址，此处传入的url地址为http://image.baidu.com/，对于访问方式默认情况下为GET请求方式，`urlopen()`方法在访问到目标网址后会返回访问的结果，如下所示：

```
resp = request.urlopen("http://image.baidu.com/")
```

`urlopen()`方法返回的结果是一个`http.client.HTTPResponse`对象，该对象包含了一些方法和属性，使我们对请求返回的结果进行一些处理，如下所示：

```
print(type(resp))
# <class 'http.client.HTTPResponse'>
"""
['__abstractmethods__', '__class__', '__del__', '__delattr__', '__dict__', '__dir__', '__doc__', '__enter__', '__eq__', '__exit__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__next__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '_abc_impl', '_checkClosed', '_checkReadable', '_checkSeekable', '_checkWritable', '_check_close', '_close_conn', '_get_chunk_left', '_method', '_peek_chunked', '_read1_chunked', '_read_and_discard_trailer', '_read_next_chunk_size', '_read_status', '_readall_chunked', '_readinto_chunked', '_safe_read', '_safe_readinto', 'begin', 'chunk_left', 'chunked', 'close', 'closed', 'code', 'debuglevel', 'detach', 'fileno', 'flush', 'fp', 'getcode', 'getheader', 'getheaders', 'geturl', 'headers', 'info', 'isatty', 'isclosed', 'length', 'msg', 'peek', 'read', 'read1', 'readable', 'readinto', 'readinto1', 'readline', 'readlines', 'reason', 'seek', 'seekable', 'status', 'tell', 'truncate', 'url', 'version', 'will_close', 'writable', 'write', 'writelines']
"""
```

比如使用`http.client.HTTPResponse`对象的`read()`方法可以获取访问到的HTML文件内容，但是要注意的是，获得的内容是bytes格式的二进制字节流，因此需要使用`decode()`方法将其转换成字符串格式，如下所示：

```
print(resp.read().decode())
#截取部分内容

<!DOCTYPE html>              <!--STATUS OK-->  <head>   <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/> <meta name="description" content="百度图片使用世界前沿的人工智能技术，为用户甄选海量的高清美图，用更流畅、更快捷、更精准的搜索体验，带你去发现多彩的世界。"> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/> <meta name="baidu-site-verification" content="2ltGWMzql9"/>  <script>
    var bdimgdata = {
        logid: '11007013867272265913',
        sid: 'dc1c38881068b98784a4a5fc83d5a92f6b2743ee',
        wh: window.screen.width + 'x' + window.screen.height,
        sampid: '-1',
        protocol: window.location.protocol.replace(':', ''),
        spat: 0 + '-' + ''
    }
......    

```

接下来介绍下推荐使用的`urllib3`库，通过它来实现HTTP客户端的角色。其实`pandas-datareader`库也是基于urllib3实现从金融网站上获取交易数据的，感兴趣的同学可以从`pandas-datareader`库的源码中发现。使用urllib3库时，首先需要导入urllib3库，如下所示：

```
import urllib3
```

由于urllib3库通过连接池进行网络请求的访问，所以在访问之前需要创建一个连接池对象`PoolManager`，如下所示：

```
http = urllib3.PoolManager();
```

使用PoolManager的`request()`方法发起网络请求，与`urlopen()`方法类似，`request()`方法中需要选择method和url参数，此处method参数指定GET请求类型，url地址仍然为http://image.baidu.com/，`request()`方法返回的是一个`urllib3.response.HTTPResponse`对象，如下所示：

```
resp_dat = http.request('GET', "http://image.baidu.com/")
print(type(resp_dat))
#<class 'urllib3.response.HTTPResponse'>
```

通过`dir()`方法查看urllib3.response.HTTPResponse对象所有的属性和方法，其中data属性返回获取到的HTML文件内容，如下所示：

```
print(dir(resp_dat))
"""
['CONTENT_DECODERS', 'REDIRECT_STATUSES', '__abstractmethods__', '__class__', '__del__', '__delattr__', '__dict__', '__dir__', '__doc__', '__enter__', '__eq__', '__exit__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__next__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '_abc_impl', '_body', '_checkClosed', '_checkReadable', '_checkSeekable', '_checkWritable', '_connection', '_decode', '_decoder', '_error_catcher', '_flush_decoder', '_fp', '_fp_bytes_read', '_handle_chunk', '_init_decoder', '_init_length', '_original_response', '_pool', '_request_url', '_update_chunk_length', 'chunk_left', 'chunked', 'close', 'closed', 'connection', 'data', 'decode_content', 'enforce_content_length', 'fileno', 'flush', 'from_httplib', 'get_redirect_location', 'getheader', 'getheaders', 'geturl', 'headers', 'info', 'isatty', 'isclosed', 'length_remaining', 'msg', 'read', 'read_chunked', 'readable', 'readinto', 'readline', 'readlines', 'reason', 'release_conn', 'retries', 'seek', 'seekable', 'status', 'stream', 'strict', 'supports_chunked_reads', 'tell', 'truncate', 'version', 'writable', 'writelines']
"""
print(resp_dat.data.decode())
#截取部分内容

<!DOCTYPE html>              <!--STATUS OK-->  <head>   <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/> <meta name="description" content="百度图片使用世界前沿的人工智能技术，为用户甄选海量的高清美图，用更流畅、更快捷、更精准的搜索体验，带你去发现多彩的世界。"> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/> <meta name="baidu-site-verification" content="2ltGWMzql9"/>  <script>
    var bdimgdata = {
        logid: '11556334442247435618',
        sid: 'fb134feff2800daf90c19472e152feb4113006ef',
        wh: window.screen.width + 'x' + window.screen.height,
        sampid: '-1',
        protocol: window.location.protocol.replace(':', ''),
        spat: 0 + '-' + ''
    }
......

```

## 总结

本节主要介绍了爬虫的原理和使用方法。关于爬虫的使用，首先调用urllib3库的网络请求方法，返回一个响应的对象，在这个对象中获取到网页的全部内容。

接下来如何处理呢？下一小节我们会介绍通过正则表达式过滤出自己所需要的内容。

最后，给大家留一道思考题：

大家所了解的网络爬虫框架有哪些呢？这些框架对使用者来说又有什么作用呢？

欢迎大家在留言区留言，我们一起讨论。
    