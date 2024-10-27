import mongoose, { ObjectId } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser {
	email: string
	password: string
	signInMethod: 'email' | 'google'
}

export interface UserDoc extends IUser, mongoose.Document<ObjectId> {
	createdAt: Date
	updatedAt: Date
	comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<UserDoc>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function (this: UserDoc) { return this.signInMethod === 'email' } },
  signInMethod: { type: String, required: true, enum: ['email', 'google'] },
}, { timestamps: true })

userSchema.pre<UserDoc>('save', async function (this: UserDoc, next: mongoose.CallbackWithoutResultAndOptionalError) {
  if (this.signInMethod !== 'email' || !this.isModified('password')) {
    next()
    return
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = async function (this: UserDoc, password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password)
}

export const User = mongoose.model<UserDoc>('User', userSchema)
