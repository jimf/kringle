const { formatErrorContext } = require('./error')

const RESERVED_WORDS = [
  'assert',
  'break',
  'case',
  'elif',
  'else',
  'fn',
  'for',
  'if',
  'in',
  'notin',
  'return',
  'then'
].reduce((acc, word) => {
  acc[word] = true
  return acc
}, {})

function Token (type, lexeme, value, line, column, indent) {
  this.type = type
  this.lexeme = lexeme
  this.value = value
  this.line = line
  this.column = column
  this.indent = indent
}

const isDigit = c => c >= '0' && c <= '9'
const isOctal = c => c >= '0' && c <= '7'
const isHex = c => isDigit(c) || (c >= 'A' && c <= 'F') || (c >= 'a' && c <= 'f')
const isUpper = c => c >= 'A' && c <= 'Z'
const isLower = c => c >= 'a' && c <= 'z'
const isAlpha = c => isUpper(c) || isLower(c)
const isAlphaNumeric = c => isDigit(c) || isAlpha(c)

const NUM_INTEGER = 1
const NUM_ZERO = 2
const NUM_WITH_DEC_BEGIN = 4
const NUM_WITH_DEC = 8
const NUM_BEGIN_WITH_EXP = 16
const NUM_BEGIN_WITH_SIGNED_EXP = 32
const NUM_WITH_EXP = 64
const NUM_BEGIN_HEX = 128
const NUM_HEX = 256
const NUM_DONE = 512

const parseNumber = (state, c) => {
  switch (state) {
    case NUM_INTEGER:
      switch (true) {
        case isDigit(c): return NUM_INTEGER
        case c === '.': return NUM_WITH_DEC_BEGIN
        case c === 'e' || c === 'E': return NUM_BEGIN_WITH_EXP
        default: return NUM_DONE
      }

    case NUM_WITH_DEC_BEGIN:
      switch (true) {
        case isDigit(c): return NUM_WITH_DEC
        default: return NUM_DONE
      }

    case NUM_WITH_DEC:
      switch (true) {
        case isDigit(c): return NUM_WITH_DEC
        case c === 'e' || c === 'E': return NUM_BEGIN_WITH_EXP
        default: return NUM_DONE
      }

    case NUM_BEGIN_WITH_EXP:
      switch (true) {
        case isDigit(c): return NUM_WITH_EXP
        case c === '-' || c === '+': return NUM_BEGIN_WITH_SIGNED_EXP
        default: return NUM_DONE
      }

    case NUM_ZERO:
      switch (true) {
        case c === 'x' || c === 'X': return NUM_BEGIN_HEX
        case c === '.': return NUM_WITH_DEC_BEGIN
        case isDigit(c): return NUM_INTEGER
        default: return NUM_DONE
      }

    case NUM_BEGIN_HEX:
    case NUM_HEX:
      return isHex(c) ? NUM_HEX : NUM_DONE

    case NUM_BEGIN_WITH_SIGNED_EXP:
    case NUM_WITH_EXP:
      return isDigit(c) ? NUM_WITH_EXP : NUM_DONE

    default: return NUM_DONE
  }
}

const STR_BEGIN = 1
const STR_BEGIN_ESC = 2
const STR_BEGIN_OCT_0 = 4
const STR_BEGIN_OCT_1 = 8
const STR_BEGIN_HEX_0 = 16
const STR_BEGIN_HEX_1 = 32
const STR_STRING = 64

