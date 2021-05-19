declare class Loading {
    private static finishEvent;
    private static parentContainer;
    private static barArr;
    private static bar;
    private static barWidth;
    private static barTween;
    private static logo;
    /**
     * 初始化 Loading
     * @param stage
     * @returns 整個讀取完成後會回傳
     */
    static init(container: PIXI.Container): Promise<void>;
    /** 開始讀取條演出 */
    private static startLoading;
    /** 通知讀取條結束演出 */
    static finishLoading(): void;
    /**
     * 配合直橫式自適應
     * @param {{portrait: boolean}} config 傳入的設定檔案
     */
    private static resize;
}
