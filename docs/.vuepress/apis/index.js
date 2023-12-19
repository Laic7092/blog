import http from './http.js'
// import { BASE_URL } from './http.js'

const like = (param) => http.post('/blog/like', param)


export {
    like
}