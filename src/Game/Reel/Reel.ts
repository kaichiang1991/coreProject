import Symbol from "./Symbol"
import { eSymbolConfig, reelSymbolCount, yOffsetArr } from "./SymbolDef"
import ReelController, { eReelGameType, spinConfig } from "./ReelController"
import {fps} from '@root/config'
import GameSlotData from "../GameSlotData"

export default class Reel{

    private symbolArr: Array<Symbol>        // 所有滾輪上的符號 (包含上下各一顆)
    private reelIndex: number               // 第幾軸
    public get ReelIndex(): number  {return this.reelIndex}

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

    private setNextReelCanStopTween: gsap.core.Tween    // 設定下一輪可否停輪的tween
    private nextReelCanStop: boolean    // 下一輪是否可以開始停輪
    public get NextReelCanStop(): boolean { return this.nextReelCanStop }

    private toSetStop: boolean          // 是否已經設定下一輪

    // 聽牌
    private isListening: boolean            // 該輪有沒有聽牌
    public get Listening(): boolean { return this.isListening }
    private isListeningDone: boolean        // 聽牌是否進到bounce
    public get ListeningDone(): boolean { return this.isListeningDone }
    private listeningSpeedUpDone: boolean   // 聽牌加速完
    private listeningSpeed: number          // 聽牌時速度
    private listeningTween: gsap.core.Tween // 設定聽牌速度的 tween

    // 結果
    private resultArr: Array<number>    // 結果陣列
    private correctIndex: number        // 校正的index，用來判斷結果前的滾輪表symbol的個數
    private stopSpinEvent: Function     // 停止事件，通知呼叫 startSpin 的地方，已經停輪

    /**
     * 初始化滾輪
     * @param index 
     * @returns 滾輪
     */
    public init(index: number): Reel{
        this.reelIndex = index
        // 初始化滾輪表裡面的symbol
        this.symbolArr = Array(reelSymbolCount[this.reelIndex] + 2).fill(1).map((_, index) => new Symbol().init(this.reelIndex, index))
        
        // 檢查是否到底部的相關參數
        this.checkIndex = this.symbolArr.length - 2
        this.checkPointY = this.symbolArr[this.checkIndex].y
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
        this.nextReelCanStop = this.toSetStop = false
        this.setNextReelCanStopTween?.kill()

        this.toSetStop = this.toForceStop = this.toBounce = this.toStop = false
        this.correctIndex = 0

        // 聽牌重設
        this.listeningSpeedUpDone = this.isListening = this.isListeningDone = false
        this.listeningSpeed = spinConfig.spinSpeed
        this.listeningTween?.kill()
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

        this.dy = deltaRatio * (this.toForceStop? spinConfig.forceStopSpeed: this.isListening? this.listeningSpeed: spinConfig.spinSpeed)        // 計算每幀位移量

        if(this.updateSymbolPos()){
            this.swapSymbol()                       // 交換 symbol 位置
            this.setNextSymbol()                    // 設定掉下來的下顆符號

            if(!this.toStop)        // 還沒有要停止
                return
                
            if(!this.toForceStop && this.isListening && !this.listeningSpeedUpDone){    // 聽牌時先跳過停止階段
                return
            }

            if(this.toForceStop || (ReelController.isLastReelCanStop(this.reelIndex) && ReelController.isLastReelListeningDone(this.reelIndex))){     // 判斷停輪條件

                if(this.correctIndex == this.resultArr.length + spinConfig.extraSymbolCount){   // 換到最後一顆，準備進bounce
                    ReelController.setListeningEffect(this.reelIndex)       // 設定下一輪的聽牌效果
                    this.isListeningDone = true                             // 讓下一輪判斷，前一輪聽牌結束 ReelController.isPreviousListeningDone()
                    this.spinBounce()
                    return
                }

                if(!this.toSetStop){          
                    this.toSetStop = true     
                    // 設定下一輪可以停輪的時間
                    this.setNextReelCanStopTween = gsap.delayedCall(this.isListening? 0: spinConfig.eachReelStop, ()=> this.nextReelCanStop = true)
                    // 接回正確的滾輪表
                    this.getCorrectDataIndex(this.resultArr)
                    this.symbolArr[0].setTexture(this.reelDatas[this.nextDataIndex()])
                }else{
                    this.correctIndex++
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
        this.toStop = true
    }

    //#region 聽牌
    /** 設定聽牌 */
    public setListening(){
        this.isListening = true
    }
    
    /** 設定聽牌效果(減速) */
    public setListeningEffect(){
        this.listeningTween = gsap.to(this, {ease: Power2.easeOut, duration: spinConfig.listeningDelay, listeningSpeed: spinConfig.listeningSpeed})
        .eventCallback('onComplete', ()=> this.listeningSpeedUpDone = true)
    }
    //#endregion

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
    public setReelData(type: eReelGameType){
        // ToDo 讀json滾輪表
        switch(type){
            case eReelGameType.normalGame:
                this.reelDatas = [5, 1, 2, 3, 4, 4, 5, 1, 2, 3, 4, 5, 1, 6, 3, 3, 3, 5, 5]
                if(GameSlotData.NGSpinData){    // 有上一把的資訊，就重新調整 dataIndex
                    this.getCorrectDataIndex(GameSlotData.NGSpinData.result[this.reelIndex])
                    this.nextDataIndex()
                }else{
                    this.dataIndex = 1      // 最下面會預留一顆，所以初始的 滾輪表index為1
                }

            break

            case eReelGameType.freeGame:
                this.reelDatas = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 6, 6]
                this.dataIndex = 1      // 最下面會預留一顆，所以初始的 滾輪表index為1
            break
        }
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