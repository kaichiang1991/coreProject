import { App, gameConfig } from "../..";
import lazyLoad from "../../Tool/lazyLoad";
import config from '@root/config'
import GameAudioManager from "./GameAudioManager";
import GameFontManager from "./GameFontManager";
import GameSpineManager from "./GameSpineManager";
import ReelController from "@root/src/Game/Reel/ReelController";
import GameParticleManager from "./GameParticleManager";
import LineNumberManager from "@root/src/Game/Number/LineNumberManager";
import { LineManager } from "@root/src/Game/Win/LineManager";
import StickSymbolController from "@root/src/Game/Reel/StickSymbolController";
import GameSlotData from "@root/src/Game/GameSlotData";

const {AssetLoader} = PixiAsset

export default class GameAssetManager{

    private static pngList: {[key: string]: string} = {     // 單圖的檔案名稱
        // 'Button': 'img/Button.png',
        'logo': 'img/logo.png',
    }

    private static spriteSheetList: {[key: string]: string} = {     // 圖集
        'symbolSprite': 'img/Symbol.json'
    }

    public static setLanguage(){
        this.pngList = {...this.pngList, 
            // 'UITxt': 'img/' + LocalizationManager.getFolder() + '/UITxt.png', 
        }
        this.spriteSheetList = {...this.spriteSheetList, 
        
        }        
    }

    public static init(){
        AssetLoader.init(App)
        this.setLanguage()
        GameSpineManager.setLanguage()
    }

    public static async loadAsset(){

        const {canUseWebp} = config
        // 圖片的引入
        const [...sources] = await lazyLoad(Object.values(this.pngList).map(path => canUseWebp? pathConvert(path): path))
        await AssetLoader.loadAsset(Object.keys(this.pngList).map((name, index) => ({
            name, type: eAssetType.img, source: sources[index]
        })))

        // 圖集的引入
        const [...spriteSheetSources] = await lazyLoad(Object.values(this.spriteSheetList).map(path => canUseWebp? pathConvert(path): path))
        await AssetLoader.loadAsset(Object.keys(this.spriteSheetList).map((name, index) => ({
            name, type: eAssetType.spriteSheet, source: spriteSheetSources[index]
        })))

        await GameSpineManager.init()               // spine 的引入
        await GameFontManager.init()                // font 的引入
        await GameAudioManager.init()               // audio 的引入
        await GameParticleManager.init()            // particles 的引入
        await this.loadDone()
    }

    private static async loadDone(){
        // 初始化 BetModel
        const {SlotInitData: {MoneyFractionMultiple, Denom, BetUnit, BetMultiples, Line}, JoinGameData: {Balance}} = GameSlotData
        if(window.useServerData)
            BetModel.init(BetUnit, BetMultiples, Balance, MoneyFractionMultiple, Denom, gameConfig.LineGame? Line: undefined)
        else    // ToDo
            BetModel.init(1000, [1,2, 5, 10, 25, 50, 100], 1000000, 1000, 100, 3)

        MathTool.init(BetModel)

        await ReelController.init()
        await StickSymbolController.init()
    
        await LineManager.init()
        await LineNumberManager.init()

        GameSpineManager.initLine()
    }
}