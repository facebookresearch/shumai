const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

import { dlopen } from 'bun:ffi'
import { spawn } from 'bun'

const { stdout } = spawn(["python3-config", "--prefix"])
const python_path = (await new Response(stdout).text()).trim()
const { symbols: python } = dlopen(
  `${python_path}/Python`,
  {
    _PyBool_FromLong: {}
  }
)
const nodecallspython = require('../../libpython_embed.node')
import * as sm from '../tensor'

class Interpreter {
  loadPython(dir) {
    const debug = process.env.NODECALLSPYTHON_DEBUG !== undefined
    if (debug) console.log('Loading python from ' + dir)

    let found = false
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach((file) => {
        if (file.match(/libpython3.*\.so/)) {
          try {
            const filename = path.join(dir, file)
            if (debug) console.log('Running fixlink on ' + filename)

            this.fixlink(filename)
            found = true
          } catch (e) {
            console.error(e)
          }
        }
      })
    }

    if (!found && debug) console.log('Not found')

    return found
  }

  constructor() {
    this.py = new nodecallspython.PyInterpreter()
    if (process.platform === 'linux') {
      const stdout = execSync('python3-config --configdir')
      let found = false
      if (stdout) {
        const dir = stdout.toString().trim()
        const res = this.loadPython(dir)
        if (res) found = true
      }

      if (!found) {
        const stdout = execSync('python3-config --ldflags')
        if (stdout) {
          const split = stdout.toString().trim().split(' ')
          split.forEach((s) => {
            if (s.startsWith('-L')) this.loadPython(s.substring(2))
          })
        }
      }
    }
  }

  import(filename) {
    return new Promise(
      function (resolve, reject) {
        try {
          this.py.import(filename, function (handler, error) {
            if (handler) resolve(handler)
            else reject(error)
          })
        } catch (e) {
          reject(e)
        }
      }.bind(this)
    )
  }

  importSync(filename) {
    return this.py.importSync(filename)
  }

  call(handler, func, ...args) {
    return new Promise(
      function (resolve, reject) {
        try {
          this.py.call(handler, func, ...args, function (result, error) {
            if (error) reject(error)
            else resolve(result)
          })
        } catch (e) {
          reject(e)
        }
      }.bind(this)
    )
  }

  callSync(handler, func, ...args) {
    return this.py.callSync(handler, func, ...args)
  }

  create(handler, func, ...args) {
    return new Promise(
      function (resolve, reject) {
        try {
          this.py.create(handler, func, ...args, function (result, error) {
            if (error) reject(error)
            else resolve(result)
          })
        } catch (e) {
          reject(e)
        }
      }.bind(this)
    )
  }

  createSync(handler, func, ...args) {
    return this.py.createSync(handler, func, ...args)
  }

  fixlink(filename) {
    return this.py.fixlink(filename)
  }

  exec(handler, code) {
    return new Promise(
      function (resolve, reject) {
        try {
          this.py.exec(handler, code, function (result, error) {
            if (error) reject(error)
            else resolve(result)
          })
        } catch (e) {
          reject(e)
        }
      }.bind(this)
    )
  }

  execSync(handler, code) {
    return this.py.execSync(handler, code)
  }

  eval(handler, code) {
    return new Promise(
      function (resolve, reject) {
        try {
          this.py.eval(handler, code, function (result, error) {
            if (error) reject(error)
            else resolve(result)
          })
        } catch (e) {
          reject(e)
        }
      }.bind(this)
    )
  }

  evalSync(handler, code) {
    return this.py.evalSync(handler, code)
  }

  addImportPath(path) {
    return this.py.addImportPath(path)
  }
}

const py = new Interpreter()

function py_import(file) {
  const imported_module = py.importSync(file)
  function convert(obj, callback) {
    const res = callback(obj)
    if (res) {
      return res
    }
    for (const property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (typeof obj[property] == 'object') {
          obj[property] = convert(obj[property], callback)
        }
      }
    }
    return obj
  }
  const toDLTensor = (x) =>
    convert(x, (obj) => (obj.constructor === sm.Tensor ? { dltensor: obj.toDLTensor() } : null))
  const fromDLTensor = (x) =>
    convert(x, (obj) => (obj.hasOwnProperty('dltensor') ? sm.fromDLTensor(obj.dltensor) : null))
  const handler = {
    get(target, name) {
      return (...args) => {
        args = toDLTensor(args)
        const val = py.callSync(target, name, ...args)
        return fromDLTensor(val)
      }
    }
  }
  return new Proxy(imported_module, handler)
}

export { py_import as import }
