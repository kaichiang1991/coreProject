import lazyLoad from "@root/src/Tool/lazyLoad"
import moduleName from '@pixi/sound'
const {PixiSound} = PixiAsset
export default class GameAudioManager{

    private static audioList: ISoundList = {
        'aa': 'audio/BB'
    }

    public static async init(){
        for (const key in this.audioList) {     // 加上副檔名
            !/\.(mp3)$/.test(this.audioList[key]) && (this.audioList[key] += '.mp3')
        }
        const [...sources] = await lazyLoad(Object.values(this.audioList))        
        Object.keys(this.audioList).map((key, index) => this.audioList[key] = sources[index])
        await PixiSound.init(this.audioList)
    }

    public static playAudioMusic(name: string){

    }

    public static playAudioEffect(name: string, loop: boolean = false, complete?: Function){
        return PixiSound.play(name, {loop, complete})
    }
}