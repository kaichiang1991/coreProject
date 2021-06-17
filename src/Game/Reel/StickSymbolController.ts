import StickSymbol from "./StickSymbol"
import { eSymbolName } from "./SymbolDef"

export default class StickSymbolController{

    private static readonly MAX_STICK_COUNT: number = 15
    private static allStickArr: Array<StickSymbol>          // 所有 stickSymbol 存放的地方 (未使用)
    private static usedStickArr: Array<StickSymbol>         // 在使用中的 StickSymbol 

    /** 初始化 stickSymbol */
    public static init(){
        this.allStickArr = Array(this.MAX_STICK_COUNT).fill(1).map(_ => new StickSymbol())
        this.usedStickArr = new Array<StickSymbol>()
    }

    /**
     * 播放 StickSymbol
     * @param {number} reelIndex 第幾列
     * @param {number} symbolIndex 第幾行
     * @param {eSymbolName} symbolId symbol ID
     * @returns {StickSymbol}
     */
    public static playStick(reelIndex: number, symbolIndex: number, symbolId: eSymbolName): StickSymbol{
        const id: string = StickSymbol.calcID(reelIndex, symbolIndex)
        // 檢查有沒有在使用中
        let symbol: StickSymbol = this.getUsedStick(id)
        if(symbol)  return symbol

        // 從庫存的陣列中取出一個使用
        symbol = this.allStickArr.pop().play(id, symbolId)
        this.usedStickArr.push(symbol)
        return symbol
    }

    /**
     * 回收使用中的 StickSymbol
     * @param {StickSymbol} stick 要回收的 StickSymbol
     */
    public static recycleStick(stick: StickSymbol){
        if(!this.getUsedStick(stick.ID)){
            Debug.warn('StickSymbolController: recycle fail', stick.ID)
            return
        }

        stick.reset()
        this.allStickArr.push(...this.usedStickArr.splice(this.usedStickArr.indexOf(stick), 1))
    }

    /** 回收所有使用中的 StickSymbol */
    public static clearAll(){
        this.usedStickArr.slice().map(stick => this.recycleStick(stick))
    }

    /**
     * 取得使用中的 StickSymbol
     * @param {string} id StickSymbol 的 ID
     * @returns {StickSymbol} 使用中的 StickSymbol 或 undefind
     */
    public static getUsedStick(id: string): StickSymbol{
        return this.usedStickArr.find(use => use.ID == id)
    }
}