import { Point } from "pixi.js-legacy"

enum eSymbolConfig{
    width = 168,
    height = 160
}

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

export {eSymbolConfig, reelCount, reelSymbolCount, defaultStopOrder, xOffsetArr, yOffsetArr, reelContPivot}