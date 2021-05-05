import * as PIXI from 'pixi.js-legacy'
import {gsap} from 'gsap/all'
import pkg from './package.json'

export module modSlotGame{
    export class GameInit{
        public static init(stage: PIXI.Container){
            console.log(`%c${pkg.name} 版號: ${pkg.version}`, 'color:green; background-color:cyan; font-size:16px; padding:2px;')
        }

        public static exampleFn1(gp: PIXI.Graphics, ease: gsap.EaseFunction): gsap.core.Animation{
            return gsap.timeline()
            .to(gp, {ease, repeat: -1, yoyo: true, x: '+=200', alpha: 0})
        }
    }

    export function exampleFn2(stage: PIXI.Container, x: number, y: number): PIXI.Graphics{
        return stage.addChild(new PIXI.Graphics().beginFill(0x00AA00).drawStar(x, y, 8, 10))
    }
}