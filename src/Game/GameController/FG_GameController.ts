import config from '@root/config'
import { App, eGameEventName } from "@root/src"
import GameSpineManager from "@root/src/System/Assets/GameSpineManager"
import GameSceneManager, { eGameScene } from "@root/src/System/GameSceneController"
import { eAppLayer } from "@root/src/System/LayerDef"
import GameDataRequest from "@root/src/System/Network/GameDataRequest"
import {Point} from "pixi.js-legacy"
import GameSlotData, { eWinType } from "../GameSlotData"
import FreeGameNumberManager from "../Number/FreeGameNumberManager"
import ReelController, { eReelGameType, SymbolController } from "../Reel/ReelController"
import StickSymbolController from '../Reel/StickSymbolController'
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
const {Container, Graphics, Sprite} = PixiAsset

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

    private black: Graphics
    private resizeFn: IEventCallback

    async enter(){
        //#region 轉場
        // 黑底
        this.black = App.stage.addChild(
            new Graphics('transition black', eAppLayer.transition)
            .drawColorRect(0, .4, new Point(), 1280, 1280) 
        )
        this.black.interactive = true

        const transitionCont: Container = this.black.addChild(new Container('transition container'))
        
        // 轉場提示動畫
        const inAnimDone: Promise<void> = GameSpineManager.playTransitionIn(transitionCont)

        // 展開文字
        const titleWord: Sprite = new Sprite('Transition_RoundWord.png')
        titleWord.anchor.set(.5)
        titleWord.position.set(0, -60)

        ;(this.resizeFn = EventHandler.on(eEventName.orientationChange, ()=>{
            const {portrait} = config
            if(portrait){
                transitionCont.scale.set(.9)
                transitionCont.position.set(360, 640)
            }else{
                transitionCont.scale.set(1)
                transitionCont.position.set(640, 360)
            }
        }))()

        await inAnimDone    // 等待展開

        const {FGTotalTimes} = GameSlotData.NGSpinData.SpinInfo
        const titleCont: Container = transitionCont.addChild(new Container('titleCont'))
        FreeGameNumberManager.playTitleTimes(FGTotalTimes, titleCont)      // 數字
        titleWord.setParent(titleCont)                                     // 文字
        await waitTweenComplete(gsap.from(titleCont, {duration: .3, alpha: 0}))
        //#endregion 轉場

        // ToDo 到時候看 auto 設定?
        this.black.once('pointerdown', async ()=>{
            await Promise.all([
                waitTweenComplete(gsap.to(titleCont, {duration: .3, alpha: 0})),
                GameSpineManager.playTransitionOut()
            ])            
            this.change()
        })
    }

    async change(){
        FreeGameNumberManager.clearTitleTimes()         // 清除TotalWin 數字
        GameSpineManager.clearTransition()              // 清除轉場
        this.black.destroy()                            // 收拾容器
        EventHandler.off(eEventName.orientationChange, this.resizeFn)
        EventHandler.dispatch(eGameEventName.transitionDone)            // 通知場景已轉場完畢

        //#region FG場景
        const {FGTotalTimes, WinLineInfos} = GameSlotData.NGSpinData.SpinInfo
        // 滾輪
        ReelController.reset(eReelGameType.freeGame)
        // 場次
        const {RemainTimesBottom, MultipleTimesBottom} = GameSceneManager.context.getCurrent()
        FreeGameNumberManager.playRemainTimes(FGTotalTimes, RemainTimesBottom)
        GameSpineManager.playFG_Odds(MultipleTimesBottom)

        // NG 盤面分數
        const win: number = WinLineInfos.reduce((pre, curr) => pre + curr.Win, 0)       // 統計NG盤面的所有贏分
        BetModel.getInstance().addWin(win)
        EventHandler.dispatch(eEventName.betModelChange, {betModel: BetModel.getInstance()})
        //#endregion FG場景

        await SymbolController.playFGStick()        // 播放 FG Stick

        // await Sleep(1)
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
        // FreeGameNumberManager.addCurrentTimes()                     // 增加目前場次
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
        GameSpineManager.endFGCharacterWin()
    }
}

class GameEnd extends GameState{

    private black: Graphics
    private resizeFn: IEventCallback

    async enter(){
        //#region 轉場
        // 黑底
        this.black = App.stage.addChild(
            new Graphics('transition black', eAppLayer.transition)
            .drawColorRect(0, .4, new Point(), 1280, 1280)
        )
        this.black.interactive = true
        
        const transitionCont: Container = this.black.addChild(new Container('transition container'))

        // 轉場提示動畫
        const inAnimDone: Promise<void> = GameSpineManager.playTransitionIn(transitionCont)

        // 展開文字
        const titleWord: Sprite = new Sprite('Transition_WinWord.png')
        titleWord.anchor.set(.5)
        titleWord.position.set(0, -85)

        ;(this.resizeFn = EventHandler.on(eEventName.orientationChange, ()=>{
            const {portrait} = config
            if(portrait){
                transitionCont.scale.set(.9)
                transitionCont.position.set(360, 640)
            }else{
                transitionCont.scale.set(1)
                transitionCont.position.set(640, 360)
            }
        }))()

        await inAnimDone

        const titleCont: Container = transitionCont.addChild(new Container('titleCont'))
        FreeGameNumberManager.playTotalWin(BetModel.getInstance().Win, titleCont)        // 數字
        titleWord.setParent(titleCont)                          // 文字
        await waitTweenComplete(gsap.from(titleCont, {duration: .3, alpha: 0}))

        await Sleep(2)          // 停留時間
        await Promise.all([
            waitTweenComplete(gsap.to(titleCont, {duration: .3, alpha: 0})),
            GameSpineManager.playTransitionOut()
        ])
        //#endregion 轉場

        this.change()
    }

    change(){
        FreeGameNumberManager.clearTotalWin()        // 清除TotalWin 數字
        GameSpineManager.clearTransition()           // 清除轉場
        this.black.destroy()                         // 收拾容器
        EventHandler.off(eEventName.orientationChange, this.resizeFn)

        // 清除場次
        // FreeGameNumberManager.clearCurrentTimes()
        FreeGameNumberManager.clearRemainTimes()
        GameSpineManager.clearFG_Odds()

        // 清除 FG 特色
        StickSymbolController.clearAll()

        EventHandler.dispatch(eEventName.FG_End)
    }
}