
// https://stackoverflow.com/questions/42645964/vue-js-anchor-to-div-within-the-same-component
export function scrollTo(element: HTMLElement, container = document.body) {
  if (!element) { return }
  const offset = getTotalOffset(element)
  const { left } = offset
  let { top } = offset
  top += container.clientHeight / 4 // 上偏移以留出展示空间
  container.scrollTo(left, top)
}

// tslint:disable-next-line max-line-length
// https://stackoverflow.com/questions/8767812/getting-every-offsetparent-or-the-total-offsettop-and-total-offsetleft/12960078#12960078
export function getTotalOffset(element: HTMLElement) {
  let a = element
  let b = 0
  let c = 0
  while (a) {
    if ('offsetLeft' in a) {
      b += a.offsetLeft
      c += a.offsetTop
    }
    a = a.offsetParent as HTMLElement
  }
  return { left: b, top: c }
}
