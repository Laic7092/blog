<template>
    <div>
        <div class="section1">
            <div class="post-list">
                <h3 class="flex-row-lc">
                    <span>Posts</span>
                    <SearchBox style="font-size:0.8rem"/>
                </h3>

                <ul>
                    <li v-for="(post, idx) in filterList.slice(0,5)" :key="idx">
                        <div class="el-card mgb-20">
                            <header>
                                <router-link :to="post.path">{{ post.title }}</router-link>
                            </header>
                            <p class="content" v-html="post.contentRendered"></p>
                            <footer>
                                <div class="footer-tags" v-if="Array.isArray(post.tags)">
                                    <span class="mgr-10">
                                        标签:
                                    </span>
                                    <span class="el-tag mgr-10" v-for="(tag, idx) in post.tags" :key="idx">{{
                                            tag
                                        }}</span>
                                </div>
                                <span>创建时间: {{ post.createTm || '暂无' }}</span>
                            </footer>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="tag-list">
                <h3 class="flex-row-lc">
                    <span class="mgr-10">Tags</span>
                    <span v-if="filterParam.tags">{{filterParam.tags}}</span>
                </h3>
                <div class="el-card">
                    <ul>
                        <li v-for="(classify, idx) in classifyList" :key="idx" class="mgb-20"
                            @click="filterPost(classify[0])">
                            <input type="button" :value="classify[0] + '(' + classify[1] + ')'" class="el-tag">
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
type frontmatter = {
    title?: string;
    createTm?: string;
    tags?: Array<string>;
    [key: string]: any;
}

type post = {
    key: string;
    path: string;
    frontmatter?: frontmatter;
    contentRendered?: string;
    title: string;
    tags: Array<string>;
    createTm: string;
}
import {ref, computed} from 'vue';
import {malou} from '../.temp/malou'
// import { inject } from 'vue'

// const message: any = inject('router')
// const route = message.currentRoute
// console.log(route.value);


// 去掉首页和404页面
const initList: Array<post> = malou.filter(post => post.path !== '/' && !post.path.includes('404'))
// 截取部分内容
const fullList = initList.map(post => {
    const {contentRendered,createTm} = post
    post.contentRendered = contentRendered.slice(0, 50)
    post.createTm = createTm.split('T')[0] ?? ''
    return post
})
// 未设置时间内容
const unknowList = fullList.filter(post => {
    return post.createTm === ''
})
// console.log('unknow',unknowList)
// console.log('full', fullList)

const filterParam = ref({
    tags: ''
})

const filterPost = (classify) => {
    filterParam.value.tags = classify
}

const filterList = computed((): Array<post> => {
    const {tags} = filterParam.value
    let res = fullList
    if (tags !== '') {
        res = fullList.filter(post => {
            return post.tags.indexOf(tags) === -1
        })
    }
    return res.sort(sort('dec'))
})

const sort = (flag: string) => {
    const inc = flag === 'inc' ? 1 : -1
    return (a, b) => {
        // 返回值应该是一个数字，其正负性表示两个元素的相对顺序
        // > 0	a 在 b 后，如 [b, a]
        // < 0	a 在 b 前，如 [a, b]
        if (a.createTm === '') return 1
        if (b.createTm === '') return -1
        const ymd1 = a.createTm?.split('-')
        const ymd2 = b.createTm?.split('-')
        let i = 0
        let res = 0
        while (i < 3) {
            if (ymd1[i] === ymd2[i])
                i++
            else {
                res = parseInt(ymd1[i]) > parseInt(ymd2[i]) ? inc : -inc
                i = 99
            }
        }
        return res
    }
}

const map = new Map()
const classifyList = computed(() => {
    fullList.forEach(post => {
        const {tags} = post
        tags.forEach(tags => {
            if (map.has(tags)) {
                map.set(tags, map.get(tags) + 1)
            } else {
                map.set(tags, 1)
            }
        });
    })
    return Array.from(map).map(item => {
        // return item[0] + `(${item[1]})`
        return item
    })
})
// console.log(classifyList.value, 'classify');
</script>

<style scoped lang="scss">
.section1 {
    display: flex;

    .post-list {
        flex: 3;

        .flex-row-lc {
            display: flex;
            align-items: center;
        }

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

    @media (width <=30rem) {
        .tag-list {
            display: none;
        }
    }
}
</style>