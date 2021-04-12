const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
    {
        entry: './resources/assets/css/index.scss',
        output: {
            path: path.resolve(__dirname, './public/dist/css'),
            filename: 'index.css'
        },
        module: {
            rules: [
                {
                    test: /\.(scss|css)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                    exclude: /node_modules/
                },
            ]
        },
        mode: "development"
    },
    {
        entry: './resources/assets/js/index.js',
        output: {
            path: path.resolve(__dirname, './public/dist/js'),
            filename: 'index.js'
        },
        resolve: {
            alias: {
              components: path.resolve(__dirname, 'resources/assets/js'),
            },
            extensions: ['.js'],
        },
        module: {
            rules: [
                {
                  test: /\.js$/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env']
                    }
                  },
                  exclude: /node_modules/
                }
            ]
        },
        mode: "development"
    },
    {
        entry: './resources/assets/css/login.scss',
        output: {
            path: path.resolve(__dirname, 'public/dist/css'),
            filename: 'login.css'
        },
        module: {
            rules: [
                {
                    test: /\.(scss|css)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                    exclude: /node_modules/
                },
            ]
        },
        mode: "development"
    },
    {
        entry: './resources/assets/js/login.js',
        output: {
            path: path.resolve(__dirname, './public/dist/js'),
            filename: 'login.js'
        },
        module: {
            rules: [
                {
                  test: /\.js$/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env']
                    }
                  },
                  exclude: /node_modules/
                }
            ]
        },
        mode: "development"
    },
    {
        entry: './resources/assets/css/register.scss',
        output: {
            path: path.resolve(__dirname, './public/dist/css'),
            filename: 'register.css'
        },
        module: {
            rules: [
                {
                    
                    test: /\.(scss|css)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                    exclude: /node_modules/
                    
                },
            ]
        },
        mode: "development"
    },
    {
        entry: './resources/assets/js/register.js',
        output: {
            path: path.resolve(__dirname, './public/dist/js'),
            filename: 'register.js'
        },
        module: {
            rules: [
                {
                  test: /\.js$/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-env']
                    }
                  },
                  exclude: /node_modules/
                }
            ]
        },
        mode: "development"
    }
    
];
