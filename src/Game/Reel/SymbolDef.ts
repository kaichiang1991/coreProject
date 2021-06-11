import { Point } from "pixi.js-legacy"

enum eSymbolName{
    H1 = 1,
    H2 = 2,
    H3 = 3,
    H4 = 4,

    N1 = 11,
    N2 = 12,
    N3 = 13,
    N4 = 14,

    WD = 21
}

enum eSymbolState{
    Normal,
    Blur,
    Win,
    EndSpin
}

enum eSymbolConfig{
    width = 168,
    height = 160
}

// 有落定動畫的 symbol
const endSpinSymbolArr: Array<eSymbolName> = []
// 不要模糊的 symbol
const noBlurSymbolArr: Array<eSymbolName> = []

// 輪數
const reelCount: number = 5
// 每一輪 symbol 的個數
const reelSymbolCount: Array<number> = Array(reelCount).fill(3)     // [3, 3, 3, 3, 3]
// 預設的停輪順序
const defaultStopOrder: Array<number> = Array(reelCount).fill(1).map((_, index) => index)      // [0, 1, 2, 3, 4]
// x 軸座標陣列
const xOffsetArr: Array<number> = [0, 173, 346, 519, 692]// Array(reelCount).fill(1).map((_, index) => 50 + index * eSymbolConfig.width)
// y 軸座標陣列
const yOffsetArr: Array<number> = Array(reelSymbolCount[0] + 2).fill(1).map((_, index) => 85 + index * eSymbolConfig.height)
// reelContainer 的中心點
const reelContPivot: Point = new Point((xOffsetArr[0] + xOffsetArr[xOffsetArr.length - 1]) / 2, eSymbolConfig.height * (reelSymbolCount[0] + 2) / 2)

export {eSymbolName, eSymbolState, eSymbolConfig, endSpinSymbolArr, noBlurSymbolArr, reelCount, reelSymbolCount, defaultStopOrder, xOffsetArr, yOffsetArr, reelContPivot}