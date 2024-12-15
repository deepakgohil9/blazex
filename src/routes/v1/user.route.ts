import express from 'express'
import validate from '../../middlewares/validate.middleware'
import auth from '../../middlewares/auth.middleware'
import { commonTypes, userTypes } from '../../validations'
import controller from '../../controllers'


const router = express.Router()

router.use(auth)
router.get('/me', validate(commonTypes.empty), controller.user.getUser)
router.put('/me', validate(userTypes.updateUser), controller.user.updateUser)

export default router
