import { Context, Middleware } from 'koa'

/**
 * @example
 * ```ts
 * `const koaJson = koaMerge(koaBody, async (ctx, next) => {
 *   let { body } = ctx.request
 *   // ...
 *   await next()
 * })
 * ```
 */
export function merge(a: Middleware, b: Middleware, ...rest: Middleware[]) {
  const ret = async (ctx: Context, next: Next) => {
    await a(ctx, async () => {
      await b(ctx, next)
    })
  }
  if (rest.length) {
    ret = merge(ret, ...rest)
  }
  return ret
}
