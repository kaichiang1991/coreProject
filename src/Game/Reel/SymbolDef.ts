import { eReelType } from "@root/globalDef"
import { Point } from "pixi.js-legacy"

/** 定義 symbol */
enum eSymbolName{
    H1 = 1,
    H2 = 2,
    H3 = 3,
    H4 = 4,

    N1 = 11,
    N2 = 12,
    N3 = 13,
    N4 = 14,

    WD = 21,
    FG = 31
}

/** 定義 symbol 圖層 */
enum eSymbolLayer{
    N1,
    N2,
    N3,
    N4,

    H1,
    H2,
    H3,
    H4,

    FG,
    WD,
}

/** 定義 symbol 狀態 */
enum eSymbolState{
    Normal,
    Blur,
    EndSpin,
    Win,
}

enum eSymbolConfig{
    width = 168,
    height = 160
}

// 有落定動畫的 symbol
const endSpinSymbolArr: Array<eSymbolName> = []
// 不要模糊的 symbol
const noBlurSymbolArr: Array<eSymbolName> = []

var reelCount: number,                              // 輪數
    reelSymbolCount: Array<number>,                 // 每一輪 symbol 的個數
    defaultStopOrder: Array<number>,                // 預設的停輪順序
    xOffsetArr: Array<number>,                      // x 軸座標陣列
    yOffsetArr: Array<Array<number>>,               // y 軸座標陣列
    reelContPivot: Point                            // reelContainer 的中心點

/**
 * 找出該reel是屬於第幾列
 * @param reelIndex 
 * @returns {number} 第幾列
 */
var mapRowIndex: {(reelIndex: number): number}

/**
 * 找出該 reel 是屬於第幾行
 * @param reelIndex 
 * @returns {number} 第幾行
 */
var mapColumnIndex: {(reelIndex: number): number}

switch(window['reelType']){
    case eReelType._3x5_reel:
        reelCount = 5
        reelSymbolCount = Array(reelCount).fill(3)     // [3, 3, 3, 3, 3]
        defaultStopOrder = Array(reelCount).fill(1).map((_, index) => index)      // [0, 1, 2, 3, 4]
        xOffsetArr = [0, 173, 346, 519, 692]
        yOffsetArr = [Array(reelSymbolCount[0] + 2).fill(1).map((_, index) => 85 + index * eSymbolConfig.height)]
        reelContPivot = new Point((xOffsetArr[0] + xOffsetArr[xOffsetArr.length - 1]) / 2, eSymbolConfig.height * (reelSymbolCount[0] + 2) / 2)

        mapRowIndex = (reelIndex): number =>{
            return 0
        }
        
        mapColumnIndex = (reelIndex): number =>{
            return reelIndex
        }
    break

    case eReelType._3x5_single:
        reelCount = 15
        reelSymbolCount = Array(reelCount).fill(1)     
        defaultStopOrder = Array(reelCount).fill(1).map((_, index) => index)      
        xOffsetArr = [0, 173, 346, 519, 692]
        yOffsetArr = [
            Array(reelSymbolCount[0] + 2).fill(1).map((_, index) => 85 + index * eSymbolConfig.height),
            Array(reelSymbolCount[0] + 2).fill(1).map((_, index) => 85+160 + index * eSymbolConfig.height),
            Array(reelSymbolCount[0] + 2).fill(1).map((_, index) => 85+160+160 + index * eSymbolConfig.height),
        ]
        reelContPivot = new Point((xOffsetArr[0] + xOffsetArr[xOffsetArr.length - 1]) / 2, eSymbolConfig.height * (3 + 2) / 2)
        
        mapRowIndex = (reelIndex): number =>{
            return ~~(reelIndex / 5)
        }

        mapColumnIndex = (reelIndex): number =>{
            return reelIndex % 5
        }

    break
}

export {eSymbolName, eSymbolLayer, eSymbolState, eSymbolConfig, endSpinSymbolArr, noBlurSymbolArr, reelCount, reelSymbolCount, defaultStopOrder, xOffsetArr, yOffsetArr, reelContPivot, mapRowIndex, mapColumnIndex}