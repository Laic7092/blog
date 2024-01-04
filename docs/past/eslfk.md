---
visible: false
title: 基于CANVAS快速制作俄罗斯方块
date: 2023-12-20 11:47
location: 长沙天心区湘江中路
tags:
- js
- game
---
## 前置知识
1. `html`,`javascript`基础知识
2. `dom`编程基础知识
3. `canvas api`基础知识  

如果你对上述提到的内容毫不知情，建议先去学习一下基础知识再来阅读本篇，由于作者水平有限，本文的内容会尽量控制在`正确`的范围内，避免误导读者。

## 引言
其实这个项目很久之前就做好了，只是一直没有时间整理。前后大概花了三天时间，接下来先说一下步骤。
1. 确认游戏面板和方块
2. 完成方块的生成，移动，旋转
3. 游戏流程和规则的确立
4. 积分系统以及游戏UI

所以大概会有四篇博客，其中较为复杂的就是方块旋转部分（花了本菜鸡很多时间，而且写的也不咋地。。。）
在浏览器环境如何快速生成游戏?首先祭出圣经
> 程序 = 数据结构 + 算法
既然是制作游戏，游戏也属于程序，那就是说：我们只需要定义好整个游戏需要的数据，以及操作数据的方法，那游戏也就随之完成了。说起来很玄乎，我们终究还是要看到游戏的画面才能安心，现在马上动手，打开vscode新建一个HTML文件，我们将使用`canvas api`快速生成游戏背景。

### 新建文件夹！
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


