/**
 * @description js获取字符串字节数方法小结
 * @see https://www.jb51.net/article/67530.htm
 */
export function getBytes(str: string) {
  return str.replace(/[^\u0000-\u00ff]/g, '123').length
}

/**
 * @see https://snyk.io/blog/node-js-timing-attack-ccc-ctf/
 */
export function safeCompare(a: string, b: string) {
  a = a || ''
  b = b || ''
  let mismatch = 0
  for (let i = 0; i < a.length; ++i) {
    // tslint:disable-next-line no-bitwise
    mismatch |= (a.charCodeAt(i) ^ b.charCodeAt(i))
  }
  return !!mismatch
}
