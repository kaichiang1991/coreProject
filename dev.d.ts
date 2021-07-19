// 可以直接在程式內引用圖檔
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.webp'
declare module '*.atlas'
declare module '*.json?edit'

declare const assetsMd5: string

// PixiAsset
type Sprite = PixiAsset.Sprite
type BitmapText = PixiAsset.BitmapText
type Spine = PixiAsset.Spine
type ParticleEmitter = PixiAsset.ParticleEmitter

// spine
type TrackEntry = PIXI.spine.core.TrackEntry

// State
type GameStateContext = StateModule.StateContext

// config 的結構
interface IConfig{
    name: string
    version: string
    size: {width: number, height: number}
    fps: number
    canUseWebp: boolean
    portrait: boolean
    pingDuration: number
}

/** 可供調整的 json 參數 */
interface IEditConfig{
    line: ILineConfig
    spin: ISpinConfig
}

/** 轉輪的參數 */
interface ISpinConfig{
    upDistance: number          // 上移的距離
    upDuration: number          // 上移的時間
    spinSpeed: number           // 一般的滾動速度
    forceStopSpeed: number      // 急停的滾動速度
    listeningSpeed: number      // 聽牌的滾動速度  (最終的速度，漸慢)
    listeningDelay: number      // 聽牌的延遲時間  (s)
    bounceDistance: number      // 回彈的距離
    bounceBackDuration: number  // 回拉的時間
    eachReelStop: number        // 每輪的間隔
    extraSymbolCount: number    // 結尾要接回去的滾輪表個數
}

/** 線獎的參數 */
interface ILineConfig{
    leastAllLineDuration: number    // 全縣演出最短時間
    eachLineLight: number           // 逐縣時每條線亮的時間
}

/** 個別遊戲設定的參數 */
interface IGameConfig{
    GameID: number
    DemoOn: boolean
    LineGame: boolean
}

// 定義內容 結構
interface IDefConfig{
    pos?: PIXI.Point
}

// windows 結構
interface Window{
    // 測試用
    reelType: number
    idx: number
    NGReelData: Array<Array<number>>
    FGReelData: Array<Array<number>>
    useServerData: boolean
    NGSpinDataArr: Array<IGtoCNGPlay>
    FGSpinDataArr: Array<IGtoCFGPlay>
    blackGraphic: Array<number>

    // 正式用
    App: PIXI.Application
    FG_NumberDef: {[key: string]: {
        [key: number]: IDefConfig
    }}
    LineNumberDef: {[key: number]: IDefConfig}
    logoPos: PIXI.Point
    reelContScale: number
    reelBgPos: PIXI.Point
}