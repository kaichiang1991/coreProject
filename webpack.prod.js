const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const {merge} = require("webpack-merge");
const common = require("./webpack.common");
const ImageMinimizerPlugin  = require('image-minimizer-webpack-plugin')
const md5 = require('md5-dir');

module.exports = merge(common, {
    mode: 'production',

    output: {
        path: path.resolve(__dirname, 'dist/Release'),
        filename: '[name].[fullhash].bundle.js',
        clean: true
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
            template: 'template.cshtml',
            files: {
                js: [
                    'https://cdn.jsdelivr.net/npm/pixi.js-legacy@5.3.9/dist/pixi-legacy.min.js',
                    'https://cdn.jsdelivr.net/npm/pixi-spine@2.1.14/dist/pixi-spine.min.js',
                    'https://cdn.jsdelivr.net/npm/@pixi/sound@4.0.2/dist/pixi-sound.js',
                    'https://cdn.jsdelivr.net/npm/pixi-particles@4.3.0/dist/pixi-particles.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/gsap.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/EasePack.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/PixiPlugin.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/MotionPathPlugin.min.js',
                    'https://cdn.jsdelivr.net/npm/number-precision@1.5.0/build/index.umd.js'
                ].concat([
                    '/Entry', '/SystemErrorManager', '/AssetManager', '/Debug', '/Loading', '/Tool', '/LocalizationManager', '/ParameterParse', '/State', '/BetModel', '/MathTool', '/UIManager', '/EventHandler'
                ].map(dir => '../GameCommon/Lib' + dir + '.' + md5.sync('./Lib' + dir) + '/index.min.js'))      // 解析 md5 後的路徑，確保和使用的版本相同
                .concat('../GameCommon/Lib/EventName.js')
            },
            style: {
                // css
                css: [
                    '../GameCommon/Lib/Entry.' + md5.sync('./Lib/Entry') + '/index.min.css'
                ]
            }
        }),
        // new ImageMinimizerPlugin({
        //     test: /\.(png)$/i,
        //     minimizerOptions: {
        //         plugins: [
        //             ['optipng', { optimizationLevel: 7 }]
        //         ]
        //     }
        // })
    ]
})