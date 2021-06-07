declare class BetModel {
    private static instance;
    static getInstance(): BetModel;
    private static line;
    static get Line(): number;
    private static moneyFractionMultiple;
    static get MoneyFractionMultiple(): number;
    private static denom;
    static get Denom(): number;
    static init(betUnit: number, betInterval: Array<number>, credit: number, moneyFractionMultiple: number, denom: number, line?: number): void;
    constructor(betUnit: number, betInterval: Array<number>, credit: number);
    private betIndex;
    private betUnit;
    get BetUnit(): number;
    private betInterval;
    get BetInterval(): Array<number>;
    get Bet(): number;
    get TotalBet(): number;
    /**
     * 直接設定 index
     * @param index
     */
    setBet(index: number): void;
    changeBet(flag: boolean): void;
    credit: number;
    /** 開始spin (扣錢) */
    startSpin(): void;
    private win;
    private preWin;
    get PreWin(): number;
    get Win(): number;
    /** 設定贏分 */
    set Win(value: number);
    /**
     * 增加贏分
     * @param value
     */
    addWin(value: number): void;
    roundCode: string;
}
