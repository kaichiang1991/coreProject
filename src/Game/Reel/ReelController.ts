import GameSceneManager from "@root/src/System/GameSceneController";
import { Container, Graphics } from "pixi.js-legacy";
import {size} from '@root/config'
import Reel from "./Reel";
import spinConfigUrl from './spinConfig.json'
import { reelCount } from "./SymbolDef";
import gsap from "gsap/all";

interface ISpinConfig{
    upDistance: number
    upDuration: number
    spinSpeed: number
    forceStopSpeed: number      // 急停的速度
    bounceDistance: number
    bounceBackDuration: number  // 回拉的時間
    eachReelStop: number
    extraSymbolCount: number    // 結尾要接回去的滾輪表個數
}

export let spinConfig: ISpinConfig 

export default class ReelController{

    private static reelContainer: Container
    public static get ReelContainer(): Container {return this.reelContainer}
    private static reelArr: Array<Reel>
    private static mask: Graphics

    // 急停
    private static toStopNow: boolean
    private static stopNowEvent: Function
    public static get StopNowEvent(): Function {return this.stopNowEvent}       // 急停事件

    private static delayCallArr: Array<gsap.core.Tween>

    /** 初始化滾輪控制 */
    public static async init(){

        // 讀取滾輪參數的 json 檔
        await new Promise<void>(res =>{
            PIXI.Loader.shared.add('spinConfig', spinConfigUrl).load((_, resource) =>{
                spinConfig = resource['spinConfig'].data
                res()
            })
        }) 
        
        this.reelContainer = new Container()
        this.mask = this.reelContainer.addChild(new Graphics()
            .beginFill(0x333333, .5).drawRect(-110, 0, 720, 300).endFill()
        )
        this.reelContainer.name = 'reel container'
        this.reelContainer.pivot.set(250, 150)
        this.reelContainer.position.set(size.width / 2, 525)

        this.reelContainer.mask = this.mask
        GameSceneManager.getSceneContainer().addChild(this.reelContainer)

        this.reelArr = Array(reelCount).fill(1).map((_, index) => new Reel().init(index))
        this.setReelData()
        this.reelArr.map(reel => reel.reset())

        this.stopNowEvent = ()=>{
            if(this.toStopNow)  return
            
            this.toStopNow = true
            this.delayCallArr?.forEach(tween => tween.kill())
            
            this.reelArr.map((reel, index) =>{
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

    /**
     * 開始滾動
     * @returns 全部停輪後會回傳
     */
    public static async startSpin(){
        this.toStopNow = false      // 是否急停
        const [...setStartArr] = this.reelArr.map(reel => reel.setStartSpin())
        await Promise.all(setStartArr.map(arr => arr[0]))       // 等待都往上拉之後

        let detlaRatio: number
        const tickerEvent: gsap.TickerCallback = () =>{
            detlaRatio = gsap.ticker.deltaRatio()
            this.reelArr.map(reel => reel.spinEvent(detlaRatio))
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

        const delayArr: Array<number> = this.calcDelay()        // 計算停輪延遲時間
        this.delayCallArr = this.reelArr.map((reel, index) => gsap.delayedCall(delayArr[index], ()=> reel.stopSpin()))
    }

    /**
     * 計算每一輪停輪的延遲時間
     * @returns {Array<number>} 時間陣列 (s)
     */
    private static calcDelay(): Array<number>{
        return this.reelArr.map((reel, index) => index * spinConfig.eachReelStop)
    }

    /**
     * 判斷上一輪是否已經開始停輪
     * @param index 
     * @returns 
     */
    public static isLastReelCanStop(index: number): boolean{
        return index == 0? true: this.reelArr[index - 1].CanStop
    }

    /**
     * 設定滾輪表
     */
    public static setReelData(){
        this.reelArr.map(reel => reel.setReelData())
    }
}