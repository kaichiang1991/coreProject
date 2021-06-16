/// <reference types="pixi-spine"/>
/// <reference path="node_modules/pixi-particles/ambient.d.ts" />

// PIXI 相關的 lib 需要讀取 window.PIXI
import * as PIXI from 'pixi.js-legacy'
window.PIXI = PIXI
// 其他程式讀取的 gsap 放在 window 裡面
import gsap from 'gsap'
window.gsap = gsap

import config from './config'

const {name, version} = config

export module modSlotGame{

    export class LibExample{
        /**
         * 初始化 Lib
         * @param stage 
         */
        public static init(stage: PIXI.Container){
            console.log(`%c${name} 版號: ${version}`, 'color:#E6A23C; background-color:#909399; font-size:16px; padding:0 5px; font-family: 600 Ariel')
            gsap.registerPlugin(PixiPlugin, MotionPathPlugin)
            // config.canUseWebp = await supportWebp()         // 判斷是否可以使用 Webp，Lib有使用到自己的資源再初始化就好
        }

        /**
         * function 範例
         * @param gp 
         * @param ease 
         * @returns 
         */
        public static exampleFn1(gp: PIXI.Graphics, ease: gsap.EaseFunction): gsap.core.Animation{
            const motionPath = {
                path: [{x: 0, y: 0}, {x: 100, y: 0}],
                relative: true
            }

            return gsap.timeline()
            .to(gp, {ease: ExpoScaleEase.config(1, 10), duration: 5, y: '+=500'})       // EasePack 裡面的 Ease
            .to(gp, {repeat: 3, motionPath})                                            // MotionPlugin 
            .to(gp, {ease, repeat: -1, yoyo: true, pixi: {scale: 2}})                   // PixiPlugin
        }

        /**
         * 讀圖範例
         * @param stage 
         * @returns 
         */
        public static exampleLoadImg(stage: PIXI.Container){
            return stage.addChild(new PIXI.Sprite())
        }
    }
}