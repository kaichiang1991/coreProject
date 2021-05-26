const {name} = require('./package.json')
const md5 = require('md5-dir')
const fs = require('fs')

const folderName = './dist/' + name     // 最後產出的 Lib
fs.renameSync(folderName, folderName + '.' + md5.sync(folderName))      // 為資料夾名稱加上 md5