import mongoose from 'mongoose'

export interface IAccount {
  userId: mongoose.Types.ObjectId
  accountId: string // provider's account id
  provider: string
  accessToken?: string
  refreshToken?: string
  accessTokenExpiresAt?: Date
  refreshTokenExpiresAt?: Date
  scope?: string
  password?: string
}

export interface AccountDoc extends IAccount {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const accountSchema = new mongoose.Schema<AccountDoc>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountId: { type: String, required: true },
  provider: { type: String, required: true },
  accessToken: { type: String },
  refreshToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  refreshTokenExpiresAt: { type: Date },
  scope: { type: String },
  password: { type: String },
}, { timestamps: true })

export const Account = mongoose.model<AccountDoc>('Account', accountSchema)
