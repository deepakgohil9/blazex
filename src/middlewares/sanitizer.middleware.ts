import mongoSanitizer from 'express-mongo-sanitize'
import { HttpException, httpErrors } from '../utils/HttpException'

const sanitizer = mongoSanitizer({
	onSanitize: ({ key, req }) => {
		throw new HttpException(httpErrors.BAD_REQUEST, `🛑 Uh-oh! Potential injection detected in request ${key}! Request dropped like a mic 🎤.`)
	}
})

export default sanitizer
