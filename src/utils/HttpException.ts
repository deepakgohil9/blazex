export const httpErrors = {
	BAD_REQUEST: {
		status: 400,
		message: 'Bad Request'
	},
	UNAUTHORIZED: {
		status: 401,
		message: 'Unauthorized'
	},
	FORBIDDEN: {
		status: 403,
		message: 'Forbidden'
	},
	NOT_FOUND: {
		status: 404,
		message: 'Not Found'
	},
	TOO_MANY_REQUESTS: {
		status: 429,
		message: 'Too Many Requests'
	},
	INTERNAL_SERVER_ERROR: {
		status: 500,
		message: 'Internal Server Error'
	},
	NOT_IMPLEMENTED: {
		status: 501,
		message: 'Not Implemented'
	}
}

interface HttpError {
	status: number
	message: string
}

export class HttpException extends Error {
	public status: number
	public message: string
	public data?: string
	constructor (httpError: HttpError, data?: string) {
		super(httpError.message)
		this.status = httpError.status
		this.message = httpError.message
		this.data = data
	}
}
