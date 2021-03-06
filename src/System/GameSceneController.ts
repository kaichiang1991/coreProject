import { Point, Texture } from "pixi.js-legacy";
import { App, eGameEventName } from "..";
import { eAppLayer, eFGLayer, eNGLayer, eReelContainerLayer } from "./LayerDef";
import config from '@root/config'
import ReelController from "../Game/Reel/ReelController";
import GameSpineManager from "./Assets/GameSpineManager";
import { eDirection } from "@root/globalDef";

export enum eGameScene{
    loading     = 'loading',
    normalGame  = 'normalGame',
    freeGame    = 'freeGame',
    systemError = 'systemError',
}

//#region 場景的狀態機
interface IScene{
    type: string
    context: SceneContext
    cont: Container
    resizeFn: IEventCallback
    [propName: string]: any

    pre(context?: any)
    enter(context?: any)
    exit()
}

interface ISceneConstructor{
    new (type: string, context: SceneContext)
}

function createScene(ctor: ISceneConstructor, type: string, context: SceneContext){
    return new ctor(type, context)    
}

class SceneContext{

    private sceneArr: Array<IScene>
    private currentScene: IScene

    constructor(){
        this.sceneArr = new Array<IScene>()
        this.currentScene = null
    }

    public regScene(scene: IScene): SceneContext{
        this.sceneArr[scene.type] = scene
        return this
    }

    public setScene(type: string, context?: any): SceneContext{
        this.sceneArr[type]?.pre(context)
        return this
    }

    public changeScene(type: string, context?: any): SceneContext{
        this.currentScene?.exit()

        this.currentScene = this.sceneArr[type]
        this.currentScene.enter(context)
        return this
    }

    public getCurrent(): IScene{
        return this.currentScene
    }
}

class GameScene implements IScene{

    type: string
    context: SceneContext
    cont: Container 
    resizeFn: IEventCallback
    
    constructor(type: string, context: SceneContext){
        this.type = type
        this.context = context
    }

    pre(context?: any){}
    enter(context?: any){}
    exit(){}
}
//#endregion

const {AssetLoader, Container, Sprite, Spine} = PixiAsset

export default class GameSceneManager{
    private static sceneContainerArr: {[key: string]: Container} = {}
    private static currentScene: eGameScene
    public static context: SceneContext

    /** 初始化所有場景 */
    public static init(){

        Object.keys(eGameScene).map(key => {
            this.sceneContainerArr[key] = new Container(key, eAppLayer.sceneContainer)
        })

        this.context = new SceneContext()
        this.context
        .regScene(createScene(LoadingScene, eGameScene.loading, this.context))
        .regScene(createScene(NormalGame, eGameScene.normalGame, this.context))
        .regScene(createScene(FreeGame, eGameScene.freeGame, this.context))
        .regScene(createScene(SystemError, eGameScene.systemError, this.context))
    }

    /**
     * 切換遊戲場景
     * @param scene 場景名稱 
     * @returns 該場景的 container
     */
    public static switchGameScene(scene: eGameScene, context?: any): Container{
        this.currentScene = scene
        switch(scene){
            case eGameScene.loading:
                this.context.changeScene(scene)
                break
            case eGameScene.normalGame:
                this.context.setScene(scene)
                this.context.changeScene(scene)
                break
            case eGameScene.freeGame:
                this.context.setScene(scene)
                // 等轉場完再換
                EventHandler.once(eGameEventName.transitionDone, ()=> this.context.changeScene(scene))
                break
            case eGameScene.systemError:
                if(SystemErrorManager.IsError)
                    return
                this.context.changeScene(scene, context)
                break
        }

        return this.sceneContainerArr[scene]
    }

    public static getSceneContainer(): Container{
        return this.sceneContainerArr[this.currentScene]
    }
}

/** loading 場景 */
class LoadingScene extends GameScene{

    enter(){
        this.cont = App.stage.addChild(GameSceneManager.getSceneContainer())
    }

    exit(){
        this.cont.parent?.removeChild(this.cont)        // 把使用外的容器從畫面上移開
    }
}

/** Normal Game 場景 */
class NormalGame extends GameScene{
    
    private logo: Sprite
    private bg: Sprite
    private UI_Bottom: Sprite

    pre(){
        this.logo = new Sprite('Logo.png')
        this.logo.zIndex = eReelContainerLayer.logo
        const {[eDirection.common]: {anchor, pos, scale}} = window.logoDef

        anchor?.copyTo(this.logo.anchor)
        pos?.copyTo(this.logo.position)
        scale?.copyTo(this.logo.scale)

        this.bg = new Sprite('Scene_NG')
        this.bg.zIndex = eNGLayer.background
        this.bg.anchor.set(.5)
        this.UI_Bottom = new Sprite()
        this.UI_Bottom.zIndex = eNGLayer.UI_Bottom
    }

