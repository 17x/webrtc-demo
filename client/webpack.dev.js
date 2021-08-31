const webpack = require('webpack');
const {merge} = require('webpack-merge');
const common = require('./webpack.base.js');
const fs = require('fs');
const ip = require('ip');
const path = require('path');
// const urls = require('./API');
const publicTo = 'cn'
// const {SERVER_URL, apiUrl, fileUrl} = urls[publicTo];
module.exports = merge(common, {
    mode: 'development', // devtool: 'source-map',
    plugins: [
        // new webpack.DefinePlugin({
        //     apiUrl: JSON.stringify(apiUrl),
        //     fileUrl: JSON.stringify(fileUrl),
        //     serverUrl: JSON.stringify(SERVER_URL),
        //     isDev: JSON.stringify(true)
        // }),
        // new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'source-map',
    devServer: {
        host : ip.address(),  // 本来是http://localhost:8080/   换成 http://192.168.10.101:8080/
        compress : false,   // 启动 gzip压缩
        contentBase : './public',
        port : 8083,
        http2 : true,
        https : {
            key : fs.readFileSync('key.pem'),
            cert : fs.readFileSync('cert.pem')
        },
        liveReload : true  // 禁用hot
        // 配置代理,..解决接口跨域
        // proxy : {
        //     // http://192.168.10.101:8080/api
        //     "/api" : {
        //         target: "https://api.github.com",
        //         // http://192.168.10.101:8080/api => https://api.github.com
        //         // pathRewrite : {
        //         //     "^/api" : ""
        //         // },
        //         // 不能使用localhost : 9200作为github的主机名
        //         changeOrigin : true
        //     }
        // }
    },
    // webpack 5
    target : "web"
});

// host : ip.address(),
// hot : true,
// historyApiFallback : true,
//open: true,
// port : 8080
// compress : false,
// stats : { colors : true },
// contentBase : './public/'