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
const versionText: Text = new Text(`v${version}`, new TextStyle({
    fontSize: 18,
}))
versionText.zIndex = eAppLayer.version
versionText.anchor.set(-.2, -.1)
stage.addChild(versionText)

export let editConfig: IEditConfig, gameConfig: IGameConfig

// 遊戲入口
const gameEntry: Function = async ()=>{
    config.canUseWebp = await supportWebp()
    editConfig = await PixiAsset.JSON.getJson(editJson.toString())
    gameConfig = await PixiAsset.JSON.getJson(gameConfigUrl.toString())

    Entry.init(App, config)
    AppDebug.init()
    ParameterParse.init('wss://gsvr1.msgaming.one')     // 先連demo站的
    // ParameterParse.init('ws://192.168.1.116:12201')     // 先連demo站的
    GSAPManager.init()
    LocalizationManager.init()
    GameAssetManager.init()
    GameSceneManager.init()
    StateModule.init()
    await SystemErrorManager.init(stage, config)
    
    //#region Loading
    const loadingCont: Container = GameSceneManager.switchGameScene(eGameScene.loading)
    await Loading.init(loadingCont, config.portrait)
    const loading: Promise<void> = Loading.startLoading()
    await NetworkManager.init()
    // 取得設定檔的設定
    const {DemoOn, GameID} = gameConfig
    GameSlotData.JoinGameData = await GameDataRequest.joinGame(ParameterParse.UrlParser.token, GameID, DemoOn)
    const {CurrencyID, GameName} = GameSlotData.JoinGameData
    document.title = GameName           // 設定 html title
    await GameAssetManager.loadAsset()
    // 通知 loading 結束
    Loading.finishLoading()
    await loading
    //#endregion Loading

    // 遊戲場景轉換
    await UIManager.init(App.stage, config)
    GameSceneManager.switchGameScene(eGameScene.normalGame)
    NG_GameController.getInstance().init()
}
gameEntry()

window.App = App