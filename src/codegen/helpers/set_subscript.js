exports.requires = []

exports.definition = `
const $setSubscript = (value, xs, key) => {
  if (xs) {
    if (Array.isArray(xs)) {
      xs[key] = value
      return xs
    } else if (xs.type === 'KringleDict') {
      xs.set(key, value)
      return xs
    }
  }
  throw new Error('$setSubscript: not implemented')
}`
