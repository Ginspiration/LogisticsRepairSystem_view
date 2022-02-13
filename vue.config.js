// eslint-disable-next-line no-unused-vars
//const proxy = require('http-proxy-middleware')

module.exports = {
    devServer: {
        proxy: 'http://127.0.0.1:7999',
    },
}