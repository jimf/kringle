module.exports = `
const $crypto = require('crypto')
let md5 = s => $crypto.createHash('md5').update(s).digest('hex')`
