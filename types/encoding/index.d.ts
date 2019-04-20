declare module 'encoding' {
  export function convert(
    buffer: Buffer,
    toCharset: string,
    fromCharset: string,
  ): Buffer
}
