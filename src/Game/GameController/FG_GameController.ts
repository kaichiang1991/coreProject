import ReelController from "../Reel/ReelController"

export enum eFG_GameState{
    init    = 'FG_Init',
    start   = 'FG_Start',
    spin    = 'FG_Spin',
    endSpin = 'FG_EndSpin'
}

const {GameStateContext, createState, GameState} = StateModule

export default class FG_GameController{
    private static instance: FG_GameController
    public static getInstance(): FG_GameController{
        return this.instance || new FG_GameController()
    }

    public async init(){
        return new Promise<void>(res => {

            EventHandler.once(eEventName.FG_End, res)
            // 註冊狀態機
            const context: GameStateContext = new GameStateContext()
            
            context
            .regState(createState(GameInit, eFG_GameState.init, context))
            .changeState(eFG_GameState.init)
        })
    }
}

class GameInit extends GameState{

    async enter(){
        // 轉場

        ReelController.reset()
    }
}
