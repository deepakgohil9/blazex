import express from 'express'
import validate from '../middlewares/validate.middleware'
import * as controller from '../controllers/auth.controller'
import * as schema from '../schemas/auth.schema'

const router = express.Router()

router.post('/signup', validate(schema.AuthSchema), controller.register)
router.post('/signin', validate(schema.AuthSchema), controller.signin)

export default router
