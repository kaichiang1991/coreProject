import GameSceneManager from "@root/src/System/GameSceneController";
import { Point } from "pixi.js-legacy";
import Reel, { eListeningState } from "./Reel";
import { reelCount, defaultStopOrder, reelContPivot, eSymbolName, eSymbolState, reelContPos_land, reelContPos_port } from "./SymbolDef";
import { editConfig, eGameEventName } from "@root/src";
import config from '@root/config'
import { eFGLayer, eNGLayer, eReelContainerLayer } from "@root/src/System/LayerDef";
import { eReelType } from "@root/globalDef";
import Symbol from './Symbol'
import StickSymbolController from "./StickSymbolController";
import StickSymbol from "./StickSymbol";

export enum eReelGameType{
    normalGame = 0,
    freeGame = 50
}

export let spinConfig: ISpinConfig

const {Container, Graphics, Sprite} = PixiAsset

export default class ReelController{

    private static gameType: eReelGameType      // 目前遊戲的型態

    private static reelContainer: Container
    public static get ReelContainer(): Container {return this.reelContainer}
    private static reelBackground: Sprite
    private static reelFrame: Sprite
    private static reelArr: Array<Reel>
    private static mask: Sprite | Array<Sprite>
    public static get Mask(): Sprite | Array<Sprite> {return this.mask}
    private static blackCover: Sprite

    private static stopOrder: Array<number>

    // 急停
    private static toStopNow: boolean
    private static stopNowEvent: Function
    public static get StopNowEvent(): Function {return this.stopNowEvent}       // 急停事件

    private static resizeFn: IEventCallback

    // 聽牌
    private static FG_audioArr: Array<boolean>
    public static get FG_AudioArr(): Array<boolean> {return this.FG_audioArr.slice()}

    /** 初始化滾輪控制 */
    public static async init(){
        spinConfig = editConfig.spin        // 讀取滾輪參數的 json 檔

        this.initReelContainer()
        this.initReelBackground()
        this.initReelFrame()
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
        (this.resizeFn = EventHandler.on(eEventName.orientationChange, ()=> {
            const {portrait} = config
            if(portrait){
                reelContPos_port.copyTo(this.reelContainer.position)
                this.reelContainer.scale.set(window.reelContScale)
            }else{
                reelContPos_land.copyTo(this.reelContainer.position)
                this.reelContainer.scale.set(1)
            }
        }))()
    }

    /** 初始化滾輪的容器，方便之後縮放 */
    private static initReelContainer(){
        this.reelContainer = new Container('reel container')
        this.reelContainer.sortableChildren = true
        this.reelContainer.pivot.copyFrom(reelContPivot)
    }

    /** 初始化滾輪底板 */
    private static initReelBackground(){
        this.reelBackground = this.reelContainer.addChild(new Sprite('Reel_Back.png'))
        this.reelBackground.zIndex = eReelContainerLayer.reelBg
        this.reelBackground.position.copyFrom(window.reelBgPos)
        // 點擊事件寫在底板上
        this.reelBackground.buttonMode = this.reelBackground.interactive = true
        this.reelBackground.on('pointerdown', ()=> EventHandler.dispatch(eEventName.startSpin))
    }

    /** 初始化滾輪框 */
    private static initReelFrame(){
        this.reelFrame = this.reelContainer.addChild(new Sprite('Reel_Frame.png'))
        this.reelFrame.zIndex = eReelContainerLayer.reelFrame
        this.reelFrame.position.copyFrom(window.reelFramePos)
    }

    /** 初始化滾輪的遮罩 */
    private static initMask(){
        // ToDo 之後會直接拿滾輪底圖做遮罩大小
        switch(window.reelType){
            case eReelType._3x5_reel:
                // this.mask = this.reelContainer.addChild(new Graphics()
                //     .beginFill(0xFFFFFF, .5).drawRect(-40, 0, 950, 480).endFill()
                // )
            break

            case eReelType._3x5_single:
                // this.mask = [
                //     new Graphics().beginFill(0xFFFFFF, .5).drawRect(-40, 0, 950, 160).endFill(),     // 第一列
                //     new Graphics().beginFill(0xFFFFFF, .5).drawRect(-40, 160, 950, 160).endFill(),     // 第一列
                //     new Graphics().beginFill(0xFF3333, .5).drawRect(-40, 320, 950, 160).endFill(),     // 第二列
                // ]
            break

            case eReelType._3x3_reel:
                this.mask = this.reelContainer.addChild(new Sprite('Reel_Mask.png'))
                this.mask.position.copyFrom(window.reelMaskPos)
            break
        } 
    }

    /** 初始化得分時，蓋住沒得獎symbol 黑色的遮罩 */
    private static initBlackCover(){
        this.blackCover = this.reelContainer.addChild(new Sprite('Reel_Mask.png'))
        this.blackCover.tint = 0x000000                 // 美術出白色，方便遮罩也可以用
        this.blackCover.zIndex = eReelContainerLayer.black
        this.blackCover.name = 'blackCover'
        this.blackCover.position.copyFrom(window.reelMaskPos)
        this.blackCover.alpha = .5
        
        EventHandler.on(eGameEventName.activeBlackCover, (ctx) =>{
            if(ctx.flag){
                this.reelContainer.addChild(this.blackCover)
            }else{
                this.blackCover.parent?.removeChild(this.blackCover)
            }
        })
        EventHandler.dispatch(eGameEventName.activeBlackCover, {flag: false})        // 一開始先隱藏
    }

