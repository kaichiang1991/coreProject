export enum eReelType{
    _3x5_reel,
    _3x5_single,
    _3x3_reel
}

window.reelType = eReelType._3x5_single
// window.reelType = eReelType._3x5_reel
// window.reelType = eReelType._3x3_reel

import {eSymbolName} from "./src/Game/Reel/SymbolDef"
import { eFGNumber } from "./src/Game/Number/FreeGameNumberManager"
import { eLineNumber } from "./src/Game/Number/LineNumberManager"

switch(window.reelType){
    case eReelType._3x5_reel:
        window.NGReelData = [
            [	13,	3,	12,	11,	4,	13,	11,	3,	14,	1,	13,	12,	11,	14,	1,	21,	2,	12,	13,	3,	4,	11,	3,	1,	21,	4,	3,	14,	11,	12,	4,	3,	1,	4,	11,	2,	4,	21,	1,	3,	14,	11,	4,	2,	3,	14,	12,	11,	1,	21,	3,	12,	13,	4,	14,	12,	3,	13,	12,	3	, 21, 21, 21																																																																																																				],
            [	14,	12,	2,	1,	21,	3,	4,	13,	12,	2,	2,	14,	4,	4,	13,	14,	3,	1,	4,	12,	11,	1,	13,	11,	2,	12,	21,	14,	1,	13,	11,	12,	13,	2,	3,	21,	4,	1,	12,	11,	2,	13,	12,	3,	4,	2,	14,	11,	1,	1,	12,	11,	2,	3,	13,	14,	11,	2,	2,	13	, 21, 21, 21																																																																																																				],
            [	11,	4,	21,	2,	13,	12,	2,	2,	12,	14,	4,	13,	12,	1,	2,	4,	13,	14,	3,	11,	14,	2,	3,	4,	2,	14,	13,	11,	12,	3,	3,	3,	11,	13,	4,	4,	4,	14,	11,	3,	1,	13,	11,	14,	21,	12,	13,	11,	3,	14,	12,	4,	1,	12,	4,	14,	1,	3,	13,	12	, 21, 21, 21																																																																																																				],
            [	13,	11,	4,	14,	1,	3,	11,	4,	2,	12,	13,	1,	12,	4,	13,	1,	14,	4,	12,	14,	13,	3,	2,	21,	1,	4,	12,	14,	13,	1,	4,	14,	12,	11,	1,	12,	3,	21,	1,	12,	4,	14,	11,	12,	13,	14,	3,	4,	2,	1,	4,	11,	14,	4,	12,	14,	3,	11,	12,	1	, 21, 21, 21																																																																																																				],
            [	11,	2,	3,	13,	11,	14,	3,	13,	14,	1,	1,	21,	3,	3,	11,	13,	4,	2,	3,	11,	13,	3,	4,	11,	13,	14,	1,	3,	2,	14,	13,	11,	2,	2,	21,	4,	4,	12,	11,	13,	14,	1,	3,	4,	12,	13,	2,	11,	12,	4,	2,	21,	3,	1,	11,	12,	3,	2,	13,	12	, 21, 21, 21																																																																																																				]
        ]
        window.FGReelData = [
            [	14,	3,	13,	11,	14,	3,	2,	4,	14,	1,	3,	4,	12,	14,	1,	3,	2,	14,	12,	4,	13,	3,	2,	21,	1,	3,	13,	14,	1,	3,	11,	13,	12,	14,	1,	3,	21,	4,	1,	13,	12,	3,	14,	13,	3,	4,	12,	3,	1,	4,	11,	13,	4,	3,	14,	12,	3,	1,	4,	13																																																																																																					],
            [	4,	4,	12,	11,	2,	13,	12,	3,	3,	11,	12,	4,	2,	3,	4,	11,	12,	2,	2,	12,	11,	4,	12,	13,	11,	1,	1,	2,	2,	14,	13,	11,	3,	14,	13,	4,	4,	21,	3,	3,	11,	12,	13,	3,	4,	11,	14,	13,	4,	4,	13,	12,	2,	1,	11,	12,	2,	3,	4,	11																																																																																																					],
            [	3,	11,	14,	1,	1,	13,	12,	11,	2,	1,	3,	4,	13,	11,	14,	2,	2,	12,	14,	1,	1,	12,	11,	4,	3,	21,	1,	2,	14,	12,	3,	4,	21,	1,	2,	13,	14,	11,	4,	4,	12,	11,	14,	1,	1,	1,	12,	13,	11,	2,	13,	11,	14,	4,	4,	4,	13,	12,	3,	3																																																																																																					],
            [	13,	4,	13,	14,	2,	3,	4,	12,	13,	2,	11,	3,	12,	4,	1,	2,	3,	12,	13,	1,	3,	2,	14,	13,	11,	3,	21,	4,	14,	11,	12,	1,	2,	3,	1,	12,	13,	14,	2,	4,	12,	2,	1,	3,	4,	11,	2,	14,	13,	12,	4,	2,	11,	13,	12,	4,	13,	11,	3,	13																																																																																																					],
            [	4,	12,	3,	3,	11,	2,	2,	13,	4,	4,	11,	12,	3,	14,	11,	1,	1,	21,	2,	2,	12,	14,	4,	11,	13,	3,	3,	21,	4,	4,	13,	11,	12,	4,	1,	21,	2,	3,	14,	13,	11,	4,	3,	1,	2,	14,	12,	3,	13,	14,	2,	4,	3,	14,	11,	4,	13,	14,	3,	12																																																																																																					]
        ]

        window.NGSpinDataArr = [
            // 三條線，有FG
            {
                SpinInfo: {
                    WinType: 0x01,
                    ScreenOrg: [[14, 21, 31], [14, 21, 14], [14, 21, 31], [14, 21, 14], [14, 21, 31]],
                    SymbolResult: [[14, 21, 31], [14, 21, 14], [14, 21, 31], [14, 21, 14], [14, 21, 31]],
                    WinLineInfos: [
                        {SymbolID: eSymbolName.N4, WinPosition: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], Win: 1000, LineNo: 1},
                        {SymbolID: eSymbolName.WD, WinPosition: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]], Win: 9999, LineNo: 2},
                        // {SymbolID: eSymbolName.FG, WinPosition: [[0, 2], [2, 2], [4, 2]], Win: 1000, LineNo: 0},
                    ]
                }
            } as IGtoCNGPlay,
            // 正常一線得分
            {
                SpinInfo: {
                    WinType: 0x01,
                    ScreenOrg: [[31, 1, 2], [11, 1, 2], [31, 1, 2], [11, 1, 2], [3, 4, 11]],
                    SymbolResult: [[31, 1, 2], [11, 1, 2], [31, 1, 2], [11, 1, 2], [3, 4, 11]],
                    WinLineInfos: [
                        {SymbolID: eSymbolName.H1, WinPosition:  [[0, 1], [1, 1], [2, 1], [3, 1]], Win: 2222, LineNo: 2},
                    ]
                }
            } as IGtoCNGPlay,
            // 沒得獎
            {
                SpinInfo: {
                    WinType: 0,
                    SymbolResult: [[1, 2, 3], [11, 1, 2], [31, 1, 2], [11, 1, 2], [3, 4, 11]],
                    WinLineInfos: [
                    ]
                }
            } as IGtoCNGPlay,
        ]

        window.FGSpinDataArr = [
            // 沒有贏線
            {
                SpinInfo: {
                    WinType: 0,
                    SymbolResult: [[14, 3, 13], [4, 4, 12], [3, 11, 14], [13, 4, 13], [4, 12, 3]],
                    WinLineInfos: [
                        // {SymbolID: eSymbolName.N4, WinPosition: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], Win: 1000, LineNo: 1},
                    ]
                }
            } as IGtoCFGPlay,
            // 兩條贏線
            {
                SpinInfo: {
                    WinType: 0x01,
                    SymbolResult: [[21, 1, 3], [21, 3, 3], [3, 21, 1], [13, 4, 13], [4, 12, 3]],
                    WinLineInfos: [
                        {SymbolID: eSymbolName.WD, WinPosition: [[0, 0], [1, 0], [2, 1]], Win: 1000, LineNo: 6},
                    ]
                }
            } as IGtoCFGPlay,
        ]

        window.LineNumberDef = {
            [eLineNumber.lineWin]: {pos: new PIXI.Point(430, 205)}
        }

        window.FG_NumberDef = {
            [eLanguage.ENG]: {
                [eFGNumber.currentTimes]: {pos: new PIXI.Point(260, -55)},
                // [eFGNumber.totalTimes]: {pos: new PIXI.Point(400, 115)},
                [eFGNumber.remainTimes]: {pos: new PIXI.Point(500, -55)},
                [eFGNumber.plus]: {pos: new PIXI.Point(500, -55)}
            },
        
            [eLanguage.CHS]: {
                [eFGNumber.currentTimes]: {pos: new PIXI.Point(260, -55)},
                // [eFGNumber.totalTimes]: {pos: new PIXI.Point(400, 115)},
                [eFGNumber.remainTimes]: {pos: new PIXI.Point(500, -55)},
                [eFGNumber.plus]: {pos: new PIXI.Point(500, -55)}
            },
        }

    break

    case eReelType._3x5_single:
        window.NGReelData = Array(15).fill([1, 2, 0, 4, 11, 12, 13, 14, 21, 31])
        window.FGReelData = Array(15).fill([21, 21, 31, 0, 4, 3, 2, 1, 14, 13, 12, 11])

        window.NGSpinDataArr = [
            // 正常一線得分
            {
                SpinInfo: {
                    WinType: 0x01,
                    ScreenOrg: [[1], [4], [3], ...Array(12).fill([1])],
                    SymbolResult: [[1], [4], [3], ...Array(12).fill([1])],
                    WinLineInfos: [
                        {SymbolID: eSymbolName.H1, WinPosition:  [[0, 0], [1, 0], [2, 0], [3, 0]], Win: 2222, LineNo: 2},
                    ]
                }
            } as IGtoCNGPlay,
            // 沒得獎
            {
                SpinInfo: {
                    WinType: 0,
                    SymbolResult: [[1, 2, 3], [11, 1, 2], [31, 1, 2], [11, 1, 2], [3, 4, 11]],
                    WinLineInfos: [
                    ]
                }
            } as IGtoCNGPlay,
        ]

        window.LineNumberDef = {
            [eLineNumber.lineWin]: {pos: new PIXI.Point(430, 205)}
        }

        window.FG_NumberDef = {
            [eLanguage.ENG]: {
                [eFGNumber.currentTimes]: {pos: new PIXI.Point(260, -55)},
                // [eFGNumber.totalTimes]: {pos: new PIXI.Point(400, 115)},
                [eFGNumber.remainTimes]: {pos: new PIXI.Point(500, -55)},
                [eFGNumber.plus]: {pos: new PIXI.Point(500, -55)}
            },
        
            [eLanguage.CHS]: {
                [eFGNumber.currentTimes]: {pos: new PIXI.Point(260, -55)},
                // [eFGNumber.totalTimes]: {pos: new PIXI.Point(400, 115)},
                [eFGNumber.remainTimes]: {pos: new PIXI.Point(500, -55)},
                [eFGNumber.plus]: {pos: new PIXI.Point(500, -55)}
            },
        }
    break

    case eReelType._3x3_reel:
        window.NGReelData = [
            [	13,	3,	12,	11,	4,	13,	11,	3,	14,	1,	13,	12,	11,	14,	1,	21,	2,	12,	13,	3,	4,	11,	3,	1,	21,	4,	3,	14,	11,	12,	4,	3,	1,	4,	11,	2,	4,	21,	1,	3,	14,	11,	4,	2,	3,	14,	12,	11,	1,	21,	3,	12,	13,	4,	14,	12,	3,	13,	12,	3																																																																																																					],
            [	14,	12,	2,	1,	21,	3,	4,	13,	12,	2,	2,	14,	4,	4,	13,	14,	3,	1,	4,	12,	11,	1,	13,	11,	2,	12,	21,	14,	1,	13,	11,	12,	13,	2,	3,	21,	4,	1,	12,	11,	2,	13,	12,	3,	4,	2,	14,	11,	1,	1,	12,	11,	2,	3,	13,	14,	11,	2,	2,	13																																																																																																					],
            [	11,	4,	21,	2,	13,	12,	2,	2,	12,	14,	4,	13,	12,	1,	2,	4,	13,	14,	3,	11,	14,	2,	3,	4,	2,	14,	13,	11,	12,	3,	3,	3,	11,	13,	4,	4,	4,	14,	11,	3,	1,	13,	11,	14,	21,	12,	13,	11,	3,	14,	12,	4,	1,	12,	4,	14,	1,	3,	13,	12																																																																																																					],
       ]
        window.FGReelData = [
            [	14,	3,	13,	11,	14,	3,	2,	4,	14,	1,	3,	4,	12,	14,	1,	3,	2,	14,	12,	4,	13,	3,	2,	21,	1,	3,	13,	14,	1,	3,	11,	13,	12,	14,	1,	3,	21,	4,	1,	13,	12,	3,	14,	13,	3,	4,	12,	3,	1,	4,	11,	13,	4,	3,	14,	12,	3,	1,	4,	13																																																																																																					],
            [	4,	4,	12,	11,	2,	13,	12,	3,	3,	11,	12,	4,	2,	3,	4,	11,	12,	2,	2,	12,	11,	4,	12,	13,	11,	1,	1,	2,	2,	14,	13,	11,	3,	14,	13,	4,	4,	21,	3,	3,	11,	12,	13,	3,	4,	11,	14,	13,	4,	4,	13,	12,	2,	1,	11,	12,	2,	3,	4,	11																																																																																																					],
            [	3,	11,	14,	1,	1,	13,	12,	11,	2,	1,	3,	4,	13,	11,	14,	2,	2,	12,	14,	1,	1,	12,	11,	4,	3,	21,	1,	2,	14,	12,	3,	4,	21,	1,	2,	13,	14,	11,	4,	4,	12,	11,	14,	1,	1,	1,	12,	13,	11,	2,	13,	11,	14,	4,	4,	4,	13,	12,	3,	3																																																																																																					],
        ]

        window.NGSpinDataArr = [
            // 三條線，有FG
            {
                SpinInfo: {
                    WinType: 0x01,
                    SymbolResult: [[14, 21, 31], [14, 21, 14], [14, 21, 31], [14, 21, 14], [14, 21, 31]],
                    WinLineInfos: [
                        {SymbolID: eSymbolName.N4, WinPosition: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], Win: 1000, LineNo: 1},
                        {SymbolID: eSymbolName.WD, WinPosition: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]], Win: 9999, LineNo: 2},
                        // {SymbolID: eSymbolName.FG, WinPosition: [[0, 2], [2, 2], [4, 2]], Win: 1000, LineNo: 0},
                    ]
                }
            } as IGtoCNGPlay,
            // 正常一線得分
            {
                SpinInfo: {
                    WinType: 0x01,
                    SymbolResult: [[31, 1, 2], [11, 1, 2], [31, 1, 2], [11, 1, 2], [3, 4, 11]],
                    WinLineInfos: [
                        {SymbolID: eSymbolName.H1, WinPosition:  [[0, 1], [1, 1], [2, 1], [3, 1]], Win: 2222, LineNo: 2},
                    ]
                }
            } as IGtoCNGPlay,
            // 沒得獎
            {
                SpinInfo: {
                    WinType: 0,
                    SymbolResult: [[1, 2, 3], [11, 1, 2], [31, 1, 2], [11, 1, 2], [3, 4, 11]],
                    WinLineInfos: [
                    ]
                }
            } as IGtoCNGPlay,
        ]

        window.FGSpinDataArr = [
            // 沒有贏線
            {
                SpinInfo: {
                    WinType: 0,
                    SymbolResult: [[14, 3, 13], [4, 4, 12], [3, 11, 14], [13, 4, 13], [4, 12, 3]],
                    WinLineInfos: [
                        // {SymbolID: eSymbolName.N4, WinPosition: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], Win: 1000, LineNo: 1},
                    ]
                }
            } as IGtoCFGPlay,
            // 兩條贏線
            {
                SpinInfo: {
                    WinType: 0x01,
                    SymbolResult: [[21, 1, 3], [21, 3, 3], [3, 21, 1], [13, 4, 13], [4, 12, 3]],
                    WinLineInfos: [
                        {SymbolID: eSymbolName.WD, WinPosition: [[0, 0], [1, 0], [2, 1]], Win: 1000, LineNo: 6},
                    ]
                }
            } as IGtoCFGPlay,
        ]

        window.LineNumberDef = {
            [eLineNumber.lineWin]: {pos: new PIXI.Point(360, 380)}
        }

        window.FG_NumberDef = {
            [eLanguage.ENG]: {
                [eFGNumber.currentTimes]: {pos: new PIXI.Point(260, 115)},
                // [eFGNumber.totalTimes]: {pos: new PIXI.Point(400, 115)},
                [eFGNumber.remainTimes]: {pos: new PIXI.Point(400, 115)},
                [eFGNumber.plus]: {pos: new PIXI.Point(400, 115)}
            },
        
            [eLanguage.CHS]: {
                [eFGNumber.currentTimes]: {pos: new PIXI.Point(260, 115)},
                // [eFGNumber.totalTimes]: {pos: new PIXI.Point(400, 115)}
                [eFGNumber.remainTimes]: {pos: new PIXI.Point(400, 115)},
                [eFGNumber.plus]: {pos: new PIXI.Point(400, 115)}
            },
        }

    break

}

window.idx = -1
// w.sarr = [1, 2]
// w.arr = [1]



window.useServerData = false