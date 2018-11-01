exports.requires = []

exports.definition = `
let captures = p => s => {
  const pat = new RegExp(p)
  const matches = s.match(pat)
  return matches ? matches.slice(1) : []
}`
