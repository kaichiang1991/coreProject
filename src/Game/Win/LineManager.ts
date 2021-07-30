import { Graphics, Point } from "pixi.js-legacy";
import LineNumberManager from "../Number/LineNumberManager";
import { editConfig, gameConfig } from "@root/src";
import ReelController, { SymbolController } from "../Reel/ReelController";
import {minus, plus} from 'number-precision'
import { eReelContainerLayer } from "@root/src/System/LayerDef";
import { mapRowIndex, reelCount, xOffsetArr, yOffsetArr } from "../Reel/SymbolDef";

const {Container, Sprite} = PixiAsset

/** 管理線獎演出 */
export class LineManager{

    private static winlineArr: Array<ISSlotWinLineInfo>
    private static multiple: number

    private static eachLineTimeline: GSAPTimeline
    private static stopEachLineFn: Function
    // 若有演逐線則停止逐線 timeline，否則就單純清除線
    public static get StopEachLineFn(): Function { return this.stopEachLineFn || this.clearLineEvent }
    public static set StopEachLineFn(value: Function)   {this.stopEachLineFn = value}
    private static lineConfig: ILineConfig

    private static lineContainer: Container
    private static lineNumberContainer: Container
    private static lineNumberContainerResizeFn: Function
    public static get LineNumResizeFn(): Function { return this.lineNumberContainerResizeFn}

    public static init(){
        this.lineConfig = editConfig.line

        // 初始化放line的容器
        this.lineContainer = ReelController.ReelContainer.addChild(new Container('line container', eReelContainerLayer.line))
    
        const yArr: Array<number> = yOffsetArr[mapRowIndex(0)]
        this.lineContainer.position.set(xOffsetArr[~~(reelCount / 2)], yArr[~~(yArr.length / 2)])
        // 初始化放 line 得分的容器
        this.lineNumberContainer = ReelController.ReelContainer.addChild(new Container('line num container', eReelContainerLayer.lineNumber))
        this.lineNumberContainer.position.copyFrom(this.lineContainer.position)

        let scale: number
        this.lineNumberContainerResizeFn = ()=>{
            scale = window.reelContSize.width / (this.lineNumberContainer.width / this.lineNumberContainer.scale.x)
            this.lineNumberContainer.scale.set(scale > 1? 1: scale)                                 // 如果超過滾輪框大小，則縮小
            this.lineNumberContainer.x = this.lineContainer.x - this.lineNumberContainer.width / 2  // 裡面的數字置左，所以計算扣到半寬
        }
    }

    /**
     * 播放全線得獎動畫
     * @param {Array<ISSlotWinLineInfo} winlineArr 贏分線陣列
     * @param {number} [multiple=]  倍率 (沒有則會是 undefined)
     */
    public static async playAllLineWin(winlineArr: Array<ISSlotWinLineInfo>, multiple?: number){      
        this.winlineArr = winlineArr.slice()
        
        this.multiple = multiple

        this.winlineArr.map(winline => this.playLine(winline.LineNo))        // 播放線
        const win: number = this.winlineArr.reduce((pre, curr) => plus(pre, curr.Win), 0)
        const allPromise: Array<Promise<void>> = this.getAllWinPos(this.winlineArr).map(pos => SymbolController.playWinAnimation(pos.x, pos.y))     // 撥放全部得獎動畫
        allPromise.push(
            Sleep(this.lineConfig.leastAllLineDuration),                   // 最少演出時間
            LineNumberManager.playLineNumberAnim(this.lineNumberContainer, win, this.multiple),       // 線獎跑分
        )        
        
        await Promise.all(allPromise)
        await Sleep(.5)

        EventHandler.dispatch(eEventName.betModelChange, {betModel: BetModel.getInstance()})        // 跑完分後，顯示目前總分
    }

