import lazyLoad from "@root/src/Tool/lazyLoad"
import config from '@root/config'
import { App } from "@root/src"
import { Container } from "pixi.js-legacy"

const {Spine} = PixiAsset

export enum eSpineName{
    symbol = 'Symbol'
}

export default class GameSpineManager{

    private static spineList: ISpineList = {
        [eSpineName.symbol]: 'img/SymbolAnim'
    }

    public static setLanguage(){
        this.spineList = {...this.spineList,
            // [eSpineName.symbol]: 'img/' + LocalizationManager.getFolder() + '/Symbol'
        }
    }

    public static async init(){
        const {canUseWebp} = config
        const [...sources] = await lazyLoad(
            Object.values(this.spineList).map(path => /\.json/?.test(path)? path: path + '.json')       // 補副檔名
            .map(path => canUseWebp? pathConvert(path): path)                                           // 轉webp
        )      

        Object.keys(this.spineList).map((key, index) => this.spineList[key] = sources[index])
        await Spine.init(this.spineList)
    }

    public static playSymbol(parent: Container): [Spine, TrackEntry]{
        const [spine, track] = Spine.playSpine(eSpineName.symbol, 'Symbol_O1_03', true)
        spine.name = 'symbol'
        parent.addChild(spine)
        return [spine, track]
    }
}