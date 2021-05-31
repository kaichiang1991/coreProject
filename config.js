const {name, version} = require('./package.json?edit')

module.exports = {
    name, version,
    size: {width: 720, height: 1280},
    canUseWebp: false,
    fps: 60
}