import { defineUserConfig } from 'vuepress'
import { defaultTheme } from 'vuepress'
import myPlugin from './myPlugin/my-plugin.js'


export default defineUserConfig({
    lang: 'zh-CN',
    title: 'Laix\'s blog',
    description: '这是我的第一个博客',
    base: '/blog/',
    head: [['link', { rel: 'apple-touch-icon', href: '/blog/apple-touch-icon.png' }]],
    markdown: {
        breaks: true
    },
    theme: defaultTheme({
        // 默认主题配置
        navbar: [
            {
                text: '首页',
                link: '/',
            },
            {
                text: '归档',
                link: '/timeline.md'
            },
            {
                text: '关于',
                link: '/about.md'
            }
        ],
        repo: 'https://github.com/Laic7092/blog',
        editLink: false
    }),
    plugins: [
        myPlugin()
    ]
})