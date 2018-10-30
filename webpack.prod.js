const { join } = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const mini_css_extract_plugin = require("mini-css-extract-plugin");

//--

const shared = require(join(__dirname, 'webpack.shared.js'));

module.exports = merge(shared, {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [mini_css_extract_plugin.loader, { loader: 'css-loader' }]
            },
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new mini_css_extract_plugin()
    ],

    stats: {
        colors: true,
        children: false,
        chunks: false,
        modules: false
    }
});