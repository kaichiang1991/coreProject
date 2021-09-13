## 用來做每一款slot game 的基底
### package name = "BNXX" 
- CI 內會使用到的名字，不可以加遊戲名稱 e.g. BN09_Bibo

### 用 npm version 下版號
- 會讀取版號去做CI
- 版號後面可以加上新增的註解
    npm version (patch|minor|major| 數字 ) -m '註解'

### CI
- 要先手動在 release 新增 BNXX 的專案位置
- push 上 gitlab 後，有tag / 手動 run pipeline 會執行 CI 流程
- CI build 完之後，可以從 gitlab 下載 build 好的專案
- CI 流程會直接抓 build/Lib 內最新的專案，所以有可能跟本地的Lib 版本不同
    - 預防萬一最好本地在測試時也會先更新 Lib submodule

### npm script
    - setStripTab: 設定 strip.json 的格式(把tab換成" ")，方便搜尋滾輪表，用不到可以不用執行
    - updateSubmodule: 更新遠端最新的 Lib/types 
    - crlfConvert: 轉換 assets 內部檔案的換行字元
    - fileParse: 解析並產出 webp 的檔案
    - prepareFile: 轉換字尾 並 解析檔案
    -------- 遊戲測試時只要確保有跑 prepareFile 就好，Lib可以在開發時調整 ---------

    -------- 遊戲開發 --------
    build:dev: 打包成開發版本
    serve: 監聽 ./dist/Debug 資料夾，用以開發
    start: 同時 build 並 監聽資料夾

    -------- 遊戲打包 --------
    build: 打包成正式版本
    postbuild: 解析build後的檔案，並加上 hash
    
    註: 正式要釋出時都會直接從 gitlab CI 下去做
    可以先在本地跑過build，確保程式沒問題
