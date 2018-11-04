exports.requires = []

exports.definition = `
const $map = (f, xs) => {
  if (xs && typeof xs.map === 'function') { return xs.map(x => f(x)) }
  // TODO: map should preserve shape
  const result = []
  for (const x of xs) {
    result.push(f(x))
  }
  return result
}`
