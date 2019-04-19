import { Context } from 'koa'
import { useCacheFirst } from './cache'
import { methodDecorator } from './helper'
import { redis } from './redis'

/**
 * @example
 * ```ts
 * `@koaWrap() @cacheFirst<IDigestResponse>()
 * public static async digestView(ctx: Context): Promise<IDigestResponse> {
 * ```
 */
export function cacheFirst<T = any>({
  throttle,
  duration,
  getKey,
}: {
  throttle: number,
  duration: number,
  getKey: (ctx: Context) => string,
}): MethodDecorator {
  return methodDecorator((original: Controller<T>) => {
    const wrapped: Controller<T> = async (ctx, next) => {
      const cacheKey = getKey(ctx)

      const setCache: SetCache<T> = async (cache) => {
        // tslint:disable-next-line no-console
        console.log(`[cache write] ${cacheKey}`)
        const json = JSON.stringify(cache)
        await redis.set(cacheKey, json)
      }

      const getCache: GetCache<T> = async () => {
        const cacheJson = await redis.get(cacheKey)
        const cache: ICacheWrap<T> = cacheJson && JSON.parse(cacheJson)
        if (cache) {
          // tslint:disable-next-line no-console
          console.log(`[cache hit] ${cacheKey}`)

          const { cachedAt } = cache
          const cachedFor = Date.now() - cachedAt
          const isExpired = cachedFor > duration
          if (isExpired) {
            // tslint:disable-next-line no-console
            console.log(`[cache expired] ${cacheKey}`)
          }
        }
        return cache
      }

      const fetchRes: FetchRes<T> = (silent) => {
        const myNext = silent ? null : next
        return original(ctx, myNext)
      }

      return useCacheFirst<T>({
        duration,
        fetchRes,
        getCache,
        setCache,
        throttle,
      })
    }
    return wrapped
  })
}
