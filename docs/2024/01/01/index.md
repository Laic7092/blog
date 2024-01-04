---
date: 2024-01-01 23:38
title: 俄罗斯方块-面板和方块数据结构
location: 长沙天心区湘江中路
tags:
- game
- elsfk
---
## 前置知识
1. `html`,`javascript`基础知识
2. `dom` 编程基础知识
3. `canvas api`基础知识  

如果你对上述提到的内容毫不知情，建议先去学习一下基础知识再来阅读本篇，由于作者水平有限，本文的内容会尽量控制在`正确`的范围内，避免误导读者。

既然有思路了，不废话了直接开干。

## 新建文件夹！
首先我们需要新建一个`html`文件，我们的`html`文件和引入的js文件可以很好的利用浏览器内部的渲染引擎和js引擎。借助于`canvas`,我们可以很方便的使用`javascript`绘制图形，这也是我们此次游戏制作的基石。
```html
<!-- file-name: index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="./main.js"></script>
</body>
</html>
```
为了方便修改网页的内容，我们利用`dom api`生成`canvas`并把它添加到`body`下
```javascript
// file-name: main.js

// 生成canvas，获取2d-context
const canvas = document.createElement('canvas')
canvas.width = 400
canvas.height = 800
const ctx = canvas.getContext('2d')
window.addEventListener('load',() => {
    document.body.appendChild(canvas)
})

// 生成游戏面板
const row = 20
const col = 10
const cellSize = 40
for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
        ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize)
    }
}
```
接下来按照坐标，从网格左上角开始，写出所有方块的初始位置。之后会添加一定的偏移量，以实现方块从顶部中间位置缓慢冒出。
```javascript
// 4x2小空间内，左上角起始位置，画出7个方块
const blocks = [
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 1 }],
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 0 }],
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
    [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
]

```
## 游戏循环

我们已经有了一个10x20的网格，接下来要做的就是，让整个游戏运转起来！这里涉及到了一点浏览器内部原理，之后可能会单独开一篇细说。为了能够实时显示游戏画面，并且让游戏响应我们的键盘输入，一个`gameloop`必不可少，下面是一个简易循环示例

```
初始化游戏

while 游戏未结束:
    处理输入()
    更新游戏状态()
    渲染画面()

结束游戏

```
我们需要做的就是，处理输入，更新数据,重新渲染网格和方块。先简单说明一下
1. window：window 是浏览器中的全局对象，代表整个浏览器窗口。它提供了各种方法和属性，用于控制浏览器窗口，例如打开新窗口、操作浏览器历史、设置定时器等。在 JavaScript 中，全局作用域下的变量和函数都是 window 对象的属性和方法。
2. document：document 对象表示当前网页的文档对象模型（DOM），它是 window 对象的一个属性。document 对象提供了访问和操作网页内容的方法和属性，例如获取或修改元素、创建新元素、修改样式等。通过 document 对象，可以对网页进行动态的改变和交互。
3. ![image-20240102130333371](https://s2.loli.net/2024/01/02/G5f63rhwWHg9VFu.png)
4. ![image-20240102125615207](https://s2.loli.net/2024/01/02/Z6GSMjhs9ixzotY.png)



在俄罗斯方块游戏中，我们可以通过`document.addEventListener`监听鼠标和键盘的输入并添加对应的`eventHandler`。

```javascript
document.addEventListener('keydown',keyboardInputHandler)

function keyboardInputHandler(keyboardEvent) {
    if (!intervalId) return
    const { key } = keyboardEvent
    switch (key.toUpperCase()) {
		// do sth...
    }
}

```

## 整合

我们已经集齐了七颗龙珠，现在可以开始召唤龙神了。

今天晚上写！！！

1. 开启游戏循环

   ```javascript
   function gameloop() {
    
   }
   ```

   

## 小结

ps： 文中提到的概念和原理，我会抽时间整理并展示在文章底部
