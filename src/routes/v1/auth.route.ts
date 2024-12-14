import express from 'express'
import validate from '../../middlewares/validate.middleware'
import { authTypes, commonTypes } from '../../validations'
import controller from '../../controllers'


const router = express.Router()

router.post('/signup', validate(authTypes.signUp), controller.auth.signUp)
router.post('/signin', validate(authTypes.signIn), controller.auth.signIn)
router.get('/google', validate(commonTypes.empty), controller.auth.googleSignIn)
router.get('/google/callback', validate(authTypes.googleCallback), controller.auth.googleCallback)
router.get('/refresh-token', validate(commonTypes.empty), controller.auth.refreshToken)

export default router
