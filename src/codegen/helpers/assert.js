module.exports = `
const $assert = (cond, msg) => {
  if (!cond) {
    throw new Error('Assertion error' + (msg ? ': ' + msg : ''))
  }
}`
