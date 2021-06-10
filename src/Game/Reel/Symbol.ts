import { eSpineName } from "@root/src/System/Assets/GameSpineManager";
import { eReelContainerLayer } from "@root/src/System/LayerDef";
import { Container, Graphics, Text, TextStyle } from "pixi.js-legacy";
import { eSymbolConfig, eSymbolName, eSymbolState, xOffsetArr, yOffsetArr } from "./SymbolDef";
const {AssetLoader, Sprite, Spine} = PixiAsset

const colorDef: {[key: number]: {'border': number, 'inner': number}} = {
    0: {border: 0xEEEEEE, inner: 0x000033},
    1: {border: 0xEEEEEE, inner: 0x003300},
    2: {border: 0xEEEEEE, inner: 0x330000},
}

export default class Symbol extends Container{

    private text: Text
    private rstText: Text
    private sprite: Sprite
    private animSpine: Spine
    // private graphic: Graphics

    private symbolId: eSymbolName
    public get SymbolID(): number {return this.symbolId}

    private useMask: Container

    constructor(){
        super()
       
        // this.graphic = this.addChild(new Graphics())
        this.sprite = this.addChild(new Sprite('N1'))
        this.sprite.anchor.set(.5)

        const style: TextStyle = new TextStyle({
            fontSize: 48,
            fontWeight: 'bold',
            stroke: 'black',
            strokeThickness: 2,
            fill: 'white',
            fontFamily: 'bolder'
        })
        this.text = this.addChild(new Text('1', style))
        this.text.anchor.set(.5)

        this.rstText = this.addChild(new Text('', {...style, fill: 'yellow'}))
        this.rstText.y = 25
        this.rstText.anchor.set(.5)

        this.animSpine = Spine.playSpine(eSpineName.symbol)[0]
    }

    public init(reelIndex: number, symbolIndex: number): Symbol{
        const {border, inner} = colorDef[symbolIndex % 3]
        // this.graphic.clear()
        // .lineStyle(2, border).beginFill(inner)
        // .drawRect(-eSymbolConfig.width / 2, -eSymbolConfig.height / 2, eSymbolConfig.width, eSymbolConfig.height)
        // .endFill()

        this.setIndex(symbolIndex)
        this.position.set(xOffsetArr[reelIndex], yOffsetArr[symbolIndex])
        this.zIndex = eReelContainerLayer.normalSymbol
        return this
    }

    public setUseMask(mask: Container){
        this.useMask = mask
    }

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
        this.sprite.texture = AssetLoader.getTexture(this.getTextureName(this.symbolId, state))
    }

    /**
     * 播放得獎動畫
     * @param times 次書
     */
    public async playWinAnimation(times: number){
        return new Promise<void>(res =>{

            this.zIndex = eReelContainerLayer.winAnimation
            this.sprite.visible = false         // 隱藏底下的 symbol 單圖
            this.activeMask(false)
            this.addChild(this.animSpine)
            const track = this.animSpine.setAnimation(this.getAnimName(this.symbolId), true)
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
        this.animSpine.setEmptyAnimations()
        this.animSpine.parent?.removeChild(this.animSpine)
        this.sprite.visible = true      // 顯示底下的 symbol
        this.zIndex = eReelContainerLayer.normalSymbol
        this.activeMask(true)
    }

    public setIndex(index: number){
        this.text.text = index + ''
    }

    public setCorrectReelData(index: number){
        this.rstText.text = 'correct_' + index
    }

    public setResult(res: string){
        this.rstText.text = res
    }

    /**
     * 取得一般滾輪貼圖名稱
     * @param symbolId symbol ID
     * @param state symbol 狀態
     * @returns {string}
     */
    private getTextureName(symbolId: eSymbolName, state: eSymbolState): string{
        return eSymbolName[symbolId] + '_0' + state + '.png'
    }

    /**
     * 取得動畫名稱
     * @param symbolId 
     * @param {eSymbolState} [state = eSymbolState.Win] 狀態
     * @returns {string}
     */
    private getAnimName(symbolId: eSymbolName, state: eSymbolState = eSymbolState.Win): string{
        return eSymbolName[symbolId] + '_' + eSymbolState[state]
    }
}