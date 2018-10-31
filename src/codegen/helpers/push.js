module.exports = `
const $push = (xs, x) => {
  if (typeof xs.push === 'function') {
    xs.push(x)
  } else if (typeof xs.add === 'function') {
    xs.add(x)
  }
}`
