exports.requires = []

exports.definition = `
let indexWhere = f => xs => {
  let i = 0
  for (const x of xs) {
    if (f(x)) {
      return i
    }
  }
  return null
}`
