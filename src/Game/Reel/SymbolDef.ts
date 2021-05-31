enum eSymbolConfig{
    width = 100,
    height = 100
}

const reelCount: number = 5
const reelSymbolCount: Array<number> = Array(reelCount).fill(3)
const stopOrder: Array<number> = Array(reelCount).fill(1).map((_, index) => index)
const xOffsetArr: Array<number> = Array(reelCount).fill(1).map((_, index) => 50 + index * eSymbolConfig.width)
const yOffsetArr: Array<number> = Array(reelSymbolCount[0] + 2).fill(1).map((_, index) => -50 + index * eSymbolConfig.height)

export {eSymbolConfig, reelCount, reelSymbolCount, stopOrder, xOffsetArr, yOffsetArr}