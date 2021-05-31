import Symbol from "./Symbol"
import { eSymbolConfig, reelSymbolCount, yOffsetArr } from "./SymbolDef"
import ReelController, { spinConfig } from "./ReelController"
import gsap from "gsap/all"
import {fps} from '@root/config'

export default class Reel{

    private symbolArr: Array<Symbol>        // 所有滾輪上的符號 (包含上下各一顆)
    private reelIndex: number               // 第幾軸

    // 滾輪表
    private reelDatas: Array<number>
    private dataIndex: number
    private lastBottomSymbolId: number      // 上一次底部的 symbol id

    // 滾動
    private dy: number                  // 每一幀更新的向下位移
    private checkIndex: number          // 要檢查是否到底的 symbol 索引 (會預留一顆)
    private checkPointY: number         // 檢查到底的值
    private toStop: boolean             // 是否通知要開始停輪
    private toBounce: boolean           // 開始 bounce
    private toForceStop: boolean        // 是否急停
    public set ForceStop(flag: boolean){ this.toForceStop = flag}
    private toSetStop: boolean          // 是否已經設定結果的參數
    private canStop: boolean            // 通知下一輪可否開始停輪
    public get CanStop(): boolean { return this.canStop }

    // 結果
    private resultArr: Array<number>    // 結果陣列
    private resultIndex: number         // 結果的index，用來判斷停輪
    private correctIndex: number        // 校正的index，用來判斷結果前的滾輪表symbol的個數
    private stopSpinEvent: Function     // 停止事件，通知呼叫 startSpin 的地方，已經停輪

    /**
     * 初始化滾輪
     * @param parent 
     * @param index 
     * @returns 滾輪
     */
    public init(index: number): Reel{
        this.reelIndex = index
        // 初始化滾輪表裡面的symbol
        this.symbolArr = Array(reelSymbolCount[this.reelIndex] + spinConfig.extraSymbolCount).fill(1).map((_, index) => new Symbol().init(this.reelIndex, index))
        
        // 檢查是否到底部的相關參數
        this.checkIndex = this.symbolArr.length - 2
        this.checkPointY = this.symbolArr[this.checkIndex].y

        this.dataIndex = 1      // 最下面會預留一顆，所以初始的 滾輪表index為1

        return this
    }

    /**
     * 重設滾輪(位置、貼圖)，並放到畫面上
     */
    public reset(){
        // 滾輪表由下至上
        this.symbolArr.slice().reverse().map(symbol =>{
            symbol.setTexture(this.reelDatas[this.nextDataIndex()])
        })

        ReelController.ReelContainer.addChild(...this.symbolArr)
    }

    /** 重設滾動參數 */
    private resetSpin(){
        this.toSetStop = this.toForceStop = this.canStop = this.toBounce = this.toStop = false
        this.correctIndex = this.resultIndex = 0
    }

    /**
     * 設定滾輪開始滾動
     * @returns {[Promise<void>, Promise<void>]} Tuple陣列，[0] 回傳是否已上滑，[1] 回傳是否已停輪
     */
    public setStartSpin(): [Promise<void>, Promise<void>]{
        return [
            new Promise<void>(res =>{
                this.resetSpin()
                // 上拉
                gsap.to(this.symbolArr, {y: `-=${spinConfig.upDistance}`, duration: spinConfig.upDuration})
                .eventCallback('onComplete', ()=> res())
            }), 
            new Promise<void>(res =>{
                this.stopSpinEvent = res
            })
        ]
    }

    /**
     * 滾動事件 (每一幀呼叫)
     * @param deltaRatio gsap ticker 內的幀數倍數  (值越大，畫面越lag)
     */
    public spinEvent(deltaRatio: number){
        
        if(this.toBounce)   return      // 已經進到bounce就先不執行

        this.dy = deltaRatio * (this.toForceStop? spinConfig.forceStopSpeed: spinConfig.spinSpeed)        // 計算每幀位移量

        if(this.updateSymbolPos()){

            this.canStop = this.correctIndex != 0   // 掉一顆下來後，讓下一軸可以停輪
            this.swapSymbol()                       // 交換 symbol 位置
            this.setNextSymbol()                    // 設定掉下來的下顆符號

            if(this.toStop && ( this.toForceStop || ReelController.isLastReelCanStop(this.reelIndex))){     // 判斷停輪條件
                
                if(this.resultIndex == this.resultArr.length + 1){
                    this.spinBounce()
                    return
                }

                if(!this.toSetStop){        // 設定落下的symbol接在滾輪表上
                    this.toSetStop = true
                    this.getCorrectDataIndex(this.resultArr)
                    this.symbolArr[0].setTexture(this.reelDatas[this.nextDataIndex()])
                    // this.symbolArr[0].setCorrectReelData(this.correctIndex)
                // }else if(++this.correctIndex < spinConfig.extraSymbolCount){        
                //     this.symbolArr[0].setCorrectReelData(this.correctIndex)
                // }else{
                //     this.symbolArr[0].setResult('Result' + this.resultArr[this.resultIndex++])
                // }
                }else if(++this.correctIndex >= spinConfig.extraSymbolCount){
                    this.symbolArr[0].setResult('Result' + this.resultArr[this.resultIndex++])
                }
            }
        }
    }

