/* eslint-disable no-console */
import mongoose from 'mongoose'

const connect = async (): Promise<void> => {
	const MONGO_URI = process.env.MONGO_URI ?? ''
	await mongoose.connect(MONGO_URI)
	console.log('🛠️ Successfully connected to the database!')
}

export default connect
