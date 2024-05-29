import express from 'express'
import validate from '../middlewares/validate.middleware'
import * as controller from '../controllers/auth.controller'
import * as schema from '../schemas/auth.schema'

const router = express.Router()

router.post('/signup', validate(schema.authSchema), controller.register)
router.post('/signin', validate(schema.authSchema), controller.signin)
router.get('/issue-access-token', validate(schema.issueAccessTokenSchema), controller.issueAccessToken)

export default router
