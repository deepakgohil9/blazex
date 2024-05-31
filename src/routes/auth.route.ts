import express from 'express'
import validate from '../middlewares/validate.middleware'
import * as controller from '../controllers/auth.controller'
import * as schema from '../schemas/auth.schema'
import * as commonSchema from '../schemas/common.schema'

const router = express.Router()

router.post('/signup', validate(schema.authSchema), controller.register)
router.post('/signin', validate(schema.authSchema), controller.signin)
router.get('/google', validate(commonSchema.emptySchema), controller.googleSignIn)
router.get('/google/callback', validate(schema.googleCallbackSchema), controller.googleCallback)
router.get('/issue-access-token', validate(commonSchema.emptySchema), controller.issueAccessToken)

export default router
