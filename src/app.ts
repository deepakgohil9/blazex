// importing external modules
import express from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import compression from 'compression'


// importing configs
import config from './configs/config'

// importing middlewares
import morgan from './middlewares/morgan.middleware'
import mongoSantize from './middlewares/mongo-santize.middleware'
import healthcheck from './middlewares/healthcheck.handler'
import notFound from './middlewares/not-found.handler'
import errorHandler from './middlewares/error.handler'

// import routes
import v1Routes from './routes/v1'

const app = express()

app.use(morgan)

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
app.use('/v1', v1Routes)

// 404 handler
app.use(notFound)

// error handler
app.use(errorHandler)

export default app
