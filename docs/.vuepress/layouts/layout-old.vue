<script setup>
import ParentLayout from '@vuepress/theme-default/layouts/Layout.vue'
import { usePageData } from '@vuepress/client'

const pageData = usePageData()
console.log('pageData', pageData.value);
</script>
<!-- nav和configs.ts中的navbar配置相关,相当于在那个数组的头和尾插入... -->
<!-- navbar
navbar-before
navbar-after -->

<!-- 侧边栏可以理解为,在自动生成的侧边基础上,顶部和底部插入 -->
<!-- sidebar
sidebar-top
sidebar-bottom
page
page-top
page-bottom
page-content-top
page-content-bottom -->

<!-- 页面与内容,咋说呢?vuepress里面有page的概念,forntmatter也可以配置很多信息,那么pagetop与bottom应该是独立与页面的?
内容的话就是md里面的内容,像是title,tag,date这些玩意可以放里面?? -->
<!-- 感觉还是把这些放在pagetop与bottom比较合适?标题,以及最后的评论区啥的? -->
<!-- 那content应该放些啥? -->
<!-- 刚看了眼官网,感觉page的插槽放页面级的东西,比如页面跳转?比如面包屑?搜索框?表单?
content就放内容级的东西,比如title?tag?评论? -->
<!-- 看了一下别人的主题,好像没用content,top放页面信息,btm放评论,那我也照抄!,不用content插槽,除非有后续需要 -->
<!-- <page-top></page-top>
<page>
    <content>
        <content-top></content-top>
        <main></main>
        <content-buttom></content-buttom>
    </content>
</page>
<page-bottom></page-bottom> -->
<template>
    <ParentLayout>
        <!-- <template #navbar-before>
            <div>
                nav-bef
            </div>
        </template>
        <template #navbar-after>
            <div>
                nav-aft
            </div>
        </template> -->

        <!-- <template #sidebar-top>
            <div>
                side-top
            </div>
        </template>

        <template #sidebar-bottom>
            <div>
                side-btm
            </div>
        </template> -->

        <template #page-top>
            <div class="my-footer">page header</div>
        </template>
        <!-- <template #page-content-top>
            <div class="my-footer">content top</div>
        </template>
        <template #page-content-bottom>
            <div class="my-footer">content bottom</div>
        </template> -->
        <template #page-bottom>
            <div class="my-footer">page footer</div>
        </template>
    </ParentLayout>
</template>

<style scoped lang="scss">
.my-footer {
    text-align: center;
}
</style>