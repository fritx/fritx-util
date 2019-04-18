// 修复js精度bug 过多小数
export function fixPrecision(value: number, p = 5) {
  if (!value) { return value }
  const d = 10 ** p
  return Math.round(value * d) / d
}
