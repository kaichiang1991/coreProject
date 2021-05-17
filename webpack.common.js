const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'src/index.ts')
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'assets')
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
                test: /\.atlas$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[path][name][ext]'
                }
            },
            {
                test: /\.json/i,
                resourceQuery: { not: [/edit/] },   // 如果要直接 import 原檔內容的，在 query 的地方加上 eidt  e.g. import 'package.json?edit'
                type: 'asset/resource',
                generator: {
                    filename: '[path][name][ext]'
                }
            }
            // ToDo mp3/fnt
        ]
    },

    plugins: [
        // 全域變數
        // new webpack.DefinePlugin({
            // assetsMd5: JSON.stringify(md5.sync('./assets')),
        // })
    ],

    // 不要打包進 bundle 的 module, 會在 runtime 時引入
    externals: {
        'pixi.js-legacy': 'PIXI',
        'pixi-spine': 'PIXI.spine',
        'gsap': 'gsap'
    }
}