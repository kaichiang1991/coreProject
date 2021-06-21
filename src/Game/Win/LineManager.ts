import { Graphics, Point } from "pixi.js-legacy";
import LineNumberManager from "../Number/LineNumberManager";
import config from '@root/config'
import { editConfig } from "@root/src";
import ReelController, { SymbolController } from "../Reel/ReelController";
import {plus} from 'number-precision'
import GameSpineManager from "@root/src/System/Assets/GameSpineManager";

const lineDef: {[key: number]: {y: number}} = {
    1: {y: 240},
    2: {y: 405},
    3: {y: 570}
}

/** 管理線獎演出 */
export class LineManager{

    private static winlineArr: Array<ISSlotWinLineInfo>
    private static eachLineTimeline: Timeline
    private static stopEachLineFn: Function
    // 若有演逐縣則停止逐縣 timeline，否則就單純清除線
    public static get StopEachLineFn(): Function { return this.stopEachLineFn || this.clearLineEvent }

    private static lineAnimArr: Array<Graphics>

    private static lineConfig: ILineConfig
    private static resizeFn: Function

    public static init(){
        this.lineConfig = editConfig.line

        this.resizeFn = ()=>{
            // Line 的動畫改變
            if(config.protrait){

            }else{

            }
        }
    }

    /**
     * 播放全線得獎動畫
     * @param winlineArr 
     */
    public static async playAllLineWin(winlineArr: Array<ISSlotWinLineInfo>){      // Winline的結構要重做
        this.winlineArr = winlineArr.slice()
        
        this.winlineArr.map(winline => this.playLine(winline.LineNo))
        const win: number = this.winlineArr.reduce((pre, curr) => plus(pre, curr.Win), 0)
        const allPromise: Array<Promise<void>> = this.getAllWinPos(this.winlineArr).map(pos => SymbolController.playWinAnimation(pos.x, pos.y))     // 撥放全部得獎動畫
        allPromise.push(
            Sleep(this.lineConfig.leastAllLineDuration),     // 最少演出時間
            LineNumberManager.playLineNumberAnim(win),       // 線獎跑分
            SlotUIManager.playWinChangeAnim(BetModel.getInstance(), 1)      // UI 跑分
        )        
        // 註冊旋轉事件

        await Promise.all(allPromise)
    }

    
    /**
     * 取得所有不重複的位置
     * @param winlineArr 贏分陣列
     * @returns {Array<Point>} 得獎位置的座標 Point(reelIndex, symbolIndex)
     */
    private static getAllWinPos(winlineArr: Array<ISSlotWinLineInfo>): Array<Point>{
        return winlineArr.map(winline => winline.WinPosition.map(arr => arr.join()))        // 先把位置轉換成字串
        .reduce((pre, curr) => [...pre, ...curr.filter(arr => !pre.includes(arr))], [])     // 找出不重複的字串
        .map(arr => {
            const [x, y] = arr.split(',')
            return new Point(+x, +y)
        })
    }


    /**
     * 播放逐線動畫
     * @returns 單線的話直接回傳 / 多線的話 timeline 開始跑了之後回傳
     */
    public static async playEachLine(){
        this.stopEachLineFn = null
        if(this.winlineArr.length == 1){        // 單線的話就不跑逐線
            return
        }

        return new Promise<void>(res =>{

            const {eachLineLight} = this.lineConfig
            
            let index: number = 0
            this.eachLineTimeline = gsap.timeline().repeat(-1)
            .call(()=>{
                this.clearLineEvent()
                const {LineNo, Win, WinPosition} = this.winlineArr[index]
                this.playLine(LineNo)                                                           // 播放線獎
                LineNumberManager.playLineNumber(Win)                                           // 播放分數
                WinPosition.map(pos => SymbolController.playWinAnimation(pos[0], pos[1]))       // 播放動畫
                index = ++index % this.winlineArr.length
            })
            .add(()=> {}, `+=${eachLineLight}`)
            
            .eventCallback('onStart', ()=> res())

            .eventCallback('onComplete', ()=>{
                this.clearLineEvent()
                // 取消旋轉事件
            })
            
            this.stopEachLineFn = ()=>{
                safe_kill_tween(this.eachLineTimeline, false)
                this.eachLineTimeline = null
            }
        })
    }

    /** 清除所有得獎動畫 */
    private static clearLineEvent(){
        GameSpineManager.clearLine()
        SymbolController.clearAllWinAnimation()         // 清除動畫
        LineNumberManager.clearLineNumber()             // 清除分數
    }

    private static playLine(lineNo: number){
        GameSpineManager.playLine(ReelController.ReelContainer, lineNo)
    }
}