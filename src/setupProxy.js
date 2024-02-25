// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(
//     '/api',
//     createProxyMiddleware({
//       target: 'https://api.perplexity.ai',
//       changeOrigin: true,
//       pathRewrite: {'^/api': ''}, // This ensures '/api' is stripped from the forwarded request
//     })
//   );
// };
