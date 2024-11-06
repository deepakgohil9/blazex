import _ from 'lodash'
import { UserDoc, User } from '../models'
import * as errors from '../utils/error.util'

export const login = async (email: string, password: string): Promise<Omit<UserDoc, 'password'>> => {
  const user = await User.findOne({ email })

  if (!user || !(await user.comparePassword(password))) {
    throw new errors.Unauthorized({
      title: 'Invalid credentials',
      detail: 'The email address or password you have entered is incorrect. Please try again.'
    })
  }

  return _.omit(user.toObject<UserDoc>(), 'password')
}
