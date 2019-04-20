import { AxiosRequestConfig } from 'axios'
import { bufferToStream } from './helper'
import { bufferUtf8 } from './encoding'
import { axios } from './axios'

interface IAxiosRequestConfigUtf8 extends AxiosRequestConfig {
  fromCharset?: string,
}

// fixme: 应尝试通过adapter等方式实现
export async function axiosUtf8(url: string, options?: IAxiosRequestConfigUtf8): Promise<any> {
  options = options || {}
  const { fromCharset,  ...restOptions } = options
  const { responseType } = options

  const { data: rawBuffer, ...rest } = await axios.get(url, {
    ...restOptions,
    responseType: 'arraybuffer',
  })

  let myFromCharset = fromCharset

  // todo 提出到业务逻辑 与工具方法分离
  // 可能识别的 jschardet 不准确
  // taobao GB2312 判定为 ISO-8859-2
  // https://github.com/aadsm/jschardet/issues/34
  // http://bbs.chinaunix.net/thread-616945-1-1.html
  // https://blog.csdn.net/z1134145881/article/details/46832685
  // https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings
  const isTaobao = /[/.]item\.taobao\.com/i.test(url)
  if (isTaobao) { myFromCharset = 'GB2312' }

  const buffer = bufferUtf8(rawBuffer, myFromCharset)
  let data: any

  // https://github.com/axios/axios/blob/master/index.d.ts
  // ResponseType = arraybuffer | blob | document | json | text | stream
  if (!responseType) {
    data = buffer.toString()
    try {
      data = JSON.parse(data)
    } catch (err) {
      // ignore
    }
  } else if (responseType === 'arraybuffer') {
    data = buffer
  } else if (responseType === 'json') {
    data = buffer.toString()
    data = JSON.parse(data)
  } else if (responseType === 'text') {
    data = buffer.toString()
  } else if (responseType === 'stream') {
    data = bufferToStream(buffer)
  } else {
    throw new Error(`responseType=${responseType} 此处不支持`)
  }
  return { data, ...rest }
}
