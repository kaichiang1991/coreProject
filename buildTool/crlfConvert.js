const crlf = require('crlf')
const fs = require('fs')
const path = require('path')

//#region assets 的處理
// 對 assets 裡面的檔案進行行尾的轉換
if(fs.existsSync('./assets')){
    fs.readdirSync('./assets/', {withFileTypes: true}).map(asset =>{
        if(asset.isDirectory()){
            fs.readdirSync('./assets/' + asset.name, {withFileTypes: true}).map(file =>{
                if(file.isDirectory()){
                    handleFolder(asset.name, file.name)
                }else{
                    handleFile(asset.name, file.name)
                }
            })
        }
    })
}

/**
 * 處理單檔
 * @param {*} folder assets下，資料夾的名稱
 * @param  {...any} name 資料夾下的名稱
 */
function handleFile(folder, ...name){
    const _path = path.resolve(__dirname, '../assets', folder, ...name)
    if(!/\.(atlas|json|fnt)$/.test(_path))
        return

    switch(folder){
        case 'font':
            crlf.set(_path, 'LF', function(err, type){
                if(err){
                    console.log('解析檔案行尾錯誤', _path)
                }
            })
        break
        case 'img':
            crlf.set(_path, 'LF', function(err, type){
                if(err){
                    console.log('解析檔案行尾錯誤', _path)
                }
            })
        break
    }
}

/**
 * 處理資料夾
 * @param {*} folder assets下資料夾的名稱
 * @param {*} name 下一層資料的名稱
 */
function handleFolder(folder, name){
    const _path = path.resolve(__dirname, '../assets', folder, name)
    fs.readdirSync(_path).map(file =>{
        handleFile(folder, name, file)
    })
}
//#endregion assets 的處理