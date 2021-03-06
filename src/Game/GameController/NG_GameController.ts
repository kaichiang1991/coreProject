import { App, editConfig, eGameEventName } from "@root/src"
import GameAudioManager, { eAudioName } from "@root/src/System/Assets/GameAudioManager"
import GameSpineManager from "@root/src/System/Assets/GameSpineManager"
import GameSceneManager, { eGameScene } from "@root/src/System/GameSceneController"
import GameDataRequest from "@root/src/System/Network/GameDataRequest"
import GameSlotData, { eWinType } from "../GameSlotData"
import ReelController, { eReelGameType, spinConfig, SymbolController } from "../Reel/ReelController"
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
        return this.instance || (this.instance = new NG_GameController())
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
        GameAudioManager.playAudioMusic(eAudioName.NG_BGM)
        EventHandler.dispatch(eEventName.betModelChange, {betModel: BetModel.getInstance()})
        ReelController.reset(eReelGameType.normalGame)          // 初始化滾輪
        this.change()
    }

    change(){
        this.context.changeState(eNG_GameState.start)
    }
}

class GameStart extends GameState{

    enter(){
        EventHandler.once(eEventName.startSpin, this.change.bind(this))
        // Auto  
        if(SlotUIManager.IsAuto)    EventHandler.dispatch(eEventName.startSpin)
        // 按空白鍵
        CustomInteractionManager.on(eCustomType.keyboard, eEventName.startSpin, ()=> EventHandler.dispatch(eEventName.startSpin))
    }

    async change(){
        GameAudioManager.playAudioEffect(eAudioName.spinButton)     // 播放點擊音效

        // 檢查餘額
        if(!this.checkCreditEnough()){
            SlotUIManager.activeAuto(false)            // 關 auto
            SystemErrorManager.showPrompOut(LocalizationManager.gameText('InsufficientBalanceTitle'))
            this.context.changeState(eNG_GameState.start)
            return
        }

        // 更新餘額
        BetModel.getInstance().startSpin()
        BetModel.getInstance().Win = 0
        EventHandler.dispatch(eEventName.betModelChange, {betModel: BetModel.getInstance()})

        this.context.changeState(eNG_GameState.spin)
    }

    exit(){
        CustomInteractionManager.off(eEventName.startSpin)
        EventHandler.dispatch(eGameEventName.activeBlackCover, {flag: false})       // 關閉贏分時的黑底
        LineManager.StopEachLineFn()                                                // 關閉逐線的演出
    }

    /**
     * 檢查餘額是否夠再spin一次
     * @returns true 餘額足夠 / false 餘額不足
     */
    private checkCreditEnough(): boolean{
        return BetModel.getInstance().credit >= BetModel.getInstance().TotalBet     // ToDo
    }
}

class StartSpin extends GameState{

    private stopEvent: IEventCallback

    async enter(){
        const {IsAutoSpeed} = SlotUIManager
        const allSpin: Promise<void> = ReelController.startSpin(IsAutoSpeed)

        // 最少的滾動時間
        const leastSpinDelay: Promise<void> = Sleep(IsAutoSpeed? spinConfig.turboLeastDuration: spinConfig.leastSpinDuration)

        // 接受server 資料 
        GameSlotData.NGSpinData = await GameDataRequest.NGSpin(BetModel.getInstance().Bet)

        const {RoundCode, SpinInfo} = GameSlotData.NGSpinData
        // 更新 細單單號
        BetModel.getInstance().roundCode = RoundCode
        EventHandler.dispatch(eEventName.betModelChange, {betModel: BetModel.getInstance()})

        const {ScreenOrg, ScreenOutput, SymbolResult} = SpinInfo
        ReelController.setResult(ScreenOrg)     // 設定結果，要看數學資料格式

        //#region 停輪前階段
        await leastSpinDelay                    // 等待最少滾動時間
        // feature 遊戲規則 e.g. 熊貓 / 宙斯2 的stick symbol
        
        //#endregion 停輪前階段
        this.stopEvent = EventHandler.once(eEventName.startSpin, ()=> {     // 收到點擊後的行為，增加播音效的動作
            GameAudioManager.playAudioEffect(eAudioName.spinButton)
            ReelController.StopNowEvent()
            this.unregisterEvent()
        })
        CustomInteractionManager.once(eCustomType.keyboard, eEventName.startSpin, this.stopEvent)
        
        ReelController.checkFGListening(SpinInfo)                      // 檢查並設定聽牌
        // ReelController.setListening(/** 聽牌軸陣列 */)              // 設定一般聽牌
        // ReelController.setSpecialListening(/** 聽牌軸陣列 */)       // 設定特殊聽牌
        if(IsAutoSpeed || SlotUIManager.IsStopNow){
            ReelController.StopNowEvent()                              // 急停
        }

        ReelController.stopSpin()
        await allSpin
        this.change()
    }

