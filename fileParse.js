const {languageDef} = require('./language')

var imagemin, copyfiles, replaceInFile
const origin = 'assets/img/', _destination = 'assets/img_webp/' 
const quality = 50

// 壓縮所有路徑下的 jpg/png
import('imagemin').then(res =>{
    imagemin = res.default
    import('imagemin-webp').then(res =>{
        const plugins = [res.default({quality})]
        // 把共通語系以及多語系的資料夾內的 png/jpg 壓縮成 webp 並放入 img_webp 相對的資料夾內
        languageDef.concat('').forEach(_path => {
            let path = origin + _path, destination = _destination
            if(path[path.length - 1] !== '/'){
                path += '/'
                destination += _path + '/'
            }
            imagemin([path + '*.{png,jpg}'], {destination, plugins})
        })        
    })

    import('copyfiles').then(res => {
        copyfiles = res.default
        import('replace-in-file').then(res =>{
            replaceInFile = res.default
            languageDef.concat('').forEach(_path =>{
                let path = origin + _path, dest = _destination, up = 2
                if(path[path.length - 1] !== '/'){      // language
                    path += '/'
                    dest += _path + '/'
                    up = 3
                }

                // 複製到相對應的位置
                copyfiles([path + '*.json', path + '*.atlas', dest], up, ()=>{
                    replaceInFile({             // 取代圖集中對應的 image 圖片
                        allowEmptyPaths: true,
                        files: dest + '*.json',
                        from: /(\"image\":\s\"\w*)\.png\"/g,
                        to: "$1.webp\""
                    })
                    replaceInFile({             // 取代 spine atlas 中對應的圖片名稱
                        allowEmptyPaths: true,
                        files: dest + '*.atlas',
                        from: /(\w*)\.png/g,
                        to: "$1.webp"
                    })
                }) 
            })
        })
    })
})