const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const {merge} = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
    mode: 'development',
    devtool: "eval-cheap-source-map",

    watch: true,
    watchOptions: {
        ignored: ['node_modules/**', '**/*.json', '**/*.html']
    },

    output: {
        path: path.resolve(__dirname, 'dist/Debug'),
        filename: '[name].bundle.js'
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
            filename: path.resolve(__dirname, 'dist/Debug/index.html'),
            template: 'template.cshtml'
        }),

        new CopyPlugin({
            patterns: [
                {from: 'Lib/', to: "Lib/", toType: "dir", noErrorOnMissing: true}
            ]
        })
    ]
})