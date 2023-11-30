<template>
    <div>
        <div class="section1">
            <div class="post-list">
                <h3>Posts</h3>
                <ul>
                    <li v-for="(post, idx) in malouList" :key="idx">
                        <div class="el-card mgb-20">
                            <header>
                                <router-link :to="post.path">{{ post.title }}</router-link>
                            </header>
                            <p class="content" v-html="post.contentRendered"></p>
                            <footer>
                                <div class="footer-tags">
                                    <span class="mgr-10">
                                        标签:
                                    </span>
                                    <span class="el-tag mgr-10" v-for="(tag, idx) in post.tag" :key="idx">{{ tag }}</span>
                                </div>
                                <span>创建时间: {{ post.createTm || '暂无' }}</span>
                            </footer>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="tag-list">
                <h3>Tags</h3>
                <div class="el-card">
                    <ul>
                        <li v-for="(classify, idx) in classifyList" :key="idx" class="mgb-20" @click="filterPost(classify[0])">
                            <input type="button" :value="classify[0] + '(' + classify[1] + ')'" class="el-tag">
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { malou } from '../.temp/malou'
// import { inject } from 'vue'

// const message: any = inject('router')
// const route = message.currentRoute
// console.log(route.value);

// const base = '/blog'
// import {useRoute} from 'vuerouter'

const initList = malou.filter(post => post.path !== '/' && post.title !== '')
const fullList = initList.map(post => {
    const { createTm, contentRendered, tag } = post
    post.contentRendered = contentRendered.slice(0, 50)
    if (createTm) {
        post.createTm = createTm.split('T')[0]
    }
    if (typeof post.tag === 'string') {
        post.tag = [post.tag]
    }
    return post
})
// console.log('full', fullList);

const filterParam = ref({
    tag: ''
})

const loseList = fullList.filter(post => {
    return !post.createTm
})

const filterList = computed(() => {
    const { tag } = filterParam.value
    let res = fullList
    if (tag) {
        res = fullList.filter(post => tag ? post.tag?.includes(tag) : true)
    }
    return res.filter(post => {
        return post.createTm
    }).sort(sort('dec'))
})

const malouList = computed(() => {
    let a = filterList.value
    a.push(...loseList)
    return a
})

const sort = (flag: string) => {
    const inc = flag === 'inc' ? 1 : -1
    return (a, b) => {
        // 返回值应该是一个数字，其正负性表示两个元素的相对顺序
        const ymd1 = a.createTm?.split('-')
        const ymd2 = b.createTm?.split('-')
        let i = 0
        let res = 0
        while (i < 3) {
            if (ymd1[i] === ymd2[i])
                i++
            else {
                res = parseInt(ymd1[i]) > parseInt(ymd2[i]) ? inc : -inc
                i = 4
            }
        }
        return res
    }
}

const classifyList = computed(() => {
    const map = new Map()
    fullList.forEach((post, idx) => {
        const { key, tag } = post
        tag.forEach(tag => {
            if (map.has(tag)) {
                map.set(tag, map.get(tag) + 1)
            } else {
                map.set(tag, 1)
            }
        });
    })
    return Array.from(map).map(item => {
        // return item[0] + `(${item[1]})`
        return item
    })
})

console.log(classifyList.value, 'classify');


const filterPost = (classify) => {
    filterParam.value.tag = classify
}

</script>

<style scoped lang="scss">
.section1 {
    display: flex;

    .post-list {
        flex: 3;

        .footer-tags {
            span {
                vertical-align: middle;
            }
        }
    }

    .tag-list {
        flex: 1;
        margin: 0 2rem;
    }

    @media (width <= 30rem) {
        .tag-list {
            display: none;
        }
    }
}
</style>