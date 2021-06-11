import GameSceneManager from "@root/src/System/GameSceneController"
import { Container, Graphics } from "pixi.js-legacy"
import GameSlotData from "../GameSlotData"
import { LineManager } from "./LineManager"

enum eNG_LotteryState{
    init = 'NG_LotteryInit',
    anim = 'NG_LotteryAnim',
    end = 'NG_LotteryEnd',
}

const {GameStateContext, createState, GameState} = StateModule

export default class LotteryController{

    public static win: number

    public static async init(){
        return new Promise<void>(res =>{

            EventHandler.once(eEventName.NG_lotteryEnd, res)

            // 註冊狀態機
            const context: GameStateContext = new GameStateContext()

            context
            .regState(createState(LotteryInit, eNG_LotteryState.init, context))
            .regState(createState(LotteryAnim, eNG_LotteryState.anim, context))
            .regState(createState(LotteryEnd, eNG_LotteryState.end, context))
            .changeState(eNG_LotteryState.init)
        })
    }
}

class LotteryInit extends GameState{

    enter(){
        // 整理數據
        LotteryController.win = GameSlotData.NGSpinData.winlineArr?.reduce((pre, curr) => pre + curr.Win, 0)
        this.change()
    }

    change(){
        this.context.changeState(LotteryController.win? eNG_LotteryState.anim: eNG_LotteryState.end)
    }
}

class LotteryAnim extends GameState{

    async enter(){
        // 壓暗
        EventHandler.dispatch(eEventName.activeBlack, {flag: true})

        await LineManager.playAllLineWin(GameSlotData.NGSpinData.winlineArr)
        LineManager.playEachLine()
        this.change()
    }

    change(){
        this.context.changeState(eNG_LotteryState.end)
    }
}

class LotteryEnd extends GameState{

    enter(){
        this.change()
    }

    change(){
        EventHandler.dispatch(eEventName.NG_lotteryEnd)
    }
}