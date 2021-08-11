/** 事件帶的context格式 */
interface IEventContext {
    [key: string]: any;
}
/** 事件 callback 的格式 */
interface IEventCallback {
    (key?: IEventContext): void;
}
declare class EventHandler {
    private static instance;
    /** 初始化 EventHandler */
    static init(): void;
    /**
     * 派送事件
     * @param {string} name 事件名稱
     * @param {IEventContext} [context] 傳送內容
     */
    static dispatch(name: string, context?: IEventContext): void;
    /**
     * 註冊事件
     * @param {string} name 事件名稱
     * @param {IEventCallback} callback 接受到事件，要執行的callback
     * @returns {IEventCallback} 註冊的事件
     */
    static on(name: string, callback: IEventCallback): IEventCallback;
    /**
     * 註冊單次事件，觸發後取消
     * @param {string} name 事件名稱
     * @param {IEventCallback} callback 接受到事件，要執行的callback
     * @returns {IEventCallback} 註冊的事件
     */
    static once(name: string, callback: IEventCallback): IEventCallback;
    /**
     * 取消註冊指定事件
     * 不存在的話會印出警告，並跳出
     * 事件沒有被註冊，會直接跳出
     * @param {string} name 事件名稱
     * @param {IEventCallback} callback 要取消的callback
     */
    static off(name: string, callback: IEventCallback): void;
    /**
     * 取消所有符合名稱的事件
     * @param {string} name 事件名稱
     */
    static removeListener(name: string): void;
    /** 取消所有註冊事件 */
    static removeAllListeners(): void;
    /**
     * 取得所有目前註冊的事件名稱
     * @returns {Array<string | symbol} 事件名稱陣列
     */
    static getEventNames(): Array<string | symbol>;
    /**
     * 取得該名稱的所有事件
     * @param {string} name 事件名稱
     * @returns {Array<Function} 註冊的callback array
     */
    static getListeners(name: string): Array<Function>;
}

