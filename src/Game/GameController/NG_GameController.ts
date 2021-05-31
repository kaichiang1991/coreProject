import GameSceneManager from "@root/src/System/GameSceneController"
import ReelController from "../Reel/ReelController"

export enum eNG_GameState{
    init = 'NG_Init',

}

const {GameStateContext, createState, GameState} = StateModule

export default class NG_GameController{
    private static instance: NG_GameController
    public static getInstance(): NG_GameController{
        return this.instance || new NG_GameController()
    }

    public init(){
        // 註冊狀態機
        const context: StateModule.GameStateContext = new GameStateContext()
        context.regState(createState(GameInit, eNG_GameState.init, context))

        context.changeState(eNG_GameState.init)
    }
}

class GameInit extends GameState{
    enter(){
        const parent = GameSceneManager.getSceneContainer()
        // 做測試的 UI  ( 正式要拔掉 )
        const startspin: PixiAsset.Sprite = parent.addChild(new PixiAsset.Sprite('SpinStart_00.png'))
        startspin.position.set(100, 750)

        const stopSpin: PixiAsset.Sprite = parent.addChild(new PixiAsset.Sprite('SpinStop_00.png'))
        stopSpin.position.set(400, 750)
        
        startspin.interactive = stopSpin.interactive = true

        // 綁事件
        startspin.on('pointerdown', ()=>{
            ReelController.startSpin()
            setTimeout(() => {
                ReelController.setResult([
                    [5, 1, 2],
                    [1, 2, 3],
                    [5, 1, 2],
                    [1, 2, 3],
                    [5, 1, 2],
                ])
                ReelController.stopSpin()
            }, 1000)
        })

        stopSpin.on('pointerdown', ()=>{
            ReelController.StopNowEvent()
        })
        // 初始化滾輪
        ReelController.init()
    }
}