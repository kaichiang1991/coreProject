import Symbol from "./Symbol"
import { eSymbolConfig, eSymbolName, eSymbolState, mapRowIndex, reelSymbolCount, yOffsetArr } from "./SymbolDef"
import ReelController, { eReelGameType, spinConfig } from "./ReelController"
import {fps} from '@root/config'
import GameSlotData from "../GameSlotData"
import strip from '@root/strip.json?edit'
import GameSpineManager from "@root/src/System/Assets/GameSpineManager"
import GameAudioManager, { eAudioName } from "@root/src/System/Assets/GameAudioManager"
import { IMediaInstance } from "@pixi/sound"

export enum eListeningState{
    none,       // 沒有聽牌
    normal,     // 一般聽牌 (減速)
    special,    // 特殊聽牌 (單顆，會卡一半後回彈)
}

export default class Reel{

    private symbolArr: Array<Symbol>        // 所有滾輪上的符號 (包含上下各一顆)
    public get DownSymbol(): Array<Symbol> {return this.symbolArr.slice(1, reelSymbolCount[this.reelIndex] + 1)}
    private reelIndex: number               // 第幾軸
    public get ReelIndex(): number  {return this.reelIndex}

    // 滾輪表
    private reelDatas: Array<number>
    public set ReelDatas(arr: Array<number>){
        this.reelDatas = arr.slice()
        this.flatReelDatas = JSON.stringify([...this.reelDatas, ...this.reelDatas]).slice(1, -1).concat(',')       // 避免結果落在尾巴
    }
    private flatReelDatas: string
    private dataIndex: number
    private lastBottomSymbolId: number      // 上一次底部的 symbol id

    // 滾動
    private isFastRolling: boolean      // 是否快速滾動
    public set FastRolling(flag: boolean){this.isFastRolling = flag}

    private dy: number                  // 每一幀更新的向下位移
    private checkIndex: number          // 要檢查是否到底的 symbol 索引 (會預留一顆)
    private checkPointY: number         // 檢查到底的值
    private toStop: boolean             // 是否通知要開始停輪
    private toBounce: boolean           // 開始 bounce

    public toForceStop: boolean        // 是否急停

    private setNextReelCanStopTween: gsap.core.Tween    // 設定下一輪可否停輪的tween
    private nextReelCanStop: boolean    // 下一輪是否可以開始停輪
    public get NextReelCanStop(): boolean { return this.nextReelCanStop }

    private toSetStop: boolean          // 是否已經設定下一輪

    // 聽牌
    private isListening: eListeningState            // 該輪有沒有聽牌
    public get Listening(): eListeningState { return this.isListening }
    private isListeningDone: boolean        // 聽牌是否進到bounce
    public get ListeningDone(): boolean { return this.isListeningDone }
    private listeningSpeedUpDone: boolean   // 聽牌加速完
    private listeningSpeed: number          // 聽牌時速度
    private listeningTween: gsap.core.Tween // 設定聽牌速度的 tween
    private reelExpect: Spine               // 聽牌特效
    private reelExpectAudio: IMediaInstance // 聽牌特效音效

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
        this.symbolArr.slice().reverse().map(symbol =>{
            symbol.setTexture(this.reelDatas[this.nextDataIndex()])        // 滾輪表由下至上
        })
        
        const maskArr: Array<Sprite> = Array.isArray(ReelController.Mask)? ReelController.Mask: [ReelController.Mask]
        this.symbolArr.map(symbol =>{
            const maskIndex: number = !Array.isArray(ReelController.Mask)? 0: ~~(this.reelIndex / 5)
            symbol.setUseMask(maskArr[maskIndex])
            symbol.activeMask(true)
        })

