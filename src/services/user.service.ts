import { IUser, UserLeanDoc, UserDoc, User } from '../models'
import * as errors from '../utils/error.util'

export const createUser = async (data: Omit<IUser, 'signInMethod'>): Promise<Omit<UserLeanDoc, 'password'>> => {
  const existingUser = await User.findOne({ email: data.email })
  if (existingUser) {
    throw new errors.BadRequest({
      title: 'Email already in use',
      detail: 'The email address you have entered is already associated with another account. Please sign in or use a different email address.'
    })
  }

  const user = new User({ ...data, signInMethod: 'email' })
  await user.save()
  const { password: _, ...userData } = user.toObject<UserLeanDoc>()
  return userData
}

export const getUserByEmail = async (email: string): Promise<UserDoc> => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new errors.NotFound({
      title: 'User not found',
      detail: 'The user with the specified email address does not exist.'
    })
  }

  return user
}
