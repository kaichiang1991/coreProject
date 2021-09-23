import { eSymbolLayer } from "../Game/Reel/SymbolDef";

enum eAppLayer{
    sceneContainer,
    blackCover,
    version,

    transition = 9999,
}

enum eNGLayer{
    background,
    sceneEffect,
    UI_Bottom,
    character,
    reelContainer,
}

enum eFGLayer{
    background,
    sceneEffect,
    UI_Bottom,
    character,
    reelContainer,
}

enum eReelContainerLayer{

    reelBg,
    normalSymbol,
    stickSymbol = normalSymbol + eSymbolLayer.total,
    upperStickSymbol,
    black = upperStickSymbol + 100,     // 預留一個範圍
    reelFrame,
    reelExpect,
    logo,

    // FreeGame 場次/倍數底板
    featureBottom1,
    featureBottom2,

    endSpinAnim,
    winAnimation,

    line = winAnimation + eSymbolLayer.total,
    lineNumber
}

export {eAppLayer, eNGLayer, eFGLayer, eReelContainerLayer}