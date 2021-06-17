/// <reference types="pixi-particles/ambient" />
declare class EventHandler {
    private static instance;
    /**
     * 初始化 EventHandler
     */
    static init(): void;
    /**
     * 派送事件
     * @param {string} name 事件名稱
     * @param context 傳送內容
     */
    static dispatch(name: string, context?: {
        [key: string]: any;
    }): void;
    /**
     * 註冊事件
     * @param name 事件名稱
     * @param callback
     */
    static on(name: string, callback: Function): Function;
    /**
     * 註冊單次事件，觸發後取消
     * @param name 事件名稱
     * @param callback
     */
    static once(name: string, callback: Function): Function;
    /**
     * 取消註冊指定事件
     * 不存在的話會印出警告，並跳出
     * @param name 事件名稱
     * @param callback 要取消的callback
     */
    static off(name: string, callback: Function): void;
    /**
     * 取消所有符合名稱的事件
     * @param name 事件名稱
     */
    static removeListener(name: string): void;
    /** 取消所有註冊事件 */
    static removeAllListeners(): void;
    /**
     * 取得所有目前註冊的事件名稱
     * @returns 事件名稱陣列
     */
    static getEventNames(): Array<string | symbol>;
    /**
     * 取得該名稱的所有事件
     * @param name 事件名稱
     * @returns 註冊的callback array
     */
    static getListeners(name: string): Array<Function>;
}
