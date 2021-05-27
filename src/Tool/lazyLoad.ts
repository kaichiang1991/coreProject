export default async function lazyLoad(path: string | Array<string>){
    if(!Array.isArray(path))    path = [path]
    return (await Promise.all(path.map(_path => import(/* webpackMode: "lazy-once" */ '@/' + _path)))).map(result => 
        process.env.NODE_ENV == 'production'? result.default.replace(/(\/assets)\//, `$1.${assetsMd5}/`): result.default)
}
