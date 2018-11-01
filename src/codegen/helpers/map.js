exports.requires = []

exports.definition = `
const $map = function* (f, xs) {
  for (const val of xs) {
    yield f(val)
  }
}`
