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
            inject: 'body',
            files: {
                js: 
                // 共用js
                [
                    'pixi-legacy@5.3.9',
                    'pixi-spine@2.1.14',
                    'pixi-sound@4.0.2',
                    'pixi-particles@4.3.0',
                    'gsap@3.6.0',
                    'EasePack@3.6.0',
                    'PixiPlugin@3.6.0',
                    'MotionPathPlugin@3.6.0',
                    'number-precision@1.5.0'
                ].map(name => '../GameCommon/js/' + name + '.min.js')  

                // 共用 Lib
                .concat([
                    '/Entry', '/SystemErrorManager', '/AssetManager', '/Debug', '/Loading', '/Tool', '/LocalizationManager', '/ParameterParse', '/State', '/BetModel', '/MathTool', '/UIManager', '/EventHandler', '/BigWinManager'
                ].map(dir => '../GameCommon/Lib' + dir + '.' + md5.sync('./Lib' + dir) + '/index.min.js'))      // 解析 md5 後的路徑，確保和使用的版本相同

                // 單獨的js
                .concat('../GameCommon/Lib/EventName.js')
            },
            style: {
                // css
                css: [
                    '../GameCommon/Lib/Entry.' + md5.sync('./Lib/Entry') + '/index.min.css'
                ]
            }
        }),
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