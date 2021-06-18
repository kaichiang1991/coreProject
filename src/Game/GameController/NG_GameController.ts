import GameSceneManager, { eGameScene } from "@root/src/System/GameSceneController"
import GameDataRequest from "@root/src/System/Network/GameDataRequest"
import GameSlotData from "../GameSlotData"
import ReelController, { eReelGameType, SymbolController } from "../Reel/ReelController"
import { eSymbolName } from "../Reel/SymbolDef"
import { LineManager } from "../Win/LineManager"
import LotteryController from "../Win/LotteryController"
import FG_GameController from "./FG_GameController"

export enum eNG_GameState{
    init    = 'NG_Init',
    start   = 'NG_Start',
    spin    = 'NG_Spin',
    endSpin = 'NG_EndSpin',
    roundEnd = 'NG_RoundEnd'
}

const {GameStateContext, createState, GameState} = StateModule

export default class NG_GameController{
    private static instance: NG_GameController
    public static getInstance(): NG_GameController{
        return this.instance || new NG_GameController()
    }

    public init(){
        // 註冊狀態機
        const context: GameStateContext = new GameStateContext()

        context
        .regState(createState(GameInit, eNG_GameState.init, context))
        .regState(createState(GameStart, eNG_GameState.start, context))
        .regState(createState(StartSpin, eNG_GameState.spin, context))
        .regState(createState(EndSpin, eNG_GameState.endSpin, context))
        .regState(createState(RoundEnd, eNG_GameState.roundEnd, context))
        .changeState(eNG_GameState.init)
    }
}

class GameInit extends GameState{
    enter(){

        EventHandler.on(eEventName.gameStateChange, (ctx)=>{
            const {type} = ctx
            // console.log('change state', type)
        })

        EventHandler.dispatch(eEventName.betModelChange, {betModel: BetModel.getInstance()})
        ReelController.reset(eReelGameType.normalGame)          // 初始化滾輪

        this.change()
    }

    change(){
        this.context.changeState(eNG_GameState.start)
    }
}

class GameStart extends GameState{

    async enter(){
        EventHandler.once(eEventName.startSpin, this.change.bind(this))
        // Auto  
        if(SlotUIManager.IsAuto)    EventHandler.dispatch(eEventName.startSpin)
    }

    async change(){
        // 檢查狀態
    
        // 檢查餘額
        if(!this.checkCreditEnough()){
            SlotUIManager.activeSpinRound(false)            // 關 auto
            this.context.changeState(eNG_GameState.start)
            return
        }

        // 更新餘額
        BetModel.getInstance().startSpin()
        EventHandler.dispatch(eEventName.betModelChange, {betModel: BetModel.getInstance()})

        this.context.changeState(eNG_GameState.spin)
    }

    exit(){
        EventHandler.dispatch(eEventName.activeBlack, {flag: false})
        LineManager.StopEachLineFn()
    }

    /**
     * 檢查餘額是否夠再spin一次
     * @returns true 餘額足夠 / false 餘額不足
     */
    private checkCreditEnough(): boolean{
        return BetModel.getInstance().credit >= BetModel.getInstance().TotalBet
    }
}

class StartSpin extends GameState{

    private stopEvent: Function

    async enter(){
        const allSpin: Promise<void> = ReelController.startSpin()

        // 接受server 資料 
        if(!window.useServerData){
            await Sleep(1)
            window.idx = ++window.idx % window.NGSpinDataArr.length
            GameSlotData.NGSpinData = window.NGSpinDataArr[window.idx]
        }else{
            GameSlotData.NGSpinData = await GameDataRequest.NGSpin(BetModel.getInstance().Bet)
        }

        const {RoundCode, SpinInfo} = GameSlotData.NGSpinData
        // 更新 細單單號
        BetModel.getInstance().roundCode = RoundCode
        EventHandler.dispatch(eEventName.betModelChange, {betModel: BetModel.getInstance()})

        const {SymbolResult} = SpinInfo
        ReelController.setResult(SymbolResult)

        EventHandler.dispatch(eEventName.receiveServerData)
        this.stopEvent = EventHandler.once(eEventName.startSpin, ()=> ReelController.StopNowEvent())
        if(SlotUIManager.IsAutoSpeed){
            this.stopEvent()
        }

        window['arr'] && ReelController.setListening(...window['arr'])              // 設定一般聽牌
        window['sarr'] && ReelController.setSpecialListening(...window['sarr'])     // 設定特殊聽牌
        ReelController.stopSpin()

        await allSpin
        this.change()
    }

    change(){
        this.context.changeState(eNG_GameState.endSpin)
    }

    exit(){
        EventHandler.getListeners(eEventName.startSpin).length && EventHandler.off(eEventName.startSpin, this.stopEvent)
    }
}

class EndSpin extends GameState{

    async enter(){

        const isFreeGame: boolean = this.getWinlineBySymbol(eSymbolName.FG).length != 0        // 之後判斷server資料

        if(isFreeGame){
            await this.playSpecialSymbol(this.getWinlineBySymbol(eSymbolName.FG)[0])
            GameSceneManager.switchGameScene(eGameScene.freeGame)
            await FG_GameController.getInstance().init()
            GameSceneManager.switchGameScene(eGameScene.normalGame)
            ReelController.reset(eReelGameType.normalGame)
        }
        await LotteryController.init()
        this.change()
    }

    change(){
        this.context.changeState(eNG_GameState.roundEnd)
    }

    /**
     * 取得包含某個symbol的winline
     * @param symbol 要包含的symbol
     * @returns {ISSlotWinLineInfo}
     */
    private getWinlineBySymbol(symbol: eSymbolName): Array<ISSlotWinLineInfo>{
        return GameSlotData.NGSpinData.SpinInfo.WinLineInfos.filter(winline => winline.SymbolID == symbol)
    }

    /**
     * 播放 FG 或 BG 得獎符號
     */
    private async playSpecialSymbol(winline: ISSlotWinLineInfo){
        EventHandler.dispatch(eEventName.activeBlack, {flag: true})        // 壓黑
        // 播放 symbol 得獎
        const allPromise: Array<Promise<void>> = winline.WinPosition.map(pos => SymbolController.playWinAnimation(pos[0], pos[1], 2))
        await Promise.all(allPromise)
        // 清除 symbol 得獎
        SymbolController.clearAllWinAnimation()
        EventHandler.dispatch(eEventName.activeBlack, {flag: false})
    }
}

class RoundEnd extends GameState{

    enter(){
       // 跟 server 要資料
       this.change() 
    }

    change(){
        this.context.changeState(eNG_GameState.start)
    }
}