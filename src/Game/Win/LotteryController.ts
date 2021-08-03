import { App, eGameEventName } from "@root/src"
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
    public static winlineInfos: Array<ISSlotWinLineInfo>

    /**
     * 初始化 NG 得獎流程
     * @param {boolean} backFromFG 是否從FG回來
     * @returns 演完回傳
     */
    public static async init(){
        return new Promise<void>(res =>{

            EventHandler.once(eGameEventName.NG_lotteryEnd, ()=> res())

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
        const {WinLineInfos} = GameSlotData.NGSpinData.SpinInfo
        LotteryController.win = WinLineInfos.reduce((pre, curr) => pre + curr.Win, 0)               // 不計算FG連線贏分，並乘上整盤的倍數 (進Lottery就先濾掉FG了)
        LotteryController.winlineInfos = WinLineInfos.filter(winline => winline.LineNo != 0)        // 濾掉 FG 的線
        this.change()
    }

    change(){
        this.context.changeState(LotteryController.win? eNG_LotteryState.anim: eNG_LotteryState.end)
    }
}

class LotteryAnim extends GameState{

    async enter(){
        const {win, winlineInfos} = LotteryController
        await BigWinManager.playBigWin(App.stage, BetModel.getInstance().TotalBet, win)       // 演出 bigWin
        
        // 壓暗
        EventHandler.dispatch(eGameEventName.activeBlackCover, {flag: true})
        BetModel.getInstance().addWin(win)

        await LineManager.playAllLineWin(winlineInfos)
        await LineManager.playEachLine()
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
        EventHandler.dispatch(eGameEventName.NG_lotteryEnd)
    }
}