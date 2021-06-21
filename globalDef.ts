export enum eReelType{
    _3x5_reel,
    _3x5_single
}

var w: any = window as any
w.reelType = eReelType._3x5_single
w.reelType = eReelType._3x5_reel

import {eSymbolName} from "./src/Game/Reel/SymbolDef"

switch(w.reelType){
    case eReelType._3x5_reel:
        window.NGReelData = [
            [	13,	3,	12,	11,	4,	13,	11,	3,	14,	1,	13,	12,	11,	14,	1,	21,	2,	12,	13,	3,	4,	11,	3,	1,	21,	4,	3,	14,	11,	12,	4,	3,	1,	4,	11,	2,	4,	21,	1,	3,	14,	11,	4,	2,	3,	14,	12,	11,	1,	21,	3,	12,	13,	4,	14,	12,	3,	13,	12,	3																																																																																																					],
            [	14,	12,	2,	1,	21,	3,	4,	13,	12,	2,	2,	14,	4,	4,	13,	14,	3,	1,	4,	12,	11,	1,	13,	11,	2,	12,	21,	14,	1,	13,	11,	12,	13,	2,	3,	21,	4,	1,	12,	11,	2,	13,	12,	3,	4,	2,	14,	11,	1,	1,	12,	11,	2,	3,	13,	14,	11,	2,	2,	13																																																																																																					],
            [	11,	4,	21,	2,	13,	12,	2,	2,	12,	14,	4,	13,	12,	1,	2,	4,	13,	14,	3,	11,	14,	2,	3,	4,	2,	14,	13,	11,	12,	3,	3,	3,	11,	13,	4,	4,	4,	14,	11,	3,	1,	13,	11,	14,	21,	12,	13,	11,	3,	14,	12,	4,	1,	12,	4,	14,	1,	3,	13,	12																																																																																																					],
            [	13,	11,	4,	14,	1,	3,	11,	4,	2,	12,	13,	1,	12,	4,	13,	1,	14,	4,	12,	14,	13,	3,	2,	21,	1,	4,	12,	14,	13,	1,	4,	14,	12,	11,	1,	12,	3,	21,	1,	12,	4,	14,	11,	12,	13,	14,	3,	4,	2,	1,	4,	11,	14,	4,	12,	14,	3,	11,	12,	1																																																																																																					],
            [	11,	2,	3,	13,	11,	14,	3,	13,	14,	1,	1,	21,	3,	3,	11,	13,	4,	2,	3,	11,	13,	3,	4,	11,	13,	14,	1,	3,	2,	14,	13,	11,	2,	2,	21,	4,	4,	12,	11,	13,	14,	1,	3,	4,	12,	13,	2,	11,	12,	4,	2,	21,	3,	1,	11,	12,	3,	2,	13,	12																																																																																																					]
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

        w.FGData = {
            0: { result: [
                [11, 21, 21],
                [11, 21, 21],
                [11, 21, 21],
                [11, 21, 21],
                [11, 21, 21],
            ], winlineArr: [
                {SymbolID: eSymbolName.WD, WinPosition: [[0, 1], [1, 1], [2, 1]], Win: 9999, lineNo: 2},
                {SymbolID: eSymbolName.N1, WinPosition: [[0, 0], [1, 0], [2, 0]], Win: 3500, lineNo: 1},
            ]}
        }
    break

    case eReelType._3x5_single:
        w.NGReelData = Array(15).fill([1, 2, 0, 4, 11, 12, 13, 14, 21, 31])
        w.FGReelData = Array(15).fill([21, 21, 31, 0, 4, 3, 2, 1, 14, 13, 12, 11])
        w.NGData = {
            0: { result: [[1], [0], [3], ...Array(12).fill([1])], winlineArr: [
                {SymbolID: eSymbolName.N4, WinPosition: [[0, 0], [2, 0], [3, 0], [4, 0]], Win: 1000, lineNo: 1},
            ]},
            1: { result: [1, 2, 3, 4, 11, 21, 31, 31, 31, 21, 1, 2, 3, 4, 11].map(r => [r]), winlineArr: [
                {SymbolID: eSymbolName.FG, WinPosition: [[6, 0], [7, 0], [8, 0]], Win: 2000, lineNo: 2},
            ]}
        }
        w.FGData = {
            0: { result: [[1], [0], [3], ...Array(12).fill([1])], winlineArr: [
                {SymbolID: eSymbolName.N4, WinPosition: [[0, 0], [2, 0], [3, 0], [4, 0]], Win: 1000, lineNo: 1},
            ]},
            1: { result: [1, 2, 3, 4, 11, 21, 31, 31, 31, 21, 1, 2, 3, 4, 11].map(r => [r]), winlineArr: [
                {SymbolID: eSymbolName.FG, WinPosition: [[6, 0], [7, 0], [8, 0]], Win: 2000, lineNo: 2},
            ]}
        }
    break
}

window.idx = -1
// w.sarr = [1, 2]
// w.arr = [1]
w.FGTimes = 5



window.useServerData = true