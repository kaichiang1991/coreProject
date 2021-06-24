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

    total
}

/** 定義 symbol 狀態 */
enum eSymbolState{
    Normal,
    Blur,
    EndSpin,
    Win,
}

const type: string = eReelType[window.reelType]
enum eSymbolConfig{
    width = /3x5/.test(type)? 168: 230,
    height = /3x5/.test(type)? 160: 170
}

// 有落定動畫的 symbol
const endSpinSymbolArr: Array<eSymbolName> = []
// 不要模糊的 symbol
const noBlurSymbolArr: Array<eSymbolName> = []
// 要在 StickSymbol 上面的 symbol
const upperStickSymbolArr: Array<eSymbolName> = [eSymbolName.FG]

var reelCount: number,                              // 輪數
    reelSymbolCount: Array<number>,                 // 每一輪 symbol 的個數
    defaultStopOrder: Array<number>,                // 預設的停輪順序
    xOffsetArr: Array<number>,                      // x 軸座標陣列
    yOffsetArr: Array<Array<number>>,               // y 軸座標陣列
    reelContPivot: Point,                           // reelContainer 的中心點
    reelContPos_land: Point,                        // reelContainer 橫式的座標
    reelContPos_port: Point                         // reelContainer 直式的座標

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

        reelContPivot = new Point(860 / 2, 480 / 2)
        reelContPos_land = new Point(674, 357)
        reelContPos_port = new Point(360, 704)
        xOffsetArr = Array(reelCount).fill(reelContPivot.x).map((x, index) => x + (index - 2) * eSymbolConfig.width + (index - 2) * 5)
        yOffsetArr = [Array(reelSymbolCount[0] + 2).fill(reelContPivot.y).map((y, index) => y + (index - 2) * eSymbolConfig.height)]

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

        reelContPivot = new Point(860 / 2, 480 / 2)
        reelContPos_land = new Point(674, 357)
        reelContPos_port = new Point(360, 704)

        xOffsetArr = Array(reelCount).fill(reelContPivot.x).map((x, index) => x + (index - 2) * eSymbolConfig.width + (index - 2) * 5)
        yOffsetArr = [
            Array(reelSymbolCount[0] + 2).fill(reelContPivot.y).map((y, index) => y + (index - 2) * eSymbolConfig.height),
            Array(reelSymbolCount[0] + 2).fill(reelContPivot.y).map((y, index) => y + (index - 2 + 1) * eSymbolConfig.height),
            Array(reelSymbolCount[0] + 2).fill(reelContPivot.y).map((y, index) => y + (index - 2 + 2) * eSymbolConfig.height),
        ]

        mapRowIndex = (reelIndex): number =>{
            return ~~(reelIndex / 5)
        }

        mapColumnIndex = (reelIndex): number =>{
            return reelIndex % 5
        }

    break

    case eReelType._3x3_reel:
        reelCount = 3
        reelSymbolCount = Array(reelCount).fill(3)     // [3, 3, 3]
        defaultStopOrder = Array(reelCount).fill(1).map((_, index) => index)      // [0, 1, 2]
        
        reelContPivot = new Point(700 / 2, 510 / 2)
        reelContPos_land = new Point(875, 340)
        reelContPos_port = new Point(584, 655)
        xOffsetArr = Array(reelCount).fill(reelContPivot.x).map((x, index) => x + (index - 2) * eSymbolConfig.width + (index - 2) * 5)
        yOffsetArr = [Array(reelSymbolCount[0] + 2).fill(reelContPivot.y).map((y, index) => y + (index - 2) * eSymbolConfig.height)]

        mapRowIndex = (reelIndex): number =>{
            return 0
        }
        
        mapColumnIndex = (reelIndex): number =>{
            return reelIndex
        }
    break

}

export {eSymbolName, eSymbolLayer, eSymbolState, eSymbolConfig, endSpinSymbolArr, noBlurSymbolArr, upperStickSymbolArr, reelCount, reelSymbolCount, defaultStopOrder, xOffsetArr, yOffsetArr, reelContPivot, reelContPos_land, reelContPos_port, mapRowIndex, mapColumnIndex}