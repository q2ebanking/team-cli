const chalk = require('chalk')
const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const { combine, timestamp, printf, colorize } = format

const logger = createLogger()

const _init = (logPath) => {
  logger.configure({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
      timestamp(),
      printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
    ),
    transports: [
      new transports.DailyRotateFile({
        filename: 'error-%DATE%.log',
        dirname: logPath,
        level: 'error',
        maxFiles: '10d',
      }),
      new transports.DailyRotateFile({
        filename: 'combined-%DATE%.log',
        dirname: logPath,
        maxFiles: '10d',
      }),
    ],
  })
  logger.add(new transports.Console({
    format: combine(
      colorize(),
      printf(info => `[${info.level}] ${info.message}`)
    ),
  }))
}

const consoleTip = (...logItems) => {
  console.log(chalk.yellow(logItems))
}

module.exports = {
  _init,
  logger,
  consoleTip,
}
