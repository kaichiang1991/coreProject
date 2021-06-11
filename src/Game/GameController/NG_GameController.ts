import { App } from "@root/src"
import GameSceneManager, { eGameScene } from "@root/src/System/GameSceneController"
import GameSlotData from "../GameSlotData"
import ReelController, { eReelGameType, SymbolController } from "../Reel/ReelController"
import { eSymbolName } from "../Reel/SymbolDef"
import { ISSlotWinLineInfo, LineManager } from "../Win/LineManager"
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
            console.log('change state', type)
        })

        // 初始化滾輪
        ReelController.reset(eReelGameType.normalGame)
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
        // if Auto( > 0) : EventHandler.dispatch(eEventName.startSpin)
    }

    async change(){
        // 檢查狀態

        // 檢查餘額

        this.context.changeState(eNG_GameState.spin)
    }

    exit(){
        EventHandler.dispatch(eEventName.activeBlack, {flag: false})
        console.log('stop each line', LineManager.StopEachLineFn)
        LineManager.StopEachLineFn()
    }
}

class StartSpin extends GameState{

    private stopEvent: Function

    async enter(){
        // 綁事件

        const allSpin: Promise<void> = ReelController.startSpin()

        // 接受server 資料 先寫假資料
        const winlineArr = !GameSlotData.NGSpinData? [
            {SymbolID: eSymbolName.N4, WinPosition: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], Win: 1000, lineNo: 1},
            {SymbolID: eSymbolName.WD, WinPosition: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]], Win: 9999, lineNo: 2},
            {SymbolID: eSymbolName.FG, WinPosition: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]], Win: 2000, lineNo: 3},
        ]: 
        [
            {SymbolID: eSymbolName.WD, WinPosition: [[0, 1], [1, 1], [2, 1]], Win: 9999, lineNo: 2}
        ]
        GameSlotData.NGSpinData = {...GameSlotData.NGSpinData, 
            result: [
                [14, 21, 31],
                [14, 21, 31],
                [14, 21, 31],
                [14, 21, 31],
                [14, 21, 31]
            ],
            winlineArr
        }

        ReelController.setResult(GameSlotData.NGSpinData.result)

        this.stopEvent = EventHandler.once(eEventName.startSpin, ()=> ReelController.StopNowEvent())
        if(SlotUIManager.IsAutoSpeed){
            this.stopEvent()
        }

        await Sleep(1)
        window['arr'] && ReelController.setListening(...window['arr'])
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
        return GameSlotData.NGSpinData.winlineArr?.filter(winline => winline.SymbolID == symbol)
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