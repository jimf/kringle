/* global describe, test, expect */
const fs = require('fs')
const path = require('path')
const spawn = require('cross-spawn')
const parse = require('../src/parser')
const codegen = require('../src/codegen')

const examples = [
  'readme-example',
  'aoc-2015-d01',
  'aoc-2015-d02',
  'aoc-2015-d03',
  'aoc-2015-d04',
  'aoc-2015-d05',
  'aoc-2015-d06', // NOTE: requires 3-5 sec
  'aoc-2015-d07',
  'aoc-2015-d08',
  'aoc-2015-d09'
]

describe('Examples', () => {
  examples.forEach((name) => {
    test(`example "${name}"`, () => {
      const src = fs.readFileSync(path.join(__dirname, `../examples/${name}.kk`), 'utf8')
      const result = codegen(parse(src))
      const js = result.slice(result.indexOf('\n') + 1)
      const { status } = spawn.sync('node', ['-', js])
      expect(status).toBe(0)
    })
  })
})
