const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const {merge} = require("webpack-merge");
const common = require("./webpack.common");
const ImageMinimizerPlugin  = require('image-minimizer-webpack-plugin')

module.exports = merge(common, {
    mode: 'production',

    output: {
        path: path.resolve(__dirname, 'dist/Release'),
        filename: '[name].[fullhash].bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.json'
                    }
                }]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, 'dist/Release/index.html'),
            template: 'template.cshtml'
        }),
        new CleanWebpackPlugin(),
        new ImageMinimizerPlugin({
            test: /\.(png)$/i,
            minimizerOptions: {
                plugins: [
                    ['optipng', { optimizationLevel: 5 }]
                ]
            }
        })
    ]
})