import { Application, Text, TextStyle } from 'pixi.js-legacy'
import config from '../config'
import A from './a'
import supportWebp from './Tool/supportWebp'

// 顯示專案資訊
const {name, version, size} = config
console.log('Project', name, version)

const {width, height} = size
export const App: Application = new Application({
    width, height, backgroundColor: 0xAAAAAA
})

// init Pixi Application
const {view,stage} = App
const div: HTMLElement = document.querySelector('#div_pixi')
div.appendChild(view)

// 版號
const versionText: Text = new Text(`v${version}`, new TextStyle({
    fontSize: 18,
}))
versionText.anchor.set(-.2, -.1)
stage.addChild(versionText)

// 遊戲入口
const gameEntry: Function = async ()=>{
    config.canUseWebp = await supportWebp()

    console.log('config', config)
    new A().init()
    EventHandler.init()     // 初始化事件管理
    Debug.init(eDebugLevel.Log | eDebugLevel.Warn | eDebugLevel.Error)            // 初始化 Debug
}
gameEntry()