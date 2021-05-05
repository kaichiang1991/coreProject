## 新建 Lib 的環境
### npm 指令
- build:dev   把程式經過 webpack 打包成 '開發模式'，並監測檔案的變化
- serve       打開 live-server 監測 Debug 資料夾
- start       同時間 build 和打開 live-server
- build       打包成最後的檔案

### 檔案結構
- index.ts                                      Lib 製作的入口
- main.ts                                       npm start 測試時，拿來測試功能的入口
- tsconfig.(dev|prod).json                      typescript 編譯時的設定檔
- webpack.common.js / webpack.(dev|prod).js     webpack 設定黨
- template.cshtml                               HtmlWebpackPlugin 產出的模板

### 發布方式
- npm run build 把所有東西打包到 Release 資料夾
- 整個 Release 資料夾放上 git，存自己一個位置 (自定義名稱)

### ToDo
#### package.json
- name: 更改為 Lib 的名字
- version: 更改為 Lib 的版號
- config: 設定一些程式內會用到的設定檔  e.g. size, ...

#### 模組開發
- 定義 module 名稱
- 要供外部使用的 class, function 要使用 export 詞綴

#### 開發注意事項
- 入口都要有一個 init Function，要印出 Lib 名稱和版號
- 引用的 json 檔直接使用 import， webpack 會把他打包到 bundle 內
- 提供外部使用的 API 要寫 JSDoc 文件