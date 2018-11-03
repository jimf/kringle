exports.requires = []

exports.definition = `
const $subscript = (xs, start, end) => {
  if (start < 0) { start = xs.length + start }
  if (end == null) {
    if (Array.isArray(xs) || typeof xs === 'string') {
      return xs[start]
    } else if (xs.type === 'KringleDict') {
      return xs.get(start)
    }
    end = start + 1
  } else if (end < 0) {
    end = xs.length + end
  }
  return xs.slice(start, end + 1)
}`
