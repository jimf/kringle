exports.requires = ['data/Tuple']
exports.definition = `
let zip = xs => function* (ys) {
  if (Array.isArray(xs)) { xs = xs.entries() }
  if (Array.isArray(ys)) { ys = ys.entries() }
  while (true) {
    const x = xs.next()
    const y = ys.next()
    if (x.done || y.done) { break }
    yield $KringleTuple([x.value[1], y.value[1]])
  }
}`
