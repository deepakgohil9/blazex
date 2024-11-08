import 'dotenv/config'
import app from './app'
import config from './configs/config'
import mongo from './databases/mongo.database'
import logger from './configs/logger'

// start the server
const server = app.listen(config.port, () => {
  logger.info(`⚙️ Environment: ${config.env}`)
  mongo.connect()
    .then(() => logger.info('📦 Connected to MongoDB!'))
    .then(() => logger.info(`🎉 Server listening on port: ${config.port.toString()}`))
    .catch((error: unknown) => {
      logger.error('Error occurred while instantiating the app!' + (error as Error).message)
      process.exit(1)
    })
})

const exit = () => {
  server.close(() => {
    mongo.disconnect()
      .then(() => logger.info('✓ Server stopped successfully!'))
      .then(() => logger.info('✓ MongoDB connection closed successfully!'))
      .then(() => process.exit(0))
      .catch((error: unknown) => {
        logger.error('Error occurred while stopping the app!' + (error as Error).message)
        process.exit(1)
      })
  })
}

// handle graceful shutdown
process.on('SIGINT', exit)
process.on('SIGTERM', exit)

// handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (error: unknown) => {
  logger.error('Unhandled Rejection: ' + (error as Error).message)
  exit()
})

process.on('uncaughtException', (error: unknown) => {
  logger.error('Uncaught Exception: ' + (error as Error).message)
  exit()
})
