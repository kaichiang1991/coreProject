const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReplaceInFilePlugin = require('replace-in-file-webpack-plugin')
const path = require('path');
const {merge} = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
    mode: 'production',

    entry: {
        index: path.resolve(__dirname, 'index.ts')
    },

    output: {
        path: path.resolve(__dirname, 'dist', 'Release'),
        filename: '[name].js'
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
        new CleanWebpackPlugin(),
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
        }])
    ],

    // 不要打包進 bundle 的 module, 會在 runtime 時引入
    externals: {
        'pixi.js-legacy': 'PIXI'
        // ToDo gsap 的引用
    }
})