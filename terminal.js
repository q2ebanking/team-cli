const path = require('path')
const { platform } = require('os')
const { _logger } = require('./logger')
const { spawn } = require('child_process')

const terminal = platform() === 'win32' ? 'powershell.exe' : 'bash'
const isVerbose = process.env.LOG_LEVEL === 'silly' || process.env.LOG_LEVEL === 'verbose'

const _cleanDataBuffer = dataBuffer => dataBuffer.toString('utf8').trim()

const _logBuffer = (dataBuffer, isError) => {
  let lineItem = _cleanDataBuffer(dataBuffer)
  if (lineItem.length > 0) {
    if (isError) _logger.error(lineItem)
    else if (isVerbose) _logger.verbose(lineItem)
  }
}

const run = async (script, args, cwd) => {
  return new Promise((resolve, reject) => {
    let profiler = _logger.startTimer()
    let stdio = isVerbose ? ['inherit', 'pipe', 'pipe'] : 'inherit'
    cwd = cwd || path.dirname(script)
    let spawnParams = { shell: true, stdio, cwd }

    _logger.info(`Starting \`${script}\``)
    let term = spawn(terminal, [script, args], spawnParams)

    if (isVerbose) {
      term.stdout.on('data', _logBuffer)
      term.stderr.on('data', dataBuffer => _logBuffer(dataBuffer, true))
    }
    term.on('close', code => {
      let level = code === 0 ? 'info' : 'error'
      let message = `Done with \`${script}\``
      if (code !== 0) message += ' with code ' + code
      profiler.done({ message, level })

      if (code === 0) resolve()
      else reject(code)
    })
  })
}

module.exports = run
