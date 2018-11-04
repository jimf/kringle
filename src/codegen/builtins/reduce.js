exports.requires = []
exports.definition = `
let reduce = f => initial => xs => {
  if (xs && typeof xs.reduce === 'function') {
    return xs.reduce((acc, x) => f(acc)(x))
  }
  let result = initial
  for (const x of xs) {
    result = f(result)(x)
  }
  return result
}`
