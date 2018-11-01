exports.requires = []

exports.definition = `
const $setSubscript = (value, xs, idx) => {
  if (Array.isArray(xs)) {
    xs[idx] = value
    return xs
  }
  throw new Error('$setSubscript: not implemented')
}`
