---
title: 响应式,VDOM结合PIXIJS的尝试
date: 2024-02-03 01:21
tags:
- js
- vue
- pixijs
---

最近回顾了一下Vuejs设计与实现这本书，不过进度很慢，都是上班摸鱼时间看的，而且也是为了学习一下响应式与虚拟DOM方便制作我的pvz。本以为发现了一个绝妙的结合方式，仔细思考一下发现自己想的还是太过简单了些，首先最关键的就是，pixijs我是一点都不熟悉，vue还好一点算是略知一二。其次就是，如果我想着手写响应式，手写编译器渲染器那完全是走错了方向，虽然这也可以提升我对Vue的理解程度，不过我还是希望短期内可以把demo制作出来。

也不知道是不是第一次正式的，完全不依靠游戏引擎和教程，制作一个比较复杂的游戏，一开始的构思真的是想的太少了，后面一步一步走出了很多之前没想过的东西。回想起三年前第一次接触计算机，两年前自学C语言，一年前啥也不会就出来上班，其实我的这段经历还蛮奇特的说。。。

## 走了许多弯路

回到正题，先简单说一下24号之后都做了哪些探索。

1. 重写了selectbar和floor，结合组件化的思想
2. 借鉴vdom，尝试根据render函数返回pixi内容并利用renderer渲染
3. 希望可以利用响应式，实现更新我的普通对象，响应更新pixi对象。

下面是一些我自定的类，暂时只用到容器，文字，和图片三个（主要也就是这三个咯）

```javascript
   export class Vector2 {
       x
       y
       constructor(x = 0, y = 0) {
           if (typeof x !== "number" || x < 0) x = 0
           if (typeof y !== "number" || x < 0) y = 0
           Object.assign(this, { x, y })
       }
   }
   
   class MyContainer {
       type = 'container'
       name
       props
       state
       children
       constructor({ props, children, name, state } = {}) {
           if (Object.prototype.toString.call(props) !== '[object Object]') {
               props = {}
           }
           if (!props.position instanceof Vector2) {
               props.position = new Vector2()
           }
           Object.assign(this, { name, state, children, props })
           Array.isArray(children) && (this.children = this.flattening(children))
       }
       // 二维数组转一维
       flattening(children) {
           const res = []
           children.forEach(child => {
               if (Array.isArray(child)) {
                   res.push(...child)
               } else {
                   res.push(child)
               }
           });
           return res
       }
       // 渲染内容
       render() {
           const { type, props, children, state } = this
           return {
               type,
               props,
               state,
               children
           }
       }
   }
   
   class MySprite extends MyContainer {
       type = 'sprite'
       constructor(config) {
           super(config)
       }
   }
   
   class MyText extends MySprite {
       type = 'text'
       constructor(config) {
           super(config)
       }
   }
   
   export {
       MyContainer,
       MySprite,
       MyText
   }
```

   下面是比较关键的渲染器，涉及到渲染组件的部分还没写完，目前只用到了render，而不是renderer。

```javascript
import * as PIXI from '../../pixi.mjs'

// 返回基础对象
const baseType = new Map()
baseType.set('container', () => new PIXI.Container())
baseType.set('sprite', ({ path }) => PIXI.Sprite.from(path))
baseType.set('text', ({ text }) => new PIXI.Text(text))

function renderer(vnode, container) {
    let displayObject = null
    if (typeof vnode.tag === 'string') {
        // 说明 vnode 描述的是标签元素
        displayObject = mountElement(vnode, container)
    } else if (typeof vnode.tag === 'function') {
        // 说明 vnode 描述的是组件
        displayObject = mountComponent(vnode, container)
    }
    return displayObject
}

function mountElement(vnode, container) {
    const { type, props, children } = vnode
    const pixiContainer = baseType.get(type)(props)

    const handlerSymbol = Symbol.for('handlers')
    const symbols = Object.getOwnPropertySymbols(props)
    if (symbols.includes(handlerSymbol))
        setInteractive(props[handlerSymbol], pixiContainer)

    if (Array.isArray(children)) {
        children.forEach(child => renderer(child, pixiContainer))
    }
    container && container.addChild(pixiContainer)
    return pixiContainer
}

function mountComponent(vnode, container) {
    // 调用组件函数，获取组件要渲染的内容（虚拟 DOM）
    const subtree = vnode.type.render()
    // 递归地调用 renderer 渲染 subtree
    return renderer(subtree, container)
}

function render(vnode, container) {
    let displayObject = null
    if (!vnode) return
    const { type, props, children } = vnode
    if (typeof type === 'string') {
        const pixiContainer = baseType.get(type)(props)
        pixiContainer._vnode = vnode
        // 设置属性
        if (props) {
            for (let key in vnode.props) {
                pixiContainer[key] = vnode.props[key];
            }
        }

        // 递归渲染子节点
        if (Array.isArray(children)) {
            children.forEach(child => {
                render(child, pixiContainer);
            });
        }

        // 将容器节点添加到父容器中
        container && container.addChild(pixiContainer);
        displayObject = pixiContainer
    }

    const handlerSymbol = Symbol.for('handlers')
    const symbols = Object.getOwnPropertySymbols(props)
    if (symbols.includes(handlerSymbol))
        setInteractive(props[handlerSymbol], displayObject)

    return displayObject
}

function setInteractive(handlers, displayObject) {
    for (const key in handlers) {
        if (Object.hasOwnProperty.call(handlers, key)) {
            const handler = handlers[key];
            displayObject.on(key, handler)
        }
    }
}

export {
    render,
    renderer
}
```

