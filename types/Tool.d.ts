/// <reference types="pixi-spine" />
declare function init(): void;
/**
 * 延遲時間 (用gsap，會有落差，但只有在畫面更新時會計時)
 * @param time 要延遲的時間 (s)
 */
declare function Sleep(time: number): Promise<void>;
/**
 * 延遲時間 (用timeout，時間比較準，但會在畫面不更新的時候計時)
 * @param time 要延遲的時間 (ms)
 */
declare function SleepWithTimeout(time: number): Promise<void>;
/**
 * 安全移除 tween
 * @param tween 要移除的 tween
 * @param suppressEvents 是否支援事件 true = 不跑事件, false = 會跑事件 e.g. 會進complete
 */
declare function safe_kill_tween(tween: gsap.core.Animation, suppressEvents?: boolean): void;
/**
 * 等待 tween 結束
 * 如果有 complete 事件，結束後會一起執行
 * @param tween 要等待的 tween
 */
declare function waitTweenComplete(tween: gsap.core.Tween): Promise<void>;
/**
 * 等待 spine track 撥放完畢
 * @param track 要等待的 track
 */
declare function waitTrackComplete(track: PIXI.spine.core.TrackEntry): Promise<void>;
/**
 * 解碼 base64 的編碼
 * @param encodeStr
 * @returns
 */
declare function decodeBase64(encodeStr: string): string;
/**
 * 轉換讀取檔案的路徑  img -> img_webp
 * @param path
 * @returns 轉換後的路徑
 */
declare function pathConvert(path: string): string;
/** 判斷平台是否支援 webp 格式 */
declare function supportWebp(): Promise<boolean>;
