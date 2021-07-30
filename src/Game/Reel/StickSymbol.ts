import GameSpineManager from "@root/src/System/Assets/GameSpineManager";
import { eReelContainerLayer } from "@root/src/System/LayerDef";
import ReelController from "./ReelController";
import Symbol from "./Symbol";
import { eSymbolName, eSymbolState, mapColumnIndex, mapRowIndex, xOffsetArr, yOffsetArr } from "./SymbolDef";
const {AssetLoader, Sprite, Spine} = PixiAsset

export default class StickSymbol extends Symbol{

    /**
     * 透過 reelIndex, symbolIndex 計算 ID
     * @param reelIndex 
     * @param symbolIndex 
     * @returns {string}
     */
    public static calcID(reelIndex: number, symbolIndex: number): string{
        return 'reel' + reelIndex + '_symbol' + symbolIndex
    }

    /**
     * 解析 id 去獲得 reelIndex, symbolIndex
     * @returns {[number, number]} [reelIndex, symbolIndex]
     */
    public static parseID(id: string): [number, number]{
        const result: RegExpExecArray = /reel(\d*)_symbol(\d*)/.exec(id)
        return [+result[1], +result[2]]
    }

    private id: string
    public get ID(): string { return this.id }

    private WD_Spine: Spine     // 特例，stick WD 符號的動畫內沒有得獎動畫

    constructor(){
        super()

        this.WD_Spine = this.addChild(GameSpineManager.playStick())
        this.reset()
    }

    /**
     * 播放 stickSymbol
     * @param {string} id ID 字串
     * @param {eSymbolName} symbolId symbolID
     * @param {eSymbolState.Normal | eSymbolState.Blur} state symbol狀態
     * @returns {StickSymbol} StickSymbol
     */
    public play(id: string, symbolId: eSymbolName, state: eSymbolState.Normal | eSymbolState.Blur = eSymbolState.Normal): StickSymbol{
        this.reset()

        this.id = id
        super.setTexture(symbolId, state)

        const [reelIndex, symbolIndex] = StickSymbol.parseID(this.id)
        this.position.set(xOffsetArr[mapColumnIndex(reelIndex)], yOffsetArr[mapRowIndex(reelIndex)][symbolIndex+1])

        this.setLayer()
        ReelController.ReelContainer.addChild(this)
        return this
    }

    /**
     * 播放 stick WD 跳出的動畫，並接著播 loop
     * @param {string} id ID
     * @param {number} delay 延遲的播放時間
     * @returns {[StickSymbol, Promise<void>]} [符號本身，跳出動畫演完]
     */
    public async playWD(id: string, delay: number): Promise<[StickSymbol, Promise<void>]>{
        this.reset()

        await Sleep(delay)
        this.zIndex = eReelContainerLayer.winAnimation      // 為了演出在 upperStick 上面
        this.id = id
        this.symbolId = eSymbolName.WD
        const track = this.WD_Spine.setAnimation('WD_In')

        const [reelIndex, symbolIndex] = StickSymbol.parseID(this.id)
        this.position.set(xOffsetArr[mapColumnIndex(reelIndex)], yOffsetArr[mapRowIndex(reelIndex)][symbolIndex+1])
        
        this.addChild(this.WD_Spine)
        ReelController.ReelContainer.addChild(this)
        return [this, waitTrackComplete(track)]
    }

    /**
     * 播放 stick WD loop
     * @returns {StickSymbol}
     */
    public playWDLoop(): StickSymbol{
        this.WD_Spine.addAnimation('WD_Loop', true)
        return this
    }

    /**
     * 播放得獎動畫
     * @param times 次數 
     */
    public async playWinAnimation(times: number){
        return new Promise<void>(res =>{
            this.state = eSymbolState.Win
            this.setLayer()
            this.sprite.visible = false         // 隱藏底下的 symbol 單圖
            // this.activeMask(false)
            this.addChild(this.animSpine)
            const track = this.animSpine.setAnimation(this.getAnimName(this.symbolId, this.state), true)
            let count: number = 0
            track.listener = { ...track.listener, 
                complete: ()=>{
                    if(++count == times){
                        res()
                    }
                }
            }
        })
    }

    /** 清除得獎動畫 */
    public clearWinAnimation(){
        this.state = eSymbolState.Normal
        this.animSpine.setEmptyAnimations()
        this.animSpine.parent?.removeChild(this.animSpine)
        // this.sprite.visible = true      // 顯示底下的 symbol
        this.setLayer()
        // this.activeMask(true)
    }

    /** 根據狀態設定圖層 */
    public setLayer(){
        this.zIndex = this.state == eSymbolState.Win? eReelContainerLayer.winAnimation: eReelContainerLayer.stickSymbol
    }

    /** 重設stickSymbol */
    public reset(){
        this.id = null
        this.symbolId = null

        this.animSpine.setEmptyAnimations()
        this.WD_Spine.setEmptyAnimations()
        this.removeChild(this.sprite, this.animSpine, this.WD_Spine)
        this.parent?.removeChild(this)
    }
}