const data = new Map()
// 插件通常需要允许用户传入配置，因此我们一般都会提供给用户一个函数来接收配置
const barPlugin = (options) => {
    return (app) => {
        // console.log('pluginOptions',options)
        // console.log('pluginApp',app)
        return {
            name: 'vuepress-plugin-bar',

            // extendsMarkdownOptions(OPT, APP) {
            //     // console.log('malou',OPT,APP);
            // },
            extendsPageOptions: (pageOptions, app) => {
                if (pageOptions.filePath?.startsWith(app.dir.source('test/'))) {
                    // pageOptions.frontmatter = pageOptions.frontmatter ?? {}
                    // pageOptions.frontmatter.permalinkPattern = '/:year/:month/:day/:slug.html'
                    // console.log(pageOptions);
                    // console.log('malou');
                } else {
                    // console.log(pageOptions.filePath);
                }
            },
            extendsPage: (page) => {
                // console.log('----------------------',page);
                let {frontmatter, path, contentRendered, title, key} = page
                let {tags, createTm} = frontmatter
                // if (frontmatter) {
                //     console.log(title, frontmatter, path);
                // }
                if (tags && typeof tags === 'string') {
                    tags = [tags]
                } else if (!tags){
                    tags = []
                }
                if (!createTm) {
                    createTm = ''
                }
                if (!title) {
                    title = '未命名'
                }
                data.set(key, {frontmatter, path, contentRendered, title, tags, createTm, key})
            },
            // async onInitialized(app) {
            //     app.pages.push(
            //       await createPage(app, {
            //         path: '/foo.html',
            //         content: 'abc',
            //       })
            //     )
            // },
            onPrepared: async (app) => {
                // console.log(data);
                // 写入临时文件
                await app.writeTemp('malou.js', `export const malou = ${JSON.stringify(Array.from(data).map(item => item[1]))}`)
            },
        }
    }
}

export default barPlugin