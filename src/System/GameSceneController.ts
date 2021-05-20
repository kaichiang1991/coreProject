import { Container } from "pixi.js-legacy";
import { App } from "..";
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

        switch(scene){
            case eGameScene.loading:
            break
        }

        this.currentScene = scene
        return App.stage.addChild(this.sceneContainerArr[scene])
    }

    public static getSceneContainer(): Container{
        return this.sceneContainerArr[this.currentScene]
    }
}