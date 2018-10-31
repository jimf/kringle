module.exports = `
const indexWhere = f => xs => {
  for (let i = 0, len = xs.length; i < len; i += 1) {
    if (f(xs[i])) {
      return i
    }
  }
  return null
}`
