const { merge } = require('webpack-merge');
const common = require('./webpack.base.js');

module.exports = (env) => {
    return merge(
        common,
        {
            mode : 'production',
            // plugins
        }
    );
};