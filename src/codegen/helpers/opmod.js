exports.requires = []

exports.definition = `
const $opMod = (left, right) => {
  if (typeof left === 'string') {
    const parts = left.split('{}')
    if (parts.length === 1) { return parts[0] }
    const vars = (right && right.type === 'KringleTuple') ? [...right] : [right]
    let result = ''
    for (let i = 0, len = parts.length; i < len; i += 1) {
      result += parts[i]
      if (i < len - 1) {
        if (i < vars.length) {
          result += String(vars[i])
        } else {
          throw new Error('Not enough arguments supplied to template string')
        }
      }
    }
    return result
  } else if (typeof left === 'number' && typeof right === 'number') {
    return left % right
  }
  throw new Error('Invalid data type supplied to %')
}`