    public static async playFG_AllLineWin(winlineArr: Array<ISSlotWinLineInfo>, totalWin: number){
        this.winlineArr = winlineArr.slice()
        
        this.winlineArr.map(winline => this.playLine(winline.LineNo))        // 播放線
        const allPromise: Array<Promise<void>> = this.getAllWinPos(this.winlineArr).map(pos => SymbolController.playWinAnimation(pos.x, pos.y))     // 撥放全部得獎動畫
        allPromise.push(
            Sleep(this.lineConfig.leastAllLineDuration),                     // 最少演出時間
            LineNumberManager.playLineNumberAnim(this.lineNumberContainer, totalWin),                // 線獎跑分
        )        
        
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
        const {LineGame} = gameConfig
        if(this.winlineArr.length == 1){        // 單線的話就不跑逐線
            const {Win, LineNo, WayCount} = this.winlineArr[0]
            SlotUIManager.activeWinInfo(true, LineGame? LineNo: WayCount, Win)      // 顯示單線贏分資訊
            return
        }

        return new Promise<void>(res =>{

            const {eachLineLight} = this.lineConfig
            
            let index: number = 0
            this.eachLineTimeline = gsap.timeline().repeat(-1)
            .call(()=>{
                this.clearLineEvent()
                const {LineNo, Win, WinPosition, WayCount} = this.winlineArr[index]
                this.playLine(LineNo)                                                           // 播放線獎
                LineNumberManager.playLineNumber(this.lineNumberContainer, Win)                 // 播放分數
                WinPosition.map(pos => SymbolController.playWinAnimation(pos[0], pos[1]))       // 播放動畫
                SlotUIManager.activeWinInfo(true, LineGame? LineNo: WayCount, Win * (this.multiple || 1))
                index = ++index % this.winlineArr.length
            })
            .add(()=> {}, `+=${eachLineLight}`)
            
            .eventCallback('onStart', ()=> res())

            .eventCallback('onComplete', ()=>{
                this.clearLineEvent()
            })
            
            this.stopEachLineFn = ()=>{
                safe_kill_tween(this.eachLineTimeline, false)
                this.eachLineTimeline = null
            }
        })
    }

    
    /**
     * 播放FG回來後逐線動畫
     * @returns 單線的話直接回傳 / 多線的話 timeline 開始跑了之後回傳
     */
     public static async playFG_EachLine(){
        this.stopEachLineFn = null
        const {LineGame} = gameConfig
        if(this.winlineArr.length == 1){        // 單線的話就不跑逐線
            // FG 回來的逐線若只有單線，就是FG那條 (沒有贏分資訊)
            // const {Win, LineNo, WayCount} = this.winlineArr[0]
            // SlotUIManager.activeWinInfo(true, LineGame? LineNo: WayCount, Win)      // 顯示單線贏分資訊
            return
        }

        return new Promise<void>(res =>{

            // 計算 FG 扣除 NG 贏分的總分
            const FGWin: number = minus(BetModel.getInstance().Win, this.winlineArr.filter(winline => winline.LineNo != 0)
            .reduce((pre, curr) => plus(pre, curr.Win), 0))
            const {eachLineLight} = this.lineConfig

            let index: number = 0
            this.eachLineTimeline = gsap.timeline().repeat(-1)
            .call(()=>{
                this.clearLineEvent()
                const {LineNo, Win, WinPosition} = this.winlineArr[index]
                if(LineNo == 0){
                    LineNumberManager.playLineNumber(this.lineNumberContainer, FGWin)
                    SlotUIManager.activeWinInfo(false)
                }else{
                    this.playLine(LineNo)                                                           // 播放線獎
                    LineNumberManager.playLineNumber(this.lineNumberContainer, Win)                 // 播放分數
                    SlotUIManager.activeWinInfo(true, LineNo, Win)                                  // 播放贏分資訊
                }
                WinPosition.map(pos => SymbolController.playWinAnimation(pos[0], pos[1]))           // 播放動畫
                index = ++index % this.winlineArr.length
            })
            .add(()=> {}, `+=${eachLineLight}`)
            
            .eventCallback('onStart', ()=> res())

            .eventCallback('onComplete', ()=>{
                this.clearLineEvent()
            })
            
            this.stopEachLineFn = ()=>{
                safe_kill_tween(this.eachLineTimeline, false)
                this.eachLineTimeline = null
            }
        })
    }

    /** 清除所有得獎動畫 */
    private static clearLineEvent(){
        this.lineContainer.children.slice().map(child => child.destroy())
        SymbolController.clearAllWinAnimation()         // 清除動畫
        LineNumberManager.clearLineNumber()             // 清除分數
        LineNumberManager.clearLineWinMultNumber()      // 清除分數倍率
    }

    /**
     * 播放線
     * @param {number} lineNo 第幾線
     */
    private static playLine(lineNo: number){
        if(lineNo == 0)     // FG 不播線圖
            return
        const line = this.lineContainer.addChild(new Sprite(this.getLineTextureName(lineNo)))
        line.anchor.set(.5)
    }

    /**
     * 取得貼圖名稱
     * @param {number} lineNo 第幾線
     * @returns {string}
     */
    private static getLineTextureName(lineNo: number): string{
        return 'Line_0' + lineNo + '.png'
    }
}