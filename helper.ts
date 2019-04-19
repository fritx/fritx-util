import { Readable } from 'stream'

/**
 * @example
 * ```ts
 * `const videoCover = await withFallbacks<string>(
 *  () => $('.poster_pic').attr('src'),
 *  () => $('.tvp_poster_img').attr('style').match(/url\((.+)\)/)[1],
 *  () => raw.match(/"shareImgUrl":"(.+?)"/)[1],
 * )
 * ```
 */
export async function withFallbacks<T = any>(...fns: Array<SyncOrAsync<any[], T>>): Promise<T> {
  for (const fn of fns) {
    let ret: T
    try {
      ret = await fn()
    } catch (err) {
      // ignore
    }
    if (ret != null) { return ret }
  }
  return null
}

type Condition<T> = (obj: T) => boolean

export function collectingHelper <T>(obj: T, resolve: Resolve, condition: Condition<T>) {
  const set = (patch: Partial<T>) => {
    Object.assign(obj, patch)
    if (condition(obj)) { resolve() }
  }
  return [set]
}

export function methodDecorator<TO, TW>(wrap: (original: TO) => TW): MethodDecorator {
  return (target, key, descriptor: TypedPropertyDescriptor<any>) => {
    const original = descriptor.value
    const wrapped = wrap(original)
    descriptor.value = wrapped
    return descriptor
  }
}

/**
 * @see https://stackoverflow.com/questions/38035222/eslint-like-globals-in-tslint
 * @see https://stackoverflow.com/questions/13955157/how-to-define-static-property-in-typescript-interface
 * @see https://stackoverflow.com/a/43674389/10939480
 * @example
 * ```ts
 * `@staticImplements<IExtractorStatic>()
 * export class Extractor {
 * ```
 */
export function staticImplements<T>() {
  // tslint:disable-next-line no-empty
  return (target: T) => {}
}

/**
 * @see https://stackoverflow.com/questions/47089230/how-to-convert-buffer-to-stream-in-nodejs/54136803#54136803
 * @example
 * ```ts
 * `} else if (responseType === 'text') {
 *   data = buffer.toString()
 * } else if (responseType === 'stream') {
 *   data = bufferToStream(buffer)
 * }
 * ```
 */
export function bufferToStream(buffer: Buffer): Readable {
  return new Readable({
    read() {
      this.push(buffer)
      this.push(null)
    },
  })
}
