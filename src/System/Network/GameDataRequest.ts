export enum eCommand{

    CtoGPing = -1,
    GtoCPong = -2,
    
    GtoCGameError = 1001,

    CtoGJoinGame = 1002,
    GtoCJoinGame = 1005,

    GtoCPlayerBalance = 1011,
    GtoCJackpotValue = 1013,

    GtoCSlotInit = 11001,

    CtoGSlotNGPlay = 11002,
    GtoCSlotNGPlay = 11003,

    CtoGSlotBGPlay = 11004,
    GtoCSlotBGPlay = 11005,

    CtoGSlotLDPlay = 11006,
    GtoCSlotLDPlay = 11007,

    CtoGSlotFGPlay = 11008,
    GtoCSlotFGPlay = 11009,

    CtoGSlotRoundEnd = 11010,
    GtoCSlotRoundEnd = 11011,

    CtoGSlotDGPlay = 11012,
    GtoCSlotDGPlay = 11013,
}

import { NetworkManager } from "./NetworkManager"

export default class GameDataRequest{

    private static async requestData(data: ICtoGStructure){
        return NetworkManager.sendMsg(data)
    }

    /**
     * 傳送 joinGame 請求
     * @param GameToken 遊戲token
     * @param GameID 遊戲ID
     * @param DemoOn 是否開啟demo模式
     * @returns {IGtoCJoinGame}
     */
    public static async joinGame(GameToken: string, GameID: number, DemoOn: boolean){
        const data: ICtoGJoinGame = {
            Code: eCommand.CtoGJoinGame,
            GameToken, GameID, DemoOn,
            Lang: LocalizationManager.getLanguage()
        }

        const receiveData: IGtoCJoinGame = await this.requestData(data) as IGtoCJoinGame
        return receiveData
    }

    /**
     * 傳送 NG 請求
     * @param BetMultiple 壓住乘數
     * @returns {IGtoCNGPlay}
     */
    public static async NGSpin(BetMultiple: number){
        const data: ICtoGNGPlay = {
            Code: eCommand.CtoGSlotNGPlay, BetMultiple
        }

        const receiveData: IGtoCNGPlay = await this.requestData(data) as IGtoCNGPlay
        return receiveData
    }

    /**
     * 傳送 FG 請求
     * @param BetMultiple 壓住乘數
     * @returns {IGtoCNGPlay}
     */
    public static async FGSpin(){
        const data: ICtoGFGPlay = {
            Code: eCommand.CtoGSlotFGPlay
        }

        const receiveData: IGtoCFGPlay = await this.requestData(data) as IGtoCFGPlay
        return receiveData
    }

    /**
     * 傳送 roundEnd 請求
     * @returns {IGtoCRoundEnd}
     */
    public static async roundEnd(){
        const data: ICtoGRoundEnd = {
            Code: eCommand.CtoGSlotRoundEnd
        }
        
        const receiveData: IGtoCRoundEnd = await this.requestData(data) as IGtoCRoundEnd
        return receiveData
    }
}