exports.requires = ['helpers/$fold']
exports.definition = `
let max = xs => $fold(Math.max, xs)`
