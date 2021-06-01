import { Container, Graphics } from "pixi.js-legacy";
import { App } from "..";
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
        this.sceneContainerArr = Array(eGameScene.totalCount).fill(1).map(_ => {
            const cont: Container = new Container()
            cont.zIndex = eAppLayer.sceneContainer
            return cont
        })
    }

    public static switchGameScene(scene: eGameScene): Container{
        // 把使用外的容器從畫面上移開
        this.sceneContainerArr.forEach(cont =>{
            if(cont != this.sceneContainerArr[scene])   cont.parent?.removeChild(cont)
        })

        this.currentScene = scene
        switch(scene){
            case eGameScene.loading:
                break
            case eGameScene.normalGame:
                new NormalGame().init(this.sceneContainerArr[scene])
                NG_GameController.getInstance().init()
                break
        }

        return App.stage.addChild(this.sceneContainerArr[scene])
    }

    public static getSceneContainer(): Container{
        return this.sceneContainerArr[this.currentScene]
    }
}

class NormalGame{
    public init(parent: Container){
        let logo: PixiAsset.Sprite
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
    }
}