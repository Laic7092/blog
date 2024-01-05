---
title: 复刻植物大战僵尸-part1
date: 2024-01-04 13:10
tags:
- game
- pvz
location: 长沙天心区湘江中路
---
## 免责声明

本篇完全是本人瞎写的，未经仔细思考的结果，千万别学！！！后续有时间会进一步完善，但是我可能不会修改本篇，这并不是教程，而是我思考过程的记录。

## 网格

中午稍微写了一会，脑子里沙也没有，写完这部分我有非常纠结到底要不要用`pixi.js`,有点害怕我学艺不精。晚上回去会给出`plant`和`zombie`的类，但我感觉还差的好远，尤其是渲染和交互。但是不管怎么样，干就完了。等主面板和僵尸植物的类写完，就是渲染和交互了，我计划是把选择植物，铲子给弄出来。然后依靠向日葵，豌豆射手，普通僵尸制作一个第一关，先从demo感受一下有和不足之处，再思考分析重新规划。

```javascript
class Cell {
    // 贴图和位置还有待思考。。。
    type = 'ground' // 地板，草地,水面，屋顶
    position = { x: 0, y: 0 }
    size = 20
    baseSprite
    isEmpty = true
    curPlant
    extraSprite
    constructor(type, position) {
        this.type = type
        this.position = position
    }

    plant(plant) {
        if (!this.isEmpty) {
            this.curPlant = plant
            this.isEmpty = false
            this.extraSprite = plant.baseSprite
        }
    }

    clear() {
        if (!this.isEmpty) {
            this.curPlant = null
            this.isEmpty = true
            this.extraSprite = null
        }
    }
}


class Floor {
    row = 6
    col = 9
    cells = null

    constructor(option) {
        option = {
            row: 5,
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
        const cells = Array.from({ length: this.row }, () => new Array(this.col).fill(new Cell()));
    }
}


```

## 植物和僵尸

没啥内容植物类，行为树我完不会写

```javascript
// plant.js
class BehaviourTree {
    constructor() {

    }
    attack() {

    }
    defend() {

    }
    util() {

    }
}

class Plant {
    health
    sprites
    curSprite
    cost
    cellSize = 1
    behaviourTree
    constructor() {

    }
}

class OneShoot extends Plant {
    name = 'OneShoot'
    constructor() {
        this.behaviourTree = new BehaviourTree()
    }
}
```

同样没啥内容动物类。。。

```javascript
// zoombie.js
class BehaviourTree {
    constructor() {

    }
    attack() {

    }
    walk() {

    }
    run() {

    }
    eat() {

    }
}

class Zoombie {
    health
    sprites
    curSprite
    behaviourTree
    constructor() {

    }

}

class CommonZombie extends Zoombie {
    constructor() {
        this.behaviourTree = new BehaviourTree()
    }
}
```

## 我承认我在水

这里是老规矩，`index.html`导入`main.js`

我承认`Floor`类写的毫无意义，但是在我打算渲染出来之前我都没有想到要咋办。。。或者说，不太熟悉`PIXI.js`，说好的效率呢？

```javascript
// main.js with PIXI.js
import * as PIXI from './pixi.mjs'
import Floor from "./modules/gameScene/floor.js";

const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });
document.body.appendChild(app.view);
const container = new PIXI.Container()
container.x = 100
container.y = 100
app.stage.addChild(container);
const sizeX = 120
const sizeY = 150

for (let i = 0; i < 5; i++) {
    const row = []
    for (let j = 0; j < 9; j++) {
        const path = (i + j) % 2 === 0 ? '/assets/img/dark.png' : '/assets/img/light.png'
        const grass = PIXI.Sprite.from(path)
        grass.position.x = j * sizeX
        grass.position.y = i * sizeY
        row.push(grass)
    }
    container.addChild(...row)
}
```

效果如下，一共两张图片间隔渲染，丑的很有特色。。。

![image-20240104225656527](https://s2.loli.net/2024/01/04/82GrlkBeysOQD9U.png)

真的是历经了千辛万苦，完成了1%哈哈哈哈哈哈哈，写的`Class`不能说毫无关系，只能说啥也不是。。。还需要多多思考，当然`PIXI.js`用的也是相当不顺手的说，还有一点要说的就是，`plant`和`zoombie`的行为树，我是真不会啊，一想就觉得好难55555。是否有点不自量力了呢？但我觉得金坛已经做了足够多了，说不定明天就有UI了，后天就能放置植物(做梦中。。。)

顺便记录一下目录

![image-20240104225633546](https://s2.loli.net/2024/01/04/ptORlT6f9n37cHY.png)

今天就到此结束了，明天的工作任务还有蛮重可能不会写，周末要出去玩一天，不加班的话会更新的（也不知道在和谁说话，自言自语这么有意思？）