    enter(){
        this.cont = App.stage.addChild(GameSceneManager.getSceneContainer())
        this.cont.sortableChildren = true

        this.cont.addChild(this.bg, this.UI_Bottom)
        GameSpineManager.playNGScene(this.cont)
        GameSpineManager.playNGCharacter(this.cont)

        ReelController.ReelContainer.addChild(this.logo)

        const {[eDirection.landscape]: logo_W, [eDirection.portrait]: logo_M} = window.logoDef       // 讀取 logo 設定

        ;(this.resizeFn = EventHandler.on(eEventName.orientationChange, ()=>{
            const {portrait} = config, logoUse: IDefConfig = portrait? logo_M: logo_W
            if(portrait){
                this.bg.position.set(360, 640)
                this.UI_Bottom.texture = AssetLoader.getTexture('UI_Bottom_M.png')
                this.UI_Bottom.position.set(0, 895)
                GameSpineManager.setCharacter(eNGLayer.character, new Point(360, 245), new Point().set(1))                // 主視覺角色
            }else{
                this.bg.position.set(640, 360)
                this.UI_Bottom.texture = AssetLoader.getTexture('UI_Bottom_W.png')
                this.UI_Bottom.position.set(0, 600)
                GameSpineManager.setCharacter(eNGLayer.character, new Point(140, 500), new Point().set(.6))                // 主視覺角色
            }
            GameSpineManager.setScene(portrait, true)                                       // 場景特效
            // 調整 logo 設定
            if(logoUse){
                logoUse.pos?.copyTo(this.logo.position)
                logoUse.scale?.copyTo(this.logo.scale)
            }
        }))()
    }

    exit(){
        // 子元件移除
        this.logo.destroy()
        this.bg.destroy()
        this.UI_Bottom.destroy()
        GameSpineManager.clearScene()
        GameSpineManager.clearCharacter()

        this.cont.parent?.removeChild(this.cont)        // 把使用外的容器從畫面上移開
        EventHandler.off(eEventName.orientationChange, this.resizeFn)
    }
}

/** FreeGame 場景 */
class FreeGame extends GameScene{

    private bg: Sprite
    private UI_Bottom: Sprite

    private remainTimesBottom: Sprite       // 剩餘場次的底板
    public get RemainTimesBottom(): Sprite {return this.remainTimesBottom}
    private multipleTimesBottom: Sprite     // 倍數的底板
    public get MultipleTimesBottom(): Sprite {return this.multipleTimesBottom}
    private remainTimesText: Sprite         // 剩餘場次的文字

    pre(){
        this.bg = new Sprite('Scene_FG')
        this.bg.zIndex = eFGLayer.background
        this.UI_Bottom = new Sprite()
        this.UI_Bottom.zIndex = eFGLayer.UI_Bottom

        // // 底板
        // this.remainTimesBottom = new Sprite('Feature_TopPlate.png')
        // this.multipleTimesBottom = new Sprite('Feature_TopPlate.png')
        // // 底板文字
        // this.remainTimesText = this.remainTimesBottom.addChild(new Sprite('Feature_RemainWord.png'))
        // this.remainTimesText.position.set(30, 15)
    }

    enter(){
        this.cont = App.stage.addChild(GameSceneManager.getSceneContainer())
        this.cont.addChild(this.bg, this.UI_Bottom)
        this.cont.interactive = this.cont.sortableChildren = true

        // ReelController.ReelContainer.addChild(this.remainTimesBottom, this.multipleTimesBottom)
        
        GameSpineManager.playFGScene(this.cont)
        GameSpineManager.playFGCharacter(this.cont)

        ;(this.resizeFn = EventHandler.on(eEventName.orientationChange, ()=>{
            const {portrait} = config
            if(portrait){
                this.bg.position.set(-280, 0)
                this.UI_Bottom.texture = AssetLoader.getTexture('UI_Bottom_M.png')
                this.UI_Bottom.position.set(0, 895)
                
                // ToDo FG 特色底板的自適應調整

                GameSpineManager.setCharacter(eFGLayer.character, new Point(360, 245), new Point().set(1))                // 主視覺角色

            }else{
                this.bg.position.set(0, -280)
                this.UI_Bottom.texture = AssetLoader.getTexture('UI_Bottom_W.png')
                this.UI_Bottom.position.set(0, 600)

                // ToDo FG 特色底板的自適應調整

                GameSpineManager.setCharacter(eFGLayer.character, new Point(140, 500), new Point().set(.6))                // 主視覺角色
            }
            GameSpineManager.setScene(portrait, false)                                       // 場景特效
        }))()
    }

    exit(){
        this.bg.destroy()
        this.UI_Bottom.destroy()
        this.remainTimesText?.destroy()
        this.remainTimesBottom?.destroy()
        this.multipleTimesBottom?.destroy()
        GameSpineManager.clearScene()

        this.cont.parent?.removeChild(this.cont)        // 把使用外的容器從畫面上移開
        EventHandler.off(eEventName.orientationChange, this.resizeFn)
    }
}

/** 錯誤訊息 */
class SystemError extends GameScene{

    enter(context: any){
        EventHandler.dispatch(eEventName.closeWindow)       // 避免清除事件，在錯誤訊息之前就先關掉 iframe (細單/說明頁)
        SystemErrorManager.closeAll()
        App.stage.removeChildren()
        SystemErrorManager.showError(context)
    }
}