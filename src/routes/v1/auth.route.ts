import express from 'express'
import validate from '../../middlewares/validate.middleware'
import auth from '../../middlewares/auth.middleware'
import { authTypes, commonTypes } from '../../validations'
import controller from '../../controllers'


const router = express.Router()

router.post('/signup', validate(authTypes.signUp), controller.auth.signUp)
router.post('/signin', validate(authTypes.signIn), controller.auth.signIn)
router.post('/social-signin/:provider', validate(authTypes.socialSignin), controller.auth.socialSignIn)
router.get('/refresh-token', validate(commonTypes.empty), controller.auth.refreshToken)

router.use(auth)

router.post('/change-password', validate(authTypes.changePassword), controller.auth.changePassword)
router.get('/sessions', validate(commonTypes.empty), controller.auth.listSessions)
router.delete('/sessions/:sessionId', validate(authTypes.signOut), controller.auth.signOut)

export default router
