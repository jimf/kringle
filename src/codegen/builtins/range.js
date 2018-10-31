module.exports = `
let range = start => end => {
  return function* (step) {
    let n = start
    while (n <= end) {
      yield n
      n += step
    }
  }
}`
