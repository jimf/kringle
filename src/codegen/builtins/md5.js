exports.requires = ['nodejs/crypto']
exports.definition = `
let md5 = s => $crypto.createHash('md5').update(s).digest('hex')`
