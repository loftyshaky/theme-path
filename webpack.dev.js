const { join } = require('path');
const { spawn } = require('child_process');

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin'); // needed to create bundle folder and its content on npm start after it was deleted by clean_webpack_plugin

const shared = require(join(__dirname, 'webpack.config.js')); // eslint-disable-line import/no-dynamic-require

// --

module.exports = (env) =>
    merge(shared(env), {
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('development'),
            }),
            new WriteFileWebpackPlugin(),
        ],

        devtool: 'eval-cheap-module-source-map',

        devServer: {
            port: 8080,
            devMiddleware: {
                writeToDisk: true,
                stats: {
                    colors: true,
                    chunks: false,
                    children: false,
                },
            },

            onBeforeSetupMiddleware: () => {
                spawn(
                    'electron --inspect=5858 ./main.js --disable-gpu', // fix freezing (hardware acceleration issue) on ubuntu. Also in prod in package.json
                    ['.'],
                    { shell: true, env: process.env, stdio: 'inherit' },
                )
                    .on('close', () => process.exit(0))
                    .on('error', (spawnError) => console.error(spawnError)); // eslint-disable-line no-console
            },
        },
    });
