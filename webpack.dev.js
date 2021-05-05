const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const {merge} = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
    mode: 'development',
    devtool: "eval-cheap-source-map",
    watch: true,

    entry: {
        index: path.resolve(__dirname, 'index.ts'),
        test: path.resolve(__dirname, 'main.ts')
    },

    output: {
        path: path.resolve(__dirname, 'dist', 'Debug'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.dev.json'
                    }
                }]
            }
        ]
    },


    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, 'dist', 'Debug', 'index.html'),
            template: 'template.cshtml'
        })
    ]
})