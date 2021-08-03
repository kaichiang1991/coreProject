import { CompleteCallback, IMediaInstance, PlayOptions, sound } from "@pixi/sound"
import lazyLoad from "@root/src/Tool/lazyLoad"

export enum eAudioName{
    // 音樂
    NG_BGM = 'MBN82001_Ng_Bgm',
    FG_BGM = 'MBN82002_Fg_Bgm',

    // ----------- 音效 ----------
    // UI
    spinButton = 'SBN82002_Spin_Button',        // spin 按鈕音效
    button = 'SBN82001_Button',                 // 其他按鍵音效

    // 滾輪
    spinStop = 'SBN82003_Spin_Stop',
    reelExpect = 'SBN82004_Reel_Expecting',
    
    // 符號
    FG_EndSpin = 'SBN82005_Fg_Effect',          // FG 符號連線落定
    FG_SymbolWin = 'SBN82006_Fg_Win',           // FG 符號連線

    // FreeGame
    FG_Transition = 'SBN82007_Fg_Announce',     // FG 轉場宣告
    FG_StickAppear = 'SBN82016_Fg_Wild_Appear', // FG stick WD 跳出音效
    FG_OddsEffect = 'SBN82017_FG_Tran_Pay',     // FG 倍數增加
    FG_PlusTimes = 'SBN82008_Fg_Add_Round',     // FG 加場次
    FG_TotalWin = 'SBN82009_Fg_Result',         // FG 總分

    // 跑線
    AllLine = 'SBN82013_Win_Frame',             // 全線展演
    eachLine_WD = 'SBN82010_Wild_Win',          // 逐線 WD
    eachLine_H1 = 'SBN82011_H1_Win',            // 逐線 H1
    eachLine_H2 = 'SBN82012_H2_Win',            // 逐線 H2
    eachLine_N = 'SBN82014_Win_Score',          // 逐線 H3, H4, N1 ~ N6
    lineWinScroll = 'SBN82015_Count_Score',     // 滾分
}

const musicList: Array<eAudioName> = [eAudioName.NG_BGM, eAudioName.FG_BGM]

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

        this.onRegisterEvent()
    }

    private static onRegisterEvent(){
        EventHandler.on(eEventName.setMusicVolume, ctx =>{
            this.setAudioMusicVolume(ctx.volume)
        })

        EventHandler.on(eEventName.setEffectVolume, ctx =>{
            this.setAudioEffectVolume(ctx.volume)
        })
    }

    //#region 遊戲音樂 music
    private static currentMusic: IMediaInstance
    private static currentMusicName: string
    private static audioMusicVolume: number = 1
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

            const option: PlayOptions = {loop, volume: this.audioMusicVolume, complete: ()=> {
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

    /** 停止播放目前背景音樂，並記錄成null */
    public static stopCurrentMusic(){
        this.currentMusic = PixiSound.stopByInstance(this.currentMusic)
    }

    /**
     * 設定背景音樂音量
     * @param {number} value 音量 0 - 1
     */
    private static setAudioMusicVolume(value: number){
        if(SettingUIManager.IsMusicOn){
            this.audioMusicVolume = value
        }else{
            this.audioMusicVolume = 0
        }
        PixiSound.setVolumeByInstance(this.currentMusic, this.audioMusicVolume)
    }
    //#endregion 遊戲音樂 music

    //#region 遊戲音效 effect
    private static audioEffectVolume: number = 1
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
                loop, volume: this.audioEffectVolume, complete: ()=>{
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

    /**
     * 設定遊戲音效音量
     * @param {number} value 音量 0 - 1
     */
    private static setAudioEffectVolume(value: number){
        if(SettingUIManager.IsMusicOn){
            this.audioEffectVolume = value
        }else{
            this.audioEffectVolume = 0
        }

        // 因為setVolume只會找到第一個同名的音效，所以同時有兩個以上的音效會有一個不會設定到音量 (看之後要不要修)
        Object.values(eAudioName).map(name => !musicList.includes(name) && PixiSound.setVolumeByName(name, this.audioEffectVolume))
    }
    //#endregion 遊戲音效 effect
}