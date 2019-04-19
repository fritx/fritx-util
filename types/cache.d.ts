interface ICacheWrap<T> { res: T, cachedAt: number }
type SetCache<T> = (cache: ICacheWrap<T>) => Promise<void>
type GetCache<T> = () => Promise<ICacheWrap<T>>
type FetchRes<T> = (silent: boolean) => Promise<T>
