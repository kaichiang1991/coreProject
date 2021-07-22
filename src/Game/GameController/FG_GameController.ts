import config from '@root/config'
import { App, eGameEventName } from "@root/src"
import GameSpineManager from "@root/src/System/Assets/GameSpineManager"
import GameSceneManager, { eGameScene } from "@root/src/System/GameSceneController"
import { eAppLayer } from "@root/src/System/LayerDef"
import GameDataRequest from "@root/src/System/Network/GameDataRequest"
import { Container, Graphics, Text, Texture } from "pixi.js-legacy"
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
const {Sprite} = PixiAsset

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
        this.black = App.stage.addChild(new Graphics().beginFill(0, .4).drawRect(0, 0, 1280, 1280).endFill())
        this.black.zIndex = eAppLayer.transition
        this.black.interactive = true
        this.black.name = 'transition black'

        const transitionCont: Container = this.black.addChild(new Container())
        transitionCont.name = 'transition container'
        
        // 轉場提示動畫
        const [tranSpine, inAnimDone] = GameSpineManager.playTransition(transitionCont)

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

        const titleCont: Container = transitionCont.addChild(new Container())
        FreeGameNumberManager.playTitleTimes(5, titleCont)      // 數字
        titleWord.setParent(titleCont)                          // 文字
        await waitTweenComplete(gsap.from(titleCont, {duration: .3, alpha: 0}))
        //#endregion 轉場

        // ToDo 到時候看 auto 設定?
        this.black.once('pointerdown', async ()=>{
            await Promise.all([
                waitTweenComplete(gsap.to(titleCont, {duration: .3, alpha: 0})),
                waitTrackComplete(tranSpine.setAnimation('FG_Title_Out'))
            ])            
            this.change()
        })
    }

    async change(){
        FreeGameNumberManager.clearTitleTimes()
        this.black.destroy()        // 收拾容器
        EventHandler.off(eEventName.orientationChange, this.resizeFn)
        
        EventHandler.dispatch(eGameEventName.transitionDone)
        // 對位圖
        // const po = App.stage.addChild(Sprite.from('assets/img/FG_W.png'))
        // po.zIndex = 999
        // po.alpha = .3
        // EventHandler.on(eEventName.orientationChange, ()=>{
        //     if(config.portrait){
        //         po.texture = Texture.from('assets/img/FG_M.png')
        //     }else{
        //         po.texture = Texture.from('assets/img/FG_W.png')

        //     }
        // })

        const {FGTotalTimes, WinLineInfos} = GameSlotData.NGSpinData.SpinInfo
        //#region FG場景
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

        await Sleep(1)
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