import mongoSantize from 'express-mongo-sanitize'

import { ValidationError } from '../utils/error'

const santize = mongoSantize({
  onSanitize: (data) => {
    throw new ValidationError({
      title: 'Illegal Request',
      detail: `Illegal request detected. Please do not use reserved characters in the request. Key: ${data.key}`,
    })
  }
})

export default santize
