import { modSlotGame } from '.'
import {Application} from 'pixi.js-legacy'
import config from './config'

const {width, height} = config.size
const App: Application = new Application({      // 根據 package 內的設定，創建畫面
    backgroundColor: 0xAAAAAA, width, height
})

function initPixi(){
    const div: HTMLElement = document.createElement('div')
    document.body.append(div)
    div.appendChild(App.view)
}

EventHandler.init()
Debug.init(eDebugLevel.Log | eDebugLevel.Warn | eDebugLevel.Error)

initPixi()
// modSlotGame.LibExample.init(App.stage)
// modSlotGame.LibExample.exampleFn1(gp, Back.easeInOut)
// modSlotGame.LibExample.exampleLoadImg(App.stage)