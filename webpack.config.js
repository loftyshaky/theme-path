const { join, resolve } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LicensePlugin = require('webpack-license-plugin');

const { Dependencies } = require('./js/dependencies');

const dependencies = new Dependencies();

// -

module.exports = (env) => {
    const output_dir = env.packing ? 'bundle' : join('resources', 'app', 'bundle');

    return {
        entry: {
            index: join(__dirname, 'src', 'js', 'index.js'),
        },

        output: {
            filename: '[name].js',
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
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
            new MiniCssExtractPlugin(),
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
                        from: join(__dirname, 'src', 'css', 'locale_css'),
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
            {
                apply: (compiler) => {
                    compiler.hooks.done.tap('done', () =>
                        dependencies.add_missing_dependesies(output_dir),
                    );
                },
            },
            new LicensePlugin({
                outputFilename: 'dependencies.json',
                replenishDefaultLicenseTexts: true,
                licenseOverrides: {
                    'exif-parser@0.1.12': 'MIT',
                    'map-stream@0.1.0': 'MIT',
                    'pause-stream@0.0.11': 'MIT',
                },
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
