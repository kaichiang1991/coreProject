/** webpack bundle 之後，為 assets資料夾加上 md5 */
const md5 = require('md5-dir')
const fs = require('fs')

const folderName = './dist/Release/assets'
fs.renameSync(folderName, folderName + '.' + md5.sync(folderName))      // 為資料夾名稱加上 md5