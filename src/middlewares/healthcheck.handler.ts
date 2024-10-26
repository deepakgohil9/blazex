import type { Request, Response } from 'express'
import ApiResponse from '../utils/api-response'

const healthcheck = (req: Request, res: Response) => {
	res.send(new ApiResponse(200, 'Server is up and running smoothly! 🎉'))
}

export default healthcheck
