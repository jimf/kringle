const tokenize = require('./lexer')
const Syntax = require('./syntax')
const { formatErrorContext } = require('./error')

function exprListToTuple (node) {
  return Syntax.Tuple(node.expressions)
}

function parse (input) {
  const tokens = tokenize(input)
  const indent = []
  let pos = 0

  function indGt (tok) {
    if (indent.length === 0 || tok.indent > indent[indent.length - 1]) {
      indent.push(tok.indent)
      return true
    }
    return false
  }

  function indEq (tok) {
    return tok.indent === indent[indent.length - 1]
  }

  function ded () {
    indent.pop()
  }

  function expect (success, expected, found) {
    if (success) { return }
    const token = tokens[pos]
    const errorContext = formatErrorContext(input, token.line, token.column, token.lexeme.length)
    throw new Error(`Parse error at line ${token.line}, column ${token.column}
Expected ${expected}, but found ${found || '"' + token.lexeme + '"'}

${errorContext}
`)
  }

  function previous () {
    return tokens[pos - 1]
  }

  function peek () {
    return tokens[pos]
  }

  function isAtEnd () {
    return pos === tokens.length
  }

  function advance () {
    if (!isAtEnd()) {
      pos += 1
    }
    return previous()
  }

  function check (type, lexeme) {
    const token = peek()
    return !!token && token.type === type && (lexeme === undefined || token.lexeme === lexeme)
  }

  function match (type, lexeme) {
    if (!check(type, lexeme)) { return false }
    advance()
    return true
  }

  function primary () {
    if (match('Integer') || match('Real') || match('String') || match('Boolean') || match('Null')) {
      return previous()
    } else if (match('Identifier')) {
      return previous()
    } else if (match('LParen')) {
      // const { indent } = previous()
      if (match('RParen')) {
        return Syntax.Tuple([])
      }
      const exprs = expressionList()
      const hasComma = previous().type === 'Comma'
      expect(match('RParen'), '")"')
      return exprs.length === 1 && !hasComma ? exprs[0] : Syntax.Tuple(exprs)
    } else if (match('LBracket')) {
      const items = []
      while (!match('RBracket')) {
        items.push(expression())
        const next = peek()
        expect(match('Comma') || (next && next.type === 'RBracket'), '","')
      }
      return {
        type: 'List',
        items
      }
    } else if (match('Theta')) {
      return {
        type: 'Set',
        members: []
      }
    }

    expect(false, 'an expression or end of input')
  }

  function call () {
    let expr = primary()
    if (check('LParen') && peek().indent === 0) {
      match('LParen')
      const args = []
      if (!check('RParen')) {
        do {
          args.push((check('Comma') || check('RParen')) ? null : expression())
        } while (match('Comma'))
      }
      expect(match('RParen'), 'closing ")" after function arguments')
      return {
        type: 'Call',
        callee: expr,
        arguments: args
      }
    } else if (check('LBracket')) {
      while (match('LBracket')) {
        const value = check('RBracket') ? null : expression()
        expr = {
          type: 'Subscript',
          callee: expr,
          value
        }
        expect(match('RBracket'), 'closing "]" after subscript')
      }
    }
    return expr
  }

  function existential () {
    const expr = call()
    if (match('Question')) {
      const operator = previous()
      return {
        type: 'UnaryOp',
        operator,
        callee: expr
      }
    }
    return expr
  }

  function unary () {
    if (match('ReservedWord', 'not')) {
      return {
        type: 'NotExpression',
        expression: unary()
      }
    } else if (
      match('Plus') ||
      match('Minus') ||
      match('Bang')
    ) {
      const op = previous()
      const callee = unary()
      return {
        type: 'UnaryOp',
        operator: op,
        callee
      }
    }
    return existential()
  }

  function exponentiation () {
    const expr = unary()
    if (match('Caret')) {
      const op = previous()
      const right = exponentiation()
      return {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right
      }
    }
    return expr
  }

  function multiplication () {
    let expr = exponentiation()
    while (
      match('Star') ||
      match('Slash') ||
      match('Mod')
    ) {
      const op = previous()
      let right = exponentiation()
      if (op.type === 'Mod' && right.type === 'ExprList') {
        // NOTE: this feels wrong
        right = exprListToTuple(right)
      }
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right
      }
    }
    return expr
  }

  function addition () {
    let expr = multiplication()
    while (
      match('Plus') ||
      match('Minus')
    ) {
      const op = previous()
      const right = multiplication()
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right
      }
    }
    return expr
  }

  function concatenation () {
    let expr = addition()
    while (match('PlusPlus')) {
      const op = previous()
      const right = addition()
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right
      }
    }
    return expr
  }

  function comparison () {
    let expr = concatenation()
    while (
      match('EqEq') ||
      match('BangEq') ||
      match('Less') ||
      match('LessEq') ||
      match('GreaterEq') ||
      match('Greater')
    ) {
      const op = previous()
      const right = concatenation()
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right
      }
    }
    return expr
  }

  function conjunction () {
    let expr = comparison()
    while (match('AmpAmp')) {
      const operator = previous()
      const right = comparison()
      expr = {
        type: 'BinaryOp',
        operator,
        left: expr,
        right
      }
    }
    return expr
  }

  function disjunction () {
    let expr = conjunction()
    while (match('PipePipe')) {
      const operator = previous()
      const right = conjunction()
      expr = {
        type: 'BinaryOp',
        operator,
        left: expr,
        right
      }
    }
    return expr
  }

  function application () {
    let expr = disjunction()
    if (check('PipeGreater')) {
      while (match('PipeGreater')) {
        const expr2 = disjunction()
        expr = {
          type: 'Call',
          callee: expr2,
          arguments: [expr]
        }
      }
    }
    return expr
  }

  function range () {
    const expr = application()
    if (match('DotDot')) {
      const operator = previous()
      const right = application()
      return {
        type: 'BinaryOp',
        operator,
        left: expr,
        right
      }
    }
    return expr
  }

  function assignment () {
    let expr = range()
    if (match('PlusEq') || match('QuestionEq') || match('CaretEq')) {
      const op = previous()
      const right = range()
      return {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right
      }
    }
    while (match('Eq')) {
      const op = previous()
      let right = range()
      if (right.type === 'ExprList') {
        right = exprListToTuple(right)
      }
      expr = {
        type: 'BinaryOp',
        operator: op,
        left: expr,
        right
      }
    }
    return expr
  }

  function expression (skipSemi) {
    if (match('ReservedWord', 'if')) {
      const condition = expression()
      expect(match('ReservedWord', 'then'), 'a "then" clause')
      const expr1 = expression()
      expect(match('ReservedWord', 'else'), 'an "else" clause')
      const expr2 = expression()
      return {
        type: 'IfExpr',
        condition,
        expr1,
        expr2
      }
    }
    return assignment()
  }

  function expressionList () {
    const exprs = [range()]
    if (match('Comma')) {
      const { line } = previous()
      do {
        if (isAtEnd() || check('RParen') || check('RBracket') || check('RBrace') || peek().line > line) {
          break
        }
        exprs.push(range())
      } while (match('Comma'))
    }
    return exprs
  }

  function expressionStatement () {
    const expr = expression()
    const { line } = previous()
    expect(isAtEnd() || match('Semicolon') || peek().line > line, 'a semicolon, newline, or end of input')
    return expr
  }

  function statement () {
    if (match('ReservedWord', 'fn')) {
      expect(match('Identifier'), 'a function name')
      const name = previous()
      const params = []
      expect(match('LParen'), 'a function parameter list')
      if (!match('RParen')) {
        do {
          expect(match('Identifier'), 'a parameter name')
          params.push(previous())
        } while (match('Comma'))
        expect(match('RParen'), 'a closing ")"')
      }
      expect(match('Colon'), '":" after function parameter list')
      const body = statements()
      expect(body.length >= 1, `a function body for function "${name.name}"`)
      return {
        type: 'FnStmt',
        name,
        params,
        body
      }
    } else if (match('ReservedWord', 'for')) {
      const variables = expressionList()
      expect(match('ReservedWord', 'in'))
      const items = expressionList()
      expect(match('Colon'), '":"')
      const body = statements()
      return {
        type: 'ForStmt',
        variables,
        items,
        body
      }
    } else if (match('ReservedWord', 'if')) {
      let condition = expression()
      if (match('Colon')) {
        let ifBody = statements()
        let expr = {
          type: 'IfStmt',
          condition,
          ifBody,
          elseBody: null
        }
        let currentExpr = expr
        while (match('ReservedWord', 'elif')) {
          condition = expression()
          expect(match('Colon'), '":"')
          ifBody = statements()
          currentExpr.elseBody = [{
            type: 'IfStmt',
            condition,
            ifBody,
            elseBody: null
          }]
          currentExpr = currentExpr.elseBody[0]
        }
        if (match('ReservedWord', 'else')) {
          expect(match('Colon'), '":"')
          currentExpr.elseBody = statements()
        }
        return expr
      } else if (match('ReservedWord', 'then')) {
        const expr1 = expression()
        expect(match('ReservedWord', 'else'), 'an "else" clause')
        const expr2 = expression()
        return {
          type: 'IfExpr',
          condition,
          expr1,
          expr2
        }
      }
      expect(false, '":" or keyword "then"')
    } else if (match('ReservedWord', 'case')) {
      const callee = expression()
      expect(match('Colon'), '":"')
      const patterns = []
      indGt(peek())
      while (!isAtEnd() && indEq(peek())) {
        const pattern = expression()
        expect(match('Colon'), '":"')
        const body = expression()
        patterns.push({
          type: 'Pattern',
          pattern,
          body
        })
      }
      ded()
      return {
        type: 'CaseStmt',
        callee,
        patterns
      }
    } else if (match('ReservedWord', 'return')) {
      const expr = expression()
      // TODO: handle optional return value
      // TODO: add parse error for returns outside of fn defs
      return {
        type: 'ReturnStmt',
        expression: expr
      }
    } else if (match('ReservedWord', 'break')) {
      return { type: 'BreakStmt' }
    } else if (match('ReservedWord', 'assert')) {
      let condition = expression()
      let message = null
      if (match('Comma')) {
        message = expression()
      }
      return {
        type: 'AssertStmt',
        condition,
        message
      }
    }
    return expressionStatement()
  }

  function statements () {
    if (isAtEnd()) { return [] }
    const result = []
    indGt(peek())
    while (!isAtEnd() && indEq(peek())) {
      result.push(statement())
    }
    ded()
    return result
  }

  function program () {
    return Syntax.Program(statements())
  }

  const ast = program()
  expect(isAtEnd(), 'a procedure or end of input')
  return ast
}

module.exports = parse
