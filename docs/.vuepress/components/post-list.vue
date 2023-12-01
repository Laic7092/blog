<template>
    <div>
        <div class="section1">
            <div class="post-list">
                <h3>Posts</h3>
                <ul>
                    <li v-for="(post, idx) in filterList" :key="idx">
                        <div class="el-card mgb-20">
                            <header>
                                <router-link :to="post.path">{{ post.title }}</router-link>
                            </header>
                            <p class="content" v-text="post.contentRendered" style="white-space: pre-line;"></p>
                            <footer>
                                <div class="footer-tags" v-if="Array.isArray(post.tags)">
                                    <span class="mgr-10">
                                        标签:
                                    </span>
                                    <span class="el-tag mgr-10" v-for="(tag, idx) in post.tags" :key="idx">{{
                                        tag
                                    }}</span>
                                </div>
                                <span>创建时间: {{ post.date || '暂无' }}</span>
                            </footer>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="tag-list">

                <div class="flex-row-lc form-header">
                    <h3>Tags</h3>
                    <span v-if="filterParam.tags" class="el-tag is-round deletable mgl-10">
                        <span>{{ filterParam.tags }}</span>
                        <span class="del-btn" @click="filterPost('')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                                <path fill="currentColor"
                                    d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z">
                                </path>
                            </svg>
                        </span>
                    </span>
                </div>
                <div class="el-card">
                    <ul>
                        <li v-for="(classify, idx) in classifyList" :key="idx" class="mgb-20">
                            <input type="button" @click="filterPost(classify[0])" :value="classify[0] + '(' + classify[1] + ')'" class="el-tag">
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
    date?: string;
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
    date: string;
}
import { ref, computed } from 'vue';
import { malou } from '../.temp/malou.js'
// import { inject } from 'vue'

// const message: any = inject('router')
// const route = message.currentRoute
// console.log(route.value);


// 去掉首页和404页面
const myMalou = malou as Array<post>
const initList = myMalou.filter(post => post.path !== '/' && !post.path.includes('404'))
// 截取部分内容
const fullList = initList.map(post => {
    const { contentRendered, date } = post
    if (contentRendered) {
        // 去除 HTML 标签和换行符，并替换 # 和空格#
        let processedString = contentRendered.replace(/<\/?[^>]+>/g, '').replace(/[\r\n]+/g, '').replace(/# | #/g, '');
        // 截取前 50 个字符
        post.contentRendered = processedString.slice(0, 50);
    }
    if (date)
        post.date = date.split('T')[0] ?? ''
    return post
})
// console.log('full', fullList)

const filterParam = ref({
    tags: ''
})

const filterPost = (classify: string) => {
    filterParam.value.tags = classify
}

const filterList = computed(() => {
    const { tags } = filterParam.value
    let res = fullList
    if (tags !== '') {
        res = fullList.filter(post => {
            return post.tags.indexOf(tags) !== -1
        })
    }
    return res.sort(sort('dec'))
})

const sort = (flag: string) => {
    const inc = flag === 'inc' ? 1 : -1
    return (a: post, b: post) => {
        // 返回值应该是一个数字，其正负性表示两个元素的相对顺序
        // > 0	a 在 b 后，如 [b, a]
        // < 0	a 在 b 前，如 [a, b]
        if (a.date === '') return 1
        if (b.date === '') return -1
        const ymd1 = a.date?.split('-')
        const ymd2 = b.date?.split('-')
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
        const { tags } = post
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

<style lang="scss">
.malou {
    background-image: url('/images/heroImgLight.jpg');
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
    background-size: cover;
    background-color: var(--el-bg-color);
}

.dark .malou {
    background-image: url('/images/heroImg.jpg');
}

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
        margin-left: 2rem;
    }

    @media (max-width: 719px) {
        .tag-list {
            display: none;
        }
    }
}

.del-btn {
    height: 1em;
    width: 1em;
    margin-left: 0.5rem;
    cursor: pointer;
    border-radius: var(--el-tag-border-radius-rounded);
}

.del-btn:hover {
    background-color: var(--el-color-primary-light-5);
}

.flex-row-lc {
    display: flex;
    align-items: baseline;
}
</style>