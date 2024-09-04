import express from "express"
import { protect } from "../controllers/auth.controller"
import { createWork, displayWork } from "../controllers/work.contoller"
const router = express.Router()

router.post("/createWork",protect,createWork);
router.get("/getWork",protect,displayWork);
router.put("/updateWork")