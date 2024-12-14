import mongoose from 'mongoose'
import config from '../configs/config'
import mongoOptions from '../configs/mongo'

/** Connect to MongoDB database using mongoose */
const connect = async () => {
  await mongoose.connect(config.mongo.uri, mongoOptions)
}

/** Disconnect from MongoDB database */
const disconnect = async () => {
  await mongoose.disconnect()
}

export default { connect, disconnect }
