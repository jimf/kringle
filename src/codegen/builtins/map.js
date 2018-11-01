exports.requires = ['helpers/$map']
exports.definition = `
let map = f => xs => $map(f, xs)`
