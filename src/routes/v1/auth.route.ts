import express from 'express'

import validate from '../../middlewares/validate.middleware'
import { authTypes, commonTypes } from '../../validations'
import { authController } from '../../controllers'


const router = express.Router()

router.post('/register', validate(authTypes.register), authController.register)
router.post('/login', validate(authTypes.login), authController.login)
router.get('/refresh-token', validate(commonTypes.empty), authController.refreshToken)

router.get('/google', validate(commonTypes.empty), authController.googleSignIn)
router.get('/google/callback', validate(authTypes.googleCallback), authController.googleSignInCallback)

export default router
