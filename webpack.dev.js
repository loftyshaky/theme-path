const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const shared = require(path.join(__dirname, 'webpack.shared.js'));
const { spawn } = require('child_process')

module.exports = merge(shared, {
    module: {
        rules: [
            {
                test: /\.css$/, // loader CSS
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
            },
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],

    devtool: 'cheap-module-eval-source-map',

    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        stats: {
            colors: true,
            chunks: false,
            children: false
        },

        before() {
            spawn(
                'electron --inspect=5858 ./main.js',
                ['.'],
                { shell: true, env: process.env, stdio: 'inherit' }
            )
                .on('close', code => process.exit(0))
                .on('error', spawnError => console.error(spawnError))
        }
    }
});