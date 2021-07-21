import lazyLoad from "@root/src/Tool/lazyLoad"
import config from '@root/config'
import { App } from "@root/src"
import { Container } from "pixi.js-legacy"
import { eAppLayer, eReelContainerLayer } from "../LayerDef"
import { reelContPivot } from "@root/src/Game/Reel/SymbolDef"

const {Spine} = PixiAsset

export enum eSpineName{
    symbol = 'Symbol',
    line = 'line',
    Transition = 'Transition'
}

export default class GameSpineManager{

    private static spineList: ISpineList = {
        [eSpineName.symbol]: 'img/SymbolAnim',
        [eSpineName.line]: 'img/Line',
        [eSpineName.Transition]: 'img/Transition'
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

    //#region Line
    private static line: Spine

    public static initLine(){
        this.line = Spine.playSpine(eSpineName.line)[0]
        this.line.zIndex = eReelContainerLayer.line
        this.line.pivot.set(640, 360)
        reelContPivot.copyTo(this.line.position)
    }

    private static getLineAnim(lineNo: number): string{
        return 'Line_0' + lineNo
    }

    public static playLine(parent: Container, lineNo: number){
        if(!this.line){
            Debug.error('playLine no line')
            return
        }

        this.line.setParent(parent)
        this.line.setAnimationWithLatestIndex(this.getLineAnim(lineNo))
    }


    public static playSingleLine(parent: Container, lineNo: number){
        this.clearLine()

        parent.addChild(this.line)
        this.line?.setAnimation('Line_0' + lineNo)
    }

    public static clearLine(){
        if(!this.line){
            Debug.warn('clearLine no line.')
            return
        }
        this.line.setEmptyAnimations()
        this.line.parent?.removeChild(this.line)
    }
    //#endregion Line

    //#region Transition
    /**
     * 播放轉場卷軸動畫
     * @param {Container} parent 父節點
     * @returns {[Spine, Promise<void>]} [動畫節點, 進場動畫播放完畢]
     */
    public static playTransition(parent: Container): [Spine, Promise<void>]{

        const [transition, track] = Spine.playSpine(eSpineName.Transition, 'FG_Title_In')
        transition.addAnimation('FG_Title_Loop', true)
        transition.zIndex = eAppLayer.transition
        transition.name = 'transition'
        parent?.addChild(transition)

        return [transition, waitTrackComplete(track)]
    }
    //#endregion Transition
}