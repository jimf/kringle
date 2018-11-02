exports.requires = ['helpers/$has']

exports.definition = `
function $KringleSet() {
  if (!(this instanceof $KringleSet)) {
    return new $KringleSet()
  }
  this.type = 'KringleSet'
  this.members = {}
}

$KringleSet.empty = function empty () {
  return new $KringleSet([])
}

$KringleSet.prototype._keyFor = function _keyFor (value) {
  const type = value && value.type ? value.type : typeof value
  const val = String(value)
  return '$$' + type + '$$' + val
}

$KringleSet.prototype.has = function has (value) {
  return $has(this.members, this._keyFor(value))
}

$KringleSet.prototype.add = function add (value) {
  if (!this.has(value)) {
    const key = this._keyFor(value)
    this.members[key] = value
  }
}

$KringleSet.prototype.size = function size () {
  return Object.keys(this.members).length
}

$KringleSet.prototype[Symbol.iterator] = function* () {
  for (const val in Object.values(this.members)) {
    yield val
  }
}

$KringleSet.prototype.toString = function toString () {
  const s = '{' + Object.values(this.members).map(String).join(', ') + '}'
  return s === '{}' ? 'Ø' : s
}`
