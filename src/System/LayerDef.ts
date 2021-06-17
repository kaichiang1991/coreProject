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

    endSpinAnim,
    winAnimation,

    line,
    lineNumber
}

export {eAppLayer, eNGLayer, eReelContainerLayer}