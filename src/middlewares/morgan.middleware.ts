import morgan from 'morgan'
import config from '../configs/config'
import logger from '../configs/logger'

const format = config.env === 'development' ? 'dev' : 'combined'

export default morgan(format, {
  stream: { write: (message) => logger.http(message.trim()) }
})
