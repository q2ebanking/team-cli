const { readdir, lstatSync } = require('fs')
const { join } = require('path')
const { logger } = require('../logger')

const _getShallowFilesInDir = (path) => {
  return new Promise((resolve, reject) => {
    readdir(path, (error, results) => {
      if (error) {
        logger.error(error)
        reject(error)
      }
      if (!results) reject(new Error('No results'))
      let files = results.filter(result => !lstatSync(join(path, result)).isDirectory())
      resolve(files)
    })
  })
}

module.exports = {
  _getShallowFilesInDir,
}
