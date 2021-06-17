/// <reference types="pixi-particles/ambient" />
declare enum eDebugLevel {
    Log = 1,
    Warn = 2,
    Error = 4
}
interface IPanelInfo {
    fps: number;
}
declare class Debug {
    static DebugLevel: number;
    static divPanel: HTMLElement;
    private static App;
    /**
     * 初始化 Debug 功能
     * @param level 要開啟的 Debug 等級 (複合數字)
     * @example
     *  Debug.init(eDebugLevel.Log | eDebugLevel.Warn)      // 只打開 Log 和 Warn 的顯示
     *  Debug.init(eDebugLevel.Error)           // 只顯示 錯誤訊息
     */
    static init(App: PIXI.Application, level: number): void;
    /** 印出 Log */
    static log(...args: Array<any>): void;
    /** 印出 警告訊息 */
    static warn(...args: Array<any>): void;
    /** 印出 錯誤訊息 */
    static error(...args: Array<any>): void;
    private static logData;
    /**
     * 寫入 log
     * @param key key值 (相同key值會 push 到陣列裡)
     * @param context 內容
     */
    static writeLog(key: string, context: any): void;
    /**
     * 根據 key 值取得 log
     * @param key 鍵值
     * @returns 要取得的log
     */
    static getLog(key: string): any[];
    /**
     * 取得所有的 log (當下的值複製)
     * @returns 所有的log (沒有複製的原物件)
     */
    static getAllLog(): {
        [key: string]: any[];
    };
    private static readonly DEFAULT_TEXT;
    private static readonly DEFAULT_FPS_OBJ;
    private static fpsObj;
    private static tickerEvent;
    static get On(): string;
    static get Off(): string;
    /** 創建 Debug Panel */
    private static createPanel;
    /**
     * 開關 Debug Panel
     * @param flag
     */
    static activePanel(flag: boolean): void;
    /**
     * 顯示 Debug 內容
     * @param content
     */
    static showContent(content: IPanelInfo): void;
}
