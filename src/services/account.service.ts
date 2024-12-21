import argon2 from 'argon2'
import _ from 'lodash'
import errors from '../utils/error'
import { Account, IAccount } from '../models'

/* Type definitions */

type SetPasswordType = Required<Pick<IAccount, 'userId' | 'accountId' | 'password'>>
type VerifyPasswordType = Required<Pick<IAccount, 'userId' | 'password'>>
type LinkSocialType = Omit<IAccount, 'password'>
type UpdatePasswordType = Required<Pick<IAccount, 'userId' | 'password'>> & { newPassword: string }


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
  const account = await Account.findOne(
    { userId: data.userId, provider: 'password' },
    { userId: 1 },
    { lean: true }
  )

  // If account was found, throw an error as password is already set
  if (account) {
    throw new errors.BadRequest({
      title: 'Account already exists',
      detail: 'Account already exists for this user. Please sign in instead.'
    })
  }

  // Hash the password and create a new account with the hashed password
  data.password = await argon2.hash(data.password)
  const newAccount = new Account({
    provider: 'password',
    ...data
  })

  await newAccount.save()
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
  const account = await Account.findOne(
    { userId: data.userId, provider: 'password' },
    { password: 1 },
    { lean: true }
  )

  // If account was not found, throw an error
  if (!account) {
    throw new errors.BadRequest({
      title: 'Password not set',
      detail: 'Password is not set for this user. Please use social signin which you used to sign up or set a password.'
    })
  }

  // Verify the password and return the result
  return argon2.verify(account.password || '', data.password)
}


/**
 * Link a social account with the provided userId.
 *
 * @param data - Data required to link the social account
 * @returns Promise that resolves to void when the operation is complete
 */
export const linkSocial = async (data: LinkSocialType): Promise<void> => {
  // Try to find an existing account and update tokens and other fields if found
  const account = await Account.findOneAndUpdate(
    { userId: data.userId, provider: data.provider },
    _.omit(data, ['userId', 'provider']),
    { new: true }
  )

  // If account was found and updated, return
  if (account) {
    return
  }

  // If account was not found, create a new one
  const newAccount = new Account(data)
  await newAccount.save()
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
  const account = await Account.findOne({ userId: data.userId, provider: 'password' })

  // If account was not found, throw an error
  if (!account) {
    throw new errors.NotFound({
      title: 'Account not Found',
      detail: 'No password has been set for this account, Please set up a password for this account.'
    })
  }

  // Verify the password and throw an error if it is incorrect
  if (!await argon2.verify(account.password || '', data.password)) {
    throw new errors.Unauthorized({
      title: 'Invalid credentials',
      detail: 'Incorrect Password'
    })
  }

  // Hash the new password and update the account
  account.password = await argon2.hash(data.newPassword)
  await account.save()
}
