const { join, resolve } = require('path');

const Html_webpack_plugin = require('html-webpack-plugin');
const Copy_webpack_plugin = require('copy-webpack-plugin');
const Clean_webpack_plugin = require('clean-webpack-plugin');

//--

const output_dir = process.argv.indexOf('--packing') > -1 ? 'bundle' : join('resources', 'app', 'bundle');

module.exports = {
    entry: {
        index: join(__dirname, 'src', 'js', 'index.js'),
    },

    output: {
        filename: 'index.js',
        path: resolve(output_dir),
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
            {
                test: /\.(png|gif|ttf)$/,
                loader: 'file-loader?name=[name].[ext]',
            },
        ],
    },

    plugins: [
        new Html_webpack_plugin({
            template: join(__dirname, 'src', 'html', 'index.html'),
            filename: 'index.html',
            chunks: ['index'],
        }),
        new Copy_webpack_plugin([
            { from: join(__dirname, 'src', 'mods'), to: join(__dirname, output_dir) },
            { from: join(__dirname, 'src', 'Roboto-Light.ttf'), to: join(__dirname, output_dir) },
            { from: join(__dirname, 'src', 'new_theme'), to: join(__dirname, output_dir, 'new_theme') },
            { from: join(__dirname, 'src', 'help_imgs'), to: join(__dirname, output_dir, 'help_imgs') },
        ]),
        new Clean_webpack_plugin(['bundle', 'resources']),
    ],

    resolve: {
        alias: {
            x: join(__dirname, 'src', 'js', 'x'),
            js: join(__dirname, 'src', 'js'),
            components: join(__dirname, 'src', 'js', 'components'),
            locales: join(__dirname, 'src', 'locales'),
            css: join(__dirname, 'src', 'css'),
            svg: join(__dirname, 'src', 'svg'),
        },
        extensions: ['.js', '.jsx', '.css', '.svg', '.png', '.gif'],
    },

    target: 'electron-renderer',
};
