exports.requires = []

exports.definition = `
const $fold = (f, xs) => {
  let acc = null
  let i = 0
  for (const x of xs) {
    acc = i === 0 ? x : f(acc, x)
    i += 1
  }
  if (i === 0) {
    throw new Error('Cannot fold an empty collection')
  }
  return acc
}`
