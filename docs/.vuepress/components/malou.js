import { malou } from '../.temp/malou.js'

// type frontmatter = {
//     title?: string;
//     date?: string;
//     tags?: Array<string>;
//     [key: string]: any;
// }
// type post = {
//     key: string;
//     path: string;
//     frontmatter?: frontmatter;
//     contentRendered?: string;
//     title: string;
//     tags: Array<string>;
//     date: string;
// }


// 去掉首页和404页面
const initList = malou.filter(post => post.path !== '/' && post.path.indexOf('404') === -1)

export default initList