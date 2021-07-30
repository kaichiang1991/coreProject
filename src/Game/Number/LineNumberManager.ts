import GameAudioManager, { eAudioName } from "@root/src/System/Assets/GameAudioManager"
import GameFontManager from "@root/src/System/Assets/GameFontManager"
import { Point } from "pixi.js-legacy"
import { LineManager } from "../Win/LineManager"

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
    
        ;[eLineNumber.lineWin, eLineNumber.multiply].map(index => (<Point>this.numArr[index].anchor).copyFrom(lineWin.anchor))
    }

    //#region 線獎數字 lineWinNumber
    /**
     * 播放線獎分數跑分
     * @param {Container} parent 父節點
     * @param {number} value 要跑的分數
     * @param {number} [multiple=] 線的倍數
     */
    public static async playLineNumberAnim(parent: Container, value: number, multiple?: number){
        const playMultiple: boolean = multiple != undefined
        const font: BitmapText = this.numArr[eLineNumber.lineWin]
        parent.addChild(font)

        const [audio] = GameAudioManager.playAudioEffect(eAudioName.lineWinScroll, true)
        const duration: number = 1 // 跑分時間
        const config: {value: number} = {value: 0}
        await waitTweenComplete(
            gsap.to(config, {duration, value, onUpdate: ()=>{
                font.text = MathTool.convertNumDisplay(config.value)       // 更新數字
                playMultiple && this.playLineWinMultNumber(parent, multiple)
                LineManager.LineNumResizeFn()
            }})
        )
        GameAudioManager.stopAudioEffect(audio)
    }

    /**
     * 撥放線獎數字 (不跑分)
     * @param {Container} parent 父節點
     * @param {number} value 要顯示的分數
     */
    public static playLineNumber(parent: Container, value: number){
        const font: BitmapText = this.numArr[eLineNumber.lineWin]
        parent.addChild(font)
        font.text = MathTool.convertNumDisplay(value)
        LineManager.LineNumResizeFn()
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
     * 會計算分數的長度，所以要先顯示正確的線獎數字
     * @param {Container} parent 父節點
     * @param {number} value 要顯示的倍數
     */
    public static playLineWinMultNumber(parent: Container, value: number){
        const font: BitmapText = this.numArr[eLineNumber.multiply]
        font.x = this.numArr[eLineNumber.lineWin].width
        parent.addChild(font)
        font.text = 'X' + value
    }

    /** 清除倍率數字 */
    public static clearLineWinMultNumber(){
        const font: BitmapText = this.numArr[eLineNumber.multiply]
        font?.parent?.removeChild(font)
    }
    //#endregion 線獎倍數數字 multiply
}