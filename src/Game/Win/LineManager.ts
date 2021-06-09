import GameSceneManager from "@root/src/System/GameSceneController";
import { Container, Graphics } from "pixi.js-legacy";
import LineNumberManager from "../Number/LineNumberManager";
import config from '@root/config'
import { editConfig } from "@root/src";

const lineDef: {[key: number]: {y: number, win: number}} = {
    0: {y: 520, win: 100},
    1: {y: 637, win: 200},
    2: {y: 765, win: 300}
}

interface ILineConfig{
    eachLineLight: number       // 逐縣時每條線亮的時間
    eachLineDark: number        // 逐縣時每條線暗的時間
}

/** 管理線獎演出 */
export class LineManager{

    private static winlineArr: {[key: number]: {y: number, win: number}}       // 之後會是用 server 資料 
    private static eachLineTimeline: Timeline
    private static stopEachLineFn: Function
    public static get StopEachLineFn(): Function { return this.stopEachLineFn }

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

    public static async playAllLineWin(){
        this.winlineArr = Object.assign({}, lineDef)

        const lineArr: Array<Graphics> = Object.keys(this.winlineArr).map(key => this.playLine(+key))
            
        LineNumberManager.playLineNumber(9999)
        // 註冊旋轉事件

        // 播放 symbol 動畫  (await)

        await Sleep(1)

        lineArr.map(line => line.destroy())        // 清除線
        // 清除 symbol 動畫
        LineNumberManager.clearLineNumber()         // 清除得分
        await Sleep(0.5)
        
    }

    public static playEachLine(){
        const {eachLineLight, eachLineDark} = this.lineConfig
        let index: number = 0, line: Graphics
        this.eachLineTimeline = gsap.timeline().repeat(-1).repeatDelay(eachLineDark)
        .call(()=>{
            line = this.playLine(+Object.keys(this.winlineArr)[index])       // 撥放縣
            LineNumberManager.playLineNumber(this.winlineArr[index].win)
        })

        .add(() =>{
            line.destroy()
            line = null
            LineNumberManager.clearLineNumber()
            index = ++index % Object.keys(this.winlineArr).length
        }, `+=${eachLineLight}`)

        .eventCallback('onComplete', ()=>{
            line?.destroy()
            LineNumberManager.clearLineNumber()
            // 取消旋轉事件
        })

        this.stopEachLineFn = ()=>{
            safe_kill_tween(this.eachLineTimeline, false)
        }
    }

    private static playLine(lineNo: number){
        return GameSceneManager.getSceneContainer().addChild(new Graphics().lineStyle(5, 0xFF0000).moveTo(0, lineDef[lineNo].y).lineTo(720, lineDef[lineNo].y))
    }
}