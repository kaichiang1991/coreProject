const path = require('path')
const {name} = require('./package.json')
const webpack = require('webpack')
const md5 = require('md5-dir')

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'src/index.ts')
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'assets'),
            '@root': path.resolve(__dirname)
        },
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            // 其他資源
            {
                test: /\.(jpe?g|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[path][hash][ext]'
                }
            },
            {
                test: /\.(png|webp)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[path][name][ext]'
                }
            },
            {
                test: /\.(json|atlas)$/i,
                resourceQuery: { not: [/edit/] },   // 如果要直接 import 原檔內容的，在 query 的地方加上 eidt  e.g. import 'package.json?edit'
                type: 'asset/resource',
                generator: {
                    filename: '[path][name][ext]'
                }
            },
            {
                test: /\.(mp3)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[path][hash][ext]'
                }
            },
            {
                test: /\.(fnt)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[path][name][ext]'
                }
            }
        ]
    },

    plugins: [
        // 全域變數
        new webpack.DefinePlugin({
            assetsMd5: JSON.stringify(md5.sync('./assets')),
        })
    ],

    // 不要打包進 bundle 的 module, 會在 runtime 時引入
    externalsType: 'window',
    externals: {
        'pixi.js-legacy': 'PIXI',
        // 'pixi-spine',      // 只是引入 side-effect，runtime 有引入就好  ( ts error 問題只需要新增 triple slash)
        // 'pixi-particles',      // 只是引入 side-effect，runtime 有引入就好  ( ts error 問題只需要新增 triple slash)
        '@pixi/sound': ['PIXI', 'sound'],
        'gsap': 'gsap',
        'number-precision': 'NP'
    }
}