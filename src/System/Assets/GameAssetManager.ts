import { App } from "../..";
import lazyLoad from "../../Tool/lazyLoad";
import config from '@root/config'
import pathConvert from "@root/src/Tool/pathConvert";

const {AssetLoader, Sprite, PixiSound} = PixiAsset

export default class GameAssetManager{

    private static pngList: {[key: string]: string} = {     // 單圖的檔案名稱
        'Button': 'img/Button.png',
    }

    private static spriteSheetList: {[key: string]: string} = {     // 圖集
        // 'Button': 'img/Button.json',
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

        // spine 的引入
        // font 的引入
        // audio 的引入
        const [...audioSources] = await lazyLoad('audio/BB.mp3')
        await PixiSound.init({
            'aa': audioSources[0]
        })
    }
}