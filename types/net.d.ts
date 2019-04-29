type RawProcess = (str: string, url: string) => string
type UrlProcess = (url: string) => Promise<any>
type SelectorProcess = ($: CheerioStatic, url: string, raw: string) => Promise<any>
