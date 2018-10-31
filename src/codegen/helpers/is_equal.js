module.exports = `
const $isEqual = (a, b) => {
  if (a === b) {
    return true
  } else if (a && typeof a.isEqual === 'function') {
    return a.isEqual(b)
  } else if (typeof a === 'object' && a != null && typeof b === 'object' && b != null) {
    if (Object.keys(a).length !== Object.keys(b).length) { return false }
    for (let k in a) {
      if (Object.prototype.hasOwnProperty.call(a, k)) {
        if (!Object.prototype.hasOwnProperty.call(b, k) || !$isEqual(a[k], b[k])) {
          return false
        }
      }
    }
    return true
  }
  return false
}`
