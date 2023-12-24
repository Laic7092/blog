import { usePagesData } from '@vuepress/client'

const getPages = async () => {
    let res = []
    const object = usePagesData().value
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            const f = object[key];
            const page = await f()
            res.push(page)
        }
    }
    return res
}
const pages = await getPages()

export default pages