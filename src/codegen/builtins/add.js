exports.requires = ['helpers/$concat']

exports.definition = `
let add = x => y => $concat(x, y)`