## 未完成的部分

上面基本就是我上周周末两天的成果（不知道为什么这点东西需要想这么久，可能是我太菜了吧），上面的渲染器说实话只有首次渲染的功能，同时回避了组件，响应式这两个同样极其重要的概念。我太菜了，真的是想不出来了，我不知道怎么写下去了，无论是结合PIXIJS制作游戏，或者是制作游戏这件事本身。
下面是利用VDOM和renderer写的一个组件(其实就是地板了)

```javascript
import { Grid } from "../core/ExtensionClass.js"
import { MySprite, Vector2 } from "../core/BasicClass.js"
import { render } from "../core/renderer.js"
import { handController } from "../utils/hand.js"

const option = {
    row: 5,
    col: 9,
    cellWidth: 120,
    cellHeight: 150
}

const config = {
    name: 'floor',
    props: {
        position: new Vector2(100, 200),
        eventMode: 'static',
        [Symbol.for('handlers')]: {
            pointerdown(e) {
                if (handController.hasObject()) {
                    const { position } = this
                    const { x, y } = e
                    const localX = x - position.x
                    const localY = y - position.y
                    const i = Math.floor(localY / option.cellHeight)
                    const j = Math.floor(localX / option.cellWidth)
                    if (floorController.isCellEmty(i, j))
                        floorController.fillCell(i, j)
                }
            }
        }
    }
}

const children = []
for (let i = 0; i < option.row; i++) {
    for (let j = 0; j < option.col; j++) {
        children.push(new MySprite({
            name: 'cell',
            props: {
                path: (i + j) % 2 === 0 ? '/assets/img/dark.png' : '/assets/img/light.png'
            },
            state: {
                isEmpty: true
            }
        }))
    }
}
config.children = children

const templateObject = new Grid(option, config)
const vnode = templateObject.render()
const view = render(vnode)
const model = {
    ...vnode,
    getCell(i, j) {
        return this.children[i * option.col + j]
    },
    fillCell(i, j, vnode) {
        const cell = this.getCell(i, j)
        cell.state.isEmpty = false
        if (!Array.isArray(cell.children)) {
            cell.children = [vnode]
        } else {
            cell.children.push(vnode)
        }
    },
    clearCell() {
        const cell = this.getCell(i, j)
        cell.state.isEmpty = true
        cell.children.pop()
    }
}

const floorController = {
    isCellEmty(i, j) {
        return model.getCell(i, j).state.isEmpty
    },
    fillCell(i, j) {
        const vnode = handController.releaseObject()
        model.fillCell(i, j, vnode)
        const childView = render(vnode)
        childView.position = {
            x: 1,
            y: 1
        }
        view.children[i * option.col + j].addChild(childView)
    }
}

export {
    floorController
}
```

结合了一点MVC，虽然我不是很懂，但也算是把所谓的业务逻辑写在了controller里面了，提供外部使用。我很困惑，我发现这种方式还是不够好用，但我又暂时想不到更好的办法，目前这就是我全部的理解。

## 之后的计划

1. 首先想做的就是完善渲染器
2. 然后就是抽离出场景管理器，游戏对象管理器，UI等等

简单说一下都有哪些把。在一个场景树中，有许多个container，每个container同样也是树。我可以修改每个结点的属性，添加节点，删除节点，移动节点(说白了就是增删改查来着）。但这其中需要注意的就是算法的复杂度了。

而所谓的场景管理器，也就是把常见的主关卡，主菜单，以及一些常用的UI和组件结合起来统一管理。这也是我目前希望能够把组件这个概念给完善的理由，如果时间充足的话，如果真的搭建出一个较为满意的架子，后续开发的进度就会快上一些了把。

不管怎么样，我都希望自己能够沉下心来，好好的完结这个小目标！绝对不要放弃！
