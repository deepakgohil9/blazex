import 'dotenv/config'
import app from './app'
import config from './configs/config'
import * as postgres from './databases/postgres.database'
import logger from './configs/logger'

// start the server
const server = app.listen(config.port, () => {
  logger.info(`⚙️ Environment: ${config.env}`)
})

/** Gracefully shutdown the server and closes all connections with databases and other services */
const exit = () => {
  server.close(() => {
    postgres.disconnect()
      .then(() => logger.info('✓ Server stopped successfully!'))
      .then(() => logger.info('✓ Postgres connection closed successfully!'))
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

// handle unhandled promise rejections
process.on('unhandledRejection', (error: unknown) => {
  logger.error('Unhandled Rejection: ' + (error as Error).message)
  exit()
})

// handle uncaught exceptions
process.on('uncaughtException', (error: unknown) => {
  logger.error('Uncaught Exception: ' + (error as Error).message)
  exit()
})
