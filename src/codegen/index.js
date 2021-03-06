const { builtins, isBuiltin } = require('./builtins')
const data = require('./data')
const helpers = require('./helpers')
const Scope = require('../scope')
const tsort = require('./tsort')

const lib = { builtins, data, helpers }

const astTraverse = (v, node, parent = null, parentKey = null) => {
  if (v[node.type]) {
    v[node.type](node, parent, parentKey)
  }
  Object.keys(node).forEach((key) => {
    const val = node[key]
    if (val !== null) {
      if (Array.isArray(val)) {
        val.forEach((child, idx) => {
          astTraverse(v, child, val, idx)
        })
      } else if (typeof val === 'object') {
        astTraverse(v, val, node, key)
      }
    }
  })
  if (v[`${node.type}Exit`]) {
    v[`${node.type}Exit`](node, parent, parentKey)
  }
}

function getDependencies (ast) {
  const deps = { source: new Set([]) }
  const appendDepsFor = dep => {
    if (deps[dep]) { return }
    const [category, name] = dep.split('/')
    if (category === 'nodejs') { return }
    const def = lib[category][name]
    deps[dep] = def.requires
    lib[category][name].requires.forEach(appendDepsFor)
  }
  const addDep = dep => {
    if (!deps.source.has(dep)) {
      deps.source.add(dep)
      appendDepsFor(dep)
    }
  }
  astTraverse({
    AssertStmt () { addDep('helpers/$assert') },
    BinaryOp (node) {
      if (node.operator.type === 'EqEq') {
        addDep('helpers/$isEqual')
      } else if (node.operator.type === 'Eq' && node.left.type === 'Subscript' && node.left.value === null) {
        addDep('helpers/$push')
      } else if (node.operator.type !== 'EqEq' && node.operator.type.endsWith('Eq') && node.left.type === 'Subscript') {
        addDep('helpers/$setSubscript')
      } else if (node.operator.type === 'GreaterGreater') {
        addDep('helpers/$pipe')
      } else if (node.operator.type === 'LessLess') {
        addDep('helpers/$compose')
      } else if (node.operator.type === 'ReservedWord' && node.operator.lexeme === 'notin') {
        addDep('helpers/$contains')
      }
    },
    Dict () { addDep('data/Dict') },
    Identifier (node) {
      if (isBuiltin(node.lexeme)) {
        addDep(`builtins/${node.lexeme}`)
      }
    },
    Mod () { addDep('helpers/$opMod') },
    Set () { addDep('data/Set') },
    Star () { addDep('helpers/$opStar') },
    Subscript (node) {
      if (node.value !== null) {
        addDep('helpers/$subscript')
      }
    },
    Tuple () {
      addDep('data/Tuple')
    }
  }, ast)
  return tsort(deps, true)
    .filter(dep => dep !== 'source')
    .map((dep) => {
      const [category, name] = dep.split('/')
      if (category === 'nodejs') { return `const $${name} = require('${name}')` }
      return lib[category][name].definition.trim()
    })
    .join('\n')
}

function annotateVarDecls (ast) {
  let scope = Scope()
  const checkNode = node => {
    const varName = node.lexeme
    if (!scope.lookup(varName)) {
      scope.define(varName, true)
      node.isInitialization = true
    }
  }
  astTraverse({
    FnStmt () { scope = Scope(scope) },
    FnStmtExit () { scope.pop() },
    ForStmt () { scope = Scope(scope) },
    ForStmtExit () { scope.pop() },
    // IfStmt () { scope = Scope(scope) },
    // IfStmtExit () { scope.pop() },
    BinaryOp (node) {
      if (node.operator.type === 'Eq') {
        if (node.left.type === 'Identifier') {
          checkNode(node.left)
        } else if (node.left.type === 'Tuple') {
          node.left.items.forEach((expr) => {
            checkNode(expr)
          })
        }
      }
    }
  }, ast)
  return ast
}

function transformRanges (ast) {
  astTraverse({
    BinaryOpExit (node, parent, key) {
      if (node.operator.type === 'DotDot' && parent && parent.type !== 'Subscript') {
        parent[key] = {
          type: 'Call',
          callee: { type: 'Identifier', lexeme: 'range' },
          arguments: [node.left, node.right, { type: 'Integer', value: 1 }]
        }
      }
    }
  }, ast)
  return ast
}

let _uid = 0
const uid = () => {
  _uid += 1
  return _uid
}

