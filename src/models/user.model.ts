import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

export interface UserInput {
	signin_method: string
	email: string
	password?: string
}

export interface UserDocument extends UserInput, mongoose.Document {
	createdAt: Date
	updatedAt: Date
	comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema<UserDocument>({
	signin_method: {
		type: String,
		required: true,
		enum: ['email', 'google']
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: function (this: UserDocument) {
			return this.signin_method === 'email'
		}
	}
}, { timestamps: true })

userSchema.pre<UserDocument>('save', async function (this: UserDocument, next: mongoose.CallbackWithoutResultAndOptionalError) {
	if (this.password === undefined || !this.isModified('password')) {
		next()
		return
	}

	const salt = await bcryptjs.genSalt(10)
	this.password = await bcryptjs.hash(this.password, salt)
	next()
})

userSchema.methods.comparePassword = async function (this: UserDocument, password: string): Promise<boolean> {
	try {
		if (this.password === undefined) return false

		return await bcryptjs.compare(password, this.password)
	} catch (error) {
		return false
	}
}

const User = mongoose.model<UserDocument>('User', userSchema)

export default User
