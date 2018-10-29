const { join } = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const mini_css_extract_plugin = require("mini-css-extract-plugin");
const clean_webpack_plugin = require('clean-webpack-plugin');
const write_file_webpack_plugin = require('write-file-webpack-plugin'); // needed to create dist folder and its content on npm start after it was deleted by clean_webpack_plugin

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
        new mini_css_extract_plugin(),
        new clean_webpack_plugin(['resources']),
        new write_file_webpack_plugin()
    ],

    stats: {
        colors: true,
        children: false,
        chunks: false,
        modules: false
    }
});