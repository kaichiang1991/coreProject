import GameSlotData from "@root/src/Game/GameSlotData"
import { eCommand } from "./GameDataRequest"
import { pingDuration } from '@root/config'
import GameSceneManager, { eGameScene } from "../GameSceneController"

enum eJoinGameError{
    Success = 0,
    Failed = 1,
    NotReady = 2,
    MismatchGameCode = 3,
    GameDisabled = 4,
    AlreadyInThisGame = 5
}

enum eGameError{
    None = 0,
    IdleForceClose = 1
}

// 忽略不要印log的種類
const ignoreShowLog: Array<number> = [eCommand.CtoGPing, eCommand.GtoCPong]

export class NetworkManager{
    
    private static websocket: WebSocket
    private static callbackArr: Array<Function>
    private static pongTimeout: number

    public static async init(){
        return new Promise<void>(res =>{
            this.callbackArr = Array<Function>()

            this.websocket = new WebSocket(ParameterParse.UrlParser.gameServer)
            this.websocket.onopen = this.onOpen.bind(this, res)
            this.websocket.onerror = this.onError
            this.websocket.onclose = this.onClose
            this.websocket.onmessage = this.onMsg.bind(this)
        })
    }

    /**
     * 送request給server
     * @param {ICtoGStructure} data 
     * @returns {IGtoCStructure}
     */
    public static async sendMsg(data: ICtoGStructure){
        return new Promise<IGtoCStructure>(res =>{

            if(this.websocket.readyState != WebSocket.OPEN)
                return

            // 將回傳後的名稱存入 callback 陣列
            const {Code} = data
            this.callbackArr[eCommand[Code].replace('CtoG', 'GtoC')] = res

            const jsonData: string = JSON.stringify(data)
            this.websocket.send(jsonData)
            if(!ignoreShowLog.includes(data.Code))
                Debug.log('sendMsg', eCommand[Code], jsonData)
        })
    }

    /** 關閉 websocket */
    public static closeWebsocket(){
        if(this.websocket.readyState != WebSocket.OPEN)
            return
        this.websocket?.close()
    }

    //#region websocket callback 
    /**
     * 成功連接到 websocket 的 callback
     * @param callback 成功連接後執行的callback
     */
    private static onOpen(callback: Function){
        callback()
        this.setPingPong(true)
    }

    /**
     * websocket 出現錯誤的callback
     * @param e 錯誤訊息內容
     */
    private static onError(e: Event){
        Debug.error('Network onError', e)
    }

    /**
     * websocket 關閉時的callback
     * @param e 關閉訊息內容
     */
    private static onClose(e: CloseEvent){
        Debug.error('Network onClose', e)
        const msg: string = LocalizationManager.systemText('ConnectClose')
        Debug.warn(msg, new Date().toLocaleString())
        GameSceneManager.switchGameScene(eGameScene.systemError, msg)       // 顯示錯誤訊息
    }

    /**
     * websocket 收到訊息的callback
     * @param e 收到的訊息內容
     */
    private static onMsg(e: MessageEvent){
        const data = JSON.parse(e.data)
        if(!ignoreShowLog.includes(data.Code))
            Debug.log('Network onMsg', eCommand[data.Code], data)

        switch(data.Code){
            //#region JoinGame
            case eCommand.GtoCJoinGame:
                switch(data.Result){
                    case eJoinGameError.Success:    break
                    case eJoinGameError.Failed:
                    case eJoinGameError.MismatchGameCode:
                        GameSceneManager.switchGameScene(eGameScene.systemError, LocalizationManager.systemText('TokenInvalid'))        // 顯示系統錯誤訊息
                        break
                    case eJoinGameError.NotReady:
                    case eJoinGameError.GameDisabled:
                    case eJoinGameError.AlreadyInThisGame:
                        this.closeWebsocket()
                        break
                    default:
                        Debug.error('JoinGame 收到資料錯誤', data.Result)
                        this.closeWebsocket()
                        break
                }
            break
            //#endregion
            //#region SlotInit
            case eCommand.GtoCSlotInit:
                GameSlotData.SlotInitData = data
            break
            //#endregion
            //#region PingPong
            case eCommand.GtoCPong:
                this.setPingPong(false)
            break
            //#endregion
            //#region GameError
            case eCommand.GtoCGameError:
                switch(data.ErrorReason){
                    case eGameError.None:
                        this.closeWebsocket()
                        break
                    case eGameError.IdleForceClose:
                        GameSceneManager.switchGameScene(eGameScene.systemError, LocalizationManager.systemText('IdleForceClose'))        // 顯示系統錯誤訊息
                        break
                }
            break
            //#endregion
            //#region PlayerBalance
            case eCommand.GtoCPlayerBalance:        // Server 廣播更新餘額
                if(!BetModel.getInstance().BetInterval)
                    return
                BetModel.getInstance().credit = data.Balance
                EventHandler.dispatch(eEventName.betModelChange, {betModel: BetModel.getInstance()})
            break
            //#endregion
            //#region JackPot
            case eCommand.GtoCJackpotValue:         // Server 廣播獎金

            break
            //#endregion
        }

        if(data.Result > 0){     // 有錯誤
            this.closeWebsocket()
            return
        }

        this.callbackArr[eCommand[data.Code]] && this.callbackArr[eCommand[data.Code]](data)
    }
    //#endregion

    /**
     * 設定 ping pong
     * @param ping true 送ping / false 收到pong
     */
    private static setPingPong(ping: boolean){
        if(!this.websocket)
            return

        const pongDuration: number = pingDuration * 3        // 多久沒收到 pong 後踢掉
        const pongTimeoutFn: Function = ()=>{                // 太久沒收到pong後執行的函式
            Debug.error(`no pong for ${pongDuration} ms. Close websocket.`)
            this.closeWebsocket()
            return
        }

        if(ping){
            this.sendMsg({Code: eCommand.CtoGPing})
            // 計時下一次送 ping 
            setTimeout(() => {
                this.setPingPong(true)
            }, pingDuration)

            if(!this.pongTimeout){      // 清除 pong 的計時
                this.pongTimeout = setTimeout(pongTimeoutFn, pongDuration)
            }
            
        }else{
            // 清除 timeout 並重新設定
            this.pongTimeout && clearTimeout(this.pongTimeout)
            this.pongTimeout = setTimeout(pongTimeoutFn, pongDuration)  
        }
    }
}