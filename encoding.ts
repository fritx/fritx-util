import * as encoding from 'encoding'
import * as jschardet from 'jschardet'

export function bufferUtf8(buffer: Buffer) {
  const ret = jschardet.detect(buffer)
  if (!ret) {
    throw new Error('原字符集无法识别')
  }
  const toCharset  = 'UTF-8'
  const fromCharset = ret.encoding
  if (fromCharset !== toCharset) {
    buffer = encoding.convert(buffer, toCharset, fromCharset)
  }
  return buffer
}
