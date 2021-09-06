const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const fs = require('fs');

let pagesPath = './src/pages';
let arr = [...fs.readdirSync(pagesPath)].filter(item=>{
    // console.log(item);
    return !item.startsWith('.')
});

let entrys = {};

let plugins = [];

let HWPConfig = {
    // hash: true,
    minify: false,
    inject: false,
    xhtml: true
};

arr.map(k => {
    entrys[k] = `src/pages/${k}/index.js`;

    plugins.push(
        new HtmlWebpackPlugin({
            ...HWPConfig,
            filename : `${ k }.html`,
            template : `src/pages/${ k }/index.html`,
            // chunksSortMode : 'manual',
            chunks : [`src/pages/${ k }/index`, k],
            publicPath : './',
            inject : 'body'
        })
    );
});

plugins.push(...[
    new webpack.ProvidePlugin({
        // favicon : './favicon.ico',
        // qrcode : './qrcode.js'
    }),
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks : 1
    }),
    new MiniCssExtractPlugin()
]);

let modules = {
    rules : [
        {
            /*jsx 使用babel-jsx处理*/
            test : /\.js$/,
            exclude : /(node_modules)|ejs$/,
            use : {
                loader : 'babel-loader'
            }
        },
        {
            test : /\.html$/i,
            loader : 'html-loader'
        },
        {
            test : /\.(mp4)$/i,
            exclude : /node_modules/,
            use : {
                loader : 'file-loader',
            }
        }
    ]
};

let output = {
    // clean : true,
    filename: '[name].js', // chunkFilename : '[name].[hash].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
    // publicPath : ''

};
let resolves = {
    alias: {},
    modules: [path.resolve(__dirname), 'node_modules']
};

module.exports = {
    entry: entrys,
    module: modules,
    plugins: plugins,
    output: output,
    resolve: resolves
};
