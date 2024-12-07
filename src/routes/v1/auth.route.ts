import express from 'express'

import validate from '../../middlewares/validate.middleware'
import { authTypes, commonTypes } from '../../validations'
import { authController } from '../../controllers'


const router = express.Router()

router.post('/signup', validate(authTypes.signUp), authController.signUp)
router.post('/signin', validate(authTypes.signIn), authController.signIn)
router.get('/google', validate(commonTypes.empty), authController.googleSignIn)
router.get('/google/callback', validate(authTypes.googleCallback), authController.googleCallback)
router.get('/refresh-token', validate(commonTypes.empty), authController.refreshToken)
export default router
