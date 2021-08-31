const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
// const WebpackCleanPlugin = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.base.js');
// const urls = require('./API');

module.exports = (env) => {
    const { goal, copyCore } = env;
    // const { SERVER_URL } = urls[goal];
    // let plugins = [
    //     new webpack.DefinePlugin({
    //         /*apiUrl : JSON.stringify(apiUrl),
    //          fileUrl : JSON.stringify(fileUrl),*/
    //         serverUrl : JSON.stringify(SERVER_URL)
    //     })
    // ];

    if(copyCore){
        // plugins.push(new CopyPlugin({
        //     patterns : [
        //         {
        //             from : path.resolve('../nzx-core/public/bin/'),
        //             to : './plugins/sass/'
        //         }
        //     ]
        // }));
    }

    return merge(
        common,
        {
            mode : 'production',
            // plugins
        }
    );
};