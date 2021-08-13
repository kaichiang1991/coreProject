const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const {merge} = require('webpack-merge')
const common = require('./webpack.common')
const libPaths = require('./buildTool/libMap')

module.exports = merge(common, {
    mode: 'development',
    devtool: "eval-cheap-source-map",

    watch: true,
    watchOptions: {
        ignored: ['node_modules/**', '**/*.html']
    },

    output: {
        path: path.resolve(__dirname, 'dist/Debug'),
        filename: '[name].bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.dev.json'
                    }
                }]
            }
        ]
    },


    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, 'dist/Debug/index.html'),
            template: 'template.cshtml',
            inject: 'body',
            files: {
                // js
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
                ]
                // 共用 Lib
                .concat(libPaths.map(dir => 'Lib' + dir + '/index.min.js'))
                // 單獨的js
                .concat('Lib/EventName.js'),
            },
            style: {
                // css
                css: [
                    'Lib/Entry/index.min.css'
                ]
            }
        }),

        new CopyPlugin({
            patterns: [
                {from: 'Lib/', to: "Lib/", toType: "dir", noErrorOnMissing: true}
            ]
        })
    ]
})