const { join } = require('path');
const { spawn } = require('child_process');

const webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin'); // needed to create bundle folder and its content on npm start after it was deleted by clean_webpack_plugin

const shared = require(join(__dirname, 'webpack.shared.js')); // eslint-disable-line import/no-dynamic-require

//--

module.exports = WebpackMerge(shared, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new WriteFileWebpackPlugin(),
    ],

    devtool: 'cheap-module-eval-source-map',

    devServer: {
        stats: {
            colors: true,
            chunks: false,
            children: false,
        },

        before() {
            spawn(
                'electron --inspect=5858 ./main.js --disable-gpu', // fix freezing (hardware acceleration issue) on ubuntu. Also in prod in package.json
                ['.'],
                { shell: true, env: process.env, stdio: 'inherit' },
            )
                .on('close', () => process.exit(0))
                .on('error', spawnError => console.error(spawnError)); // eslint-disable-line no-console
        },
    },
});
