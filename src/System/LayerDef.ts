import { eSymbolLayer } from "../Game/Reel/SymbolDef";

enum eAppLayer{
    sceneContainer,
    version
}

enum eNGLayer{
    reelContainer
}

enum eReelContainerLayer{

    reelBg,
    normalSymbol,
    stickSymbol = normalSymbol + eSymbolLayer.total,
    upperStickSymbol,
    reelFrame,
    black = 1000,
    logo,
    FG_roundTimes = logo,
    FG_plusTimes,

    endSpinAnim,
    winAnimation,

    line,
    lineNumber
}

export {eAppLayer, eNGLayer, eReelContainerLayer}