        ReelController.ReelContainer.addChild(...this.symbolArr)
    }

    /** 重設滾動參數 */
    private resetSpin(isFast: boolean){
        this.isFastRolling = isFast      // 設定該次滾動是否為快速滾動

        this.nextReelCanStop = this.toSetStop = false
        this.setNextReelCanStopTween?.kill()

        this.toForceStop = this.toBounce = this.toStop = false
        this.correctIndex = 0

        // 聽牌重設
        this.isListening = eListeningState.none
        this.listeningSpeedUpDone = this.isListeningDone = false
        this.listeningSpeed = spinConfig.spinSpeed
        this.listeningTween?.kill()

        // 回復 symbol ( 主要是回復 zIndex )
        this.symbolArr.map(symbol => symbol.setTexture(null, eSymbolState.Normal))
    }

    /**
     * 設定滾輪開始滾動
     * @param {boolean} fast 是否快速模式
     * @returns {[Promise<void>, Promise<void>]} Tuple陣列，[0] 回傳是否已上滑，[1] 回傳是否已停輪
     */
    public setStartSpin(fast: boolean): [Promise<void>, Promise<void>]{
        return [
            new Promise<void>(res =>{
                this.resetSpin(fast)
                // 上拉
                const {upDistance, upDuration, turboUpDistance, turboUpDuration} = spinConfig
                const y: string = `-=${this.isFastRolling? turboUpDistance: upDistance}`, duration: number = this.isFastRolling? turboUpDuration: upDuration
                gsap.to(this.symbolArr, {y, duration})
                .eventCallback('onComplete', ()=> res())
            }), 
            new Promise<void>(res =>{
                this.stopSpinEvent = res
            })
        ]
    }

    /** 設定全部 symbol 模糊 */
    public setAllBlur(){
        this.symbolArr.map(symbol => symbol.setTexture(null, eSymbolState.Blur))
    }

    /**
     * 滾動事件 (每一幀呼叫)
     * @param deltaRatio gsap ticker 內的幀數倍數  (值越大，畫面越lag)
     */
    public spinEvent(deltaRatio: number){
        
        if(this.toBounce)       // 已經進到bounce就先不執行
           return      

        this.dy = deltaRatio * (                                                    // 計算每幀位移量
            this.isFastRolling || this.toForceStop? spinConfig.fastSpinSpeed:       // 快速模式下 or 急停時
            this.isListening? this.listeningSpeed:                                  // 聽牌模式下
            spinConfig.spinSpeed                                                    // 一般滾動模式下
        )        

        if(this.updateSymbolPos()){
            this.swapSymbol()                       // 交換 symbol 位置
            this.setNextSymbol()                    // 設定掉下來的下顆符號

            if(!this.toStop)                                        // 還沒有收到停止指令
                return
                
            if(this.isListening && !this.listeningSpeedUpDone)      // 聽牌時先跳過停止階段
                return
            
            if(ReelController.isLastReelCanStop(this.reelIndex) && ReelController.isLastReelListeningDone(this.reelIndex)){     // 判斷停輪條件

                if(this.correctIndex == this.resultArr.length + spinConfig.extraSymbolCount){   // 換到最後一顆，準備進bounce
                    ReelController.setListeningEffect(this.reelIndex)                           // 設定下一輪的聽牌效果
                    if(this.isListening){
                        this.isListeningDone = true                                             // 讓下一輪判斷，前一輪聽牌結束 ReelController.isPreviousListeningDone()
                        this.toForceStop = true                                                 // 讓後面幾輪的 ReelController.isLastReelCanStop 可以判斷 ForceStop
                        this.isListening == eListeningState.special? this.specialListeningBounce(): this.spinBounce()   // 判斷是否特殊聽牌的 bounce
                    }else{
                        this.spinBounce()
                    }
                    return
                }

                if(!this.toSetStop){          
                    this.toSetStop = true     
                    // 設定下一輪可以停輪的時間
                    this.setNextReelCanStopTween = gsap.delayedCall(this.isListening? 0: spinConfig.eachReelStop, ()=> this.nextReelCanStop = true)
                    // 接回正確的滾輪表
                    this.getCorrectDataIndex(this.resultArr)
                    this.symbolArr[0].setTexture(this.reelDatas[this.nextDataIndex()], eSymbolState.Blur, true)
                }else{
                    this.correctIndex++
                }
            }
        }
    }

    /** 滾輪回彈 */
    private async spinBounce(){
        this.toBounce = true

        const {bounceDistance, bounceBackDuration, spinSpeed} = spinConfig
        const lastIndex: number = this.symbolArr.length - 1                                                                      // bounce 時最下面那顆的index
        const overDistance: number = this.symbolArr[lastIndex].y - yOffsetArr[mapRowIndex(this.reelIndex)][lastIndex - 1]        // 超出規定的座標多少

        const downDistance: number = bounceDistance - overDistance                                  // 實際要bounce 下移的距離 (小於0就是 lag 或是 加速太快了，導致一幀就超過了 bounce 距離)
        const downDuration: number = downDistance < 0? 0: (downDistance / this.dy / fps)            // 根據上一個spinEvent 決定這次要下移的時間 (this.dy * fps = 速度(每秒位移))

        const upDistance: number = downDistance >= 0? bounceDistance: bounceDistance - downDistance       // 上移的距離，如果下移已經超過bounceDistance，則會補上超過的那一段
        const upDuration: number = bounceBackDuration / (this.dy / spinSpeed )                            // 上移的時間，會跟著當下速度與一般滾輪的速度比率去設定

        // 到底部的行為
        const toBottomEvent: GSAPCallback = ()=>{
            this.stopReelExpect()
            this.playEndSpinAudio()
        }

        if(this.isListening == eListeningState.none){           // 沒聽牌
            const bounceTimeline: GSAPTimeline = gsap.timeline()
            .to(this.symbolArr, {ease: Power0.easeNone, y: `+=${downDistance >= 0? downDistance: 0}`, duration: downDuration})          // 下移
            .call(toBottomEvent)                                                                                                        // 到達底部
            .to(this.symbolArr, {ease: Power1.easeOut, duration: upDuration, y: `-=${upDistance}`})                                     // 上移
            await waitTweenComplete(bounceTimeline)
        }else{                                                  // 有聽牌
            toBottomEvent()
        }

        this.resetSymbol()            // 演完後歸位
        const allEndSpin: Array<Promise<void>> = this.DownSymbol.map(symbol => symbol.playEndSpinAnim())        // 演出落定動畫
        await Promise.all(allEndSpin)
        this.stopSpinEvent()
    }

    /** 特殊聽牌的回彈流程 */
    private async specialListeningBounce(){
        this.toBounce = true

        const lastIndex: number = this.symbolArr.length - 1                                         // bounce 時最下面那顆的index
        const overDistance: number = this.symbolArr[lastIndex].y - yOffsetArr[mapRowIndex(this.reelIndex)][lastIndex - 1]        // 超出規定的座標多少

        // 先下移半顆
        const downDistance: number = eSymbolConfig.height/2 - overDistance
        const isEmpty: boolean = this.resultArr[0] == 0
        const endMove: string = isEmpty? `-=${eSymbolConfig.height / 2}`: `+=${eSymbolConfig.height / 2}`
        
        const timeline: GSAPTimeline = gsap.timeline()
        .to(this.symbolArr, {ease: Power2.easeOut, y: `+=${downDistance}`})
        .to(this.symbolArr, {y: endMove, delay: 1})

        await waitTweenComplete(timeline)

        if(isEmpty) this.resetSymbol()      // 歸位

        const allEndSpin: Array<Promise<void>> = this.DownSymbol.map(symbol => symbol.playEndSpinAnim())        // 演出落定動畫
        await Promise.all(allEndSpin)
        this.stopSpinEvent()
    }

    /** 設定下一顆符號，並記錄目前最下面的符號 */
    private setNextSymbol(){
        this.lastBottomSymbolId = this.symbolArr[0].SymbolID
        this.symbolArr[0].setTexture(this.reelDatas[this.nextDataIndex()], this.toStop? eSymbolState.Normal: eSymbolState.Blur, this.toStop)
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

    /** 播放落定音效 */
    public playEndSpinAudio(){
        const audioName: eAudioName = ReelController.FG_AudioArr[this.reelIndex]? eAudioName.FG_EndSpin: eAudioName.spinStop
        GameAudioManager.playAudioEffect(audioName)
    }

    /**
     * 滾輪結果是否有包含指定符號
     * @param {eSymbolName} symbol 符號ID
     * @returns {boolean}
     */
    private hasSymbol(symbol: eSymbolName): boolean{
        return this.resultArr.includes(symbol)
    }
    
    //#region 聽牌
    /** 設定聽牌 */
    public setListening(state: eListeningState){
        this.isListening = state
    }
    
    /** 設定聽牌效果(減速) */
    public setListeningEffect(){
        this.listeningTween = gsap.to(this, {ease: Power2.easeOut, duration: spinConfig.listeningDelay, listeningSpeed: spinConfig.listeningSpeed})
        .eventCallback('onComplete', ()=> this.listeningSpeedUpDone = true)

        this.playReelExpect()
        this.isFastRolling = false      // 若是在快速轉動模式下，關閉快速轉動
    }

    /** 播放期待框效果 */
    public playReelExpect(){
        this.reelExpect = GameSpineManager.playReelExpect(ReelController.ReelContainer, this.reelIndex)
        ;[this.reelExpectAudio] = GameAudioManager.playAudioEffect(eAudioName.reelExpect, true)
    }

    /** 停止期待框效果 */
    public stopReelExpect(){
        if(this.reelExpect){
            this.reelExpect.destroy()
            this.reelExpect = null
        }
        if(this.reelExpectAudio){
            this.reelExpectAudio = GameAudioManager.stopAudioEffect(this.reelExpectAudio)
        }
    }
    //#endregion 聽牌

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
        this.symbolArr.map((symbol, symbolIndex) => symbol.setIndex(this.reelIndex, symbolIndex))
    }

    /** 演出完畢後，重設symbol的位置和貼圖 */
    private resetSymbol(){
        // 把最上面那一顆拉到最下面
        this.symbolArr[0].setTexture(this.lastBottomSymbolId)
        const yOffset: Array<number> = yOffsetArr[mapRowIndex(this.reelIndex)]
        this.symbolArr[0].y = yOffset[yOffset.length - 1]
        this.symbolArr.push(this.symbolArr.shift())
        this.symbolArr.forEach((symbol, index) => symbol.setIndex(this.reelIndex, index))
        // 恢復轉動階段時多計算的一顆
        this.dataIndex == ++this.dataIndex % this.reelDatas.length
    }

    //#region 滾輪表
    public setReelData(type: eReelGameType){
        switch(type){
            case eReelGameType.normalGame:
                this.ReelDatas = strip[type][this.reelIndex]
                if(GameSlotData.NGSpinData){    // 有上一把的資訊，就重新調整 dataIndex
                    this.getCorrectDataIndex(GameSlotData.NGSpinData.SpinInfo.ScreenOrg[this.reelIndex])
                    // 根據額外多出來的顆數，去回復NG盤面
                    Array(spinConfig.extraSymbolCount - 1).fill(1).map(_ => this.nextDataIndex())
                }else{
                    this.dataIndex = 1 + reelSymbolCount[this.reelIndex]      // 最下面會預留一顆，所以初始的 滾輪表index為1 + 該輪的個數  (要使用最前面幾顆)
                }

            break

            case eReelGameType.freeGame:
                this.ReelDatas = strip[type][this.reelIndex]
                this.dataIndex = 1 + reelSymbolCount[this.reelIndex]           // 最下面會預留一顆，所以初始的 滾輪表index為1 + 該輪的個數  (要使用最前面幾顆)
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
        if(this.isListening == eListeningState.special){    // 特殊聽牌的情形
            this.dataIndex = this.reelDatas.indexOf(0) + result.length + spinConfig.extraSymbolCount
            return
        }

        const resultStr: string = ',' + JSON.stringify(result).slice(1, -1) + ','                                        // 前後加 , 避免遇到數字前後相等的情況  e.g.  21,21,2 == 21,21,21  /  1,21,21 == 21,21,21
        const index: number = this.flatReelDatas.indexOf(resultStr)
        if(index < 0){
            Debug.error(this.reelIndex, 'getCorrectDateIndex', '不在滾輪表內')
            return
        }

        this.dataIndex = this.flatReelDatas.slice(0, index - 1).split(',').length + result.length + spinConfig.extraSymbolCount
    }
    //#endregion
}