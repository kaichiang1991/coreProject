import { Container, Graphics, Text, TextStyle } from "pixi.js-legacy";
import { eSymbolConfig, xOffsetArr, yOffsetArr } from "./SymbolDef";
const {AssetLoader, Sprite} = PixiAsset

const colorDef: {[key: number]: {'border': number, 'inner': number}} = {
    0: {border: 0xEEEEEE, inner: 0x000033},
    1: {border: 0xEEEEEE, inner: 0x003300},
    2: {border: 0xEEEEEE, inner: 0x330000},
}

export default class Symbol extends Container{

    private text: Text
    private rstText: Text
    private sprite: PixiAsset.Sprite
    private graphic: Graphics
    private isResult: boolean

    private symbolId: number
    public get SymbolID(): number {return this.symbolId}

    constructor(){
        super()
       
        this.graphic = this.addChild(new Graphics())
        this.sprite = this.addChild(new Sprite('N1'))
        this.sprite.anchor.set(.5)

        const style: TextStyle = new TextStyle({
            fontSize: 32,
            fill: 'white',
            fontFamily: 'bolder'
        })
        this.text = this.addChild(new Text('1', style))
        this.text.anchor.set(.5)

        this.rstText = this.addChild(new Text('', {...style, fill: 'yellow'}))
        this.rstText.y = 25
        this.rstText.anchor.set(.5)
    }

    public init(reelIndex: number, symbolIndex: number): Symbol{
        const {border, inner} = colorDef[symbolIndex % 3]
        this.graphic.clear()
        .lineStyle(2, border).beginFill(inner)
        .drawRect(-eSymbolConfig.width / 2, -eSymbolConfig.height / 2, eSymbolConfig.width, eSymbolConfig.height)
        .endFill()

        this.setIndex(symbolIndex)
        this.position.set(xOffsetArr[reelIndex], yOffsetArr[symbolIndex])

        return this
    }

    public setTexture(index: number){
        this.symbolId = index
        this.sprite.texture = AssetLoader.getTexture(this.getTextureName(index))
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

    private getTextureName(index: number): string{
        return 'N' + index
    }
}