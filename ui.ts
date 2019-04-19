const zeroChar = '\u200B'

/**
 * @see https://stackoverflow.com/questions/8249770/how-can-i-disable-meta-format-detection-on-ios-for-dates
 * @example
 * ```html
 * `<span>{{ avoidDetection('4月18日周四') }}</span>
 * ```
 */
export function avoidDetection(text: string) {
  return text.split('').join(zeroChar)
}

/**
 * @description `\u00A0`等同于`&nbsp;` DOM中的空格
 * @example
 * ```html
 * `<!-- 此处quantityText有概率以空格开头 需要ensureDomText -->
 * <span class="order-item__quantity">
 *  {{ ensureDomText(order.quantityText) }}
 * </span>
 * ```
 */
export function ensureDomText(text: string) {
  return text.replace(/ /g, '\u00A0')
}

/**
 * @see http://stackoverflow.com/questions/8840580/force-dom-redraw-refresh-on-chrome-mac
 * @example
 * handleWinResize () {
 *   this.forceUpdate(() => {
 *      const el = this.refs.img.refs.el
 *      forceRedraw(el)
 *    })
 *  }
 */
export function forceRedraw(element: HTMLElement) {
  // var n = document.createTextNode(' ');
  // var disp = element.style.display;  // don't worry about previous display style
  // element.appendChild(n);
  // element.style.display = 'none';
  // setTimeout(function(){
  //     element.style.display = disp;
  //     n.parentNode.removeChild(n);
  // },20); // you can play with this timeout to make it as short as possible
  const v = element.style.overflow
  const newV = v === 'hidden' ? 'visible' : 'hidden'
  element.style.overflow = newV
}

// http://stackoverflow.com/questions/14125415/how-can-i-check-if-css-calc-is-available-using-javascript
export function supportsCSSCalc() {
  const prop = 'width:'
  const value = 'calc(10px);'
  const el = document.createElement('div')
  el.style.cssText = ['-webkit-', '', ''].join(prop + value)
  return !!el.style.length
}
