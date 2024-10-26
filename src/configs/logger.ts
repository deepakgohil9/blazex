import winston from 'winston'

import config from './config'

const logger = winston.createLogger({
	level: config.env === 'development' ? 'debug' : 'info',
	format: winston.format.combine(
		config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
		winston.format.timestamp(),
		winston.format.ms(),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.cli()
	),
	transports: [
		new winston.transports.Console({
			stderrLevels: ['error']
		})
	]
})

export default logger
