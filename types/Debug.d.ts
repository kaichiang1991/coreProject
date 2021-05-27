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
    private static divPanel;
    /**
     * 初始化 Debug 功能
     * @param level 要開啟的 Debug 等級 (複合數字)
     * @example
     *  Debug.init(eDebugLevel.Log | eDebugLevel.Warn)      // 只打開 Log 和 Warn 的顯示
     *  Debug.init(eDebugLevel.Error)           // 只顯示 錯誤訊息
     */
    static init(level: number): void;
    /** 印出 Log */
    static log(...args: Array<any>): void;
    /** 印出 警告訊息 */
    static warn(...args: Array<any>): void;
    /** 印出 錯誤訊息 */
    static error(...args: Array<any>): void;
    private static readonly DEFAULT_TEXT;
    private static readonly DEFAULT_FPS_OBJ;
    private static fpsObj;
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