import { App } from "@root/src"
import GameSceneManager, { eGameScene } from "@root/src/System/GameSceneController"
import ReelController from "../Reel/ReelController"
import { LineManager } from "../Win/LineManager"
import LotteryController from "../Win/LotteryController"

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

        UIManager.init(App.stage, {line: 9, moneyFractionMultiple: 1000, languageData: {AutoSpinListTitle: 'auto spin', BetListTitle: 'bet list'}, denom: 10})

        EventHandler.on(eEventName.gameStateChange, (ctx)=>{
            const {type} = ctx
            console.log('change state', type)
        })

        // 初始化滾輪
        ReelController.reset()
        
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

    change(){
        // 檢查狀態

        // 檢查餘額

        this.context.changeState(eNG_GameState.spin)
    }

    exit(){
        EventHandler.dispatch(eEventName.activeBlack, {flag: false})
        LineManager.StopEachLineFn && LineManager.StopEachLineFn()
    }
}

class StartSpin extends GameState{

    private stopEvent: Function

    async enter(){
        // 綁事件

        const allSpin: Promise<void> = ReelController.startSpin()

        ReelController.setResult([
            [3, 3, 3],
            [3, 3, 3],
            [3, 3, 3],
            [3, 3, 3],
            [3, 3, 3]
        ])

        this.stopEvent = EventHandler.once(eEventName.stopSpin, ()=> ReelController.StopNowEvent())
        EventHandler.on(eEventName.startSpin, ()=> EventHandler.dispatch(eEventName.stopSpin))          // UI好了要改

        setTimeout(() => {
            // ReelController.setListening(0)
            // ReelController.setListeningEffect(-1)
            window['arr'] && ReelController.setListening(...window['arr'])
            ReelController.stopSpin()
        }, 1000)


        await allSpin
        this.change()
    }

    change(){
        this.context.changeState(eNG_GameState.endSpin)
    }

    exit(){
        EventHandler.getListeners(eEventName.stopSpin).length && EventHandler.off(eEventName.stopSpin, this.stopEvent)
    }
}

class EndSpin extends GameState{

    async enter(){

        const isFreeGame: boolean = true        // 之後判斷server資料

        if(isFreeGame){
            await this.playSpecialSymbol()
            await GameSceneManager.switchGameScene(eGameScene.freeGame)
        }
        await LotteryController.init()
        this.change()
    }

    change(){
        this.context.changeState(eNG_GameState.roundEnd)
    }

    /**
     * 播放 FG 或 BG 得獎符號
     */
    private async playSpecialSymbol(){
        EventHandler.dispatch(eEventName.activeBlack, {flag: true})        // 壓黑
        // 播放 symbol 得獎
        
        await Sleep(2)

        // 清除 symbol 得獎
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