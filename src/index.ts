import { Application, Container, Text, TextStyle } from 'pixi.js-legacy'
import gsap from 'gsap'
window.gsap = gsap
import '@root/globalDef.ts'
import gameConfigUrl from '@root/gameConfig.json'
import config from '@root/config'
import GameSceneManager, { eGameScene } from './System/GameSceneController'
import { eAppLayer } from './System/LayerDef'
import GSAPManager from './System/GSAPManager'
import GameAssetManager from './System/Assets/GameAssetManager'
import AppDebug from './System/AppDebug'

import editJson from '@root/editConfig.json'
import NG_GameController from './Game/GameController/NG_GameController'
import GameDataRequest from './System/Network/GameDataRequest'
import { NetworkManager } from './System/Network/NetworkManager'
import GameSlotData from './Game/GameSlotData'
import GameAudioManager from './System/Assets/GameAudioManager'

export enum eGameEventName{
    activeBlackCover = 'activeBlackCover',      // 啟動贏分的黑色遮罩
    transitionDone = 'transitionDone',
    startFG = 'startFG',
    FG_Win = 'FG_Win',
    FG_End = 'FG_End',
    NG_lotteryEnd = 'NG_lotteryEnd',
    FG_lotteryEnd = 'FG_lotteryEnd',
}

// 顯示專案資訊
const {name, version, size, fps} = config
console.log(`%cProject "${name}", version: "${version}"`, 'background-color:yellow; padding: 1px 30px; fontFamily: 600 Ariel; font-size: 24px;')

EventHandler.init()     // 初始化事件管理

const {width, height} = size
export const App: Application = new Application({
    width, height, backgroundColor: 0x000000, autoStart: false//, autoDensity: true
})

// init Pixi Application
const {view, stage} = App
const div: HTMLElement = document.querySelector('#div_pixi')
div.appendChild(view)
stage.sortableChildren = true
gsap.ticker.fps(fps)
gsap.ticker.add(()=> App.ticker.update())

// 版號
const versionText: Text = stage.addChild(new Text(`v${version}`, new TextStyle({
    fontSize: 20,
    fontWeight: 'bold',
    stroke: 'black',
    strokeThickness: 1,
    fill: 'white'
})))
versionText.zIndex = eAppLayer.version
versionText.anchor.set(1.2, -.1)
EventHandler.on(eEventName.orientationChange, ()=> {
    const {portrait, size: {width, height}} = config
    versionText.position.x = portrait? width: height
})

// 註冊視窗事件
window.addEventListener('visibilitychange', ()=>{
    if(SystemErrorManager.IsError)
        return
    const context: {volume: number} = {volume: document.visibilityState == 'visible'? 1: 0}
    EventHandler.dispatch(eEventName.setMusicVolume, context)
    EventHandler.dispatch(eEventName.setEffectVolume, context)
})

export let editConfig: IEditConfig, gameConfig: IGameConfig
// 遊戲入口
const gameEntry: Function = async ()=>{
    config.canUseWebp = await supportWebp()
    editConfig = await PixiAsset.JSON.getJson(editJson.toString())
    gameConfig = await PixiAsset.JSON.getJson(gameConfigUrl.toString())

    CustomInteractionManager.init(App)
    Entry.init(App, config)
    AppDebug.init()
    // 在沒有外部帶入的情況下，預設 prod 連 DEV 環境，develop 連 local 環境
    ParameterParse.init(process.env.NODE_ENV == 'production'? 'wss://gsvr1.msgaming.one': 'ws://192.168.1.116:12201')
    // ParameterParse.init('wss://gsvr1.msgaming.one')
    GSAPManager.init()
    LocalizationManager.init()
    GameAssetManager.init()
    GameSceneManager.init()
    StateModule.init()
    await SystemErrorManager.init(stage, config)
    
    //#region Loading
    const loadingCont: Container = GameSceneManager.switchGameScene(eGameScene.loading)
    await Loading.init(loadingCont, config)
    const loading: Promise<void> = Loading.startLoading()
    await NetworkManager.init()
    // 取得設定檔的設定
    const {DemoOn, GameID} = gameConfig
    GameSlotData.JoinGameData = await GameDataRequest.joinGame(ParameterParse.UrlParser.token, GameID, DemoOn)
    document.title = GameSlotData.JoinGameData.GameName           // 設定 html title
    await GameAssetManager.loadAsset()
    // 通知 loading 結束
    Loading.finishLoading()
    await loading
    //#endregion Loading

    //#region 註冊遊戲內事件
    const {url} = PIXI.utils
    const {href} = url.parse(document.URL)
    const dispatchObj: Object = {gameCode: 'BN' + gameConfig.GameID, gameLanguage: LocalizationManager.getLanguage()}
    EventHandler.on(eEventName.openGameInfo, ()=>{
        EventHandler.dispatch(eEventName.popupWindow, {...dispatchObj, url: url.resolve(href, `../GameCommon/GameInfo/${dispatchObj['gameCode']}.html`)})
    })
    EventHandler.on(eEventName.openHistory, ()=>{
        EventHandler.dispatch(eEventName.popupWindow, {...dispatchObj, gameToken: ParameterParse.UrlParser.token, betQuery: ParameterParse.UrlParser.betQuery, url: url.resolve(href, '../GameCommon/GameResult/index.html')})
    })
    //#endregion 註冊遊戲內事件

    // 遊戲場景轉換
    await UIManager.init(App.stage, config, {playAudio: GameAudioManager.playAudioEffect.bind(GameAudioManager)})
    GameSceneManager.switchGameScene(eGameScene.normalGame)
    NG_GameController.getInstance().init()
    AppDebug.initDivPanel()                     // 最後在初始化 debug panel，避免Loading時fps過低
}
gameEntry()

window.App = App