function codegen (node) {
  switch (node.type) {
    case 'Program': {
      return `#!/usr/bin/env node
${getDependencies(node)}
${node.body.map(codegen).join('\n')}
`
    }
    case 'Call': return `${codegen(node.callee)}(${node.arguments.map(codegen).join(')(')})`
    case 'AssertStmt': return `$assert(${codegen(node.condition)}${node.message ? ', ' + codegen(node.message) : ''})`
    case 'FnStmt':
      // TODO: Handle cases where particular function names will conflict with JS reserved
      // words and throw runtime errors.
      const body = node.body.map(codegen)
      if (node.body[body.length - 1].type.endsWith(['Stmt'])) {
        body.push('return null')
      } else {
        body[body.length - 1] = `return ${body[body.length - 1]}`
      }
      return `
const ${codegen(node.name)} = (${node.params.map(codegen).join(') => (')}) => {
  ${body.join(';\n  ')}
};
`
    case 'ForStmt': {
      const init = node.variables.length === 1
        ? codegen(node.variables[0])
        : `[${node.variables.map(codegen).join(', ')}]`
      return `
for (let ${init} of ${node.items.map(codegen).join(', ')}) {
  ${node.body.map(codegen).join(';\n  ')}
}`
    }
    case 'WhileStmt': {
      return `
while (${codegen(node.condition)}) {
  ${node.body.map(codegen).join(';\n  ')}
}
`
    }
    case 'IfStmt': {
      const condition = `if (${codegen(node.condition)}) {\n`
      const ifBody = node.ifBody.map(e => `  ${codegen(e)}`).join('\n')
      let closeIf = '\n}\n'
      let elseBody = ''
      if (node.elseBody) {
        closeIf = '\n} else {\n'
        elseBody = node.elseBody.map(e => `  ${codegen(e)}`).join('\n')
        elseBody += '\n}\n'
      }
      return condition + ifBody + closeIf + elseBody
    }
    case 'CaseStmt': {
      const patterns = node.patterns.map(p => `[]`)
      return `$match(${codegen(node.callee)}, [\n${patterns.join(',\n')}\n])`
    }
    case 'ReturnStmt': return `return ${codegen(node.expression)}`
    case 'BreakStmt': return 'break'

    case 'ExprList': return node.expressions.map(codegen).join(', ')
    case 'FnExpr': return `(${node.params.map(codegen).join(', ')}) => ${codegen(node.body)}`
    case 'IfExpr': return `(${codegen(node.condition)} ? ${codegen(node.expr1)} : ${codegen(node.expr2)})`
    case 'Subscript': {
      return `$subscript(${codegen(node.callee)}, ${codegen(node.value)})`
    }

    case 'BinaryOp': {
      if (node.operator.type === 'Mod') {
        return `$opMod(${codegen(node.left)}, ${codegen(node.right)})`
      } else if (node.operator.type === 'Star') {
        return `$opStar(${codegen(node.left)}, ${codegen(node.right)})`
      } else if (node.operator.type === 'EqEq') {
        return `$isEqual(${codegen(node.left)}, ${codegen(node.right)})`
      } else if (node.operator.type === 'GreaterGreater') {
        return `$pipe(${codegen(node.left)}, ${codegen(node.right)})`
      } else if (node.operator.type === 'LessLess') {
        return `$compose(${codegen(node.left)}, ${codegen(node.right)})`
      } else if (node.operator.type === 'DotDot') {
        return `${codegen(node.left)}, ${codegen(node.right)}`
      } else if (node.operator.type === 'QuestionEq') {
        const left = codegen(node.left)
        return `if (${left} == null) { ${left} = ${codegen(node.right)} }`
      } else if (node.left.type === 'ExprList') {
        const id = uid()
        const initial = `let $val${id} = ${codegen(node.right)};\n`
        return initial + node.left.expressions.map((expr, idx) => {
          if (expr.lexeme === '_') { return '' }
          return `${codegen(expr)} ${codegen(node.operator)} $val${id}[${idx}]`
        }).join('\n')
      } else if (node.left.type === 'Tuple') {
        const id = uid()
        const initial = `let $val${id} = [...${codegen(node.right)}];\n`
        return initial + node.left.items.map((expr, idx) => {
          if (expr.lexeme === '_') { return '' }
          return `${codegen(expr)} ${codegen(node.operator)} $val${id}[${idx}]`
        }).join('\n')
      } else if (node.operator.type === 'Eq' && node.left.type === 'Subscript' && node.left.value === null) {
        return `$push(${codegen(node.left.callee)}, ${codegen(node.right)})`
      } else if (node.operator.type === 'Eq' && node.left.type === 'Subscript') {
        return `$setSubscript(${codegen(node.right)}, ${codegen(node.left).slice(11, -1)})`
      } else if (node.operator.type.endsWith('Eq') && node.left.type === 'Subscript') {
        const id = uid()
        return `let $tmp${id} = ${codegen(node.left)}
$tmp${id} ${codegen(node.operator)} ${codegen(node.right)}
$setSubscript($tmp${id}, ${codegen(node.left).slice(11, -1)})
`
      } else if (node.operator.type === 'ReservedWord' && node.operator.lexeme === 'notin') {
        return `!$contains(${codegen(node.right)}, ${codegen(node.left)})`
      }
      return `${codegen(node.left)} ${codegen(node.operator)} ${codegen(node.right)}`
    }

    case 'UnaryOp':
      if (node.operator.type === 'Question') {
        return `(${codegen(node.callee)} != null)`
      }
      return codegen(node.operator) + codegen(node.callee)

    // Operators
    case 'Amp':
    case 'AmpAmp':
    case 'Bang':
    case 'Caret':
    case 'CaretEq':
    case 'Eq':
    case 'Greater':
    case 'GreaterEq':
    case 'Less':
    case 'LessEq':
    case 'Minus':
    case 'Pipe':
    case 'PipePipe':
    case 'Plus':
    case 'PlusEq':
    case 'Slash':
    case 'Tilde':
      return node.lexeme

    case 'GreaterGreaterGreater': return '>>'
    case 'LessLessLess': return '<<'

    // Data structures
    case 'Dict': return `$KringleDict([${node.pairs.map(codegen).join(', ')}])`
    case 'List': return `[${node.items.map(codegen).join(', ')}]`
    case 'Set': return `$KringleSet(${node.members.map(codegen).join(', ')})`
    case 'Tuple': return `$KringleTuple([${node.items.map(codegen).join(', ')}])`

    case 'Pair': return `[${codegen(node.key)}, ${codegen(node.value)}]`

    // Primaries
    case 'Identifier': return node.isInitialization ? `let ${node.lexeme}` : node.lexeme
    case 'Integer': return String(node.value)
    case 'Real': return String(node.value)
    case 'String': return JSON.stringify(node.value)
    case 'Boolean': return node.lexeme
    case 'Null': return node.lexeme
    default: throw new Error(`Code gen not implemented for ${node && node.type}`)
  }
}

module.exports = (ast) => codegen(annotateVarDecls(transformRanges(ast)))
