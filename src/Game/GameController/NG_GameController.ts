import GameSceneManager from "@root/src/System/GameSceneController"
import ReelController from "../Reel/ReelController"

export enum eNG_GameState{
    init    = 'NG_Init',
    start   = 'NG_Start',
    spin    = 'NG_Spin',
    endSpin = 'NG_EndSpin'
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

        context
        .regState(createState(GameInit, eNG_GameState.init, context))
        .regState(createState(GameStart, eNG_GameState.start, context))
        .regState(createState(StartSpin, eNG_GameState.spin, context))
        .regState(createState(EndSpin, eNG_GameState.endSpin, context))
        .changeState(eNG_GameState.init)
    }
}

class GameInit extends GameState{
    enter(){

        EventHandler.on(eEventName.stateChange, (ctx)=>{
            const {type} = ctx
            console.log('change state', type)
        })

        const parent = GameSceneManager.getSceneContainer()
        // 做測試的 UI  ( 正式要拔掉 )
        const startspin: PixiAsset.Sprite = parent.addChild(new PixiAsset.Sprite('startSpin'))
        startspin.position.set(279, 914)

        const stopSpin: PixiAsset.Sprite = parent.addChild(new PixiAsset.Sprite('stopSpin'))
        stopSpin.position.set(450, 914)
        stopSpin.name = 'stop'
        
        startspin.interactive = stopSpin.interactive = true

        const speedSpin: PixiAsset.Sprite = parent.addChild(new PixiAsset.Sprite('speedSpin'))
        speedSpin.position.set(163, 999)

        startspin.on('pointerdown', ()=>{
            EventHandler.dispatch(eEventName.startSpin)
        })

        // 初始化滾輪
        ReelController.reset()
        
        this.change()
    }

    change(){
        this.context.changeState(eNG_GameState.start)
    }
}

class GameStart extends GameState{

    enter(){
        EventHandler.once(eEventName.startSpin, this.change.bind(this))
        // Auto  
        // if Auto( > 0) : EventHandler.dispatch(eEventName.startSpin)
    }

    change(){
        // 檢查狀態

        // 檢查餘額

        this.context.changeState(eNG_GameState.spin)
    }
}

class StartSpin extends GameState{

    private stopEvent: Function

    async enter(){
        // 綁事件

        const allSpin: Promise<void> = ReelController.startSpin()

        ReelController.setResult([
            [3, 3, 3],
            [3, 3, 3],
            [3, 3, 3],
            [3, 3, 3],
            [3, 3, 3]
        ])

        this.stopEvent = EventHandler.once(eEventName.stopSpin, ()=> {console.log('stop');ReelController.StopNowEvent()})
        GameSceneManager.getSceneContainer().getChildByName('stop').on('pointerdown', ()=> console.log('dispatch stop', EventHandler.dispatch(eEventName.stopSpin)))

        setTimeout(() => {
            // ReelController.setListening(0)
            // ReelController.setListeningEffect(-1)
            window['arr'] && ReelController.setListening(...window['arr'])
            ReelController.stopSpin()
        }, 1000)


        await allSpin
        this.change()
    }

    change(){
        this.context.changeState(eNG_GameState.endSpin)
    }

    exit(){
        console.log('exit ', this, EventHandler.getListeners(eEventName.stopSpin))
        GameSceneManager.getSceneContainer().getChildByName('stop').removeAllListeners()
        // off eventHandler
        EventHandler.getListeners(eEventName.stopSpin).length && EventHandler.off(eEventName.stopSpin, this.stopEvent)
    }
}

class EndSpin extends GameState{
    enter(){
        this.change()
    }

    change(){
        this.context.changeState(eNG_GameState.start)
    }
}