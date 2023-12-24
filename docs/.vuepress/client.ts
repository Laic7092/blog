import { defineClientConfig } from '@vuepress/client'
import postList from './components/post-list.vue'
import timeLine from './components/time-line.vue'
import comment from './components/comment.vue'
import Layout from './layouts/layout.vue'
import pages from './module/page.js'
import { provide } from 'vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('postList', postList)
    app.component('timeLine', timeLine)
    app.component('comment', comment)

    app.provide('msg','hello')
  },
  setup() {
    provide('pages', pages)
  },
  layouts: {
    Layout
  },
  rootComponents: [],
})
