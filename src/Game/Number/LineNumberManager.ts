import GameFontManager from "@root/src/System/Assets/GameFontManager"
import { eReelContainerLayer } from "@root/src/System/LayerDef"
import { Point } from "pixi.js-legacy"
import ReelController from "../Reel/ReelController"

export enum eLineNumber{
    lineWin,
    multiply,
}

export default class LineNumberManager{

    private static numArr: {[key: string]: BitmapText} = {}

    /** 初始化數字 */
    public static init(){
        const {[eLineNumber.lineWin]: lineWin} = window.LineNumberDef

        this.numArr[eLineNumber.lineWin] = GameFontManager.drawLineWinNumber('lineNumber', lineWin.pos)
        this.numArr[eLineNumber.multiply] = GameFontManager.drawLineWinMultipleNumber('lineWinMult', lineWin.pos)
        
        ;[eLineNumber.lineWin, eLineNumber.multiply].map(index => this.numArr[index].zIndex = eReelContainerLayer.lineNumber)
    }

    //#region 線獎數字 lineWinNumber
    /**
     * 播放線獎分數跑分
     * @param {number} value 要跑的分數
     */
    public static async playLineNumberAnim(value: number){
        const font: BitmapText = this.numArr[eLineNumber.lineWin]
        ;(<Point>font.anchor).set(.5)
        ReelController.ReelContainer.addChild(font)
        const duration: number = 1 // 跑分時間
        const config: {value: number} = {value: 0}
        await waitTweenComplete(
            gsap.to(config, {duration, value, onUpdate: ()=>{
                font.text = MathTool.convertNumDisplay(config.value)       // 更新數字
            }})
        )
    }

    /**
     * 撥放線獎數字 (不跑分)
     * @param {number} value 
     */
    public static playLineNumber(value: number){
        const font: BitmapText = this.numArr[eLineNumber.lineWin]
        ;(<Point>font.anchor).set(.5)
        ReelController.ReelContainer.addChild(font)
        font.text = MathTool.convertNumDisplay(value)
    }

    /** 清除線獎數字 */
    public static clearLineNumber(){
        const font: BitmapText = this.numArr[eLineNumber.lineWin]
        font?.parent?.removeChild(font)
    }
    //#endregion 線獎數字 lineWinNumber

    //#region 線獎倍數數字 multiply
    /**
     * 播放倍率數字
     * 會自動把線獎分數會左靠
     * @param {number} value 
     */
    public static playLineWinMultNumber(value: number){
        (<Point>this.numArr[eLineNumber.lineWin].anchor).set(1, .5)
        const font: BitmapText = this.numArr[eLineNumber.multiply]
        ;(<Point>font.anchor).set(-.2, .5)
        ReelController.ReelContainer.addChild(font)
        font.text = 'X' + value
    }

    /** 清除倍率數字 */
    public static clearLineWinMultNumber(){
        const font: BitmapText = this.numArr[eLineNumber.multiply]
        font?.parent?.removeChild(font)
    }
    //#endregion 線獎倍數數字 multiply
}