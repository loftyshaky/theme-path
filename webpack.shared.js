const path = require('path');
const default_include = path.resolve(__dirname, 'src'); // Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const html_webpack_plugin = require('html-webpack-plugin');
const copy_webpack_plugin = require('copy-webpack-plugin');
const hard_source_webpack_plugin = require('hard-source-webpack-plugin');
const output_dir = process.argv.indexOf('--runs_from_package') > -1 ? 'dist' : 'resources/app/dist';

module.exports = {
    entry: {
        index: path.join(__dirname, 'src', 'js', 'index.js')
    },

    output: {
        filename: 'index.js',
        path: path.resolve(output_dir)
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/, // loader for react
                loader: 'babel-loader'
            },

            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },

            {
                test: /\.(png|gif|ttf)$/,
                loader: 'file-loader?name=[name].[ext]'
            }
        ]
    },

    plugins: [
        new html_webpack_plugin({
            template: path.join(__dirname, 'src', 'html', 'index.html'),
            filename: 'index.html',
            chunks: ['index']
        }),

        new copy_webpack_plugin([
            { from: path.join(__dirname, 'src', 'mods'), to: path.join(__dirname, output_dir) },
            { from: path.join(__dirname, 'src', 'Roboto-Light.ttf'), to: path.join(__dirname, output_dir) },
            { from: path.join(__dirname, 'src', 'new_theme'), to: path.join(__dirname, output_dir + '/new_theme') }
        ]),

        new hard_source_webpack_plugin()
    ],

    resolve: {
        alias: {
            js: path.join(__dirname, 'src', 'js'),
            components: path.join(__dirname, 'src', 'js', 'components'),
            locales: path.join(__dirname, 'src', 'locales'),
            x$: path.join(__dirname, 'src', 'js', 'x.js'),
            css: path.join(__dirname, 'src', 'css'),
            svg: path.join(__dirname, 'src', 'svg'),
        },
        extensions: ['.js', '.svg', '.png', '.gif']
    },

    target: 'electron-renderer',
    node: {
        __dirname: true,
        __filename: true
    }
}