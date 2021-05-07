// PIXI 相關的 lib 需要讀取 window.PIXI
import * as PIXI from 'pixi.js-legacy'
window.PIXI = PIXI
// 其他程式讀取的 gsap 放在 window 裡面
import gsap from 'gsap'
window.gsap = gsap

import pkg from './package.json'
import logo from './assets/logo.png'

export module modSlotGame{
    export class LibExample{
        /**
         * 初始化 Lib
         * @param stage 
         */
        public static init(stage: PIXI.Container): PIXI.Graphics{
            gsap.registerPlugin(PixiPlugin, MotionPathPlugin)
            console.log(`%c${pkg.name} 版號: ${pkg.version}`, 'color:green; background-color:cyan; font-size:16px; padding:2px;')
            return stage.addChild(new PIXI.Graphics().beginFill(0xFF0000).drawCircle(200, 200, 100).endFill())
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
            return stage.addChild(PIXI.Sprite.from(logo))
        }
    }

    /**
     * 不在 class 內部的 function 範例
     * @param stage 
     * @param x 
     * @param y 
     * @returns 
     */
    export function exampleFn2(stage: PIXI.Container, x: number, y: number): PIXI.Graphics{
        return stage.addChild(new PIXI.Graphics().beginFill(0x00AA00).drawStar(x, y, 8, 10))
    }
}