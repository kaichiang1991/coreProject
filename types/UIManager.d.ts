/// <reference types="pixi-particles/ambient" />
/**UI總管理 */
declare class UIManager {
    static stage: PIXI.Container;
    static blackMask: PIXI.Graphics;
    static useMoney: boolean;
    /**
     * 初始化
     * @param stage 場景
     */
    static init(stage: PIXI.Container): Promise<void>;
    /**
     * 開關黑色遮罩
     * @param flag 開關狀態
     */
    static activeBlackMask(flag?: boolean): void;
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
}
/**老虎機介面管理 */
declare class SlotUIManager {
    private static uiArr;
    /**目前急停的設定 */
    static get IsAutoSpeed(): boolean;
    /**初始化 */
    static init(): Promise<void>;
    /**重置設定 */
    static reset(): void;
    /**註冊事件 */
    private static registerEvent;
    /**
     * 開關設定選單的按鈕
     * @param flag 開關狀態
     */
    static activeMenuBtn(flag: boolean): void;
    /**
     * 開關旋轉次數
     * @param flag 開關狀態
     */
    static activeSpinRound(flag: boolean): void;
    private static spinRoundTimes;
    /**
     * 重置旋轉次數
     * @param times 指定次數
     */
    static resetSpinRoundTime(times: number): void;
    /**
     * 更新旋轉次數
     * @param perTime 每次更新的變化次數，ex: 1(遞增) or -1(遞減)
     */
    static updateSpinRound(perTime: number): void;
    /**更新押注 */
    static updateBet(): void;
    /**更新總分/幣 */
    private static updateCredit;
    /**更新贏分 */
    private static updateWin;
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
    static reset(): void;
    /**註冊事件 */
    private static registerEvent;
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
    static reset(): void;
    /**設定押注列表選項
     * @param index 押注選項的索引
     */
    private static setBetListOptionChosen;
    /**註冊事件 */
    private static registerEvent;
}
/**自動旋轉列表管理器 */
declare class AutoSpinListUIManager {
    private static isActive;
    static get Active(): boolean;
    private static uiArr;
    static get UIArr(): Array<PIXI.Container>;
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
    static reset(): void;
    /**
     * 設定自動旋轉列表選項
     * @param index 自動旋轉列表的索引
     */
    private static setAutoSpinListOptionChosen;
    /**註冊事件 */
    private static registerEvent;
}
