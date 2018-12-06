#!/usr/bin/env node
const program = require('commander')
const { join } = require('path')
const { _getShallowFilesInDir } = require('./utils/common')
const { _init: initLogger } = require('./logger')

module.exports = async function (commandPath, logPath = __dirname) {
  initLogger(logPath)

  let files = await _getShallowFilesInDir(commandPath)
  let commands = files.filter(file => file.startsWith('command-'))
  let options = []

  commands.forEach(commandFile => {
    let { title, description, action, alias, option } = require(join(commandPath, commandFile))
    program
      .command(title)
      .alias(alias || '')
      .description(description)
      .action(action)

    let hasNewOption = option && options.reduce((acc, curr) => curr[0] !== option[0], true)
    if (hasNewOption) options.push(option)
  })

  options.forEach(option => program.option(...option))

  program.parse(process.argv)
}
