const ENV_API_URL = {
    // development: 'http://127.0.0.1:6781/renren-api', //开发环境
    development: 'https://chatgpt.wailikeji.com/renren-api', //开发环境
    production: 'https://chatgpt.wailikeji.com/renren-api', //生产环境
}

const ENV_WS_URL = {
    // development: 'ws://127.0.0.1:6781/renren-api', //开发环境
    development: 'wss://chatgpt.wailikeji.com/renren-api', //开发环境
    production: 'wss://chatgpt.wailikeji.com/renren-api', //生产环境
}

const ENV_IMAGE_URL = {
    development: 'https://wailikeji.oss-cn-beijing.aliyuncs.com/appBaseImage', //开发环境
    production: 'https://wailikeji.oss-cn-beijing.aliyuncs.com/appBaseImage', //生产环境
}

export const BASE_URL = ENV_API_URL[process.env.NODE_ENV]; //后台接口域名
export const BASE_WS = ENV_WS_URL[process.env.NODE_ENV]; //后台websocket域名
export const IMAGE_URL = ENV_IMAGE_URL[process.env.NODE_ENV]; //图片基础地址
