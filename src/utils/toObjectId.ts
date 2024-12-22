import mongoose from 'mongoose'
import errors from './error'


/**
 * Convert string to ObjectId
 *
 * @param val - string to convert to ObjectId
 * @returns - ObjectId
 * @throws - BadRequest error if the string is not a valid ObjectId
 */
const toObjectId = (val: string): mongoose.Types.ObjectId => {
  // Check if the string is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(val)) {
    throw new errors.BadRequest({
      title: 'Invalid ObjectId',
      detail: 'Field `id` must be a valid ObjectId, please provide a valid ObjectId',
    })
  }

  // Return the converted ObjectId
  return new mongoose.Types.ObjectId(val)
}

export default toObjectId
