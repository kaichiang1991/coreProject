declare enum eAssetType {
    img = 0,
    spriteSheet = 1,
    spine = 2
}
interface IAssetStruct {
    name: string;
    type: eAssetType;
    source: any;
}
declare namespace PixiAsset {
    class AssetLoader {
        private static loader;
        private static renderer;
        /**
         * 初始化 AssetLoader
         * @param App 要使用的 PIXI.Application
         */
        static init(App: PIXI.Application): void;
        /**
         * 讀取資源
         * @param {IAssetStruct | Array<IAssetStruct>} args 要讀取的資源
         * @returns 讀取完，預處理完之後回傳
         * @example
         * AssetLoader.loadAsset({
         *      name:
         *      type:
         *      source:
         * })
         */
        static loadAsset(args: IAssetStruct | Array<IAssetStruct>): Promise<void>;
        /**
         * 取得 resource
         * @param key 名稱
         * @returns 在 loader resource 裡的資源 （沒有則回傳 undefined)
         */
        static getAsset(key: string): PIXI.LoaderResource;
        /**
         * 取得在 TextureCache 裡面的貼圖
         * @param key 名稱
         * @returns 在 TextureCache 裡的資源 （沒有則回傳 undefined)
         */
        static getTexture(key: string): PIXI.Texture;
        /**
         * 處理加載完成的資源
         * @param type
         */
        private static parseAsset;
        /**
         * 檢查傳入的參數是否正確
         * @param arg
         * @returns
         */
        private static checkLoadArg;
    }
}
/** 動畫讀取的列表型態 */
interface IAnimSpriteList {
    [key: string]: {
        name: string;
        source: any;
        animName?: string | Array<string>;
    };
}
/** 序列圖的設定屬性 */
interface IAnimSpriteConfig {
    animSpeed?: number;
    loop?: boolean;
    autoPlay?: boolean;
}
declare namespace PixiAsset {
    class Sprite extends PIXI.Sprite {
        /**
         *
         * @param key 存在 TextureCache 內的貼圖名稱
         */
        constructor(key: string);
    }
    class AnimatedSprite extends PIXI.AnimatedSprite {
        private static animSpriteMap;
        /**
         * 初始化 Animated Sprite
         * 讀取至 loader，並初始化該動畫用到的圖片名稱
         * @param list
         * @example
         * AnimatedSprite.init({
         *      'key1': {
         *          name: /loader內的名稱/,
         *          source: /json 檔的位置/,
         *          animName: / 要指定的動畫名稱 /
         *      }
         * })
         */
        static init(list: IAnimSpriteList): Promise<void>;
        /**
         * 播放動畫
         * @param animName 動畫名稱
         * @param config 相關設定
         * @returns 動畫元件
         */
        static playAnimation(animName: string, config?: IAnimSpriteConfig): AnimatedSprite;
        /**
         * 單個 AnimatedSprite 的建構
         * @param {Array<string> | Array<PIXI.Texture> | Array<PIXI.AnimatedSprite.FrameObject>} textures 圖片名稱陣列 / 貼圖陣列 / 動畫結構陣列
         * @param autoUpdate
         */
        constructor(textures: Array<string> | Array<PIXI.Texture> | Array<PIXI.AnimatedSprite.FrameObject>, autoUpdate?: boolean);
    }
}
/** 傳入 Spine.init 的格式 */
interface ISpineList {
    [key: string]: string;
}
declare namespace PixiAsset {
    class Spine extends PIXI.spine.Spine {
        /**
         * 初始化會用到的 spine
         * @param lists
         * @example
         *  Spine.init({
         *      'key1': 'json path1',
         *      'key2': 'json path2'
         * })
         */
        static init(lists: ISpineList): Promise<void>;
        /**
         * 產生 spine
         * ToDo 看撥放動畫要不要分開做
         * @param name init時帶入的名稱
         * @returns
         */
        static playSpine(name: string): Spine;
        /**
         * @param name 載入的名稱
         */
        constructor(name: string);
    }
}
