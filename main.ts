import {Application} from 'pixi.js-legacy'
import pkg from './package.json'
import {modSlotGame} from '.'

const {size: {width, height}} = pkg.config
const App: Application = new Application({      // 根據 package 內的設定，創建畫面
    backgroundColor: 0xAAAAAA, width, height
})

function initPixi(){
    const div: HTMLElement = document.createElement('div')
    document.body.append(div)
    div.appendChild(App.view)
}

initPixi()
const gp = modSlotGame.LibExample.init(App.stage)
modSlotGame.LibExample.exampleFn1(gp, Back.easeInOut)
modSlotGame.LibExample.exampleLoadImg(App.stage)