exports.requires = []

exports.definition = `
let int = x => {
  if (typeof x === 'number') { return x }
  const result = parseInt(x, 10)
  if (isNaN(result)) {
    throw new Error('Unable to convert "' + x + '" to Integer')
  }
  return result
}`
