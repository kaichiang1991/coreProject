import lazyLoad from "@root/src/Tool/lazyLoad"
import config from '@root/config'
import { App } from "@root/src"
import { Container, Point } from "pixi.js-legacy"
import { eAppLayer, eFGLayer, eNGLayer, eReelContainerLayer } from "../LayerDef"
import { mapRowIndex, reelContPivot, xOffsetArr, yOffsetArr } from "@root/src/Game/Reel/SymbolDef"

const {Spine} = PixiAsset

export enum eSpineName{
    symbol = 'Symbol',
    Stick = 'Stick',
    ReelExpect = 'ReelExpect',
    Scene = 'Scene',
    Transition = 'Transition',
    Character = 'Character',
    FG_Odds = 'FG_Odds'
}

export default class GameSpineManager{

    private static spineList: ISpineList = {
        [eSpineName.symbol]: 'img/SymbolAnim',
        [eSpineName.Stick]: 'img/Stick',
        [eSpineName.ReelExpect]: 'img/ReelExpect',
        [eSpineName.Scene]: 'img/Scene',
        [eSpineName.Transition]: 'img/Transition',
        [eSpineName.Character]: 'img/Character',
        [eSpineName.FG_Odds]: 'img/FG_Odds'
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

    //#region Symbol
    public static playSymbol(parent: Container): [Spine, TrackEntry]{
        const [spine, track] = Spine.playSpine(eSpineName.symbol, 'Symbol_O1_03', true)
        spine.name = 'symbol'
        parent.addChild(spine)
        return [spine, track]
    }
    //#endregion

    //#region Stick
    public static playStick(): Spine{
        const [spine] = Spine.playSpine(eSpineName.Stick)
        return spine
    }
    //#endregion Stick

    //#region 期待框
    public static playReelExpect(parent: Container, reelIndex: number){
        const [spine] = Spine.playSpine(eSpineName.ReelExpect, 'ReelExpect', true)
        parent.addChild(spine)
        spine.position.set(xOffsetArr[reelIndex], yOffsetArr[mapRowIndex(reelIndex)][2])
        spine.zIndex = eReelContainerLayer.reelExpect
        return spine
    }
    //#endregion 期待框

    // //#region Line
    // private static line: Spine

    // public static initLine(){
    //     this.line = Spine.playSpine(eSpineName.line)[0]
    //     this.line.zIndex = eReelContainerLayer.line
    //     this.line.pivot.set(640, 360)
    //     reelContPivot.copyTo(this.line.position)
    // }

    // private static getLineAnim(lineNo: number): string{
    //     return 'Line_0' + lineNo
    // }

    // public static playLine(parent: Container, lineNo: number){
    //     if(!this.line){
    //         Debug.error('playLine no line')
    //         return
    //     }

    //     this.line.setParent(parent)
    //     this.line.setAnimationWithLatestIndex(this.getLineAnim(lineNo))
    // }

    // public static playSingleLine(parent: Container, lineNo: number){
    //     this.clearLine()

    //     parent.addChild(this.line)
    //     this.line?.setAnimation('Line_0' + lineNo)
    // }

    // public static clearLine(){
    //     if(!this.line){
    //         Debug.warn('clearLine no line.')
    //         return
    //     }
    //     this.line.setEmptyAnimations()
    //     this.line.parent?.removeChild(this.line)
    // }
    // //#endregion Line

    //#region Scene
    private static scene: Spine
    /** 初始化場景特效 */
    public static initScene(){
        [this.scene] = Spine.playSpine(eSpineName.Scene)
        this.scene.name = 'scene'
    }

    /**
     * 設定場景特效
     * @param {boolean} portrait 是否垂直
     * @param {boolean} normalGame 是否為 normal game
     */
    public static setScene(portrait: boolean, normalGame: boolean){
        this.scene.position.copyFrom(portrait? new Point(360, 640): new Point(640, 360))
        this.scene.zIndex = normalGame? eNGLayer.sceneEffect: eFGLayer.sceneEffect
        this.scene.setAnimation(`${normalGame? 'NG': 'FG'}_Loop_${portrait? 'M': 'W'}`, true)
    }

    /** 清除場景特效 */
    public static clearScene(){
        this.scene.setEmptyAnimations()
        this.scene.parent?.removeChild(this.scene)
    }

    /**
     * 播放 NG場景特效
     * @param {Container} parent 父節點
     */
    public static playNGScene(parent: Container){
        parent?.addChild(this.scene)
    }

    /**
     * 播放 FG場景特效
     * @param {Container} parent 父節點
     */
    public static playFGScene(parent: Container){
        parent?.addChild(this.scene)
    }
    //#endregion Scene

    //#region Transition
    private static transition: Spine

    /**
     * 播放轉場卷軸動畫
     * 每次播放時創造一個新的
     * @param {Container} parent 父節點
     * @returns {Promise<void>} 進場動畫播放完畢
     */
    public static async playTransitionIn(parent: Container): Promise<void>{
        const [transition, track] = Spine.playSpine(eSpineName.Transition, 'FG_Title_In')
        transition.addAnimation('FG_Title_Loop', true)
        transition.zIndex = eAppLayer.transition
        transition.name = 'transition'
        parent?.addChild(transition)

        this.transition = transition
        return waitTrackComplete(track)
    }

    /**
     * 播放轉場出場動畫
     * @returns {Promise<void>} 動畫演完
     */
    public static playTransitionOut(): Promise<void>{
        return waitTrackComplete(this.transition.setAnimation('FG_Title_Out'))
    }

    /** 清除轉場動畫 */
    public static clearTransition(){
        this.transition.setEmptyAnimations()
        this.transition.parent?.removeChild(this.transition)
    }
    //#endregion Transition

    //#region Character
    private static character: Spine
    private static characterTrack: TrackEntry
    
    /** 初始化主視覺角色 */
    public static initCharacter(){
        [this.character] = Spine.playSpine(eSpineName.Character)
        this.character.name = 'character'
    }

    /**
     * 設定角色相關參數
     * @param {number} zIndex 圖層
     * @param {Point} pos 位置
     * @param {Point} scale 縮放
     */
    public static setCharacter(zIndex: number, pos: Point, scale: Point){
        this.character.zIndex = zIndex
        this.character.position.copyFrom(pos)
        this.character.scale.copyFrom(scale)
    }

    /** 清除角色 */
    public static clearCharacter(){
        this.characterTrack = null
        this.character.setEmptyAnimations()
        this.character.parent?.removeChild(this.character)
    }
    
    /**
     * 播放 NG 主視覺角色loop
     * @param parent 
     */
    public static playNGCharacter(parent: Container){
        parent.addChild(this.character)
        this.characterTrack = this.character.setAnimation('NG_Loop', true)
    }

    /**
     * 播放 FG 主視覺角色loop
     * @param parent 
     */
    public static playFGCharacter(parent: Container){
        parent.addChild(this.character)
        this.characterTrack = this.character.setAnimation('FG_Loop', true)
    }

    /** 播放 FG 主視覺角色得獎演出 */
    public static playFGCharacterWin(){
        this.characterTrack = this.character.setAnimation('FG_Win', true)
    }

    /** 結束播放 FG 主視覺角色得獎演出，並回覆loop狀態 */
    public static endFGCharacterWin(){
        this.characterTrack.loop = false
        this.character.addAnimation('FG_Loop', true)
    }
    //#endregion Character

    //#region FG_Odds
    private static FG_Odds: Spine
    private static currentIndex: number
    private static readonly ODDS_ARR: Array<number> = [1, 2, 3, 5, 10]
    
    /**
     * 播放 FG 的倍數
     * @param {Container} parent 父節點
     */
    public static playFG_Odds(parent: Container){
        [this.FG_Odds] = Spine.playSpine(eSpineName.FG_Odds, 'X1_Enable', true)
        parent?.addChild(this.FG_Odds)
        this.FG_Odds.position.set(215, 40)
        this.currentIndex = 0
        // 其他乘數初始化
        this.ODDS_ARR.slice(1).map(num => this.FG_Odds.setAnimationWithIndex(this.ODDS_ARR.indexOf(num), `X${num}_Disable`, true))
    }

    /** 清除 FG 的倍數 */
    public static clearFG_Odds(){
        this.FG_Odds.setEmptyAnimations()
        this.FG_Odds.parent?.removeChild(this.FG_Odds)
    }

    /**
     * 播放下一個 FG 的倍數
     * 會自動判斷是不是到最後的倍數
     */
    public static async playNextFG_Odds(){
        if(this.currentIndex == this.ODDS_ARR.length - 1)
            return

        this.FG_Odds.setAnimationWithIndex(this.currentIndex, `X${this.ODDS_ARR[this.currentIndex]}_Disable`)       // 取消focus目前的倍數
        this.currentIndex++

        const track = this.FG_Odds.setAnimationWithIndex(this.currentIndex, `X${this.ODDS_ARR[this.currentIndex]}_Win`)           // 強調下一個倍數的動畫
        this.FG_Odds.addAnimationWithIndex(this.currentIndex, `X${this.ODDS_ARR[this.currentIndex]}_Enable`, true)  // focue 在下一個倍數的 loop

        await waitTrackComplete(track)
    }
    //#endregion FG_Odds
}