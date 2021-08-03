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
import FreeGameNumberManager from "@root/src/Game/Number/FreeGameNumberManager";

const {AssetLoader} = PixiAsset

export default class GameAssetManager{

    private static pngList: {[key: string]: string} = {     // 單圖的檔案名稱
        'Scene_NG': 'img/Scene_NG.png',
        'Scene_FG': 'img/Scene_FG.png',
    }

    private static spriteSheetList: {[key: string]: string} = {     // 圖集
        'symbolSprite': 'img/Symbol.json',
        'game': 'img/Game.json',
        'line': 'img/Line.json'
    }

    /** 設定多語系 */
    public static setLanguage(){
        // this.pngList = {...this.pngList, 
        //     // 'UITxt': 'img/' + LocalizationManager.getFolder() + '/UITxt.png', 
        // }
        this.spriteSheetList = {...this.spriteSheetList, 
            'word': 'img/' + LocalizationManager.getFolder() + '/Word.json'
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

        await GameSpineManager.init()               // spine 的初始化
        await GameFontManager.init()                // font  的初始化
        await GameAudioManager.init()               // audio 的初始化
        await GameParticleManager.init()            // particles 的初始化
        await this.loadDone()
    }

    /** 讀取完畢後 */
    private static async loadDone(){
        // 初始化 BetModel
        const {SlotInitData: {MoneyFractionMultiple, Denom, BetUnit, BetMultiples, Line}, JoinGameData: {Balance}} = GameSlotData
        BetModel.init(BetUnit, BetMultiples, Balance, MoneyFractionMultiple, Denom, gameConfig.LineGame, Line)

        MathTool.init(BetModel)
        await BigWinManager.init(App, config, [20, 50, 100, 200], 
            {level: eBigWinType.hugeWin, function: ()=> AutoSpinListUIManager.WinSwitch && SlotUIManager.activeAuto(false)},
            {
                pauseMusic: GameAudioManager.pauseCurrentMusic.bind(GameAudioManager), 
                resumeMusic: GameAudioManager.resumeCurrentMusic.bind(GameAudioManager),
                playAudio: GameAudioManager.playAudioEffect.bind(GameAudioManager), 
                stopAudio: GameAudioManager.stopAudioEffect.bind(GameAudioManager)
            }
        )   // ToDo 之後可能從 server 拿間隔

        await ReelController.init()
        await StickSymbolController.init()
    
        await LineManager.init()
        await LineNumberManager.init()
        await FreeGameNumberManager.init()

        GameSpineManager.initScene()
        GameSpineManager.initCharacter()
    }
}