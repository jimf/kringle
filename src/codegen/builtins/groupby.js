exports.requires = ['data/Tuple']
exports.definition = `
let groupby = f => xs => {
  let result = []
  let prevKey = null
  let key = null
  let group = []
  for (const x of xs) {
    key = f(x)
    if (key === prevKey || !group.length) {
      group.push(x)
    } else {
      result.push($KringleTuple([prevKey, group]))
      group = [x]
    }
    prevKey = key
  }
  if (group.length) {
    result.push($KringleTuple([prevKey, group]))
  }
  return result
}`
