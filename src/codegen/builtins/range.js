exports.requires = []

exports.definition = `
let range = start => end => {
  return function* (step) {
    let n = start
    while (n <= end) {
      yield n
      n += step
    }
  }
}`
