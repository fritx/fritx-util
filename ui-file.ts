type FileListReturn = FileList | any[]

export function getUpload(op: {
  accept: string,
  multiple: boolean,
}) {
  return new Promise<FileListReturn>((resolve) => {
    let finished = false
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = op.accept
    input.multiple = op.multiple

    const finish = (result: FileListReturn) => {
      if (finished) { return }
      finished = true
      resolve(result)
      cleanup()
    }
    const handleInputChange = () => {
      finish(input.files)
    }
    const handleWindowFocus = () => {
      setTimeout(() => {
        finish([])
      }, 1000)
    }
    const cleanup = () => {
      window.removeEventListener('focus', handleWindowFocus)
      input.removeEventListener('change', handleInputChange)
    }

    window.addEventListener('focus', handleWindowFocus)
    input.addEventListener('change', handleInputChange)
    input.click()
  })
}
