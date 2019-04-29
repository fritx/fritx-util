import { cheerio as libCheerio } from './cheerio'
import { methodDecorator } from './helper'
import { Browser, launch } from 'puppeteer'

export const launchOptions = {
  // Running as root without --no-sandbox is not supported.
  // See https://crbug.com/638180.
  // TROUBLESHOOTING: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
  args: ['--no-sandbox'],
  // headless: false,
}
export const navigationTimeout = 1000 * 60

// tslint:disable-next-line max-line-length
export const uaDesktop = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
export const vpDesktop = { height: 800, width: 1280 }

// tslint:disable-next-line max-line-length
export const uaMobile = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
export const vpMobile = { height: 568, width: 320 }

let pendingPromise: Promise<Browser>

export function browserRender(behavior: PageBehavior, isMobile?: boolean): MethodDecorator {
  return methodDecorator((original: SelectorProcess) => {
    const wrapped: UrlProcess = async (url) => {
      const browser = await ensureBrowser()
      const page = await browser.newPage()
      let html: string
      try {
        if (isMobile) {
          await page.setUserAgent(uaMobile)
          await page.setViewport(vpMobile)
        } else {
          await page.setUserAgent(uaDesktop)
          await page.setViewport(vpDesktop)
        }
        await page.goto(url, {
          timeout: navigationTimeout,

          // todo 检查其他用到puppeteer抓取的站点 改为documentloaded是否影响
          // douyin不影响 meipai好像影响 weibo-legacy不管
          // https://github.com/GoogleChrome/puppeteer/issues/1666
          // waitUntil: 'load',
          waitUntil: 'domcontentloaded',
        })
        await behavior(page)
        html = await page.evaluate(() => document.querySelector('html').outerHTML)
      } finally {
        await page.close()
      }
      const $ = libCheerio.load(html)
      return original($, url, html)
    }
    return wrapped
  })
}

async function ensureBrowser(): Promise<Browser> {
  if (pendingPromise) { return pendingPromise }
  pendingPromise = launch(launchOptions)
  return pendingPromise
}
