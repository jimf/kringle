module.exports = `
let len = (xs) => {
  if (xs && typeof xs.size === 'function') {
    return xs.size()
  } else if (Object.prototype.hasOwnProperty.call(xs, 'length')) {
    return xs.length
  } else if (typeof xs === 'object') {
    return Object.keys(xs).length
  }
  throw new Error('Invalid argument supplied to len')
}`
