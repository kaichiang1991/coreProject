import GameFontManager from "@root/src/System/Assets/GameFontManager"
import { Container } from "pixi.js-legacy"

export enum eFGNumber{
    titleTimes,
    currentTimes,
    remainTimes,
    totalTimes,
    plus,
    totalWin
}

export default class FreeGameNumberManager{
    
    private static useDef: {[key: number]: IDefConfig}

    private static numArr: {[key: number]: BitmapText} = {}
    private static currentTimes: number
    private static totalTimes: number
    private static remainTimes: number
    public static get RemainTimes(): number {return this.remainTimes}

    /** 初始化 FG 用的數字 */
    public static init(){

        // 設定使用的設定檔
        this.useDef = window.FG_NumberDef[LocalizationManager.getLanguage()]
        const {[eFGNumber.titleTimes]: title, [eFGNumber.currentTimes]: current, [eFGNumber.remainTimes]: remain, [eFGNumber.plus]: plus, [eFGNumber.totalWin]: totalWin} = this.useDef

        this.numArr[eFGNumber.titleTimes] = GameFontManager.drawFreeGameTitleRoundNumber('titleTimes', title.pos)          // 開頭場次
        this.numArr[eFGNumber.currentTimes] = GameFontManager.drawFreeGameRoundNumber('currentTimes', current.pos)         // 現在場次
        this.numArr[eFGNumber.remainTimes] = GameFontManager.drawFreeGameRoundNumber('remainTimes', remain.pos, null, 16)  // 剩餘場次
        this.numArr[eFGNumber.totalWin] = GameFontManager.drawFreeGameTotalWinNumber('totalWin', totalWin.pos)             // 總贏分
        this.numArr[eFGNumber.plus] = GameFontManager.drawFreeGamePlusNumber('plusTimes', plus.pos, null, 16)              // 加場次
    }

    //#region 獲得總場次
    /**
     * 播放獲得免費遊戲的次數
     * @param {number} value 總共幾場
     * @param {Container} [parent=] 父節點 
     */
    public static playTitleTimes(value: number, parent?: Container){
        const font: BitmapText = this.numArr[eFGNumber.titleTimes]
        parent?.addChild(font)
        font.text = value.toString()
    }

    /** 清除 title 的數字 */
    public static clearTitleTimes(){
        this.playTitleTimes(0)
        this.numArr[eFGNumber.titleTimes].parent?.removeChild(this.numArr[eFGNumber.titleTimes])
    }
    //#endregion 獲得總場次

    //#region 總贏分
    /**
     * 播放 FG 總贏分
     * @param {number} value 值
     * @param {Container} [parent=] 父節點
     */
    public static playTotalWin(value: number, parent?: Container){
        const font: BitmapText = this.numArr[eFGNumber.totalWin]
        parent?.addChild(font)
        font.text = MathTool.convertNumDisplay(value)
    }

    /** 清除總贏分 */
    public static clearTotalWin(){
        this.playTotalWin(0)
        this.numArr[eFGNumber.totalWin].parent?.removeChild(this.numArr[eFGNumber.totalWin])
    }
    //#endregion 總贏分

    //#region 目前場次
    /**
     * 播放目前場次
     * @param {number} value 值 
     * @param {Container} [parent] 父節點
     */
    public static playCurrentTimes(value: number, parent?: Container){
        this.currentTimes = value
        
        const font: BitmapText = this.numArr[eFGNumber.currentTimes]
        parent?.addChild(font)
        font.text = this.currentTimes.toString()        
    }

    /**
     * 增加目前場次
     * @param {number} [value = 1] 要增加的值 
     */
    public static addCurrentTimes(value: number = 1){
        this.playCurrentTimes(this.currentTimes + value)
    }

    /** 清除目前場次 */
    public static clearCurrentTimes(){
        this.playCurrentTimes(0)
        this.numArr[eFGNumber.currentTimes].parent?.removeChild(this.numArr[eFGNumber.currentTimes])
    }
    //#endregion 目前場次

    //#region 剩餘場次
    /**
     * 播放剩餘次數
     * @param {number} value 值 
     * @param {Container} [parent=] 父節點
     */
    public static playRemainTimes(value: number, parent?: Container){
        this.remainTimes = value

        const font: BitmapText = this.numArr[eFGNumber.remainTimes]
        parent?.addChild(font)
        font.text = this.remainTimes.toString()
    }

    /**
     * 修改剩餘次數
     * @param {boolean} flag true 增加 / false 減少
     * @param {number} [value=1] 值
     */
    public static adjustRemainTimes(flag: boolean, value: number = 1){
        this.playRemainTimes(flag? this.remainTimes + value: this.remainTimes - value)
    }

    /** 清除剩餘次數 */
    public static clearRemainTimes(){
        this.playRemainTimes(0)
        this.numArr[eFGNumber.remainTimes].parent?.removeChild(this.numArr[eFGNumber.remainTimes])
    }
    //#endregion 剩餘場次

    //#region 總場次
    /**
     * 播放總共場次
     * @param {number} value 值 
     * @param {Container} [parent=] 父節點
     */
    public static playTotalTimes(value: number, parent?: Container){
        this.totalTimes = value

        const font: BitmapText = this.numArr[eFGNumber.totalTimes]
        parent?.addChild(font)
        font.text = this.totalTimes.toString()
    }

    /** 清除總共場次 */
    public static clearTotalTimes(){
        this.playTotalTimes(0)
        this.numArr[eFGNumber.totalTimes].parent?.removeChild(this.numArr[eFGNumber.totalTimes])
    }
    //#endregion

    //#region 加場次
    /**
     * 播放加場次動畫
     * @param newRemainTimes 新的剩餘場次
     */
    public static async playPlusTotalTimes(newRemainTimes: number){
        // 演出加場次
        const plus: number = newRemainTimes - this.remainTimes
        const font: BitmapText = this.numArr[eFGNumber.plus]
        font.setParent(this.numArr[eFGNumber.remainTimes].parent)
        font.text = '+' + plus

        const timeline: GSAPTimeline = gsap.timeline()
        .from(font, {ease: Back.easeOut.config(2), duration: .5, pixi: {scale: 0}})
        .to(font, {delay: .5, duration: .8, y: '-=50', alpha: 0})

        await waitTweenComplete(timeline)
        this.clearPlusTimes()
    }

    /** 清除加場次數字 */
    private static clearPlusTimes(){
        const font: BitmapText = this.numArr[eFGNumber.plus]
        this.useDef[eFGNumber.plus].pos.copyTo(font.position)
        font.alpha = 1
        font.scale.set(1)
        font.parent?.removeChild(font)
    }
    //#endregion 加場次
}