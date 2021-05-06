import * as PIXI from 'pixi.js-legacy'
import gsap from 'gsap'
import pkg from './package.json'
import logo from './assets/logo.png'

export module modSlotGame{
    export class LibExample{
        /**
         * 初始化 Lib
         * @param stage 
         */
        public static init(stage: PIXI.Container){
            console.log(`%c${pkg.name} 版號: ${pkg.version}`, 'color:green; background-color:cyan; font-size:16px; padding:2px;')
        }

        /**
         * function 範例
         * @param gp 
         * @param ease 
         * @returns 
         */
        public static exampleFn1(gp: PIXI.Graphics, ease: gsap.EaseFunction): gsap.core.Animation{
            return gsap.timeline()
            .to(gp, {ease, repeat: -1, yoyo: true, x: '+=200', alpha: 0})
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