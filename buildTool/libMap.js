const fs = require('fs')

module.exports = fs.readdirSync('./Lib', {withFileTypes: true}).filter(path => path.isDirectory() && !/\.git/.test(path.name)).map(file => '/' + file.name)