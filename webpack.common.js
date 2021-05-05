const path = require('path')
const webpack = require('webpack')
const ReplaceInFilePlugin = require('replace-in-file-webpack-plugin')

module.exports = {
    resolve: {
        extensions: ['.ts', '.js']
    },

    output: {
        library: {
            type: 'umd'
        }
    },

    plugins: [
        // 全域變數
        // new webpack.DefinePlugin({
            // assetsMd5: JSON.stringify(md5.sync('./assets'))
        // }),

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
    ]
}