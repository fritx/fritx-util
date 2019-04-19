import { Context, Middleware } from 'koa'
import { useCacheFirst } from './cache'
import { methodDecorator } from './helper'

/**
 * @example
 * ```ts
 * `const koaJson = compose(koaBody, async (ctx, next) => {
 *   let { body } = ctx.request
 *   // ...
 *   await next()
 * })
 * ```
 */
export function compose(a: Middleware, b: Middleware, ...rest: Middleware[]) {
  const ret = async (ctx: Context, next: Next) => {
    await a(ctx, async () => {
      await b(ctx, next)
    })
  }
  if (rest.length) {
    return compose(ret, ...rest)
  }
  return ret
}

/**
 * @description 将约定的controller 包裹为koa的middleware
 * @example
 * ```ts
 * `@koaWrap()
 * public static async digestView(ctx: Context): Promise<IDigestResponse> {
 * ```
 */
export function koaWrap(): MethodDecorator {
  return methodDecorator((controller: Controller) => {

    const middleware: Middleware = async (ctx, next) => {
      const response = await controller(ctx, next)

      if (response != null) {
        ctx.body = response

        if (response.status) {
          ctx.status = response.status
        }
      }
    }
    return middleware
  })
}
