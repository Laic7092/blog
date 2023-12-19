<script setup lang="ts">
import { usePageData } from '@vuepress/client'
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import { computed, ref } from "vue"
import { like } from '../apis/index.js';

const page = usePageData()
// console.log(page.value, 'malou')
const notPost = computed(() => {
  const { frontmatter } = page.value
  const { notPost } = frontmatter
  return notPost
})

const key = computed(() => {
  const { key } = page.value
  return key
})
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

const likeThePost = async () => {
  const res = await like({ id: key })
  console.log(res)
}
</script>

<template>
  <div>
    <ParentLayout>
      <template #page-content-top v-if="notPost !== true">
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
      <template #page-content-bottom v-if="notPost !== true">
        <div class="mgb-20">
          <input class="el-button el-button--primary mgr-10" type="button" value="点赞" @click="likeThePost">
          <input class="el-button el-button--primary" type="button" value="转发" @click="subscribe">
        </div>
      </template>
    </ParentLayout>
  </div>
</template>

<style lang="scss">
.el-input-inner {
  font-size: inherit;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: none;
  box-sizing: border-box;
}
</style>