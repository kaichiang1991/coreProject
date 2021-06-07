import { Container, Graphics } from "pixi.js-legacy";
import { App } from "..";
import FG_GameController from "../Game/GameController/FG_GameController";
import NG_GameController from "../Game/GameController/NG_GameController";
import { eAppLayer } from "./LayerDef";

export enum eGameScene{
    loading,
    normalGame,
    freeGame,
    systemError,

    totalCount
}

export default class GameSceneManager{
    private static sceneContainerArr: Array<Container>
    private static currentScene: eGameScene

    public static init(){
        this.sceneContainerArr = Array(eGameScene.totalCount).fill(1).map((_, index) => {
            const cont: Container = new Container()
            cont.zIndex = eAppLayer.sceneContainer
            cont.name = eGameScene[index]
            return cont
        })
    }

    public static async switchGameScene(scene: eGameScene): Promise<Container>{
        // 把使用外的容器從畫面上移開
        this.sceneContainerArr.forEach(cont =>{
            if(cont != this.sceneContainerArr[scene])   cont.parent?.removeChild(cont)
        })

        this.currentScene = scene
        switch(scene){
            case eGameScene.loading:
                App.stage.addChild(this.sceneContainerArr[scene])
                break
            case eGameScene.normalGame:
                App.stage.addChild(this.sceneContainerArr[scene])
                new NormalGame().init(this.sceneContainerArr[scene])
                NG_GameController.getInstance().init()
                break
            case eGameScene.freeGame:
                App.stage.addChild(this.sceneContainerArr[scene])
                new FreeGame().init(this.sceneContainerArr[scene])
                await FG_GameController.getInstance().init()
                break
        }

        return this.sceneContainerArr[scene]
    }

    public static getSceneContainer(): Container{
        return this.sceneContainerArr[this.currentScene]
    }
}

class NormalGame{
    
    public init(parent: Container){
        let logo: Sprite
        parent.addChild(
            // NG 場景
            new Graphics().beginFill(0xAA0000).drawRect(0, 0, 360, 1280)
            .beginFill(0x00AA00).drawRect(360, 0, 360, 1280)
            .endFill(),
            // logo
            logo = new PixiAsset.Sprite('logo')
        )

        logo.anchor.set(.5)
        logo.position.set(360, 275)

        const black = new Graphics().beginFill(0x333333, .7).drawRect(110, 375, 500, 300).endFill()
        EventHandler.on(eEventName.activeBlack, (ctx) => {
            const {flag} = ctx
            if(flag){
                parent.addChild(black)
            }else{
                black.parent?.removeChild(black)
            }
        })
    }
}

class FreeGame{
    public async init(parent: Container){
        const bg: Graphics = parent.addChild(new Graphics().beginFill(0xAAAA00).drawRect(0, 0, 720, 1280).endFill())
    }
}