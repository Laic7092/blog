<template>
    <div>
        <div class="section1">
            <div class="post-list">
                <h3>Posts</h3>
                <ul>
                    <li v-for="(post, idx) in filterList" :key="idx">
                        <article class="el-card mgb-20">
                            <header>
                                <router-link :to="post.path">{{ post.title }}</router-link>
                            </header>
                            <p class="content" v-text="post.contentRendered" style="white-space: pre-line;"></p>
                            <footer>
                                <div class="row">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" class="feather feather-navigation">
                                        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                                    </svg>
                                    <span>abc</span>
                                </div>
                                <div class="row">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" class="feather feather-tag">
                                        <path
                                            d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z">
                                        </path>
                                        <line x1="7" y1="7" x2="7" y2="7"></line>
                                    </svg>
                                    <span class="el-tag1 mgr-10" v-for="(tag, idx) in post.tags" :key="idx">{{
                                            tag
                                        }}</span>
                                </div>
                                <div class="row">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                         stroke-linejoin="round" class="feather feather-clock">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <time pubdate>{{ post.date }}</time>
                                </div>
                            </footer>
                        </article>
                    </li>
                </ul>
            </div>
            <div class="tag-list">

                <div>
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
                            <input type="button" @click="filterPost(classify[0])"
                                   :value="classify[0] + '(' + classify[1] + ')'" class="el-tag">
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {RouterLink} from "vue-router";
import {ref, computed} from 'vue';
import initList from './malou.js'
// 截取部分内容
const fullList = initList.map(post => {
    const {contentRendered} = post
    if (contentRendered) {
        // 去除 HTML 标签和换行符，并替换 # 和空格#
        let processedString = contentRendered.replace(/<\/?[^>]+>/g, '').replace(/[\r\n]+/g, '').replace(/# | #/g, '');
        // 截取前 50 个字符
        post.contentRendered = processedString.slice(0, 75);
    }
    return post
})

const filterParam = ref({
    tags: ''
})

const filterPost = (classify: string) => {
    filterParam.value.tags = classify
}

const filterList = computed(() => {
    const {tags} = filterParam.value
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
    return (a, b) => {
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

<style lang="scss">
@media (min-width: 959px) {
    .dark .malou {
        background-image: url('/images/heroImg.jpg');
    }

    .malou {
        background-image: url('/images/heroImgLight.jpg');
        background-repeat: no-repeat;
        background-position: center center;
        background-attachment: fixed;
        background-size: cover;
    }
}

.malou {
    background-color: var(--el-bg-color);
}

.section1 {
    display: flex;
    // font-size: 14px;
    .post-list {
        flex: 3;

        .row {
            display: inline-flex;
            width: 33.33%;
            align-items: center;
        }

        @media (max-width: 419px) {
            .row {
                display: flex;
                width: 100%;
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

.feather {
    width: 1rem;
    height: 1rem;
    margin-right: 5px;
}

.content {
    margin: 5px 0;
}
</style>