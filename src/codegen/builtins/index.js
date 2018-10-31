const builtins = {
  add: require('./add'),
  captures: require('./captures'),
  chars: require('./chars'),
  enumerate: require('./enumerate'),
  findall: require('./findall'),
  inc: require('./inc'),
  indexWhere: require('./index_where'),
  Inf: require('./inf'),
  int: require('./int'),
  isEven: require('./is_even'),
  lines: require('./lines'),
  len: require('./len'),
  lt: require('./lt'),
  map: require('./map'),
  md5: require('./md5'),
  min: require('./min'),
  print: require('./print'),
  range: require('./range'),
  scanl: require('./scanl'),
  split: require('./split'),
  str: require('./str')
}

const builtinsIdx = Object.keys(builtins).reduce((acc, name) => {
  acc[name] = true
  return acc
}, {})

const isBuiltin = name => builtinsIdx[name] === true

module.exports = { builtins, isBuiltin }
