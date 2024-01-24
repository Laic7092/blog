<template>
    <div>
        <h1>归档</h1>
        <div class="flex-r-lc">
            <label for="ym">选择年月</label>
            <input type="month" id="ym" v-model="ym">
        </div>
        <ul>
            <li v-for="(item, idx) in tlArray" :key="idx">
                <h2>
                    <span>{{ item[0] }}年</span>
                </h2>
                <div v-for="(citem, cidx) in item[1]" :key="cidx">
                    <template v-if="citem.length > 0">
                        <h3>
                            {{ cidx + 1 }}月
                        </h3>
                        <div v-for="(ccitem, ccidx) in citem" :key="ccidx">
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
import { ref, computed } from 'vue'
import initList from './malou.js'

const timeline = new Map()
initList.forEach(i => {
    const { title, path } = i
    const date = new Date(i.date)
    const year = date.getFullYear()
    const mon = date.getMonth()
    const day = date.getDate()

    const saved = timeline.has(year)
    const route = { title, path, day }
    if (saved) {
        const curYear = timeline.get(year)
        curYear[mon].push(route)
    } else {
        const ar = new Array(12).fill(0).map(i => [])
        ar[mon].push(route)
        timeline.set(year, ar)
    }
})
const tlArray = computed(() => {
    let ar = Array.from(timeline)
    const param = ym.value.split('-')
    const year = param[0]
    const mon = parseInt(param[1]) - 1
    if (year) {
        ar = ar.filter((i) => i[0].toString() === year)
    }
    if (mon) {
        let mons = ar[0][1]
        ar[0][1] = mons.map((i: any, idx: number) => {
            return idx === mon ? i : []
        })
    }
    return ar
})

const ym = ref('')
</script>

<style scoped lang="scss">
label {
    width: 80px;
    display: inline-block;
}
.flex-r-lc {
    display: flex;
    align-items: center;
}
</style>