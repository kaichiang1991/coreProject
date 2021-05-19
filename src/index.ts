import { Application, Container, Graphics, Text, TextStyle } from 'pixi.js-legacy'
import gsap from 'gsap'
window.gsap = gsap

import config from '../config'
import GameSceneManager, { eGameScene } from './System/GameSceneController'
import { eAppLayer } from './System/LayerDef'
import supportWebp from './Tool/supportWebp'
import GSAPManager from './System/GSAPManager'

// 顯示專案資訊
const {name, version, size} = config
console.log('Project', name, version)

const {width, height} = size
export const App: Application = new Application({
    width, height, backgroundColor: 0xAAAAAA
})

// init Pixi Application
const {view, stage} = App
const div: HTMLElement = document.querySelector('#div_pixi')
div.appendChild(view)
stage.sortableChildren = true

// 版號
const versionText: Text = new Text(`v${version}`, new TextStyle({
    fontSize: 18,
}))
versionText.zIndex = eAppLayer.version
versionText.anchor.set(-.2, -.1)
stage.addChild(versionText)

// 遊戲入口
const gameEntry: Function = async ()=>{
    const {AssetLoader} = PixiAsset
    config.canUseWebp = await supportWebp()
    EventHandler.init()     // 初始化事件管理
    Debug.init(eDebugLevel.Log | eDebugLevel.Warn | eDebugLevel.Error)            // 初始化 Debug
    GSAPManager.init()
    AssetLoader.init(App)
    GameSceneManager.init()
    // Loading
    //#region Loading
    const loadingCont: Container = GameSceneManager.switchGameScene(eGameScene.loading)
    const loading: Promise<void> = Loading.init(loadingCont)

    await loading
    //#endregion Loading

    // 遊戲場景轉換
}
gameEntry()