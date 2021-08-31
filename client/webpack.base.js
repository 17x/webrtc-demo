const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const fs = require('fs');
// const urls = require('./API');
const publicTo = 'cn'
// const {SERVER_URL, apiUrl, fileUrl} = urls[publicTo];

let pagesPath = './src/pages';
let arr = [...fs.readdirSync(pagesPath)].filter(item=>{
    console.log(item);
    return item
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
    // new webpack.DefinePlugin({
    //     apiUrl: JSON.stringify(apiUrl),
    //     fileUrl: JSON.stringify(fileUrl),
    //     serverUrl: JSON.stringify(SERVER_URL),
    //     isDev: JSON.stringify(true)
    // }),
    new webpack.ProvidePlugin({
        // favicon : './favicon.ico',
        // qrcode : './qrcode.js'
    }),
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks : 1
    }),
    // new CleanWebpackPlugin(),
/*    new CopyPlugin({
        patterns: [
            {
                from : path.resolve('../nzx-core/public/bin/'),
                to : './plugins/sass/'
            }
        ],
    }),*/
    new MiniCssExtractPlugin()
]);

let modules = {
    rules: [
        {
            /*jsx 使用babel-jsx处理*/
            test : /\.js$/,
            exclude: /(node_modules)|ejs$/,
            use : {
                loader : 'babel-loader'
            }
        },
        {
            test: /\.(png|jpe?g|gif)$/i,
            exclude: /(node_modules)/,
            use: {
                loader: 'file-loader',
                options: {
                    name : 'image/[name].[ext]',
                    // outputPath : 'image/',
                    limit : false,
                    publicPath : './'
                }
            }
            // type : "asset",
            // parser : {
            //     dataUrlCondition : {
            //         maxSize : 8*1024
            //     }
            // },
            // generator : {
            //     filename: "image/[name][ext]"
            // }
        },
        {
            test: /\.(mp4|mp3)$/i,
            exclude: /(node_modules)/,
            use: {
                loader: 'file-loader',
                options: {
                    name : 'image/[name].[ext]',
                    // outputPath : 'image/',
                    limit : false,
                    publicPath : './'
                }
            }
            // type : "asset",
            // parser : {
            //     dataUrlCondition : {
            //         maxSize : 8*1024
            //     }
            // },
            // generator : {
            //     filename: "media/[name][ext]"
            // }
        },
        {
            test: /\.html$/i,
            loader: 'html-loader',
            options: {
                // Disables attributes processing
                sources : {
                    urlFilter : (attribute, value, resourcePath) => {
                        return value.indexOf('plugins/sass/') === -1;
                    }
                },
                esModule : false
            }
        },
        {
            /*scss 从右到左为处理顺序 加载scss postcss 压缩 cssload*/
            test: /\.(scss|css)$/,
            exclude: /(node_modules|swiper-bundle.css) /,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: "./"
                    }
                },
                "css-loader",
                'postcss-loader',
                'sass-loader'
            ]
        },
        {
            /*字体文件复制*/
            test: /\.(woff|eot|ttf|svg)$/i,
            exclude: /node_modules/,
            type : "asset",
            parser : {
                dataUrlCondition : {
                    maxSize : 8*1024
                }
            },
            generator : {
                filename: "fonts/[name][ext]"
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
    alias: {
        sdk: path.resolve(__dirname, '../nzx-lib'),
        sdkCore: path.resolve(__dirname, '../../assets'),
        editor: path.resolve(__dirname, './src/bin/editor/'),
        lib: path.resolve(__dirname, './src/bin/lib/'),
        player: path.resolve(__dirname, './src/bin/player/')
    },
    modules: [path.resolve(__dirname), 'node_modules']
};

module.exports = {
    entry: entrys,
    module: modules,
    plugins: plugins,
    output: output,
    resolve: resolves
};
