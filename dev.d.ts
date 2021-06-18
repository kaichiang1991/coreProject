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

// gsap
type Timeline = gsap.core.Timeline
type gsapAnimation = gsap.core.Animation

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

// windows 結構
interface Window{
    // 測試用
    reelType: number
    idx: number
    NGReelData: Array<Array<number>>
    FGReelData: Array<Array<number>>
    FGTimes: number
    useServerData: boolean
    NGSpinDataArr: Array<IGtoCNGPlay>

    // 正式用
    App: PIXI.Application
}