import GameFontManager from "@root/src/System/Assets/GameFontManager"
import { eReelContainerLayer } from "@root/src/System/LayerDef"
import ReelController from "../Reel/ReelController"

export enum eLineNumber{
    lineWin
}

export default class LineNumberManager{

    private static numArr: {[key: string]: BitmapText} = {}

    /** 初始化數字 */
    public static init(){
        const {[eLineNumber.lineWin]: lineWin} = window.LineNumberDef

        this.numArr[eLineNumber.lineWin] = GameFontManager.drawLineWinNumber('lineNumber', lineWin.pos)
        this.numArr[eLineNumber.lineWin].zIndex = eReelContainerLayer.lineNumber
    }

    /**
     * 播放線獎分數跑分
     * @param value 要跑的分數
     */
    public static async playLineNumberAnim(value: number){
        const font: BitmapText = this.numArr[eLineNumber.lineWin]
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
     * 撥放線獎數字
     * @param value 
     */
    public static playLineNumber(value: number){
        const font: BitmapText = this.numArr[eLineNumber.lineWin]
        ReelController.ReelContainer.addChild(font)
        font.text = MathTool.convertNumDisplay(value)
    }

    /** 清除線獎數字 */
    public static clearLineNumber(){
        const font: BitmapText = this.numArr[eLineNumber.lineWin]
        font?.parent?.removeChild(font)
    }
}