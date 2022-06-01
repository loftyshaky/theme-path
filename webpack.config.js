const { join, resolve } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// -

module.exports = (env) => {
    const output_dir = env.packing ? 'bundle' : join('resources', 'app', 'bundle');

    return {
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
                    test: /\.css$/,
                    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-inline-loader',
                },
                {
                    test: /\.(png|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                limit: 1000,
                                name: '[name].[ext]',
                            },
                        },
                    ],
                },
            ],
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: join(__dirname, 'src', 'html', 'index.html'),
                filename: 'index.html',
                chunks: ['index'],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: join(__dirname, 'src', 'css', 'mods'),
                        to: join(__dirname, output_dir),
                    },
                    {
                        from: join(__dirname, 'src', 'Roboto-Light.ttf'),
                        to: join(__dirname, output_dir),
                    },
                    {
                        from: join(__dirname, 'src', 'new_theme'),
                        to: join(__dirname, output_dir, 'new_theme'),
                    },
                    {
                        from: join(__dirname, 'src', 'help_imgs'),
                        to: join(__dirname, output_dir, 'help_imgs'),
                    },
                ],
            }),
            new CleanWebpackPlugin({
                verbose: true,
                cleanStaleWebpackAssets: false,
                cleanOnceBeforeBuildPatterns: [
                    join(__dirname, 'dist'),
                    join(__dirname, 'bundle'),
                    join(__dirname, 'resources'),
                ],
            }),
        ],

        resolve: {
            alias: {
                package_json: join(__dirname, 'package.json'),
                x: join(__dirname, 'src', 'js', 'x'),
                js: join(__dirname, 'src', 'js'),
                components: join(__dirname, 'src', 'js', 'components'),
                locales: join(__dirname, 'src', 'locales'),
                css: join(__dirname, 'src', 'css'),
                locale_css: join(__dirname, 'src', 'css', 'locale_css'),
                svg: join(__dirname, 'src', 'svg'),
            },
            extensions: ['.js', '.jsx', '.css', '.svg', '.png', '.gif'],
        },

        target: 'electron-renderer',
        node: {
            __dirname: false,
            __filename: false,
        },
        externals: {
            fsevents: 'require("fsevents")', // needed to prevent compilation error on Mac
            archiver: "require('archiver')",
        },
    };
};
