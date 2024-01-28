import express from "express"
import { googleAuth, protect, signin, signup} from "../controllers/auth.controller.js"
import { updateUser } from "../controllers/user.controller.js"
const router = express.Router()

router.post("/sign-up",signup)
router.post("/sign-in",signin)
router.post("/google",googleAuth)
router.post("/update-user/:userid",protect,updateUser)

export default router