import express from 'express'

import validate from '../../middlewares/validate.middleware'
import { authTypes, commonTypes } from '../../validations'
import { authController } from '../../controllers'


const router = express.Router()

router.post('/register', validate(authTypes.register), authController.register)
router.post('/login', validate(authTypes.login), authController.login)
router.get('/refresh-token', validate(commonTypes.empty), authController.refreshToken)

export default router
