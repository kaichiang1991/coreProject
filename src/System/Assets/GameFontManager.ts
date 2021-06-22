import lazyLoad from "@root/src/Tool/lazyLoad"
import { Container, Point } from "pixi.js-legacy"

const {BitmapText} = PixiAsset

export enum eFontName{
    // ToDo 確認字型後要改
    lineWin = 'SG_Win',
    FGRound = 'SG_Win',
    FGPlus = 'SG_Win',
    SG_Win = 'SG_Win',
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