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
    black = 1000,
    reelFrame,
    reelExpect,
    logo,
    featureOddsBottom,
    featureRemainBottom,     // 因為加場次數字在剩餘場次的底板上，所以剩餘次數底板要在上面

    endSpinAnim,
    winAnimation,

    line,
    lineNumber
}

export {eAppLayer, eNGLayer, eFGLayer, eReelContainerLayer}