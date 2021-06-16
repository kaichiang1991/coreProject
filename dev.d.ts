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

// config 的結構
interface IConfig{
    name: string
    version: string
    size: {width: number, height: number}
    fps: number
    canUseWebp: boolean
    portrait: boolean
}