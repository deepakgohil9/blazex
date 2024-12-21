import errors from '../utils/error'
import { User, UserDoc, IUser } from '../models'

/* Type definitions */


/* Service functions */

/**
 * Create a new user if not exists with the provided email and return the user.
 *
 * @param data - User data to create a new user
 * @returns User document
 */
export const createIfNotExists = async (data: Pick<IUser, 'email' | 'name' | 'image'>): Promise<UserDoc> => {
  // Find an existing user with the same email
  const user = await User.findOne(
    { email: data.email },
    {},
    { lean: true }
  )

  // If user was found, return the user
  if (user) {
    return user
  }

  // Create a new user with the email and return the user
  const newUser = new User({ emailVerified: false, ...data })
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
  const user = await User.findById(userId, {}, { lean: true })

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
  const user = await User.findOne({ email }, {}, { lean: true })

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
 *  Update the user with the provided userId and return the updated user.
 *
 * @param userId - User id
 * @param updateData - Updated user data
 * @returns Updated user document
 * @throws {NotFoundError} - If user was not found with the provided userId
 */
export const updateUser = async (userId: UserDoc['_id'], updateData: Omit<IUser, 'email' | 'emailVerified'>): Promise<UserDoc> => {
  // Find the user with the userId and update the user
  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, lean: true }
  )

  // If user was not found, throw an error
  if (!user) {
    throw new errors.NotFound({
      title: 'User not found',
      detail: 'User not found with the provided user id.'
    })
  }

  return user
}
