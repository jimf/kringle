module.exports = `
const $opMod = (left, right) => {
  if (typeof left === 'string') {
    if (!Array.isArray(right)) {
      right = [right]
    }
    return right.reduce((acc, v) => {
      return acc.replace('{}', String(v))
    }, left)
  } else if (typeof left === 'number' && typeof right === 'number') {
    return left % right
  }
  throw new Error('Invalid data type supplied to %')
}`
