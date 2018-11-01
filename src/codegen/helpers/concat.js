exports.requires = []

exports.definition = `
const $concat = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') { return a + b }
  const isSameType = ((a.type && a.type === b.type) || typeof a === typeof b)
  if (isSameType && typeof a.concat === 'function') {
    return a.concat(b)
  }
  throw new Error('Type mismatch')
}`
