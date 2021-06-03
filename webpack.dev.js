const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const {merge} = require('webpack-merge')
const common = require('./webpack.common')
const {name} = require('./package.json')

module.exports = merge(common, {
    mode: 'development',
    devtool: "eval-cheap-source-map",

    watch: true,
    watchOptions: {
        ignored: ['node_modules/**', '**/*.json', '**/*.html']
    },

    entry: {
        test: path.resolve(__dirname, 'main.ts')
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
            filename: path.resolve(__dirname, 'dist/index.html'),
            template: 'template.cshtml',
            files: {
                js: [
                    'https://cdn.jsdelivr.net/npm/pixi.js-legacy@5.3.9/dist/pixi-legacy.min.js',
                    'https://cdn.jsdelivr.net/npm/pixi-spine@2.1.14/dist/pixi-spine.min.js',
                    'https://cdn.jsdelivr.net/npm/@pixi/sound@4.0.2/dist/pixi-sound.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/gsap.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/EasePack.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/PixiPlugin.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/MotionPathPlugin.min.js',
                    'https://cdn.jsdelivr.net/npm/number-precision@1.5.0/build/index.umd.js'
                ].concat(['/AssetManager/index.js', '/Debug/index.js', '/Tool/index.js', '/EventHandler/index.js', '/EventName.js'].map(file => name + file))
            }
        }),

        new CopyPlugin({
            patterns: [
                {from: 'Lib/', toType: "dir", noErrorOnMissing: true}
            ]
        })
    ]
})