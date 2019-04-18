export function createCleanMap(data?: {}) {
  const map = Object.create(null)
  if (data) { Object.assign(map, data) }
  return map
}
