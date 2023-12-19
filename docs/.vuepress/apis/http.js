const http = () => {
    return {
        async get(url) {
            return fetch(checkFullUrl(url)).then((Response) => {
                const { status, body } = Response
                return { code: status, data: body }
            })
        },
        async post(url, param, headers) {
            return fetch(checkFullUrl(url), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                body: JSON.stringify(param) // 替换为实际的请求参数
            }).then(async (Response) => {
                const data = await Response.json()
                const { status } = Response
                return { code: status, data }
            })
        }
    }
}

const checkFullUrl = (url) => url.indexOf('http') !== -1 ? url : BASE_URL + url

export const BASE_URL = 'http://localhost:3000'

// const malou = http();
// console.log(malou)

export default http()
