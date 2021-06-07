import GameSceneManager from "@root/src/System/GameSceneController";
import { Container, Graphics } from "pixi.js-legacy";
import {size} from '@root/config'
import Reel from "./Reel";
import { reelCount, defaultStopOrder } from "./SymbolDef";
import { editConfig } from "@root/src";

interface ISpinConfig{
    upDistance: number          // 上移的距離
    upDuration: number          // 上移的時間
    spinSpeed: number           // 一般的滾動速度
    forceStopSpeed: number      // 急停的滾動速度
    listeningSpeed: number      // 聽牌的滾動速度  (最終的速度，漸慢)
    listeningDelay: number      // 聽牌的延遲時間  (s)
    bounceDistance: number      // 回彈的距離
    bounceBackDuration: number  // 回拉的時間
    eachReelStop: number        // 每輪的間隔
    extraSymbolCount: number    // 結尾要接回去的滾輪表個數
}

export let spinConfig: ISpinConfig

export default class ReelController{

    private static reelContainer: Container
    public static get ReelContainer(): Container {return this.reelContainer}
    private static reelArr: Array<Reel>
    private static mask: Graphics

    private static stopOrder: Array<number>

    // 急停
    private static toStopNow: boolean
    private static stopNowEvent: Function
    public static get StopNowEvent(): Function {return this.stopNowEvent}       // 急停事件

    /** 初始化滾輪控制 */
    public static async init(){

        // 讀取滾輪參數的 json 檔
        spinConfig = editConfig['spin']
        
        this.reelContainer = new Container()
        this.mask = this.reelContainer.addChild(new Graphics()
            .beginFill(0x333333, .5).drawRect(-110, 0, 720, 300).endFill()
        )
        this.reelContainer.name = 'reel container'
        this.reelContainer.pivot.set(250, 150)
        this.reelContainer.position.set(size.width / 2, 525)

        this.reelArr = Array(reelCount).fill(1).map((_, index) => new Reel().init(index))

        this.stopNowEvent = ()=>{
            if(this.toStopNow)  
                return
            
            this.toStopNow = true
            
            this.stopOrder.map(order => this.reelArr[order]).map(reel =>{
                reel.ForceStop = true
                reel.stopSpin()
            })
            // this.stopOrder.map(index => this.reelArr[index]).map(reel =>{
            //     if(reel.SpinDone)   return                  // 預防前面停輪後，觸發急停會造成模糊
            //     reel.speedUp(eReelConfig.speedUpScale)
            //     reel.stopSpin()
            // })
        }
    }

    public static reset(){
        this.setReelData()
        this.reelArr.map(reel => reel.reset())

        this.reelContainer.mask = this.mask
        GameSceneManager.getSceneContainer().addChild(this.reelContainer)
    }

    //#region 控制滾輪
    /**
     * 開始滾動
     * @param {Array<number>} stopOrder 指定的停輪順序，預設用 symbolDef 裡面，若要單輪可以直接指定
     * @returns 全部停輪後會回傳
     * @example
     *  ReelController.startSpin()          // 使用預設停輪順序
     *  ReelController.startSpin([0, 1])    // 只滾 0, 1 軸
     */
    public static async startSpin(stopOrder: Array<number> = defaultStopOrder){
        this.toStopNow = false                  // 初始化急停參數
        this.stopOrder = stopOrder.slice()      // 停輪順序

        const spinReelArr: Array<Reel> = this.stopOrder.map(order => this.reelArr[order])       // 要轉動的輪
        const [...setStartArr] = spinReelArr.map(reel => reel.setStartSpin())
        await Promise.all(setStartArr.map(arr => arr[0]))       // 等待都往上拉之後

        let detlaRatio: number
        const tickerEvent: gsap.TickerCallback = () =>{
            detlaRatio = gsap.ticker.deltaRatio()
            spinReelArr.map(reel => reel.spinEvent(detlaRatio))
        }

        gsap.ticker.add(tickerEvent)
        await Promise.all(setStartArr.map(arr => arr[1]))
        gsap.ticker.remove(tickerEvent)
    }

    /**
     * 設定盤面結果
     * @param result 
     */
    public static setResult(result: Array<Array<number>>){
        this.reelArr.map((reel, index) => reel.setResult(result[index]))
    }

    /** 正常停輪 */
    public static stopSpin(){
        if(this.toStopNow)  return

        this.stopOrder.map(order => this.reelArr[order].stopSpin())
    }

    /**
     * 判斷上一輪是否已經開始停輪
     * @param index 要檢查的輪數
     * @returns 
     */
    public static isLastReelCanStop(index: number): boolean{  
        index = this.stopOrder.indexOf(index)       // 計算在停輪順序裡面的第幾個
        return index == 0? true: this.reelArr[this.stopOrder[index - 1]].NextReelCanStop
    }

    /**
     * 判斷上一輪聽牌停止的狀態
     * @param index 要檢查的輪數
     * @returns 上一輪是否聽牌效果停止
     */
    public static isLastReelListeningDone(index: number): boolean{
        index = this.stopOrder.indexOf(index)
        if(index == 0)
            return true
        
        const lastReel: Reel = this.reelArr[this.stopOrder[index - 1]]
        return !lastReel.Listening? true: lastReel.ListeningDone
    }


    /**
     * 設定滾輪表
     */
    public static setReelData(){
        this.reelArr.map(reel => reel.setReelData())
    }

    //#region 聽牌
    public static setListening(...indexArr: Array<number>){
        indexArr.map(index => this.reelArr[index].setListening())
    }

    /**
     * 通知下一輪開始演聽牌
     * @param index 第幾輪
     */
    public static setListeningEffect(index: number){
        index = this.stopOrder.indexOf(index)
        if(index >= this.stopOrder.length - 1)      // 最後一輪
            return
        const nextIndex: number = this.stopOrder[index + 1]
        this.reelArr[nextIndex].Listening && this.reelArr[nextIndex].setListeningEffect()
    }
    //#endregion
}