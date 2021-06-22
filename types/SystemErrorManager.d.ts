/// <reference types="pixi-particles/ambient" />
declare class SystemErrorManager {
    static stage: PIXI.Container;
    /**是否已顯示錯誤畫面 */
    private static isShowingError;
    /**是否已經顯示錯誤畫面 */
    static get IsError(): boolean;
    /**是否已顯示跳出視窗 */
    private static isShowingPromptOut;
    /**黑色遮罩 */
    private static blackMask;
    /**外部設定檔 */
    private static externalConfig;
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
     * 顯示錯誤訊息
     * @param message 錯誤訊息字串
     */
    static showError(message: string): void;
    /**
     * 顯示彈出視窗
     * @param message 視窗訊息字串
     * @returns
     */
    static showPrompOut(message: string): Promise<void>;
    /**關閉所有音訊 */
    private static closeAllAudio;
    /**清除所有演出流程 */
    private static clearAllProcess;
    /**清除所有計時器 */
    private static clearAllTimeout;
    /**清除所有註冊事件 */
    private static clearAllEvent;
}
