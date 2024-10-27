import mongoose from 'mongoose'

import config from '../configs/config'
import mongoOptions from '../configs/mongo'

const connect = async () => {
  await mongoose.connect(config.mongo.uri, mongoOptions)
}

const disconnect = async () => {
  await mongoose.disconnect()
}

export default { connect, disconnect }
