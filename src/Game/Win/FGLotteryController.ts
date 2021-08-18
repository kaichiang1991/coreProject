import { App, eGameEventName } from "@root/src"
import GameSpineManager from "@root/src/System/Assets/GameSpineManager"
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
    public static winlineInfos: Array<ISSlotWinLineInfo>

    public static async init(){
        return new Promise<void>(res =>{

            EventHandler.once(eGameEventName.FG_lotteryEnd, ()=> res())

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
        const {WinLineInfos, Multiplier} = GameSlotData.FGSpinData.SpinInfo
        FGLotteryController.win = WinLineInfos.reduce((pre, curr) => pre + (curr.LineNo == 0? 0: curr.Win * Multiplier), 0)     // 不計算FG連線贏分，並乘上整盤的倍數
        FGLotteryController.winlineInfos = WinLineInfos.filter(winline => winline.LineNo != 0)                                  // 濾掉 FG 的線
        this.change()
    }

    change(){
        this.context.changeState(FGLotteryController.win? eFG_LotteryState.anim: eFG_LotteryState.end)
    }
}

class LotteryAnim extends GameState{

    async enter(){
        
        const {win, winlineInfos} = FGLotteryController
        await BigWinManager.playBigWin(App.stage, BetModel.getInstance().TotalBet, win)     // 先演大獎
        
        // 壓暗
        EventHandler.dispatch(eGameEventName.activeBlackCover, {flag: true})
        
        GameSpineManager.playFGCharacterWin()        // 播放主視覺得分演出
        const {Multiplier} = GameSlotData.FGSpinData.SpinInfo
        BetModel.getInstance().addWin(win)
        await LineManager.playAllLineWin(winlineInfos, Multiplier)
        // await LineManager.playEachLine()            
        this.change()
    }

    change(){
        LineManager.StopEachLineFn = null       // 清除逐縣fn，確保下次stopEachLineFn 時，不會呼叫錯
        this.context.changeState(eFG_LotteryState.end)
    }
}

class LotteryEnd extends GameState{

    enter(){
        this.change()
    }

    change(){
        EventHandler.dispatch(eGameEventName.FG_lotteryEnd)
    }
}