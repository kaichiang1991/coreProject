/// <reference types="pixi-particles/ambient" />
declare enum eBigWinType {
    none = 0,
    bigWin = 1,
    megaWin = 2,
    hugeWin = 3,
    superWin = 4
}
declare class BigWinManager {
    private static setting;
    private static config;
    private static isPlaying;
    private static totalBet;
    private static winInterval;
    private static winType;
    private static word;
    private static parent;
    private static resizeFn;
    /**
     * 初始化 BigWinManager
     * @param {PIXI.Application} App
     * @param {IConfig} config 遊戲設定檔
     * @param {Array<number>} interval BigWin的區間 (length = 4)
     */
    static init(App: PIXI.Application, config: IConfig, interval: Array<number>): Promise<void>;
    /**
     * 播放 BigWin 演出
     * @param {PIXI.Container} parent 父節點
     * @param {number} totalBet 總押注
     * @param {number} win 贏分
     * @returns 播放完畢後回傳
     */
    static playBigWin(parent: PIXI.Container, totalBet: number, win: number): Promise<void>;
    /**
     * 播放滾分
     * @param win 目標分數
     */
    private static playScrolling;
    /** 演出結束後的重置 */
    static endBigWin(): void;
    /**
     * 從得分來取得 bigWin 類型
     * @param {number} win 得分
     * @returns {eBigWinType}
     */
    static getBigWinType(win: number): eBigWinType;
    /**
     * 取得演出得分區間
     * @returns {Array<number>} 要演幾段就回傳幾個
     */
    private static getDuration;
    /** 自適應 */
    private static resize;
}
