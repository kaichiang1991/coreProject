declare module ParameterParse {
    function init(ws?: string): void;
    /** 解析 url */
    class UrlParser {
        private static query;
        /**
         * 初始化 urlParser
         * @param ws 預設要帶入的 websocket
         */
        static init(ws?: string): void;
        /** 離開的導向網址 */
        static exitUrl: string;
        private static parseExitUrl;
        /** 遊戲的 token */
        static token: string;
        private static parseToken;
        /** gameserver 網址 */
        static gameServer: string;
        /** 細單網址 */
        static betQuery: string;
        private static parseWebsocket;
    }
    /** 解析 localStorage */
    class LocalStorageManager {
        /** 初始化 LocalStorage 內容解析 */
        static init(): void;
        /** 押注乘數 */
        static betIndex: string;
        /**
         * 設定localStorage 裡面的 betIndex
         * @param index
         */
        static setBetIndex(index: number): void;
        /** 解析 loaclStorage 內的 betIndex */
        private static parseBetIndex;
        /** 是否開啟快速急停 */
        static autoSpeed: boolean;
        /**
         * 設定 localStorage 內的快速停輪
         * @param flag
         */
        static setAutoSpeed(flag: boolean): void;
        /** 解析 loaclStorage 內的 autoSpeed */
        private static parseAutoSpeed;
        /** 是否開啟音效 */
        static musicOn: boolean;
        /**
         * 設定 localStorage 內的音效開關
         * @param flag
         */
        static setMusicOn(flag: boolean): void;
        /** 解析 loaclStorage 內的 MusicOn */
        private static parseMusicOn;
    }
}
