const chalk = require('chalk')

exports.formatErrorContext = function formatErrorContext (input, line, col, len) {
  const lineIdx = line - 1
  const lines = input.split('\n')
  const errorMsg = []
  const gutterWidth = String(line).length + 2
  const gutterEmpty = (new Array(gutterWidth)).fill(' ').join('') + chalk.cyan('│') + ' '
  if (lines[lineIdx - 1] !== undefined) { errorMsg.push(gutterEmpty + lines[lineIdx - 1]) }
  errorMsg.push(` ${chalk.gray(line)} ${chalk.cyan('│')} ${lines[lineIdx]}`)
  const leadingSpace = (new Array(col - 1)).fill(' ').join('')
  const underline = (new Array(Math.min(lines[lineIdx].length - leadingSpace.length, len))).fill('^').join('')
  errorMsg.push(`${gutterEmpty}${leadingSpace}${chalk.red(underline)}`)
  if (lines[lineIdx + 1] !== undefined) { errorMsg.push(gutterEmpty + lines[lineIdx + 1]) }
  return errorMsg.join('\n')
}
