import express from "express"
import { googleAuth, protect, signin, signout, signup} from "../controllers/auth.controller.js"
import { deleteUser, updateUser } from "../controllers/user.controller.js"
const router = express.Router()

router.post("/sign-up",signup)
router.post("/sign-in",signin)
router.post("/google",googleAuth)
router.get("/sign-out",signout)
router.put("/update-user/:userid",protect,updateUser)
router.delete("/delete-user/:userId",protect,deleteUser)
export default router