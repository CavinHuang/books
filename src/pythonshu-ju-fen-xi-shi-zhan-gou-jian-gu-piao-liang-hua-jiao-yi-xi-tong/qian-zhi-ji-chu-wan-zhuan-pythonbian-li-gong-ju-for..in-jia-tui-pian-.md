
# 前置基础-玩转Python遍历工具for..in【加推篇】
---

# 前置基础：玩转Python遍历工具for..in

## 前言

for循环是所有编程语言中普遍使用的一种语法。

Python中`for..in`循环结构用于遍历列表、元组、字典、字符串、集合、文件等。

其实for和in是两个独立的语法：

- for语句是Python内置的迭代器工具，用于从可迭代容器对象（如列表、元组、字典、字符串、集合、文件等）中逐个读取元素，直到容器中没有更多元素为止，工具和对象之间只要遵循可迭代协议即可进行迭代操作。
- in的存在使得python在操作可迭代对象时变得简单得多，用于配合for使用逐个取可迭代对象的元素。

## for..in迭代过程

for语句参与的具体迭代的过程为：可迭代对象通过`__iter__`方法返回迭代器，迭代器具有`__next__`方法，for循环不断地调用`__next__`方法，每次按序返回迭代器中的一个值，直到迭代到最后，没有更多元素时抛出异常`StopIteration`（python自动处理异常）。

模拟迭代的过程如下所示：

```
# 迭代的过程
x = [1,2,3]
its = x.__iter__() #列表是可迭代对象，否则会提示不是迭代对象
print(its)
# 打印结果：
<list_iterator object at 0x100f32198>
print(next(its)) # its包含此方法，说明its是迭代器
# 打印结果：
1
print(next(its)) 
# 打印结果：
2
print(next(its)) 
# 打印结果：
3
print(next(its)) 
# 打印结果：
Traceback (most recent call last):
 	File "<stdin>", line 1, in <module>
StopIteration
```

迭代的优点是无需把所有元素一次加载到内存中，可以在调用next方法时逐个返回元素，避免出现内存空间不够的情况。

## for..in使用技巧

接下来我们介绍下for..in循环结构的使用技巧。

1、遍历一个范围内的数字

通过`range()`函数创建一个整数列表用于 for 循环遍历，`range(start, stop[, step])`。

- start: 计数从 start 开始。默认是从 0 开始。例如range（5）等价于range（0， 5）
- stop: 计数到 stop 结束，但不包括 stop。例如：range（0， 5） 是\[0, 1, 2, 3, 4\]没有5
- step：步长，默认为1。例如：range（0， 5） 等价于 range\(0, 5, 1\)

示例代码如下所示：

```
for i in range(6):# [0, 1, 2, 3, 4, 5]
    print(i)
```

2、正向遍历/反向遍历一个集合

关于正向遍历和反向遍历的实现方法，各有两种，此处推荐使用后一种更简练的方法。

示例代码如下所示：

```
colors = ['red', 'green', 'blue', 'yellow']
#正向遍历
for i in range(len(colors)):
    print(colors[i])
# 推荐更好的简练方法
for color in colors:
    print(color) #返回 'red', 'green', 'blue', 'yellow'

#反向遍历
for i in range(len(colors)-1, -1, -1):
    print(colors[i])
# 推荐更好的简练方法
for color in reversed(colors):
    print(color) #返回 'yellow', 'blue', 'green', 'red'
```

3、遍历一个集合及其下标

当遍历一个集合及其下标时，推荐使用`enumerate`这种效率高、优雅的写法。

`enumerate()`函数可将一个可遍历的数据对象（如列表、元组或字符串）组合为一个索引序列，同时列出数据和数据下标，如\(0, seq\[0\]\), \(1, seq\[1\]\), \(2, seq\[2\]\)等帮我们省去亲自创建和自增下标，避免在操作集合的下标时出错。

示例代码如下所示：

```
colors = ['red', 'green', 'blue', 'yellow']
for i in range(len(colors)):
    print(i, '--->', colors[i])
# 推荐更好的简练方法
for i, color in enumerate(colors):
    print(i, '--->', color)
#返回结果：
#0 ---> red
#1 ---> green
#2 ---> blue
#3 ---> yellow
```

4、遍历两个集合

当同时遍历两个集合时，推荐使`用zip`这种写法。

`zip`方法用于将可迭代的对象作为参数，将对象中对应的元素打包成一个个元组，在返回内容方面 Python 2 和 Python 3 中会有所不同。

在 Python 2.x中zip\(\) 返回的是由这些元组组成的列表，而在 Python 3.x 中为了减少生成列表所占用的内存，zip\(\) 返回的是一个对象，如需得到列表，可以手动 list\(\) 转换。

示例代码如下所示：

```
names = ['raymond', 'rachel', 'matthew']
colors = ['red', 'green', 'blue', 'yellow']

n = min(len(names), len(colors))
for i in range(n):
    print(names[i], '--->', colors[i])
# 推荐更好的简练方法
for name, color in zip(names, colors):
    print(name, '--->', color)
#返回结果：
#raymond ---> red
#rachel ---> green
#matthew ---> blue
```

5、有序地遍历

Python 3.x中的`sorted(iterable, key=None, reverse=False)`函数可对所有可迭代的对象进行排序操作，其中各个参数定义如下所示：

- iterable：可迭代对象
- key：可选项，默认值为None，主要作用是指定一个函数，该函数只能输入一个参数，参数值取自于可迭代对象中的一个元素，以此作为排序的关键字
- reverse：排序规则，reverse=True 降序 ， reverse=False 升序（默认）

示例代码如下所示：

```
colors = [('red',1), ('green',3), ('blue',5), ('yellow',2)]
# 正序 key=none
for color in sorted(colors):
    print(color)
#返回结果：
#('blue', 5)
#('green', 3)
#('red', 1)
#('yellow', 2)

# 正序 key=lambda s:s[1]
for color in sorted(colors, key=lambda s:s[1]):
    print(color)
#返回结果：
#('red', 1)
#('yellow', 2)
#('green', 3)
#('blue', 5)

# 倒序 key=none
for color in sorted(colors, reverse=True):
    print(color)
#返回结果：
#('yellow', 2)
#('red', 1)
#('green', 3)
#('blue', 5)

# 倒序 key=lambda s:s[1]
for color in sorted(colors, key=lambda s:s[1], reverse=True):
    print(color)
#返回结果：
#('blue', 5)
#('green', 3)
#('yellow', 2)
#('red', 1)
```

6、遍历一个字典的key和value

Python 3.x 中：`iteritems()`和 `viewitems()`这两个方法都已经废除了，而`items()` 得到的结果和Python2.x中`viewitems()`一致（viewitems返回一个view对象，\(key,value\)列表，类似于视图）。在Python 3.x中`items()`的行为和`iteritems()`很接近，可以用`items()` 替代`iteritems()`用于 for循环遍历。因此推荐使用`items ()`。

示例代码如下所示：

```
d = {'matthew': 'blue', 'rachel': 'green', 'raymond': 'red'}
# 并不快，每次必须要重新哈希并做一次查找
for k in d:
    print(k, '--->', d[k])

# Python2.x中产生一个很大的列表
for k, v in d.items():
    print(k, '--->', v)
# Python2.x中推荐更好的简练方法
for k, v in d.iteritems():
    print(k, '--->', v)
```

## 总结

本小节我们介绍了Python中for..in循环的原理和使用技巧，这也是我们使用Python编程时候普遍使用的一种语法，在小册接下来的《股票数据分析：遍历DataFrame格式股票数据的方法》一节中我们会用例程来看看for..in循环是如何解决实际问题的。
    