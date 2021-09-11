import { eSpineName } from "@root/src/System/Assets/GameSpineManager";
import { eReelContainerLayer } from "@root/src/System/LayerDef";
import { Container, Text, TextStyle } from "pixi.js-legacy";
import { endSpinSymbolArr, eSymbolConfig, eSymbolLayer, eSymbolName, eSymbolState, mapColumnIndex, mapRowIndex, noBlurSymbolArr, upperStickSymbolArr, xOffsetArr, yOffsetArr } from "./SymbolDef";
const {AssetLoader, Sprite, Spine} = PixiAsset

export default class Symbol extends Container{

    private reelIndex: number
    private symbolIndex: number     // 在 symbolArr 中是第幾顆

    private text: Text
    protected sprite: Sprite
    protected animSpine: Spine

    protected symbolId: eSymbolName
    public get SymbolID(): number {return this.symbolId}
    protected state: eSymbolState         // 紀錄目前 symbol 的狀態
    public get State(): eSymbolState {return this.state}

    private useMask: Container          // 使用的遮罩

    constructor(){
        super()
       
        this.sprite = this.addChild(new Sprite(this.getTextureName(eSymbolName.H1, eSymbolState.Normal)))
        this.sprite.anchor.set(.5)

        // const style: TextStyle = new TextStyle({
        //     fontSize: 48,
        //     fontWeight: 'bold',
        //     stroke: 'black',
        //     strokeThickness: 2,
        //     fill: 'white',
        //     fontFamily: 'bolder'
        // })
        // this.text = this.addChild(new Text('1', style))
        // this.text.anchor.set(.5)

        this.animSpine = Spine.playSpine(eSpineName.Symbol)[0]
    }

    /**
     * 初始化 symbol
     * @param reelIndex 第幾軸
     * @param symbolIndex 第幾顆
     * @returns 
     */
    public init(reelIndex: number, symbolIndex: number): Symbol{
        this.setIndex(symbolIndex)
        this.position.set(xOffsetArr[mapColumnIndex(reelIndex)], yOffsetArr[mapRowIndex(reelIndex)][symbolIndex])
        this.reelIndex = reelIndex
        return this
    }

    /**
     * 設定該 symbol 要使用的遮罩
     * @param mask 遮罩
     */
    public setUseMask(mask: Container){
        this.useMask = mask
    }

    /**
     * 啟用遮罩
     * @param flag 開關
     */
    public activeMask(flag: boolean){
        if(!this.useMask){
            Debug.warn('activeMask, no mask', flag)
            return
        }

        if(flag){
            this.sprite.mask = this.useMask
        }else{
            // 預防設定 mask = null 時，會有一瞬間renderable = true 的情形 (多個 container 共用 mask 的情況)
            const tmp: Container = this.mask as Container
            this.mask = null
            tmp && (tmp.renderable = false)
        }
    }

    /**
     * 設定symbol貼圖
     * @param {eSymbolName} symbolId 符號ID，若為null則只改變貼圖，不更動symbolId
     * @param {eSymbolState} [state = eSymbolState.Normal] 貼圖狀態
     */
    public setTexture(symbolId: eSymbolName, state: eSymbolState.Normal | eSymbolState.Blur = eSymbolState.Normal){
        if(symbolId != null){          
            this.symbolId = symbolId
        }

        this.state = state
        this.sprite.texture = AssetLoader.getTexture(this.getTextureName(this.symbolId, this.state))
        this.setLayer()
    }

    /** 根據狀態設定圖層 */
    public setLayer(){
        this.zIndex = 
            this.state == eSymbolState.Win? eReelContainerLayer.winAnimation:                   // 得獎演出
            this.state == eSymbolState.EndSpin? eReelContainerLayer.endSpinAnim:                // 落定演出
            upperStickSymbolArr.includes(this.symbolId)? eReelContainerLayer.upperStickSymbol:  // 滾動中要在 stick 上面的符號 (一般來說是 FG)
            this.getNormalLayer()                                                               // 一般 / 模糊 
    }

    /**
     * 取得 模糊/一般 狀態的圖層
     * @returns 
     */
     private getNormalLayer(): number{
        return this.state == eSymbolState.Blur? eReelContainerLayer.normalSymbol + this.symbolIndex:    // 模糊
        eReelContainerLayer.normalSymbol + 
        (this.symbolId == eSymbolName.FG? eSymbolLayer.FG:
        this.symbolId == eSymbolName.WD? eSymbolLayer.WD:
        eSymbolLayer.others) * this.reelIndex + this.symbolIndex
    }

    public setIndex(index: number){
        this.symbolIndex = index
        // this.text.text = index + ''
    }

    //#region 得獎動畫
    /**
     * 播放得獎動畫
     * @param times 次書
     */
    public async playWinAnimation(times: number){
        return new Promise<void>(res =>{

            this.state = eSymbolState.Win
            this.setLayer()
            this.sprite.visible = false         // 隱藏底下的 symbol 單圖
            this.activeMask(false)
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
        this.sprite.visible = true      // 顯示底下的 symbol
        this.setLayer()
        this.activeMask(true)
    }

    //#endregion

    //#region 落定動畫
    /**
     * 播放落定動畫
     * 若沒有落定動畫，則自動跳過
     */
    public async playEndSpinAnim(){
        if(!endSpinSymbolArr.includes(this.symbolId))
            return

        // 之後再考慮會不會有 沒有落定動畫，卻 要顯示在上層的symbol
        this.state = eSymbolState.EndSpin
        this.setLayer()
        this.sprite.visible = false         // 隱藏底下的 symbol 單圖
        this.activeMask(false)
        this.addChild(this.animSpine)
        await waitTrackComplete(this.animSpine.setAnimation(this.getAnimName(this.symbolId, this.state), false))      
        this.clearEndSpinAnim()
    }

    /**
     * 清除落定動畫，播一次落定動畫後自動呼叫
     */
    public clearEndSpinAnim(){
        this.state = eSymbolState.Normal
        this.animSpine.setEmptyAnimations()
        this.animSpine.parent?.removeChild(this.animSpine)
        this.sprite.visible = true      // 顯示底下的 symbol
        // this.setLayer()              // 結束後圖層先不拉回來，等下一次開始轉動在拉
        // this.activeMask(true)        // 結束後遮罩先不蓋回來，等下一次開始轉動在蓋
    }
    //#endregion

    //#region 其他功能
    /**
     * 取得一般滾輪貼圖名稱
     * @param symbolId symbol ID
     * @param state symbol 狀態
     * @returns {string}
     */
    protected getTextureName(symbolId: eSymbolName, state: eSymbolState): string{
        return eSymbolName[symbolId] + ((state == eSymbolState.Blur && !noBlurSymbolArr.includes(symbolId))? '_Blur': '_Normal') + '.png'
    }

    /**
     * 取得動畫名稱
     * @param symbolId 
     * @param {eSymbolState} [state = eSymbolState.Win] 狀態
     * @returns {string}
     */
    protected getAnimName(symbolId: eSymbolName, state: eSymbolState): string{
        return eSymbolName[symbolId] + '_' + eSymbolState[state]
    }
    //#endregion
}