import GameFontManager from "@root/src/System/Assets/GameFontManager"
import { eReelContainerLayer } from "@root/src/System/LayerDef"
import { Point } from "pixi.js-legacy"
import ReelController from "../Reel/ReelController"

export default class LineNumberManager{

    private static lineNumber: BitmapText

    /** 初始化數字 */
    public static init(){
        this.lineNumber = GameFontManager.drawSGWinNumber('lineNumber', '999', new Point(360, 380))
        this.lineNumber.zIndex = eReelContainerLayer.lineNumber
    }

    /**
     * 播放線獎分數跑分
     * @param value 要跑的分數
     */
    public static async playLineNumberAnim(value: number){
        ReelController.ReelContainer.addChild(this.lineNumber)
        const duration: number = 1 // 跑分時間
        this.lineNumber.text = '0'
        await waitTweenComplete(
            gsap.to(this.lineNumber, {duration, text: value + '', onUpdate: ()=>{
                this.lineNumber.text = (+this.lineNumber.text).toFixed(2)       // 更新數字
            }})
        )
    }

    /**
     * 撥放線獎數字
     * @param value 
     */
    public static playLineNumber(value: number){
        ReelController.ReelContainer.addChild(this.lineNumber)
        this.lineNumber.text = value + ''
    }

    /** 清除線獎數字 */
    public static clearLineNumber(){
        this.lineNumber?.parent?.removeChild(this.lineNumber)
    }
}