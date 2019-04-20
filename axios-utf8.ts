import { AxiosRequestConfig } from 'axios'
import { bufferToStream } from './helper'
import { bufferUtf8 } from './encoding'
import { axios } from './axios'

// fixme: 应尝试通过adapter等方式实现
export async function axiosUtf8(url: string, options?: AxiosRequestConfig): Promise<any> {
  options = options || {}
  const responseType = options.responseType

  // todo 支持除get以为 其他方法
  const { data: rawBuffer, ...rest } = await axios.get(url, {
    ...options,
    responseType: 'arraybuffer',
  })
  const buffer = bufferUtf8(rawBuffer)
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
