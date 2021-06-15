import lazyLoad from "@root/src/Tool/lazyLoad"
import { Container, Point } from "pixi.js-legacy"

const {BitmapText} = PixiAsset

export enum eFontName{
    SG_Bet = 'SG_Bet',
    SG_Win = 'SG_Win',
    Win = 'Win'
}

export default class GameFontManager{
    
    private static fontList: IBitmapTextList = {
        // [eFontName.SG_Bet] : 'font/SG_Bet_fnt',
        [eFontName.SG_Win] : 'font/SG_Win_fnt',
        // [eFontName.Win] : 'font/Win_fnt',
    }

    public static async init(){
        const [...sources] = await lazyLoad(Object.values(this.fontList).map(path => /\.(fnt)$/.test(path)? path: path + '.fnt'))       // 加上副檔名
        Object.keys(this.fontList).map((key, index) => this.fontList[key] = sources[index])
        await BitmapText.init(this.fontList)
    }

    /**
     * 畫 SG Win 字型
     * @param name 容器名稱
     * @param text 顯示文字
     * @param {number | Point} pos 座標
     * @param parent 父節點
     * @param size 大小
     * @returns 
     */
    public static drawSGWinNumber(name: string, text: string, pos: number | Point, parent?: Container, size: number = 32): BitmapText{
        const font: BitmapText = BitmapText.drawFont(name, eFontName.SG_Win, size)
        font.text = text
        if(typeof pos == 'number')  font.position.set(pos)
        else                        font.position.copyFrom(pos)
        
        parent?.addChild(font)
        return font
    }
}