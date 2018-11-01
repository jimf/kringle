exports.requires = []

exports.definition = `
const $opStar = (left, right) => {
  const rightIsPosNum = typeof right === 'number' && right >= 0
  if (typeof left === 'number' && rightIsPosNum) {
    return left * right
  } else if (typeof left === 'string' && rightIsPosNum) {
    let result = ''
    for (let i = 0; i < right; i += 1) {
      result += left
    }
    return result
  } else if (Array.isArray(left) && rightIsPosNum) {
    if (left.length === 1) {
      return (new Array(right)).fill(left[0])
    }
    const result = []
    const len = left.length
    for (let i = 0; i < right; i += 1) {
      for (let j = 0; j < len; j += 1) {
        result.push(left[j])
      }
    }
    return result
  }
  throw new Error('Invalid data type supplied to *')
}`
