import { eSymbolLayer } from "../Game/Reel/SymbolDef";

enum eAppLayer{
    sceneContainer,
    blackCover,
    version,

    transition = 9999,
}

enum eNGLayer{
    background,
    reelContainer
}

enum eFGLayer{
    background,
    reelContainer,
}

enum eReelContainerLayer{

    reelBg,
    normalSymbol,
    stickSymbol = normalSymbol + eSymbolLayer.total,
    upperStickSymbol,
    reelFrame,
    black = 1000,
    logo,
    featureBottom = logo,
    FG_roundTimes = logo,
    FG_plusTimes,

    endSpinAnim,
    winAnimation,

    line,
    lineNumber
}

export {eAppLayer, eNGLayer, eFGLayer, eReelContainerLayer}