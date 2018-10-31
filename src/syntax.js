exports.Program = (body) => ({
  type: 'Program',
  body
})

exports.ExprList = (expressions) => ({
  type: 'ExprList',
  expressions
})

exports.Tuple = (items) => ({
  type: 'Tuple',
  items
})

exports.BinaryOp = ({ operator, left, right }) => ({
  type: 'BinaryOp',
  operator,
  left,
  right
})
