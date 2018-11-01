exports.requires = []

exports.definition = `
let split = delim => s => {
  const r = new RegExp(delim, 'g')
  return s.split(r)
}`
