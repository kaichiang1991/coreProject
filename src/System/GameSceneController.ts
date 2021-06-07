import { Container, Graphics } from "pixi.js-legacy";
import { App } from "..";
import { eAppLayer } from "./LayerDef";

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

    pre()
    enter()
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

    public setScene(type: string): SceneContext{
        this.sceneArr[type]?.pre()
        return this
    }

    public changeScene(type: string): SceneContext{
        this.currentScene?.exit()

        this.currentScene = this.sceneArr[type]
        this.currentScene.enter()
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

    pre(){}
    enter(){}
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
    }

    /**
     * 切換遊戲場景
     * @param scene 場景名稱 
     * @returns 該場景的 container
     */
    public static switchGameScene(scene: eGameScene): Container{
        
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
    private black: Graphics
    private blackEvent: Function

    pre(){
        this.logo = new Sprite('logo')
        this.logo.anchor.set(.5)
        this.logo.position.set(360, 275)

        this.bg = new Graphics().beginFill(0xAA0000).drawRect(0, 0, 360, 800)
        .beginFill(0x00AA00).drawRect(360, 0, 360, 800)
        .endFill()

        this.black = new Graphics().beginFill(0, .9).drawRect(110, 375, 500, 300).endFill()
        this.blackEvent = (ctx) =>{
            const {flag} = ctx
            if(flag){
                this.cont.addChild(this.black)
            }else{
                this.black.parent?.removeChild(this.black)
            }
        }
    }

    enter(){
        this.cont = App.stage.addChild(GameSceneManager.getSceneContainer())
        this.cont.addChild(this.bg, this.logo)

        EventHandler.on(eEventName.activeBlack, this.blackEvent)
    }

    exit(){
        this.cont.parent?.removeChild(this.cont)        // 把使用外的容器從畫面上移開
        EventHandler.off(eEventName.activeBlack, this.blackEvent)
    }
}

/** FreeGame 場景 */
class FreeGame extends GameScene{

    private bg: Graphics

    pre(){
        this.bg = new Graphics().beginFill(0xAAAA00).drawRect(0, 0, 720, 800).endFill()   
    }

    enter(){
        this.cont = App.stage.addChild(GameSceneManager.getSceneContainer())
        this.cont.addChild(this.bg)
    }

    exit(){
        this.cont.parent?.removeChild(this.cont)        // 把使用外的容器從畫面上移開
    }
}