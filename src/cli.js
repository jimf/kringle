const fs = require('fs')
const path = require('path')
const parseOpts = require('minimist')
const pkg = require('../package.json')
const parse = require('./parser')
const codegen = require('./codegen')

function help () {
  return `
usage: kringlec [sourcefile] [options]

Available options:
  --help, -h          This help
  --version           Print version information and exit
`.trim()
}

module.exports = (argv, options) => {
  const opts = parseOpts(argv, {
    boolean: ['help', 'version'],
    alias: {
      help: 'h'
    }
  })
  const inputFile = opts._[2]
  if (opts.version) {
    options.writeStdout(`kringlec ${pkg.version}\n`)
    return Promise.resolve()
  } else if (opts.help || !inputFile) {
    options.writeStdout(help() + '\n')
    return Promise.resolve()
  }
  return new Promise((resolve, reject) => {
    fs.readFile(inputFile, 'utf8', (err, source) => {
      if (err) {
        reject(err)
      } else {
        resolve(source)
      }
    })
  })
  .then(parse)
  .then(codegen)
  .then((js) => {
    return new Promise((resolve, reject) => {
      const dest = path.join(process.cwd(), path.basename(inputFile).replace(/\.kk/, '.js'))
      fs.writeFile(dest, js, { mode: 0o755 }, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  })
  .catch((err) => {
    console.log(err)
    options.writeStderr((err.message || err) + '\n')
    throw err
  })
}
