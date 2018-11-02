exports.requires = []
exports.definition = `
const $contains = (xs, x) => {
  if (xs && typeof xs.has === 'function') {
    return xs.has(x)
  }
  throw new Error('$contains not implemented for ' + typeof xs)
}`
