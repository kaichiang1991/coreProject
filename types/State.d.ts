/// <reference types="pixi-particles/ambient" />
declare module StateModule {
    function init(): void;
    /** State 介面 */
    interface IState {
        type: string;
        context: StateContext;
        enter(): any;
        change(): any;
        exit(): any;
    }
    /** State 的建構函式 */
    interface IStateConstructor {
        new (type: string, context: StateContext): any;
    }
    /**
     * 創造一個狀態
     * @param ctor 建構函式
     * @param type 狀態名稱
     * @param context 內容
     * @returns
     */
    function createState(ctor: IStateConstructor, type: string, context: StateContext): IState;
    /** 實作遊戲中的狀態機 */
    class GameState implements IState {
        type: string;
        context: StateContext;
        constructor(type: string, context: StateContext);
        enter(): void;
        change(): void;
        exit(): void;
    }
    /** 狀態機的內容 */
    class StateContext {
        private stateArr;
        private currentState;
        private lastState;
        constructor();
        /**
         * 註冊一個狀態
         * @param state
         */
        regState(state: IState): StateContext;
        /**
         * 取消註冊一個狀態
         * @param state
         */
        unRegState(state: IState): StateContext;
        /** 取消註冊全部狀態 */
        unRegAll(): StateContext;
        /**
         * 取得狀態
         * @param type 狀態名稱
         * @returns
         */
        getState(type: string): IState;
        /** 取得目前狀態 */
        getCurrentState(): string;
        /** 取得上一個狀態 */
        getLastState(): string;
        /**
         * 變更狀態
         * @param type 要變更的狀態
         */
        changeState(type: string): StateContext;
    }
    class GameStateContext extends StateContext {
        changeState(type: string): GameStateContext;
    }
    
}
