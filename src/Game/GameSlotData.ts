export enum eWinType{
    none = 0,
    normal = 0x01,
    freeGame = 0x02,
    bonusGame = 0x04,
    feature = 0x08,
    doubleGame = 0x10
}

export default class GameSlotData{

    public static SlotInitData: IGtoCSlotInit
    public static JoinGameData: IGtoCJoinGame
    public static NGSpinData: IGtoCNGPlay
    public static FGSpinData: IGtoCFGPlay
}