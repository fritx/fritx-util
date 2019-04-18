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
