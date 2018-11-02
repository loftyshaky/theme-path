const { join } = require('path');
const { spawn } = require('child_process');

const webpack = require('webpack');
const merge = require('webpack-merge');
const Write_file_webpack_plugin = require('write-file-webpack-plugin'); // needed to create bundle folder and its content on npm start after it was deleted by clean_webpack_plugin

const shared = require(join(__dirname, 'webpack.shared.js')); // eslint-disable-line import/no-dynamic-require

//--

module.exports = merge(shared, {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new Write_file_webpack_plugin(),
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
                'electron --inspect=5858 ./main.js',
                ['.'],
                { shell: true, env: process.env, stdio: 'inherit' },
            )
                .on('close', () => process.exit(0))
                .on('error', spawnError => console.error(spawnError));
        },
    },
});
