exports.requires = []
exports.definition = `
const $pipe = (f, g) => x => g(f(x))`
