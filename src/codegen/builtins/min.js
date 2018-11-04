exports.requires = ['helpers/$fold']
exports.definition = `
let min = xs => $fold(Math.min, xs)`
