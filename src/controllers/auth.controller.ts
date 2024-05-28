import { type Request, type Response, type NextFunction } from 'express'
import { HttpException, httpErrors } from '../utils/HttpException'
import ApiResponse from '../utils/ApiResponse'
import asyncHandler from '../utils/asyncHandler'
import { generateTokens, type JwtTokens } from '../utils/jwt.utils'

import { type AuthSchemaType } from '../schemas/auth.schema'
import * as authService from '../services/user.service'
import { type UserDocument } from '../models/user.model'

export const register = asyncHandler(async (
	req: Request<AuthSchemaType['params'], Record<string, unknown>, AuthSchemaType['body'], AuthSchemaType['query']>,
	res: Response,
	next: NextFunction) => {
	const user = await authService.create({ signin_method: 'email', ...req.body })
	const data = user.toObject<UserDocument>()
	delete data.password
	res.status(201).send(new ApiResponse<UserDocument>('User created successfully', data))
})

export const signin = asyncHandler(async (
	req: Request<AuthSchemaType['params'], Record<string, unknown>, AuthSchemaType['body'], AuthSchemaType['query']>,
	res: Response,
	next: NextFunction) => {
	const user = await authService.findOne({ email: req.body.email }, { signin_method: 1, email: 1, password: 1 }, { lean: false })

	if (user === null) {
		throw new HttpException(httpErrors.NOT_FOUND, 'User not found')
	}

	if (user.signin_method !== 'email') {
		throw new HttpException(httpErrors.BAD_REQUEST, `User signed up with ${user.signin_method}`)
	}

	const isMatch = await user.comparePassword(req.body.password)

	if (!isMatch) {
		throw new HttpException(httpErrors.UNAUTHORIZED, 'Invalid credentials')
	}

	const tokens = generateTokens({ id: user._id })
	res.status(200).send(new ApiResponse<JwtTokens>('User signed in successfully', tokens))
})
