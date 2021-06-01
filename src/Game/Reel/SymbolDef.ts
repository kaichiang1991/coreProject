enum eSymbolConfig{
    width = 100,
    height = 100
}

// 輪數
const reelCount: number = 5
// 每一輪 symbol 的個數
const reelSymbolCount: Array<number> = Array(reelCount).fill(3)     // [3, 3, 3, 3, 3]
// 預設的停輪順序
const defaultStopOrder: Array<number> = Array(reelCount).fill(1).map((_, index) => index)      // [0, 1, 2, 3, 4]
// x 軸座標陣列
const xOffsetArr: Array<number> = Array(reelCount).fill(1).map((_, index) => 50 + index * eSymbolConfig.width)
// y 軸座標陣列
const yOffsetArr: Array<number> = Array(reelSymbolCount[0] + 2).fill(1).map((_, index) => -50 + index * eSymbolConfig.height)

export {eSymbolConfig, reelCount, reelSymbolCount, defaultStopOrder, xOffsetArr, yOffsetArr}