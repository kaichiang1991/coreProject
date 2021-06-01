import { App } from ".."

export default class AppDebug{
     
    /** 初始化遊戲內的debug */
    public static init(){
        const debugLevel: number = process.env.NODE_ENV == 'production'? eDebugLevel.Error: (eDebugLevel.Log | eDebugLevel.Warn | eDebugLevel.Error)
        Debug.init(App, debugLevel)            // 初始化 Debug

        const debugPanel: HTMLElement = document.querySelector('#div_debug')
        debugPanel.onclick = ()=>{
            this.getAllLog()
            debugger
        }
    }

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