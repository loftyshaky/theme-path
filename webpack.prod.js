const { join } = require('path');

const webpack = require('webpack');
const { merge } = require('webpack-merge');

const shared = require(join(__dirname, 'webpack.config.js')); // eslint-disable-line import/no-dynamic-require

// --

module.exports = (env) =>
    merge(shared(env), {
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
            }),
        ],

        stats: {
            colors: true,
            children: false,
            chunks: false,
            modules: false,
        },
    });
