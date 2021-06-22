import { eSymbolLayer } from "../Game/Reel/SymbolDef";

enum eAppLayer{
    sceneContainer,
    version
}

enum eNGLayer{
    reelContainer,
    logo
}

enum eReelContainerLayer{

    normalSymbol,
    stickSymbol = normalSymbol + eSymbolLayer.total,
    upperStickSymbol,
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