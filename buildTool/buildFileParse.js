/** webpack bundle 之後，為 assets資料夾加上 md5 */
const md5 = require('md5-dir')
const fs = require('fs')

const md5Dir = './assets', finalDir = './dist/Release/assets'
fs.renameSync(finalDir, finalDir + '.' + md5.sync(md5Dir))      // 為資料夾名稱加上 md5