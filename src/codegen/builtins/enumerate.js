exports.requires = []

exports.definition = `
let enumerate = xs => {
  let i = 0
  for (const x of xs) {
    yield [i, x]
    i += 1
  }
}`
