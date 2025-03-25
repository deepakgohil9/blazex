import argon2 from 'argon2'
import _ from 'lodash'
import { eq, and } from 'drizzle-orm'
import db from '../databases/postgres.database'
import errors from '../utils/error'
import { accounts, Account } from '../models'

/* Type definitions */

type SetPasswordType = { userId: string, accountId: string, password: string }
type VerifyPasswordType = { userId: string, password: string }
type LinkSocialType = Omit<Account, 'password'>
type UpdatePasswordType = { userId: string, password: string, newPassword: string }


/* Service functions */

/**
 * Set a password for the provided userId.
 *
 * @param data - Data required to set the password
 * @returns Promise that resolves to void when the operation is complete
 * @throws {BadRequest} - If account already has a password set
 */
export const setPassword = async (data: SetPasswordType): Promise<void> => {
  // Find an existing account with the given userId and 'password' as provider
  const accountsData = await db
    .select({
      userId: accounts.userId
    })
    .from(accounts)
    .where(
      and(
        eq(accounts.userId, data.userId),
        eq(accounts.provider, 'password')
      )
    )
    .limit(1)

  // If account was found, throw an error as password is already set
  if (accountsData[0]) {
    throw new errors.BadRequest({
      title: 'Account already exists',
      detail: 'Account already exists for this user. Please sign in instead.'
    })
  }

  // Hash the password and create a new account with the hashed password
  data.password = await argon2.hash(data.password)
  await db
    .insert(accounts)
    .values({
      provider: 'password',
      ...data
    })
}


/**
  * Verify the password for the provided userId.
  *
  * @param data - Data required to verify the password
  * @returns Promise that resolves to a boolean indicating if the password is correct
  * @throws {BadRequest} - If password is not set for the account
  */
export const verifyPassword = async (data: VerifyPasswordType): Promise<boolean> => {
  // Find an existing account with the given userId and 'password' as provider
  const accountsData = await db
    .select({
      password: accounts.password
    })
    .from(accounts)
    .where(
      and(
        eq(accounts.userId, data.userId),
        eq(accounts.provider, 'password')
      )
    )
    .limit(1)

  // If account was not found, throw an error
  if (!accountsData[0]) {
    throw new errors.BadRequest({
      title: 'Password not set',
      detail: 'Password is not set for this user. Please use social signin which you used to sign up or set a password.'
    })
  }

  // Verify the password and return the result
  return argon2.verify(accountsData[0].password || '', data.password)
}


/**
 * Link a social account with the provided userId.
 *
 * @param data - Data required to link the social account
 * @returns Promise that resolves to void when the operation is complete
 */
export const linkSocial = async (data: LinkSocialType): Promise<void> => {
  // Try to find an existing account and update tokens and other fields if found
  const accountsData = await db
    .update(accounts)
    .set(_.omit(data, ['userId', 'provider']))
    .where(
      and(
        eq(accounts.userId, data.userId),
        eq(accounts.provider, data.provider)
      )
    )
    .returning()

  // If account was found and updated, return
  if (accountsData[0]) {
    return
  }

  // If account was not found, create a new one
  // const newAccount = new Account(data)
  await db
    .insert(accounts)
    .values(data)
}


/**
 * Updates the password after verifying the current password.
 *
 * @param data - Data required to update the password
 * @returns Promise that resolves to void when the operation is complete
 * @throws {NotFound} - If password account is not found
 * @throws {Unauthorized} - If the password is incorrect
 */
export const updatePassword = async (data: UpdatePasswordType): Promise<void> => {
  // Find an existing account with the given userId and 'password' as provider
  // const account = await Account.findOne({ userId: data.userId, provider: 'password' })
  const accountsData = await db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.userId, data.userId),
        eq(accounts.provider, 'password')
      )
    )
    .limit(1)

  // If account was not found, throw an error
  if (!accountsData[0]) {
    throw new errors.NotFound({
      title: 'Account not Found',
      detail: 'No password has been set for this account, Please set up a password for this account.'
    })
  }

  // Verify the password and throw an error if it is incorrect
  if (!await argon2.verify(accountsData[0].password || '', data.password)) {
    throw new errors.Unauthorized({
      title: 'Invalid credentials',
      detail: 'Incorrect Password'
    })
  }

  // Hash the new password and update the account
  await db
    .update(accounts)
    .set({ password: await argon2.hash(data.newPassword) })
    .where(
      and(
        eq(accounts.userId, data.userId),
        eq(accounts.provider, 'password')
      )
    )
}
