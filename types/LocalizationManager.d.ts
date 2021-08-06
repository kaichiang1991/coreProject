/// <reference types="pixi-particles/ambient" />
declare enum eLanguage {
    CHS = "zh-cn",
    ENG = "en",
    default = "en"
}
declare class LocalizationManager {
    private static language;
    private static textJson;
    /** 初始化多語系 */
    static init(): Promise<void>;
    /** 取得目前語系 */
    static getLanguage(): eLanguage;
    /** 取得語系資料夾 */
    static getFolder(): string;
    /** 取得遊戲內文本 */
    static gameText(id: string): string;
    /** 取得系統字文本 */
    static systemText(id: string): string;
    private static getText;
}
