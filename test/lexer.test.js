/* global describe, it, expect */
const tokenize = require('../src/lexer')

describe('Lexer', () => {
  it('should skip whitespace', () => {
    expect(tokenize(' ')).toEqual([])
  })

  it('should skip comments', () => {
    expect(tokenize('# this is a comment')).toEqual([])
  })

  it('should tokenize special characters', () => {
    const cases = [
      { lexeme: '(', expectedType: 'LParen' },
      { lexeme: ')', expectedType: 'RParen' },
      { lexeme: '{', expectedType: 'LBrace' },
      { lexeme: '}', expectedType: 'RBrace' },
      { lexeme: '[', expectedType: 'LBracket' },
      { lexeme: ']', expectedType: 'RBracket' },
      { lexeme: ',', expectedType: 'Comma' },
      { lexeme: ':', expectedType: 'Colon' },
      { lexeme: 'Ø', expectedType: 'Theta' }
    ]
    cases.forEach(({ lexeme, expectedType }) => {
      expect(tokenize(lexeme)).toEqual([{
        type: expectedType,
        lexeme,
        value: null,
        line: 1,
        column: 1,
        indent: 0
      }])
    })
  })

  ;[
    { lexeme: '+', expectedType: 'Plus' },
    { lexeme: '-', expectedType: 'Minus' },
    { lexeme: '*', expectedType: 'Star' },
    { lexeme: '/', expectedType: 'Slash' },
    { lexeme: '\\', expectedType: 'Backslash' },
    { lexeme: '.', expectedType: 'Dot' },
    { lexeme: '..', expectedType: 'DotDot' },
    { lexeme: '=', expectedType: 'Eq' },
    { lexeme: '==', expectedType: 'EqEq' },
    { lexeme: '|', expectedType: 'Pipe' },
    { lexeme: '||', expectedType: 'PipePipe' },
    { lexeme: '&', expectedType: 'Amp' },
    { lexeme: '&&', expectedType: 'AmpAmp' },
    { lexeme: '?', expectedType: 'Question' },
    { lexeme: '?=', expectedType: 'QuestionEq' },
    { lexeme: '%', expectedType: 'Mod' },
    { lexeme: '<', expectedType: 'Less' },
    { lexeme: '<=', expectedType: 'LessEq' },
    { lexeme: '<<', expectedType: 'LessLess' },
    { lexeme: '<<<', expectedType: 'LessLessLess' },
    { lexeme: '>', expectedType: 'Greater' },
    { lexeme: '>=', expectedType: 'GreaterEq' },
    { lexeme: '>>', expectedType: 'GreaterGreater' },
    { lexeme: '>>>', expectedType: 'GreaterGreaterGreater' },
    { lexeme: '!=', expectedType: 'BangEq' },
    { lexeme: '|>', expectedType: 'PipeGreater' },
    { lexeme: '~', expectedType: 'Tilde' },
    { lexeme: '^', expectedType: 'Caret' },
    { lexeme: '^=', expectedType: 'CaretEq' }
  ].forEach(({ lexeme, expectedType }) => {
    it(`should tokenize '${lexeme}' operator`, () => {
      expect(tokenize(lexeme)).toEqual([{
        type: expectedType,
        lexeme,
        value: null,
        line: 1,
        column: 1,
        indent: 0
      }])
    })
  })

  it('should tokenize numbers', () => {
    const cases = [
      { lexeme: '0', expectedType: 'Integer', expectedValue: 0 },
      { lexeme: '3', expectedType: 'Integer', expectedValue: 3 },
      { lexeme: '42', expectedType: 'Integer', expectedValue: 42 },
      { lexeme: '000000042', expectedType: 'Integer', expectedValue: 42 },
      { lexeme: '1234567890', expectedType: 'Integer', expectedValue: 1234567890 },
      { lexeme: '42.42', expectedType: 'Real', expectedValue: 42.42 },
      { lexeme: '.5', expectedType: 'Real', expectedValue: 0.5 },
      { lexeme: '1e3', expectedType: 'Real', expectedValue: 1e3 },
      { lexeme: '1E3', expectedType: 'Real', expectedValue: 1e3 },
      { lexeme: '1e-3', expectedType: 'Real', expectedValue: 1e-3 },
      { lexeme: '1E-3', expectedType: 'Real', expectedValue: 1e-3 },
      { lexeme: '1e+3', expectedType: 'Real', expectedValue: 1e3 },
      { lexeme: '1E+3', expectedType: 'Real', expectedValue: 1e3 },
      { lexeme: '1.5e3', expectedType: 'Real', expectedValue: 1.5e3 },
      { lexeme: '1.5E3', expectedType: 'Real', expectedValue: 1.5e3 },
      { lexeme: '1.5e-3', expectedType: 'Real', expectedValue: 1.5e-3 },
      { lexeme: '1.5E-3', expectedType: 'Real', expectedValue: 1.5e-3 },
      { lexeme: '1.5e+3', expectedType: 'Real', expectedValue: 1.5e3 },
      { lexeme: '1.5E+3', expectedType: 'Real', expectedValue: 1.5e3 },
      { lexeme: '0xFF', expectedType: 'Integer', expectedValue: 0xFF },
      { lexeme: '0xccff', expectedType: 'Integer', expectedValue: 0xccff },
      { lexeme: '0XABCDEF', expectedType: 'Integer', expectedValue: 0XABCDEF }
    ]
    cases.forEach(({ lexeme, expectedType, expectedValue }) => {
      expect(tokenize(lexeme)).toEqual([{
        type: expectedType,
        lexeme,
        value: expectedValue,
        line: 1,
        column: 1,
        indent: 0
      }])
    })
  })

  it('should tokenize ranges', () => {
    expect(tokenize('0..9')).toEqual([
      { type: 'Integer', lexeme: '0', value: 0, line: 1, column: 1, indent: 0 },
      { type: 'DotDot', lexeme: '..', value: null, line: 1, column: 2, indent: 0 },
      { type: 'Integer', lexeme: '9', value: 9, line: 1, column: 4, indent: 0 }
    ])
  })

  it('should tokenize strings', () => {
    const cases = [
      { lexeme: "'hello world'", expectedValue: 'hello world' },
      { lexeme: "'\\n\\012\\x0a'", expectedValue: '\n\n\n' },
      { lexeme: `"""\nLine one\nLine two\n\\012\n"""`, expectedValue: 'Line one\nLine two\n\\012' }
    ]
    cases.forEach(({ lexeme, expectedType, expectedValue }) => {
      expect(tokenize(lexeme)).toEqual([{
        type: 'String',
        lexeme,
        value: expectedValue,
        line: 1,
        column: 1,
        indent: 0
      }])
    })
  })

  it('should tokenize reserved words', () => {
    const reserved = [
      'assert', 'break', 'case', 'elif', 'else', 'fn', 'for', 'if', 'in', 'notin', 'return', 'then', 'while'
    ]
    reserved.forEach((word) => {
      expect(tokenize(word)).toEqual([{
        type: 'ReservedWord',
        lexeme: word,
        value: null,
        line: 1,
        column: 1,
        indent: 0
      }])
    })
  })

  it('should tokenize identifiers', () => {
    const cases = [
      { lexeme: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789' },
      { lexeme: 'fooBar' }
    ]
    cases.forEach(({ lexeme, expectedType }) => {
      expect(tokenize(lexeme)).toEqual([{
        type: 'Identifier',
        lexeme,
        value: null,
        line: 1,
        column: 1,
        indent: 0
      }])
    })
  })

  it('should tokenize multiple words', () => {
    const cases = [
      {
        input: `
# A comment
fn main:
  print(42)`.trim(),
        expected: [
          { type: 'ReservedWord', lexeme: 'fn', value: null, line: 2, column: 1, indent: 0 },
          { type: 'Identifier', lexeme: 'main', value: null, line: 2, column: 4, indent: 1 },
          { type: 'Colon', lexeme: ':', value: null, line: 2, column: 8, indent: 0 },
          { type: 'Identifier', lexeme: 'print', value: null, line: 3, column: 3, indent: 2 },
          { type: 'LParen', lexeme: '(', value: null, line: 3, column: 8, indent: 0 },
          { type: 'Integer', lexeme: '42', value: 42, line: 3, column: 9, indent: 0 },
          { type: 'RParen', lexeme: ')', value: null, line: 3, column: 11, indent: 0 }
        ]
      }
    ]
    cases.forEach(({ input, expected }) => {
      expect(tokenize(input)).toEqual(expected)
    })
  })
})
