---
date: 2024-01-01 23:38
title: 俄罗斯方块-面板和方块数据结构
tags:
- game
- elsfk
---
## 前置知识
1. `html`,`javascript`基础知识
2. `dom` 编程基础知识
3. `canvas api`基础知识  
如果你对上述提到的内容毫不知情，建议先去学习一下基础知识再来阅读本篇，由于作者水平有限，本文的内容会尽量控制在`正确`的范围内，避免误导读者。
既然有思路了，不废话直接开干。
## 新建文件夹！
首先我们需要新建一个HTML文件，引入我们自定的代码。借助于`canvas`,我们可以很方便的使用`javascript`绘制图形，这也是我们此次游戏制作的基石。
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
document.body.appendChild(canvas)

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
