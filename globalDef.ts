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
        w.NGReelData = [
            [1, 2, 3, 4, 11, 12, 13, 14, 21, 31],
            [1, 2, 3, 4, 11, 12, 13, 14, 21, 14, 13, 12, 11],
            [1, 2, 3, 4, 11, 12, 13, 14, 21, 31],
            [1, 2, 3, 4, 11, 12, 13, 14, 21, 14, 13, 12, 11],
            [1, 2, 3, 4, 11, 12, 13, 14, 21, 31],
        ]
        
        w.NGData = {
            0: { result: [[14, 21, 31], [14, 21, 14], [14, 21, 31], [14, 21, 14], [14, 21, 31]], winlineArr: [
                {SymbolID: eSymbolName.N4, WinPosition: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], Win: 1000, lineNo: 1},
                {SymbolID: eSymbolName.WD, WinPosition: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]], Win: 9999, lineNo: 2},
                {SymbolID: eSymbolName.FG, WinPosition: [[0, 2], [2, 2], [4, 2]], Win: 2000, lineNo: 3},
            ]},
            1: { result: [[31, 1, 2], [11, 1, 2], [31, 1, 2], [11, 1, 2], [3, 4, 11]], winlineArr: [
                {SymbolID: eSymbolName.H1, WinPosition: [[0, 1], [1, 1], [2, 1], [3, 1]], Win: 2000, lineNo: 2},
            ]}
        }
    break

    case eReelType._3x5_single:
        w.NGReelData = Array(15).fill([1, 2, 3, 4, 11, 12, 13, 14, 21, 31])
        w.FGReelData = Array(15).fill([21, 21, 31, 4, 3, 2, 1, 14, 13, 12, 11])
        w.NGData = {
            0: { result: Array(15).fill([1]), winlineArr: [
                {SymbolID: eSymbolName.N4, WinPosition: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [11, 0]], Win: 1000, lineNo: 1},
            ]},
            1: { result: [1, 2, 3, 4, 11, 21, 31, 31, 31, 21, 1, 2, 3, 4, 11].map(r => [r]), winlineArr: [
                {SymbolID: eSymbolName.FG, WinPosition: [[6, 0], [7, 0], [8, 0]], Win: 2000, lineNo: 2},
            ]}
        }
    break
}

w.idx = 0