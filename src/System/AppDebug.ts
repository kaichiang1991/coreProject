import { App } from ".."

export default class AppDebug{
     
    /** 初始化遊戲內的debug */
    public static init(){
        const debugLevel: number = process.env.NODE_ENV == 'production'? eDebugLevel.Error: (eDebugLevel.Log | eDebugLevel.Warn | eDebugLevel.Error)
        Debug.init(debugLevel)            // 初始化 Debug

        Debug.divPanel.onclick = ()=>{
            this.getAllLog()
            debugger
        }
    }

    /** 初始化 divPanel */
    public static initDivPanel(){
        // 讀取 url 判斷是否要預設打開
        const urlObj: Object = PIXI.utils.url.parse(document.URL, true)
        if(urlObj['query']['panel'] != undefined){
            Debug.activePanel(true, App)
        }
    }

    //#region 透過 getter 開關
    public static get On(){
        Debug.activePanel(true, App)
        return 'Panel On'
    }
    public static get Off(){
        Debug.activePanel(false)
        return 'Panel Off'
    }
    //#endregion 透過 getter 開關
    
    /**
     * 開發模式下，將log記錄起來
     * @param key 
     * @param context 
     * @returns 
     */
    public static writeLog(key: string, context: any){
        if(process.env.NODE_ENV == 'production')    
            return
        
        Debug.writeLog(key, context)
    }

    /** 顯示所有的 Log */
    public static getAllLog(){
        Debug.getAllLog()
    }
}

window['AppDebug'] = AppDebug