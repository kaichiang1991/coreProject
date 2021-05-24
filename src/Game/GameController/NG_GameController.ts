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
        console.log('init game')
        // 初始化滾輪
        
    }
}