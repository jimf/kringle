module.exports = `
let int = x => {
  const result = parseInt(x, 10)
  if (isNaN(result)) {
    throw new Error('Unable to convert "' + x + '" to Integer')
  }
  return result
}`
