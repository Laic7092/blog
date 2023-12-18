<template>
    <div>
        <ul>
            <li v-for="(item,idx) in tlArray" :key="idx">
                <h2>
                    <span>{{ item[0] }}年</span>
                </h2>
                <div v-for="(citem,cidx) in item[1]" :key="cidx">
                    <template v-if="citem.length > 0">
                        <h3>
                            {{ cidx }}月
                        </h3>
                        <div v-for="(ccitem,ccidx) in citem" :key="ccidx">
                            <div>
                                <router-link :to="ccitem.path">{{ ccitem.title }}</router-link>
                            </div>
                        </div>
                    </template>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import initList from './malou.js'

const timeline = new Map()
initList.forEach(i => {
    const {title, path} = i
    const date = new Date(i.date)
    const year = date.getFullYear()
    const mon = date.getMonth()
    const day = date.getDate()

    const saved = timeline.has(year)
    const rt = {title, path, day}
    if (saved) {
        const curYear = timeline.get(year)
        curYear[mon].push(rt)
    } else {
        const ar = new Array(12).fill(0).map(i => [])
        ar[mon].push(rt)
        timeline.set(year, ar)
    }
})
console.log(timeline)
const tlArray = Array.from(timeline)
console.log(tlArray)
</script>

<style scoped lang="scss">

</style>