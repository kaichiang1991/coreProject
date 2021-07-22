import { App } from "@root/src"
import GameSlotData from "../GameSlotData"
import { LineManager } from "./LineManager"

enum eNG_LotteryState{
    init = 'NG_LotteryInit',
    anim = 'NG_LotteryAnim',
    end = 'NG_LotteryEnd',
}

const {GameStateContext, createState, GameState} = StateModule

export default class LotteryController{

    public static isBackFromFG: boolean
    public static win: number
    public static winlineInfos: Array<ISSlotWinLineInfo>

    /**
     * 初始化 NG 得獎流程
     * @param {boolean} backFromFG 是否從FG回來
     * @returns 演完回傳
     */
    public static async init(backFromFG: boolean){
        return new Promise<void>(res =>{

            EventHandler.once(eEventName.NG_lotteryEnd, ()=> res())

            this.isBackFromFG = backFromFG      // 設定是否從 FG 回來

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
        LotteryController.win = WinLineInfos.reduce((pre, curr) => pre + curr.Win, 0)
        LotteryController.winlineInfos = WinLineInfos.filter(winline => winline.LineNo != 0)       // ToDo 過濾沒得分的 FG，帶確認格式
        this.change()
    }

    change(){
        this.context.changeState(LotteryController.win? eNG_LotteryState.anim: eNG_LotteryState.end)
    }
}

class LotteryAnim extends GameState{

    async enter(){
        const {isBackFromFG, win, winlineInfos} = LotteryController
        if(!isBackFromFG)                                                                         // 判斷從FG回來的那局，就算分數到了也不演 BigWin
            await BigWinManager.playBigWin(App.stage, BetModel.getInstance().TotalBet, win)       // 演出 bigWin
        
        // 壓暗
        EventHandler.dispatch(eEventName.activeBlack, {flag: true})
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
        EventHandler.dispatch(eEventName.NG_lotteryEnd)
    }
}