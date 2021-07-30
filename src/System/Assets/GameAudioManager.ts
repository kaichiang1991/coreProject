import { CompleteCallback, IMediaInstance, PlayOptions, sound } from "@pixi/sound"
import lazyLoad from "@root/src/Tool/lazyLoad"

export enum eAudioName{
    // 音樂
    NG_BGM = 'MBN82001_ng_bgm',
    FG_BGM = 'MBN82002_fg_bgm',

    // ----------- 音效 ----------
    // 滾輪
    spinStop = 'SBN82003_spin_stop',
    reelExpect = 'SBN82004_reel_expecting',
    
    // 符號
    FG_EndSpin = 'SBN82005_fg_effect',          // FG 符號連線落定
    FG_SymbolWin = 'SBN82006_fg_win',           // FG 符號連線

    // FreeGame
    FG_Transition = 'SBN82007_fg_announce',     // FG 轉場宣告
    FG_StickAppear = 'SBN82016_fg_wild_appear', // FG stick WD 跳出音效
    FG_PlusTimes = 'SBN82008_fg_add_round',     // FG 加場次
    FG_TotalWin = 'SBN82009_fg_result',         // FG 總分

    // 跑線
    AllLine = 'SBN82013_win_frame',             // 全線展演
    eachLine_WD = 'SBN82010_wild_win',          // 逐線 WD
    eachLine_H1 = 'SBN82011_h1_win',            // 逐線 WD
    eachLine_H2 = 'SBN82012_h2_win',            // 逐線 WD
    eachLine_N = 'SBN82014_win_score',          // 逐線 WD
    lineWinScroll = 'SBN82015_count_score',     // 滾分
}

const {PixiSound} = PixiAsset
export default class GameAudioManager{

    private static audioList: ISoundList = {}

    public static async init(){
        Object.values(eAudioName).map(name => this.audioList[name] = 'audio/' + name)
        for (const key in this.audioList) {     // 加上副檔名
            !/\.(mp3)$/.test(this.audioList[key]) && (this.audioList[key] += '.mp3')
        }

        const [...sources] = await lazyLoad(Object.values(this.audioList))        
        Object.keys(this.audioList).map((key, index) => this.audioList[key] = sources[index])
        await PixiSound.init(this.audioList)
    }

    //#region 遊戲音樂 music
    private static currentMusic: IMediaInstance
    private static currentMusicName: string
    /**
     * 播放背景音樂 (只支援同時播放一個背景音樂)
     * 若不同於現在的背景音樂，則停掉目前的，直接播放
     * 若與現在的背景音樂相同，則resume播放 (不管有沒有暫停)
     * @param {eAudioName} name 音效名稱
     * @param {boolean} [loop=true] 循環
     * @param {Function} [complete=] 播完的事件
     * @returns {Promise<void>} 播放完畢後回傳
     */
    public static playAudioMusic(name: eAudioName, loop: boolean = true, complete?: Function): Promise<void>{
        return new Promise<void>(res =>{

            if(!loop && complete){
                Debug.warn('playAudioMusic', 'loop 但是有complete事件', name)
            }

            const option: PlayOptions = {loop, complete: ()=> {
                complete && complete()
                res()
            }}

            if(!this.currentMusic){                         // 還沒有播放背景音樂
                this.currentMusic = PixiSound.play(name, option)
                this.currentMusicName = name
            }else if(this.currentMusicName != name){        // 播放的音樂跟目前的不一樣
                Debug.warn('播放不同的音樂', name, '，之前的音樂', this.currentMusicName)
                PixiSound.stopByInstance(this.currentMusic)
                this.currentMusic = PixiSound.play(name, option)
                this.currentMusicName = name
            }else{
                Debug.warn('播放相同的音樂', name, this.currentMusic, this.currentMusicName)
                PixiSound.resumeByInstance(this.currentMusic)
            }
        })
    }

    /** 暫停目前的音樂 */
    public static pauseCurrentMusic(){
        PixiSound.pauseByInstance(this.currentMusic)
    }

    /** 繼續目前的音樂 */
    public static resumeCurrentMusic(){
        PixiSound.resumeByInstance(this.currentMusic)
    }

    //#endregion 遊戲音樂 music

    //#region 遊戲音效 effect
    /**
     * 播放遊戲音校
     * @param {string} name 音效名稱
     * @param {boolean} [loop=false] 循環 
     * @param {Function} [complete=] 播完的事件
     * @returns {[IMediaInstance, Promise<void>]} [音效，播完的Promise]
     */
    public static playAudioEffect(name: string, loop: boolean = false, complete?: Function): [IMediaInstance, Promise<void>]{
        let option: PlayOptions
        const audioDone: Promise<void> = new Promise<void>(res => {                
            option = {
                loop, complete: ()=>{
                    complete && complete()
                    res()
                }
            }
        })
        const instance: IMediaInstance = PixiSound.play(name, option)
        return [instance, audioDone]
    }

    /**
     * 暫停播放音效
     * @param {IMediaInstance} audio 音效 
     */
    public static pauseAudioEffect(audio: IMediaInstance){
        PixiSound.pauseByInstance(audio)
    }

    /**
     * 繼續播放音效
     * @param {IMediaInstance} audio 音效 
     */
    public static resumeAudioEffect(audio: IMediaInstance){
        PixiSound.resumeByInstance(audio)
    }

    /**
     * 停止播放音效
     * 停止後要指定原本的 instance 為 null，否則stop 會摧毀 instance._media 造成錯誤
     * @param {IMediaInstance} audio 音效
     * @returns null
     * @example
     *      let a: IMediaInstance = PixiSound.play('sound-alias')
     *      a = PixiSound.stopByInstance(a)
     */
    public static stopAudioEffect(audio: IMediaInstance){
        return PixiSound.stopByInstance(audio)
    }
    //#endregion 遊戲音效 effect
}