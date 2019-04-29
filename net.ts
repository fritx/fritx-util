import { cheerio as libCheerio } from './cheerio'
import { methodDecorator } from './helper'
import { axiosUtf8 } from './axios-utf8';

export function fetchRaw(rawProcess?: RawProcess): MethodDecorator {
  return methodDecorator((original: SelectorProcess) => {
    const wrapped: UrlProcess = async (url) => {
      let { data: html } = await axiosUtf8(url)
      if (rawProcess) {
        html = rawProcess(html, url)
      }
      const $ = libCheerio.load(html)
      return original($, url, html)
    }
    return wrapped
  })
}
