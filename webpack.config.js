const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const webpack = require('webpack');

module.exports = env => {
    return {
        entry: './src/client/index.js',

        output: {
            path: path.join(__dirname, 'build'),
            filename: 'bundle.js',
            publicPath: '/',
        },

        devServer: {
            historyApiFallback: true,
        },

        plugins: [
            // define HTML variables
            new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
                ASSETS_PATH: '/assets',
            }),
            // new webpack.DefinePlugin(envKeys(env)),
            new webpack.DefinePlugin({
                'process.env.PORT': JSON.stringify(process.env.PORT),
            }),
        ],

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: {
                                    localIdentName: '[name]__[local]___[hash:base64:5]',
                                },
                            },
                        },
                    ],
                    include: /\.module\.css$/,
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                    exclude: /\.module\.css$/,
                },
                {
                    test: /\.s[ac]ss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
                {
                    test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                    loader: 'url-loader?limit=100000',
                },
            ],
        },
    };
};