    /** 滾輪回彈 */
    private async spinBounce(){
        this.toBounce = true

        const lastIndex: number = this.symbolArr.length - 1                                         // bounce 時最下面那顆的index
        const overDistance: number = this.symbolArr[lastIndex].y - yOffsetArr[lastIndex - 1]        // 超出規定的座標多少

        const downDistance: number = spinConfig.bounceDistance - overDistance                       // 實際要bounce 下移的距離 (小於0就是 lag 或是 加速太快了，導致一幀就超過了 bounce 距離)
        const downDuration: number = downDistance >= 0? (downDistance / this.dy / fps): 0           // 根據上一個spinEvent 決定這次要下移的時間
        const upDistance: number = downDistance >= 0? spinConfig.bounceDistance: spinConfig.bounceDistance - downDistance       // 上移的距離，如果下移已經超過bounceDistance，則會補上超過的那一段

        const bounceTimeline: gsap.core.Timeline = gsap.timeline()
        .to(this.symbolArr, {ease: Power0.easeNone, y: `+=${downDistance >= 0? downDistance: 0}`, duration: downDuration})      // 下移
        .call(()=>{
            // 到底部
        })
        .to(this.symbolArr, {duration: spinConfig.bounceBackDuration, y: `-=${upDistance}`})        // 上移
        .call(()=>{
            // 演完後歸位，不放這裡
            this.resetSymbol()
            this.stopSpinEvent()
        })
    }

    /** 設定下一顆符號，並記錄目前最下面的符號 */
    private setNextSymbol(){
        this.lastBottomSymbolId = this.symbolArr[0].SymbolID
        this.symbolArr[0].setTexture(this.reelDatas[this.nextDataIndex()])
    }

    /**
     * 設定結果
     * @param resultArr 結果陣列
     */
    public setResult(resultArr: Array<number>){
        this.resultArr = resultArr.slice()
    }

    /** 停止滾輪 */
    public stopSpin(){
        if(this.toStop) return

        this.toStop = true
    }

    /**
     * 更新每一顆symbol的位置
     * @returns {boolean} 指定的那一顆超過指定的位置時回傳 true
     */
    private updateSymbolPos(): boolean{
        for (const symbol of this.symbolArr) {
            symbol.y += this.dy
        }

        return this.symbolArr[this.checkIndex].y >= this.checkPointY
    }

    /** 把最下面的symbol 換到陣列 0 的位置，並交換位子 */
    private swapSymbol(){
        // 交換上下位置
        const lastSymbol: Symbol = this.symbolArr.pop()
        lastSymbol.y = this.symbolArr[0].y - eSymbolConfig.height
        // 換 index
        this.symbolArr.unshift(lastSymbol)
        this.symbolArr.map((symbol, symbolIndex) => symbol.setIndex(symbolIndex))
    }

    /** 演出完畢後，重設symbol的位置和貼圖 */
    private resetSymbol(){
        // 把最上面那一顆拉到最下面
        this.symbolArr[0].setTexture(this.lastBottomSymbolId)
        this.symbolArr[0].y = yOffsetArr[yOffsetArr.length - 1]
        this.symbolArr.push(this.symbolArr.shift())
        this.symbolArr.forEach((symbol, index) => symbol.setIndex(index))
    }

    //#region 滾輪表
    public setReelData(){
        // ToDo 讀json滾輪表
        // ToDo 回 NG 要回復盤面
        this.reelDatas = [5, 1, 2, 3, 4, 4, 5, 1, 2, 3, 4, 5, 1, 6, 3, 3, 3]
    }

    /**
     * 計算下一個進來的 symbol 在滾輪表內的 index
     * @returns 下一個index
     */
    private nextDataIndex(): number{
        return this.dataIndex = (--this.dataIndex + this.reelDatas.length) % this.reelDatas.length
    }

    /**
     * 在滾輪表內找到結果，並設定正確的滾輪表位置
     * @param result 結果
     */
    private getCorrectDataIndex(result: Array<number>){
        const flatArrStr: string = JSON.stringify([...this.reelDatas, ...this.reelDatas]).slice(1, -1)       // 避免結果落在尾巴
        const resultStr: string = JSON.stringify(result).slice(1, -1)
        const index: number = flatArrStr.indexOf(resultStr)
        if(index < 0){
            Debug.error('getCorrectDateIndex', '不在滾輪表內')
            return
        }
        this.dataIndex = flatArrStr.slice(0, index - 1).split(',').length + result.length + spinConfig.extraSymbolCount
    }
    //#endregion
}