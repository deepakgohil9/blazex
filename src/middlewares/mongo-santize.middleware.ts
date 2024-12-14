import mongoSantize from 'express-mongo-sanitize'
import errors from '../utils/error'

/**
 * Middleware to santize request data to prevent NoSQL Injection
 *
 * @throws {ValidationError} if illegal request detected
 * */
const santize = mongoSantize({
  onSanitize: (data) => {
    throw new errors.ValidationError({
      title: 'Illegal Request',
      detail: `Illegal request detected. Please do not use reserved characters in the request. Key: ${data.key}`,
    })
  }
})

export default santize
