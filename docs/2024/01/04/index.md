---
title: 复刻植物大战僵尸-part1
date: 2024-01-04 13:10
tags:
- game
- pvz
location: 长沙天心区湘江中路
---

## 感觉号南

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
    // cells = Array.from({ length: this.row }, () => new Array(this.col).fill(null));
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

## 真的很难

