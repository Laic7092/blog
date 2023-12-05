<template>
    <div>
        <div class="malou1"></div>
        <input type="text" placeholder="留下评论">
        <input type="button" value="发送">
        <a :href="authUrl">点击验证github</a>
    </div>
</template>

<script setup lang="ts">
import { usePageData } from '@vuepress/client'
import { computed, inject, ref } from 'vue'
// const router = inject('router')
// console.log(router)
// console.log($router,',???')

const page = usePageData()
const code = ref('')

const host = 'https://laic7092.github.io/blog'
const client_id = 'fe6bcb1d95f275c83276'
const redirect_uri = computed(() => host + page.value.path)
const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri.value}`

const abc = () => {

    const data = {
        code: code.value,
        redirect_uri: redirect_uri.value,
    };

    const urlSearchParams = new URLSearchParams(data); // 将数据转换为 URLSearchParams

    const url = `http://localhost:3000/auth?${urlSearchParams}`; // 构造请求 URL，将数据作为 URL 参数传递
    fetch(url).then(res => {
        console.log(res);

    })
}



</script>

<style scoped></style>