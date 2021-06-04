declare class MathTool {
    static init(): void;
    /**
     * 將帶入的數值轉換成帶有逗點的字串並回傳
     * @param value 數值
     */
    static numberWithCommas(value: number): string;
    /**
     * 將帶入的數值轉換成帶有逗點及小數點後二位的字串並回傳
     * @param value 數值
     */
    static floatWithCommas(value: number): string;
    /**
     * 錢轉分
     * @param money 錢
     * @param denom 幣值
     * @returns
     */
    static moneyToCredit(money: number, denom: number): number;
}
