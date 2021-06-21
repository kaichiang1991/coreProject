import { App } from "@root/src"
import GameSceneManager, { eGameScene } from "@root/src/System/GameSceneController"
import GameDataRequest from "@root/src/System/Network/GameDataRequest"
import { Container, Graphics, Text } from "pixi.js-legacy"
import GameSlotData, { eWinType } from "../GameSlotData"
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
            EventHandler.once(eEventName.FG_End, res)

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
        ReelController.reset(eReelGameType.freeGame)
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

    private stopEvent: Function

    async enter(){
        const allSpin: Promise<void> = ReelController.startSpin()

        // 接受server 資料 先寫假資料
        GameSlotData.FGSpinData = window['FGData'][0]
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

    exit(){
        EventHandler.getListeners(eEventName.startSpin).length && EventHandler.off(eEventName.startSpin, this.stopEvent)
    }
}

class EndSpin extends GameState{

    async enter(){

        const {WinType} = GameSlotData.FGSpinData.SpinInfo
        const isFreeGame: boolean = (WinType & eWinType.freeGame) != 0
        const isWin: boolean = (WinType & eWinType.normal) != 0

        // ToDo 演加場次
        isWin && await FGLotteryController.init()
        this.change()
    }

    change(){
        this.context.changeState(--window['FGTimes'] > 0? eFG_GameState.start: eFG_GameState.end)
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
        title.destroy()
        this.change()
    }

    change(){
        EventHandler.dispatch(eEventName.FG_End)
    }
}