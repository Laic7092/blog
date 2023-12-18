const data = new Map()
const pattern = /^(?!\/$|\/[^/]+\.html$).*$/
const barPlugin = () => {
    return () => {
        return {
            name: 'vuepress-plugin-bar',
            extendsPage: (page) => {
                let { frontmatter, path, contentRendered, title, key, date } = page
                let { tags, notPost } = frontmatter
                if (tags && typeof tags === 'string') {
                    tags = [tags]
                } else if (!tags) {
                    tags = []
                }
                if (!title) {
                    title = '未命名'
                }
                if (!notPost || path.match(pattern)) {
                    data.set(key, { frontmatter, path, contentRendered, title, tags, date, key, notPost })
                }
            },
            onPrepared: async (app) => {
                // 写入临时文件
                await app.writeTemp('malou.js', `export const malou = ${JSON.stringify(Array.from(data).map(item => item[1]))}`)
                data.clear()
            },
        }
    }
}

export default barPlugin