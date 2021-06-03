/// <reference types="pixi-spine" />
declare enum eAssetType {
    img = 0,
    spriteSheet = 1,
    spine = 2,
    font = 3
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
declare namespace PixiAsset {
    class JSON {
        /**
         * 讀取 json 檔
         * @param path 路徑
         * @returns {any} 回傳 JSON 物件 ( 可以用 interface 接，方便使用)
         * @example
         *      interface IObj{
         *          a
         *      }
         *
         *      const obj: IObj = PixiAsset.JSON.getJson(path)
         */
        static getJson(path: string): Promise<any>;
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
         * @param key 存在 TextureCache 內的貼圖名稱
         */
        constructor(key?: string);
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
         * 播放 spine 動畫
         * @param name init 時帶入的名稱
         * @param animName 動畫名稱 ( 若沒有要播動畫，只是要創建spine，則不用帶)
         * @param loop 循環
         * @returns {[Spine, PIXI.spine.core.TrackEntry]}
         */
        static playSpine(name: string, animName?: string, loop?: boolean): [Spine, PIXI.spine.core.TrackEntry];
        /**
         * @param name 載入的名稱
         */
        constructor(name: string);
        /**
         * 設定第0軌播放動畫
         * @param animName 動畫名稱
         * @param loop 循環
         * @returns {PIXI.spine.core.TrackEntry}
         */
        setAnimation(animName: string, loop?: boolean): PIXI.spine.core.TrackEntry;
        /**
         * 設定最新一軌播放動畫
         * @param animName 動畫名稱
         * @param loop 循環
         * @returns {PIXI.spine.core.TrackEntry}
         */
        setAnimationWithLatestIndex(animName: string, loop?: boolean): PIXI.spine.core.TrackEntry;
        /**
         * 設定第 n 軌播放動畫
         * @param animName 動畫名稱
         * @param loop 循環
         * @returns {PIXI.spine.core.TrackEntry}
         */
        setAnimationWithIndex(trackIndex: number, animName: string, loop?: boolean): PIXI.spine.core.TrackEntry;
        /**
         * 在第 0 軌後接著播放動畫
         * @param animName 動畫名稱
         * @param loop 循環
         * @param delay 延遲時間
         * @param mixDuration 交疊時間
         * @returns {PIXI.spine.core.TrackEntry}
         */
        addAnimation(animName: string, loop?: boolean, delay?: number, mixDuration?: number): PIXI.spine.core.TrackEntry;
        /**
         * 在第 n 軌後接著播放動畫
         * @param trackIndex 第幾軌
         * @param animName 動畫名稱
         * @param loop 循環
         * @param delay 延遲時間
         * @param mixDuration 交疊時間
         * @returns {PIXI.spine.core.TrackEntry}
         */
        addAnimationWithIndex(trackIndex: number, animName: string, loop?: boolean, delay?: number, mixDuration?: number): PIXI.spine.core.TrackEntry;
        /**
         * 取得最新一軌沒有在播放動畫的軌道索引
         * @returns {number} 索引值
         */
        private getLatestTrackIndex;
        /**
         * 設定動畫跳到結束
         * @param trackIndex 第幾軌
         */
        setAnimationToEnd(trackIndex: number): void;
        /**
         * 設定動畫的 skin
         * @param name skin 名稱
         */
        setNewSkinByName(name: string): void;
    }
}
interface ISoundList {
    [key: string]: string;
}
declare namespace PixiAsset {
    class PixiSound {
        /**
         * 初始化要使用到的音效
         * @param {Object<string, string>} lists
         */
        static init(lists: ISoundList): Promise<void>;
        /**
         * 撥放音效
         * @param alias
         * @param {PlayOptions} option 撥放的選項
         * @returns {IMediaInstance} 撥放的 instance
         */
        static play(alias: string, option?: PlayOptions): IMediaInstance;
        /**
         * 靜音所有音效
         * @param flag 開關
         */
        static muteAll(flag: boolean): void;
        /**
         * 根據名稱暫停所有音效
         * @param name
         */
        static pauseByName(name: string): void;
        /**
         * 根據名稱繼續所有音效
         * @param name
         */
        static resumeByName(name: string): void;
        /**
         * 根據名稱停止所有音效
         * 停止後就不能再使用 resume
         * @param name
         */
        static stopByName(name: string): void;
        /**
         * 根據名稱修改音量
         * @param name 名稱
         * @param value 0-1
         */
        static setVolumeByName(name: string, value: number): void;
        /**
         * 暫停特定的音效 instance
         * @param instance
         */
        static pauseByInstance(instance: IMediaInstance): void;
        /**
         * 繼續特定的音效 instance
         * @param instance
         */
        static resumeByInstance(instance: IMediaInstance): void;
        /**
         * 停止特定的音效 instance
         * 停止後要指定原本的 instance 為 null，否則stop 會摧毀 instance._media 造成錯誤
         * @param instance
         * @returns null
         * @example
         *      let a: IMediaInstance = PixiSound.play('sound-alias')
         *      a = PixiSound.stopByInstance(a)
         */
        static stopByInstance(instance: IMediaInstance): any;
        /**
         * 調整單一音效的音量
         * @param instance
         * @param value 0-1
         */
        static setVolumeByInstance(instance: IMediaInstance, value: number): void;
    }
}
declare enum eButtonState {
    normal = 0,
    press = 1,
    disable = 2
}
interface IButtonInfo {
    [key: string]: Array<string>;
}
declare namespace PixiAsset {
    class Button extends PIXI.Sprite {
        private textureInfo;
        private currentToggle;
        get ToggleState(): string;
        private state;
        constructor(name: string);
        /**
         * 初始化按鈕
         * @param {IButtonInfo | Array<string>} info 按鈕的資訊 (對應 normal, press, disable 的圖片)
         * @returns 按鈕本身
         * @example
         *      new Button('name').init(['SpinStop_00', 'SpinStop_01', 'SpinStop_02])       // 只有一種狀態，不會切換
         *      new Button('name').init({                                                   // 可以有多種狀態，之後可以指定名稱切換
         *          'toggle1': ['SpinStop_00', 'SpinStop_01', 'SpinStop_02],
         *          'toggle2': ['SpinStart_00', 'SpinStart_01', 'SpinStart_02],
         *          ...
         *      })
         */
        init(info: IButtonInfo | Array<string>): Button;
        /**
         * 加上容器上
         * @param parent 父容器
         * @param {number | PIXI.Point} pos 數字的話則 x = y = pos, 座標的話則帶入座標
         * @param {number | PIXI.Point} anchor 數字的話則 x = y = anchor, 座標的話則帶入座標
         * @param state 指定一開始的狀態
         */
        addTo(parent: PIXI.Container, pos: number | PIXI.Point, anchor?: number | PIXI.Point, state?: eButtonState): void;
        /**
         * 切換狀態
         * @param name 要切換的狀態名稱  ( 如果只有兩態切換的話，則不用打參數 )
         */
        toggle(name?: string): void;
        /**
         * 設置按鈕的禁用狀態
         * @param flag true/禁用  false/啟用
         * @example
         *      const btn = new Button().init(textureNameArr)
         *      btn.on('pointertap', ()=> btn.setDisable(true))
         */
        setDisable(flag: boolean): void;
        /**
         * 設定按鈕使用的貼圖
         * @param state
         */
        private setTexture;
    }
}
interface IBitmapTextStyle {
    fontName: string;
    fontSize?: number;
    align?: string;
    tint?: number;
    letterSpacing?: number;
    maxWidth?: number;
}
interface IBitmapTextList {
    [key: string]: string;
}
declare namespace PixiAsset {
    class BitmapText extends PIXI.BitmapText {
        /**
         * 初始化字型
         * @param list 要初始化的list
         */
        static init(list: IBitmapTextList): Promise<void>;
        /**
         * 畫字型
         * @param name 字型容器名稱
         * @param fontName 字型名稱
         * @param fontSize 字型大小
         * @param {number | PIXI.Point} pos
         * @param {number | PIXI.Point} anchor
         * @param style
         * @returns
         */
        static drawFont(name: string, fontName: string, fontSize: number, pos?: number | PIXI.Point, anchor?: number | PIXI.Point, style?: IBitmapTextStyle): BitmapText;
        constructor(name: string, style: IBitmapTextStyle);
        /**
         * 利用字型名稱變換數字的貼圖
         * @param fontName 字型名稱
         */
        setTexture(fontName: string): void;
    }
}