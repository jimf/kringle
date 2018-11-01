exports.requires = []

exports.definition = `
function $KringleTuple (values) {
  if (!(this instanceof $KringleTuple)) { return new $KringleTuple(values) }
  this.values = values || []
  this.type = 'KringleTuple'
}

$KringleTuple.prototype.size = function size () {
  return this.values.length
}

$KringleTuple.prototype.get = function get (idx) {
  if (idx < 0 || idx >= this.values.length) { throw new Error('Tuple index out of bounds') }
  return this.values[idx]
}

$KringleTuple.prototype[Symbol.iterator] = function* () {
  for (const value of this.values) {
    yield value
  }
}

$KringleTuple.prototype.toString = function toString () {
  if (this.values.length === 0) { return '()' }
  const inside = this.values.length === 1
    ? String(this.values[0]) + ','
    : this.values.map(String).join(', ')
  return '(' + inside + ')'
}`
