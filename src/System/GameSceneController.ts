import { Container, Graphics } from "pixi.js-legacy";
import { App, eGameEventName } from "..";
import { eAppLayer, eFGLayer, eNGLayer, eReelContainerLayer } from "./LayerDef";
import config from '@root/config'
import ReelController from "../Game/Reel/ReelController";

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

const {AssetLoader, Sprite, Spine} = PixiAsset

export default class GameSceneManager{
    private static sceneContainerArr: {[key: string]: Container} = {}
    private static currentScene: eGameScene
    public static context: SceneContext

    /** 初始化所有場景 */
    public static init(){

        Object.keys(eGameScene).map(key => {
            const cont: Container = new Container()
            cont.zIndex = eAppLayer.sceneContainer
            cont.name = key
            this.sceneContainerArr[key] = cont
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
        this.logo.anchor.set(.5)
        this.logo.zIndex = eReelContainerLayer.logo
        window.logoPos.copyTo(this.logo.position)

        this.bg = new Sprite('Scene_NG')
        this.UI_Bottom = new Sprite()
        this.bg.zIndex = this.UI_Bottom.zIndex = eNGLayer.background
    }

    enter(){
        this.cont = App.stage.addChild(GameSceneManager.getSceneContainer())
        this.cont.addChild(this.bg, this.UI_Bottom)
        this.cont.sortableChildren = true

        ReelController.ReelContainer.addChild(this.logo)
        ;(this.resizeFn = EventHandler.on(eEventName.orientationChange, ()=>{
            const {portrait} = config
            if(portrait){
                this.bg.position.set(-280, 0)
                this.UI_Bottom.texture = AssetLoader.getTexture('UI_Bottom_M.png')
                this.UI_Bottom.position.set(0, 895)
            }else{
                this.bg.position.set(0, -280)
                this.UI_Bottom.texture = AssetLoader.getTexture('UI_Bottom_W.png')
                this.UI_Bottom.position.set(0, 600)
            }
        }))()
    }

    exit(){
        // 子元件移除
        this.logo.destroy()
        this.bg.destroy()

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
    private remainTimesText: Sprite         // 剩餘場次的文字

    pre(){
        this.bg = new Sprite('Scene_FG')
        this.UI_Bottom = new Sprite()
        this.bg.zIndex = this.UI_Bottom.zIndex = eFGLayer.background

        // 底板
        this.remainTimesBottom = new Sprite('Feature_TopPlate.png')
        this.multipleTimesBottom = new Sprite('Feature_TopPlate.png')
        this.remainTimesBottom.zIndex = this.multipleTimesBottom.zIndex = eReelContainerLayer.featureBottom
        // 底板文字
        this.remainTimesText = this.remainTimesBottom.addChild(new Sprite('Feature_RemainWord.png'))
        this.remainTimesText.position.set(30, 15)
    }

    enter(){
        this.cont = App.stage.addChild(GameSceneManager.getSceneContainer())
        this.cont.addChild(this.bg, this.UI_Bottom)
        this.cont.sortableChildren = true

        ReelController.ReelContainer.addChild(this.remainTimesBottom, this.multipleTimesBottom)
        
        ;(this.resizeFn = EventHandler.on(eEventName.orientationChange, ()=>{
            const {portrait} = config
            if(portrait){
                this.bg.position.set(-280, 0)
                this.UI_Bottom.texture = AssetLoader.getTexture('UI_Bottom_M.png')
                this.UI_Bottom.position.set(0, 895)
                
                this.remainTimesBottom.position.set(-95, -145)
                this.multipleTimesBottom.position.set(-95, -80)
            }else{
                this.bg.position.set(0, -280)
                this.UI_Bottom.texture = AssetLoader.getTexture('UI_Bottom_W.png')
                this.UI_Bottom.position.set(0, 600)

                this.remainTimesBottom.position.set(-305, -80)
                this.multipleTimesBottom.position.set(115, -80)
            }
        }))()
    }

    exit(){
        this.bg.destroy()
        this.cont.parent?.removeChild(this.cont)        // 把使用外的容器從畫面上移開
        EventHandler.off(eEventName.orientationChange, this.resizeFn)
    }
}

/** 錯誤訊息 */
class SystemError extends GameScene{

    enter(context: any){
        SystemErrorManager.closeAll()
        App.stage.removeChildren()
        SystemErrorManager.showError(context)
    }
}