const parseString = (delim, state, c, str, tmp) => {
  switch (state) {
    case STR_BEGIN:
      if (c === delim) return [STR_STRING, str]
      if (c === '\\') return [STR_BEGIN_ESC, str]
      return [STR_BEGIN, str + c]

    case STR_BEGIN_ESC:
      if (c === 'n') return [STR_BEGIN, str + '\n']
      if (c === 'r') return [STR_BEGIN, str + '\r']
      if (c === 't') return [STR_BEGIN, str + '\t']
      if (c === "'") return [STR_BEGIN, str + "'"]
      if (c === '"') return [STR_BEGIN, str + '"']
      if (c === '\\') return [STR_BEGIN, str + '\\']
      if (c === 'x') return [STR_BEGIN_HEX_0, str]
      if (isOctal(c)) return [STR_BEGIN_OCT_0, str, c]
      return [STR_BEGIN, str + c]

    case STR_BEGIN_OCT_0:
      if (isOctal(c)) return [STR_BEGIN_OCT_1, str, tmp + c]
      return [STR_BEGIN, str + c]

    case STR_BEGIN_OCT_1:
      if (isOctal(c)) return [STR_BEGIN, str + String.fromCharCode(parseInt(tmp + c, 8))]
      return [STR_BEGIN, str + String.fromCharCode(parseInt(tmp, 8)) + c]

    case STR_BEGIN_HEX_0:
      if (isHex(c)) return [STR_BEGIN_HEX_1, str, c]
      return [STR_BEGIN, str + c]

    case STR_BEGIN_HEX_1:
      if (isHex(c)) return [STR_BEGIN, str + String.fromCharCode(parseInt(tmp + c, 16))]
      return [STR_BEGIN, str + String.fromCharCode(parseInt(tmp, 16)) + c]
  }
}

