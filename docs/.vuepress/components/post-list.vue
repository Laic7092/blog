<template>
    <div>
        <div class="section1">
            <div class="post-list">
                <h3 class="flex-row-lc">
                    <span>Posts</span>
                    <SearchBox style="font-size:0.8rem" />
                </h3>

                <ul>
                    <li v-for="(post, idx) in filterList" :key="idx">
                        <div class="el-card mgb-20">
                            <header>
                                <router-link :to="post.path">{{ post.title }}</router-link>
                            </header>
                            <!-- <p class="content" v-html="post.contentRendered"></p> -->
                            <p class="content" v-text="post.contentRendered" style="white-space: pre-line;"></p>
                            <!-- <p class="content">
                                {{ post.contentRendered }}
                            </p> -->
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
                    <span v-if="filterParam.tags">{{ filterParam.tags }}</span>
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
import { ref, computed } from 'vue';
import { malou } from '../.temp/malou'
// import { inject } from 'vue'

// const message: any = inject('router')
// const route = message.currentRoute
// console.log(route.value);


// 去掉首页和404页面
const myMalou = malou as Array<post>
const initList = myMalou.filter(post => post.path !== '/' && !post.path.includes('404'))
// 截取部分内容
const fullList = initList.map(post => {
    const { contentRendered, createTm } = post
    if (contentRendered) {
        // 去除 HTML 标签和换行符，并替换 # 和空格#
        let processedString = contentRendered.replace(/<\/?[^>]+>/g, '').replace(/[\r\n]+/g, '').replace(/# | #/g, '');
        // 截取前 50 个字符
        post.contentRendered = processedString.slice(0, 50);
    }
    if (createTm)
        post.createTm = createTm.split('T')[0] ?? ''
    return post
})
console.log('full', fullList)

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
            return post.tags.indexOf(tags) === -1
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

<style scoped lang="scss">
.dark .malou {
    // background-image: url('/images/heroImage.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
    background-size: cover;
    background-color: var(--el-bg-color);
}

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


.el-card {
    --el-card-border-color: var(--el-border-color-light);
    --el-card-border-radius: 4px;
    --el-card-padding: 20px;
    --el-card-bg-color: var(--el-fill-color-blank)
}

.el-card {
    border-radius: var(--el-card-border-radius);
    border: 1px solid var(--el-card-border-color);
    padding: var(--el-card-padding);
    background-color: var(--el-card-bg-color);
    // background-color: var(--el-bg-color-page);
    overflow: hidden;
    color: var(--el-text-color-primary);
    transition: var(--el-transition-duration);
    box-shadow: var(--el-box-shadow-light);
}

.el-tag {
    --el-tag-bg-color: var(--el-color-primary-light-9);
    --el-tag-border-color: var(--el-color-primary-light-8);
    --el-tag-hover-color: var(--el-color-primary);
    --el-tag-text-color: var(--el-color-primary);
    background-color: var(--el-tag-bg-color);
    border-color: var(--el-tag-border-color);
    color: var(--el-tag-text-color);
    display: inline-flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    height: 1.5rem;
    padding: 0 0.6rem;
    font-size: var(--el-tag-font-size);
    line-height: 1;
    border-width: 1px;
    border-style: solid;
    border-radius: var(--el-tag-border-radius);
}

html.dark .el-card {
    --el-card-bg-color: var(--el-bg-color-overlay)
}
</style>