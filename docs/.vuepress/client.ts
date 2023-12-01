import { defineClientConfig } from '@vuepress/client'
import { provide } from 'vue'
import postList from './components/post-list.vue'
import timeLine from './components/time-line.vue'
import Layout from './layouts/layout.vue'


export default defineClientConfig({
  enhance({ app, router, siteData }) {
    // console.log(app, 'app');
    // console.log(router, 'router');
    // console.log(router.getRoutes(), 'routes');
    // console.log(siteData, 'siteData');
    app.component('postList', postList)
    app.component('timeLine', timeLine)
    app.provide('router', router)
    app.provide('siteData', siteData)
  },
  setup() {
    provide('count', 5)
  },
  layouts: {
    Layout
  },
  rootComponents: [],
})
