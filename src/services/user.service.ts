import User, { type UserInput, type UserDocument } from '../models/user.model'
import { type FilterQuery, type QueryOptions, type ProjectionType } from 'mongoose'

export const create = async (userData: UserInput): Promise<UserDocument> => {
	const user = new User(userData)
	await user.save()
	return user
}

export const find = async (query: FilterQuery<UserDocument>, projection: ProjectionType<UserDocument> = { password: 0 }, options: QueryOptions = { lean: true }): Promise<UserDocument[]> => {
	const users = await User.find(query, projection, options)
	return users
}

export const findOne = async (query: FilterQuery<UserDocument>, projection: ProjectionType<UserDocument> = { password: 0 }, options: QueryOptions = { lean: true }): Promise<UserDocument | null> => {
	const user = await User.findOne(query, projection, options)
	return user
}
