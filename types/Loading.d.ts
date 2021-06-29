/// <reference types="pixi-particles/ambient" />
declare class Loading {
    private static finishEvent;
    private static parentContainer;
    private static barArr;
    private static bar;
    private static barWidth;
    private static barTween;
    private static logo;
    private static config;
    private static resizeFn;
    /**
     * 初始化 Loading
     * @param stage
     * @returns loading 圖載完
     */
    static init(container: PIXI.Container, config: IConfig): Promise<void>;
    /**
     * 開始讀取條演出
     * @returns 讀取條演完後回傳
     */
    static startLoading(): Promise<void>;
    /** 通知讀取條結束演出 */
    static finishLoading(): void;
    /**
     * 配合直橫式自適應
     */
    private static resize;
}
