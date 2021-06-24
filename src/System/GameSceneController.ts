import { Container, Graphics } from "pixi.js-legacy";
import { App } from "..";
import { eAppLayer, eNGLayer, eReelContainerLayer } from "./LayerDef";
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
}

class GameScene implements IScene{

    type: string
    context: SceneContext
    cont: Container 

    constructor(type: string, context: SceneContext){
        this.type = type
        this.context = context
    }

    pre(context?: any){}
    enter(context?: any){}
    exit(){}
}
//#endregion

const {Sprite, Spine} = PixiAsset

export default class GameSceneManager{
    private static sceneContainerArr: {[key: string]: Container} = {}
    private static currentScene: eGameScene
    private static context: SceneContext

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
                EventHandler.once('transitionDone', ()=> this.context.changeScene(scene))
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
    private bg: Graphics

    pre(){
        this.logo = new Sprite('logo')
        this.logo.anchor.set(.5)
        this.logo.zIndex = eReelContainerLayer.logo
        window.logoPos.copyTo(this.logo.position)

        this.bg = new Graphics()
    }

    enter(){
        this.cont = App.stage.addChild(GameSceneManager.getSceneContainer())
        this.cont.addChild(this.bg)
        this.cont.sortableChildren = true

        ReelController.ReelContainer.addChild(this.logo)
        EventHandler.on(eEventName.orientationChange, this.resize)
        this.resize()
    }

    exit(){
        // 子元件移除
        this.logo.destroy()
        this.bg.destroy()

        this.cont.parent?.removeChild(this.cont)        // 把使用外的容器從畫面上移開
        EventHandler.off(eEventName.orientationChange, this.resize)
    }

    resize = ()=>{
        const {portrait, size: {width, height}} = config
        if(portrait){
            this.bg.clear().beginFill(0xC7FF91).drawRect(0, 0, width, height).endFill()
        }else{
            this.bg.clear().beginFill(0xC7FF91).drawRect(0, 0, height, width).endFill()
        }
    }
}

/** FreeGame 場景 */
class FreeGame extends GameScene{

    private bg: Graphics

    pre(){
        this.bg = new Graphics()
    }

    enter(){
        this.cont = App.stage.addChild(GameSceneManager.getSceneContainer())
        this.cont.addChild(this.bg)
        
        EventHandler.on(eEventName.orientationChange, this.resize)
        this.resize()
    }

    exit(){
        this.bg.destroy()
        this.cont.parent?.removeChild(this.cont)        // 把使用外的容器從畫面上移開
        EventHandler.off(eEventName.orientationChange, this.resize)
    }

    resize = ()=>{
        const {portrait, size: {width, height}} = config
        if(portrait){
            this.bg.clear().beginFill(0x91C7FF).drawRect(0, 0, width, height)
        }else{
            this.bg.clear().beginFill(0x91C7FF).drawRect(0, 0, height, width)
        }
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