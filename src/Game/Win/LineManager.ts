import GameSceneManager from "@root/src/System/GameSceneController";
import { Container, Graphics, Point } from "pixi.js-legacy";
import LineNumberManager from "../Number/LineNumberManager";
import config from '@root/config'
import { editConfig } from "@root/src";
import ReelController, { SymbolController } from "../Reel/ReelController";
import {plus} from 'number-precision'
import { eReelContainerLayer } from "@root/src/System/LayerDef";

const lineDef: {[key: number]: {y: number}} = {
    1: {y: 240},
    2: {y: 405},
    3: {y: 570}
}

interface ISSlotWinLineInfo{        // 之後統一跟server格式
    WinPosition: Array<Array<number>>
    lineNo: number
    Win: number
}

interface ILineConfig{
    leastAllLineDuration: number    // 全縣演出最短時間
    eachLineLight: number           // 逐縣時每條線亮的時間
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
        this.lineConfig = editConfig['line']

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
        
        this.lineAnimArr = this.winlineArr.map(winline => this.playLine(winline.lineNo))
        const win: number = this.winlineArr.reduce((pre, curr) => plus(pre, curr.Win), 0)
        const allPromise: Array<Promise<void>> = this.getAllWinPos(this.winlineArr).map(pos => SymbolController.playWinAnimation(pos.x, pos.y))     // 撥放全部得獎動畫
        allPromise.push(
            Sleep(this.lineConfig.leastAllLineDuration),     // 最少演出時間
            LineNumberManager.playLineNumberAnim(win)        // 跑分
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

    /** 播放逐縣動畫 */
    public static playEachLine(){
        if(this.winlineArr.length == 1){        // 單線的話就不跑逐線
            return
        }

        const {eachLineLight} = this.lineConfig

        let index: number = 0
        this.eachLineTimeline = gsap.timeline().repeat(-1)
        .call(()=>{
            this.clearLineEvent()
            const {lineNo, Win, WinPosition} = this.winlineArr[index]
            this.lineAnimArr = [this.playLine(lineNo)]                                                    // 播放線獎
            LineNumberManager.playLineNumber(Win)                                           // 播放分數
            WinPosition.map(pos => SymbolController.playWinAnimation(pos[0], pos[1]))       // 播放動畫
            index = ++index % this.winlineArr.length
        })
        .add(()=> {}, `+=${eachLineLight}`)

        .eventCallback('onComplete', ()=>{
            this.clearLineEvent()
            // 取消旋轉事件
        })

        this.stopEachLineFn = ()=>{
            safe_kill_tween(this.eachLineTimeline, false)
        }
    }

    /** 清除所有得獎動畫 */
    private static clearLineEvent(){
        if(this.lineAnimArr?.length){        // 清除所有線，之後應該會改spine的做法
            this.lineAnimArr.map(line => line.destroy())
            this.lineAnimArr.length = 0
        }
        SymbolController.clearAllWinAnimation()         // 清除動畫
        LineNumberManager.clearLineNumber()             // 清除分數
    }

    private static playLine(lineNo: number){
        const line: Graphics = ReelController.ReelContainer.addChild(new Graphics().lineStyle(5, 0xFF0000).moveTo(-100, lineDef[lineNo].y).lineTo(800, lineDef[lineNo].y))
        line.zIndex = eReelContainerLayer.line
        return line
    }
}