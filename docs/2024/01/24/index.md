---
title: 复刻植物大战僵尸-part1.2
date: 2024-01-24 12:59
tags:
- game
- pvz
location: 长沙天心区新姚南路
---
## 多少有一点进展

![image-20240124010054344](https://s2.loli.net/2024/01/24/FKZjXukRBeV4zxd.png)

因为很心虚，先上图，托更了这么久。。。可以看到我已经实现了点击上方ui选择植物，然后将选中的植物的图片，放到地板上。。。没错就是图片，没有任何状态和行为哈哈哈哈哈。

之后会慢慢加上膨胀检测，加上僵尸，我感觉有进一步接近我想要的demo了，虽然还差很远。现在最困扰我的问题就是`PIXIJS`和我内部用到的对象之间的关系，总感觉写起来不对劲。我希望可以做到，在用户输入引发（也不仅仅是用户输入，所有可以改变内部对象状态的都应该触发）更新后，我能够分析区别，然后更新`PIXIJS`的对象，这个过程应该是所谓的响应式？类似于vue那种，数据驱动视图的变化（不过我这里因为利用了`PIXiJS`,所以正确的是我的内部数据驱动`PIXIJS`内的数据变化，随后视图自会变化，`PIXIJS`帮我完成了这一步，很滑稽的是我需要做前一步，但我不太会。

## 垃圾代码-hand

首先定义了一个hand，可以抓取对象，释放对象，丢出对象（为什么是三个因为我现在也不知道咋写）。在顶部UI栏，选中某个植物后，该植物就会出现在鼠标附近并跟随移动。

事件监听暂时用到了`globalpointermove`,用于跟随鼠标显示，通常会把handmodel暴露出去，其他对象触发事件并需要获取hand中的对象则调用`releaseObject`。

```javascript
import { Renderer, Interaction } from '../basic/basic.js'
import * as PIXI from '../../pixi.mjs'

class Hand {
    // 手中有？可以和啥交互？感觉这海曼重要
    content
    source
    target
    #renderer
    constructor() {

    }

    get renderer() {
        return this.#renderer
    }

    set renderer(renderer) {
        this.#renderer = renderer
        if (renderer) {
            const content = this.content
            const { type = 'img' } = content
            if (type === 'img') {
                const item = PIXI.Sprite.from(content.baseSpritePath)
                item.position.x = 1
                item.position.y = 1
                item.width = 75
                item.height = 75
                handView.addChild(item)
            }
        } else if (handView.children[0]){
            handView.removeChildAt(0)
        }

    }

    clear() {
        this.content = null
        this.renderer = null
    }

    holdObject(content) {
        this.content && this.clear()
        if (content) {
            this.content = content
            const config = { size: { width: 75, height: 75 } }
            this.renderer = new Renderer(config)
        }
    }

    releaseObject() {
        const _content = this.content
        if (_content) {
            this.clear()
        }
        return _content
    }

    throwObject() {

    }
}

const handView = new PIXI.Container()
handView.eventMode = 'dynamic'
handView.on('globalpointermove', (e) => {
    const { x, y } = e
    handView.x = x
    handView.y = y
})

const handModel = new Hand()

export {
    handModel,
    handView
}
```

## 垃圾代码-floor

充满了注释，混乱无序的floor,也就是我们看到的草地。

目前来说，floor根容器监听`pointermove`和`pointerdown`，检查当前鼠标悬浮于哪个cell。鼠标点击后则会释放hand中的对象，floor接受并尝试渲染（图片）

```javascript
import * as PIXI from '../../pixi.mjs'
import Cell from './cell.js'
import { handModel } from '../utils/hand.js'

const sizeX = 120
const sizeY = 150

// 我内部有floor对象，我根据floor对象生成了pixijs内部对象，然后pixijs根据这些对象进行渲染
// 那我的model层到底是哪一个呢？我自己的，还是pixijs的？
// 暂时一种理解是，pixijs只用于渲染的原则，如果我把pixijs完全看作view层，感觉合适一点？
// 想想gameloop，每次循环我会监听输入，然后修改我自己的对象，貌似需要一种同步机制，监听我的对象的变更，修改pixi内部的对象

class Floor {
    row
    col
    cells
    constructor(option) {
        option = {
            row: 6,
            col: 9,
            rows: [{
                idx: 2,
                type: 'grass'
            }],
            cols: [0, 1, 2, 3, 4, 5, 6, 7, 8]
        }
        const { row, col } = option
        this.row = row
        this.col = col
        this.cells = new Array(row).fill().map(() => new Array(col).fill().map(() => new Cell()))
        this.init()
    }

    init() {
        this.cells.forEach((row, i) => {
            row.forEach((cell, j) => {
                cell.position.x = j * sizeX
                cell.position.y = i * sizeY
                cell.type = (i + j) % 2 === 0 ? 'ground' : 'ground_dark'
            });
        });
    }

    getCell(x, y) {
        return floorView.getChildAt(x * this.row + y)
    }

    updateCell(x, y) {
        const content = handModel.releaseObject()
        if (!content) return
        // debugger
        const mcell = this.cells[x][y]
        // const vcell = this.getCell(x, y)
        const vcell = mcell.test
        const { baseSpritePath: path } = content
        const sprite = PIXI.Sprite.from(path)
        sprite.width = 75
        sprite.height = 75
        vcell.addChild(sprite)
    }
}

const floorModel = new Floor()
const floorView = new PIXI.Container()
floorView.x = 100
floorView.y = 100

const { cells, row, col } = floorModel
for (let i = 0; i < row; i++) {
    const row = []
    for (let j = 0; j < col; j++) {
        const cell = cells[i][j]
        const { baseSpritePath: path, position } = cell 
        const grass = PIXI.Sprite.from(path)
        grass.position.x = position.x
        grass.position.y = position.y
        cell.test = grass
        row.push(grass)
    }
    floorView.addChild(...row)
}

floorView.eventMode = 'static'
floorView.on('pointerdown', (e) => {
    const { x, y } = e
    const localX = x - 100
    const loclaY = y - 100
    const _x = Math.floor(loclaY / sizeY)
    const _y = Math.floor(localX / sizeX)
    floorModel.updateCell(_x, _y)
})
// floorView.on('pointermove', (e) => {
//     const { x, y } = e
//     const localX = x - 100
//     const loclaY = y - 100
//     const row = Math.floor(loclaY / sizeY)
//     const col = Math.floor(localX / sizeX)
// })

export {
    floorModel,
    floorView
}
```

## 浑水摸鱼结尾

明天，不，今天上线忙完之后估计会悠闲（两三天？？？）一阵子，希望能够抓紧把pvz系列的demo做出来啊！！！

很晚了，就这样吧，这篇博客完全是记录形式，顺便激励一下自己不要断更这么久，准备睡觉了。

## 复活了

> update： 2024-01-24 17:56

![image-20240124163211455](https://s2.loli.net/2024/01/24/ZsLHv71z9P5nETB.png)

今天在看`vuejs设计与实现`这本书，虽然很久之前看过，不过只是略微看了一会。看着看着注意到这句话，昨天晚上写的时候就有结合`vuejs`响应系统的想法了。因为我觉得要完美处理我内部的和`PIXIJS`内部的对象，分析差异并且最小更新。然后渲染函数就是描述这个对象对应的渲染内容。

![image-20240124163926265](https://s2.loli.net/2024/01/24/Cv7PEj21bpOXTqK.png)

这是编写前端页面需要注意的内容，对应到游戏，对应到`PIXIJS`，我发现这些概念都是通用的。

1. container和div类似
2. sprite，text就是img和文本节点（再加上css的知识？）
3. 属性？事件？层级结构？完全吻合

然后想想渲染循环。。。

```
// Listen for animate update
app.ticker.add((delta) => {
	// 用户输入事件处理
	// 状态更新
	。。。响应系统
	// PIXIJS内部状态更新
	。。。接下来交给PIXI去做
});
```

和我熟悉的前端页面不同，我需要？等等，我又突然想到我完全可以把整个游戏当成前端的页面来看。组件化配合响应系统，这两个东西大大的减少了我的心理负担，虽然我可能只是在天方夜谭？PIXIJS`提供的app就是我所知道的根组件？切换场景和前端路由是类似的，页面也只是组件的组合？假设我的整个游戏都是图片文本的组合，我可以参考虚拟dom。或者说我写的就是虚拟dom

1. 我内部的对象就是虚拟dom
2. 真实dom（不是，类比）就是PIXI内的对象
3. 响应式，组件化，虚拟dom加diff可以大幅提到我的效率
4. 更进一步的话，就是参考vue写法,支持声明式