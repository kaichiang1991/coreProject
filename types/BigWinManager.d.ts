/// <reference types="pixi-particles/ambient" />
/** BigWin 的類型 */
declare enum eBigWinType {
    none = 0,
    bigWin = 1,
    megaWin = 2,
    hugeWin = 3,
    superWin = 4
}
/** 觸發停止的物件 */
interface IStopTrigger {
    level: eBigWinType;
    function: Function;
}
interface IExternalFunction {
    pauseMusic: {
        (): void;
    };
    resumeMusic: {
        (): void;
    };
    playAudio: {
        (name: string, loop?: boolean, complete?: Function): [IMediaInstance, Promise<void>];
    };
    stopAudio: {
        (audio: IMediaInstance): void;
    };
}
declare class BigWinManager {
    private static setting;
    private static config;
    private static isPlaying;
    private static totalBet;
    private static winInterval;
    private static winType;
    private static word;
    private static number;
    private static parent;
    private static bigWinCont;
    private static resizeFn;
    private static stopTrigger;
    private static audioFunction;
    private static backgroundAudio;
    /**
     * 初始化 BigWinManager
     * @param {PIXI.Application} App
     * @param {IConfig} config 遊戲設定檔
     * @param {Array<number>} interval BigWin的區間 (length = 4)
     */
    static init(App: PIXI.Application, config: IConfig, interval: Array<number>, trigger: IStopTrigger, functions: IExternalFunction): Promise<void>;
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
