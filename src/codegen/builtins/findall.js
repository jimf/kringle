module.exports = `
let findall = p => s => {
  const pat = new RegExp(p, 'g')
  const matches = s.match(pat)
  return matches || []
}`
