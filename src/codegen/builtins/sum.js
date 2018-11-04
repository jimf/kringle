exports.requires = ['helpers/$concat', 'helpers/$fold', 'helpers/$len']

exports.definition = `
let sum = xs => {
  try {
    return $fold($concat, xs)
  } catch (e) {
    if (e.message === 'Cannot fold an empty collection') {
      return 0
    }
    throw e
  }
}`
