exports.requires = ['helpers/$has']

exports.definition = `
function $KringleDict() {
  if (!(this instanceof $KringleDict)) {
    return new $KringleDict()
  }
  this.type = 'KringleDict'
  this.members = {}
}

$KringleDict.prototype._keyFor = function _keyFor (keyValue) {
  const type = keyValue && keyValue.type ? keyValue.type : typeof keyValue
  const val = String(keyValue)
  return '$$' + type + '$$' + val
}

$KringleDict.prototype.has = function has (value) {
  return $has(this.members, this._keyFor(value))
}

$KringleDict.prototype.set = function set (key, value) {
  const k = this._keyFor(key)
  this.members[k] = [key, value]
}

$KringleDict.prototype.get = function get (key) {
  if (!this.has(key)) { return null }
  return this.members[this._keyFor(key)][1]
}

$KringleDict.prototype.size = function size () {
  return Object.keys(this.members).length
}

$KringleDict.prototype.toString = function toString () {
  return '{' + Object.values(this.members).map(([k, v]) => String(k) + ': ' + String(v)).join(', ') + '}'
}`
