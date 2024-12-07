import mongoose from 'mongoose'

export interface IUser {
  name?: string
  email: string
  emailVerified: boolean
  image?: string
}

export interface UserDoc extends IUser {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<UserDoc>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, required: true, default: false },
  image: { type: String},
}, { timestamps: true })

export const User = mongoose.model<UserDoc>('User', userSchema)