    change(){
        this.context.changeState(eNG_GameState.endSpin)
    }

    exit(){
        this.unregisterEvent()
    }

    /** 移除事件 */
    private unregisterEvent(){
        EventHandler.off(eEventName.startSpin, this.stopEvent)
        CustomInteractionManager.off(eEventName.startSpin)
    }
}

class EndSpin extends GameState{

    async enter(){

        const {WinType, WinLineInfos} = GameSlotData.NGSpinData.SpinInfo
        const isFreeGame: boolean = (WinType & eWinType.freeGame) != 0          // 判斷有沒有 FG
        const isWin: boolean = (WinType & eWinType.normal) != 0                 // 判斷有沒有一般得分

        if(isFreeGame){
            await this.playSpecialSymbol(this.getWinlineBySymbol(WinLineInfos, eSymbolName.FG)[0])
            GameSceneManager.switchGameScene(eGameScene.freeGame)
            await FG_GameController.getInstance().init()
            SlotUIManager.activeAutoSpeed(true)            // 恢復 turbo 模式
            GameSceneManager.switchGameScene(eGameScene.normalGame)
            ReelController.reset(eReelGameType.normalGame)
            await BigWinManager.playBigWin(App.stage, BetModel.getInstance().TotalBet, BetModel.getInstance().Win)

            EventHandler.dispatch(eGameEventName.activeBlackCover, {flag: true})

            // 跑全線時顯示加過的credit
            BetModel.getInstance().addCredit(BetModel.getInstance().Win)
            await LineManager.palyAllLineWinFromFG(WinLineInfos, BetModel.getInstance().Win)
            await LineManager.playFG_EachLine()
        }else if(isWin){            
            await LotteryController.init()
        }else{                  // 完全沒得分
            await Sleep(editConfig.game.noWinEachDelay)
        }
        
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
    private getWinlineBySymbol(winlineInfos: Array<ISSlotWinLineInfo>, symbol: eSymbolName): Array<ISSlotWinLineInfo>{
        return winlineInfos.filter(winline => winline.SymbolID == symbol)
    }

    /**
     * 播放 FG 或 BG 得獎符號
     */
    private async playSpecialSymbol(winline: ISSlotWinLineInfo){
        EventHandler.dispatch(eGameEventName.activeBlackCover, {flag: true})        // 壓黑

        // GameSpineManager.playNGCharacterWin()        // 播放主視覺得分演出
        const [audio] = GameAudioManager.playAudioEffect(eAudioName.FG_SymbolWin)
        const allPromise: Array<Promise<void>> = winline.WinPosition.map(pos => SymbolController.playWinAnimation(pos[0], pos[1], 2))        // 播放 symbol 得獎

        await Promise.all(allPromise)

        GameAudioManager.stopAudioEffect(audio)
        SymbolController.clearAllWinAnimation()        // 清除 symbol 得獎
        EventHandler.dispatch(eGameEventName.activeBlackCover, {flag: false})
    }
}

class RoundEnd extends GameState{

    async enter(){
        // 跟 server 要資料
        const roundEnd: IGtoCRoundEnd = await GameDataRequest.roundEnd()
        // 測試分數有沒有一致
        // 正式上線後不一致是正常，因為會多遊戲一起開
        if(BetModel.getInstance().credit != roundEnd.Balance){
            Debug.log('round end 分數不同', 
            `Balance: ${roundEnd.Balance}, 目前餘額: ${BetModel.getInstance().credit}, 目前贏分: ${BetModel.getInstance().Win}`)
        }
        BetModel.getInstance().credit = roundEnd.Balance

        this.change() 
    }

    change(){
        this.context.changeState(eNG_GameState.start)
    }
}