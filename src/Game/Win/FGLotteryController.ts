import GameSlotData from "../GameSlotData"
import { LineManager } from "./LineManager"

enum eFG_LotteryState{
    init = 'FG_LotteryInit',
    anim = 'FG_LotteryAnim',
    end = 'FG_LotteryEnd',
}

const {GameStateContext, createState, GameState} = StateModule

export default class FGLotteryController{

    public static win: number

    public static async init(){
        return new Promise<void>(res =>{

            EventHandler.once(eEventName.FG_lotteryEnd, res)

            // 註冊狀態機
            const context: GameStateContext = new GameStateContext()

            context
            .regState(createState(LotteryInit, eFG_LotteryState.init, context))
            .regState(createState(LotteryAnim, eFG_LotteryState.anim, context))
            .regState(createState(LotteryEnd, eFG_LotteryState.end, context))
            .changeState(eFG_LotteryState.init)
        })
    }
}

class LotteryInit extends GameState{

    enter(){
        // 整理數據
        FGLotteryController.win = GameSlotData.FGSpinData.winlineArr?.reduce((pre, curr) => pre + curr.Win, 0)
        this.change()
    }

    change(){
        this.context.changeState(FGLotteryController.win? eFG_LotteryState.anim: eFG_LotteryState.end)
    }
}

class LotteryAnim extends GameState{

    async enter(){
        // 壓暗
        EventHandler.dispatch(eEventName.activeBlack, {flag: true})

        await LineManager.playAllLineWin(GameSlotData.FGSpinData.winlineArr)
        await LineManager.playEachLine()
        this.change()
    }

    change(){
        this.context.changeState(eFG_LotteryState.end)
    }
}

class LotteryEnd extends GameState{

    enter(){
        this.change()
    }

    change(){
        EventHandler.dispatch(eEventName.FG_lotteryEnd)
    }
}