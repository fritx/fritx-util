import { noop } from './function'

export function delay(ms: number) {
  return t2p((cb) => {
    setTimeout(cb, ms)
  })
}

export function t2p<T extends any[]>(thunk: Thunk<T>) {
  return new Promise<T>((resolve, reject) => {
    thunk((err, ...args: T) => {
      err ? reject(err) : resolve(args)
    })
  })
}

/**
 * @description
 * hack: 使该async方法始终阻塞下去不执行 如 await hang()
 * 场景如：location跳转为异步 防止后续多余的调用报错
 * @see https://www.zhihu.com/question/42268360
 * @example
 * ```
 * `auth () {
 *   window.location.reload()
 *   return hang()
 * },`
 * ```
 */
export function hang() {
  return new Promise(noop)
}

/**
 *
 * @see https://blog.fritx.me/?weekly/170625
 * @see https://github.com/tim-kos/node-retry#retrytimeoutsoptions
 * @example
 * ```ts
 * `return retry(async attempt => {
 *   try {
 *     return await _fetchApi(...args)
 *   } catch (err) {
 *     // https://github.com/github/fetch/blob/c3e1019567262158f96309c8a9579adddaa7f894/fetch.js#L438-L444
 *     if (/Network request failed/.test(err) ||
 *         /Failed to fetch/.test(err) ||
 *         /Type error/.test(err)) {
 *       let nErr = new Error('网络请求失败，请检查网络')
 *       nErr.status = 0
 *       return attempt(nErr)
 *     }
 *     throw err
 *   }
 * })
 * // or
 * await retry(async attempt => {
 *   let [resp, data] = await request(url)
 *     if (resp.statusCode !== 200) {
 *     let err = new Error(`${resp.statusCode} !== 200`)
 *     return attempt(err) // 某些异常时 可重试 重试次数达上限 才返回该异常
 *   }
 *   let { result: { url } } = data
 *   return url // 正常时 返回结果
 * }
 * ```
 */
export async function retry(func: Thunk, opts: {
  retries?: number,
  factor?: number,
  minTimeout?: number,
} = {}) {
  if (opts.retries == null) { opts.retries = 10 }
  if (opts.factor == null) { opts.factor = 2 }
  if (opts.minTimeout == null) { opts.minTimeout = 1000 }

  let retried = 0
  let lastWait: number
  let firstErr: CallbackError

  const attempt: Callback = async (err) => {
    if (firstErr == null) { firstErr = err }
    if (retried >= opts.retries) {
      throw firstErr // 第一个err可能更有参考价值
    }
    retried++

    const wait = lastWait == null
      ? opts.minTimeout
      : lastWait * opts.factor
    await delay(wait)
    lastWait = wait
    return func(attempt)
  }
  return func(attempt)
}
