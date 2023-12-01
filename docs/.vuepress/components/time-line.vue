<template>
    <div>
        <ul>
            <li v-for="(post,idx) in initList" :key="idx">
                <p>
                    {{ post }}
                </p>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { malou } from '../.temp/malou.js'
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
const myMalou = malou as Array<post>
const initList = myMalou.filter(post => post.path !== '/' && !post.path.includes('404'))
</script>

<style scoped lang="scss">
</style>../types/type.js