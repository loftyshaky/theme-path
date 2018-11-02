const { join } = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const Mini_css_extract_plugin = require('mini-css-extract-plugin');

const shared = require(join(__dirname, 'webpack.shared.js')); // eslint-disable-line import/no-dynamic-require

//--

module.exports = merge(shared, {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [Mini_css_extract_plugin.loader, { loader: 'css-loader' }],
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new Mini_css_extract_plugin(),
    ],

    stats: {
        colors: true,
        children: false,
        chunks: false,
        modules: false,
    },
});
