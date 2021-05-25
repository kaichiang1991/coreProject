/**
 * 轉換讀取檔案的路徑  img -> img_webp
 * @param path 
 * @returns 
 */
export default function pathConvert(path: string): string{
    if(/\.json/.test(path)){
        return path.replace(/img\//, 'img_webp/')
    }else{
        return path.replace(/(img\/)(\w*)(\.png)/, 'img_webp/$2.webp')
    }
}