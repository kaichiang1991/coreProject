export enum eReelType{
    _3x5_reel,
    _3x5_single,
    _3x3_reel
}

window.reelType = eReelType._3x5_single
window.reelType = eReelType._3x5_reel
window.reelType = eReelType._3x3_reel

switch(window.reelType){
    case eReelType._3x5_reel:
        window.reelContSize = {width: 860, height: 480}
    break
    case eReelType._3x5_reel:
        window.reelContSize = {width: 860, height: 480}
    break
    case eReelType._3x3_reel:
        window.reelContSize = {width: 700, height: 510}
    break
}

import {eSymbolName} from "./src/Game/Reel/SymbolDef"
import { eFGNumber } from "./src/Game/Number/FreeGameNumberManager"
import { eLineNumber } from "./src/Game/Number/LineNumberManager"

switch(window.reelType){
    //#region 3x5 整輪
    case eReelType._3x5_reel:
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
        window.LineNumberDef = {
            [eLineNumber.lineWin]: {pos: new PIXI.Point(0, -35), anchor: new PIXI.Point(0, .5)},
            // [eLineNumber.multiply]: {pos: new PIXI.Point()}
        }

        window.FG_NumberDef = {
            [eLanguage.ENG]: {
                [eFGNumber.titleTimes]: {pos: new PIXI.Point(-225, -85)},
                [eFGNumber.currentTimes]: {pos: new PIXI.Point(0, -65)},
                // [eFGNumber.totalTimes]: {pos: new PIXI.Point(400, 115)},
                [eFGNumber.remainTimes]: {pos: new PIXI.Point(365, 27)},
                [eFGNumber.plus]: {pos: new PIXI.Point(425, 27)},
                [eFGNumber.totalWin]: {pos: new PIXI.Point(0, -15)}
            },
        
            [eLanguage.CHS]: {
                [eFGNumber.titleTimes]: {pos: new PIXI.Point(-210, -55)},
                [eFGNumber.currentTimes]: {pos: new PIXI.Point(0, -65)},
                // [eFGNumber.totalTimes]: {pos: new PIXI.Point(400, 115)},
                [eFGNumber.remainTimes]: {pos: new PIXI.Point(360, 27)},
                [eFGNumber.plus]: {pos: new PIXI.Point(415, 27)},
                [eFGNumber.totalWin]: {pos: new PIXI.Point(0, -25)}
            },
        }

        window.logoPos = new PIXI.Point(125, -35)
        window.reelContScale = 1
        window.reelBgPos = new PIXI.Point(-237, 0)
        window.reelFramePos = new PIXI.Point(-335, -70)
        window.reelMaskPos = window.reelBgPos

    break
    // #endregion 3x3 整輪
}