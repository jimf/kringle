exports.requires = ['helpers/$concat', 'helpers/$fold', 'helpers/$len']

exports.definition = `
let sum = xs => {
  if ($len(xs) === 0) { return 0 }
  return $fold($concat, xs)
}`
