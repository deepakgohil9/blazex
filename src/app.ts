// importing external modules
import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import compression from 'compression'

// importing database
import mongoConnect from './databases/mongo.database'

// importing configs
import config from './configs/config'
import logger from './configs/logger'

// importing middlewares
import { successHandler, failureHandler } from './middlewares/morgan.middleware'
import mongoSantize from './middlewares/mongo-santize.middleware'
import healthcheck from './middlewares/healthcheck.handler'
import notFound from './middlewares/not-found.handler'
import errorHandler from './middlewares/error.handler'

const app = express()

if (config.env === 'development') {
	app.use(successHandler)
	app.use(failureHandler)
}

// sets security HTTP headers
app.use(helmet())

// parse cookies
app.use(cookieParser())

// parse json and urlencoded data from the request body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// sanitize request data to prevent NoSQL injection attacks
app.use(mongoSantize)

// enable CORS - Cross Origin Resource Sharing
app.use(cors({ origin: config.corsOrigin }))
app.options('*', cors())

// gzip compression
app.use(compression())

// healthcheck endpoint
app.get('/', healthcheck)


/* Routes Go Here */


// 404 handler
app.use(notFound)

// error handler
app.use(errorHandler)


// start the server
app.listen(config.port, () => {
	logger.verbose(`Environment: ${config.env}`)
	mongoConnect()
		.then(() => logger.verbose('Connected to MongoDB!'))
		.then(() => logger.verbose(`Server listening on port: ${config.port.toString()} \n\n`))
		.catch((error: unknown) => {
			logger.error('Error occurred while instantiating the app!' + (error as Error).message)
			process.exit(1)
		})
})
