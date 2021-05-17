const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReplaceInFilePlugin = require('replace-in-file-webpack-plugin')
const path = require('path');
const {merge} = require("webpack-merge");
const common = require("./webpack.common");
const ImageMinimizerPlugin  = require('image-minimizer-webpack-plugin')

module.exports = merge(common, {
    mode: 'production',

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
        new CleanWebpackPlugin(),
        new ImageMinimizerPlugin({
            test: /.png/,
            minimizerOptions: {
                plugins: [
                    ['optipng', { optimizationLevel: 5 }]
                ]
            }
        })
    ]
})