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
        const startspin: PixiAsset.Sprite = parent.addChild(new PixiAsset.Sprite('startSpin'))
        startspin.position.set(279, 914)

        const stopSpin: PixiAsset.Sprite = parent.addChild(new PixiAsset.Sprite('stopSpin'))
        stopSpin.position.set(450, 914)
        
        startspin.interactive = stopSpin.interactive = true

        const speedSpin: PixiAsset.Sprite = parent.addChild(new PixiAsset.Sprite('speedSpin'))
        speedSpin.position.set(163, 999)
        console.log(speedSpin)

        // 綁事件
        EventHandler.on(eEventName.startSpin, ()=>{
            ReelController.startSpin()
            ReelController.setResult([
                [3, 3, 3],
                [3, 3, 3],
                [3, 3, 3],
                [3, 3, 3],
                [3, 3, 3],
                // [5, 1, 2],
                // [5, 1, 2],
                // [1, 2, 3],
                // [5, 1, 2],
            ])

            // ReelController.setListening(0)
            // ReelController.setListeningEffect(-1)
            window['arr'] && ReelController.setListening(...window['arr'])
            ReelController.stopSpin()
        })

        EventHandler.on(eEventName.stopSpin, ()=>{
            ReelController.StopNowEvent()
        })

        startspin.on('pointerdown', ()=>{
            EventHandler.dispatch(eEventName.startSpin)
        })

        stopSpin.on('pointerdown', ()=>{
            EventHandler.dispatch(eEventName.stopSpin)
        })

        // 初始化滾輪
        ReelController.reset()
    }
}