import lazyLoad from "@root/src/Tool/lazyLoad"

export enum eFontName{
    SG_Bet = 'SG_Bet',
    SG_Win = 'SG_Win',
    Win = 'Win'
}

export default class GameFontManager{
    
    private static fontList: IBitmapTextList = {
        [eFontName.SG_Bet] : 'font/SG_Bet_fnt',
        [eFontName.SG_Win] : 'font/SG_Win_fnt',
        [eFontName.Win] : 'font/Win_fnt',
    }

    public static async init(){
        const [...sources] = await lazyLoad(Object.values(this.fontList).map(path => /\.(fnt)$/.test(path)? path: path + '.fnt'))       // 加上副檔名
        Object.keys(this.fontList).map((key, index) => this.fontList[key] = sources[index])

        console.log(this.fontList)
        await PixiAsset.BitmapText.init(this.fontList)
    }
}