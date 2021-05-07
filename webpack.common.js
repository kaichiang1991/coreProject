const path = require('path')
const webpack = require('webpack')

module.exports = {
    resolve: {
        extensions: ['.ts', '.js']
    },

    output: {
        library: {
            type: 'umd'
        },
        path: path.resolve(__dirname, 'dist/Lib'),
        filename: '[name].js',
    },

    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/img/[hash][ext]'
                }
            }
            // ToDo mp3/fnt
        ]
    },

    plugins: [
        // 全域變數
        // new webpack.DefinePlugin({
            // assetsMd5: JSON.stringify(md5.sync('./assets'))
        // })
    ],

    // 不要打包進 bundle 的 module, 會在 runtime 時引入
    externals: {
        'pixi.js-legacy': 'PIXI',
        'gsap': 'gsap'
    }
}