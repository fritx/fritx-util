import * as cheerio from 'cheerio'

// https://github.com/cheeriojs/cheerio/issues/866#issuecomment-275699121
const cheerioHtml = cheerio.prototype.html

cheerio.prototype.html = function wrapped_html(...args: any[]) {
  let result = cheerioHtml.apply(this, ...args)

  if (typeof result === 'string') {
    result = result.replace(/&#x([0-9a-f]{1,6});/ig, (entity, code) => {
      code = parseInt(code, 16)

      // don't unescape ascii characters, assuming that all ascii characters
      // are encoded for a good reason
      if (code < 0x80) { return entity }

      return String.fromCodePoint(code)
    })
  }

  return result
}

export { cheerio }
