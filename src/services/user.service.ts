import { eq } from 'drizzle-orm'
import db from '../databases/postgres.database'
import errors from '../utils/error'
import { users, User, UserRow } from '../models'

/* Service functions */

/**
 * Create a new user if not exists with the provided email and return the user.
 *
 * @param data - User data to create a new user
 * @returns User data representing the user
 */
export const upsert = async (data: Pick<User, 'email' | 'name' | 'image'>): Promise<UserRow> => {
  // Find an existing user with the same email
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1)

  // If user was found, return the user
  if (existingUsers[0]) {
    return existingUsers[0]
  }

  // Create a new user with the email and return the user
  const newUser = await db
    .insert(users)
    .values(data)
    .returning()
  return newUser[0]
}


/**
 * Get the user with the provided userId.
 *
 * @param userId - User id
 * @returns User data representing the user
 * @throws {NotFoundError} - If user was not found with the provided userId
 */
export const getUserById = async (userId: string): Promise<UserRow> => {
  // Find the user with the userId
  const data = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  // If user was not found, throw an error
  if (!data[0]) {
    throw new errors.NotFound({
      title: 'User not found',
      detail: 'User not found with the provided user id.'
    })
  }

  return data[0]
}


/**
 * Get the user with the provided email.
 *
 * @param email - Email of the user
 * @returns User data representing the user
 * @throws {NotFoundError} - If user was not found with the provided userId
 */
export const getUserByEmail = async (email: string): Promise<UserRow> => {
  // Find the user with the userId
  const data = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  // If user was not found, throw an error
  if (!data[0]) {
    throw new errors.NotFound({
      title: 'User not found',
      detail: 'User not found with the provided user id.'
    })
  }

  return data[0]
}


/**
 *  Update the user with the provided userId and return the updated user.
 *
 * @param userId - User id
 * @param updateData - Data to update the user
 * @returns User data representing the user
 * @throws {NotFoundError} - If user was not found with the provided userId
 */
export const updateUser = async (userId: string, updateData: Omit<User, 'email' | 'emailVerified'>): Promise<UserRow> => {
  // Find the user with the userId and update the user
  const data = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning()

  // If user was not found, throw an error
  if (!data[0]) {
    throw new errors.NotFound({
      title: 'User not found',
      detail: 'User not found with the provided user id.'
    })
  }

  return data[0]
}
