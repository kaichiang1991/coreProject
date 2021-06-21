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

    constructor(){
        super()

        this.sprite = this.addChild(new Sprite(this.getTextureName(eSymbolName.H1, eSymbolState.Normal)))
        this.sprite.anchor.set(.5)
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

    /** 根據狀態設定圖層 */
    protected setLayer(){
        this.zIndex = this.state == eSymbolState.Win? eReelContainerLayer.winAnimation: eReelContainerLayer.stickSymbol
    }

    /** 重設stickSymbol */
    public reset(){
        this.id = null
        this.parent?.removeChild(this)
    }
}