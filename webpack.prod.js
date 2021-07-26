const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReplaceInFilePlugin = require('replace-in-file-webpack-plugin')
const path = require('path');
const {merge} = require("webpack-merge");
const common = require("./webpack.common");
const ImageMinimizerPlugin  = require('image-minimizer-webpack-plugin')

module.exports = merge(common, {
    mode: 'production',

    entry: {
        index: path.resolve(__dirname, 'index.ts')
    },

    output: {
        filename: '[name].min.js',
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
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                path.resolve(__dirname, 'dist')
            ],
            cleanAfterEveryBuildPatterns: [
                path.resolve(__dirname, 'dist/types/main.d.ts'),
                path.resolve(__dirname, 'dist/types/Tool/**')
            ]
        }),
        // 處理 .d.ts
        new ReplaceInFilePlugin([{
            dir: path.resolve(__dirname, 'dist'),
            test: /\.d\.ts/,
            rules: [
                // 拿掉 export 詞綴
                {
                    search: /export /g, replace: ''
                },
                //拿掉 import 整行
                {
                    search: /import.*\r\n/g, replace: ''
                }
            ]
        }]),

        new ImageMinimizerPlugin({
            test: /\.(png)$/i,
            minimizerOptions: {
                plugins: [
                    // ['optipng', { optimizationLevel: 5 }]
                    'pngquant'
                ]
            }
        })
    ]
})