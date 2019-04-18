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
