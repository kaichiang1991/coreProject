import { App } from "@root/src"
import GameFontManager from "@root/src/System/Assets/GameFontManager"
import GameSceneManager from "@root/src/System/GameSceneController"
import { Point } from "pixi.js-legacy"

export default class LineNumberManager{

    private static lineNumber: BitmapText

    /** 初始化數字 */
    public static init(){
        this.lineNumber = GameFontManager.drawSGWinNumber('lineNumber', '999', new Point(360, 610))
    }

    public static playLineNumber(value: number){
        GameSceneManager.getSceneContainer().addChild(this.lineNumber)
        this.lineNumber.text = value + ''
    }

    public static clearLineNumber(){
        this.lineNumber?.parent?.removeChild(this.lineNumber)
    }
}