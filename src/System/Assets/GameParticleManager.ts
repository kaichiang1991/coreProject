import lazyLoad from "@root/src/Tool/lazyLoad"
import {fps} from '@root/config'
import { Container } from "pixi.js-legacy"

const {ParticleEmitter} = PixiAsset

export enum eEmitterName{
    emitter1 = 'emitter1'    
}

export default class GameParticleManager{
    
    private static emitterList: IParticleList = {
        [eEmitterName.emitter1]: 'img/BigWin_Emitter'
    }

    public static async init(){
        const [...sources] = await lazyLoad(Object.values(this.emitterList).map(path => /\.(json)$/.test(path)? path: path + '.json'))    // 加上副檔名
        Object.keys(this.emitterList).map((key, index) => this.emitterList[key] = sources[index])
        await ParticleEmitter.init(fps, this.emitterList)
    }

    public static playEmitter1(parent: Container){
        return ParticleEmitter.playParticle(parent, eEmitterName.emitter1, 'N1')
    }
}