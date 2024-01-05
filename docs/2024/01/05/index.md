---
title: 复刻植物大战僵尸-part1.1
date: 2024-01-05 14:40
tags:
- game
- pvz
location: 长沙天心区湘江中路
---

## pixi？

说实话，昨天的代码完全不知道在那干啥，今天也是一样。但我能感觉到，整个游戏关卡的数据结构已经逐渐清晰起来了。同样的，`pixi.js`的渲染问题我也有了一点点思路。根据`pixi.js`里面的概念

| Component                               | Description                                                  |
| --------------------------------------- | ------------------------------------------------------------ |
| **Renderer** `@pixi/core`               | The core of the PixiJS system is the renderer, which displays the scene graph and draws it to the screen. The default renderer for PixiJS is based on WebGL under the hood. |
| **Container** `@pixi/display`           | Main display object which creates a scene graph: the tree of renderable objects to be displayed, such as sprites, graphics and text. See [Scene Graph](https://pixijs.com/guides/basics/scene-graph) for more details. |
| **Loader** `@pixi/loader`               | The loader system provides tools for asynchronously loading resources such as images and audio files. |
| **Ticker** `@pixi/ticker`               | Tickers provide periodic callbacks based on a clock. Your game update logic will generally be run in response to a tick once per frame. You can have multiple tickers in use at one time. |
| **Application** `@pixi/app`             | The Application is a simple helper that wraps a Loader, Ticker and Renderer into a single, convenient easy-to-use object. Great for getting started quickly, prototyping and building simple projects. |
| **Interaction** `@pixi/interaction`     | PixiJS supports both touch and mouse-based interaction - making objects clickable, firing hover events, et |
| **Accessibility** `@pixi/accessibility` | Woven through our display system is a rich set of tools for enabling keyboard and screen-reader accessibility. |

1. container容器，可以挂载到根节点`app。stage`,也可以相互嵌套，前提是需要嵌套，整个场景也就是一棵树。
2. loader可以帮助为加载图片资源，音频资源
3. interaction可以提供鼠标和触控屏

我的问题点就是，如何将我自己的类和对象与`PIXI.js`中提供的api融合起来，就像UI面板，地板，植物和僵尸。。。顺便提醒一下自己

> 要借助一个工具的前提是逐步了解这个工具

在前期探索中我完全没必要花费大量时间去追求完美或者雕刻细节，首要任务还是尽快出一个demo，然后逐步前进。。。

## 一点点UI

植物信息列表，字段暂时只有这些，因为想不到

```javascript
// 这里列出植物的基本信息，方便在后续选择植物，图鉴页面，顶部植物栏中使用
const plantList = [
    { name: 'sunFlower', cost: 50, cd: 10, baseSpritePath: '/assets/img/sunFlower.webp', mannerism: 'day', env: 'ground' },
    { name: 'shoot', cost: 100, cd: 10, baseSpritePath: '/assets/img/shoot.webp', mannerism: 'all', env: 'ground' },
]

const plantMap = new Map()
plantList.forEach(plant => {
    const { name } = plant
    plantMap.set(name, plant)
})

export default plantMap
```

卡片，用于顶部选择植物UI栏，后续的开始关卡前的参战植物选择，以及后续可能没有的图鉴，僵尸是同样的。

```javascript
// size2d 其实就是{width: 0, height: 0}对象
import { Size2D } from "../basic/basic.js"
import plantMap from "../plants/plantList.js"

export default class Card {
    size
    padding
    border
    margin
    content
    constructor(size2D, type = 'plant', name = 'sunFlower') {
        this.size = new Size2D(size2D)
        if (type === 'plant')
            this.content = plantMap.get(name)
    }
}
```

传说中的UI，还没写交互

```javascript
import Card from "./card.js"
import { Size2D } from "../basic/basic.js"

const size2D = new Size2D({
    width: 75,
    height: 75
})
const type = 'plant'

export default class SelectBar {
    cards = []
    constructor(cardNames = []) {
        if (Array.isArray(cardNames)) {
            cardNames.forEach(name => {
                this.cards.push(new Card(size2D, type, name))
            })
        }
    }

    get length() {
        return this.cards.length
    }
}
```

## 开始渲染UI

```javascript
// main.js,在昨天的基础上添加了下面的代码
const container1 = new PIXI.Container()

const selectBar = new SelectBar(['sunFlower', 'shoot'])
container1.x = 0
container1.y = 0
app.stage.addChild(container1)

selectBar.cards.forEach((card, idx) => {
    debugger
    const path = card.content.baseSpritePath
    const sprite = PIXI.Sprite.from(path)
    const { width, height } = card.size
    sprite.position.x = idx * card.size.width * idx
    sprite.width = width
    sprite.height = height
    container1.addChild(sprite)
})
```
很不好意思展示，但是暂时就这样子，中午忍不住写了一些，虽然代码没有写多少，但是理解加深了一点，这是很不错的哈哈哈。

![Screenshot from 2024-01-05 14-36-54](https://s2.loli.net/2024/01/05/D9j2ySXC4bmEveL.png)

今晚或者明天不知道有没有机会把交互弄出来，然后后面肯定要仔细构思可渲染和可交互的对象与`PIXI.js`中的概念融合，以及游戏场景概念的加入，然后是关卡的完整数据结构。。。任重而道远！