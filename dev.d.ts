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