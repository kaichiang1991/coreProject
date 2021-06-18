interface ICtoGStructure{
    Code: number
}

interface IGtoCStructure{
    Code: number
    Result: number
}

//#endregion JoinGame
interface ICtoGJoinGame extends ICtoGStructure{
    GameToken: string
    GameID: number
    DemoOn: boolean
    Lang: string
}

interface IGtoCJoinGame extends IGtoCStructure{
    GameToken: string
    Result: number
    GameID: number
    GameName: string
    AccountID: number
    DemoOn: boolean
    Balance: number
    CurrencyID: number
}
//#endregion

//#region SlotInit
interface IGtoCSlotInit extends IGtoCStructure{
    MoneyFractionMultiple: number
    Denom: number
    Line: number
    BetMultiples: Array<number>
    BetUnit: number
}
//#endregion

//#region 共用結構
interface ISSlotSpinInfo{
    GameState: number
    WinType: number
    Multiplier: number
    ScreenOrg: Array<Array<number>>
    SymbolResult: Array<Array<number>>
    ScreenOutput: Array<Array<number>>
    WinLineInfos: Array<ISSlotWinLineInfo>
    FGTotalTimes: number
    FGCurrentTimes: number
    FGRemainTimes: number
    FGMaxFlag: boolean
    Win: number
    ExtraData?: string
    Stage?: number,
    Collection?: number
    DemoModeRound?: number
}

interface ISSlotWinLineInfo{
    LineNo: number
    SymbolID: number
    SymbolType: number
    SymbolCount: number
    WayCount: number
    WinPosition: Array<Array<number>>
    Multiplier: number
    WinOrg: number
    Win: number
    WinType: number
    Odds: number
}

interface ISSlotOptionValue{
    OptionValueType: number,
    SelectedValue: number,
    OtherValues: Array<number>
}
//#endregion

//#region NormalGame
interface ICtoGNGPlay extends ICtoGStructure{
    BetMultiple: number
}

interface IGtoCNGPlay extends IGtoCStructure{
    Result: number
    RoundCode: string
    SpinInfo: ISSlotSpinInfo
    LDOption: Array<ISSlotOptionValue>
    WaitNGRespin: boolean
}
//#endregion