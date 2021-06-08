const {name, version} = require('./package.json?edit')

module.exports = {
    name, version,
    size: {width: 720, height: 1280},
    canUseWebp: false,      // 預設值，進遊戲要先設定
    portrait: true          // 預設值，進遊戲要先設定
}