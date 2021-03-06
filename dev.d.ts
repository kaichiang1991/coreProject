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
type Container = PixiAsset.Container
type Graphics = PixiAsset.Graphics
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
    game: IEditGameConfig
}

/** 轉輪的參數 */
interface ISpinConfig{
    leastSpinDuration: number       // 一般模式下，最少的滾動時間 (s)
    turboLeastDuration: number      // 快速模式下，最少的滾動時間 (s) (可填0)
    upDistance: number              // 一般滾動時，上移的距離
    upDuration: number              // 一般滾動時，上移的時間        (不可以填0)
    turboUpDistance: number         // 快速模式下，上移的距離
    turboUpDuration: number         // 快速模式下，上移的時間        (不可以填0)  
    spinSpeed: number               // 一般的滾動速度   (每幀位移的距離 px)
    fastSpinSpeed: number           // 快速模式 or 急停的滾輪速度
    listeningSpeed: number          // 聽牌的滾動速度  (最終的速度，漸慢)
    listeningDelay: number          // 聽牌的延遲時間  (s)
    listeningRevertDuration: number // 聽牌超出範圍後，回復正常位置的時間 (s)
    bounceDistance: number          // 到底後回彈的距離 (px)
    bounceBackDuration: number      // 一般滾動時，上拉的時間 (s)  (急停會自動根據速度比例去計算)
    eachReelStop: number            // 每輪的間隔
    extraSymbolCount: number        // 結尾要接回去的滾輪表個數
}

/** 線獎的參數 */
interface ILineConfig{
    leastAllLineDuration: number    // 全線獎演出最短時間       (s)
    afterAllLineDelay: number       // 全線獎分數跑完後停留的時間 (s)
    eachLineLight: number           // 逐縣時每條線亮的時間     (s)
}

/** 遊戲內的參數 */
interface IEditGameConfig{
    FG_TitleAutoDelay: number       // auto 時，自動進FG的等待時間
    noWinEachDelay: number          // 沒有得獎時，每一局之間的延遲
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
    anchor?: PIXI.Point
    scale?: PIXI.Point
}

// windows 結構
interface Window{
    // 測試用
    showReel: number
    // 正式用
    reelType: number
    App: PIXI.Application
    AppDebug: any
    logoDef: {[key: number]: IDefConfig}        // logo 的設定
    FG_titleWord: IDefConfig                    // 進 FG 轉場文字的設定
    FG_winWord: IDefConfig                      // 出 FG 得分文字的設定

    FG_NumberDef: {[key: string]: {
        [key: number]: IDefConfig
    }}
    LineNumberDef: {[key: number]: IDefConfig}
    reelContScale: number
    reelFramePos: PIXI.Point
    reelBgPos: PIXI.Point
    reelMaskPos: PIXI.Point

    reelContSize: PIXI.ISize
}