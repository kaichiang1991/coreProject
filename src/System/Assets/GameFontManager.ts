import lazyLoad from "@root/src/Tool/lazyLoad"
import { Container, Point } from "pixi.js-legacy"

const {BitmapText} = PixiAsset

export enum eFontName{
    // ToDo 確認字型後要改
    lineWin = 'Font_LineWin',
    lineWinMult = 'Font_FG_Multi',
    FG_Number = 'Font_FG_Number',
    FGTitle = FG_Number,
    FGTotalWin = FG_Number,
    FGRound = FG_Number,
    FGPlus = FG_Number,
}

export default class GameFontManager{
    
    private static fontList: IBitmapTextList = {
        [eFontName.lineWin]: 'font/Font_LineWin',
        [eFontName.FG_Number]: 'font/Font_FG_Number',
        [eFontName.lineWinMult]: 'font/Font_FG_Multi',
    }

    public static async init(){
        const [...sources] = await lazyLoad(Object.values(this.fontList).map(path => /\.(fnt)$/.test(path)? path: path + '.fnt'))       // 加上副檔名
        Object.keys(this.fontList).map((key, index) => this.fontList[key] = sources[index])
        await BitmapText.init(this.fontList)
    }

    /**
     * 畫線獎的數字
     * @param {string} name 容器名稱
     * @param {number | Point} pos 座標
     * @param {Container} [parent] 父節點
     * @param {number} [size = 32] 數字大小
     * @returns {BitmapText}
     */
    public static drawLineWinNumber(name: string, pos: number | Point, parent?: Container, size: number = 32): BitmapText{
        const font: BitmapText = BitmapText.drawFont(name, eFontName.lineWin, size, pos)
        parent?.addChild(font)
        return font
    }

    /**
     * 畫線獎倍數的數字
     * @param {string} name 容器名稱
     * @param {number | Point} pos 座標
     * @param {Container} [parent] 父節點
     * @param {number} [size = 32] 數字大小
     * @returns {BitmapText}
     */
    public static drawLineWinMultipleNumber(name: string, pos: number | Point, parent?: Container, size: number = 32): BitmapText{
        const font: BitmapText = BitmapText.drawFont(name, eFontName.lineWinMult, size, pos)
        parent?.addChild(font)
        return font
    }

    /**
     * 畫 FreeGame 開頭場次的數字
     * @param {string} name 容器名稱
     * @param {number | Point} pos 座標
     * @param {Container} [parent] 父節點
     * @param {number} [size = 32] 數字大小
     * @returns {BitmapText}
     */
    public static drawFreeGameTitleRoundNumber(name: string, pos: number | Point, parent?: Container, size: number = 32): BitmapText{
        const font: BitmapText = BitmapText.drawFont(name, eFontName.FGTitle, size, pos)
        parent?.addChild(font)
        return font
    }

    /**
     * 畫 FreeGame 總贏分的數字
     * @param {string} name 容器名稱
     * @param {number | Point} pos 座標
     * @param {Container} [parent] 父節點
     * @param {number} [size = 32] 數字大小
     * @returns {BitmapText}
     */
    public static drawFreeGameTotalWinNumber(name: string, pos: number | Point, parent?: Container, size: number = 32): BitmapText{
        const font: BitmapText = BitmapText.drawFont(name, eFontName.FGTotalWin, size, pos)
        parent?.addChild(font)
        return font
    }

    /**
     * 畫 FreeGame 場次的數字
     * @param {string} name 容器名稱
     * @param {number | Point} pos 座標
     * @param {Container} [parent] 父節點
     * @param {number} [size = 32] 數字大小
     * @returns {BitmapText}
     */
    public static drawFreeGameRoundNumber(name: string, pos: number | Point, parent?: Container, size: number = 32): BitmapText{
        const font: BitmapText = BitmapText.drawFont(name, eFontName.FGRound, size, pos)
        parent?.addChild(font)
        return font
    }

    /**
     * 畫 FreeGame 加場次的數字
     * @param {string} name 容器名稱
     * @param {number | Point} pos 座標
     * @param {Container} [parent] 父節點
     * @param {number} [size = 32] 數字大小
     * @returns {BitmapText}
     */
    public static drawFreeGamePlusNumber(name: string, pos: number | Point, parent?: Container, size: number = 32): BitmapText{
        const font: BitmapText = BitmapText.drawFont(name, eFontName.FGPlus, size, pos)
        parent?.addChild(font)
        return font
    }

}