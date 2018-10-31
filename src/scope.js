function createScope (parent) {
  const symbols = {}

  function define (symbol, value) {
    symbols[symbol] = value
    return value
  }

  function has (symbol) {
    return Object.prototype.hasOwnProperty.call(symbols, symbol)
  }

  function lookup (symbol) {
    if (has(symbol)) {
      return symbols[symbol]
    } else if (parent && parent.has(symbol)) {
      return parent.lookup(symbol)
    }
  }

  function pop () {
    return parent
  }

  return { define, has, lookup, pop }
}

module.exports = createScope
