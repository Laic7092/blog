<script setup>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import { usePageData } from '@vuepress/client'

const pageData = usePageData()
// console.log('pageData', pageData.value);
const { title, date, tags } = pageData.value.frontmatter
const nDate = new Date(date)

const subscribe = () => {
    alert('骗你的')
}
</script>

<template>
    <ParentLayout>
        <template #page-top>
            <div class="page-top">
                <h1>{{ title }}</h1>
                <div>
                    <ul class="flex-row-lc">
                        <li>Tags: </li>
                        <li v-for="(tag, idx) in tags" :key="idx" class="el-tag mgl-10">{{ tag }}</li>
                    </ul>
                    <span>Date: </span>
                    <span class="mgl-10">{{ nDate }}</span>
                </div>

            </div>
        </template>
        <template #page-bottom>
            <div class="page-bottom">
                <form action="">
                    <label for="malou" class="mgr-10">Email: </label>
                    <input type="email" name="malou" id="malou" placeholder="请输入邮箱" class="el-input-inner mgr-10">
                    <input type="button" value="订阅内容" @click="subscribe">
                </form>
            </div>
        </template>
    </ParentLayout>
</template>

<style lang="scss">
.flex-row-lc {
    display: flex;
    align-items: center;
}

.page-top,
.page-bottom {
    padding: 0 2.5rem;
}

.page-bottom {

}


@media (max-width: 419px) {

    .page-top,
    .page-bottom {
        padding: 0 1.5rem;
    }
}

@media (max-width: 959px) {

    .page-top,
    .page-bottom {
        padding: 0 2rem;
    }
}

.el-input-inner {
    // width: 100%;
    // flex-grow: 1;
    font-size: inherit;
    padding: 0.5rem 1rem;
    // outline: none;
    // border: none;
    border-radius: 4px;
    background: none;
    box-sizing: border-box;
}
</style>