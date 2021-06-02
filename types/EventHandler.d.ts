declare enum eCommonEvent {
    orientationChange = "orientationChange",
    startSpin = "startSpin",
    stopSpin = "stopSpin"
}
declare const eEventName: {
    orientationChange: eCommonEvent.orientationChange;
    startSpin: eCommonEvent.startSpin;
    stopSpin: eCommonEvent.stopSpin;
    stateChange: eGameStateEvent.stateChange;
};
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
    static on(name: string, callback: Function): void;
    /**
     * 註冊單次事件，觸發後取消
     * @param name 事件名稱
     * @param callback
     */
    static once(name: string, callback: Function): void;
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
}