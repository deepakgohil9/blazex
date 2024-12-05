import _ from 'lodash'
import { IUser, UserDoc, User } from '../models'
import * as errors from '../utils/error'

export const createUser = async (data: Omit<IUser, 'signInMethod'>): Promise<Omit<UserDoc, 'password'>> => {
  const existingUser = await User.findOne({ email: data.email })

  if (existingUser) {
    throw new errors.BadRequest({
      title: 'Email already in use',
      detail: 'The email address you have entered is already associated with another account. Please sign in or use a different email address.'
    })
  }

  const user = new User({ ...data, signInMethod: 'email' })
  await user.save()

  return _.omit(user.toObject<UserDoc>(), 'password')
}

export const findOrCreateUser = async (data: IUser): Promise<Omit<UserDoc, 'password'>> => {
  const existing = await User.findOne({ email: data.email })

  if (existing) {
    return _.omit(existing.toObject<UserDoc>(), 'password')
  }

  const user = new User({ ...data, signInMethod: 'google' })
  await user.save()

  return _.omit(user.toObject<UserDoc>(), 'password')
}
