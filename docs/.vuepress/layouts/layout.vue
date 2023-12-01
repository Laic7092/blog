<script setup lang="ts">
import { usePageData } from '@vuepress/client'
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
const page = usePageData()

const getYearMonDay = (date: Date) => {
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    return `${y}-${m}-${d}`
}

const getDateString = (date: string | Date | undefined) => {
    if (typeof date === 'string') {
        return getYearMonDay(new Date(date))
    } else if (date instanceof Date) {
        return getYearMonDay(date)
    } else {
        return "0000-00-00"
    }
}

const subscribe = () => {
    alert('敬请期待')
}
</script>

<template>
    <div>
        <ParentLayout>
            <template #page-content-top>
                <div class="content-top">
                    <h1>{{ page.title }}</h1>
                    <div class="mgb-10">
                        <span>Tags: </span>
                        <span v-for="(tag, idx) in page.frontmatter.tags" :key="idx" class="el-tag mgl-10">{{ tag }}</span>
                    </div>
                    <div>
                        <span>Date: </span>
                        <span class="mgl-10">{{ getDateString(page.frontmatter.date) }}</span>
                    </div>
                </div>
            </template>
            <template #page-content-bottom>
                <div class="mgb-20">
                    <input class="el-button el-button--primary mgr-10" type="button" value="点赞" @click="subscribe">
                    <input class="el-button el-button--primary" type="button" value="转发" @click="subscribe">
                </div>
                <div>
                    <form action="">
                        <label for="malou" class="mgr-10">Email: </label>
                        <input type="email" name="malou" id="malou" placeholder="请输入邮箱" class="el-input-inner mgr-10">
                        <input class="el-button el-button--primary" type="button" value="订阅内容" @click="subscribe">
                    </form>
                </div>
            </template>
        </ParentLayout>
    </div>
</template>

<style lang="scss">

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