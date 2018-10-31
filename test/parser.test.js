/* global describe, expect, test */
const parse = require('../src/parser')
const S = require('../src/syntax')

const Var = name => expect.objectContaining({ type: 'Identifier', lexeme: name })
const Int = value => expect.objectContaining({ type: 'Integer', value })

describe('Parser', () => {
  const testAllEqual = (cases) => {
    cases.forEach(({ input, expected }) => {
      expect(parse(input)).toEqual(expected)
    })
  }

  describe('for statements', () => {

  })

  describe('function calls', () => {

  })

  describe('tuples', () => {
    test('empty', () => {
      testAllEqual([
        {
          input: '()',
          expected: S.Program([S.Tuple([])])
        }
      ])
    })

    test('single item', () => {
      testAllEqual([
        {
          input: '(1,)',
          expected: S.Program([S.Tuple([Int(1)])])
        }
      ])
    })

    test('rhs assignment', () => {
      testAllEqual([
        // {
        //   input: 'x = 1, 2',
        //   expected: S.Program([
        //     S.BinaryOp({
        //       operator: expect.objectContaining({ type: 'Eq' }),
        //       left: Var('x'),
        //       right: S.Tuple([Int(1), Int(2)])
        //     })
        //   ])
        // },
        {
          input: 'x = (1, 2)',
          expected: S.Program([
            S.BinaryOp({
              operator: expect.objectContaining({ type: 'Eq' }),
              left: Var('x'),
              right: S.Tuple([Int(1), Int(2)])
            })
          ])
        }
      ])
    })

    test('lhs assignment', () => {
      testAllEqual([
        // TODO? Not sure about optional tuple parens
        // {
        //   input: 'x, y = 1, 2',
        //   expected: S.Program([
        //     S.BinaryOp({
        //       operator: expect.objectContaining({ type: 'Eq' }),
        //       left: S.ExprList([Var('x'), Var('y')]),
        //       right: S.Tuple([Int(1), Int(2)])
        //     })
        //   ])
        // },
        // {
        //   input: 'x, y = (1, 2)',
        //   expected: S.Program([
        //     S.BinaryOp({
        //       operator: expect.objectContaining({ type: 'Eq' }),
        //       left: S.ExprList([Var('x'), Var('y')]),
        //       right: S.Tuple([Int(1), Int(2)])
        //     })
        //   ])
        // },
        // {
        //   input: '(x, y) = 1, 2',
        //   expected: S.Program([
        //     S.BinaryOp({
        //       operator: expect.objectContaining({ type: 'Eq' }),
        //       left: S.ExprList([Var('x'), Var('y')]),
        //       right: S.Tuple([Int(1), Int(2)])
        //     })
        //   ])
        // },
        {
          input: '(x, y) = (1, 2)',
          expected: S.Program([
            S.BinaryOp({
              operator: expect.objectContaining({ type: 'Eq' }),
              left: S.ExprList([Var('x'), Var('y')]),
              right: S.Tuple([Int(1), Int(2)])
            })
          ])
        }
      ])
    })
  })
})
