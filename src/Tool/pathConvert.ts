export default function pathConvert(path: string): string{
    if(/\.json/.test(path)){
        return path.replace(/img\//, 'img_webp/')
    }else{
        return path.replace(/(img\/)(\w*)(\.png)/, 'img_webp/$2.webp')
    }
}