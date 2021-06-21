declare class Entry {
    private static app;
    private static game;
    private static divPixi;
    private static ratioApply;
    private static config;
    private static width;
    private static height;
    private static isMobile;
    private static gameDetail;
    static get getDetail(): Object;
    /**
     * 初始化 Entry
     * @param config 遊戲的config
     */
    static init(app: PIXI.Application, config: IConfig): void;
    /** 屏幕旋轉 */
    private static rotateChange;
    /** 行動裝置設定 */
    private static fullscreenEvent;
    /** Android */
    private static androidHandler;
    /** iOS */
    private static iosHandler;
    /**
     * 顯示提示訊息
     * @param show 是否顯示
     * @param type class 名稱後綴
     */
    private static tips;
    /**
     * 判斷是否沒有父層
     * @returns true 不是iframe / false 是iframe
     */
    private static notFrame;
    /**
     * 處理離開事件
     * @param url 要離開的url
     */
    private static exitHandler;
    /**
     * 彈窗開關事件
     * @param show 彈窗開(true)/關(false)
     * @param info 需要傳遞的資料
     */
    private static windowHandler;
    /** Google Analytics */
    private static analytics;
    /** debug */
    private static debugInfo;
}
