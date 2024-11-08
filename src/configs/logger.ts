import winston from 'winston'
import 'winston-daily-rotate-file'

import config from './config'

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'http',
  format: winston.format.combine(
    winston.format.uncolorize(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      dirname: config.logDir
    })
  ]
})

if (config.env === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }))
}

export default logger
