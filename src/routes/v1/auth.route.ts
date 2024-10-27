import express from 'express'

import validate from '../../middlewares/validate.middleware'
import { authTypes } from '../../validations'
import { authController } from '../../controllers'


const router = express.Router()

router.post('/register', validate(authTypes.register), authController.register)

export default router
