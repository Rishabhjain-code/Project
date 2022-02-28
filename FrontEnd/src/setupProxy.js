const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://socio-backe.herokuapp.com',
            changeOrigin: true,
        })
    );
};