    /**
     * 重設滾輪
     * 1. 遊戲類型 (NG, FG)
     * 2. 滾輪表
     * 3. 遮罩, symbol
     * 4. 父節點
     * @param {eReelGameType} type 遊戲類型
     */
    public static reset(type: eReelGameType){
        this.gameType = type
        this.reelContainer.zIndex = type == eReelGameType.normalGame? eNGLayer.reelContainer: eFGLayer.reelContainer
        this.setReelData(type)
        this.reelArr.map(reel => reel.reset())

        GameSceneManager.getSceneContainer().addChild(this.reelContainer)
        const maskArr: Array<Sprite> = !Array.isArray(this.mask)? [this.mask]: this.mask
        this.reelContainer.addChild(...maskArr)
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
     * 檢查 FG 聽牌 (每款遊戲不一樣)
     * 若有聽牌則自動設定聽牌流程
     * @param {ISSlotSpinInfo} spinInfo 盤面資訊
     */
    public static checkFGListening(spinInfo: ISSlotSpinInfo){
        const {ScreenOrg} = spinInfo, symbol: eSymbolName = eSymbolName.FG
        // 紀錄該局FG落定音效的陣列
        this.FG_audioArr = ScreenOrg.map((_, index) =>  ScreenOrg.slice(0, index + 1).reduce((pre, curr) => pre && curr.includes(symbol), true))
        
        const count = ScreenOrg.slice(0, 2).filter(arr => arr.find(_symbol => _symbol == symbol)).length
        if(count < 2)
            return

        // 有聽牌
        this.setListening(2)
    }

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

    /**
     * 初始化 SymbolController
     * @param reelArr 滾輪的陣列
     */
    public static init(reelArr: Array<Reel>){
        this.reelArr = reelArr
    }

    /**
     * 取得 Symbol
     * @param {number} reelIndex 第幾輪
     * @param {number} symbolIndex 第幾顆
     * @returns {Symbol}
     */
    public static getSymbol(reelIndex: number, symbolIndex: number): Symbol{
        return this.reelArr[reelIndex].DownSymbol[symbolIndex]
    }

    //#region 得獎
    /**
     * 播放得獎動畫
     * @param reelIndex 第幾輪
     * @param symbolIndex 第幾顆
     * @param {number} [times = 1] 播放次數
     * @param {boolean} [playOrigin = false]    是否強制播放stick底下原來的symbol
     */
    public static async playWinAnimation(reelIndex: number, symbolIndex: number, times: number = 1, playOrigin: boolean = false){
        const stick: StickSymbol = StickSymbolController.getUsedStick(StickSymbol.calcID(reelIndex, symbolIndex))
        if(!playOrigin && stick){
            await stick.playWinAnimation(times)
        }else{
            await this.getSymbol(reelIndex, symbolIndex).playWinAnimation(times)
        }
    }

    /**
     * 清除得獎動畫
     * @param reelIndex 第幾輪
     * @param symbolIndex 第幾顆
     */
    public static clearWinAnimation(reelIndex: number, symbolIndex: number){
        const stick: StickSymbol = StickSymbolController.getUsedStick(StickSymbol.calcID(reelIndex, symbolIndex))
        if(stick?.State == eSymbolState.Win){
            stick.clearWinAnimation()
        }else{
            this.getSymbol(reelIndex, symbolIndex).clearWinAnimation()
        }
    }

    /** 清除所有播放中的得獎動畫 */
    public static clearAllWinAnimation(){
        this.reelArr.map((reel, reelIndex) => reel.DownSymbol.map((_, colIndex) => this.clearWinAnimation(reelIndex, colIndex)))
    }
    //#endregion 得獎

    //#region Stick
    public static async playFeatureStick(screenOutput: Array<Array<number>>){
        // 解析 output 中要變牌的位置座標
        const posArr: Array<Point> = screenOutput.map((reel, reelIndex) => reel.map((result, colIndex) => result == eSymbolName.WD? [reelIndex, colIndex].toString(): null)).reduce((pre, curr) => [...pre, ...curr.filter(str => str)] , [])
        .map(str => {const [x, y] = str.split(','); return new Point(+x, +y)})

        await Sleep(.7)
        await Promise.all(posArr.map(pos => StickSymbolController.playStick(pos.x, pos.y, eSymbolName.WD)))
    }

    /** 播放 FG stick 符號 */
    public static async playFGStick(){
        const stickArr: Array<StickSymbol> = new Array<StickSymbol>()
        const allPromise: Array<Promise<void>> = [new Point(1, 2), new Point(1, 1), new Point(1, 0)].map(async (pos, index) => {
            const [stick, promise] = await StickSymbolController.playStickWD(pos.x, pos.y, .5 * index)
            stickArr.push(stick)
            return promise
        })

        await Promise.all(allPromise)
        stickArr.map(stick => stick.playWDLoop().setLayer())
    }
    //#endregion Stick
}