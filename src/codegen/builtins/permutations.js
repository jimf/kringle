exports.requires = []
exports.definition = `
let permutations = (xs) => {
  if (!Array.isArray(xs)) { xs = [...xs] }
  const len = xs.length
  if (len < 2) {
    return xs
  } else if (len === 2) {
    return [[xs[0], xs[1]], [xs[1], xs[0]]]
  }
  const result = []
  for (let i = 0; i < len; i += 1) {
    permutations(xs.slice(0, i).concat(xs.slice(i + 1))).forEach((ys) => {
      result.push([xs[i]].concat(ys))
    })
  }
  return result
}`
