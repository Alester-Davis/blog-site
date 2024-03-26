import express from "express"
import { protect } from "../controllers/auth.controller.js"
import { getUsers } from "../controllers/user.controller.js"
const Router = express.Router()

Router.get('/get-user',protect,getUsers)

export default Router