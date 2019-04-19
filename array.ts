export function union(arr: any[]) {
  return [...new Set(arr)]
}

export function ensureArray(v: any) {
  return Array.isArray(v) ? v : [v]
}
