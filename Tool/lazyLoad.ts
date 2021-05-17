export default async function lazyLoad(path: string | Array<string>){
    if(!Array.isArray(path))    path = [path]
    return (await Promise.all(path.map(_path => import(/* webpackMode: "lazy-once" */ '@/' + _path)))).map(result => result.default)
}