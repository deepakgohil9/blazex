import * as errors from '../utils/error'
import { User, UserDoc } from '../models'

/* Type definitions */


/* Service functions */

/**
 * Create a new user if not exists with the provided email and return the user.
 *
 * @param email - Email of the user
 * @returns User document
 */
export const createIfNotExists = async (email: string): Promise<UserDoc> => {
  // Find an existing user with the same email
  const user = await User.findOne(
    { email },
    { email: 1, emailVerified: 1 },
    { lean: true }
  )

  // If user was found, return the user
  if (user !== null) {
    return user
  }

  // Create a new user with the email and return the user
  const newUser = new User({ email, emailVerified: false })
  await newUser.save()
  return newUser.toObject()
}


/**
 * Get the user with the provided userId.
 *
 * @param userId - User id
 * @returns User document
 * @throws {NotFoundError} - If user was not found with the provided userId
 */
export const getUserById = async (userId: UserDoc['_id']): Promise<UserDoc> => {
  // Find the user with the userId
  const user = await User.findById(userId, {} , { lean: true })

  // If user was not found, throw an error
  if (!user) {
    throw new errors.NotFound({
      title: 'User not found',
      detail: 'User not found with the provided user id.'
    })
  }

  return user
}


/**
 * Get the user with the provided email.
 *
 * @param email - Email of the user
 * @returns User document
 * @throws {NotFoundError} - If user was not found with the provided userId
 */
export const getUserByEmail = async (email: string): Promise<UserDoc> => {
  // Find the user with the userId
  const user = await User.findOne({email}, {}, { lean: true })

  // If user was not found, throw an error
  if (!user) {
    throw new errors.NotFound({
      title: 'User not found',
      detail: 'User not found with the provided user id.'
    })
  }

  return user
}

