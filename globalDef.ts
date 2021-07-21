export enum eReelType{
    _3x5_reel,
    _3x5_single,
    _3x3_reel
}

window.reelType = eReelType._3x5_single
window.reelType = eReelType._3x5_reel
window.reelType = eReelType._3x3_reel

import {eSymbolName} from "./src/Game/Reel/SymbolDef"
import { eFGNumber } from "./src/Game/Number/FreeGameNumberManager"
import { eLineNumber } from "./src/Game/Number/LineNumberManager"

switch(window.reelType){
    //#region 3x5 整輪
    case eReelType._3x5_reel:
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

        window.blackGraphic = [0, 0, 860, 480]

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

        window.logoPos = new PIXI.Point(415, -35)
        window.reelContScale = .8
    break
    //#endregion 3x5 整輪

    //#region 3x5 單顆
    case eReelType._3x5_single:
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
        window.blackGraphic = [0, 0, 860, 480]


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

        window.logoPos = new PIXI.Point(415, -35)
        window.reelContScale = .8

    break
    //#endregion 3x5 單顆

    //#region 3x3 整輪
    case eReelType._3x3_reel:
        window.NGSpinDataArr = [
            // 三條線，有FG
            {
                SpinInfo: {
                    WinType: 0x03,
                    ScreenOrg: [[14, 21, 31], [14, 21, 14], [14, 21, 31]],
                    SymbolResult: [[14, 21, 31], [14, 21, 14], [14, 21, 31]],
                    FGTotalTimes: 10,
                    WinLineInfos: [
                        {SymbolID: eSymbolName.N4, WinPosition: [[0, 0], [1, 0], [2, 0]], Win: 1000, LineNo: 1},
                        {SymbolID: eSymbolName.WD, WinPosition: [[0, 1], [1, 1], [2, 1]], Win: 9999, LineNo: 2},
                        {SymbolID: eSymbolName.FG, WinPosition: [[0, 2], [2, 2], [3, 2]], Win: 1000, LineNo: 0},
                    ]
                }
            } as IGtoCNGPlay
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

        window.blackGraphic = [-235, 0, 700, 510]

        window.LineNumberDef = {
            [eLineNumber.lineWin]: {pos: new PIXI.Point(120, 230)}
        }

        window.FG_NumberDef = {
            [eLanguage.ENG]: {
                [eFGNumber.titleTimes]: {pos: new PIXI.Point(-210, -55)},
                [eFGNumber.currentTimes]: {pos: new PIXI.Point(0, -65)},
                // [eFGNumber.totalTimes]: {pos: new PIXI.Point(400, 115)},
                [eFGNumber.remainTimes]: {pos: new PIXI.Point(360, 10)},
                [eFGNumber.plus]: {pos: new PIXI.Point(400, -65)}
            },
        
            [eLanguage.CHS]: {
                [eFGNumber.titleTimes]: {pos: new PIXI.Point(-210, -55)},
                [eFGNumber.currentTimes]: {pos: new PIXI.Point(0, -65)},
                // [eFGNumber.totalTimes]: {pos: new PIXI.Point(400, 115)},
                [eFGNumber.remainTimes]: {pos: new PIXI.Point(360, 10)},
                [eFGNumber.plus]: {pos: new PIXI.Point(400, -65)}
            },
        }

        window.logoPos = new PIXI.Point(125, -35)
        window.reelContScale = 1
        window.reelBgPos = new PIXI.Point(-335, -70)

    break
    // #endregion 3x3 整輪
}

window.idx = -1
// w.sarr = [1, 2]
// w.arr = [1]



window.useServerData = true