/**
 * @example
 * let fetchRes: FetchRes<T> = () => requestArticle(url)
 * let cachePrefix = 'last:article/view:'
 * let cacheKey = `${cachePrefix}${url}`
 * let getCache: GetCache<T> = async () => {
 *   return st.getStorage(cacheKey)
 * }
 * let doClean = keys => {} // 同类缓存清理策略
 * let setCache: SetCache<T> = async res => {
 *   return st.setStorage(cacheKey, res, doClean)
 * }
 * return useCacheFirst<Res>({ getCache, setCache, fetchRes })
 */
export async function useCacheFirst<T = any>({
  setCache,
  getCache,
  fetchRes,
  duration,
  throttle,
  preferCacheOnExpire,
}: {
  setCache: SetCache<T>,
  getCache: GetCache<T>,
  fetchRes: FetchRes<T>,
  duration?: number,
  throttle?: number,
  preferCacheOnExpire?: boolean,
}) {
  if (duration == null) { duration = Infinity }
  if (throttle == null) { throttle = -1 }

  const fetchAndCache: FetchRes<T> = async (silent) => {
    const res = await fetchRes(silent)
    const cachedAt = Date.now()
    setCache({ res, cachedAt }) // 仅触发
    return res
  }

  const cache = await getCache()
  if (cache != null) {
    const { res, cachedAt } = cache
    const cachedFor = Date.now() - cachedAt
    const isExpired = cachedFor > duration
    const useCache = !isExpired || preferCacheOnExpire
    const inThrottle = cachedFor < throttle
    const invokeFetch = !inThrottle
    if (useCache) {
      if (invokeFetch) {
        fetchAndCache(true) // 仅触发
      }
      return res
    }
  }
  return fetchAndCache(false)
}
