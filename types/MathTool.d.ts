declare class MathTool {
    private static moneyFractionMultiple;
    private static denom;
    private static useMoney;
    /**
     * 切換幣/分顯示狀態，若不填入新狀態則反轉當前狀態
     * @param flag 新狀態
     */
    static switchUseMoney(flag?: boolean): void;
    /**
     * 初始化
     * @param betModel 押注模組
     */
    static init(betModel: any): void;
    /**
     * 將帶入的數值轉換成帶有逗點的整數字串並回傳
     * @param value 數值
     */
    static numberWithCommas(value: number): string;
    /**
     * 將帶入的數值轉換成帶有逗點及小數點後二位的字串並回傳
     * @param value 數值
     * @param digit 小數點後的位數
     */
    static floatWithCommas(value: number, digit?: number): string;
    /**
     * 錢轉分
     * @param money 錢
     * @returns
     */
    static moneyToCredit(money: number): number;
    /**
     * 轉換數字顯示
     * @param value
     * @param digit 小數點後的位數
     * @returns 數值顯示字串
     */
    static convertNumDisplay(value: number, digit?: number): string;
}
