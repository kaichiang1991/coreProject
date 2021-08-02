import config from '@root/config'
import { App, editConfig, eGameEventName, isWindowBlur } from "@root/src"
import GameAudioManager, { eAudioName } from '@root/src/System/Assets/GameAudioManager'
import GameSpineManager from "@root/src/System/Assets/GameSpineManager"
import GameSceneManager, { eGameScene } from "@root/src/System/GameSceneController"
import { eAppLayer } from "@root/src/System/LayerDef"
import GameDataRequest from "@root/src/System/Network/GameDataRequest"
import {Point} from "pixi.js-legacy"
import GameSlotData, { eWinType } from "../GameSlotData"
import FreeGameNumberManager from "../Number/FreeGameNumberManager"
import ReelController, { eReelGameType, SymbolController } from "../Reel/ReelController"
import StickSymbolController from '../Reel/StickSymbolController'
import { eSymbolName } from '../Reel/SymbolDef'
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
            EventHandler.once(eGameEventName.FG_End, ()=> res())

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
        const setVolumeFn: Function = (flag: boolean) =>{       // 設定音量
            if(isWindowBlur)    return
            EventHandler.dispatch(eEventName.setMusicVolume, {volume: flag? .4: 1})
        }

        setVolumeFn(true)
        const [transitionAudio, audioDone] = GameAudioManager.playAudioEffect(eAudioName.FG_Transition)
        audioDone.then(setVolumeFn.bind(this, false))       // 視窗宣告音效播完後，回復原本音樂音量

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

        // Auto 選單內有設定遇到 FG 則停止Auto
        if(SlotUIManager.IsAuto && AutoSpinListUIManager.FreeGameSwitch)
            SlotUIManager.activeAuto(false)
        
        await Promise.race([
            // Auto 時，自動進入
            SlotUIManager.IsAuto? Sleep(editConfig.game.FG_TitleAutoDelay): new Promise<void>(()=>{}),
            // 點擊畫面進入
            new Promise<void>(res =>this.black.on('pointerdown', res))
        ])
        this.black.removeAllListeners()
        await Promise.all([
            waitTweenComplete(gsap.to(titleCont, {duration: .3, alpha: 0})),
            GameSpineManager.playTransitionOut()
        ])     

        GameAudioManager.stopAudioEffect(transitionAudio)
        this.change()
    }

    async change(){
        GameAudioManager.playAudioMusic(eAudioName.FG_BGM)

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

    async enter(){
        // 增加 FG 倍數
        if(GameSlotData.FGSpinData?.SpinInfo.WinType & eWinType.normal){        // 上一局有得分
            await GameSpineManager.playNextFG_Odds()      
        }

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

        // 接收server 資料 
        GameSlotData.FGSpinData = await GameDataRequest.FGSpin()

        const {SpinInfo} = GameSlotData.FGSpinData
        const {ScreenOutput, ScreenOrg, SymbolResult} = SpinInfo
        ReelController.setResult(ScreenOrg)

        if(SlotUIManager.IsAutoSpeed){
            ReelController.StopNowEvent()
        }
        
        ReelController.checkFGListening(SpinInfo)
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

        const {WinLineInfos, WinType, FGRemainTimes} = GameSlotData.FGSpinData.SpinInfo
        const isFreeGame: boolean = (WinType & eWinType.freeGame) != 0
        const isWin: boolean = (WinType & eWinType.normal) != 0

        // 演加場次
        const plus: number = FGRemainTimes - FreeGameNumberManager.RemainTimes
        if(plus > 0){               // 用場次判斷，避免有中FG，卻擋掉場次上限的問題
            GameAudioManager.playAudioEffect(eAudioName.FG_PlusTimes)
            await Promise.all([
                this.playSpecialSymbol(this.getWinlineBySymbol(WinLineInfos, eSymbolName.FG)[0]),
                FreeGameNumberManager.playPlusTotalTimes(FGRemainTimes)
            ])
            FreeGameNumberManager.adjustRemainTimes(true, plus)
            await Sleep(.5)
        }
        isWin && await FGLotteryController.init()
        this.change()
    }

    change(){
        this.context.changeState(GameSlotData.FGSpinData.SpinInfo.FGRemainTimes > 0? eFG_GameState.start: eFG_GameState.end)
    }
    
    exit(){
        EventHandler.dispatch(eGameEventName.activeBlackCover, {flag: false})
        LineManager.StopEachLineFn()
        // GameSpineManager.endFGCharacterWin()
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

        const allPromise: Array<Promise<void>> = winline.WinPosition.map(pos => SymbolController.playWinAnimation(pos[0], pos[1], 1, true))        // 播放 symbol 得獎
        .concat()       // 如果 WD 有連線得分，這裡要再加上跑分的 promise

        await Promise.all(allPromise)
        SymbolController.clearAllWinAnimation()        // 清除 symbol 得獎
        EventHandler.dispatch(eGameEventName.activeBlackCover, {flag: false})
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
        GameAudioManager.stopCurrentMusic()
        const [transitionAudio] = GameAudioManager.playAudioEffect(eAudioName.FG_TotalWin)
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
        GameAudioManager.stopAudioEffect(transitionAudio)
        //#endregion 轉場

        this.change()
    }

    change(){
        GameAudioManager.playAudioMusic(eAudioName.NG_BGM)      // 播回 NG 音樂
        FreeGameNumberManager.clearTotalWin()                   // 清除TotalWin 數字
        GameSpineManager.clearTransition()                      // 清除轉場
        this.black.destroy()                                    // 收拾容器
        EventHandler.off(eEventName.orientationChange, this.resizeFn)

        // 清除場次
        // FreeGameNumberManager.clearCurrentTimes()
        FreeGameNumberManager.clearRemainTimes()
        GameSpineManager.clearFG_Odds()

        // 清除 FG 特色
        StickSymbolController.clearAll()

        EventHandler.dispatch(eGameEventName.FG_End)
    }
}