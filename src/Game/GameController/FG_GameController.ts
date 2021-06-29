import { App } from "@root/src"
import GameSceneManager, { eGameScene } from "@root/src/System/GameSceneController"
import GameDataRequest from "@root/src/System/Network/GameDataRequest"
import { Container, Graphics, Text } from "pixi.js-legacy"
import GameSlotData, { eWinType } from "../GameSlotData"
import FreeGameNumberManager from "../Number/FreeGameNumberManager"
import ReelController, { eReelGameType, SymbolController } from "../Reel/ReelController"
import FGLotteryController from "../Win/FGLotteryController"
import { LineManager } from "../Win/LineManager"

export enum eFG_GameState{
    init    = 'FG_Init',
    start   = 'FG_Start',
    spin    = 'FG_Spin',
    endSpin = 'FG_EndSpin',
    end     = 'FG_End'
}

const {GameStateContext, createState, GameState} = StateModule

export default class FG_GameController{
    private static instance: FG_GameController
    public static getInstance(): FG_GameController{
        return this.instance || new FG_GameController()
    }

    public async init(){
        return new Promise<void>(res => {
            EventHandler.once(eEventName.FG_End, ()=> res())

            // 註冊狀態機
            const context: GameStateContext = new GameStateContext()
            
            context
            .regState(createState(GameInit, eFG_GameState.init, context))
            .regState(createState(GameStart, eFG_GameState.start, context))
            .regState(createState(StartSpin, eFG_GameState.spin, context))
            .regState(createState(EndSpin, eFG_GameState.endSpin, context))
            .regState(createState(GameEnd, eFG_GameState.end, context))
            .changeState(eFG_GameState.init)
        })
    }
}

class GameInit extends GameState{

    async enter(){
        // 轉場
        const tr = App.stage.addChild(
            new Graphics().beginFill(0, .7).drawRect(0, 0, 720, 1280).endFill()
        )
        tr.zIndex = 999
        await waitTweenComplete(gsap.from(tr, {y: -1280}))
        tr.destroy()
        EventHandler.dispatch('transitionDone')

        const {FGTotalTimes, WinLineInfos} = GameSlotData.NGSpinData.SpinInfo
        // 場次
        FreeGameNumberManager.playCurrentTimes(0, ReelController.ReelContainer)
        FreeGameNumberManager.playRemainTimes(FGTotalTimes, ReelController.ReelContainer)
        ReelController.reset(eReelGameType.freeGame)

        // NG 盤面分數
        const win: number = WinLineInfos.reduce((pre, curr) => pre + curr.Win, 0)       // ToDo 之後看server格式
        BetModel.getInstance().addWin(win)
        EventHandler.dispatch(eEventName.betModelChange, {betModel: BetModel.getInstance()})

        await Sleep(1)
        this.change()
    }

    change(){
        this.context.changeState(eFG_GameState.start)
    }
}

class GameStart extends GameState{

    enter(){
        this.change() 
    }

    change(){
        this.context.changeState(eFG_GameState.spin)
    }
}

class StartSpin extends GameState{

    async enter(){
        FreeGameNumberManager.addCurrentTimes()                     // 增加目前場次
        FreeGameNumberManager.adjustRemainTimes(false)              // 減少剩餘場次

        const allSpin: Promise<void> = ReelController.startSpin()

        // 接受server 資料 
        if(!window.useServerData){
            await Sleep(1)
            window.idx = ++window.idx % window.FGSpinDataArr.length
            GameSlotData.FGSpinData = window.FGSpinDataArr[window.idx]
        }else{
            GameSlotData.FGSpinData = await GameDataRequest.FGSpin()
        }

        const {ScreenOutput, ScreenOrg, SymbolResult} = GameSlotData.FGSpinData.SpinInfo
        ReelController.setResult(ScreenOrg)

        if(SlotUIManager.IsAutoSpeed){
            ReelController.StopNowEvent()
        }

        ReelController.stopSpin()

        await allSpin
        this.change()
    }

    change(){
        this.context.changeState(eFG_GameState.endSpin)
    }
}

class EndSpin extends GameState{

    async enter(){

        const {WinType, FGRemainTimes} = GameSlotData.FGSpinData.SpinInfo
        const isFreeGame: boolean = (WinType & eWinType.freeGame) != 0
        const isWin: boolean = (WinType & eWinType.normal) != 0

        // 演加場次
        const plus: number = FGRemainTimes - FreeGameNumberManager.RemainTimes
        if(plus > 0){
            await FreeGameNumberManager.playPlusTotalTimes(FGRemainTimes)
            FreeGameNumberManager.adjustRemainTimes(true, plus)
        }
        isWin && await FGLotteryController.init()
        this.change()
    }

    change(){
        this.context.changeState(GameSlotData.FGSpinData.SpinInfo.FGRemainTimes > 0? eFG_GameState.start: eFG_GameState.end)
    }
    
    exit(){
        EventHandler.dispatch(eEventName.activeBlack, {flag: false})
        LineManager.StopEachLineFn()
    }
}

class GameEnd extends GameState{

    async enter(){
        const title: Container = GameSceneManager.getSceneContainer().addChild(new Container())
        title.name = 'title'
        let text: Text
        title.addChild(
            new Graphics().beginFill(0xFFFFFF, .7).drawRect(0, 0, 720, 1280).endFill(),
            text = new Text('恭喜贏分\n999999')
        )
        text.position.set(360, 300)
        
        await Sleep(2)
        // 清除場次
        FreeGameNumberManager.clearCurrentTimes()
        FreeGameNumberManager.clearRemainTimes()

        title.destroy()
        this.change()
    }

    change(){
        EventHandler.dispatch(eEventName.FG_End)
    }
}