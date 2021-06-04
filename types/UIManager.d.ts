interface IUISettings {
    useMoney?: boolean;
    betInterval?: Array<number>;
    musicOn?: boolean;
    autoSpeed?: boolean;
    denom?: number;
    line?: number;
    moneyFractionMultiple?: number;
    languageData?: LanguageData;
}
interface LanguageData {
    BetListTitle?: string;
    AutoSpinListTitle?: string;
}
/**UI總管理 */
declare class UIManager {
    static stage: PIXI.Container;
    static uiSettings: IUISettings;
    static blackMask: PIXI.Graphics;
    static init(stage: PIXI.Container, uiSettings: IUISettings): Promise<void>;
    static activeBlackMask(flag?: boolean): void;
    static registerBlackMaskEvent(fn: Function): void;
    static logoutBlackMaskEvent(fn: Function): void;
}