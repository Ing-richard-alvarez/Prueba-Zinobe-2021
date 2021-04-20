const path = require('path');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = [
    {
        mode: "development",
        entry: {
            index: './resources/assets/js/index.js',
            login: './resources/assets/js/login.js',
            register: './resources/assets/js/register.js',
        },
        output: {
            filename: '[name].js',
            path: __dirname + '/public/dist/js',
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    issuer: [ /\.css$/, path.resolve(__dirname, "./resources/assets/css") ],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            'plugins': ['lodash'],
                            'presets': [['@babel/preset-env', {
                                targets: [
                                'last 2 versions',
                                'not dead',
                                '> 0.2%',
                                'not ie 11'
                                ],
                                useBuiltIns: 'entry',
                                corejs: 3            
                            }]]
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                    // [style-loader](/loaders/style-loader)
                    { loader: 'style-loader' },
                    // [css-loader](/loaders/css-loader)
                    {
                        loader: 'css-loader',
                        options: {
                        modules: true
                        }
                    },
                    // [sass-loader](/loaders/sass-loader)
                    { loader: 'sass-loader' }
                    ]
                }
            ]
        },
        'plugins': [
            new LodashModuleReplacementPlugin({
                'collections': true,
                'paths': true
            })
        ],
        optimization: {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                parallel: true,
              }),
            ],
        },
    
    },
    {
        mode: "development",
        entry: {
            index: './resources/assets/css/index.scss',
            login: './resources/assets/css/login.scss',
            register: './resources/assets/css/register.scss',
        },
        output: {
            filename: '[name].css',
            path: __dirname + '/public/dist/css',
        },
        module: {
            rules: [
                {
                    test: /\.(scss|css)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],

                    exclude: /node_modules/
                },
            ]
        }
    }
]