function Lexer (input) {
  let start = 0
  let current = 0
  let line = 1
  let col = 1
  let peek = input.charAt(0)
  let indent = 0

  function isAtEnd () {
    return current >= input.length
  }

  function carriageReturn () {
    line += 1
    col = 1
  }

  function read () {
    current += 1
    col += 1
    peek = input.charAt(current)
    return input.charAt(current - 1)
  }

  function kringleScanError () {
    const token = createToken('Invalid')
    const errorContext = formatErrorContext(input, token.line, token.column, token.lexeme.length)
    throw new Error(`Syntax error: Invalid or unexpected token "${token.lexeme}" at line ${token.line}, column ${token.column}

${errorContext}
`)
  }

  function match (expected) {
    if (isAtEnd() || peek !== expected) {
      return false
    }
    read()
    return true
  }

  function skipToEol () {
    while (!isAtEnd() && peek !== '\n') {
      read()
    }
  }

  function createToken (type, createValue) {
    const lexeme = input.substring(start, current)
    const value = createValue ? createValue(lexeme) : null
    return new Token(type, lexeme, value, line, col - lexeme.length, indent)
  }

  function scanSpaces () {
    indent = 0
    while (match(' ')) {
      indent += 1
    }
  }

  function scanIdentifier () {
    while (isAlphaNumeric(peek)) {
      read()
    }
    const token = createToken('Identifier')
    if (Object.prototype.hasOwnProperty.call(RESERVED_WORDS, token.lexeme)) {
      token.type = 'ReservedWord'
    } else if (token.lexeme === 'true') {
      token.type = 'Boolean'
      token.value = true
    } else if (token.lexeme === 'false') {
      token.type = 'Boolean'
      token.value = false
    } else if (token.lexeme === 'null') {
      token.type = 'Null'
    }
    return token
  }

  function scanNumber (first) {
    let prevState = null
    let state = first === '.' ? NUM_WITH_DEC : NUM_INTEGER
    if (first === '0') { state = NUM_ZERO }
    while (true) {
      prevState = state
      state = parseNumber(state, peek)
      if (state === NUM_DONE) {
        break
      }
      read()
    }
    if (prevState === NUM_INTEGER || prevState === NUM_ZERO) {
      return createToken('Integer', t => parseInt(t, 10))
    } else if (prevState === NUM_WITH_DEC || prevState === NUM_WITH_EXP) {
      return createToken('Real', parseFloat)
    } else if (prevState === NUM_HEX) {
      return createToken('Integer', t => parseInt(t, 16))
    } else if (prevState === NUM_WITH_DEC_BEGIN) {
      current -= 1
      col -= 1
      peek = input.charAt(current)
      return createToken('Integer', t => parseInt(t, 10))
    }
    kringleScanError()
  }

  // function skipMultilineWhitespace () {
  //   const s = start
  //   const c = col
  //   const curr = current
  //   read()
  //   skipWhitespace()
  //   if (peek !== '\n') {
  //     start = s
  //     col = c
  //     current = curr
  //     return
  //   }
  //   do {
  //     skipWhitespace()
  //   } while (match('\n'))
  // }

  function scanString (delim) {
    let state = STR_BEGIN
    let value = ''
    let tmp = null
    while (!isAtEnd() && state !== STR_STRING) {
      const ch = read()
      if (ch === '\n') { carriageReturn() }
      const next = parseString(delim, state, ch, value, tmp)
      state = next[0]
      value = next[1]
      tmp = next[2]
    }
    if (state === STR_STRING) {
      return createToken('String', () => value)
    }
    kringleScanError()
  }

  function scanRawString () {
    let value = ''
    while (!isAtEnd() && peek !== '\n' && peek !== "'") {
      value += read()
    }
    if (!match("'")) {
      kringleScanError()
    }
    return createToken('String', () => value)
  }

  function scanMultilineString () {
    // TODO: handle whitespace
    const startLine = line
    const startCol = col - 3
    const token = scanString('"')
    if (!(match('"') && match('"'))) {
      kringleScanError()
    }
    while (match('"')) {
      token.value += '"'
    }
    const closeQuotes = createToken('')
    token.line = startLine
    token.column = startCol
    token.lexeme += closeQuotes.lexeme
    if (token.value.startsWith('\n') && token.value.endsWith('\n')) {
      token.value = token.value.slice(1, -1)
    }
    return token
  }

  function nextToken () {
    scanSpaces()
    if (isAtEnd()) { return null }
    start = current
    const ch = read()
    switch (ch) {
      case '\n': {
        carriageReturn()
        return nextToken()
      }

      case '(': return createToken('LParen')
      case ')': return createToken('RParen')
      case '{': return createToken('LBrace')
      case '}': return createToken('RBrace')
      case '[': return createToken('LBracket')
      case ']': return createToken('RBracket')
      case ',': return createToken('Comma')
      case ':': return createToken('Colon')
      case '?': return createToken(match('=') ? 'QuestionEq' : 'Question')
      case '%': return createToken('Mod')
      case '+': return createToken(match('=') ? 'PlusEq' : 'Plus')
      case '-': return createToken(match('=') ? 'MinusEq' : 'Minus')
      case '*': return createToken(match('=') ? 'StarEq' : 'Star')
      case '/': return createToken(match('=') ? 'SlashEq' : 'Slash')
      case '\\': return createToken('Backslash')
      case "'": return scanString("'")
      case '"': return match('"') && match('"') ? scanMultilineString() : kringleScanError()
      case '!': return createToken(match('=') ? 'BangEq' : 'Bang')
      case '=': return createToken(match('=') ? 'EqEq' : 'Eq')
      case '&': return createToken(match('&') ? 'AmpAmp' : 'Amp')
      case '^': return createToken(match('=') ? 'CaretEq' : 'Caret')
      case 'Ø': return createToken('Theta')
      case 'r': return match("'") ? scanRawString() : scanIdentifier()
      case '~': return createToken('Tilde')

      case '>':
        if (match('=')) { return createToken('GreaterEq') }
        if (match('>')) { return createToken(match('>') ? 'GreaterGreaterGreater' : 'GreaterGreater') }
        return createToken('Greater')

      case '<':
        if (match('=')) { return createToken('LessEq') }
        if (match('<')) { return createToken(match('<') ? 'LessLessLess' : 'LessLess') }
        return createToken('Less')

      case '.':
        if (match('.')) { return createToken('DotDot') }
        return isDigit(peek) ? scanNumber(ch) : createToken('Dot')

      case '|':
        if (match('|')) { return createToken('PipePipe') }
        return createToken(match('>') ? 'PipeGreater' : 'Pipe')

      case '#':
        skipToEol()
        return nextToken()

      default:
        if (isAlpha(ch)) {
          return scanIdentifier()
        } else if (isDigit(ch)) {
          return scanNumber(ch)
        }
        kringleScanError()
    }
  }

  return { nextToken }
}

module.exports = function tokenize (input) {
  const lexer = Lexer(input)
  const tokens = []
  let token = lexer.nextToken()
  while (token !== null) {
    tokens.push(token)
    token = lexer.nextToken()
  }
  return tokens
}
