/// <reference types="pixi-particles/ambient" />
/**UI總管理 */
declare class UIManager {
    static stage: PIXI.Container;
    private static blackMask;
    static externalConfig: IConfig;
    /**
     * 初始化
     * @param stage 場景
     */
    static init(stage: PIXI.Container, externalConfig: IConfig): Promise<void>;
    /**
     * 開關黑色遮罩
     * @param flag 開關狀態
     */
    static activeBlackMask(flag?: boolean, maskAlpha?: number): void;
    /**
     * 註冊黑色遮罩的事件
     * @param fn 要註冊的功能
     */
    static registerBlackMaskEvent(fn: Function): void;
    /**
     * 註銷黑色遮罩的事件
     * @param fn 要註銷的功能
     */
    static logoutBlackMaskEvent(fn: Function): void;
    /**清除所有的UI */
    static clearAll(): void;
}
/**老虎機介面管理 */
declare class SlotUIManager {
    private static uiArr;
    /**目前急停的設定 */
    static get IsAutoSpeed(): boolean;
    private static autoInfinity;
    private static spinRoundTimes;
    static get IsAuto(): boolean;
    private static winInfo;
    /**初始化 */
    static init(): Promise<void>;
    /**重置設定 */
    static reset(portrait: boolean): void;
    /**註冊事件 */
    private static registerEvent;
    private static disableIconAtSpin;
    /**
     * 開關設定選單的按鈕
     * @param flag 開關狀態
     */
    static activeMenuBtn(flag: boolean): void;
    /**
     * 開關自動模式
     * @param flag 開關狀態
     */
    static activeAuto(flag: boolean): void;
    /**
     * 開關贏分資訊
     * @param flag 開關狀態
     * @param value 第幾線/乘積
     * @param win 贏分
     */
    static activeWinInfo(flag: boolean, value?: number, win?: number): void;
    /**
     * 重置旋轉次數
     * @param index 自動旋轉次數陣列索引
     */
    static resetSpinRoundTime(index: number): void;
    /**
     * 更新旋轉次數
     * @param flag 更新次數正負狀態，true: 1(遞增)；false: -1(遞減)
     */
    static updateSpinRound(flag: boolean): void;
    private static showSpinRound;
    /**更新押注 */
    static updateBet(): void;
    /**更新總分/幣
     * @param betModel 押注模組
     */
    private static updateCredit;
    /**更新贏分
     * @param betModel 押注模組
     */
    private static updateWin;
    /**
     * 更新單號
     * @param betModel 押注模組
     */
    private static updateRoundCode;
    /**
     * 進行跑分動畫
     * @param betModel 押注模組
     * @param duration 動畫時間(秒)
     */
    static playWinChangeAnim(betModel: BetModel, duration: number): Promise<void>;
    /**清除所有物件 */
    static clearAll(): void;
    /**更新押注符號 */
    static updateBetIcon(): void;
}
/**設置UI管理 */
declare class SettingUIManager {
    private static isActive;
    /**顯示狀態 */
    static get Active(): boolean;
    private static uiArr;
    /**UI陣列 */
    static get UIArr(): Array<PIXI.Container>;
    /**目前聲音的開關設定 */
    static get IsMusicOn(): boolean;
    private static exitFn;
    /**初始化 */
    static init(): void;
    /**
     * 開關UI
     * @param flag 開關狀態
     */
    static activeUI(flag: boolean): void;
    /**重置設定 */
    static reset(portrait: boolean): void;
    /**註冊事件 */
    private static registerEvent;
    /**清除所有物件 */
    static clearAll(): void;
}
/**押注列表管理器 */
declare class BetListUIManager {
    private static isActive;
    /**顯示狀態 */
    static get Active(): boolean;
    private static uiArr;
    /**UI陣列 */
    static get UIArr(): Array<PIXI.Container>;
    private static betListOptionArr;
    private static exitFn;
    /**初始化 */
    static init(): void;
    /**
     * 開關UI
     * @param flag 開關狀態
     */
    static activeUI(flag: boolean): void;
    /**重置設定 */
    static reset(portrait: boolean): void;
    /**設定押注列表選項
     * @param index 押注選項的索引
     */
    private static setBetListOptionChosen;
    /**註冊事件 */
    private static registerEvent;
    /**清除所有物件 */
    static clearAll(): void;
}
/**自動旋轉列表管理器 */
declare class AutoSpinListUIManager {
    private static isActive;
    static get Active(): boolean;
    private static uiArr;
    static get UIArr(): Array<PIXI.Container>;
    private static freeGameSwitch;
    static get FreeGameSwitch(): boolean;
    private static winSwitch;
    static get WinSwitch(): boolean;
    private static autoSpinListOptionArr;
    private static exitFn;
    /**初始化 */
    static init(): void;
    /**
     * 開關UI
     * @param flag 開關狀態
     */
    static activeUI(flag: boolean): void;
    /**重置設定 */
    static reset(portrait: boolean): void;
    /**
     * 設定自動旋轉列表選項
     * @param index 自動旋轉列表的索引
     */
    private static setAutoSpinListOptionChosen;
    /**註冊事件 */
    private static registerEvent;
    /**清除所有物件 */
    static clearAll(): void;
}
declare class JackpotUIManager {
    private static isActive;
    static get Active(): boolean;
    private static uiArr;
    static get UIArr(): Array<PIXI.Container>;
    /**初始化 */
    static init(): void;
    /**
     * 開關UI
     * @param flag 開關狀態
     */
    static activeUI(flag: boolean): void;
    /**重置設定 */
    static reset(portrait: boolean): void;
    /**清除所有物件 */
    static clearAll(): void;
}
