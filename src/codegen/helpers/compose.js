exports.requires = []
exports.definition = `
const $compose = (f, g) => x => f(g(x))`
