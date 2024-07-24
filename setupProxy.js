const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8887',
            // target: 'http://211.171.152.242:8887',
            changeOrigin: true,
        })
    )
}