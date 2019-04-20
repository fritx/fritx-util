declare module 'jschardet' {

  interface IReportUnit {
    encoding: string,
    confidence: number,
  }

  export function detect(buffer: Buffer): IReportUnit | null
}
