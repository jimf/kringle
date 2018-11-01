exports.requires = []

// TODO: Make lazy
exports.definition = `
let scanl = f => seed => xs =>
  xs.reduce((acc, x, idx) => {
    const prev = idx === 0 ? seed : acc[idx - 1]
    acc.push(f(prev)(x))
    return acc
  }, [])`
