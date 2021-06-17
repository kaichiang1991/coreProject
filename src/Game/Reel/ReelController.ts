import GameSceneManager from "@root/src/System/GameSceneController";
import { Container, Graphics } from "pixi.js-legacy";
import Reel, { eListeningState } from "./Reel";
import { reelCount, defaultStopOrder, reelContPivot } from "./SymbolDef";
import { editConfig } from "@root/src";
import config from '@root/config'
import { eNGLayer, eReelContainerLayer } from "@root/src/System/LayerDef";
import { eReelType } from "@root/globalDef";

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

export enum eReelGameType{
    normalGame,
    freeGame
}

export let spinConfig: ISpinConfig

export default class ReelController{

    private static gameType: eReelGameType      // 目前遊戲的型態

    private static reelContainer: Container
    public static get ReelContainer(): Container {return this.reelContainer}
    private static reelArr: Array<Reel>
    private static mask: Graphics | Array<Graphics>
    public static get Mask(): Graphics | Array<Graphics> {return this.mask}
    private static blackCover: Graphics

    private static stopOrder: Array<number>

    // 急停
    private static toStopNow: boolean
    private static stopNowEvent: Function
    public static get StopNowEvent(): Function {return this.stopNowEvent}       // 急停事件

    private static resizeFn: Function

    /** 初始化滾輪控制 */
    public static async init(){
        spinConfig = editConfig['spin']        // 讀取滾輪參數的 json 檔

        this.initReelContainer()
        this.initMask()
        this.initBlackCover()

        // 初始化滾輪
        this.reelArr = Array(reelCount).fill(1).map((_, index) => new Reel().init(index))
        SymbolController.init(this.reelArr)

        // 初始化急停事件
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

        // 初始化旋轉 resize 事件
        this.resizeFn = ()=> this.resize()
    }

    /** 初始化滾輪的容器，方便之後縮放 */
    private static initReelContainer(){
        this.reelContainer = new Container()
        this.reelContainer.name = 'reel container'
        this.reelContainer.sortableChildren = true
        this.reelContainer.pivot.copyFrom(reelContPivot)
        this.reelContainer.zIndex = eNGLayer.reelContainer        
        this.reelContainer.interactive = this.reelContainer.buttonMode = true
        this.reelContainer.on('pointerdown', ()=> EventHandler.dispatch(eEventName.startSpin))
    }

    /** 初始化滾輪的遮罩 */
    private static initMask(){
        // ToDo 之後會直接拿滾輪底圖做遮罩大小
        switch(window['reelType']){
            case eReelType._3x5_reel:
                this.mask = this.reelContainer.addChild(new Graphics()
                    .beginFill(0xFFFFFF, .5).drawRect(-130, 165, 950, 480).endFill()
                )
            break

            case eReelType._3x5_single:
                this.mask = [
                    new Graphics().beginFill(0xFFFFFF, .5).drawRect(-130, 164, 950, 160).endFill(),      // 第一列
                    new Graphics().beginFill(0xFF3333, .5).drawRect(-130, 324, 950, 160).endFill(),     // 第二列
                    new Graphics().beginFill(0x33FF33, .5).drawRect(-130, 484, 950, 160).endFill(),     // 第三列
                ]
            break
        } 
    }

    /** 初始化得分時，蓋住沒得獎symbol 黑色的遮罩 */
    private static initBlackCover(){
        // ToDo 之後會由美術出圖
        this.blackCover = this.reelContainer.addChild(new Graphics()
            .beginFill(0x000000, .5).drawRect(-85, 165, 860, 480).endFill()
        )
        this.blackCover.zIndex = eReelContainerLayer.black
        EventHandler.on(eEventName.activeBlack, (ctx) =>{
            if(ctx.flag){
                this.reelContainer.addChild(this.blackCover)
            }else{
                this.blackCover.parent?.removeChild(this.blackCover)
            }
        })
        EventHandler.dispatch(eEventName.activeBlack, {flag: false})        // 一開始先隱藏
    }

    public static reset(type: eReelGameType){
        this.gameType = type
        this.setReelData(type)
        this.reelArr.map(reel => reel.reset())

        GameSceneManager.getSceneContainer().addChild(this.reelContainer)
        const maskArr: Array<Graphics> = !Array.isArray(this.mask)? [this.mask]: this.mask
        this.reelContainer.addChild(...maskArr)

        EventHandler.on(eEventName.orientationChange, this.resizeFn)
        this.resizeFn()
    }

    private static resize(){
        const {portrait} = config
        if(portrait){
            this.reelContainer.position.set(360, 640)
            this.reelContainer.scale.set(.8)
        }else{
            this.reelContainer.position.set(640, 360)
            this.reelContainer.scale.set(1)
        }
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
        this.reelArr.map(reel => reel.setAllBlur())
        
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
    public static setReelData(type: eReelGameType){
        this.reelArr.map(reel => reel.setReelData(type))
    }

    //#region 聽牌
    /**
     * 設定一般的聽牌
     * @param {...Array<number>} indexArr 要聽牌的輪
     */
    public static setListening(...indexArr: Array<number>){
        indexArr.map(index => this.reelArr[index].setListening(eListeningState.normal))
    }

    /**
     * 設定特殊聽牌
     * @param {Array<number>} indexArr 要聽牌的輪
     */
    public static setSpecialListening(...indexArr: Array<number>){
        indexArr.map(index => this.reelArr[index].setListening(eListeningState.special))
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

export class SymbolController{

    private static reelArr: Array<Reel>

    public static init(reelArr: Array<Reel>){
        this.reelArr = reelArr
    }

    public static async playWinAnimation(reelIndex: number, symbolIndex: number, times: number = 1){
        await this.reelArr[reelIndex].DownSymbol[symbolIndex].playWinAnimation(times)
    }

    public static clearWinAnimation(reelIndex: number, symbolIndex: number){
        this.reelArr[reelIndex].DownSymbol[symbolIndex].clearWinAnimation()
    }

    public static clearAllWinAnimation(){
        this.reelArr.map(reel => reel.DownSymbol.map(symbol => symbol.clearWinAnimation()))
    }
}