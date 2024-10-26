import mongoose from 'mongoose'

import config from '../configs/config'
import mongoOptions from '../configs/mongo'

const connect = async () => {
	await mongoose.connect(config.mongo.uri, mongoOptions)
}

export default connect
