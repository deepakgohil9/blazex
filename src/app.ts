/* eslint-disable import/first */
/* eslint-disable no-console */
import express, { type Request, type Response } from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import xss from 'xss-shield'
dotenv.config()

import connect from './databases/mongo.database'
import errorHandler from './middlewares/errorHandler.middleware'
import sanitizer from './middlewares/sanitizer.middleware'

import authRoute from './routes/auth.route'

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(helmet())
app.use(express.json())
app.use(xss.xssShield())
app.use(sanitizer)

app.use('/auth', authRoute)

app.get('/', (req: Request, res: Response): void => { res.send({ message: '🚀 Hello! I am alive!' }) })
app.use((req: Request, res: Response): void => {
	res.send({ message: '🚧 Error 404: Requested endpoint not found.' })
})
app.use(errorHandler)

app.listen(PORT, (): void => {
	connect().then(() => {
		console.log(`🚀 Server is running at http://localhost:${PORT}`)
	}).catch((error) => {
		throw new Error(`❗Error connecting to the database: ${(error as Error).message}`)
	})
})
