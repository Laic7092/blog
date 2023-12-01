import { defineClientConfig } from '@vuepress/client'
import postList from './components/post-list.vue'
import timeLine from './components/time-line.vue'
import Layout from './layouts/layout.vue'


export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('postList', postList)
    app.component('timeLine', timeLine)
    // app.provide('router', router)
    // app.provide('siteData', siteData)
  },
  setup() {},
  layouts: {
    Layout
  },
  rootComponents: [],
})
