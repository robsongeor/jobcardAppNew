const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'index.web.tsx'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'web-dist'),
    },
    resolve: {
        alias: {
            // Redirect react-native imports to react-native-web
            'react-native$': 'react-native-web',
        },
        extensions: [
            '.web.tsx',
            '.web.ts',
            '.tsx',
            '.ts',
            '.web.js',
            '.js',
            '.json',
        ],
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['module:metro-react-native-babel-preset'],
                    },
                },
            },

        ],
    },
    devServer: {
        static: path.join(__dirname, 'public'),
        historyApiFallback: true,
        port: 8080,
        open: true,
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        }),
    ],
};
